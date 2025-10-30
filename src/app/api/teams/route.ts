import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    // ✅ Get JWT from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Decode and verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userId = decoded.id;

    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // ✅ Fetch all teams where user is a member
    const teamMembers = await prisma.teamMember.findMany({
      where: { userId },
      include: {
        team: {
          select: {
            id: true,
            teamName: true, // ✅ Include teamName here
            hackathon: {
              select: {
                id: true,
                hackathonName: true,
                hackathonDescription: true,
                leaderId: true,
              },
            },
          },
        },
      },
    });

    if (!teamMembers.length) {
      return NextResponse.json({ message: "No teams found" }, { status: 200 });
    }

    // ✅ Format response
    const formattedTeams = teamMembers.map((tm) => ({
      userId: tm.userId,
      teamId: tm.teamId,
      teamName: tm.team.teamName, // ✅ Added
      role: tm.role || "Member",
      hackathonId: tm.team.hackathon.id,
      hackathonName: tm.team.hackathon.hackathonName,
      hackathonDescription: tm.team.hackathon.hackathonDescription,
      leaderId: tm.team.hackathon.leaderId,
    }));

    console.log(formattedTeams);

    return NextResponse.json(formattedTeams, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching team data:", error);
    return NextResponse.json(
      { error: "Failed to fetch team data", details: error.message },
      { status: 500 }
    );
  }
}
