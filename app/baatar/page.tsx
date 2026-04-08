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
      { id: 1,  src: "/engiin1.png", type: "Common" },
      { id: 2,  src: "/engiin2.png", type: "Common" },
      { id: 3,  src: "/engiin3.png", type: "Common" },
      { id: 4,  src: "/engiin4.png", type: "Common" },
      { id: 5,  src: "/engiin5.png", type: "Common" },
    ],
  },

  {
    rankName: "ХҮЧИРХЭГ БААТРУУД",
    requiredStars: 150,
    color: "#9254DE",
    heroes: [
      { id: 11,  src: "/huch1.png", type: "Epic" },
      { id: 12,  src: "/huch2.png", type: "Epic" },
      { id: 13,  src: "/huch3.png", type: "Epic" },
      { id: 14,  src: "/huch4.png", type: "Epic" },
      { id: 15,  src: "/huch5.png", type: "Epic" },
    ],
  },
    {
    rankName: "АНИМЕ БААТРУУД",
    requiredStars: 50,
    color: "#4D96FF",
    heroes: [
      { id: 6,  src: "/an1.png", type: "Rare" },
      { id: 7,  src: "/an2.png", type: "Rare" },
      { id: 8,  src: "/an3.png", type: "Rare" },
      { id: 9,  src: "/an4.png", type: "Rare" },
      { id: 10,  src: "/an5.png", type: "Rare" },
    ],
  },
  {
    rankName: "ДОМОГТ БААТРУУД",
    requiredStars: 240,
    color: "#FFD93D",
    heroes: [
      { id: 16,  src: "/hovor11.png", type: "Legendary" },
      { id: 17,  src: "/hovor2.png", type: "Legendary" },
      { id: 18,  src: "/hovor3.png", type: "Legendary" },
      { id: 19,  src: "/hovor4.png", type: "Legendary" },
      { id: 20,  src: "/hovor5.png", type: "Ultimate" },
    ],
  },
];

type SelectedHero = {
  id: number;
  name: string;
  src: string;
  type: string;
};

export default function BaatarPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [userStars, setUserStars] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [heroesLockedMap, setHeroesLockedMap] = useState<Record<number, boolean>>({});
  const [heroesMetaMap, setHeroesMetaMap] = useState<Record<number, { name?: string; image?: string }>>({});

  useEffect(() => {
    const hydrateHeroes = async () => {
      if (!isLoaded) return;
      const fallbackStars = Number(localStorage.getItem("userStars") || "0");
      setUserStars(fallbackStars);

      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const [personalStarsRes, unlockHeroesRes] = await Promise.all([
          fetch(`/api/personal-stars?userId=${user.id}`),
          fetch(`/api/unlock-heroes?userId=${user.id}`),
        ]);

        if (personalStarsRes.ok) {
          const personalStarsData = await personalStarsRes.json();
          setUserStars(Number(personalStarsData?.score ?? 0));
        }

        if (unlockHeroesRes.ok) {
          const unlockData = await unlockHeroesRes.json();
          const nextLockedMap: Record<number, boolean> = {};
          const nextMetaMap: Record<number, { name?: string; image?: string }> = {};
          for (const hero of unlockData.heroes || []) {
            nextLockedMap[hero.id] = Boolean(hero.isLocked);
            nextMetaMap[hero.id] = { name: hero.name, image: hero.image };
          }
          setHeroesLockedMap(nextLockedMap);
          setHeroesMetaMap(nextMetaMap);
        }
      } catch (e) {
        console.error("Error loading heroes");
      } finally {
        setIsLoading(false);
      }
    };
    hydrateHeroes();
  }, [isLoaded, user?.id]);

  const handleSelectHero = async (hero: SelectedHero, isLocked: boolean) => {
    if (isLocked) return;
    localStorage.setItem("selectedHero", JSON.stringify(hero));
    window.dispatchEvent(new Event("storage"));
    try {
      await fetch("/api/select-hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero }),
      });
    } catch (e) {}
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#FDFCFE] pb-24 pt-28 md:pt-40 overflow-x-hidden">
      <main className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section - Font жижигсгэсэн */}
        <div className="text-center mb-16 md:mb-24">
          <motion.h1
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-[#5D3191] text-2xl md:text-5xl font-[1000] mb-3 italic uppercase tracking-tighter leading-tight"
          >
            БААТАР <span className="text-[#8DC63F]">СОНГОХ</span>
          </motion.h1>
          <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-purple-50 shadow-sm">
            <Zap className="w-3 h-3 fill-[#FFD93D] text-[#FFD93D]" />
            <p className="text-[#5D3191] font-black uppercase text-[8px] md:text-[9px] tracking-widest">
              Өөрийн баатараа сонгоод аялалаа эхлээрэй
            </p>
          </div>
        </div>

        {/* Ranks Section */}
        <div className="space-y-24">
          {HERO_RANKS.map((rank, rankIndex) => {
            const isRankLocked = userStars < rank.requiredStars;

            return (
              <div key={rankIndex}>
                {/* Rank Header */}
                <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md" style={{ backgroundColor: isRankLocked ? "#E5E7EB" : rank.color }}>
                    {isRankLocked ? <Lock className="w-6 h-6" /> : <Trophy className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-[1000] text-[#5D3191] uppercase italic leading-none">{rank.rankName}</h2>
                    <p className={`text-[9px] font-black uppercase mt-1 ${isRankLocked ? "text-red-400" : "text-[#8DC63F]"}`}>
                      {isRankLocked ? `${rank.requiredStars} Од хэрэгтэй` : "Нээлттэй"}
                    </p>
                  </div>
                </div>

                {/* Heroes Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-5 md:gap-8">
                  {rank.heroes.map((hero, index) => {
                    const apiHero = heroesMetaMap[hero.id];
                    const heroName = apiHero?.name || hero.type;
                    const heroSrc = apiHero?.image || hero.src;
                    const isHeroLocked = heroesLockedMap[hero.id] ?? isRankLocked;

                    return (
                      <motion.div
                        key={hero.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div
                          onClick={() => handleSelectHero({ ...hero, name: heroName, src: heroSrc }, isHeroLocked)}
                          className={`
                            relative bg-white rounded-[40px] p-5 md:p-7 border-2 transition-all duration-500 group
                            ${isHeroLocked 
                                ? "opacity-50 grayscale cursor-not-allowed border-gray-100" 
                                : "border-[#8DC63F] cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(141,198,63,0.15)] hover:bg-[#8DC63F]/5"
                            }
                          `}
                        >
                          {/* Бөөрөнхий зураг + Hover Zoom */}
                          <div className="relative aspect-square w-full mb-5 rounded-full overflow-hidden bg-gray-50">
                            <Image
                              src={heroSrc}
                              alt={heroName}
                              fill
                              sizes="200px"
                              className={`object-cover transition-transform duration-700 ${!isHeroLocked && "group-hover:scale-115"}`}
                            />
                            {isHeroLocked && (
                              <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="text-center">
                            <h3 className={`font-black text-[10px] md:text-[11px] uppercase mb-4 truncate transition-colors ${isHeroLocked ? "text-gray-400" : "text-[#5D3191] group-hover:text-[#8DC63F]"}`}>
                              {heroName}
                            </h3>
                            <button
                              className={`w-full py-2.5 rounded-2xl text-[9px] font-black uppercase transition-all ${
                                isHeroLocked ? "bg-gray-100 text-gray-300" : "bg-[#5D3191] text-white group-hover:bg-[#8DC63F] group-hover:shadow-lg"
                              }`}
                            >
                              {isHeroLocked ? "Түгжээтэй" : "Сонгох"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}