"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Volume2,
  ArrowRight,
  Star,
  X,
  PlayCircle,
} from "lucide-react";

const Hero = () => {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <section className="relative w-full min-h-[80vh] lg:min-h-[70vh] flex items-center pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden bg-[#FDFCFE]">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[#F3E8FF] rounded-full blur-[100px] md:blur-[150px] -z-0 opacity-50 lg:opacity-80" />

      <div className="container mx-auto px-5 sm:px-8 md:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
        <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1 flex flex-col items-center lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 text-[#5D3191] px-4 py-2 rounded-full shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8DC63F]" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em]">
              Цээж бичгийн ухаалаг туслах
            </span>
          </motion.div>

          <div className="space-y-4 md:space-y-5">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[#5D3191] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-[1000] leading-[1.2] lg:leading-[1.1] tracking-tighter max-w-xl mx-auto lg:mx-0"
            >
              Сонсоод <span className="text-[#8DC63F]">бичиж</span>{" "}
              <br className="hidden sm:block" />
              эхэлье!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-sm md:text-base max-w-lg leading-relaxed font-bold mx-auto lg:mx-0 pt-1 px-2 lg:px-0"
            >
              Чиний доторх "Баатар" сэрэхэд бэлэн үү?{" "}
              <br className="hidden md:block" />
              Зөв Бичгийн Баатар чамд үг бүрийг зөв бичиж сурахад туслах болно.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 w-full sm:w-auto px-6 sm:px-0"
          >
            <button
              onClick={() => {
                document
                  .getElementById("class-selection")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="relative group w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-[#4a2775] rounded-[18px] md:rounded-[22px] translate-y-1" />
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ y: 3 }}
                className="relative bg-[#5D3191] text-white px-8 py-4 md:px-10 md:py-5 rounded-[18px] md:rounded-[22px] font-black text-[11px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-transform shadow-lg"
              >
                Бичиж эхлэх
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                <motion.div
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </motion.div>
              </motion.div>
            </button>
            <button
              onClick={() => setShowTutorial(true)}
              className="relative group w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-gray-100 rounded-[18px] md:rounded-[22px] translate-y-1" />
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ y: 3 }}
                className="relative bg-white border border-purple-100 text-[#5D3191] px-8 py-4 md:px-10 md:py-5 rounded-[18px] md:rounded-[22px] font-black text-[11px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-transform shadow-sm hover:border-purple-200"
              >
                <Volume2 className="w-4 h-4 text-[#8DC63F]" />
                Заавар үзэх
              </motion.div>
            </button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 flex justify-center lg:justify-end order-1 lg:order-2"
        >
          <div className="relative w-full max-w-[280px] sm:max-w-[380px] lg:max-w-[480px] aspect-[4/3] rounded-[24px] md:rounded-[40px] overflow-hidden border-[4px] md:border-[8px] border-white shadow-[0_20px_50px_rgba(93,49,145,0.1)] bg-white group">
            <img
              src="/huuhed.png"
              alt="Dictation Practice"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-3 md:bottom-6 left-3 md:left-6 bg-white/90 backdrop-blur-sm px-3 py-2 md:px-4 md:py-3 rounded-[16px] md:rounded-[20px] shadow-2xl border border-purple-50 flex items-center gap-2 md:gap-3"
            >
              <div className="w-7 h-7 md:w-9 md:h-9 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-100">
                <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-white fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[#5D3191] font-[1000] text-[8px] md:text-[10px] uppercase tracking-tighter leading-none">
                  Шинэ сорилт
                </span>
                <span className="text-gray-400 font-bold text-[7px] md:text-[8px] uppercase mt-0.5 md:mt-1">
                  Бэлэн боллоо
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <AnimatePresence>
        {showTutorial && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTutorial(false)}
              className="absolute inset-0 bg-[#5D3191]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-[30px] md:rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.2)] overflow-hidden"
            >
              <div className="bg-[#5D3191] p-6 md:p-8 text-white relative">
                <button
                  onClick={() => setShowTutorial(false)}
                  className="absolute top-5 right-5 hover:rotate-90 transition-transform"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6 opacity-60 hover:opacity-100" />
                </button>
                <PlayCircle className="w-10 h-10 md:w-12 md:h-12 text-[#8DC63F] mb-4" />
                <h3 className="text-xl md:text-2xl font-[1000] uppercase tracking-tighter italic">
                  Хэрхэн тоглох вэ?
                </h3>
              </div>

              <div className="p-6 md:p-8 space-y-5 md:space-y-6">
                {[
                  {
                    step: "1",
                    text: "Анхааралтай сайн сонсоорой.",
                    color: "#8DC63F",
                  },
                  {
                    step: "2",
                    text: "Сонссон үгээ алдаагүй зөв бичээрэй.",
                    color: "#5D3191",
                  },
                  {
                    step: "3",
                    text: "Баатар болж одоогоо цуглуулаарай!",
                    color: "#FBBF24",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="flex items-center gap-4 group"
                  >
                    <div
                      style={{ backgroundColor: item.color }}
                      className="w-9 h-9 md:w-10 md:h-10 rounded-[14px] md:rounded-2xl flex items-center justify-center text-white font-black text-base md:text-lg shadow-lg group-hover:scale-110 transition-transform shrink-0"
                    >
                      {item.step}
                    </div>
                    <p className="text-[#5D3191] font-bold text-base md:text-lg leading-tight text-pretty">
                      {item.text}
                    </p>
                  </motion.div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowTutorial(false)}
                  className="w-full bg-[#8DC63F] text-white py-4 md:py-5 rounded-[18px] md:rounded-[22px] font-black uppercase tracking-widest text-[11px] md:text-xs shadow-[0_4px_0_0_#5e852a] active:shadow-none active:translate-y-1 transition-all mt-4"
                >
                  Эхэлье!
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
