"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, Star, Play, LayoutGrid, Lock } from "lucide-react";
import { getProgressStatus, getTopics, levelFromQuery } from "@/lib/backend-api";

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
      color: "text-green-500",
      bg: "bg-green-50",
      border: "border-green-100",
    },
    "2": {
      text: "Дунд",
      color: "text-orange-500",
      bg: "bg-orange-50",
      border: "border-orange-100",
    },
    "3": {
      text: "Хэцүү",
      color: "text-red-500",
      bg: "bg-red-50",
      border: "border-red-100",
    },
  }[levelParam] || {
    text: "Амархан",
    color: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-100",
  };

  return (
    <div className="min-h-screen bg-[#FDFCFE] font-sans">
      <div className="lg:container mx-auto flex flex-col lg:flex-row h-screen lg:gap-10">
        <aside className="hidden lg:flex w-[300px] flex-col pt-28 pb-10 shrink-0">
          <div className="bg-white border border-slate-100 rounded-[40px] flex-1 flex flex-col p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative">
            <motion.button
              whileHover={{ x: -4 }}
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-[#5D3191] border border-slate-100 transition-all mb-8 shadow-sm"
            >
              <ChevronLeft size={20} />
            </motion.button>

            <div className="flex-1 flex flex-col items-center justify-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative mb-8"
              >
                <div className="absolute inset-0 bg-purple-200 rounded-full blur-[40px] opacity-20 scale-150" />
                <img
                  src={currentIsland}
                  className="w-44 h-44 object-contain drop-shadow-2xl relative z-10"
                  alt="Island"
                />
              </motion.div>

              <div className="w-full space-y-3">
                <div className="p-4 rounded-[20px] bg-slate-50/50 flex items-center gap-4 border border-slate-100/50">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#5D3191] shadow-sm">
                    <LayoutGrid size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Анги</p>
                    <p className="text-sm font-black text-[#5D3191]">{gradeNumber}-р анги</p>
                  </div>
                </div>
                <div className="p-4 rounded-[20px] bg-slate-50/50 flex items-center gap-4 border border-slate-100/50">
                  <div className={`w-9 h-9 rounded-lg bg-white flex items-center justify-center ${levelInfo.color} shadow-sm`}>
                    <Star size={16} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Түвшин</p>
                    <p className={`text-sm font-black ${levelInfo.color}`}>{levelInfo.text}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col pt-24 lg:pt-28 pb-6 overflow-hidden w-full">
          <header className="mb-6 lg:mb-8 shrink-0 px-4 md:px-6 lg:px-0">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 shadow-sm shrink-0"
                >
                  <ChevronLeft size={20} />
                </button>
                <h1 className="text-2xl md:text-3xl lg:text-5xl font-black text-[#5D3191] italic tracking-tight uppercase leading-none">Сэдвээ сонго ✨</h1>
              </div>

              <div className="flex lg:hidden items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-100 rounded-full">
                  <LayoutGrid size={10} className="text-[#5D3191]" />
                  <span className="text-[9px] font-black text-[#5D3191] uppercase tracking-wider">{gradeNumber}-р анги</span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 ${levelInfo.bg} border ${levelInfo.border} rounded-full`}>
                  <Star size={10} className={`${levelInfo.color} fill-current`} />
                  <span className={`text-[9px] font-black ${levelInfo.color} uppercase tracking-wider`}>{levelInfo.text}</span>
                </div>
              </div>

              <div className="hidden lg:block h-1.5 w-16 bg-amber-400 rounded-full" />
            </div>
          </header>

          <div className="flex-1 overflow-y-auto no-scrollbar pb-10 px-4 md:px-6 lg:px-0">
            {loading ? (
              <div className="text-center text-slate-400 font-bold py-10">Сэдэв ачааллаж байна...</div>
            ) : topics.length === 0 ? (
              <div className="text-center text-red-500 font-bold py-10">Сэдэв олдсонгүй</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                {topics.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() =>
                      !levelLocked &&
                      router.push(
                        `/dictation?topic=${encodeURIComponent(topic.title)}&topicId=${encodeURIComponent(String(topic.id))}&grade=${encodeURIComponent(gradeNumber)}&level=${encodeURIComponent(levelParam)}`,
                      )
                    }
                    className={`group relative aspect-[0.9/1] md:aspect-auto md:h-[220px] p-4 lg:p-6 rounded-[24px] lg:rounded-[35px] bg-white border border-slate-100 border-b-[4px] lg:border-b-[8px] transition-all flex flex-col items-center justify-center text-center shadow-[0_4px_15px_rgba(0,0,0,0.02)] ${
                      levelLocked
                        ? "cursor-not-allowed opacity-70"
                        : "cursor-pointer active:border-b-0 active:translate-y-1 hover:shadow-[0_20px_40px_rgba(93,49,145,0.08)] hover:border-purple-100"
                    }`}
                    style={{ borderBottomColor: `${topic.color}40` }}
                  >
                    <div
                      className="w-12 h-12 lg:w-16 lg:h-16 rounded-[18px] lg:rounded-[24px] flex items-center justify-center text-2xl lg:text-4xl mb-3 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-inner"
                      style={{ backgroundColor: `${topic.color}10` }}
                    >
                      {topic.icon}
                    </div>
                    <h3 className="font-black text-[11px] md:text-sm lg:text-base text-slate-800 leading-tight mb-3 lg:mb-4 group-hover:text-[#5D3191] transition-colors line-clamp-2">
                      {topic.title}
                    </h3>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg lg:rounded-xl text-white shadow-md" style={{ backgroundColor: topic.color }}>
                      {levelLocked ? (
                        <>
                          <Lock size={10} className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                          <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest">ТҮГЖЭЭТЭЙ</span>
                        </>
                      ) : (
                        <>
                          <Play size={10} fill="white" className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                          <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest">Тоглох</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            {levelLocked && (
              <div className="mt-6 text-center text-red-500 font-black text-sm">
                Энэ түвшин түгжээтэй байна. Өмнөх түвшний 8 сэдвээ бүрэн дуусгаарай.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
