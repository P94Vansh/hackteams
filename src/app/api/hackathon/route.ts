import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(req: Request) {
    try{
       const { hackathonName, hackathonDescription, problemStatement, teamSize } = await req.json();

       if (!hackathonName || !hackathonDescription || !problemStatement || !teamSize) {
         return NextResponse.json({ error: "All fields are required" }, { status: 400 });
       }
       console.log("Received hackathon creation request:", { hackathonName, hackathonDescription, problemStatement, teamSize });

            const cookieStore= await cookies();
            const authHeader = req.headers.get("authorization");
         const token = cookieStore.get("token")?.value  || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);
         if(!token){
            return NextResponse.json({error:"Unauthorized"}, {status:401});
         }


         const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
         const userId = decoded.id;  
            if(!userId){
                return NextResponse.json({error:"Unauthorized"}, {status:401}); 
            }
            const hackathon= await prisma.hackathon.create({
                data:{
                    userId,
                    hackathonName,
                    hackathonDescription,
                    problemStatement,
                    teamSize
                }
            }) 
            return NextResponse.json({message:"Hackathon created successfully", hackathon: hackathon}, {status:201}); 
    }
    catch(error){
        console.error("Hackathon creation error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
    
}
