import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

// 🟢 GET — Fetch all hackathons with full nested data
export async function GET() {
  try {
    const hackathons = await prisma.hackathon.findMany({
      include: {
        leader: true,
        applications: {
          include: {
            applicant: true,
          },
        },
        teams: {
          include: {
            leader: true,
            members: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ hackathons }, { status: 200 });
  } catch (error) {
    console.error("Error fetching hackathons:", error);
    return NextResponse.json(
      { error: "Failed to fetch hackathons" },
      { status: 500 }
    );
  }
}

// 🟡 POST — Submit application to a hackathon
export async function POST(req: Request) {
  try {
    const { hackathonId, skills, coverNote } = await req.json();

    // ✅ Validate input
    if (!hackathonId || !skills || !Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: hackathonId and skills are required." },
        { status: 400 }
      );
    }

    // ✅ Auth check via JWT
    const authHeader = req.headers.get("authorization");
    const cookieStore = await cookies();
    const token =
      cookieStore.get("token")?.value ||
      (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userId = decoded.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Check if hackathon exists
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: Number(hackathonId) },
    });

    if (!hackathon) {
      return NextResponse.json(
        { error: "Hackathon not found" },
        { status: 404 }
      );
    }

    // ✅ Prevent duplicate applications
    const existing = await prisma.application.findFirst({
      where: {
        hackathonId: Number(hackathonId),
        applicantId: userId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already applied for this hackathon." },
        { status: 400 }
      );
    }

    // ✅ Create new application
    const application = await prisma.application.create({
      data: {
        hackathonId: Number(hackathonId),
        applicantId: userId,
        applicantSkills: skills,
        coverNote,
      },
      include: {
        applicant: true,
        hackathon: true,
      },
    });

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        application,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
