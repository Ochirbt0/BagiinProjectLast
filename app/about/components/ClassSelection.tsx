// "use client";
// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronRight, Sparkles } from "lucide-react";
// import IslandOverlay from "./IslandMap";

// const classes = [
//   {
//     id: 1,
//     grade: "1-р анги",
//     desc: "Богино үгсийг алдаагүй зөв бичиж сурцгаая.",
//     color: "#FF6B6B",
//     img: "/1-r aral.png",
//     effects: ["✏️", "📖", "✨"],
//   },
//   {
//     id: 2,
//     grade: "2-р анги",
//     desc: "Өгүүлбэр болон холбоо үгсийг цээжээр бичицгээе.",
//     color: "#4D96FF",
//     img: "/2-r aral.png",
//     effects: ["🔍", "📝", "🌟"],
//   },
//   {
//     id: 3,
//     grade: "3-р анги",
//     desc: "Алдаагүй зөв бичих чадвараа ахиулцгаая.",
//     color: "#6BCB77",
//     img: "/3-r aral.png",
//     effects: ["🧠", "📚", "⚡"],
//   },
//   {
//     id: 4,
//     grade: "4-р анги",
//     desc: "Цээжээр бичих чадвараа бататгаж сайжирцгаая.",
//     color: "#FFD93D",
//     img: "/4-r aral.png",
//     effects: ["✍️", "📖", "📝"],
//   },
//   {
//     id: 5,
//     grade: "5-р анги",
//     desc: "Аялалаа өндөрлүүлэхэд бид ойрхон байна.",
//     color: "#9254DE",
//     img: "/5-r aral.png",
//     effects: ["👑", "✍️", "📖"],
//   },
// ];

// const ClassSelectionFinal = () => {
//   const [hoveredId, setHoveredId] = useState<number | null>(null);
//   const [selectedId, setSelectedId] = useState<number | null>(null);
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);
//   if (!isMounted) return null;

//   const selectedIslandData = classes.find((c) => c.id === selectedId);

//   return (
//     <section
//       id="class-selection"
//       className="relative bg-white overflow-hidden font-sans py-16 md:py-32 text-[#5D3191]"
//     >
//       <div className="container mx-auto px-5 max-w-5xl relative z-10">
//         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 md:mb-32 border-b border-purple-50 pb-10 text-center md:text-left">
//           <div className="space-y-3">
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               className="inline-flex items-center gap-2 bg-[#F8F9FF] px-4 py-1.5 rounded-full border border-purple-50 mx-auto md:mx-0"
//             >
//               <Sparkles className="w-3.5 h-3.5 text-[#8DC63F]" />
//               <span className="text-[#8DC63F] font-black text-[10px] uppercase tracking-widest">
//                 Аялал эхэллээ
//               </span>
//             </motion.div>
//             <h2 className="text-3xl md:text-6xl font-[1000] tracking-tighter uppercase italic leading-none">
//               АНГИА <span className="text-[#8DC63F]">СОНГОХ</span>
//             </h2>
//           </div>
//           <div className="max-w-xs mx-auto md:mx-0">
//             <p className="text-gray-400 font-bold text-sm md:text-base">
//               Өөрийн түвшинд тохирсон ангиа сонгож, Баатар болоорой!
//             </p>
//           </div>
//         </div>

//         <div className="relative space-y-20 md:space-y-32">
//           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-10 md:opacity-20">
//             <svg width="100%" height="100%" viewBox="0 0 800 1200" fill="none">
//               <path
//                 d="M400 50 C 600 150, 200 250, 400 350 S 600 550, 400 650 S 200 850, 400 950 S 600 1150, 400 1250"
//                 stroke="#8DC63F"
//                 strokeWidth="6"
//                 strokeDasharray="12 12"
//               />
//             </svg>
//           </div>

//           {classes.map((item, index) => {
//             const isEven = index % 2 === 0;

//             return (
//               <motion.div
//                 key={item.id}
//                 initial={{ opacity: 0, x: isEven ? -20 : 20 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true, margin: "-100px" }}
//                 className={`flex items-center gap-6 md:gap-24 relative ${isEven ? "flex-row" : "flex-row-reverse"}`}
//               >
//                 <div className="relative w-[45%] md:w-[300px] aspect-square flex justify-center items-center group">
//                   <div
//                     className="absolute inset-0 rounded-full blur-[30px] md:blur-[60px] opacity-10"
//                     style={{ backgroundColor: item.color }}
//                   />

//                   <motion.div
//                     whileHover={{ scale: 1.1, rotate: isEven ? 5 : -5 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setSelectedId(item.id)}
//                     onMouseEnter={() => setHoveredId(item.id)}
//                     onMouseLeave={() => setHoveredId(null)}
//                     className="relative w-full h-full cursor-pointer z-10"
//                   >
//                     <img
//                       src={item.img}
//                       alt={item.grade}
//                       className="w-full h-full object-contain animate-float drop-shadow-xl"
//                     />

//                     <div
//                       className={`absolute top-0 ${isEven ? "right-0" : "left-0"} bg-white p-1 rounded-xl shadow-md border border-slate-50 z-20`}
//                     >
//                       <div
//                         className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-2xl flex items-center justify-center text-white font-[1000] text-[10px] md:text-xl"
//                         style={{ backgroundColor: item.color }}
//                       >
//                         {item.id}
//                       </div>
//                     </div>
//                   </motion.div>
//                 </div>

//                 <div
//                   className={`w-[55%] md:flex-1 flex flex-col ${isEven ? "items-start text-left" : "items-end text-right"} space-y-3 md:space-y-6`}
//                 >
//                   <div className="space-y-1 md:space-y-2">
//                     <h3 className="text-xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">
//                       {item.grade}
//                     </h3>
//                     <p className="text-gray-400 font-bold text-[10px] md:text-lg leading-tight">
//                       {item.desc}
//                     </p>
//                   </div>

//                   <motion.button
//                     onClick={() => setSelectedId(item.id)}
//                     whileHover={{
//                       scale: 1.05,
//                       backgroundColor: "#8DC63F",
//                       boxShadow: "0px 10px 20px rgba(141, 198, 63, 0.4)",
//                     }}
//                     whileTap={{ scale: 0.98 }}
//                     className="
//     group relative flex items-center gap-3
//     bg-[#5D3191] text-white
//     pl-8 pr-2 py-2
//     rounded-full font-black
//     text-[11px] md:text-xs
//     tracking-[0.2em] uppercase
//     shadow-xl transition-all duration-300
//   "
//                   >
//                     <span className="relative z-10">Эхлэх</span>

//                     <div
//                       className="
//     bg-white/20 p-2 rounded-full
//     group-hover:bg-white/40
//     transition-colors duration-300
//   "
//                     >
//                       <ChevronRight
//                         className="w-4 h-4 md:w-5 md:h-5 text-white"
//                         strokeWidth={3}
//                       />
//                     </div>
//                   </motion.button>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       </div>

//       <AnimatePresence>
//         {selectedId && selectedIslandData && (
//           <IslandOverlay
//             island={selectedIslandData}
//             onClose={() => setSelectedId(null)}
//           />
//         )}
//       </AnimatePresence>

//       <style>{`
//         @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
//         .animate-float { animation: float 5s ease-in-out infinite; }
//       `}</style>
//     </section>
//   );
// };

// export default ClassSelectionFinal;

"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import IslandOverlay from "./IslandMap";

const classes = [
  {
    id: 1,
    grade: "1-р анги",
    desc: " Богино үгсийг алдаагүй зөв бичиж сурцгаая.",
    color: "#FF6B6B",
    img: "/1-r aral.png",
    effects: ["✏️", "📖", "✨", "🔍", "📝", "🌟"],
  },
  {
    id: 2,
    grade: "2-р анги",
    desc: "Өгүүлбэр болон холбоо үгсийг цээжээр бичицгээе.",
    color: "#4D96FF",
    img: "/2-r aral.png",
    effects: ["🔍", "📝", "🌟", "✏️", "📖", "✨"],
  },
  {
    id: 3,
    grade: "3-р анги",
    desc: "Алдаагүй зөв бичих чадвараа ахиулцгаая.",
    color: "#6BCB77",
    img: "/3-r aral.png",
    effects: ["🧠", "📚", "⚡", "✏️", "📖", "✨"],
  },
  {
    id: 4,
    grade: "4-р анги",
    desc: "Цээжээр бичих чадвараа бататгаж илүү сайжирцгаая.",
    color: "#FFD93D",
    img: "/4-r aral.png",
    effects: ["✍️", "📖", "📝", "🌟", "✏️"],
  },
  {
    id: 5,
    grade: "5-р анги",
    desc: "Аялалаа өндөрлүүлэхэд бид ойрхон байна.",
    color: "#9254DE",
    img: "/5-r aral.png",
    effects: ["👑", "✍️", "📖", "📝"],
  },
];

const magicVariants = {
  initial: { scale: 0, opacity: 0, y: 0 },
  animate: (i: number) => ({
    scale: [0, 1.2, 1],
    opacity: [0, 1, 0],
    y: -50 - Math.random() * 30,
    x: (Math.random() - 0.5) * 100,
    transition: { duration: 2, repeat: Infinity, delay: i * 0.2 },
  }),
  exit: { scale: 0, opacity: 0 },
};

const ClassSelectionFinal = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  const selectedIslandData = classes.find((c) => c.id === selectedId);

  return (
    <section
      id="class-selection"
      className="relative bg-white overflow-hidden py-10 md:py-24 text-[#5D3191]"
    >
      <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-24 border-b border-purple-50 pb-10 text-center md:text-left">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#F8F9FF] px-3 py-1 rounded-full border border-purple-50 mx-auto md:mx-0">
              <Sparkles className="w-3.5 h-3.5 text-[#8DC63F]" />
              <span className="text-[#8DC63F] font-black text-[9px] md:text-[10px] uppercase tracking-widest">
                Аялал эхэллээ
              </span>
            </div>
            <h2 className="text-3xl md:text-6xl font-[1000] tracking-tighter uppercase italic leading-none">
              АНГИА <span className="text-[#8DC63F]">СОНГОХ</span>
            </h2>
          </div>
          <div className="max-w-xs mx-auto md:mx-0">
            <p className="text-gray-400 font-bold text-xs md:text-base leading-relaxed">
              Өөрийн түвшинд тохирсон ангиа сонгож, Баатар болоорой!
            </p>
          </div>
        </div>

        <div className="relative space-y-16 md:space-y-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none hidden md:block">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 800 1200"
              fill="none"
              className="opacity-20"
            >
              <path
                d="M400 50 C 600 150, 200 250, 400 350 S 600 550, 400 650 S 200 850, 400 950 S 600 1150, 400 1250"
                stroke="#8DC63F"
                strokeWidth="6"
                strokeDasharray="12 12"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {classes.map((item, index) => {
            const isEven = index % 2 === 0;
            const isHovered = hoveredId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className={`relative flex ${isEven ? "flex-row" : "flex-row-reverse"} items-center justify-center gap-4 md:gap-24 z-20`}
              >
                <div className="relative w-[40%] md:w-full  max-width: 140px md:max-w-[300px] aspect-square group">
                  <div
                    className="absolute inset-0 rounded-full blur-[30px] md:blur-[60px] opacity-15 group-hover:opacity-30 transition-opacity duration-700"
                    style={{ backgroundColor: item.color }}
                  />

                  <motion.div
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setSelectedId(item.id)}
                    whileHover={{
                      scale: 1.15,
                      rotate: isEven ? 5 : -5,
                      y: -10,
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-full h-full z-10 cursor-pointer"
                  >
                    <img
                      src={item.img}
                      alt={item.grade}
                      className="w-full h-full object-contain animate-float drop-shadow-xl md:drop-shadow-2xl"
                    />

                    <AnimatePresence>
                      {isHovered && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          {item.effects.map((emoji, i) => (
                            <motion.span
                              key={i}
                              custom={i}
                              variants={magicVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              className="absolute text-xl md:text-3xl filter drop-shadow-md"
                            >
                              {emoji}
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <div
                    className={`absolute -top-1 ${isEven ? "-right-1" : "-left-1"} bg-white p-1 md:p-1.5 rounded-lg md:rounded-[18px] shadow-xl z-20 border border-gray-50`}
                  >
                    <div
                      className="w-6 h-6 md:w-9 md:h-9 rounded-md md:rounded-[14px] flex items-center justify-center text-white font-[1000] text-[10px] md:text-lg"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.id}
                    </div>
                  </div>
                </div>

                <div
                  className={`flex-1 flex flex-col ${isEven ? "items-start text-left" : "items-end text-right"} space-y-3 md:space-y-6`}
                >
                  <div className="space-y-1 md:space-y-2">
                    <h3 className="text-lg md:text-5xl font-black tracking-tighter uppercase italic leading-none">
                      {item.grade}
                    </h3>
                    <p className="text-gray-400 font-bold text-[10px] md:text-lg max-w-[150px] md:max-w-sm leading-tight md:leading-snug">
                      {item.desc}
                    </p>
                  </div>

                  <motion.button
                    onClick={() => setSelectedId(item.id)}
                    whileHover={{ scale: 1.05, backgroundColor: "#8DC63F" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 md:gap-4 bg-[#5D3191] text-white pl-4 md:pl-8 pr-1.5 md:pr-3 py-2 md:py-3 rounded-full font-[1000] text-[8px] md:text-[11px] uppercase tracking-widest md:tracking-[0.2em] shadow-lg group transition-all"
                  >
                    Эхлэх
                    <div className="bg-white/20 p-1 md:p-2 rounded-full group-hover:bg-white/40">
                      <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedId && selectedIslandData && (
          <IslandOverlay
            island={selectedIslandData}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default ClassSelectionFinal;
