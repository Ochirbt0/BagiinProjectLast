"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Trophy, Zap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const HERO_RANKS = [
  {
    rankName: "ЭНГИЙН БААТРУУД",
    requiredStars: 0,
    color: "#5D3191",
    heroes: [
      { id: 1, name: "АЯЛАГЧ", src: "/16.png", type: "Common" },
      { id: 2, name: "ТУСЛАХ", src: "/1.png", type: "Common" },
      { id: 3, name: "ЗОРИГТОН", src: "/3.png", type: "Common" },
      { id: 4, name: "ИЛБЭЧИН", src: "/17.png", type: "Common" },
      { id: 5, name: "ХАЙГУУЛЧ", src: "/11.png", type: "Common" },
    ],
  },
  {
    rankName: "СОНГОДОГ БААТРУУД",
    requiredStars: 50,
    color: "#4D96FF",
    heroes: [
      { id: 6, name: "МЭРГЭН", src: "/4.png", type: "Rare" },
      { id: 7, name: "БААТАР", src: "/6.png", type: "Rare" },
      { id: 8, name: "ХАМГААЛАГЧ", src: "/13.png", type: "Rare" },
      { id: 9, name: "НИНЖА", src: "/14.png", type: "Rare" },
      { id: 10, name: "РЕНЖЕР", src: "/12.png", type: "Rare" },
    ],
  },
];

export default function BaatarPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [userStars, setUserStars] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStars = localStorage.getItem("userStars") || "0";
      setUserStars(parseInt(savedStars));
    }
  }, []);

  const handleSelectHero = (hero: any, isLocked: boolean) => {
    if (isLocked) return;
    localStorage.setItem("selectedHero", JSON.stringify(hero));
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#FDFCFE] pb-24 pt-20 font-sans selection:bg-[#8DC63F]/20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-[#5D3191] text-4xl md:text-6xl font-[1000] mb-4 italic uppercase tracking-tighter">
              БААТАР <span className="text-[#8DC63F]">СОНГОХ</span>
            </h1>
            <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border border-purple-100 shadow-sm">
              <Zap className="w-4 h-4 fill-[#FFD93D] text-[#FFD93D]" />
              <span className="text-[#5D3191] font-black uppercase text-[10px] tracking-[0.25em]">
                ӨӨРИЙН ДҮРЭЭ СОНГООД АЯЛЛАА ЭХЛҮҮЛ
              </span>
            </div>
          </motion.div>
        </div>

        {HERO_RANKS.map((rank, rankIndex) => {
          const isRankLocked = userStars < rank.requiredStars;

          return (
            <div key={rankIndex} className="mb-24 last:mb-0">
              {/* Rank Info */}
              <div className="flex flex-col items-center mb-12">
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transform rotate-3"
                    style={{
                      backgroundColor: isRankLocked ? "#CBD5E1" : rank.color,
                    }}
                  >
                    {isRankLocked ? (
                      <Lock className="w-6 h-6" />
                    ) : (
                      <Trophy className="w-6 h-6" />
                    )}
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black text-[#5D3191] italic uppercase tracking-tight">
                    {rank.rankName}
                  </h2>
                </div>
                <div
                  className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] ${isRankLocked ? "bg-red-50 text-red-400" : "bg-green-50 text-[#8DC63F]"}`}
                >
                  {isRankLocked
                    ? `${rank.requiredStars} ОД ЦУГЛУУЛЖ НЭЭНЭ`
                    : "НЭЭЛТТЭЙ"}
                </div>
              </div>

              {/* Character Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-10">
                {rank.heroes.map((hero, index) => (
                  <motion.div
                    key={hero.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={!isRankLocked ? { scale: 1.05, y: -10 } : {}}
                    onClick={() => handleSelectHero(hero, isRankLocked)}
                    className="flex justify-center"
                  >
                    <div
                      className={`
                        relative aspect-[3/4] w-full bg-white rounded-[45px] md:rounded-[55px] p-2 border-[5px] transition-all duration-500
                        ${
                          isRankLocked
                            ? "border-gray-50 opacity-40 grayscale cursor-not-allowed"
                            : "border-transparent hover:border-[#8DC63F] shadow-[0_15px_45px_rgba(93,49,145,0.08)] cursor-pointer"
                        }
                      `}
                    >
                      <div className="relative w-full h-full bg-gray-50/50 rounded-[38px] md:rounded-[48px] overflow-hidden group">
                        <Image
                          src={hero.src}
                          alt={hero.name}
                          fill
                          priority={rankIndex === 0 && index < 3} // Эхний 3 зургийг түрүүлж ачаална (LCP warning-г арилгана)
                          sizes="(max-width: 768px) 45vw, 18vw" // Performance-д чухал
                          className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Interactive Selection Overlay */}
                        {!isRankLocked && (
                          <div className="absolute inset-0 bg-gradient-to-t from-[#5D3191]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-8">
                            <span className="bg-white text-[#5D3191] px-6 py-2.5 rounded-full font-[1000] text-[10px] uppercase shadow-2xl tracking-widest">
                              СОНГОХ
                            </span>
                          </div>
                        )}

                        {isRankLocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[2px]">
                            <Lock className="w-10 h-10 text-gray-400 opacity-50" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-100/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-green-100/30 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
