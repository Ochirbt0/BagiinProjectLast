import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getLevelAccess } from "@/app/lib/progress-service";
import { LevelType } from "@/app/lib/types/learning";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { grade, level, topicId }: {
      grade: number; 
      level: LevelType; 
      topicId: number 
    } = body;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    const accessStatus = await getLevelAccess(userId, grade);
    const currentLevelInfo = accessStatus.find(s => s.level === level);

    if (currentLevelInfo?.isLocked) {
      return NextResponse.json(
        { error: "Өмнөх түвшнийг бүрэн дуусгаж байж энэ түвшин нээгдэнэ!" }, 
        { status: 403 }
      );
    }

 
    const updatedProgress = await prisma.userProgress.upsert({
      where: {
        userId_grade_level_topicId: { userId, grade, level, topicId }
      },
      update: { completed: true },
      create: { userId, grade, level, topicId, completed: true }
    });

    return NextResponse.json({ success: true, data: updatedProgress });
  } catch {
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}
