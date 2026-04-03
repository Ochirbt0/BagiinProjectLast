"use client";
import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Sparkles,
  X,
  Star,
  LogIn,
  Lock,
  LogOut,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser, useClerk, SignInButton } from "@clerk/nextjs";

const avatars = [
  { id: 1, name: "БААТАР 1", src: "/16.png", isLocked: false },
  { id: 2, name: "БААТАР 2", src: "/2.png", isLocked: false },
  { id: 3, name: "БААТАР 3", src: "/3.png", isLocked: false },
  { id: 4, name: "БААТАР 4", src: "/4.png", isLocked: false },
  { id: 5, name: "БААТАР 5", src: "/5.png", isLocked: false },
  { id: 6, name: "", src: "/6.png", isLocked: true },
  { id: 7, name: "", src: "/7.png", isLocked: true },
  { id: 8, name: "", src: "/8.png", isLocked: true },
  { id: 9, name: "", src: "/9.png", isLocked: true },
  { id: 10, name: "", src: "/10.png", isLocked: true },
  { id: 11, name: "", src: "/11.png", isLocked: true },
  { id: 12, name: "", src: "/12.png", isLocked: true },
  { id: 13, name: "", src: "/13.png", isLocked: true },
  { id: 14, name: "", src: "/14.png", isLocked: true },
  { id: 15, name: "", src: "/15.png", isLocked: true },
  { id: 16, name: "", src: "/1.png", isLocked: true },
  { id: 17, name: "", src: "/17.png", isLocked: true },
  { id: 18, name: "", src: "/18.png", isLocked: true },
  { id: 19, name: "", src: "/19.png", isLocked: true },
  { id: 20, name: "", src: "/20.png", isLocked: true },
];

const HeaderContent = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  // Clerk-ээс метадатыг унших хэсэг
  const userStars = (user?.publicMetadata?.stars as number) || 0;
  const userNickname =
    (user?.publicMetadata?.nickname as string) || user?.firstName || "Баатар";
  const userGrade = (user?.publicMetadata?.grade as string) || "";
  const userAge = (user?.publicMetadata?.age as number) || "";

  const [selectedAvatar, setSelectedAvatar] = useState(avatars[2]);

  useEffect(() => {
    const syncAvatar = () => {
      const savedHero = localStorage.getItem("selectedHero");
      if (savedHero) {
        try {
          setSelectedAvatar(JSON.parse(savedHero));
        } catch (e) {
          console.error("Error parsing hero:", e);
        }
      }
    };

    syncAvatar();
    window.addEventListener("storage", syncAvatar);
    return () => window.removeEventListener("storage", syncAvatar);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-0 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl shadow-sm py-2"
          : "bg-transparent py-4 md:py-6"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 md:gap-3 shrink-0 group cursor-pointer">
            <div className="relative w-12 h-12 md:w-16 md:h-16">
              <div className="absolute inset-0 bg-gradient-to-b from-[#8DC63F] to-[#76a835] rounded-xl md:rounded-2xl shadow-[0_5px_0_0_#5e852a] transform rotate-2 group-hover:rotate-0 transition-transform duration-300" />
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-xl md:rounded-2xl bg-white/10"
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/logo.png"
                    alt="Hero Logo"
                    fill
                    className="object-cover scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                </div>
              </motion.div>
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-1 -right-1 z-20"
              >
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </motion.div>
            </div>
            <div className="flex flex-col ml-1">
              <h1 className="text-[#5D3191] font-black text-sm md:text-xl leading-none tracking-tighter uppercase">
                Зөв Бичгийн
              </h1>
              <h2 className="text-[#8DC63F] font-black text-[10px] md:text-sm leading-none uppercase tracking-[0.25em] mt-1">
                Баатар
              </h2>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2 md:px-7 md:py-2.5 bg-[#5D3191] text-white font-black text-[10px] md:text-[12px] uppercase tracking-widest rounded-[16px] md:rounded-[18px] shadow-lg shadow-purple-100 transition-all"
              >
                <LogIn className="w-3.5 h-3.5 md:w-4 md:h-4" /> Нэвтрэх
              </motion.button>
            </SignInButton>
          ) : (
            <div className="flex items-center gap-2 md:gap-4 relative">
              <div className="hidden md:flex flex-col items-end mr-1">
                <span className="text-[#5D3191] font-black text-[12px] uppercase tracking-tighter leading-none">
                  {isLoaded ? userNickname : "..."}
                </span>
                {userGrade && (
                  <span className="text-[#8DC63F] font-bold text-[10px] uppercase leading-none mt-1">
                    {userGrade} анги
                  </span>
                )}
              </div>

              <Link href="/leaderboard">
                <motion.div
                  whileHover={{ y: -2 }}
                  className="flex items-center justify-center h-10 md:h-12 px-3 md:px-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-purple-100 transition-all cursor-pointer"
                >
                  <Trophy className="w-5 h-5 text-yellow-500 md:mr-2 fill-yellow-100" />
                  <span className="text-[#5D3191] font-bold text-[10px] uppercase tracking-widest hidden lg:block">
                    Шилдэгүүд
                  </span>
                </motion.div>
              </Link>

              <div className="flex items-center bg-white/90 border border-gray-100 rounded-[24px] p-1 shadow-sm">
                <div className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 bg-yellow-50/50 rounded-[20px] mr-1">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 fill-yellow-400" />
                  <span className="text-[#5D3191] font-black text-sm md:text-lg leading-none">
                    {isLoaded ? userStars : "..."}
                  </span>
                </div>

                <motion.div
                  onClick={() => setShowSelector(!showSelector)}
                  whileTap={{ scale: 0.9 }}
                  className="relative group cursor-pointer"
                >
                  <div className="w-9 h-9 md:w-11 md:h-11 rounded-full p-0.5 bg-gradient-to-tr from-[#5D3191] to-[#8DC63F] group-hover:rotate-6 transition-transform">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-white">
                      <Image
                        src={selectedAvatar.src}
                        alt="Avatar"
                        width={44}
                        height={44}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>

              <AnimatePresence>
                {showSelector && (
                  <>
                    <div
                      className="fixed inset-0 z-[-1]"
                      onClick={() => setShowSelector(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 10, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-64 md:w-72 bg-white rounded-[28px] shadow-2xl border border-gray-50 p-6 z-[60]"
                    >
                      <div className="flex flex-col items-center mb-6 pb-4 border-b border-gray-50">
                        <span className="text-[#5D3191] font-black text-lg text-center leading-tight">
                          {userNickname}
                        </span>
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                          {userGrade && (
                            <span className="text-[10px] font-bold bg-green-50 text-[#8DC63F] px-2 py-0.5 rounded-full uppercase">
                              {userGrade} анги
                            </span>
                          )}
                          {userAge && (
                            <span className="text-[10px] font-bold bg-purple-50 text-[#5D3191] px-2 py-0.5 rounded-full uppercase">
                              {userAge} настай
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[#5D3191] font-black text-[10px] uppercase tracking-widest opacity-40">
                          Баатар сонгох
                        </span>
                        <X
                          className="w-4 h-4 text-gray-300 cursor-pointer hover:text-red-400"
                          onClick={() => setShowSelector(false)}
                        />
                      </div>

                      <div className="grid grid-cols-4 gap-3 max-h-52 overflow-y-auto pr-1 no-scrollbar">
                        {avatars.map((av) => (
                          <div key={av.id} className="relative group">
                            <div
                              onClick={() => {
                                if (!av.isLocked) {
                                  setSelectedAvatar(av);
                                  localStorage.setItem(
                                    "selectedHero",
                                    JSON.stringify(av),
                                  );
                                  setShowSelector(false);
                                }
                              }}
                              className={`aspect-square rounded-xl p-0.5 cursor-pointer transition-all ${
                                av.isLocked
                                  ? "opacity-50 grayscale cursor-not-allowed"
                                  : "hover:scale-110"
                              } ${selectedAvatar.id === av.id ? "bg-[#5D3191]" : "bg-gray-50"}`}
                            >
                              <div className="w-full h-full rounded-lg overflow-hidden border-2 border-white bg-white relative">
                                <Image
                                  src={av.src}
                                  width={50}
                                  height={50}
                                  className="w-full h-full object-cover"
                                  alt="Hero"
                                />
                                {av.isLocked && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <Lock className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 space-y-2">
                        <button
                          onClick={() => {
                            router.push("/onboarding");
                            setShowSelector(false);
                          }}
                          className="w-full py-3 bg-blue-50 text-blue-600 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Мэдээлэл засах
                        </button>

                        <button
                          onClick={() => {
                            router.push("/baatar");
                            setShowSelector(false);
                          }}
                          className="w-full py-3 bg-purple-50 text-[#5D3191] font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl hover:bg-purple-100 transition-colors border border-purple-100"
                        >
                          <LayoutGrid className="w-3.5 h-3.5" /> Бүх баатрыг
                          харах
                        </button>

                        <button
                          onClick={() => {
                            signOut();
                            setShowSelector(false);
                          }}
                          className="w-full py-3 bg-red-50 text-red-500 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl hover:bg-red-100 transition-colors"
                        >
                          <LogOut className="w-3 h-3" /> Гарах
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const Header = () => (
  <Suspense fallback={<div className="h-20" />}>
    <HeaderContent />
  </Suspense>
);

export default Header;
