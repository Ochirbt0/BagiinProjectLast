import { Grade, Level, TOPICS } from "@/app/constants/topics";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const GRADE_RULES: Record<Grade, { wordCount: number; sentenceCount: number }> =
  {
    1: { wordCount: 3, sentenceCount: 5 },
    2: { wordCount: 4, sentenceCount: 5 },
    3: { wordCount: 5, sentenceCount: 5 },
    4: { wordCount: 6, sentenceCount: 5 },
    5: { wordCount: 7, sentenceCount: 5 },
  };

const normalizeLevel = (level: unknown): Level => {
  if (level === "1") return "easy";
  if (level === "2") return "medium";
  if (level === "3") return "hard";
  if (level === "easy" || level === "medium" || level === "hard") return level;
  return "easy";
};

const normalizeGrade = (grade: unknown): Grade => {
  const parsed = Number(grade);
  if (
    parsed === 1 ||
    parsed === 2 ||
    parsed === 3 ||
    parsed === 4 ||
    parsed === 5
  ) {
    return parsed;
  }
  return 1;
};

const countWords = (sentence: string) =>
  sentence.trim().split(/\s+/).filter(Boolean).length;

const parseSentences = (text: string): string[] | null => {
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed?.sentences)) {
      return parsed.sentences.map((item: unknown) => String(item || "").trim());
    }
  } catch {
    const jsonLike = text.match(/\{[\s\S]*\}/)?.[0];
    if (jsonLike) {
      const parsed = JSON.parse(jsonLike);
      if (Array.isArray(parsed?.sentences)) {
        return parsed.sentences.map((item: unknown) =>
          String(item || "").trim(),
        );
      }
    }
  }
  return null;
};

const isValidSentences = (
  sentences: string[] | null,
  wordCount: number,
  sentenceCount: number,
) =>
  Array.isArray(sentences) &&
  sentences.length === sentenceCount &&
  sentences.every((sentence) => countWords(sentence) === wordCount);

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 },
      );
    }
    const { grade, level, topic } = await req.json();

    if (!grade || !level) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const parsedGrade = normalizeGrade(grade);
    const normalizedLevel = normalizeLevel(level);
    const { wordCount, sentenceCount } = GRADE_RULES[parsedGrade];

    const topicsByGrade = TOPICS[parsedGrade];
    const topicListRaw = topicsByGrade?.[normalizedLevel] || [];
    const topicList = topicListRaw
      .map((item) => String(item).trim())
      .filter(Boolean);

    if (!topicList || topicList.length === 0) {
      return NextResponse.json(
        { error: "No topics found for grade/level" },
        { status: 400 },
      );
    }

    const requestedTopic = String(topic || "").trim();
    const selectedTopic =
      requestedTopic && topicList.includes(requestedTopic)
        ? requestedTopic
        : topicList[Math.floor(Math.random() * topicList.length)];

    const prompt = `
"${selectedTopic}" сэдвээр ${sentenceCount} өгүүлбэр бич.

RULES:
- ${parsedGrade}-р ангийн хүүхдэд ойлгомжтой
- Монгол хүн уншаад ойлгохоор утгын хувьд тодорхой зөв байх
- Монгол хэлний өгүүлбэрийн бүтцийг сайн анхаарч найруулгын алдаагүй зөв тодорхой бич
- Энгийн Монгол хэл
- Хүчирхийлэл, +18 агуулга хориглоно
- Өгүүлбэр бүр яг ${wordCount} үгтэй байх
- Нийт яг ${sentenceCount} өгүүлбэртэй байх
- Зөвхөн JSON буцаа

FORMAT:
{
  "sentences": ["өгүүлбэр 1","өгүүлбэр 2"]
}
`;

    const models = ["gpt-4.1-mini"] as const;
    let lastError: unknown = null;

    for (const model of models) {
      try {
        const response = await openai.responses.create({
          model,
          input: prompt,
        });

        let sentences = parseSentences(response.output_text);

        if (!isValidSentences(sentences, wordCount, sentenceCount)) {
          const retryResponse = await openai.responses.create({
            model,
            input: `${prompt}\n\nДахин шалгаад яг ${wordCount} үгтэй ${sentenceCount} өгүүлбэрээр буцаа.`,
          });
          sentences = parseSentences(retryResponse.output_text);
        }

        if (isValidSentences(sentences, wordCount, sentenceCount)) {
          return NextResponse.json({
            topic: selectedTopic,
            grade: parsedGrade,
            level: normalizedLevel,
            wordCount,
            sentenceCount,
            sentences,
          });
        }
      } catch (modelError: unknown) {
        lastError = modelError;
        continue;
      }
    }

    const status =
      typeof lastError === "object" && lastError && "status" in lastError
        ? Number((lastError as { status?: number }).status)
        : 0;
    const message =
      lastError instanceof Error ? lastError.message : "Unknown model error";
    const quotaLike =
      status === 429 || message.includes("quota") || message.includes("429");

    if (quotaLike) {
      return NextResponse.json(
        {
          error: "OpenAI quota exceeded",
          detail:
            "OpenAI багцын хязгаар дууссан байна. Billing болон usage-ээ шалгаад дахин оролдоно уу.",
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      {
        error: "AI returned invalid JSON",
        detail: "Өгөгдсөн дүрэмтэй таарах өгүүлбэр үүсгэж чадсангүй.",
      },
      { status: 500 },
    );
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json(
      { error: "Server error", detail: message },
      { status: 500 },
    );
  }
}
