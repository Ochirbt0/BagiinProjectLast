"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Sparkles, Star, User, School, Calendar, Rocket } from "lucide-react";

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nickname: "",
    grade: "1",
    classSection: "",
    age: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const normalizedGrade = `${formData.grade}${formData.classSection.trim()}`;
    const res = await fetch("/api/update-stars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname: formData.nickname.trim(),
        grade: normalizedGrade,
        age: Number(formData.age),
      }),
    });

    if (res.ok) {
      await user?.reload();
      router.push("/");
    } else {
      const errorText = await res.text();
      console.error("Onboarding update failed:", errorText);
      setError("Мэдээлэл хадгалах үед алдаа гарлаа. Дахин оролдоно уу.");
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCFE] relative overflow-hidden px-6">
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-green-100 rounded-full blur-3xl opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="relative"
          >
            <div className="bg-white p-6 rounded-[35px] shadow-2xl shadow-purple-100 border-2 border-purple-50">
              <Rocket className="w-12 h-12 text-[#5D3191]" />
            </div>
            <div className="absolute -top-2 -right-2 bg-yellow-400 p-2 rounded-full shadow-lg">
              <Star className="w-4 h-4 text-white fill-white" />
            </div>
          </motion.div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 md:p-10 rounded-[45px] shadow-[0_20px_70px_rgba(93,49,145,0.08)] border border-purple-50/50"
        >
          <div className="text-center mb-10">
            <h1 className="text-[#5D3191] text-3xl font-black mb-2 tracking-tight uppercase">
              БААТАРЫН <span className="text-[#8DC63F]">МЭДЭЭЛЭЛ</span>
            </h1>
            <p className="text-gray-400 text-sm font-medium">
              Аялалаа эхлэхэд бэлэн үү?
            </p>
          </div>

          <div className="space-y-5">
            {/* Nickname Input */}
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5D3191] transition-colors">
                <User className="w-5 h-5" />
              </div>
              <input
                placeholder="Чиний нэр..."
                value={formData.nickname}
                className="w-full pl-14 pr-6 py-5 rounded-[24px] bg-gray-50/50 border-2 border-transparent focus:border-[#5D3191] focus:bg-white outline-none transition-all font-bold text-[#5D3191] placeholder:text-gray-300"
                onChange={(e) =>
                  setFormData({ ...formData, nickname: e.target.value })
                }
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5D3191] transition-colors">
                <School className="w-5 h-5" />
              </div>
              <select
                value={formData.grade}
                className="w-full pl-14 pr-6 py-5 rounded-[24px] bg-gray-50/50 border-2 border-transparent focus:border-[#5D3191] focus:bg-white outline-none transition-all font-bold text-[#5D3191]"
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
            </div>

            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5D3191] transition-colors">
                <School className="w-5 h-5" />
              </div>
              <input
                placeholder="Бүлэг (жишээ: а, б) - optional"
                value={formData.classSection}
                maxLength={2}
                className="w-full pl-14 pr-6 py-5 rounded-[24px] bg-gray-50/50 border-2 border-transparent focus:border-[#5D3191] focus:bg-white outline-none transition-all font-bold text-[#5D3191] placeholder:text-gray-300"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    classSection: e.target.value.toLowerCase(),
                  })
                }
              />
            </div>

            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5D3191] transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <input
                type="number"
                placeholder="Чиний нас"
                value={formData.age}
                min={5}
                max={15}
                className="w-full pl-14 pr-6 py-5 rounded-[24px] bg-gray-50/50 border-2 border-transparent focus:border-[#5D3191] focus:bg-white outline-none transition-all font-bold text-[#5D3191] placeholder:text-gray-300"
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                required
              />
            </div>
          </div>
          {error && (
            <p className="mt-4 text-center text-sm font-bold text-red-500">
              {error}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSaving}
            className="w-full mt-10 py-5 bg-[#8DC63F] text-white font-black text-lg rounded-[25px] shadow-[0_8px_0_0_#5e852a] hover:shadow-[0_4px_0_0_#5e852a] hover:translate-y-[4px] active:translate-y-[8px] active:shadow-none transition-all flex items-center justify-center gap-3"
          >
            {isSaving ? "Хадгалж байна..." : "ЭХЭЛЦГЭЭЕ!"}{" "}
            <Sparkles className="w-5 h-5" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
