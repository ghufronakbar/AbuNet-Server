import prisma from "@/db/prisma";

export const getAllPackages = async () => {
    return prisma.package.findMany({
        orderBy: {
            price: "asc",
        },
        where: {
            isDeleted: false
        },
        include: {
            specifications: true,
            _count: true
        }
    });
}

export const getAllPackagesPopular = async () => {
    return prisma.package.findMany({
        orderBy: {
            transactions: {
                _count: 'desc'
            }
        },
        where: {
            isDeleted: false
        },
        include: {
            specifications: true,
            _count: true
        }
    });
}

export const getPackageById = async (packageId) => {
    return prisma.package.findFirst({
        where: {
            AND: [
                {
                    packageId
                },
                {
                    isDeleted: false
                }
            ]
        },
        include: {
            specifications: true,
            _count: true
        }
    });
}

export const createPackage = async (name, description, installationCost, image, price, specifications) => {
    return prisma.package.create({
        data: {
            name,
            description,
            installationCost,
            image,
            price,
            specifications: {
                createMany: {
                    data: specifications
                }
            }
        },
        include: {
            specifications: true
        }
    });
}


export const editPackage = async (packageId, name, description, installationCost, price) => {
    return prisma.package.update({
        data: {
            name,
            description,
            installationCost,
            price,
        },
        where: {
            packageId
        },
        include: {
            specifications: true
        }
    });
}

export const editImagePackage = async (packageId, image) => {
    return prisma.package.update({
        where: {
            packageId
        },
        data: {
            image
        }
    });
}

export const deletePackage = async (packageId) => {
    return prisma.package.update({
        where: {
            packageId
        },
        data: {
            isDeleted: true,
        }
    });
}

export const setActive = async (packageId, isActive) => {
    return prisma.package.update({
        where: {
            packageId
        },
        data: {
            isActive
        }
    });
}
