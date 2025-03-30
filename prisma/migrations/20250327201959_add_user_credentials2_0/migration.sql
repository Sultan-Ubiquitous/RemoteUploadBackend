/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `UserCredential` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserCredential" ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "File";

-- DropEnum
DROP TYPE "ApprovalStatus";
