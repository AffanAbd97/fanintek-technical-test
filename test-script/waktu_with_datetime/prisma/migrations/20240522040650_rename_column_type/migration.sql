/*
  Warnings:

  - You are about to drop the column `presenceType` on the `Eppresence` table. All the data in the column will be lost.
  - Added the required column `type` to the `Eppresence` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Eppresence" DROP COLUMN "presenceType",
ADD COLUMN     "type" "TYPE" NOT NULL;
