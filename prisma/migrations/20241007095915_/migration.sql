-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "redirectUrlMT" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "snapTokenMT" TEXT NOT NULL DEFAULT '';
