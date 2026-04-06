"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, Star, Play, LayoutGrid, Lock } from "lucide-react";
import {
  getProgressStatus,
  getTopics,
  levelFromQuery,
} from "@/lib/backend-api";

const islandMaps: Record<string, string> = {
  "1": "/1-r aral.png",
  "2": "/2-r aral.png",
  "3": "/3-r aral.png",
  "4": "/4-r aral.png",
  "5": "/5-r aral.png",
};

const topicIcons = ["🦁", "👨‍🚀", "🍕", "🏫", "🌳", "⚽", "🚗", "🎨"];
const topicColors = [
  "#FF8E53",
  "#6C63FF",
  "#FF6B6B",
  "#4ECDC4",
  "#45B649",
  "#FFD93D",
  "#A78BFA",
  "#F472B6",
];

type TopicCard = {
  id: number;
  title: string;
  icon: string;
  color: string;
};

export default function TopicsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const gradeParam = searchParams.get("grade") || "1";
  const levelParam = searchParams.get("level") || "1";
  const gradeNumber = gradeParam.replace(/[^0-9]/g, "") || "1";
  const currentIsland = islandMaps[gradeNumber] || islandMaps["1"];

  const [topics, setTopics] = useState<TopicCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelLocked, setLevelLocked] = useState(false);

  useEffect(() => {
    const loadTopics = async () => {
      setLoading(true);
      try {
        const grade = Number(gradeNumber);
        const level = levelFromQuery(levelParam);

        const data = await getTopics(grade, level);
        const progress = await getProgressStatus(grade).catch(() => []);
        const levelState = progress.find((p) => p.level === level);
        setLevelLocked(Boolean(levelState?.isLocked));

        const mapped = (data.topics || []).map((title, index) => ({
          id: index + 1,
          title,
          icon: topicIcons[index % topicIcons.length],
          color: topicColors[index % topicColors.length],
        }));

        setTopics(mapped);
      } catch (error) {
        console.error(error);
        setTopics([]);
      } finally {
        setLoading(false);
      }
    };

    loadTopics();
  }, [gradeNumber, levelParam]);

  const levelInfo = {
    "1": {
      text: "Амархан",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    "2": {
      text: "Дунд",
      color: "text-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    "3": {
      text: "Хэцүү",
      color: "text-rose-500",
      bg: "bg-rose-50",
      border: "border-rose-100",
    },
  }[levelParam] || {
    text: "Амархан",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  };

  return (
    <div className=" bg-[#FDFCFE] font-sans selection:bg-purple-100">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row  lg:gap-12 px-4 lg:px-10">
        <aside className="hidden lg:flex  flex-col pt-32 pb-12 shrink-0">
          <div className="bg-white border border-slate-100 rounded-[45px] h-full flex flex-col p-8 shadow-[0_20px_50px_rgba(93,49,145,0.04)] relative overflow-hidden">
            <div className="absolute  h-32 bg-gradient-to-b from-purple-50/50 to-transparent -z-0" />

            <motion.button
              whileHover={{ x: -5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white text-slate-400 hover:text-[#5D3191] border border-slate-100 transition-all mb-10 shadow-sm relative z-10"
            >
              <ChevronLeft size={24} />
            </motion.button>

            <div className="flex-1 flex flex-col items-center justify-between  z-10">
              <motion.div
                animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative "
              >
                <div className="absolute inset-0 bg-purple-300 rounded-full blur-[60px] opacity-20 scale-150" />
                <img
                  src={currentIsland}
                  className="w-52 h-52 object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.15)] relative z-10"
                  alt="Island"
                />
              </motion.div>

              <div className="w-full space-y-4 mb-4">
                <div className="p-5 rounded-[28px] bg-slate-50/80 backdrop-blur-sm flex items-center gap-4 border border-white shadow-inner">
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-[#5D3191] shadow-sm">
                    <LayoutGrid size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-1.5">
                      Анги
                    </p>
                    <p className="text-base font-black text-[#5D3191]">
                      {gradeNumber}-р анги
                    </p>
                  </div>
                </div>

                <div
                  className={`p-5 rounded-[28px] ${levelInfo.bg}/80 backdrop-blur-sm flex items-center gap-4 border border-white shadow-inner`}
                >
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Star
                      size={20}
                      className={levelInfo.color}
                      fill="currentColor"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-1.5">
                      Түвшин
                    </p>
                    <p className={`text-base font-black ${levelInfo.color}`}>
                      {levelInfo.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col pt-24 lg:pt-36 pb-8 overflow-hidden w-full">
          <header className="mb-8 lg:mb-12 shrink-0 px-2 lg:px-0">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 shadow-sm shrink-0"
                >
                  <ChevronLeft size={22} />
                </button>
                <div>
                  <h1 className="text-3xl md:text-3xl lg:text-4xl font-black text-[#5D3191] italic tracking-tight uppercase leading-none mb-2">
                    Сэдвээ сонго ✨
                  </h1>
                  <div className="h-2 w-24 bg-amber-400 rounded-full" />
                </div>
              </div>

              <div className="flex lg:hidden items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <LayoutGrid size={14} className="text-[#5D3191]" />
                  <span className="text-xs font-black text-[#5D3191] uppercase">
                    {gradeNumber}-р анги
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm`}
                >
                  <Star
                    size={14}
                    className={`${levelInfo.color} fill-current`}
                  />
                  <span
                    className={`text-xs font-black ${levelInfo.color} uppercase`}
                  >
                    {levelInfo.text}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto no-scrollbar pb-20 px-2 lg:px-2">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-bounce text-[#5D3191] font-black text-xl tracking-widest">
                  АЧААЛЛАЖ БАЙНА...
                </div>
              </div>
            ) : topics.length === 0 ? (
              <div className="text-center bg-white p-12 rounded-[40px] border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold text-lg">
                  Уучлаарай, сэдэв олдсонгүй 🧐
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {topics.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.06,
                      type: "spring",
                      stiffness: 100,
                    }}
                    onClick={() =>
                      !levelLocked &&
                      router.push(
                        `/dictation?topic=${encodeURIComponent(topic.title)}&topicId=${encodeURIComponent(String(topic.id))}&grade=${encodeURIComponent(gradeNumber)}&level=${encodeURIComponent(levelParam)}`,
                      )
                    }
                    className={`group relative p-6 lg:p-8 rounded-[40px] bg-white border border-slate-100 border-b-[8px] lg:border-b-[12px] transition-all flex flex-col items-center justify-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] ${
                      levelLocked
                        ? "cursor-not-allowed opacity-60 grayscale"
                        : "cursor-pointer active:border-b-0 active:translate-y-2 hover:shadow-[0_25px_50px_rgba(93,49,145,0.12)] hover:-translate-y-1"
                    }`}
                    style={{ borderBottomColor: topic.color }}
                  >
                    <div
                      className="w-16 h-16 lg:w-20 lg:h-20 rounded-[28px] flex items-center justify-center text-3xl lg:text-5xl mb-4 transition-transform group-hover:scale-110 group-hover:rotate-6 shadow-inner relative"
                      style={{ backgroundColor: `${topic.color}15` }}
                    >
                      <div
                        className="absolute inset-0 rounded-[28px] blur-xl opacity-0 group-hover:opacity-40 transition-opacity"
                        style={{ backgroundColor: topic.color }}
                      />
                      <span className="relative z-10">{topic.icon}</span>
                    </div>

                    <h3 className="font-black text-sm lg:text-lg text-slate-800 leading-tight mb-5 line-clamp-2 h-10 lg:h-14 flex items-center justify-center px-2">
                      {topic.title}
                    </h3>

                    <div
                      className={`flex items-center gap-2 px-5 py-2.5 lg:px-6 lg:py-3 rounded-2xl text-white shadow-lg transition-all font-black text-[10px] lg:text-xs uppercase tracking-widest`}
                      style={{
                        backgroundColor: levelLocked ? "#94a3b8" : topic.color,
                      }}
                    >
                      {levelLocked ? (
                        <>
                          <Lock size={14} />
                          <span>Түгжээтэй</span>
                        </>
                      ) : (
                        <>
                          <Play size={14} fill="white" />
                          <span>Тоглох</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {levelLocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 p-6 bg-rose-50 rounded-[30px] border border-rose-100 text-center mx-auto max-w-xl shadow-sm"
              >
                <p className="text-rose-500 font-black text-sm lg:text-base flex items-center justify-center gap-3">
                  <Lock size={20} />
                  Энэ түвшин түгжээтэй байна. Өмнөх түвшний 8 сэдвээ бүрэн
                  дуусгаарай.
                </p>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
