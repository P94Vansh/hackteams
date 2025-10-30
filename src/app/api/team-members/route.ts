import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { hackathonId, userId } = await req.json();

    if (!hackathonId || !userId) {
      return NextResponse.json(
        { error: "hackathonId and userId are required" },
        { status: 400 }
      );
    }

    // ✅ Find team for the hackathon
    const team = await prisma.team.findUnique({
      where: { hackathonId: Number(hackathonId) },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found for this hackathon" },
        { status: 404 }
      );
    }

    // ✅ Check if already a member
    const existing = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: { teamId: team.id, userId: Number(userId) },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "User already in team" },
        { status: 200 }
      );
    }

    // ✅ Create new member
    const teamMember = await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: Number(userId),
      },
    });

    return NextResponse.json(
      { message: "User added to team", teamMember },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding team member:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
