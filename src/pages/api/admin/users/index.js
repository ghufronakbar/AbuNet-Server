import { resClientError, resNotAllowed, resServerError, resSuccess } from "@/helper/response";
import sevenDaysAgo from "@/helper/sevenDaysAgo";
import adminAuth from "@/middleware/adminAuth";
import { getAllUsers } from "@/models/user";
import threeDaysAhead from "@/helper/threeDaysAhead";
import oneMonthAhead from "@/helper/oneMonthAhead";

async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const users = await getAllUsers();
            for (const user of users) {
                delete user.password;
                delete user.refreshToken;
                for (const transaction of user.transactions) {
                    if (transaction.isCancelled) {
                        transaction.status = "CANCELLED";
                    } else if (transaction.isPaid) {
                        transaction.status = "PAID";
                    } else if (!transaction.isPaid && transaction.createdAt < sevenDaysAgo) {
                        transaction.status = "EXPIRED";
                    } else {
                        transaction.status = "UNPAID";
                    }
                }
                if (user.transactions.length === 0) {
                    user.subscriptionStatus = "NOT_SUBSCRIBED";
                } else {

                    const latestValidTransaction = user.transactions
                        .filter(t => t.status === "PAID")
                        .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))[0];

                    if (latestValidTransaction) {
                        const oneMonthAfterStart = oneMonthAhead(latestValidTransaction.startedAt);
                        if (oneMonthAfterStart < threeDaysAhead && oneMonthAfterStart >= new Date()) {
                            user.subscriptionStatus = "NEED_RENEWAL";
                        } else if (oneMonthAfterStart < new Date()) {
                            user.subscriptionStatus = "OVERDUE";
                        } else if (oneMonthAfterStart < new Date() && !user.isAttached) {
                            user.subscriptionStatus = "NOT_SUBSCRIBED";
                        } else {
                            user.subscriptionStatus = "SUBSCRIBED";
                        }
                    } else {
                        user.subscriptionStatus = "NOT_SUBSCRIBED";
                    }
                }
            }
            return res.status(200).json(resSuccess("Data Pengguna", users));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.log(error);
        return res.status(500).json(resServerError());
    }
}

export default adminAuth(handler);