import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt,{JwtPayload} from "jsonwebtoken"
export async function GET() {
  try {
    // Await the cookies object
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) 
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    // Decode token (replace this with real JWT decoding)
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
      },
    });

    if (!user) 
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

    return new Response(JSON.stringify(user));
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch user info" }), { status: 500 });
  }
}
