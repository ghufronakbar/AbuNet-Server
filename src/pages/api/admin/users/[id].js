import { resClientError, resNotAllowed, resNotFound, resServerError, resSuccess } from "@/helper/response";
import sevenDaysAgo from "@/helper/sevenDaysAgo";
import adminAuth from "@/middleware/adminAuth";
import { getUserById, deleteUser, setAttached } from "@/models/user";
import threeDaysAhead from "@/helper/threeDaysAhead";
import oneMonthAhead from "@/helper/oneMonthAhead";
import removeCloudinary from "@/utils/cloudinary/removeCloudinary";

async function handler(req, res) {
    const { id } = req.query;
    if (!id) return res.status(400).json(resClientError("ID harus diisi"))
    try {
        if (req.method === 'GET') {
            const user = await getUserById(id);

            if (!user) return res.status(404).json(resNotFound());
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

            return res.status(200).json(resSuccess("Data Pengguna", user));
        }

        if (req.method === 'DELETE') {
            const user = await getUserById(id);
            if (!user) return res.status(404).json(resNotFound());
            if (user.isDeleted) {
                return res.status(404).json(resNotFound());
            }
            if (user.picture) {
                await removeCloudinary(user.picture, 'profile');
            }
            await deleteUser(id);
            return res.status(200).json(resSuccess("Berhasil menghapus user", user));
        }

        if (req.method === 'PATCH') {
            const user = await getUserById(id);
            if (!user) return res.status(404).json(resNotFound());
            const edited = await setAttached(id, !user.isAttached);
            return res.status(200).json(resSuccess(edited.isAttached? "Berhasil menandai terpasang" : "Berhasil menandai tidak terpasang", edited));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.log(error);
        return res.status(500).json(resServerError());
    }
}

export default adminAuth(handler);