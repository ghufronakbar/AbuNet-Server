import { resClientError, resNotAllowed, resNotFound, resServerError, resSuccess } from "@/helper/response";
import sevenDaysAgo from "@/helper/sevenDaysAgo";
import userAuth from "@/middleware/userAuth";
import { getHistoryTransaction } from "@/models/transaction";

const date = new Date();

const oneDayAfter = (date) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    return newDate;
}

async function handler(req, res) {
    const { userId } = req.decoded;

    try {
        if (req.method === 'GET') {
            const transactions = await getHistoryTransaction(userId);            
            for (const transaction of transactions) {
                if (transaction.isCancelled) {
                    transaction.status = "CANCELLED"
                } else if (transaction.isPaid) {
                    transaction.status = "PAID"
                } else if (!transaction.isPaid && date > oneDayAfter(transaction.createdAt)) {
                    transaction.status = "EXPIRED"
                } else {
                    transaction.status = "UNPAID"
                }
            }
            return res.status(200).json(resSuccess("Riwayat Transaksi", transactions));
        }

        if (req.method === 'PUT') {

        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json(resServerError());
    }
}

export default userAuth(handler);
