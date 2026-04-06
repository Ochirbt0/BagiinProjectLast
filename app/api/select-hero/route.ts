import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = (await req.json()) as {
      hero?: { src?: string; name?: string };
    };
    const heroSrc = String(payload?.hero?.src || "").trim();

    if (!heroSrc) {
      return NextResponse.json({ error: "Hero зураг шаардлагатай" }, { status: 400 });
    }

    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        name:
          (clerkUser.publicMetadata?.nickname as string) ||
          clerkUser.firstName ||
          "Баатар",
        avatarUrl: heroSrc,
        score: 0,
      },
      update: {
        avatarUrl: heroSrc,
      },
    });

    return NextResponse.json({ success: true, avatarUrl: heroSrc });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Алдаа гарлаа", detail }, { status: 500 });
  }
}
