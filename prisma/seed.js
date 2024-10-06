const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");

const seedAdmin = async () => {
    const admin = await prisma.admin.findMany();
    if (admin.length === 0) {
        console.log("Seeding admin...");
        await prisma.admin.create({
            data: {
                email: "admin@example.com",
                password: await bcrypt.hash("admin", 10),
                name: "Admin",
            }
        })
        console.log("Seeding admin success");
    } else {
        console.log("Admin already exists");
    }
}


const main = async () => {
    try {
        await prisma.$connect();
        await seedAdmin();
    } catch (error) {
        console.log(error);
    }
}

main().then(() => {
    prisma.$disconnect();
})