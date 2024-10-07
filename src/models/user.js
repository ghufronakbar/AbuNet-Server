import prisma from "@/db/prisma";

export const getAllUsers = async () => {
    return prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            _count: true,
            transactions: {
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    package: true
                }
            }
        },
        where: {
            isDeleted: false
        }
    });
}

export const getUserById = async (userId) => {
    return prisma.user.findFirst({
        where: {
            userId,
        },
        include: {
            _count: true,
            transactions: {
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    package: true
                }
            }
        },
    });
}

export const deleteUser = async (userId) => {
    return prisma.user.update({
        where: {
            userId
        },
        data: {
            isDeleted: true
        }
    })
}