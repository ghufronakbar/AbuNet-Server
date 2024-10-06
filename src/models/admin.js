import prisma from "@/db/prisma";

export const getAdminByEmail = async (email) => {
    return prisma.admin.findFirst({
        where: {
            email
        }
    })
}

export const updateRefreshToken = async (adminId, refreshToken) => {
    return prisma.admin.update({
        where: {
            adminId
        },
        data: {
            refreshToken
        }
    })
}

export const getAdminByRefreshToken = async (refreshToken) => {
    return prisma.admin.findFirst({
        where: {
            refreshToken
        }
    })
}

export const getAdminById = async (adminId) => {
    return prisma.admin.findFirst({
        where: {
            adminId
        }
    })
}

export const editAdminName = async (adminId, name) => {
    return prisma.admin.update({
        where: {
            adminId
        },
        data: {
            name
        }
    })
}

export const editAdminPassword = async (adminId, password) => {
    return prisma.admin.update({
        where: {
            adminId
        },
        data: {
            password
        }
    })
}