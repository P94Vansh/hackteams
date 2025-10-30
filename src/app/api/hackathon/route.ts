import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const {
      hackathonName,
      hackathonDescription,
      problemStatement,
      teamName,
      teamSize,
      techStack,
      rolesNeeded,
    } = await req.json();

    // ✅ Validate input
    if (
      !hackathonName ||
      !hackathonDescription ||
      !problemStatement ||
      !teamSize
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Parse techStack and rolesNeeded to arrays
    const techStackArray = Array.isArray(techStack)
      ? techStack
      : typeof techStack === "string"
      ? techStack.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const rolesNeededArray = Array.isArray(rolesNeeded)
      ? rolesNeeded
      : typeof rolesNeeded === "string"
      ? rolesNeeded.split(",").map((r) => r.trim()).filter(Boolean)
      : [];

    // ✅ Verify JWT token
    const cookieStore = await cookies();
    const authHeader = req.headers.get("authorization");

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

    // ✅ Create hackathon and team in one transaction
    const result = await prisma.$transaction(async (tx) => {
      const hackathon = await tx.hackathon.create({
        data: {
          userId,
          leaderId: userId, // 👈 creator is leader
          hackathonName,
          hackathonDescription,
          problemStatement,
          teamSize: Number(teamSize),
          techStack: techStackArray,
          rolesNeeded: rolesNeededArray,
        },
      });

      const team = await tx.team.create({
        data: {
          hackathonId: hackathon.id,
          teamName:teamName,
          leaderId: userId,
          status: "active",
        },
      });

      // Optionally add leader as team member
      await tx.teamMember.create({
        data: {
          teamId: team.id,
          userId: userId,
          role: "Leader",
        },
      });

      return { hackathon, team };
    });

    return NextResponse.json(
      {
        message: "Hackathon and team created successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Hackathon creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}
