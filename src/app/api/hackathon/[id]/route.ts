
import { prisma } from "@/lib/prisma";
import { NextResponse,NextRequest } from "next/server";



export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid hackathon ID" },
        { status: 400 }
      );
    }

    const hackathon = await prisma.hackathon.findUnique({
      where: { id: Number(id) },
      include: {
        leader: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!hackathon) {
      return NextResponse.json(
        { error: "Hackathon not found" },
        { status: 404 }
      );
    }

    // ✅ Match frontend structure exactly
    const response = {
      hackathonName: hackathon.hackathonName,
      leader: hackathon.leader
        ? {
            id: hackathon.leader.id,
            name: hackathon.leader.name,
          }
        : null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching hackathon details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}