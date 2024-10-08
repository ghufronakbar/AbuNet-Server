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

export const makeTransaction = async (userId, packageId, packageName, totalPrice, itemPrice, installationFee, overdueFee) => {
    return prisma.transaction.create({
        data: {
            userId,
            packageId,
            packageName,
            totalPrice,
            itemPrice,
            installationFee,
            overdueFee,
        }
    });
}

export const midtransTransaction = async (transactionId, snapTokenMT, redirectUrlMT) => {
    return prisma.transaction.update({
        where: {
            transactionId
        },
        data: {
            snapTokenMT,
            redirectUrlMT,
        }
    });
}

export const paidTransaction = async (transactionId, startedAt, paidAt) => {
    return prisma.transaction.update({
        where: {
            transactionId
        },
        data: {
            isPaid: true,
            startedAt,
            paidAt    
        }
    });
}


export const getHistoryTransaction = async (userId) => {
    return prisma.transaction.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            package: true,
        }
    });
}

export const cancelTransaction = async (transactionId) => {
    return prisma.transaction.update({
        where: {
            transactionId
        },
        data: {
            isCancelled: true
        }
    });
}