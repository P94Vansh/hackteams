-- CreateEnum
CREATE TYPE "public"."TeamStatus" AS ENUM ('active', 'submitted', 'disbanded');

-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');

-- CreateTable
CREATE TABLE "public"."Hackathon" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "hackathonName" TEXT NOT NULL,
    "hackathonDescription" TEXT NOT NULL,
    "problemStatement" TEXT NOT NULL,
    "teamSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Hackathon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Team" (
    "id" SERIAL NOT NULL,
    "hackathonId" INTEGER NOT NULL,
    "leaderId" INTEGER NOT NULL,
    "status" "public"."TeamStatus" NOT NULL DEFAULT 'active',
    "repoLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TeamMember" (
    "teamId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" TEXT,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("teamId","userId")
);

-- CreateTable
CREATE TABLE "public"."Application" (
    "id" SERIAL NOT NULL,
    "hackathonId" INTEGER NOT NULL,
    "applicantId" INTEGER NOT NULL,
    "applicantSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "coverNote" TEXT,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'pending',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_hackathonId_key" ON "public"."Team"("hackathonId");

-- AddForeignKey
ALTER TABLE "public"."Hackathon" ADD CONSTRAINT "Hackathon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "public"."Hackathon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "public"."Hackathon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
