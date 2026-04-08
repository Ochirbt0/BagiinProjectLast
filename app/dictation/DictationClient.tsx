"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Volume2,
  Send,
  Keyboard as KeyboardIcon,
  X,
  Delete,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import {
  completeTopicProgress,
  generateAudio,
  generateTopic,
  levelFromQuery,
  spellcheck,
  submitScore,
} from "@/lib/backend-api";

const PRIMARY_TTS_RATE = 0.75;
const THIRD_PASS_TTS_RATE = 0.5;
const SENTENCE_GAP_MS = 3000;
const REPEAT_GAP_MS = 3000;

export default function DictationClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topicTitle = searchParams.get("topic") || "Амьтдын ертөнц";
  const topicId = Number(searchParams.get("topicId") || "1");
  const levelParam = searchParams.get("level") || "1";

  const grade = Number(searchParams.get("grade") || "1");
  const level = levelFromQuery(searchParams.get("level"));

  const [sourceSentences, setSourceSentences] = useState<string[]>([]);
  const [playedSentencesSnapshot, setPlayedSentencesSnapshot] = useState<
    string[]
  >([]);
  const [userInput, setUserInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTopicPassed, setIsTopicPassed] = useState(false);
  const [showAnagram, setShowAnagram] = useState(false);
  const [selectedAnagramWord, setSelectedAnagramWord] = useState<string | null>(
    null,
  );
  const [anagramWords, setAnagramWords] = useState<string[]>([]);
  const [anagramShuffled, setAnagramShuffled] = useState<
    Record<string, string>
  >({});
  const [anagramBoards, setAnagramBoards] = useState<
    Record<string, { pool: string[]; slots: Array<string | null> }>
  >({});
  const [draggingLetter, setDraggingLetter] = useState<{
    word: string;
    source: "pool" | "slot";
    index: number;
    letter: string;
  } | null>(null);
  const [anagramError, setAnagramError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    score?: number;
    errors?: number;
    incorrectWords?: string[];
    correctedText?: string;
    totalScore?: number;
  } | null>(null);
  const [reviewWords, setReviewWords] = useState<
    Array<{ value: string; isWrong: boolean; targetWord?: string }>
  >([]);
  const [requireAnagramHint, setRequireAnagramHint] = useState<string | null>(
    null,
  );
  const expectedLineCount = sourceSentences.length || 5;

  const normalizeWord = (value: string) => {
    const lowered = String(value || "").toLowerCase();
    const glyphFixed = lowered
      .replace(/a/g, "а")
      .replace(/e/g, "е")
      .replace(/o/g, "о")
      .replace(/p/g, "р")
      .replace(/c/g, "с")
      .replace(/x/g, "х")
      .replace(/y/g, "у")
      .replace(/k/g, "к")
      .replace(/b/g, "в")
      .replace(/m/g, "м")
      .replace(/h/g, "н")
      .replace(/t/g, "т");
    return glyphFixed.replace(/[^\p{L}\p{N}]/gu, "").trim();
  };

  const shuffleWord = (word: string) => {
    if (word.length < 2) return word;
    const chars = word.split("");
    let shuffled = word;
    let attempts = 0;
    while (shuffled === word && attempts < 10) {
      for (let i = chars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = chars[i];
        chars[i] = chars[j];
        chars[j] = temp;
      }
      shuffled = chars.join("");
      attempts += 1;
    }
    return shuffled === word ? word.split("").reverse().join("") : shuffled;
  };

  const isWordSolved = (
    word: string,
    boards: Record<string, { pool: string[]; slots: Array<string | null> }>,
  ) => normalizeWord((boards[word]?.slots || []).join("")) === word;

  type ExpectedWordItem = { normalized: string };
  type ActualWordItem = { normalized: string; rawIndex: number };

  const buildLineTargetMap = (
    expectedLine: ExpectedWordItem[],
    actualLine: ActualWordItem[],
  ) => {
    const map = new Map<number, string>();
    const m = expectedLine.length;
    const n = actualLine.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () =>
      Array.from({ length: n + 1 }, () => 0),
    );

    for (let i = 0; i <= m; i += 1) dp[i][0] = i;
    for (let j = 0; j <= n; j += 1) dp[0][j] = j;

    for (let i = 1; i <= m; i += 1) {
      for (let j = 1; j <= n; j += 1) {
        if (expectedLine[i - 1]?.normalized === actualLine[j - 1]?.normalized) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j - 1] + 1, // substitution
            dp[i - 1][j] + 1, // deletion
            dp[i][j - 1] + 1, // insertion
          );
        }
      }
    }

    let i = m;
    let j = n;

    while (i > 0 || j > 0) {
      const expected = expectedLine[i - 1];
      const actual = actualLine[j - 1];

      if (
        i > 0 &&
        j > 0 &&
        expected?.normalized === actual?.normalized &&
        dp[i][j] === dp[i - 1][j - 1]
      ) {
        i -= 1;
        j -= 1;
        continue;
      }

      const substitutionCost =
        i > 0 && j > 0 ? dp[i - 1][j - 1] + 1 : Number.POSITIVE_INFINITY;
      const deletionCost = i > 0 ? dp[i - 1][j] + 1 : Number.POSITIVE_INFINITY;
      const insertionCost = j > 0 ? dp[i][j - 1] + 1 : Number.POSITIVE_INFINITY;
      const currentCost = dp[i][j];

      // Prefer insertion/deletion over substitution to avoid cascading
      // false mismatches when a word is missing/extra in the middle.
      if (deletionCost === currentCost && insertionCost === currentCost) {
        if (dp[i - 1][j] <= dp[i][j - 1]) {
          i -= 1;
        } else {
          j -= 1;
        }
        continue;
      }

      if (deletionCost === currentCost && i > 0) {
        i -= 1;
        continue;
      }

      if (insertionCost === currentCost && j > 0) {
        j -= 1;
        continue;
      }

      if (substitutionCost === currentCost && i > 0 && j > 0) {
        if (
          typeof actual?.rawIndex === "number" &&
          expected?.normalized &&
          !map.has(actual.rawIndex)
        ) {
          map.set(actual.rawIndex, expected.normalized);
        }
        i -= 1;
        j -= 1;
        continue;
      }

      if (i > 0 && j > 0) {
        i -= 1;
        j -= 1;
      } else if (i > 0) {
        i -= 1;
      } else if (j > 0) {
        j -= 1;
      }
    }

    return map;
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const loadSentence = async () => {
      setIsGenerating(true);
      setError(null);
      setResult(null);
      setUserInput("");
      setSourceSentences([]);
      setPlayedSentencesSnapshot([]);
      setIsTopicPassed(false);
      setShowAnagram(false);
      setSelectedAnagramWord(null);
      setAnagramWords([]);
      setAnagramShuffled({});
      setAnagramBoards({});
      setDraggingLetter(null);
      setAnagramError(null);
      setReviewWords([]);
      setRequireAnagramHint(null);

      try {
        const data = await generateTopic({
          grade: Number.isFinite(grade) ? grade : 1,
          level,
          topic: topicTitle,
        });
        const sentences = Array.isArray(data?.sentences)
          ? data.sentences
              .map((item) => String(item || "").trim())
              .filter(Boolean)
          : [];
        setSourceSentences(sentences);
      } catch (e) {
        console.error(e);
        setError("Өгүүлбэр үүсгэхэд алдаа гарлаа.");
      } finally {
        setIsGenerating(false);
      }
    };

    loadSentence();
  }, [grade, level, topicTitle]);

  const keys = [
    ["Ф", "Ц", "У", "Ж", "Э", "Н", "Г", "Ш", "Ү", "З", "К"],
    ["Й", "Ы", "Б", "Ө", "А", "Х", "Р", "О", "Л", "Д", "П"],
    ["Я", "Ч", "Ё", "С", "М", "И", "Т", "Ь", "В", "Ю", "Е"],
    ["ЗАЙ АВАХ", "УСТГАХ"],
  ];

  const handleKeyClick = (key: string) => {
    if (key === "УСТГАХ") {
      setUserInput((prev) => prev.slice(0, -1));
    } else if (key === "ЗАЙ АВАХ") {
      setUserInput((prev) => prev + " ");
    } else {
      setUserInput((prev) => prev + key);
    }
  };

  const playSingleSentence = async (text: string, rate: number) => {
    const blob = await generateAudio(text);
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.playbackRate = rate;

    await new Promise<void>((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Аудио тоглуулахад алдаа гарлаа."));
      };
      audio.play().catch((err) => {
        URL.revokeObjectURL(url);
        reject(err);
      });
    });
  };

  const wait = (ms: number) =>
    new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });

  const handlePlay = async () => {
    if (!sourceSentences.length) return;

    setPlayedSentencesSnapshot([...sourceSentences]);
    setIsPlaying(true);
    setError(null);

    try {
      for (let i = 0; i < sourceSentences.length; i++) {
        const sentence = sourceSentences[i];
        await playSingleSentence(sentence, PRIMARY_TTS_RATE);
        await wait(REPEAT_GAP_MS);
        await playSingleSentence(sentence, PRIMARY_TTS_RATE);
        await wait(REPEAT_GAP_MS);
        await playSingleSentence(sentence, THIRD_PASS_TTS_RATE);
        if (i < sourceSentences.length - 1) {
          await wait(SENTENCE_GAP_MS);
        }
      }
    } catch (e) {
      console.error(e);
      const message =
        e instanceof Error && e.message
          ? e.message
          : "Дуу тоглуулахад алдаа гарлаа.";
      setError(message);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleSubmit = async () => {
    if (isTopicPassed) {
      router.push(
        `/topics?grade=${encodeURIComponent(String(grade))}&level=${encodeURIComponent(levelParam)}`,
      );
      return;
    }

    if (result && anagramWords.length > 0) {
      const unresolved = anagramWords.filter(
        (word) => !isWordSolved(word, anagramBoards),
      );
      if (unresolved.length > 0) {
        setRequireAnagramHint(
          "Сайн байна. Одоо улаан үг дээр дарж үсгийн тоглоомоо гүйцээгээрэй.",
        );
        return;
      }
    }

    if (!userInput.trim()) {
      setError("Эхлээд өгүүлбэрээ бичнэ үү.");
      return;
    }

    if (!playedSentencesSnapshot.length) {
      setError("Эхлээд Сонсох товчийг дарж 5 өгүүлбэрээ сонсоно уу.");
      return;
    }

    const typedLines = userInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (typedLines.length !== expectedLineCount) {
      setError(
        `Өгүүлбэр бүрийг шинэ мөрөнд бичнэ үү. Нийт ${expectedLineCount} мөр шаардлагатай.`,
      );
      return;
    }

    setIsChecking(true);
    setError(null);
    setRequireAnagramHint(null);

    try {
      const referenceSentences =
        playedSentencesSnapshot.length === sourceSentences.length &&
        playedSentencesSnapshot.length > 0
          ? playedSentencesSnapshot
          : sourceSentences;

      const checked = await spellcheck(userInput);
      const scoreData = await submitScore({
        originalText: referenceSentences.join(" "),
        userText: userInput,
        errors: checked.errors,
      });

      setResult({
        score: scoreData.score ?? checked.score,
        errors: scoreData.mistakes ?? checked.errors,
        incorrectWords: checked.incorrectWords,
        correctedText: checked.correctedText,
        totalScore: scoreData.totalScore,
      });
      if (typeof scoreData.leaderboardScore === "number") {
        localStorage.setItem("userStars", String(scoreData.leaderboardScore));
        window.dispatchEvent(new Event("stars-updated"));
      }

      const userLinesRaw = userInput
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const userWordsRaw: string[] = [];
      const userLinesComparable = userLinesRaw.map((line) => {
        const lineWords = line
          .split(/\s+/)
          .map((w) => String(w || "").trim())
          .filter(Boolean);
        return lineWords
          .map((rawWord) => {
            const normalized = normalizeWord(rawWord);
            const rawIndex = userWordsRaw.length;
            userWordsRaw.push(rawWord);
            return { rawWord, normalized, rawIndex };
          })
          .filter((item) => Boolean(item.normalized));
      });

      const originalLinesComparable = referenceSentences.map((line) =>
        line
          .split(/\s+/)
          .map((w) => String(w || "").trim())
          .filter(Boolean)
          .map((rawWord) => ({
            rawWord,
            normalized: normalizeWord(rawWord),
          }))
          .filter((item) => Boolean(item.normalized)),
      );

      const targetByRawUserIndex = new Map<number, string>();

      const lineCount = Math.min(
        originalLinesComparable.length,
        userLinesComparable.length,
      );
      for (let lineIndex = 0; lineIndex < lineCount; lineIndex += 1) {
        const expectedLine = originalLinesComparable[lineIndex] || [];
        const actualLine = userLinesComparable[lineIndex] || [];
        const lineMap = buildLineTargetMap(expectedLine, actualLine);
        for (const [rawIndex, expectedWord] of lineMap.entries()) {
          if (!targetByRawUserIndex.has(rawIndex)) {
            targetByRawUserIndex.set(rawIndex, expectedWord);
          }
        }
      }

      const review: Array<{
        value: string;
        isWrong: boolean;
        targetWord?: string;
      }> = userWordsRaw.map((rawWord, userIndex) => {
        const targetWord = targetByRawUserIndex.get(userIndex);
        return {
          value: rawWord,
          isWrong: Boolean(targetWord),
          targetWord,
        };
      });
      setReviewWords(review);

      const uniqueIncorrect = Array.from(
        new Set(
          Array.from(targetByRawUserIndex.values()).filter(
            (word) => word.length > 0,
          ),
        ),
      );

      if (uniqueIncorrect.length > 0) {
        const shuffledMap = uniqueIncorrect.reduce(
          (acc, word) => {
            acc[word] = shuffleWord(word);
            return acc;
          },
          {} as Record<string, string>,
        );

        setAnagramWords(uniqueIncorrect);
        setAnagramShuffled(shuffledMap);
        setAnagramBoards(
          uniqueIncorrect.reduce(
            (acc, word) => {
              acc[word] = {
                pool: (shuffledMap[word] || word).split(""),
                slots: Array.from({ length: word.length }, () => null),
              };
              return acc;
            },
            {} as Record<
              string,
              { pool: string[]; slots: Array<string | null> }
            >,
          ),
        );
        setShowAnagram(false);
        setSelectedAnagramWord(null);
        setRequireAnagramHint(
          "Улаанаар тэмдэглэсэн үгэн дээр дарж үсгийн тоглоомоо хийгээрэй.",
        );
      } else {
        await completeTopicProgress({
          grade: Number.isFinite(grade) ? grade : 1,
          level,
          topicId: Number.isFinite(topicId) ? topicId : 1,
        });
        setIsTopicPassed(true);
        setRequireAnagramHint(null);
      }
    } catch (e) {
      console.error(e);
      setError("Алдаа шалгахад асуудал гарлаа.");
    } finally {
      setIsChecking(false);
    }
  };

  const statusText = useMemo(() => {
    if (isGenerating) return "Өгүүлбэр бэлдэж байна...";
    if (sourceSentences.length)
      return `${sourceSentences.length} өгүүлбэр сонсоод зөв бичээрэй ✨`;
    return "Өгүүлбэр олдсонгүй.";
  }, [isGenerating, sourceSentences]);

  const formatCorrectedText = (value: string) => {
    const chunks = value
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
    return chunks
      .map((line) => (/[.!?]$/.test(line) ? line : `${line}.`))
      .join(" ");
  };

  const handleAnagramCheck = async () => {
    const wordsToCheck = selectedAnagramWord
      ? [selectedAnagramWord]
      : anagramWords;

    const checkedWordsCorrect = wordsToCheck.every((word) => {
      const board = anagramBoards[word];
      const input = normalizeWord((board?.slots || []).join(""));
      return input === word;
    });

    if (!checkedWordsCorrect) {
      setAnagramError("Бүх анаграм үгийг зөв тааруулж бичнэ үү.");
      return;
    }

    const allWordsSolved = anagramWords.every((word) =>
      isWordSolved(word, anagramBoards),
    );

    if (!allWordsSolved) {
      setShowAnagram(false);
      setSelectedAnagramWord(null);
      setAnagramError(null);
      setRequireAnagramHint(
        "Гоё байна. Үлдсэн улаан үг дээр дараад үргэлжлүүлээрэй.",
      );
      return;
    }

    try {
      await completeTopicProgress({
        grade: Number.isFinite(grade) ? grade : 1,
        level,
        topicId: Number.isFinite(topicId) ? topicId : 1,
      });
      setIsTopicPassed(true);
      setShowAnagram(false);
      setSelectedAnagramWord(null);
      setAnagramError(null);
      setRequireAnagramHint(null);
    } catch (e) {
      console.error(e);
      setAnagramError("Ахиц хадгалахад алдаа гарлаа. Дахин оролдоно уу.");
    }
  };

  const placeLetterToSlot = (
    word: string,
    slotIndex: number,
    source: { source: "pool" | "slot"; index: number; letter: string },
  ) => {
    setAnagramBoards((prev) => {
      const board = prev[word];
      if (!board) return prev;

      const nextPool = [...board.pool];
      const nextSlots = [...board.slots];

      if (source.source === "pool") {
        if (!nextPool[source.index]) return prev;
        nextPool.splice(source.index, 1);
      } else {
        if (nextSlots[source.index] !== source.letter) return prev;
        nextSlots[source.index] = null;
      }

      const replaced = nextSlots[slotIndex];
      if (replaced) {
        nextPool.push(replaced);
      }
      nextSlots[slotIndex] = source.letter;

      return {
        ...prev,
        [word]: { pool: nextPool, slots: nextSlots },
      };
    });
    setAnagramError(null);
  };

  const moveLetterBackToPool = (word: string, slotIndex: number) => {
    setAnagramBoards((prev) => {
      const board = prev[word];
      if (!board) return prev;

      const nextPool = [...board.pool];
      const nextSlots = [...board.slots];
      const letter = nextSlots[slotIndex];
      if (!letter) return prev;

      nextSlots[slotIndex] = null;
      nextPool.push(letter);

      return {
        ...prev,
        [word]: { pool: nextPool, slots: nextSlots },
      };
    });
    setAnagramError(null);
  };

  const handlePoolQuickPlace = (word: string, poolIndex: number) => {
    const board = anagramBoards[word];
    if (!board) return;
    const firstEmptySlot = board.slots.findIndex((slot) => !slot);
    if (firstEmptySlot === -1) return;
    const letter = board.pool[poolIndex];
    if (!letter) return;

    placeLetterToSlot(word, firstEmptySlot, {
      source: "pool",
      index: poolIndex,
      letter,
    });
  };

  const openAnagramByWord = (word?: string) => {
    if (!word) return;
    if (!anagramWords.includes(word)) return;
    if (isWordSolved(word, anagramBoards)) {
      setRequireAnagramHint("Энэ үгийг аль хэдийн зөв болгочихсон байна.");
      return;
    }

    setRequireAnagramHint(null);
    setSelectedAnagramWord(word);
    setAnagramError(null);
    setShowAnagram(true);
  };

  const anagramWordsToRender =
    selectedAnagramWord && anagramWords.includes(selectedAnagramWord)
      ? [selectedAnagramWord]
      : anagramWords;

  return (
    <div className="min-h-screen bg-[#FDFCFE] flex flex-col items-center font-sans overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,#f3e8ff_0%,transparent_40%)] pointer-events-none" />

      <main className="w-full max-w-5xl flex-1 flex flex-col relative z-10 px-4 md:px-6 pt-24 md:pt-32 pb-10">
        <div className="bg-white rounded-[35px] md:rounded-[45px] shadow-[0_20px_80px_rgba(93,49,145,0.08)] border border-white flex flex-col overflow-hidden min-h-[550px] md:min-h-[600px]">
          <div className="px-6 md:px-12 py-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 border border-slate-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <h1 className="text-xl md:text-3xl font-black text-[#5D3191] tracking-tight">
                  {topicTitle}
                </h1>
              </div>

              <button
                onClick={handlePlay}
                disabled={!sourceSentences.length || isPlaying || isGenerating}
                className={`hidden md:flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs transition-all shadow-md disabled:opacity-60 ${
                  isPlaying
                    ? "bg-amber-400 text-white animate-pulse"
                    : "bg-[#5D3191] text-white"
                }`}
              >
                <Volume2 size={18} />{" "}
                {isPlaying ? "Тоглож байна" : "Сонсох (3x)"}
              </button>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <p className="text-slate-400 font-bold text-[15px]">
                {statusText}
              </p>
              <button
                onClick={handlePlay}
                disabled={!sourceSentences.length || isPlaying || isGenerating}
                className={`md:hidden flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-black text-[10px] transition-all border disabled:opacity-60 ${
                  isPlaying
                    ? "bg-amber-50 border-amber-200 text-amber-500 animate-pulse"
                    : "bg-purple-50 border-purple-100 text-[#5D3191]"
                }`}
              >
                <Volume2 size={12} />{" "}
                {isPlaying ? "Тоглож байна" : "СОНСОХ (3x)"}
              </button>
            </div>
          </div>

          <div className="flex-1 px-4 md:px-12">
            {/* ГАДНА САВ: scroll-гүй, overflow-hidden */}
            <div className="relative h-auto min-h-[320px] md:min-h-[350px] bg-white rounded-[28px] border-2 border-purple-50 shadow-inner overflow-hidden">
              {/* Дэвтэрийн шугамнууд - textarea-тайгаа хамт сунана */}
              <div
                className="absolute inset-0 opacity-[0.2] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(#5D3191 1.5px, transparent 1.5px)",
                  backgroundSize: "100% 40px",
                  backgroundPosition: "0 35px",
                }}
              />

              {/* Зүүн талын босоо улаан шугам */}
              <div className="absolute left-14 top-0 bottom-0 w-[1.5px] bg-red-200/50 pointer-events-none" />

              {/* TEXTAREA: overflow-hidden болгож, өндрийг нь агуулгаар нь сунгана */}
              <textarea
                value={userInput}
                onChange={(e) => {
                  setUserInput(e.target.value);
                  // Өндрийг нь автоматаар тохируулах (Scroll-гүй болгох гол хэсэг)
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                placeholder={`Сонссон ${expectedLineCount} өгүүлбэрээ мөр мөрөөр бичээрэй...`}
                spellCheck="false"
                className="relative w-full p-8 pl-20 bg-transparent text-lg md:text-xl font-bold text-slate-700 focus:outline-none resize-none leading-[40px] z-20 overflow-hidden min-h-[350px]"
                style={{ height: "auto" }}
              />
            </div>

            {/* Алдаатай үгс харуулах хэсэг (Хэвээрээ) */}
            {reviewWords.some((word) => word.isWrong) && !isTopicPassed && (
              <div className="mt-4 p-4 rounded-2xl border border-rose-100 bg-rose-50/60 transition-all">
                <p className="text-[11px] font-black uppercase tracking-widest text-rose-500 mb-2">
                  Алдаатай үгс
                </p>
                <div className="flex flex-wrap gap-2">
                  {reviewWords.map((word, idx) => {
                    if (!word.isWrong) {
                      return (
                        <span
                          key={`${word.value}-${idx}`}
                          className="px-3 py-1.5 rounded-full bg-white/80 border border-slate-100 text-slate-400 font-bold text-sm"
                        >
                          {word.value}
                        </span>
                      );
                    }

                    const solved = word.targetWord
                      ? isWordSolved(word.targetWord, anagramBoards)
                      : false;

                    return (
                      <button
                        key={`${word.value}-${idx}`}
                        onClick={() => openAnagramByWord(word.targetWord)}
                        className={`px-3 py-1.5 rounded-full border font-black text-sm transition-all active:scale-95 ${
                          solved
                            ? "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                            : "bg-white border-rose-200 text-rose-500 hover:bg-rose-100"
                        }`}
                      >
                        {solved ? word.targetWord || word.value : word.value}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="px-6 md:px-12 py-8 flex items-center justify-end gap-3">
            {!isMobile && (
              <button
                onClick={() => setShowKeyboard(!showKeyboard)}
                className="px-6 py-4 rounded-2xl font-black text-[11px] bg-white border border-slate-100 text-slate-400 flex items-center justify-center gap-2 hover:text-[#5D3191] transition-all"
              >
                <KeyboardIcon size={16} />
                МОНГОЛ ГАР
              </button>
            )}

            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isChecking || isGenerating}
              className="w-full md:w-48 bg-[#5D3191] text-white py-4 rounded-2xl font-black text-base shadow-lg flex items-center justify-center gap-3 transition-all disabled:opacity-60"
            >
              {isTopicPassed ? <ChevronLeft size={18} /> : <Send size={18} />}
              {isTopicPassed ? "БУЦАХ" : isChecking ? "ШАЛГАЖ БАЙНА" : "ИЛГЭЭХ"}
            </motion.button>
          </div>
        </div>

        <div className="mt-7 bg-gradient-to-br from-[#FFF7E6] via-[#F7F2FF] to-[#ECF9DF] border border-[#E7D8F7] rounded-[32px] p-6 md:p-8 flex gap-4 md:gap-5 items-start shadow-[0_20px_55px_rgba(93,49,145,0.10)]">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FFD93D] rounded-2xl flex items-center justify-center shrink-0 shadow-[0_8px_20px_rgba(255,217,61,0.35)]">
            <Lightbulb size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-[#5D3191] font-black text-xs md:text-sm uppercase tracking-widest">
              Үр дүн
            </h4>
            {error ? (
              <p className="text-red-500 text-base md:text-lg font-black mt-2">
                {error}
              </p>
            ) : result ? (
              <div className="text-[#5D3191] text-base md:text-lg font-black mt-2 leading-tight space-y-1">
                {typeof result.score === "number" && (
                  <p>Оноо: {result.score}</p>
                )}
                {typeof result.totalScore === "number" && (
                  <p>Нийт оноо: {result.totalScore}</p>
                )}
                {typeof result.errors === "number" && (
                  <p>Алдаа: {result.errors}</p>
                )}
                {isTopicPassed ? (
                  <p className="text-green-600">Статус: Энэ сэдвийг давлаа.</p>
                ) : (
                  <p className="text-amber-700">
                    Статус: Анаграм даалгавар дутуу.
                  </p>
                )}
                {requireAnagramHint && (
                  <p className="text-rose-500 text-sm md:text-base">
                    {requireAnagramHint}
                  </p>
                )}
                {result.correctedText && (
                  <p>Зассан: {formatCorrectedText(result.correctedText)}</p>
                )}
              </div>
            ) : (
              <p className="text-[#5D3191]/80 text-base md:text-lg font-black mt-2 leading-tight text-pretty">
                Сонсоод бичсэнийхээ дараа ИЛГЭЭХ дарж шалгуулна уу.
              </p>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {!isMobile && showKeyboard && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-xl border-t border-slate-100 p-6 pb-10 shadow-[0_-15px_40px_rgba(0,0,0,0.08)]"
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-4 px-2">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Монгол гар идэвхтэй
                </span>
                <button
                  onClick={() => setShowKeyboard(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {keys.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center gap-1.5">
                    {row.map((key) => (
                      <motion.button
                        key={key}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleKeyClick(key)}
                        className={`
                          ${key === "ЗАЙ АВАХ" ? "w-48" : key === "УСТГАХ" ? "w-24 bg-red-50 text-red-400" : "w-12 h-14 bg-white"}
                          rounded-xl shadow-[0_3px_0_#f1f5f9] active:shadow-none border border-slate-100 flex items-center justify-center
                          text-lg font-black text-slate-600 transition-all
                        `}
                      >
                        {key === "УСТГАХ" ? <Delete size={20} /> : key}
                      </motion.button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAnagram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-[32px] bg-[#FDFCFE] p-5 md:p-6 shadow-2xl border border-purple-100"
            >
              <h3 className="text-[#5D3191] text-xl font-black mb-2">
                Анаграм засвар
              </h3>
              <p className="text-slate-500 text-sm font-bold mb-4">
                Үсгүүдийг чирж эсвэл дарж зөв үгээ бүрдүүлээрэй.
              </p>

              <div className="space-y-5 max-h-[58vh] overflow-auto pr-1">
                {anagramWordsToRender.map((word) => {
                  const board = anagramBoards[word] || {
                    pool: [],
                    slots: [],
                  };
                  const solved = isWordSolved(word, anagramBoards);

                  return (
                    <div
                      key={word}
                      className="p-4 rounded-[26px] border border-purple-100 bg-white"
                    >
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <p className="text-xs font-black uppercase tracking-widest text-[#5D3191]/60">
                          Даалгавар
                        </p>
                        {solved && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest">
                            <CheckCircle2 size={13} />
                            Боллоо
                          </div>
                        )}
                      </div>
                      <div className="rounded-2xl overflow-hidden border-2 border-[#D3BFEF] mb-4">
                        <div className="bg-[#EAF7DA] px-4 py-2 border-b border-[#D3BFEF]">
                          <p className="text-[10px] text-[#5D3191] font-black uppercase tracking-widest text-center">
                            HINT
                          </p>
                        </div>
                        <div className="px-4 py-5">
                          <p className="text-center text-[#5D3191] text-xl md:text-2xl font-black tracking-wide">
                            {anagramShuffled[word] || word}
                          </p>
                        </div>
                      </div>

                      <div
                        className="flex flex-wrap justify-center gap-2 mb-5 min-h-12"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (!draggingLetter || draggingLetter.word !== word) {
                            return;
                          }
                          if (draggingLetter.source === "slot") {
                            moveLetterBackToPool(word, draggingLetter.index);
                          }
                          setDraggingLetter(null);
                        }}
                      >
                        {board.pool.map((letter, poolIndex) => (
                          <button
                            key={`${word}-pool-${poolIndex}-${letter}`}
                            draggable
                            onDragStart={() =>
                              setDraggingLetter({
                                word,
                                source: "pool",
                                index: poolIndex,
                                letter,
                              })
                            }
                            onClick={() =>
                              handlePoolQuickPlace(word, poolIndex)
                            }
                            className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-[#E6F0FF] border-2 border-[#9AC7EB] text-[#5D3191] text-xl font-black select-none active:scale-95 transition-transform"
                          >
                            {letter}
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-wrap justify-center gap-2">
                        {board.slots.map((letter, slotIndex) => (
                          <button
                            key={`${word}-slot-${slotIndex}`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              if (
                                !draggingLetter ||
                                draggingLetter.word !== word
                              ) {
                                return;
                              }
                              placeLetterToSlot(word, slotIndex, {
                                source: draggingLetter.source,
                                index: draggingLetter.index,
                                letter: draggingLetter.letter,
                              });
                              setDraggingLetter(null);
                            }}
                            onClick={() => {
                              if (letter) {
                                moveLetterBackToPool(word, slotIndex);
                              }
                            }}
                            draggable={Boolean(letter)}
                            onDragStart={() => {
                              if (!letter) return;
                              setDraggingLetter({
                                word,
                                source: "slot",
                                index: slotIndex,
                                letter,
                              });
                            }}
                            className={`w-11 h-11 md:w-12 md:h-12 rounded-xl text-xl font-black select-none transition-colors ${
                              letter
                                ? "bg-[#F4EEFF] border-2 border-[#C9B3E8] text-[#5D3191]"
                                : "bg-transparent border-2 border-dashed border-[#C8CBD4] text-transparent"
                            }`}
                          >
                            {letter || " "}
                          </button>
                        ))}
                      </div>
                      {solved && (
                        <p className="mt-3 text-center text-green-600 font-black text-sm md:text-base">
                          Зөв үг: {word}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {anagramError && (
                <p className="text-red-500 text-sm font-bold mt-3">
                  {anagramError}
                </p>
              )}

              <div className="mt-4 flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowAnagram(false);
                    setSelectedAnagramWord(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 font-black"
                >
                  Хаах
                </button>
                <button
                  onClick={handleAnagramCheck}
                  className="px-4 py-2 rounded-xl bg-[#5D3191] text-white font-black"
                >
                  {selectedAnagramWord ? "Энэ үгийг шалгах" : "Шалгах"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
