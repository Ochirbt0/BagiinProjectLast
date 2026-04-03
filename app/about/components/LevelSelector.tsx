"use client";
import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Star, Trophy } from "lucide-react";

const levels = [
  {
    id: "beginner",
    title: "Анхан",
    desc: "Үгс, авиа болон анхан шатны дүрмүүд",
    icon: <BookOpen className="w-8 h-8 text-[#8DC63F]" />,
    color: "border-[#8DC63F]",
    bgColor: "bg-[#8DC63F]/10",
  },
  {
    id: "intermediate",
    title: "Дунд",
    desc: "Өгүүлбэрийн бүтэц, цэг цэглэлийн дүрэм",
    icon: <Star className="w-8 h-8 text-[#5D3191]" />,
    color: "border-[#5D3191]",
    bgColor: "bg-[#5D3191]/10",
  },
  {
    id: "advanced",
    title: "Ахисан",
    desc: "Найруулан бичих ба ахисан түвшний дасгал",
    icon: <Trophy className="w-8 h-8 text-[#FFB800]" />,
    color: "border-[#FFB800]",
    bgColor: "bg-[#FFB800]/10",
  },
];

const LevelSelector = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-[#5D3191] mb-12 uppercase tracking-tighter"
        >
          Түвшин сонгох
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {levels.map((level, index) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }} // Хулгана очиход дээшээ бага зэрэг хөдөлнө
              className={`p-10 rounded-[40px] border-b-8 ${level.color} ${level.bgColor} flex flex-col items-center text-center shadow-sm cursor-pointer transition-all`}
            >
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-md">
                {level.icon}
              </div>
              <h3 className="text-2xl font-black text-[#333] mb-4 uppercase">{level.title}</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {level.desc}
              </p>
              <button className={`mt-auto px-10 py-2.5 rounded-full font-bold text-sm uppercase transition-colors
                ${index === 1 ? 'bg-[#5D3191] text-white' : 'border-2 border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                Эхлэх
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LevelSelector;