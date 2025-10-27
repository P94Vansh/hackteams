import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET!;
export async function GET() {
  try {
    // get token from cookies
        const cookieStore =  await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { userId: number };
        const userId = decoded.id;
        const applications = await prisma.application.findMany({
        where: {
            hackathon: {
            userId: userId, // <- this traverses relation to Hackathon
            },
        },
        include: {
            applicant: {
            select: {
                id: true,
                name: true,
                email: true,
            },
            },
            hackathon: {
            select: {
                id: true,
                hackathonName: true,
            },
            },
        },
        });
        return NextResponse.json({success:true,message:"Fetched all details",data:applications},{status:200})
    }
    catch(e:any){
        console.log(e.message)
        return NextResponse.json({success:false,message:"Internal Server Error"},{status:500})
    }
}