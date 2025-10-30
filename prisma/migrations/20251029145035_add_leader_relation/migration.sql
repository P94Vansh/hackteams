/*
  Warnings:

  - Added the required column `leaderId` to the `Hackathon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Hackathon" ADD COLUMN     "leaderId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Hackathon" ADD CONSTRAINT "Hackathon_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
