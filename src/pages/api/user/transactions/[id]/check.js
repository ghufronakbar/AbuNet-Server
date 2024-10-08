import { MIDTRANS_MERCHANT_NAME, MIDTRANS_SERVER_KEY, MIDTRANS_URL_API, MIDTRANS_URL_API2, MIDTRANS_URL_TRANSACTION } from "@/constant/midtrans";
import oneMonthAhead from "@/helper/oneMonthAhead";
import randomCharacter from "@/helper/randomCharacter";
import { resClientError, resNotAllowed, resNotFound, resServerError, resSuccess, resUnauthorized } from "@/helper/response";
import twentyFourHoursAfter from "@/helper/twentyHoursAfter";
import userAuth from "@/middleware/userAuth";
import { getPackageById, } from "@/models/package";
import { getTransactionById, makeTransaction, midtransTransaction, paidTransaction } from "@/models/transaction";
import { getUserById } from "@/models/user";
import axios from "axios";


const midtransCheck = async (order_id) => {
    try {
        const encodedServerKey = Buffer.from(MIDTRANS_SERVER_KEY + ":").toString('base64');

        const { data } = await axios.get(
            MIDTRANS_URL_API2 + "/v2/" + order_id + "/status",
            {
                headers: {
                    'Authorization': `Basic ${encodedServerKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return data;
    } catch (error) {
        console.log('Midtrans Error:', error);
        return new Error("MIDTRANS_ERROR")
    }
};

async function handler(req, res) {
    const { id } = req.query;
    const { userId } = req.decoded
    if (!id) return res.status(400).json(resClientError('ID harus diisi'));

    const date = new Date();

    try {
        if (req.method === 'GET') {
            const [user, transaction, mtCheck] = await Promise.all([
                getUserById(userId),
                getTransactionById(id),
                midtransCheck(id),
            ]);

            if (!transaction) {
                return res.status(404).json(resNotFound());
            }

            if (user.userId !== transaction.userId) {
                return res.status(401).json(resUnauthorized());
            }

            if (mtCheck instanceof Error) {
                return res.status(500).json(resServerError());
            }

            const { transaction_status, status_code, settlement_time } = mtCheck;
            
            let newStartSubscibtion
            
            
            if (user.transactions.length > 0) {
                const findFirstPaid = user.transactions.find(transaction => transaction.isPaid === true);                
                if (findFirstPaid) {
                    newStartSubscibtion = new Date(oneMonthAhead(findFirstPaid.startedAt));
                } else {
                    newStartSubscibtion = new Date();
                }
            }

            if (status_code && transaction_status && settlement_time && status_code === '200' && transaction_status === 'settlement') {
                console.log("hitted")
                const ts = await paidTransaction(id, newStartSubscibtion, new Date(settlement_time));
                console.log(ts)
            }

            const updatedTransaction = await getTransactionById(id);

            return res.status(200).json(resSuccess("Data Transaksi", updatedTransaction));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json(resServerError());
    }
}

export default userAuth(handler);
