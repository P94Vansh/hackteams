import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ correct typing for Next.js 15+
) {
  try {
    const { id } = await context.params; 
    const { status } = await req.json(); // 'accept' or 'reject'

    // 1️⃣ Find application with related hackathon + applicant
    const application = await prisma.application.findUnique({
      where: { id: Number(id) },
      include: {
        hackathon: true,
        applicant: true,
      },
    });

    if (!application) {
      return new Response(JSON.stringify({ error: "Application not found" }), {
        status: 404,
      });
    }

    // 2️⃣ Handle acceptance
    if (status === "accepted") {
      // Update application status
      await prisma.application.update({
        where: { id: Number(id) },
        data: { status: "accepted" },
      });

      // ✅ Check if a team already exists for this hackathon
      let team = await prisma.team.findUnique({
        where: { hackathonId: application.hackathonId },
      });

      // ✅ If no team exists, create one and make the leader the creator
      if (!team) {
        team = await prisma.team.create({
          data: {
            hackathonId: application.hackathonId,
            leaderId: application.hackathon.leaderId, // assuming hackathon has leaderId
            teamName: `${application.hackathon.userId} Team`,
          },
        });

        // Add leader to teamMembers
        await prisma.teamMember.create({
          data: {
            teamId: team.id,
            userId: application.hackathon.leaderId,
          },
        });
      }

      // ✅ Add the accepted applicant to the team if not already a member
      const existingMember = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId: team.id,
            userId: application.applicantId,
          },
        },
      });

      if (!existingMember) {
        await prisma.teamMember.create({
          data: {
            teamId: team.id,
            userId: application.applicantId,
          },
        });
      }

      return new Response(
        JSON.stringify({
          message: "Application accepted, team updated successfully",
          teamId: team.id,
        }),
        { status: 200 }
      );
    }

    // 3️⃣ Handle rejection
    if (status === "rejected") {
      await prisma.application.update({
        where: { id: Number(id) },
        data: { status: "rejected" },
      });

      return new Response(
        JSON.stringify({ message: "Application rejected" }),
        { status: 200 }
      );
    }

    // ❌ Invalid status
    return new Response(JSON.stringify({ error: "Invalid status value" }), {
      status: 400,
    });
  } catch (error:any) {
    console.error("Error updating application:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
