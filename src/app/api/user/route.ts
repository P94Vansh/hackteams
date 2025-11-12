// src/app/api/user/route.ts
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) 
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & { id: number };
    const userId = decodedToken.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        university: true,
        course: true,
        year: true,
        location: true,
        bio: true,
        github: true,
        portfolio: true,
        skills: true,
        interests: true,
      },
    });

    if (!user) 
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

    return new Response(JSON.stringify(user));
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch user info" }), { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & { id: number };
    const userId = decodedToken.id;

    const {
      bio,
      university,
      course,
      year,
      location,
      github,
      portfolio,
      skills,
      interests
    } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        bio,
        university,
        course,
        year,
        location,
        github,
        portfolio,
        skills,
        interests
      },
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword, { status: 200 });

  } catch (err: any) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { error: "Failed to update user info", details: err.message },
      { status: 500 }
    );
  }
}