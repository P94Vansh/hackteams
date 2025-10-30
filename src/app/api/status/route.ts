import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { id: number };
    const userId = decoded.id;

    // ✅ Applications where you are the hackathon leader
    const leaderApplications = await prisma.application.findMany({
      where: {
        hackathon: { userId },
      },
      include: {
        applicant: {
          select: { id: true, name: true, email: true },
        },
        hackathon: {
          select: { id: true, hackathonName: true },
        },
      },
    });

    // ✅ Applications where you are the applicant
    const sentApplications = await prisma.application.findMany({
      where: { applicantId: userId },
      include: {
        hackathon: {
          select: {
            id: true,
            hackathonName: true,
            userId: true, // leader id
          },
        },
      },
    });

    // ✅ For each application, find the teamName of the hackathon leader
    const myApplications = await Promise.all(
      sentApplications.map(async (app) => {
        const team = await prisma.team.findFirst({
          where: {
            hackathonId: app.hackathon.id,
            leaderId: app.hackathon.userId, // the hackathon creator
          },
          select: { teamName: true },
        });
        return {
          id: app.id,
          hackathonName: app.hackathon.hackathonName,
          teamName: team?.teamName || "Unnamed Team",
          status: app.status,
        };
      })
    );
    console.log(sentApplications)
    
    return NextResponse.json(
      {
        success: true,
        message: "Fetched all details",
        leaderApplications,
        myApplications,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("Error fetching applications:", e.message);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
