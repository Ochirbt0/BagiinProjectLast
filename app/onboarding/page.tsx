// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
// import { motion } from "framer-motion";
// import { Sparkles, Star, User, School, Calendar, Rocket } from "lucide-react";

// export default function OnboardingPage() {
//   const { user } = useUser();
//   const router = useRouter();
//   const [isSaving, setIsSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     nickname: "",
//     grade: "1",
//     classSection: "",
//     age: "",
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSaving(true);
//     setError(null);

//     const normalizedGrade = `${formData.grade}${formData.classSection.trim()}`;
//     const res = await fetch("/api/update-stars", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         nickname: formData.nickname.trim(),
//         grade: normalizedGrade,
//         age: Number(formData.age),
//       }),
//     });

//     if (res.ok) {
//       await user?.reload();
//       router.push("/");
//     } else {
//       const errorText = await res.text();
//       console.error("Onboarding update failed:", errorText);
//       setError("Мэдээлэл хадгалах үед алдаа гарлаа. Дахин оролдоно уу.");
//     }
//     setIsSaving(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#FDFCFE] relative overflow-hidden px-6">
//       <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50" />
//       <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-green-100 rounded-full blur-3xl opacity-50" />

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-md relative z-10"
//       >
//         <div className="flex justify-center mb-8">
//           <motion.div
//             animate={{ y: [0, -10, 0] }}
//             transition={{ repeat: Infinity, duration: 3 }}
//             className="relative"
//           >
//             <div className="bg-white p-6 rounded-[35px] shadow-2xl shadow-purple-100 border-2 border-purple-50">
//               <Rocket className="w-12 h-12 text-[#5D3191]" />
//             </div>
//             <div className="absolute -top-2 -right-2 bg-yellow-400 p-2 rounded-full shadow-lg">
//               <Star className="w-4 h-4 text-white fill-white" />
//             </div>
//           </motion.div>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="bg-white p-8 md:p-10 rounded-[45px] shadow-[0_20px_70px_rgba(93,49,145,0.08)] border border-purple-50/50"
//         >
//           <div className="text-center mb-10">
//             <h1 className="text-[#5D3191] text-3xl font-black mb-2 tracking-tight uppercase">
//               БААТАРЫН <span className="text-[#8DC63F]">МЭДЭЭЛЭЛ</span>
//             </h1>
//             <p className="text-gray-400 text-sm font-medium">
//               Аялалаа эхлэхэд бэлэн үү?
//             </p>
//           </div>

//           <div className="space-y-5">
//             {/* Nickname Input */}
//             <div className="relative group">
//               <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5D3191] transition-colors">
//                 <User className="w-5 h-5" />
//               </div>
//               <input
//                 placeholder="Чиний нэр..."
//                 value={formData.nickname}
//                 className="w-full pl-14 pr-6 py-5 rounded-[24px] bg-gray-50/50 border-2 border-transparent focus:border-[#5D3191] focus:bg-white outline-none transition-all font-bold text-[#5D3191] placeholder:text-gray-300"
//                 onChange={(e) =>
//                   setFormData({ ...formData, nickname: e.target.value })
//                 }
//                 required
//               />
//             </div>

//             <div className="relative group">
//               <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5D3191] transition-colors">
//                 <School className="w-5 h-5" />
//               </div>
//               <select
//                 value={formData.grade}
//                 className="w-full pl-14 pr-6 py-5 rounded-[24px] bg-gray-50/50 border-2 border-transparent focus:border-[#5D3191] focus:bg-white outline-none transition-all font-bold text-[#5D3191]"
//                 onChange={(e) =>
//                   setFormData({ ...formData, grade: e.target.value })
//                 }
//                 required
//               >
//                 <option value="1">1-р анги</option>
//                 <option value="2">2-р анги</option>
//                 <option value="3">3-р анги</option>
//                 <option value="4">4-р анги</option>
//                 <option value="5">5-р анги</option>
//               </select>
//             </div>

//             <div className="relative group">
//               <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5D3191] transition-colors">
//                 <School className="w-5 h-5" />
//               </div>
//               <input
//                 placeholder="Бүлэг (жишээ: а, б) - optional"
//                 value={formData.classSection}
//                 maxLength={2}
//                 className="w-full pl-14 pr-6 py-5 rounded-[24px] bg-gray-50/50 border-2 border-transparent focus:border-[#5D3191] focus:bg-white outline-none transition-all font-bold text-[#5D3191] placeholder:text-gray-300"
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     classSection: e.target.value.toLowerCase(),
//                   })
//                 }
//               />
//             </div>

//             <div className="relative group">
//               <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5D3191] transition-colors">
//                 <Calendar className="w-5 h-5" />
//               </div>
//               <input
//                 type="number"
//                 placeholder="Чиний нас"
//                 value={formData.age}
//                 min={5}
//                 max={15}
//                 className="w-full pl-14 pr-6 py-5 rounded-[24px] bg-gray-50/50 border-2 border-transparent focus:border-[#5D3191] focus:bg-white outline-none transition-all font-bold text-[#5D3191] placeholder:text-gray-300"
//                 onChange={(e) =>
//                   setFormData({ ...formData, age: e.target.value })
//                 }
//                 required
//               />
//             </div>
//           </div>
//           {error && (
//             <p className="mt-4 text-center text-sm font-bold text-red-500">
//               {error}
//             </p>
//           )}

//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             type="submit"
//             disabled={isSaving}
//             className="w-full mt-10 py-5 bg-[#8DC63F] text-white font-black text-lg rounded-[25px] shadow-[0_8px_0_0_#5e852a] hover:shadow-[0_4px_0_0_#5e852a] hover:translate-y-[4px] active:translate-y-[8px] active:shadow-none transition-all flex items-center justify-center gap-3"
//           >
//             {isSaving ? "Хадгалж байна..." : "ЭХЭЛЦГЭЭЕ!"}{" "}
//             <Sparkles className="w-5 h-5" />
//           </motion.button>
//         </form>
//       </motion.div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Sparkles,
  Star,
  User,
  School,
  Calendar,
  Rocket,
  Heart,
} from "lucide-react";

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nickname: "",
    grade: "1",
    age: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const res = await fetch("/api/update-stars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname: formData.nickname.trim(),
        grade: formData.grade,
        age: Number(formData.age),
      }),
    });

    if (res.ok) {
      await user?.reload();
      router.push("/");
    } else {
      setError("Мэдээлэл хадгалах үед алдаа гарлаа. Дахин оролдоно уу.");
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7FF] relative overflow-hidden px-4 py-10">
      <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-200 rounded-full blur-[120px] opacity-40 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-green-200 rounded-full blur-[120px] opacity-40 animate-pulse" />

      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute top-20 left-[15%] hidden md:block opacity-20"
      >
        <Star className="w-12 h-12 text-yellow-400 fill-current" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
        className="absolute bottom-20 right-[15%] hidden md:block opacity-20"
      >
        <Heart className="w-12 h-12 text-red-400 fill-current" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[50px] shadow-[0_30px_100px_rgba(93,49,145,0.12)] border border-white">
          <div className="text-center mb-10">
            <h1 className="text-[#5D3191] text-3xl md:text-4xl font-[1000] mb-3 tracking-tighter uppercase italic">
              БААТАРЫН <span className="text-[#8DC63F]">МЭДЭЭЛЭЛ</span>
            </h1>
            <div className="h-1.5 w-20 bg-[#8DC63F] rounded-full mx-auto mb-4" />
            <p className="text-gray-500 text-sm md:text-base font-bold opacity-70">
              Аялалаа эхлэхэд бэлэн үү, Баатар аа?
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5D3191] transition-colors">
                <User className="w-5 h-5" />
              </div>
              <input
                placeholder="Чиний нэр..."
                value={formData.nickname}
                className="w-full pl-16 pr-6 py-5 rounded-[28px] bg-gray-50/80 border-2 border-transparent focus:border-[#5D3191] focus:bg-white outline-none transition-all font-bold text-[#5D3191] placeholder:text-gray-400 text-lg shadow-sm"
                onChange={(e) =>
                  setFormData({ ...formData, nickname: e.target.value })
                }
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5D3191] transition-colors">
                <School className="w-5 h-5" />
              </div>
              <select
                value={formData.grade}
                className="w-full pl-16 pr-6 py-5 rounded-[28px] bg-gray-50/80 border-2 border-transparent focus:border-[#5D3191] focus:bg-white outline-none transition-all font-bold text-[#5D3191] text-lg cursor-pointer appearance-none shadow-sm"
                onChange={(e) =>
                  setFormData({ ...formData, grade: e.target.value })
                }
                required
              >
                <option value="1">1-р анги</option>
                <option value="2">2-р анги</option>
                <option value="3">3-р анги</option>
                <option value="4">4-р анги</option>
                <option value="5">5-р анги</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5D3191] transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <input
                type="number"
                placeholder="Чиний нас"
                value={formData.age}
                min={5}
                max={18}
                className="w-full pl-16 pr-6 py-5 rounded-[28px] bg-gray-50/80 border-2 border-transparent focus:border-[#5D3191] focus:bg-white outline-none transition-all font-bold text-[#5D3191] placeholder:text-gray-400 text-lg shadow-sm"
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                required
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm font-black text-red-500 bg-red-50 py-3 rounded-2xl"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isSaving}
              className="w-full mt-6 py-5 md:py-6 bg-[#8DC63F] text-white font-[1000] text-xl rounded-[30px] shadow-[0_10px_0_0_#6ea02f] hover:shadow-[0_6px_0_0_#6ea02f] hover:translate-y-[4px] active:translate-y-[10px] active:shadow-none transition-all flex items-center justify-center gap-4 uppercase italic tracking-wider"
            >
              {isSaving ? "Бэлтгэж байна..." : "ЭХЭЛЦГЭЭЕ!"}
              <Sparkles className="w-6 h-6 animate-pulse" />
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
