"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Sparkles, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const allHeroes = [
  { id: 1, name: "БААТАР 1", src: "/16.png", type: "Common" },
  { id: 2, name: "БААТАР 2", src: "/1.png", type: "Common" },
  { id: 3, name: "БААТАР 3", src: "/3.png", type: "Rare" },
  { id: 4, name: "БААТАР 4", src: "/17.png", type: "Rare" },
  { id: 5, name: "БААТАР 5", src: "/4.png", type: "Epic" },
  { id: 6, name: "БААТАР 6", src: "/6.png", type: "Epic" },
  { id: 7, name: "БААТАР 7", src: "/7.png", type: "Legendary" },
  { id: 8, name: "БААТАР 8", src: "/8.png", type: "Legendary" },
  { id: 9, name: "БААТАР 9", src: "/9.png", type: "Godly" },
  { id: 10, name: "БААТАР 10", src: "/10.png", type: "Ultimate" },
  { id: 11, name: "БААТАР 11", src: "/11.png", type: "Common" },
  { id: 12, name: "БААТАР 12", src: "/12.png", type: "Common" },
  { id: 13, name: "БААТАР 13", src: "/13.png", type: "Rare" },
  { id: 14, name: "БААТАР 14", src: "/14.png", type: "Rare" },
  { id: 15, name: "БААТАР 15", src: "/15.png", type: "Epic" },
  { id: 16, name: "БААТАР 16", src: "/2.png", type: "Epic" },
  { id: 17, name: "БААТАР 17", src: "/5.png", type: "Legendary" },
  { id: 18, name: "БААТАР 18", src: "/18.png", type: "Legendary" },
  { id: 19, name: "БААТАР 19", src: "/19.png", type: "Godly" },
  { id: 20, name: "БААТАР 20", src: "/20.png", type: "Ultimate" },
];

export default function BaatarPage() {
  const router = useRouter();

  const handleSelectHero = (hero: any, isLocked: boolean) => {
    if (isLocked) {
      alert("Энэ баатар түгжээтэй байна! Илүү их од цуглуулаарай.");
      return;
    }

    localStorage.setItem("selectedHero", JSON.stringify(hero));

    window.dispatchEvent(new Event("storage"));

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#FDFCFE] pb-20 pt-10 overflow-x-hidden">
      <div className="pt-16 pb-8 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <motion.div
              whileHover={{ x: -5 }}
              className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-purple-50 cursor-pointer group"
            >
              <ArrowLeft className="w-5 h-5 text-[#5D3191] group-hover:text-[#8DC63F] transition-colors" />
              <span className="text-[#5D3191] font-black uppercase text-xs tracking-widest">
                Буцах
              </span>
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
            <span className="text-[#5D3191] text-[10px] font-black uppercase tracking-widest">
              Баатруудын Цуглуулга
            </span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6">
        <div className="text-center mb-20 mt-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-[#5D3191] text-5xl md:text-7xl font-black mb-6 tracking-tighter"
          >
            ӨӨРИЙН <span className="text-[#8DC63F]">БААТРАА</span> СОНГО
          </motion.h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">
            Дуртай дүрээ сонгоод аялалаа эхлээрэй
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 md:gap-12">
          {allHeroes.map((hero, index) => {
            const isLocked = index >= 5;
            const isLast = index === allHeroes.length - 1;

            return (
              <motion.div
                key={hero.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100,
                }}
                className="relative"
              >
                <div
                  className={`
                  relative bg-white rounded-[40px] p-6 border-2 transition-all duration-500 group
                  ${
                    isLocked
                      ? "border-gray-100 opacity-80 grayscale shadow-none"
                      : "border-white hover:border-[#8DC63F] shadow-[0_20px_50px_rgba(93,49,145,0.05)] hover:shadow-[0_20px_60px_rgba(141,198,63,0.15)] cursor-pointer"
                  }
                  ${isLast && !isLocked ? "bg-gradient-to-b from-white to-yellow-50/30 border-yellow-100" : ""}
                `}
                >
                  <div
                    className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-md z-10
                    ${
                      isLocked
                        ? "bg-gray-400"
                        : hero.type === "Ultimate"
                          ? "bg-gradient-to-r from-red-500 to-orange-500 animate-bounce"
                          : hero.type === "Legendary"
                            ? "bg-yellow-500"
                            : hero.type === "Godly"
                              ? "bg-purple-600"
                              : "bg-[#5D3191]"
                    }
                  `}
                  >
                    {isLocked ? "Locked" : hero.type}
                  </div>

                  <div className="relative aspect-square w-full mb-6 mt-4">
                    <div
                      className={`absolute inset-0 rounded-[30px] transition-colors duration-500 ${isLocked ? "bg-gray-200/50" : "bg-gray-50/50 group-hover:bg-purple-50"}`}
                    />
                    <Image
                      src={hero.src}
                      alt={hero.name}
                      fill
                      sizes="250px"
                      className={`object-contain p-4 transition-transform duration-500 ${!isLocked && "group-hover:scale-110 group-hover:-rotate-3"}`}
                    />
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/80 p-3 rounded-full shadow-lg">
                          <Lock className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-center space-y-2">
                    <h3
                      className={`font-black text-lg uppercase tracking-tight ${isLocked ? "text-gray-400" : "text-[#5D3191]"}`}
                    >
                      {hero.name}
                    </h3>

                    <motion.button
                      onClick={() => handleSelectHero(hero, isLocked)}
                      whileHover={!isLocked ? { scale: 1.05 } : {}}
                      whileTap={!isLocked ? { scale: 0.95 } : {}}
                      className={`w-full mt-4 py-3 text-[10px] font-black uppercase rounded-[20px] transition-all shadow-lg
                        ${
                          isLocked
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-[#5D3191] hover:bg-[#8DC63F] text-white shadow-purple-100 hover:shadow-green-100"
                        }`}
                    >
                      {isLocked ? "Түгжээтэй" : "Сонгох"}
                    </motion.button>
                  </div>

                  {isLast && !isLocked && (
                    <div className="absolute -top-2 -right-2">
                      <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
      <div className="fixed -top-40 -right-40 w-[600px] h-[600px] bg-purple-50 rounded-full blur-[120px] opacity-40 -z-10" />
      <div className="fixed -bottom-40 -left-40 w-[600px] h-[600px] bg-green-50 rounded-full blur-[120px] opacity-40 -z-10" />
    </div>
  );
}
