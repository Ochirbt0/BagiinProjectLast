import { NextRequest, NextResponse } from "next/server";

const sanitizeForChimege = (value: string) =>
  value
    .replace(/[^\u0400-\u04FF\s?!.,\-'"\":]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    const sanitizedText = sanitizeForChimege(String(text || ""));
    const apiToken =
      process.env.CHIMEGE_API_KEY || process.env.NEXT_PUBLIC_CHIMEGE_API_KEY;

    if (!apiToken) {
      return NextResponse.json(
        { error: "Missing CHIMEGE_API_KEY" },
        { status: 500 },
      );
    }

    if (!sanitizedText) {
      return NextResponse.json(
        {
          error: "Invalid text",
          detail:
            "Уншуулах текст хоосон эсвэл зөвшөөрөгдөөгүй тэмдэгттэй байна.",
        },
        { status: 400 },
      );
    }

    const res = await fetch("https://api.chimege.com/v1.2/synthesize", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        Token: apiToken,
      },
      body: sanitizedText,
    });

    if (!res.ok) {
      const errText = await res.text();
      const normalizedDetail = errText.includes("special characters")
        ? "Текст дотор зөвшөөрөгдөөгүй тэмдэгт байна. Кирилл үсэг болон ?, !, ., -, ', \", :, , тэмдэгт ашиглана уу."
        : errText;

      return NextResponse.json(
        { error: "Chimege API failed", detail: normalizedDetail },
        { status: res.status },
      );
    }

    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
