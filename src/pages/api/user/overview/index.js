import oneMonthAhead from "@/helper/oneMonthAhead";
import { resClientError, resNotAllowed, resServerError, resSuccess } from "@/helper/response";
import threeDaysAhead from "@/helper/threeDaysAhead";
import userAuth from "@/middleware/userAuth";
import { getUserById } from "@/models/user";

const date = new Date();


const oneDayAfter = (date) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    return newDate;
}

async function handler(req, res) {
    const { userId } = req.decoded
    try {
        if (req.method === 'GET') {
            const user = await getUserById(userId);

            if (!user) return res.status(404).json(resNotFound());
            delete user.password;
            delete user.refreshToken;
            for (const transaction of user.transactions) {
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
            if (user.transactions.length === 0) {
                user.subscriptionStatus = "NOT_SUBSCRIBED";
            } else {

                const latestValidTransaction = user.transactions
                    .filter(t => t.status === "PAID")
                    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))[0];

                if (latestValidTransaction) {
                    const oneMonthAfterStart = oneMonthAhead(latestValidTransaction.startedAt);
                    const subscriptionEndDate = new Date(oneMonthAhead(latestValidTransaction.startedAt));
                    const maxPayDate = new Date(subscriptionEndDate);
                    maxPayDate.setDate(subscriptionEndDate.getDate() + 3);
                    if (oneMonthAfterStart < threeDaysAhead && oneMonthAfterStart >= new Date()) {
                        user.subscriptionStatus = "NEED_RENEWAL";
                    } else if (new Date() > maxPayDate) {
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

            return res.status(200).json(resSuccess("Data Overview", user));

        }
        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.log(error);
        return res.status(500).json(resServerError());
    }
}

export default userAuth(handler);
