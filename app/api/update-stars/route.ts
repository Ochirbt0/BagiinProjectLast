import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
 
export async function POST(req: Request) {
  const { userId } = await auth(); 
 
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
 
  try {
    const { age, grade, nickname } = await req.json();
    const normalizedNickname = String(nickname || "").trim();
    const normalizedGrade = String(grade || "").trim();
    const parsedAge = Number(age);

    if (!normalizedNickname || !normalizedGrade || Number.isNaN(parsedAge)) {
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 },
      );
    }

    const client = await clerkClient(); 
 
    const updatedUser = await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        age: parsedAge,
        grade: normalizedGrade,
        nickname: normalizedNickname,
      },
    });

    await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        name: normalizedNickname || updatedUser.firstName || "Баатар",
        avatarUrl: updatedUser.imageUrl || null,
        score: 0,
      },
      update: {
        name: normalizedNickname || updatedUser.firstName || "Баатар",
        avatarUrl: updatedUser.imageUrl || null,
      },
    });
 
    return NextResponse.json({ metadata: updatedUser.publicMetadata });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Internal Error", detail }, { status: 500 });
  }
}
