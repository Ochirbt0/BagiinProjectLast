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
  {
    rankName: "ХҮЧИРХЭГ БААТРУУД",
    requiredStars: 150,
    color: "#9254DE",
    heroes: [
      { id: 11, name: "ОДНЫ ХҮҮ", src: "/7.png", type: "Epic" },
      { id: 12, name: "ЭРДЭМТЭН", src: "/8.png", type: "Epic" },
      { id: 13, name: "ГҮЙЦЭГЧ", src: "/15.png", type: "Epic" },
      { id: 14, name: "СҮҮДЭР", src: "/2.png", type: "Epic" },
      { id: 15, name: "РОБОТ", src: "/9.png", type: "Epic" },
    ],
  },
  {
    rankName: "ДОМОГТ БААТРУУД",
    requiredStars: 240,
    color: "#FFD93D",
    heroes: [
      { id: 16, name: "ЭЗЭН ХААН", src: "/5.png", type: "Legendary" },
      { id: 17, name: "ТЭНГЭРИЙН ХҮҮ", src: "/18.png", type: "Legendary" },
      { id: 18, name: "ГАЛТ ЛУУ", src: "/19.png", type: "Legendary" },
      { id: 19, name: "ОДНЫ ХААН", src: "/20.png", type: "Legendary" },
      { id: 20, name: "АЛТАН БААТАР", src: "/10.png", type: "Ultimate" },
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
  const [heroesLockedMap, setHeroesLockedMap] = useState<Record<number, boolean>>(
    {},
  );
  const [heroesMetaMap, setHeroesMetaMap] = useState<
    Record<number, { name?: string; image?: string }>
  >({});
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const hydrateHeroes = async () => {
      if (!isLoaded) return;

      const fallbackStars = Number(localStorage.getItem("userStars") || "0");
      setUserStars(Number.isFinite(fallbackStars) ? fallbackStars : 0);

      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setLoadError(null);

        const [personalStarsRes, unlockHeroesRes] = await Promise.all([
          fetch(`/api/personal-stars?userId=${user.id}`),
          fetch(`/api/unlock-heroes?userId=${user.id}`),
        ]);

        if (personalStarsRes.ok) {
          const personalStarsData = (await personalStarsRes.json()) as {
            score?: number;
          };
          const currentStars = Number(personalStarsData?.score ?? 0);
          setUserStars(currentStars);
          localStorage.setItem("userStars", String(currentStars));
        }

        if (unlockHeroesRes.ok) {
          const unlockData = (await unlockHeroesRes.json()) as {
            userStars?: number;
            heroes?: Array<{
              id: number;
              name: string;
              image: string;
              isLocked: boolean;
            }>;
          };

          if (typeof unlockData.userStars === "number") {
            setUserStars(unlockData.userStars);
            localStorage.setItem("userStars", String(unlockData.userStars));
          }

          const nextLockedMap: Record<number, boolean> = {};
          const nextMetaMap: Record<number, { name?: string; image?: string }> =
            {};

          for (const hero of unlockData.heroes || []) {
            nextLockedMap[hero.id] = Boolean(hero.isLocked);
            nextMetaMap[hero.id] = {
              name: hero.name,
              image: hero.image,
            };
          }

          setHeroesLockedMap(nextLockedMap);
          setHeroesMetaMap(nextMetaMap);
        } else {
          setLoadError("Баатрын мэдээлэл ачаалахад асуудал гарлаа.");
        }
      } catch {
        setLoadError("Баатрын мэдээлэл ачаалахад асуудал гарлаа.");
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
    } catch {
      // ignore network errors; local avatar still selected
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#FDFCFE] pb-20 pt-28 md:pt-40 overflow-x-hidden font-sans">
      <main className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 md:mb-24">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-[#5D3191] text-2xl md:text-6xl font-[1000] mb-3 italic uppercase tracking-tighter leading-tight"
          >
            БААТАР <span className="text-[#8DC63F]">СОНГОХ </span>
          </motion.h1>
          <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-purple-50 shadow-sm">
            <Zap className="w-3 h-3 fill-[#FFD93D] text-[#FFD93D]" />
            <p className="text-[#5D3191] font-black uppercase text-[8px] md:text-[10px] tracking-widest">
              Шинэ баатруудыг цуглуул
            </p>
          </div>
        </div>

        <div className="space-y-20 md:space-y-32">
          {HERO_RANKS.map((rank, rankIndex) => {
            const isRankLocked = userStars < rank.requiredStars;

            return (
              <div key={rankIndex} className="relative">
                <div className="flex items-center gap-3 md:gap-5 mb-8 md:mb-12 border-b border-dashed border-gray-100 pb-5">
                  <div
                    className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl text-white shadow-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: isRankLocked ? "#E5E7EB" : rank.color,
                    }}
                  >
                    {isRankLocked ? (
                      <Lock className="w-5 h-5 md:w-8 md:h-8" />
                    ) : (
                      <Trophy className="w-5 h-5 md:w-8 md:h-8" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg md:text-3xl font-[1000] text-[#5D3191] uppercase tracking-tight italic leading-none mb-1 truncate">
                      {rank.rankName}
                    </h2>
                    <p
                      className={`text-[8px] md:text-xs font-black uppercase tracking-widest ${isRankLocked ? "text-red-400" : "text-[#8DC63F]"}`}
                    >
                      {isRankLocked
                        ? `${rank.requiredStars} Од хэрэгтэй`
                        : "Нээлттэй"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-10">
                  {rank.heroes.map((hero, index) => {
                    const apiHero = heroesMetaMap[hero.id];
                    const heroName = apiHero?.name || hero.name;
                    const heroSrc = apiHero?.image || hero.src;
                    const isHeroLocked =
                      heroesLockedMap[hero.id] ?? isRankLocked;

                    return (
                    <motion.div
                      key={hero.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div
                        onClick={() =>
                          handleSelectHero(
                            {
                              ...hero,
                              name: heroName,
                              src: heroSrc,
                            },
                            isHeroLocked,
                          )
                        }
                        className={`
                          relative bg-white rounded-[30px] md:rounded-[40px] p-4 md:p-8 border-2 md:border-4 transition-all duration-500 group overflow-hidden
                          ${
                            isHeroLocked
                              ? "border-gray-50 opacity-40 grayscale cursor-not-allowed shadow-none"
                              : "border-transparent hover:border-[#8DC63F] shadow-[0_10px_30px_rgba(93,49,145,0.06)] cursor-pointer hover:-translate-y-2"
                          }
                        `}
                      >
                        <div className="relative aspect-square w-full mb-4 md:mb-6">
                          <Image
                            src={heroSrc}
                            alt={heroName}
                            fill
                            sizes="(max-width: 768px) 40vw, 20vw"
                            className={`object-contain transition-transform duration-700 ${!isHeroLocked && "group-hover:scale-110"}`}
                          />
                        </div>

                        <div className="text-center relative z-10">
                          <h3
                            className={`font-black text-[9px] md:text-xs uppercase mb-3 md:mb-4 tracking-wider truncate ${isHeroLocked ? "text-gray-400" : "text-[#5D3191]"}`}
                          >
                            {heroName}
                          </h3>
                          <button
                            className={`
                            w-full py-2 md:py-3 rounded-xl md:rounded-2xl text-[8px] md:text-[9px] font-black uppercase transition-all
                            ${isHeroLocked ? "bg-gray-100 text-gray-300" : "bg-[#5D3191] group-hover:bg-[#8DC63F] text-white"}
                          `}
                          >
                            {isHeroLocked ? "Locked" : "Сонгох"}
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
        {(isLoading || loadError) && (
          <div className="mt-8 text-center">
            {isLoading ? (
              <p className="text-xs font-black uppercase tracking-widest text-[#5D3191]/60">
                Баатрын жагсаалт ачаалж байна...
              </p>
            ) : null}
            {!isLoading && loadError ? (
              <p className="text-xs font-black uppercase tracking-widest text-red-400">
                {loadError}
              </p>
            ) : null}
          </div>
        )}
      </main>

      <div className="fixed -top-20 -right-20 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-purple-50 rounded-full blur-[100px] md:blur-[120px] opacity-30 -z-10" />
      <div className="fixed -bottom-20 -left-20 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-green-50 rounded-full blur-[100px] md:blur-[120px] opacity-30 -z-10" />
    </div>
  );
}

// "use client";

// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Lock, Trophy, Zap } from "lucide-react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// // Өгөгдлийн бүтцийг зургийн дагуу жаахан өөрчлөв (нэрс болон төрлүүд)
// const HERO_RANKS = [
//   {
//     rankName: "Домогт баатрууд (Honor)",
//     requiredStars: 240,
//     color: "#5D3191", // Honor өнгө
//     heroes: [
//       { id: 16, src: "/5.png", type: "Honor" },
//       { id: 17, src: "/18.png", type: "Honor" },
//       { id: 18, src: "/19.png", type: "Honor" },
//       { id: 19, src: "/20.png", type: "Honor" },
//       { id: 20, src: "/10.png", type: "Honor" },
//     ],
//   },
//   {
//     rankName: "Хувиршгүй баатрууд (IlluHushuu)",
//     requiredStars: 150,
//     color: "#4D96FF", // Энэ өнгө зургийн дагуу биш ч, ялгах үүднээс үлдээв
//     heroes: [
//       { id: 11, src: "/7.png", type: "IlluHushuu" },
//       { id: 12, src: "/8.png", type: "IlluHushuu" },
//       { id: 13, src: "/15.png", type: "IlluHushuu" },
//       { id: 14, src: "/2.png", type: "IlluHushuu" },
//       { id: 15, src: "/9.png", type: "IlluHushuu" },
//     ],
//   },
//   {
//     rankName: "Ховор баатрууд (Anai Huchtei)",
//     requiredStars: 50,
//     color: "#4D96FF",
//     heroes: [
//       { id: 6, src: "/4.png", type: "Anai Huchtei" },
//       { id: 7, src: "/6.png", type: "Anai Huchtei" },
//       { id: 8, src: "/13.png", type: "Anai Huchtei" },
//       { id: 9, src: "/14.png", type: "Anai Huchtei" },
//       { id: 10, src: "/12.png", type: "Anai Huchtei" },
//     ],
//   },
//   {
//     rankName: "Энгийн баатрууд (Engiin)",
//     requiredStars: 0,
//     color: "#5D3191",
//     heroes: [
//       { id: 1, src: "/16.png", type: "Engiin" },
//       { id: 2, src: "/1.png", type: "Engiin" },
//       { id: 3, src: "/3.png", type: "Engiin" },
//       { id: 4, src: "/17.png", type: "Engiin" },
//       { id: 5, src: "/11.png", type: "Engiin" },
//     ],
//   },
// ];

// export default function BaatarPage() {
//   const router = useRouter();
//   const [userStars, setUserStars] = useState(0);

//   useEffect(() => {
//     const savedStars = localStorage.getItem("userStars") || "0";
//     setUserStars(parseInt(savedStars));
//   }, []);

//   const handleSelectHero = (hero: any, isLocked: boolean) => {
//     if (isLocked) return;
//     localStorage.setItem("selectedHero", JSON.stringify(hero));
//     window.dispatchEvent(new Event("storage"));
//     router.push("/");
//   };

//   return (
//     <div className="min-h-screen bg-[#F8F9FA] pb-20 pt-28 md:pt-40 overflow-x-hidden font-sans">
//       <main className="container mx-auto px-4 md:px-6 max-w-7xl">
//         <div className="text-center mb-16 md:mb-20">
//           <motion.h1
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             className="text-[#5D3191] text-3xl md:text-5xl font-[1000] mb-3 italic uppercase tracking-tighter leading-tight"
//           >
//             Миний <span className="text-[#8DC63F]">баатрууд</span>
//           </motion.h1>

//           <div className="inline-flex items-center gap-3 bg-white px-5 py-2 rounded-full border border-purple-100 shadow-[0_2px_10px_rgba(93,49,145,0.03)]">
//             <Zap className="w-4 h-4 fill-[#FFD93D] text-[#FFD93D]" />
//             <p className="text-[#5D3191] font-black uppercase text-[10px] md:text-[12px] tracking-widest">
//               Зөвхөн нээсэн баатруудаа сонгох боломжтой
//             </p>
//           </div>
//         </div>

//         <div className="space-y-16 md:space-y-20">
//           {HERO_RANKS.map((rank, rankIndex) => {
//             const isRankLocked = userStars < rank.requiredStars;

//             return (
//               <div
//                 key={rankIndex}
//                 className="relative bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)]"
//               >
//                 {/* Гарчиг болон Төлөв - Зургийн дагуу зүүн талд */}
//                 <div className="mb-10 md:mb-12 border-b border-gray-100 pb-6 flex items-center justify-between gap-4">
//                   <div className="flex items-center gap-4">
//                     <div
//                       className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl text-white shadow-md flex items-center justify-center shrink-0"
//                       style={{
//                         backgroundColor: isRankLocked ? "#E5E7EB" : rank.color,
//                       }}
//                     >
//                       {isRankLocked ? (
//                         <Lock className="w-6 h-6 md:w-7 md:h-7 text-gray-400" />
//                       ) : (
//                         <Trophy className="w-6 h-6 md:w-7 md:h-7" />
//                       )}
//                     </div>
//                     <div>
//                       <h2 className="text-xl md:text-2xl font-[900] text-[#5D3191] uppercase tracking-tight italic leading-tight">
//                         {rank.rankName}
//                       </h2>
//                     </div>
//                   </div>

//                   <div
//                     className={`px-4 py-1.5 rounded-full text-[10px] md:text-[12px] font-black uppercase tracking-widest flex items-center gap-2 ${isRankLocked ? "bg-red-50 text-red-500 border border-red-100" : "bg-green-50 text-[#8DC63F] border border-green-100"}`}
//                   >
//                     {isRankLocked && <Lock className="w-3.5 h-3.5" />}
//                     {isRankLocked
//                       ? `${rank.requiredStars} Од хэрэгтэй`
//                       : "Нээлттэй"}
//                   </div>
//                 </div>

//                 {/* Баатруудын Grid - 5 баганатай */}
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
//                   {rank.heroes.map((hero, index) => (
//                     <motion.div
//                       key={hero.id}
//                       initial={{ opacity: 0, scale: 0.95 }}
//                       whileInView={{ opacity: 1, scale: 1 }}
//                       viewport={{ once: true }}
//                       transition={{ delay: index * 0.05 }}
//                     >
//                       <div
//                         onClick={() => handleSelectHero(hero, isRankLocked)}
//                         className={`
//                           relative bg-[#FDFCFE] rounded-[30px] p-6 md:p-7 border-2 transition-all duration-300 group overflow-hidden
//                           ${
//                             isRankLocked
//                               ? "border-gray-100 opacity-60grayscale cursor-not-allowed shadow-none"
//                               : "border-[#5D3191]/5 hover:border-[#8DC63F] hover:bg-white cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(93,49,145,0.08)]"
//                           }
//                         `}
//                       >
//                         {/* Зургийн контейнер */}
//                         <div className="relative aspect-square w-full mb-6 md:mb-7 rounded-2xl bg-white p-2 border border-gray-50 flex items-center justify-center">
//                           <Image
//                             src={hero.src}
//                             alt=""
//                             fill
//                             sizes="(max-width: 768px) 40vw, (max-width: 1024px) 25vw, 20vw"
//                             className={`object-contain transition-transform duration-700 ${!isRankLocked && "group-hover:scale-110"}`}
//                           />

//                           {isRankLocked && (
//                             <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
//                               <Lock className="w-8 h-8 text-gray-300" />
//                             </div>
//                           )}
//                         </div>

//                         {/* Текст болон товчлуур */}
//                         <div className="text-center relative z-10">
//                           <p
//                             className={`text-[9px] md:text-[11px] font-medium uppercase mb-4 tracking-wider ${isRankLocked ? "text-gray-300" : "text-[#8DC63F]"}`}
//                           >
//                             {hero.type}
//                           </p>

//                           <button
//                             className={`
//                             w-full py-2.5 md:py-3 rounded-full text-[10px] md:text-[12px] font-black uppercase transition-all duration-300 border
//                             ${isRankLocked ? "bg-gray-50 text-gray-300 border-gray-100" : "bg-white text-[#5D3191] border-[#5D3191]/10 group-hover:bg-[#5D3191] group-hover:text-white group-hover:border-transparent"}
//                           `}
//                           >
//                             {isRankLocked ? "Түгжигдсэн" : "Сонгох"}
//                           </button>
//                         </div>

//                         {!isRankLocked && (
//                           <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#8DC63F]/5 rounded-full blur-2xl group-hover:bg-[#8DC63F]/10 transition-all" />
//                         )}
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </main>

//       <div className="fixed -top-40 -right-40 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-purple-50 rounded-full blur-[100px] md:blur-[150px] opacity-40 -z-10" />
//       <div className="fixed -bottom-40 -left-40 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-green-50 rounded-full blur-[100px] md:blur-[150px] opacity-40 -z-10" />
//     </div>
//   );
// }
