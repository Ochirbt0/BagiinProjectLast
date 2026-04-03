import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function calculateScore(errors: number) {
  if (errors === 0) return 10;
  if (errors === 1) return 9;
  if (errors === 2) return 7;
  return 5;
}

const normalizeWord = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "")
    .trim();

const toWords = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .map((word) => normalizeWord(word))
    .filter(Boolean);

const wordEditDistance = (a: string[], b: string[]) => {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    Array.from({ length: b.length + 1 }, () => 0),
  );

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + 1,
        );
      }
    }
  }

  return dp[a.length][b.length];
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId: bodyUserId, originalText, userText, errors: reportedErrors } = body;

    if (!originalText || !userText) {
      return NextResponse.json(
        { error: "originalText болон userText шаардлагатай" },
        { status: 400 },
      );
    }

    const { userId: authUserId } = await auth();
    const userId = authUserId || bodyUserId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const originalWords = toWords(String(originalText));
    const userWords = toWords(String(userText));

    const spellingErrors = Number.isFinite(Number(reportedErrors))
      ? Math.max(0, Number(reportedErrors))
      : 0;
    const sequenceErrors = wordEditDistance(originalWords, userWords);
    const omittedWords = Math.max(0, originalWords.length - userWords.length);
    const mistakes = Math.max(spellingErrors, sequenceErrors, omittedWords);

    const gainedScore = calculateScore(mistakes);

    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    const dbUser = await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        name:
          (clerkUser.publicMetadata?.nickname as string) ||
          clerkUser.firstName ||
          "Баатар",
        avatarUrl: clerkUser.imageUrl || null,
        score: gainedScore,
      },
      update: {
        score: { increment: gainedScore },
        name:
          (clerkUser.publicMetadata?.nickname as string) ||
          clerkUser.firstName ||
          "Баатар",
        avatarUrl: clerkUser.imageUrl || null,
      },
    });

    return NextResponse.json({
      score: gainedScore,
      mistakes,
      totalWords: originalWords.length,
      totalScore: gainedScore,
      leaderboardScore: dbUser.score,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Score update failed", detail },
      { status: 500 },
    );
  }
}
