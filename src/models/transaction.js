import prisma from "@/db/prisma";

export const getAllTransactions = async () => {
    return prisma.transaction.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            package: true,
            user: true,
        }
    });
}

export const getTransactionById = async (transactionId) => {
    return prisma.transaction.findFirst({
        where: {
            transactionId
        },
        include: {
            package: true,
            user: true,
        }
    });
}