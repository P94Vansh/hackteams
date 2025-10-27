import { prisma } from "@/lib/prisma";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { status } = await req.json(); // 'accept' or 'reject'
    // ✅ 1. Find the application with its related hackathon & applicant
    const application = await prisma.application.findUnique({
      where: { id: Number(id) },
      include: { hackathon: true, applicant: true },
    });

    if (!application) {
      return new Response(JSON.stringify({ error: "Application not found" }), {
        status: 404,
      });
    }

    // ✅ 2. Handle acceptance
    if (status === "accepted") {
      // Update application status
      await prisma.application.update({
        where: { id: Number(id) },
        data: { status: "accepted" },
      });

      // Find team for the hackathon
      const team = await prisma.team.findUnique({
        where: { hackathonId: application.hackathonId },
      });

      // If team exists, add the applicant as a member
      if (team) {
        // Avoid duplicate addition
        const alreadyMember = await prisma.teamMember.findUnique({
          where: {
            teamId_userId: {
              teamId: team.id,
              userId: application.applicantId,
            },
          },
        });

        if (!alreadyMember) {
          await prisma.teamMember.create({
            data: {
              teamId: team.id,
              userId: application.applicantId,
            },
          });
        }
      }

      return new Response(
        JSON.stringify({ message: "Application accepted & team updated" }),
        { status: 200 }
      );
    }

    // ✅ 3. Handle rejection
    if (status === "rejected") {
      await prisma.application.update({
        where: { id: Number(id) },
        data: { status: "rejected" },
      });

      return new Response(JSON.stringify({ message: "Application rejected" }), {
        status: 200,
      });
    }

    // Invalid status
    return new Response(JSON.stringify({ error: "Invalid status" }), {
      status: 400,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message }),
      { status: 500 }
    );
  }
}
