import { resNotAllowed, resServerError, resSuccess } from "@/helper/response";
import sevenDaysAgo from "@/helper/sevenDaysAgo";
import adminAuth from "@/middleware/adminAuth";
import { getAllTransactions } from "@/models/transaction";

async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const transactions = await getAllTransactions();
            for (const transaction of transactions) {
                if (transaction.isCancelled) {
                    transaction.status = "CANCELLED"
                } else if (transaction.isPaid) {
                    transaction.status = "PAID"
                } else if (!transaction.isPaid && transaction.createdAt < sevenDaysAgo) {
                    transaction.status = "EXPIRED"
                } else {
                    transaction.status = "UNPAID"
                }
            }
            return res.status(200).json(resSuccess("Data Transaksi", transactions));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.log(error)
        return res.status(500).json(resServerError());
    }
}

export default adminAuth(handler)