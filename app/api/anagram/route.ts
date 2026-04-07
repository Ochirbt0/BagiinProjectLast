import { NextRequest, NextResponse } from "next/server";

const wordsByGrade: Record<string, string[]> = {
  "1": ["гэр", "ном", "цэцэг", "хавар", "мод"],
  "2": ["хүүхэд", "сурагч", "хонь", "сайн", "цэцэрлэг"],
  "3": ["номын сан", "өдөр тутам", "урлаг", "багш", "бичиг"],
  "4": ["багшийн үг", "сургалтын материал", "түүх", "улс төр", "шинжлэх ухаан"],
  "5": [
    "шинжлэх ухаан",
    "түүхийн судалгаа",
    "математик",
    "биологи",
    "судалгааны ажил",
  ],
};

const SHUFFLE_ATTEMPTS = 20;

const normalizeAnswer = (value: string) =>
  String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

function shuffle(word: string) {
  const chars = word.split("");
  const movableIndexes = chars
    .map((ch, idx) => ({ ch, idx }))
    .filter((item) => /[\p{L}\p{N}]/u.test(item.ch))
    .map((item) => item.idx);

  if (movableIndexes.length < 2) return word;

  const original = [...chars];
  let attempts = 0;
  while (attempts < SHUFFLE_ATTEMPTS) {
    const letters = movableIndexes.map((idx) => original[idx]);
    for (let i = letters.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = letters[i];
      letters[i] = letters[j];
      letters[j] = temp;
    }

    const next = [...original];
    movableIndexes.forEach((charIdx, letterIdx) => {
      next[charIdx] = letters[letterIdx];
    });

    const shuffled = next.join("");
    if (shuffled !== word) return shuffled;
    attempts += 1;
  }

  const rotated = [...original];
  const first = rotated[movableIndexes[0]];
  for (let i = 0; i < movableIndexes.length - 1; i += 1) {
    rotated[movableIndexes[i]] = rotated[movableIndexes[i + 1]];
  }
  rotated[movableIndexes[movableIndexes.length - 1]] = first;
  return rotated.join("");
}

export async function GET(req: NextRequest) {
  const grade = req.nextUrl.searchParams.get("grade") || "1";
  const words = wordsByGrade[grade] || wordsByGrade["1"];
  const original = words[Math.floor(Math.random() * words.length)];
  const anagram = shuffle(original);

  return NextResponse.json({ original, anagram });
}

export async function POST(req: NextRequest) {
  const { original, answer } = await req.json();

  if (!original || !answer) {
    return NextResponse.json({
      correct: false,
      error: "original болон answer шаардлагатай",
    });
  }

  const correct = normalizeAnswer(original) === normalizeAnswer(answer);

  return NextResponse.json({ correct });
}
