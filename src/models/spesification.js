import prisma from "@/db/prisma";

export const getSpecificationById = async (specificationId) => {
    return prisma.specification.findFirst({
        where: {
            specificationId
        }
    })
}

export const createSpecification = async (packageId, spec) => {
    return prisma.specification.create({
        data: {
            packageId,
            spec
        }
    })
}

export const editSpecification = async (specificationId, spec) => {
    return prisma.specification.update({
        where: {
            specificationId
        },
        data: {
            spec,
        },
    })
}

export const deleteSpecification = async (specificationId) => {
    return prisma.specification.delete({
        where: {
            specificationId
        },
    })
}

export const deleteManySpecification = async (packageId) => {
    return prisma.specification.deleteMany({
        where: {
            packageId
        }
    })
}

export const createManySpecification = async (specifications) => {
    return prisma.specification.createMany({
        data: specifications
    })
}