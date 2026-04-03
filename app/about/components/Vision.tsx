"use client";
import React from "react";
import { motion } from "framer-motion";
import { Target, Eye, Sparkles, BookOpen, Star, ArrowRight } from "lucide-react";

const Vision = () => {
  return (
    <section className="w-full py-10 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl md:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-20 ">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 rounded-xl border border-green-100">
              <Target className="text-[#8DC63F] w-4 h-4" />
              <span className="text-[#8DC63F] font-black text-[10px] uppercase tracking-widest">Бидний Зорилго</span>
            </div>
            
            <h2 className="text-[#5D3191] text-4xl md:text-5xl font-black tracking-tighter leading-[1.15]">
              Бичих соёлыг <br /> 
              <span className="text-[#8DC63F]">хялбар</span> болгоно
            </h2>
            
            <p className="text-gray-400 text-base md:text-lg leading-relaxed font-bold max-w-lg">
              Монгол хэлний цээж бичгийг дижитал шилжилттэй холбож, хүүхэд бүрт эх хэлээрээ <span className="text-[#5D3191]">алдаагүй зөв</span> бичихийг сургах нь бидний зорилго.
            </p>

            <div className="flex items-center gap-8 pt-4 border-t border-gray-50">
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-[#5D3191]">100+</span>
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Цээж бичиг</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-[#8DC63F]">ҮНЭГҮЙ</span>
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Ашиглах боломж</span>
               </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="relative w-full aspect-[4/3] rounded-[45px] shadow-[0_20px_50px_rgba(93,49,145,0.06)] overflow-hidden border-[10px] border-white z-10 bg-[#7B599E]">
              <img 
                src="/bid.png" 
                className="w-full h-full object-cover"
                alt="Our Purpose"
              />
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          <motion.div 
  initial={{ opacity: 0, scale: 0.95 }}
  whileInView={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="w-full lg:w-1/2 flex justify-center lg:justify-start"
>
  <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-[45px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border-[10px] border-white z-10 bg-[#1A1625]">
    <img 
      src="/alsiinharaa.png" 
      className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-700" 
      alt="Our Vision"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
  </div>
</motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 space-y-6 lg:pl-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-xl border border-purple-100">
              <Eye className="text-[#5D3191] w-4 h-4" />
              <span className="text-[#5D3191] font-black text-[10px] uppercase tracking-widest">Алсын Хараа</span>
            </div>
            
            <h2 className="text-[#5D3191] text-4xl md:text-5xl font-black tracking-tighter leading-[1.15]">
              Зөв Бичгийн <br /> 
              <span className="text-purple-200">Баатрууд</span>
            </h2>

            <p className="text-gray-400 text-base md:text-lg leading-relaxed font-bold max-w-lg">
              Бид зөвхөн веб сайт биш, харин Монгол хүүхэд бүрийг эх хэлээрээ <span className="text-[#8DC63F]">алдаагүй</span> зөв сайхан бичиж сургах зорилготой.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
               <div className="flex items-center gap-2 bg-[#FDFCFE] px-5 py-3 rounded-2xl border border-gray-100 shadow-sm transition-hover hover:border-yellow-100">
                  <Star className="text-yellow-400 w-4 h-4 fill-yellow-400" />
                  <span className="text-[#5D3191] font-black text-xs">Ирээдүйгээ хамт бүтээе</span>
               </div>
               <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm transition-hover hover:border-green-100">
                  <BookOpen className="text-[#8DC63F] w-4 h-4" />
                  <span className="text-gray-400 font-black text-xs uppercase tracking-tighter">100% Онлайн</span>
               </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Vision;