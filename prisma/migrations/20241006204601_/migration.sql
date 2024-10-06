/*
  Warnings:

  - Made the column `packageId` on table `Specification` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Specification" DROP CONSTRAINT "Specification_packageId_fkey";

-- AlterTable
ALTER TABLE "Specification" ALTER COLUMN "packageId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Specification" ADD CONSTRAINT "Specification_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("packageId") ON DELETE RESTRICT ON UPDATE CASCADE;
