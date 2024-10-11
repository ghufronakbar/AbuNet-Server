import { MIDTRANS_MERCHANT_NAME, MIDTRANS_SERVER_KEY, MIDTRANS_URL_API, MIDTRANS_URL_TRANSACTION } from "@/constant/midtrans";
import oneMonthAhead from "@/helper/oneMonthAhead";
import randomCharacter from "@/helper/randomCharacter";
import { resClientError, resNotAllowed, resNotFound, resServerError, resSuccess } from "@/helper/response";
import twentyFourHoursAfter from "@/helper/twentyHoursAfter";
import userAuth from "@/middleware/userAuth";
import { getPackageById, } from "@/models/package";
import { makeTransaction, midtransTransaction } from "@/models/transaction";
import { getUserById } from "@/models/user";
import axios from "axios";


const midtransCheckout = async (order_id, gross_amount) => {
    try {
        const encodedServerKey = Buffer.from(MIDTRANS_SERVER_KEY + ":").toString('base64');

        const { data } = await axios.post(
            MIDTRANS_URL_API + "/snap/v1/transactions",
            {
                transaction_details: {
                    order_id,
                    gross_amount
                },
            },
            {
                headers: {
                    'Authorization': `Basic ${encodedServerKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return data;
    } catch (error) {
        console.log('Midtrans Error:', error.response?.data || error.message);
        return new Error("MIDTRANS_ERROR");
    }
};

async function handler(req, res) {
    const { id } = req.query;
    const { userId } = req.decoded
    if (!id) return res.status(400).json(resClientError('ID harus diisi'));

    const date = new Date();

    try {
        if (req.method === 'POST') {
            const [user, packages] = await Promise.all([
                getUserById(userId),
                getPackageById(id),
            ]);


            if (!packages) {
                return res.status(404).json(resNotFound());
            }


            if (user.address === null && user.phone === null) {
                return res.status(400).json(resClientError('Lengkapi profil terlebih dahulu'));
            }

            const oneDayAfter = (date) => {
                const newDate = new Date(date);
                newDate.setDate(date.getDate() + 1);
                return newDate;
            }
            

            if (
                user.transactions.length > 0 &&
                oneDayAfter(user.transactions[0].createdAt) > date &&
                user.transactions[0].createdAt <= date &&
                user.transactions[0].isPaid === false &&
                user.transactions[0].isCancelled === false
            ) {

                return res.status(400).json(resClientError('Lakukan pembayaran sebelumnya terlebih dahulu', user.transactions[0]));
            }


            let overdueFee = 0

            if (user.transactions.length > 0) {
                const findFirstPaid = user.transactions.find(transaction => transaction.isPaid === true);
                if (findFirstPaid) {
                    const subscriptionEndDate = new Date(oneMonthAhead(findFirstPaid.startedAt));
                    const minimalPayDate = new Date(subscriptionEndDate);
                    minimalPayDate.setDate(subscriptionEndDate.getDate() - 7);

                    const maxPayDate = new Date(subscriptionEndDate);
                    maxPayDate.setDate(subscriptionEndDate.getDate() + 3);

                    if (date < minimalPayDate) {
                        return res.status(400).json(resClientError('Pembayaran hanya bisa dibayarkan minimal 7 hari sebelum langganan berakhir'));
                    }

                    if (date > maxPayDate) {
                        overdueFee += packages.price * 0.1;
                    }

                }
            }

            const installationCost = user.isAttached ? 0 : packages.installationCost;
            const totalPrice = packages.price + installationCost + overdueFee;
            const isFirstInstallation = installationCost ? true : false;

            const transaction = await makeTransaction(userId, id, packages.name, totalPrice, packages.price, installationCost, overdueFee);
            const pay = await midtransCheckout(transaction.transactionId, totalPrice);

            if (pay instanceof Error) {
                return res.status(400).json(resClientError(pay.message));
            }

            const mtTrans = await midtransTransaction(transaction.transactionId, pay.token, pay.redirect_url);
            return res.status(200).json(resSuccess('Transaksi Berhasil', { isFirstInstallation, ...mtTrans }));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json(resServerError());
    }
}

export default userAuth(handler);
