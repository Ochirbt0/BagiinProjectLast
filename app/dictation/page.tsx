"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import DictationClient from "./dictationClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Уншиж байна...</div>}>
      <DictationClient />
    </Suspense>
  );
}

// "use client";
// import React, { useEffect, useMemo, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ChevronLeft,
//   Volume2,
//   Send,
//   Keyboard as KeyboardIcon,
//   X,
//   Delete,
//   Lightbulb,
//   Trophy,
//   Star as StarIcon,
//   RotateCcw,
// } from "lucide-react";
// import {
//   completeTopicProgress,
//   generateAudio,
//   generateTopic,
//   levelFromQuery,
//   spellcheck,
//   submitScore,
// } from "@/lib/backend-api";

// const PRIMARY_TTS_RATE = 1;
// const THIRD_PASS_TTS_RATE = 0.75;
// const SENTENCE_GAP_MS = 2000;
// const REPEAT_GAP_MS = 1000;

// export default function DictationPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const topicTitle = searchParams.get("topic") || "Амьтдын ертөнц";
//   const topicId = Number(searchParams.get("topicId") || "1");
//   const grade = Number(searchParams.get("grade") || "1");
//   const level = levelFromQuery(searchParams.get("level"));

//   const [sourceSentences, setSourceSentences] = useState<string[]>([]);
//   const [userInput, setUserInput] = useState("");
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isChecking, setIsChecking] = useState(false);
//   const [showKeyboard, setShowKeyboard] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isTopicPassed, setIsTopicPassed] = useState(false);
//   const [showAnagram, setShowAnagram] = useState(false);
//   const [activeAnagramWord, setActiveAnagramWord] = useState<string | null>(
//     null,
//   );
//   const [anagramWords, setAnagramWords] = useState<string[]>([]);
//   const [anagramShuffled, setAnagramShuffled] = useState<
//     Record<string, string>
//   >({});
//   const [anagramInputs, setAnagramInputs] = useState<Record<string, string>>(
//     {},
//   );
//   const [anagramError, setAnagramError] = useState<string | null>(null);
//   const [result, setResult] = useState<{
//     score?: number;
//     errors?: number;
//     incorrectWords?: string[];
//     correctedText?: string;
//     totalScore?: number;
//   } | null>(null);

//   const expectedLineCount = sourceSentences.length || 5;

//   const normalizeWord = (value: string) =>
//     value
//       .toLowerCase()
//       .replace(/[^\p{L}\p{N}]/gu, "")
//       .trim();

//   const shuffleWord = (word: string) => {
//     if (word.length < 2) return word;
//     const chars = word.split("");
//     let shuffled = word;
//     let attempts = 0;
//     while (shuffled === word && attempts < 10) {
//       for (let i = chars.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         const temp = chars[i];
//         chars[i] = chars[j];
//         chars[j] = temp;
//       }
//       shuffled = chars.join("");
//       attempts += 1;
//     }
//     return shuffled === word ? word.split("").reverse().join("") : shuffled;
//   };

//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 768);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   useEffect(() => {
//     const loadSentence = async () => {
//       setIsGenerating(true);
//       setError(null);
//       setResult(null);
//       setUserInput("");
//       setSourceSentences([]);
//       setIsTopicPassed(false);
//       setShowAnagram(false);
//       try {
//         const data = await generateTopic({
//           grade: Number.isFinite(grade) ? grade : 1,
//           level,
//           topic: topicTitle,
//         });
//         const sentences = Array.isArray(data?.sentences)
//           ? data.sentences
//               .map((item) => String(item || "").trim())
//               .filter(Boolean)
//           : [];
//         setSourceSentences(sentences);
//       } catch (e) {
//         setError("Өгүүлбэр үүсгэхэд алдаа гарлаа.");
//       } finally {
//         setIsGenerating(false);
//       }
//     };
//     loadSentence();
//   }, [grade, level, topicTitle]);

//   const keys = [
//     ["Ф", "Ц", "У", "Ж", "Э", "Н", "Г", "Ш", "Ү", "З", "К"],
//     ["Й", "Ы", "Б", "Ө", "А", "Х", "Р", "О", "Л", "Д", "П"],
//     ["Я", "Ч", "Ё", "С", "М", "И", "Т", "Ь", "В", "Ю", "Е"],
//     ["ЗАЙ АВАХ", "УСТГАХ"],
//   ];

//   const handleKeyClick = (key: string) => {
//     if (key === "УСТГАХ") {
//       setUserInput((prev) => prev.slice(0, -1));
//     } else if (key === "ЗАЙ АВАХ") {
//       setUserInput((prev) => prev + " ");
//     } else {
//       setUserInput((prev) => prev + key);
//     }
//   };

//   const playSingleSentence = async (text: string, rate: number) => {
//     const blob = await generateAudio(text);
//     const url = URL.createObjectURL(blob);
//     const audio = new Audio(url);
//     audio.playbackRate = rate;
//     await new Promise<void>((resolve) => {
//       audio.onended = () => {
//         URL.revokeObjectURL(url);
//         resolve();
//       };
//       audio.play().catch(() => URL.revokeObjectURL(url));
//     });
//   };

//   const wait = (ms: number) =>
//     new Promise((resolve) => setTimeout(resolve, ms));

//   const handlePlay = async () => {
//     if (!sourceSentences.length || isPlaying) return;
//     setIsPlaying(true);
//     try {
//       for (let i = 0; i < sourceSentences.length; i++) {
//         const sentence = sourceSentences[i];
//         await playSingleSentence(sentence, PRIMARY_TTS_RATE);
//         await wait(REPEAT_GAP_MS);
//         await playSingleSentence(sentence, PRIMARY_TTS_RATE);
//         await wait(REPEAT_GAP_MS);
//         await playSingleSentence(sentence, THIRD_PASS_TTS_RATE);
//         if (i < sourceSentences.length - 1) await wait(SENTENCE_GAP_MS);
//       }
//     } finally {
//       setIsPlaying(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!userInput.trim()) {
//       setError("Эхлээд өгүүлбэрээ бичнэ үү.");
//       return;
//     }
//     const typedLines = userInput
//       .split("\n")
//       .map((l) => l.trim())
//       .filter(Boolean);
//     if (typedLines.length !== expectedLineCount) {
//       setError(`Нийт ${expectedLineCount} мөр шаардлагатай.`);
//       return;
//     }
//     setIsChecking(true);
//     setError(null);
//     try {
//       const checked = await spellcheck(userInput);
//       const scoreData = await submitScore({
//         originalText: sourceSentences.join(" "),
//         userText: userInput,
//         errors: checked.errors,
//       });
//       setResult({
//         score: scoreData.score ?? checked.score,
//         errors: scoreData.mistakes ?? checked.errors,
//         incorrectWords: checked.incorrectWords,
//         correctedText: checked.correctedText,
//         totalScore: scoreData.totalScore,
//       });
//       const originalWords = sourceSentences
//         .join(" ")
//         .split(/\s+/)
//         .map((w) => normalizeWord(w))
//         .filter(Boolean);
//       const userWords = userInput
//         .split(/\s+/)
//         .map((w) => normalizeWord(w))
//         .filter(Boolean);
//       const uniqueIncorrect: string[] = [];
//       originalWords.forEach((expected, i) => {
//         if (expected !== userWords[i]) uniqueIncorrect.push(expected);
//       });
//       const finalUnique = Array.from(new Set(uniqueIncorrect));
//       if (finalUnique.length > 0) {
//         setAnagramWords(finalUnique);
//         setAnagramShuffled(
//           finalUnique.reduce((acc, w) => ({ ...acc, [w]: shuffleWord(w) }), {}),
//         );
//         setAnagramInputs(
//           finalUnique.reduce((acc, w) => ({ ...acc, [w]: "" }), {}),
//         );
//       } else {
//         await completeTopicProgress({ grade, level, topicId });
//         setIsTopicPassed(true);
//       }
//     } catch (e) {
//       setError("Алдаа гарлаа.");
//     } finally {
//       setIsChecking(false);
//     }
//   };

//   const handleAnagramCheck = async () => {
//     const allCorrect = anagramWords.every(
//       (w) => normalizeWord(anagramInputs[w] || "") === w,
//     );
//     if (!allCorrect) {
//       setAnagramError("Бүх үгийг зөв тааруулна уу.");
//       return;
//     }
//     await completeTopicProgress({ grade, level, topicId });
//     setIsTopicPassed(true);
//     setShowAnagram(false);
//   };

//   return (
//     <div className="min-h-screen bg-[#FDFCFE] flex flex-col items-center font-sans overflow-x-hidden selection:bg-purple-200">
//       <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,#f3e8ff_0%,transparent_40%)] pointer-events-none" />

//       <main className="w-full max-w-5xl flex-1 flex flex-col relative z-10 px-4 md:px-6 pt-24 md:pt-32 pb-10">
//         <div className="bg-white rounded-[45px] shadow-[0_30px_100px_rgba(93,49,145,0.1)] border border-white/50 flex flex-col overflow-hidden min-h-[600px] relative">
//           <div className="px-6 md:px-12 py-8 flex flex-col gap-6">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-5">
//                 <motion.button
//                   whileHover={{ x: -4 }}
//                   onClick={() => router.back()}
//                   className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 border border-slate-100"
//                 >
//                   <ChevronLeft size={24} />
//                 </motion.button>
//                 <h1 className="text-2xl md:text-4xl font-black text-[#5D3191] tracking-tight italic">
//                   {topicTitle}
//                 </h1>
//               </div>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handlePlay}
//                 disabled={!sourceSentences.length || isPlaying || isGenerating}
//                 className={`hidden md:flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-lg ${isPlaying ? "bg-amber-400 text-white animate-pulse" : "bg-[#5D3191] text-white"}`}
//               >
//                 <Volume2 size={20} />{" "}
//                 {isPlaying ? "СОНСОЖ БАЙНА..." : "СОНСОХ (3X)"}
//               </motion.button>
//             </div>
//             <div className="flex items-center justify-between bg-purple-50/50 p-4 rounded-3xl border border-purple-100/50">
//               <p className="text-[#5D3191] font-bold text-sm md:text-base">
//                 ✨{" "}
//                 {isGenerating
//                   ? "Бэлтгэж байна..."
//                   : `${expectedLineCount} өгүүлбэр сонсоод бичээрэй.`}
//               </p>
//               <button onClick={handlePlay} className="md:hidden text-[#5D3191]">
//                 <Volume2 size={24} />
//               </button>
//             </div>
//           </div>

//           <div className="flex-1 px-4 md:px-12 relative group">
//             <div className="relative h-full min-h-[350px] bg-slate-50/30 rounded-[40px] border border-slate-100 shadow-inner overflow-hidden">
//               <div
//                 className="absolute inset-0 opacity-[0.05]"
//                 style={{
//                   backgroundImage:
//                     "linear-gradient(#5D3191 1px, transparent 1px)",
//                   backgroundSize: "100% 40px",
//                   backgroundPosition: "0 20px",
//                 }}
//               />
//               <div className="absolute left-12 top-0 bottom-0 w-[2px] bg-red-100/50" />
//               <textarea
//                 value={userInput}
//                 onChange={(e) => setUserInput(e.target.value)}
//                 placeholder="Энд бичээрэй..."
//                 className="relative w-full h-full p-10 pl-20 bg-transparent text-xl md:text-xl  text-slate-700 focus:outline-none  leading-[40px] z-20 overflow-y-auto "
//               />
//             </div>
//           </div>

//           <div className="px-6 md:px-12 py-10 flex flex-col items-center justify-between gap-6">
//             {result?.incorrectWords && result.incorrectWords.length > 0 && (
//               <div className="w-full flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-4">
//                 <p className="w-full text-xs font-black text-rose-400 uppercase tracking-widest mb-1">
//                   Алдаатай үгс (дарж засаарай):
//                 </p>
//                 {result.incorrectWords.map((word, idx) => (
//                   <motion.button
//                     key={idx}
//                     whileHover={{ scale: 1.05 }}
//                     onClick={() => {
//                       setActiveAnagramWord(word);
//                       setShowAnagram(true);
//                     }}
//                     className="px-4 py-2 rounded-xl bg-rose-50 text-rose-500 border border-rose-100 font-black text-sm underline decoration-wavy underline-offset-4"
//                   >
//                     {word}
//                   </motion.button>
//                 ))}
//               </div>
//             )}
//             <div className="w-full flex items-center justify-end gap-4">
//               {!isMobile && (
//                 <button
//                   onClick={() => setShowKeyboard(!showKeyboard)}
//                   className="h-16 px-8 rounded-[24px] font-black text-xs bg-white border border-slate-200 text-slate-400 flex items-center gap-3 hover:border-purple-300 hover:text-purple-600 transition-all shadow-sm"
//                 >
//                   <KeyboardIcon size={20} /> МОНГОЛ ГАР
//                 </button>
//               )}
//               <motion.button
//                 whileHover={{ scale: 1.02, y: -2 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleSubmit}
//                 disabled={isChecking}
//                 className="h-16 px-12 bg-[#5D3191] text-white rounded-[24px] font-black text-xs shadow-[0_15px_30px_rgba(93,49,145,0.2)] flex items-center gap-4 disabled:opacity-50"
//               >
//                 <Send size={22} /> {isChecking ? "ШАЛГАЖ БАЙНА..." : "ШАЛГАХ"}
//               </motion.button>
//             </div>
//           </div>
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mt-8 bg-white border border-slate-100 rounded-[35px] p-8 shadow-xl flex gap-6 items-center"
//         >
//           <div className="w-14 h-14 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
//             <Lightbulb size={20} />
//           </div>
//           <div className="flex-1">
//             <h4 className="text-slate-400 font-black text-xs  tracking-widest mb-1">
//               Зөвлөгөө
//             </h4>
//             {error ? (
//               <p className="text-rose-500 font-bold">{error}</p>
//             ) : result ? (
//               <div className="flex items-center gap-6">
//                 <div className="bg-purple-50 px-4 py-2 rounded-xl border border-purple-100">
//                   <span className="text-purple-600 font-black">
//                     Оноо: {result.score || 0}
//                   </span>
//                 </div>
//                 <p className="text-slate-600 font-bold italic">
//                   "
//                   {result.errors === 0
//                     ? "Гайхалтай! Ямар ч алдаагүй бичлээ."
//                     : `Чи нийт ${result.errors} алдаа гаргалаа. Засаад дахиад оролдоорой!`}
//                   "
//                 </p>
//               </div>
//             ) : (
//               <p className="text-slate-500 font-bold">
//                 Сонсоод бичсэн зүйлээ "Шалгах" товч дээр дарж илгээнэ үү.
//                 Амжилт!
//               </p>
//             )}
//           </div>
//         </motion.div>
//       </main>

//       <AnimatePresence>
//         {showKeyboard && !isMobile && (
//           <motion.div
//             initial={{ y: "100%" }}
//             animate={{ y: 0 }}
//             exit={{ y: "100%" }}
//             className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-3xl border-t border-slate-200 p-8 pb-12 shadow-[0_-20px_60px_rgba(0,0,0,0.1)]"
//           >
//             <div className="max-w-5xl mx-auto">
//               <div className="flex justify-between items-center mb-6 px-2">
//                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
//                   Монгол хэлний гар
//                 </span>
//                 <button
//                   onClick={() => setShowKeyboard(false)}
//                   className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors text-slate-400"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//               <div className="flex flex-col gap-2.5">
//                 {keys.map((row, rIdx) => (
//                   <div key={rIdx} className="flex justify-center gap-2">
//                     {row.map((key) => (
//                       <motion.button
//                         key={key}
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.95, y: 2 }}
//                         onClick={() => handleKeyClick(key)}
//                         className={`
//                           ${key === "ЗАЙ АВАХ" ? "w-[400px] bg-slate-50 text-slate-400" : key === "УСТГАХ" ? "w-32 bg-rose-50 text-rose-500 border-rose-100" : "w-16 h-16 bg-white text-slate-700"}
//                           rounded-2xl border border-slate-200 shadow-[0_4px_0_#f1f5f9] active:shadow-none
//                           text-l font-bold transition-all flex items-center justify-center font-sans
//                         `}
//                       >
//                         {key === "УСТГАХ" ? <Delete size={18} /> : key}
//                       </motion.button>
//                     ))}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {showAnagram && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-[200] bg-[#5D3191]/40 backdrop-blur-md flex items-center justify-center p-6 text-slate-800"
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               className="w-full max-w-lg bg-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden"
//             >
//               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-purple-500 to-rose-400" />
//               <h3 className="text-2xl font-black text-[#5D3191] mb-2 flex items-center gap-3">
//                 🧩 Анаграм
//               </h3>
//               <p className="text-slate-500 font-bold mb-8">
//                 Алдаатай үгээ зөв болгож байрлуулснаар оноогоо авна.
//               </p>
//               <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
//                 {anagramWords
//                   .filter((w) => !activeAnagramWord || w === activeAnagramWord)
//                   .map((word) => (
//                     <div
//                       key={word}
//                       className="bg-slate-50 p-6 rounded-[30px] border border-slate-100"
//                     >
//                       <div className="flex justify-between items-center mb-4">
//                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
//                           Холилдсон:
//                         </span>
//                         <span className="text-xl tracking-[0.2em] font-black text-amber-500">
//                           {anagramShuffled[word]}
//                         </span>
//                       </div>
//                       <input
//                         autoFocus
//                         value={anagramInputs[word] || ""}
//                         onChange={(e) =>
//                           setAnagramInputs((prev) => ({
//                             ...prev,
//                             [word]: e.target.value,
//                           }))
//                         }
//                         className="w-full h-16 rounded-2xl border-2 border-slate-200 px-6 text-xl font-black text-[#5D3191] focus:border-purple-500 outline-none transition-all"
//                         placeholder="Зөв хувилбарыг бич..."
//                       />
//                     </div>
//                   ))}
//               </div>
//               {anagramError && (
//                 <p className="text-rose-500 font-bold mt-4 text-center">
//                   {anagramError}
//                 </p>
//               )}
//               <div className="mt-8 flex gap-4">
//                 <button
//                   onClick={() => {
//                     setShowAnagram(false);
//                     setActiveAnagramWord(null);
//                   }}
//                   className="flex-1 h-14 rounded-2xl bg-slate-100 text-slate-500 font-black"
//                 >
//                   БОЛИХ
//                 </button>
//                 <button
//                   onClick={handleAnagramCheck}
//                   className="flex-1 h-14 rounded-2xl bg-[#5D3191] text-white font-black"
//                 >
//                   ШАЛГАХ
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {isTopicPassed && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="fixed inset-0 z-[300] bg-[#5D3191] flex items-center justify-center p-6 text-white"
//           >
//             <motion.div
//               initial={{ scale: 0.5 }}
//               animate={{ scale: 1 }}
//               className="text-center max-w-md"
//             >
//               <div className="relative mb-10">
//                 <Trophy
//                   size={120}
//                   className="mx-auto text-amber-400 relative z-10"
//                 />
//               </div>
//               <h2 className="text-5xl font-black mb-4 tracking-tighter">
//                 БАЯР ХҮРГЭЕ! 🎉
//               </h2>
//               <p className="text-xl font-bold text-purple-200 mb-8 px-6">
//                 Чи энэ түвшнийг гайхалтай давлаа!
//               </p>
//               <div className="bg-white/10 backdrop-blur-md rounded-[35px] p-8 mb-10 border border-white/20">
//                 <div className="flex justify-center gap-3 mb-4">
//                   {[1, 2, 3].map((s) => (
//                     <StarIcon
//                       key={s}
//                       size={40}
//                       fill="#fbbf24"
//                       className="text-amber-400"
//                     />
//                   ))}
//                 </div>
//                 <p className="text-3xl font-black text-amber-400">
//                   +{result?.score || 100} ОНОО
//                 </p>
//               </div>
//               <div className="flex flex-col gap-4">
//                 <button
//                   onClick={() => router.push("/levels")}
//                   className="h-18 px-10 bg-white text-[#5D3191] rounded-3xl font-black text-xl flex items-center justify-center gap-3"
//                 >
//                   ҮРҮҮЛЭХ <ChevronLeft className="rotate-180" />
//                 </button>
//                 <button
//                   onClick={() => window.location.reload()}
//                   className="text-purple-200 font-bold flex items-center justify-center gap-2"
//                 >
//                   <RotateCcw size={16} /> ДАХИН ОРОЛДОХ
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
