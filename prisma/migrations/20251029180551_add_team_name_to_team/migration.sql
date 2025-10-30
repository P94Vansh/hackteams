/*
  Warnings:

  - Added the required column `teamName` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Team" ADD COLUMN     "teamName" TEXT NOT NULL;
