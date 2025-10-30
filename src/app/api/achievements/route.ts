import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    const userId = decoded.id;

    const { name, month, year } = await req.json();

    const achievement = await prisma.achievement.create({
      data: {
        name,
        month,
        year,
        achievedById: userId,
      },
    });

    return NextResponse.json(achievement, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 });
  }
}

export async function GET(req:NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    const userId = decoded.id;

    const achievements = await prisma.achievement.findMany({ where: { achievedById: userId } });
    return NextResponse.json(achievements);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}
