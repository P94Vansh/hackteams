import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";         
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET() {
      try {
        const hackathons= await prisma.hackathon.findMany({
            include:{
                leader:true,
                applications:true,
                team:{
                    include:{
                        members:{
                            include:{
                                user:true
                            }
                        }
                    }
                }
            },
            orderBy:{createdAt:'desc'}
        });
        return NextResponse.json({hackathons}, {status:200});
      } catch (error) {
        console.error("Error fetching hackathons:", error);
        return NextResponse.json({ error: "Failed to fetch hackathons" }, { status: 500 });
      }
}

export async function POST(req: Request) {
  try {
    const { hackathonId, skills, coverNote } = await req.json();

    // Validation
    console.log(hackathonId)
    if (!hackathonId || !skills) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    if (!Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { error: "Skills must be a non-empty array" },
        { status: 400 }
      );
    }

    // Auth
    const authHeader = req.headers.get("authorization");
    const cookieStore = await cookies();
    const token =
      cookieStore.get("token")?.value ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userId = decoded.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check hackathon
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: Number(hackathonId) },
    });
    if (!hackathon) {
      return NextResponse.json(
        { error: "Hackathon not found" },
        { status: 404 }
      );
    }

    console.log("Received application submission request:", {
      hackathonId,
      skills,
      coverNote,
      userId,
    });

    // Create application
    const application = await prisma.application.create({
      data: {
        hackathonId: Number(hackathonId),
        applicantId: userId,
        applicantSkills: skills,
        coverNote,
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