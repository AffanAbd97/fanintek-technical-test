/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - Added the required column `nama` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `npp` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TYPE" AS ENUM ('IN', 'OUT');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ADD COLUMN     "nama" TEXT NOT NULL,
ADD COLUMN     "npp" INTEGER NOT NULL,
ADD COLUMN     "npp_supervisor" INTEGER;

-- CreateTable
CREATE TABLE "Eppresence" (
    "id" SERIAL NOT NULL,
    "id_users" INTEGER NOT NULL,
    "is_approve" BOOLEAN NOT NULL DEFAULT false,
    "presenceType" "TYPE" NOT NULL,
    "waktu" DATE NOT NULL,

    CONSTRAINT "Eppresence_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Eppresence" ADD CONSTRAINT "Eppresence_id_users_fkey" FOREIGN KEY ("id_users") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
