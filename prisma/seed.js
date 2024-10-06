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

const seedPackage = async () => {
    const packages = await prisma.package.findMany();
    if (packages.length === 0) {
        console.log("Seeding package...");
        await prisma.package.createMany({
            data: [
                {
                    name: "Basic",
                    price: 225000,
                    description: "Pilihan sempurna untuk kebutuhan sehari-hari, Paket Basic menawarkan akses internet stabil untuk browsing dan media sosial.",
                    image: "/basic.png",
                    installationCost: 50000,
                },
                {
                    name: "Standard",
                    price: 280000,
                    description: "Paket Standard memberikan kecepatan lebih tinggi untuk streaming, video call, dan pekerjaan remote, ideal untuk keluarga kecil.",
                    image: "/standard.png",
                    installationCost: 50000,
                },
                {
                    name: "Gaming",
                    price: 335000,
                    description: "Dapatkan keunggulan dalam permainan dengan Paket Gaming, yang dirancang khusus untuk gamer dengan kecepatan tinggi dan latensi rendah.",
                    image: "/gaming.png",
                    installationCost: 50000,
                },
                {
                    name: "Streaming",
                    price: 390000,
                    description: "Nikmati streaming HD tanpa buffering dengan Paket Streaming, yang menawarkan kecepatan optimal untuk pecinta film dan serial.",
                    image: "/stream.png",
                    installationCost: 50000,
                }
            ]
        })
        console.log("Seeding package success");
    } else {
        console.log("Package already exists");
    }
}

const seedSpecification = async () => {
    const specifications = await prisma.specification.findMany();
    if (specifications.length === 0) {
        console.log("Seeding specification...");
        const [basic, standard, gaming, streaming] = await Promise.all([prisma.package.findFirst({ where: { name: "Basic" } }), prisma.package.findFirst({ where: { name: "Standard" } }), prisma.package.findFirst({ where: { name: "Gaming" } }), prisma.package.findFirst({ where: { name: "Streaming" } })]);
        await prisma.specification.createMany({
            data: [
                {
                    spec: "Download Speed 10 Mbps",
                    packageId: basic.packageId,
                },
                {
                    spec: "Upload Speed 10 Mbps",
                    packageId: basic.packageId,
                },
                {
                    spec: "FUP 300 GB",
                    packageId: basic.packageId,
                },
                {
                    spec: "Download Speed 30 Mbps",
                    packageId: standard.packageId,
                },
                {
                    spec: "Upload Speed 30 Mbps",
                    packageId: standard.packageId,
                },
                {
                    spec: "FUP 500 GB",
                    packageId: standard.packageId,
                },
                {
                    spec: "AbunTV",
                    packageId: standard.packageId,
                },
                {
                    spec: "Download Speed 50 Mbps",
                    packageId: gaming.packageId,
                },
                {
                    spec: "Upload Speed 30 Mbps",
                    packageId: gaming.packageId,
                },
                {
                    spec: "FUP 1 TB",
                    packageId: gaming.packageId,
                },
                {
                    spec: "AbunTV+",
                    packageId: gaming.packageId,
                },
                {
                    spec: "AbunPhone",
                    packageId: streaming.packageId,
                },
                {
                    spec: "Download Speed 100 Mbps",
                    packageId: streaming.packageId,
                },
                {
                    spec: "Upload Speed 100 Mbps",
                    packageId: streaming.packageId,
                },
                {
                    spec: "Unlimited FUP",
                    packageId: streaming.packageId,
                },
                {
                    spec: "AbunTV+",
                    packageId: streaming.packageId,
                },
                {
                    spec: "AbunPhone",
                    packageId: streaming.packageId,
                },
                {
                    spec: "Free Streaming Setup",
                    packageId: streaming.packageId,
                }
            ]
        })
        console.log("Seeding specification success");
    } else {
        console.log("Specification already exists");
    }
}
const main = async () => {
    try {
        await prisma.$connect();
        await seedAdmin();
        await seedPackage();
        await seedSpecification();
    } catch (error) {
        console.log(error);
    }
}

main().then(() => {
    prisma.$disconnect();
})