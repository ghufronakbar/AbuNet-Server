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

const seedUser = async () => {
    const users = await prisma.user.findMany();
    if (users.length === 0) {
        console.log("Seeding user...");
        await prisma.user.createMany({
            data: [
                {
                    name: "Lans The Prodigy",
                    email: "lanstheprodigy@gmail.com",
                    password: await bcrypt.hash("12345678", 10),
                    address: "Jl. Jend. Gatot Subroto, Kec. Lawang, Kab. Malang",
                    isAttached: true,
                    phone: "082216548094",
                },
                {
                    name: "Fufufafa",
                    email: "fufufafa@gmail.com",
                    password: await bcrypt.hash("12345678", 10),
                    address: "Jl. Manggasari, Kec. Soroyudan, Kab. Temanggung",
                    isAttached: true,
                    phone: "082216548094",
                },
                {
                    name: "Asep Sukendar",
                    email: "asepsukendar@gmail.com",
                    password: await bcrypt.hash("12345678", 10),
                    address: "Homeless",
                    isAttached: false,
                    phone: "082216548094",
                }
            ]
        })
        console.log("Seeding user success");
    } else {
        console.log("User already exists");
    }
}

const seedTransaction = async () => {

    const [basic, standard, gaming, streaming, transactions, firstUser, secondUser] = await Promise.all([
        prisma.package.findFirst({ where: { name: "Basic" } }),
        prisma.package.findFirst({ where: { name: "Standard" } }),
        prisma.package.findFirst({ where: { name: "Gaming" } }),
        prisma.package.findFirst({ where: { name: "Streaming" } }),
        prisma.transaction.findMany(),
        prisma.user.findFirst({ where: { name: "Lans The Prodigy" } }),
        prisma.user.findFirst({ where: { name: "Fufufafa" } }),
    ]);

    if (transactions.length === 0) {
        await prisma.transaction.createMany({
            data: [
                {
                    userId: firstUser.userId,
                    packageId: basic.packageId,
                    totalPrice: basic.price + basic.installationCost,
                    itemPrice: basic.price,
                    installationFee: basic.installationCost,
                    overdueFee: 0,
                    packageName: basic.name,
                    isPaid: true,
                    createdAt: new Date("2024-08-20T12:12:12.000Z"),
                    updatedAt: new Date("2024-08-20T12:12:12.000Z"),
                    startedAt: new Date("2024-08-20T12:12:12.000Z"),
                    paidAt: new Date("2024-08-20T12:12:12.000Z"),
                },
                {
                    userId: firstUser.userId,
                    packageId: basic.packageId,
                    totalPrice: basic.price,
                    itemPrice: basic.price,
                    installationFee: 0,
                    overdueFee: 0,
                    packageName: basic.name,
                    isPaid: true,
                    createdAt: new Date("2024-09-16T12:12:12.000Z"),
                    updatedAt: new Date("2024-09-16T12:12:12.000Z"),
                    startedAt: new Date("2024-09-20T12:12:12.000Z"),
                    paidAt: new Date("2024-09-16T12:12:12.000Z"),
                },
                {
                    userId: firstUser.userId,
                    packageId: basic.packageId,
                    totalPrice: basic.price,
                    itemPrice: basic.price,
                    installationFee: 0,
                    overdueFee: 0,
                    packageName: basic.name,
                    isPaid: true,
                    createdAt: new Date("2024-09-14T12:12:12.000Z"),
                    updatedAt: new Date("2024-09-14T12:12:12.000Z"),
                    startedAt: new Date("2024-10-20T12:12:12.000Z"),
                    paidAt: new Date("2024-09-14T12:12:12.000Z"),
                },
                {
                    userId: secondUser.userId,
                    packageId: basic.packageId,
                    totalPrice: basic.price + basic.installationCost,
                    itemPrice: basic.price,
                    installationFee: basic.installationCost,
                    overdueFee: 0,
                    packageName: basic.name,
                    isPaid: true,
                    createdAt: new Date("2024-06-13T12:12:12.000Z"),
                    updatedAt: new Date("2024-06-13T12:12:12.000Z"),
                    startedAt: new Date("2024-06-13T12:12:12.000Z"),
                    paidAt: new Date("2024-06-13T12:12:12.000Z"),
                },
                {
                    userId: secondUser.userId,
                    packageId: standard.packageId,
                    totalPrice: standard.price,
                    itemPrice: standard.price,
                    installationFee: 0,
                    overdueFee: 0,
                    packageName: standard.name,
                    isPaid: true,
                    createdAt: new Date("2024-07-10T12:12:12.000Z"),
                    updatedAt: new Date("2024-07-10T12:12:12.000Z"),
                    startedAt: new Date("2024-07-13T12:12:12.000Z"),
                    paidAt: new Date("2024-07-10T12:12:12.000Z"),
                },
                {
                    userId: secondUser.userId,
                    packageId: gaming.packageId,
                    totalPrice: gaming.price,
                    itemPrice: gaming.price,
                    installationFee: 0,
                    overdueFee: 0,
                    packageName: gaming.name,
                    isPaid: true,
                    createdAt: new Date("2024-08-09T12:12:12.000Z"),
                    updatedAt: new Date("2024-08-09T12:12:12.000Z"),
                    startedAt: new Date("2024-08-13T12:12:12.000Z"),
                    paidAt: new Date("2024-08-09T12:12:12.000Z"),
                },
                {
                    userId: secondUser.userId,
                    packageId: streaming.packageId,
                    totalPrice: streaming.price,
                    itemPrice: streaming.price,
                    installationFee: 0,
                    overdueFee: 0,
                    packageName: streaming.name,
                    isPaid: true,
                    createdAt: new Date("2024-09-11T12:12:12.000Z"),
                    updatedAt: new Date("2024-09-11T12:12:12.000Z"),
                    startedAt: new Date("2024-09-13T12:12:12.000Z"),
                    paidAt: new Date("2024-09-08T12:12:12.000Z"),
                },
                {
                    userId: secondUser.userId,
                    packageId: streaming.packageId,
                    totalPrice: streaming.price,
                    itemPrice: streaming.price,
                    installationFee: 0,
                    overdueFee: 0,
                    packageName: streaming.name,
                    isPaid: true,
                    createdAt: new Date("2024-10-13T12:12:12.000Z"),
                    updatedAt: new Date("2024-10-13T12:12:12.000Z"),
                    startedAt: new Date("2024-10-13T12:12:12.000Z"),
                    paidAt: new Date("2024-10-13T12:12:12.000Z"),
                },
                {
                    userId: secondUser.userId,
                    packageId: streaming.packageId,
                    totalPrice: streaming.price,
                    itemPrice: streaming.price,
                    installationFee: 0,
                    overdueFee: streaming.price * 0.1,
                    packageName: streaming.name,
                    isPaid: false,
                    createdAt: new Date("2024-11-30T12:12:12.000Z"),
                    updatedAt: new Date("2024-11-30T12:12:12.000Z"),
                },
                {
                    userId: secondUser.userId,
                    packageId: streaming.packageId,
                    totalPrice: streaming.price,
                    itemPrice: streaming.price,
                    installationFee: 0,
                    overdueFee: streaming.price * 0.1,
                    packageName: streaming.name,
                    isPaid: false,
                    createdAt: new Date("2024-11-08T12:12:12.000Z"),
                    updatedAt: new Date("2024-11-08T12:12:12.000Z"),
                },
            ]
        });
        console.log("Seeding transaction...");
    } else {
        console.log("Transaction already exists");
    }
};

const seedCoverage = async () => {
    const coverage = await prisma.coverage.findMany();
    if (coverage.length === 0) {
        console.log("Seeding coverage...");
        await prisma.coverage.createMany({
            data: [
                {
                    location: "Jakarta"
                },
                {
                    location: "Bandung"
                },
                {
                    location: "Surabaya"
                },
                {
                    location: "Bali"
                },
                {
                    location: "Yogyakarta"
                },
                {
                    location: "Lombok"
                },
                {
                    location: "Lampung"
                },
                {
                    location: "Medan"
                },
                {
                    location: "Papua"
                },
                {
                    location: "Kalimantan"
                },
                {
                    location: "Sulawesi"
                },
                {
                    location: "Maluku"
                },
            ]
        });
        console.log("Seeding coverage success");
    } else {
        console.log("Coverage already exists");
    }
}



const main = async () => {
    try {
        await prisma.$connect();
        await seedAdmin();
        // await seedPackage();
        // await seedSpecification();
        // await seedUser();
        // await seedTransaction();
        await seedCoverage();
        console.log("seed")
    } catch (error) {
        console.log(error);
    }
}

main().then(() => {
    prisma.$disconnect();
})