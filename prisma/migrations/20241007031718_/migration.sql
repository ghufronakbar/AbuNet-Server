-- DropForeignKey
ALTER TABLE "Specification" DROP CONSTRAINT "Specification_packageId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_packageId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- AddForeignKey
ALTER TABLE "Specification" ADD CONSTRAINT "Specification_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("packageId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("packageId") ON DELETE CASCADE ON UPDATE CASCADE;
