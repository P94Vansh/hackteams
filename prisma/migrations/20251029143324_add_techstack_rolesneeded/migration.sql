/*
  Warnings:

  - You are about to drop the column `repoLink` on the `Team` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Hackathon" DROP CONSTRAINT "Hackathon_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Hackathon" ADD COLUMN     "rolesNeeded" TEXT[],
ADD COLUMN     "techStack" TEXT[];

-- AlterTable
ALTER TABLE "public"."Team" DROP COLUMN "repoLink";
