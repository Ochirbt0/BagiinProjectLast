import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { LevelType } from "@/app/lib/types/learning";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const grade = parseInt(searchParams.get("grade") || "1");
    const level = String(searchParams.get("level") || "easy") as LevelType;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const completed = await prisma.userProgress.findMany({
      where: {
        userId,
        grade,
        level,
        completed: true,
      },
      select: {
        topicId: true,
      },
      orderBy: {
        topicId: "asc",
      },
    });

    return NextResponse.json({ topicIds: completed.map((item) => item.topicId) });
  } catch {
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}
