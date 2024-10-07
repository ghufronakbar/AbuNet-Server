import { resClientError, resNotAllowed, resServerError, resSuccess } from "@/helper/response";
import sevenDaysAgo from "@/helper/sevenDaysAgo"; // asumsikan ini adalah variabel tanggal
import adminAuth from "@/middleware/adminAuth";
import { getAllPackages } from "@/models/package";
import { getAllTransactions } from "@/models/transaction";
import { getAllUsers } from "@/models/user";

const getLast12Months = () => {
    const months = [];
    const today = new Date();

    for (let i = 0; i < 12; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        months.push({
            year: date.getFullYear(),
            month: date.getMonth(),
            totalTransaction: 0,
            totalIncome: 0,
        });
    }

    return months.reverse();
};

async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const [transactions, users, packages] = await Promise.all([getAllTransactions(), getAllUsers(), getAllPackages()]);

            for (const transaction of transactions) {
                delete transaction.package;
                delete transaction.user;
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

            const transactionSuccess = transactions.filter(t => t.status === "PAID");
            const weeklyTransactionsSuccess = transactionSuccess.filter(t => t.createdAt > sevenDaysAgo);
            const transactionFail = transactions.filter(t => t.status === "CANCELLED" || t.status === "EXPIRED");
            const weeklyTransactionsFail = transactionFail.filter(t => t.createdAt > sevenDaysAgo);

            const totalUser = users.length;
            const weeklyUser = users.filter(u => u.createdAt > sevenDaysAgo).length;

            let totalIncome = 0;
            let weeklyIncome = 0;

            for (const transaction of transactions) {
                if (transaction.status === "PAID") {
                    totalIncome += transaction.totalPrice;
                }

                if (transaction.status === "PAID" && transaction.paidAt > sevenDaysAgo) {
                    weeklyIncome += transaction.totalPrice;
                }
            }

            const income = {
                totalIncome,
                weeklyIncome
            };

            const count = {
                allTransaction: transactions.length,
                transactionSuccess: transactionSuccess.length,
                weeklyTransactionsSuccess: weeklyTransactionsSuccess.length,
                transactionFail: transactionFail.length,
                weeklyTransactionsFail: weeklyTransactionsFail.length,
                totalUser,
                weeklyUser,
                totalPackages: packages.length
            };

            const monthlyRecords = getLast12Months();

            transactionSuccess.forEach(transaction => {
                const paidAtDate = new Date(transaction.paidAt);
                const paidYear = paidAtDate.getFullYear();
                const paidMonth = paidAtDate.getMonth();

                const record = monthlyRecords.find(m => m.year === paidYear && m.month === paidMonth);
                if (record) {
                    record.totalTransaction += 1;
                    record.totalIncome += transaction.totalPrice;
                }
            });

            for (const m of monthlyRecords) {
                m.date = `${m.year}-${m.month + 1}-01T00:00:00.000Z`;
            }

            return res.status(200).json(resSuccess("Data Overview", {
                count,
                income,
                allTransaction: transactions,
                transactionSuccess,
                transactionFail,
                weeklyTransactionsSuccess,
                weeklyTransactionsFail,
                monthlyRecords
            }));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.log(error);
        return res.status(500).json(resServerError());
    }
}

export default adminAuth(handler);
