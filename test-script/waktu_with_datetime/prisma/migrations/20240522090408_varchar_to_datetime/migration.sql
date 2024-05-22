/*
  Warnings:

  - Changed the type of `waktu` on the `Eppresence` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Eppresence" DROP COLUMN "waktu",
ADD COLUMN     "waktu" TIMESTAMP(3) NOT NULL;
