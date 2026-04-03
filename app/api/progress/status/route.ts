import { NextResponse } from "next/server";
import { getLevelAccess } from "@/app/lib/progress-service";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const grade = parseInt(searchParams.get("grade") || "1");

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const levels = await getLevelAccess(userId, grade);
  
  return NextResponse.json(levels);
}
