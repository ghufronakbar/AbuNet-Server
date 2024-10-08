-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "installationFee" DROP DEFAULT,
ALTER COLUMN "itemPrice" DROP DEFAULT,
ALTER COLUMN "overdueFee" DROP DEFAULT;
