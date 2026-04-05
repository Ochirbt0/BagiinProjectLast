// "use client";
// import React, { useEffect, useMemo, useState } from "react";
// import { motion } from "framer-motion";
// import { X, Star, Play, Lock } from "lucide-react";
// import Link from "next/link";
// import { getProgressStatus, ProgressLevel } from "@/lib/backend-api";

// interface IslandOverlayProps {
//   island: {
//     grade: string;
//     img: string;
//   };
//   onClose: () => void;
// }

// const IslandOverlay = ({ island, onClose }: IslandOverlayProps) => {
//   const [progress, setProgress] = useState<ProgressLevel[]>([]);
//   const gradeNumber = Number(String(island?.grade || "1").replace(/[^0-9]/g, "")) || 1;

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const data = await getProgressStatus(gradeNumber);
//         setProgress(data || []);
//       } catch (error) {
//         console.error(error);
//         setProgress([]);
//       }
//     };
//     load();
//   }, [gradeNumber]);

//   const levels = useMemo(() => {
//     const base = [
//       { id: 1, key: "easy", label: "Амархан", x: 68, y: 70 },
//       { id: 2, key: "medium", label: "Дунд", x: 32, y: 55 },
//       { id: 3, key: "hard", label: "Хэцүү", x: 60, y: 38 },
//     ] as const;

//     return base.map((item) => {
//       const found = progress.find((p) => p.level === item.key);
//       const isLocked = found?.isLocked ?? item.key !== "easy";
//       const completedTopics = found?.completedTopics ?? 0;
//       const status = isLocked
//         ? "locked"
//         : completedTopics >= 8
//           ? "completed"
//           : "current";

//       return { ...item, status, completedTopics };
//     });
//   }, [progress]);

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[6px] p-6 md:p-0"
//       onClick={onClose}
//     >
//       <button
//         onClick={onClose}
//         className="absolute top-6 right-6 z-[150] bg-white p-2.5 rounded-2xl shadow-xl hover:scale-110 transition-transform border border-purple-50"
//       >
//         <X className="w-5 h-5 text-[#5D3191]" />
//       </button>

//       <div className="relative w-full max-w-lg aspect-[3/4.2] md:aspect-square flex items-center justify-center">
//         <motion.div
//           initial={{ scale: 0.8, opacity: 0, y: 15 }}
//           animate={{ scale: 1, opacity: 1, y: 0 }}
//           className="relative w-full h-full flex items-center justify-center"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <motion.div
//             animate={{ y: [0, -10, 0] }}
//             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
//             className="relative w-full h-full flex items-center justify-center"
//           >
//             <img
//               src={island.img}
//               alt={island.grade}
//               className="w-[85%] h-[85%] md:w-[90%] md:h-[90%] object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.3)]"
//             />

//             <svg
//               className="absolute inset-0 w-full h-full pointer-events-none z-[25] overflow-visible"
//               viewBox="0 0 100 100"
//               preserveAspectRatio="none"
//             >
//               <path
//                 d={`M ${levels[0].x} ${levels[0].y} Q 50 70, ${levels[1].x} ${levels[1].y} Q 40 48, ${levels[2].x} ${levels[2].y}`}
//                 fill="none"
//                 stroke="white"
//                 strokeWidth="0.8"
//                 strokeDasharray="2.5 3.5"
//                 strokeLinecap="round"
//                 className="drop-shadow-[0_0_6px_rgba(255,255,255,0.9)] opacity-90"
//               />
//             </svg>

//             {levels.map((lvl) => {
//               const isActive = lvl.status !== "locked";

//               const ButtonContent = (
//                 <motion.div
//                   whileHover={isActive ? { scale: 1.12, rotate: 5 } : {}}
//                   whileTap={isActive ? { scale: 0.92 } : {}}
//                   className={`
//                     relative w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center
//                     shadow-[0_6px_0_rgba(0,0,0,0.15)] border-b-4 active:border-b-0 active:translate-y-1
//                     transition-all duration-200
//                     ${
//                       lvl.status === "completed"
//                         ? "bg-[#8DC63F] border-[#6ea02f]"
//                         : lvl.status === "current"
//                           ? "bg-[#5D3191] border-[#3e2061]"
//                           : "bg-white/90 border-gray-100 backdrop-blur-sm"
//                     }
//                   `}
//                 >
//                   {lvl.status === "completed" ? (
//                     <Star className="w-6 h-6 md:w-9 md:h-9 text-white fill-current" />
//                   ) : lvl.status === "current" ? (
//                     <Play className="w-6 h-6 md:w-9 md:h-9 text-white fill-current ml-0.5" />
//                   ) : (
//                     <Lock className="w-5 h-5 md:w-7 md:h-7 text-gray-400" />
//                   )}

//                   <div className="absolute -bottom-8 bg-white/95 px-3 py-0.5 rounded-lg shadow-lg border border-purple-50">
//                     <span className="text-[9px] font-[1000] text-[#5D3191] uppercase tracking-wider italic">
//                       {lvl.label} {lvl.completedTopics}/8
//                     </span>
//                   </div>
//                 </motion.div>
//               );

//               return (
//                 <div
//                   key={lvl.id}
//                   style={{ left: `${lvl.x}%`, top: `${lvl.y}%` }}
//                   className="absolute -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center"
//                 >
//                   {isActive ? (
//                     <Link
//                       href={`/topics?grade=${encodeURIComponent(island.grade)}&level=${lvl.id}`}
//                       className="block no-underline"
//                     >
//                       {ButtonContent}
//                     </Link>
//                   ) : (
//                     ButtonContent
//                   )}

//                   {lvl.status === "current" && (
//                     <div className="absolute inset-0 w-16 h-16 md:w-28 md:h-28 bg-white/30 rounded-full blur-xl animate-pulse -z-10" />
//                   )}
//                 </div>
//               );
//             })}
//           </motion.div>

//           <div className="absolute top-[8%] md:top-[12%] left-1/2 -translate-x-1/2 text-center pointer-events-none z-[120] w-full">
//             <h2 className="text-3xl md:text-5xl font-[1000] text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.5)] uppercase italic tracking-tighter">
//               {island.grade}
//             </h2>
//             <div className="bg-[#5D3191] px-5 py-1 rounded-full shadow-2xl mt-1.5 border border-white/20 inline-block">
//               <span className="text-[9px] md:text-xs font-black text-white uppercase tracking-[0.2em]">
//                 ТҮВШИН СОНГОХ
//               </span>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default IslandOverlay;
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { X, Star, Play, Lock } from "lucide-react";
import Link from "next/link";
import { getProgressStatus, ProgressLevel } from "@/lib/backend-api";

interface IslandOverlayProps {
  island: {
    grade: string;
    img: string;
  };
  onClose: () => void;
}

const IslandOverlay = ({ island, onClose }: IslandOverlayProps) => {
  const [progress, setProgress] = useState<ProgressLevel[]>([]);
  const gradeNumber =
    Number(String(island?.grade || "1").replace(/[^0-9]/g, "")) || 1;

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProgressStatus(gradeNumber);
        setProgress(data || []);
      } catch (error) {
        console.error(error);
        setProgress([]);
      }
    };
    load();
  }, [gradeNumber]);

  const levels = useMemo(() => {
    const base = [
      { id: 1, key: "easy", label: "Амархан", x: 68, y: 70 },
      { id: 2, key: "medium", label: "Дунд", x: 32, y: 55 },
      { id: 3, key: "hard", label: "Хэцүү", x: 60, y: 38 },
    ] as const;

    return base.map((item) => {
      const found = progress.find((p) => p.level === item.key);
      const isLocked = found?.isLocked ?? item.key !== "easy";
      const completedTopics = found?.completedTopics ?? 0;
      const status = isLocked
        ? "locked"
        : completedTopics >= 8
          ? "completed"
          : "current";

      return { ...item, status, completedTopics };
    });
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[8px] p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-[150] bg-white/20 hover:bg-white/40 backdrop-blur-md p-2.5 rounded-full transition-all border border-white/30"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="relative w-full h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <img
              src={island.img}
              alt={island.grade}
              className="w-[80%] h-[80%] md:w-[90%] md:h-[90%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
            />

            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-[25] overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d={`M ${levels[0].x} ${levels[0].y} Q 50 70, ${levels[1].x} ${levels[1].y} Q 40 48, ${levels[2].x} ${levels[2].y}`}
                fill="none"
                stroke="white"
                strokeWidth="1.2"
                strokeDasharray="4 6"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] opacity-70"
              />
            </svg>

            {levels.map((lvl) => {
              const isActive = lvl.status !== "locked";

              return (
                <div
                  key={lvl.id}
                  style={{ left: `${lvl.x}%`, top: `${lvl.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center"
                >
                  <div className="relative group">
                    <Link
                      href={
                        isActive
                          ? `/topics?grade=${encodeURIComponent(island.grade)}&level=${lvl.id}`
                          : "#"
                      }
                      onClick={(e) => !isActive && e.preventDefault()}
                      className={`
                        relative w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center
                        shadow-[0_8px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1
                        transition-all duration-300 border-2
                        ${
                          lvl.status === "completed"
                            ? "bg-[#8DC63F] border-[#b2e86b]"
                            : lvl.status === "current"
                              ? "bg-[#5D3191] border-[#8a52cf]"
                              : "bg-white/90 border-gray-100 grayscale"
                        }
                      `}
                    >
                      {lvl.status === "completed" ? (
                        <Star className="w-6 h-6 md:w-9 md:h-9 text-white fill-current" />
                      ) : lvl.status === "current" ? (
                        <Play className="w-6 h-6 md:w-9 md:h-9 text-white fill-current ml-1" />
                      ) : (
                        <Lock className="w-5 h-5 md:w-7 md:h-7 text-gray-400" />
                      )}

                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg border border-purple-50 whitespace-nowrap">
                        <span className="text-[8px] md:text-[10px] font-black text-[#5D3191] uppercase tracking-tighter">
                          {lvl.label}{" "}
                          <span className="text-[#8DC63F] ml-1">
                            {lvl.completedTopics}/8
                          </span>
                        </span>
                      </div>
                    </Link>

                    {lvl.status === "current" && (
                      <div className="absolute inset-0 w-full h-full bg-white/40 rounded-full blur-xl animate-pulse -z-10" />
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>

          <div className="absolute top-[5%] md:top-[10%] left-1/2 -translate-x-1/2 text-center pointer-events-none z-[120] w-full">
            <h2 className="text-4xl md:text-6xl font-[1000] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] uppercase italic tracking-tight">
              {island.grade}
            </h2>
            <div className="bg-[#8DC63F] px-4 py-1 rounded-full shadow-xl mt-2 inline-block border-2 border-white/30">
              <span className="text-[9px] md:text-xs font-black text-white uppercase tracking-widest">
                ТҮВШИН СОНГОХ
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default IslandOverlay;
