import { Grade, Level, TOPICS } from "@/app/constants/topics";
import { NextRequest, NextResponse } from "next/server";

const toLevel = (raw: string | null): Level => {
  if (raw === "1") return "easy";
  if (raw === "2") return "medium";
  if (raw === "3") return "hard";
  if (raw === "easy" || raw === "medium" || raw === "hard") return raw;
  return "easy";
};

export async function GET(req: NextRequest) {
  try {
    const gradeRaw = req.nextUrl.searchParams.get("grade") || "1";
    const levelRaw = req.nextUrl.searchParams.get("level") || "easy";

    const grade = Number(gradeRaw) as Grade;
    const level = toLevel(levelRaw);

    const topics = TOPICS[grade]?.[level] || [];

    return NextResponse.json({
      grade,
      level,
      topics,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to get topics", detail },
      { status: 500 },
    );
  }
}
