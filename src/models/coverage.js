import prisma from "@/db/prisma";

export const getAllCoverages = async () => {
    return prisma.coverage.findMany({
        orderBy: {
            location: "asc"
        }
    });
}

export const getCoverageById = async (coverageId) => {
    return prisma.coverage.findFirst({
        where: {
            coverageId
        }
    });
}

export const createCoverage = async (location) => {
    return prisma.coverage.create({
        data: {
            location
        }
    });
}

export const editCoverage = async (coverageId, location) => {
    return prisma.coverage.update({
        where: {
            coverageId
        },
        data: {
            location
        }
    });
}

export const deleteCoverage = async (coverageId) => {
    return prisma.coverage.delete({
        where: {
            coverageId
        },
    });
}