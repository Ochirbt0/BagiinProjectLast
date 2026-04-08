// "use client";
// import React, { useEffect, useMemo, useState } from "react";
// import { motion } from "framer-motion";
// import { Trophy, Star, Crown } from "lucide-react";
// import { getLeaderboard } from "@/lib/backend-api";

// type Player = {
//   id: string;
//   name: string;
//   avatar: string;
//   rank: number;
//   stars: number;
// };

// const toPlayer = (
//   p: { id: string; name: string; avatarUrl: string | null; score: number },
//   rank: number,
// ): Player => ({
//   id: p.id,
//   name: p.name || `Баатар #${rank}`,
//   avatar: p.avatarUrl || `/${Math.min(rank, 10)}.png`,
//   rank,
//   stars: p.score,
// });

// const LeaderboardPage = () => {
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const data = await getLeaderboard();

//         const rows = [
//           data.topThree.gold,
//           data.topThree.silver,
//           data.topThree.bronze,
//           ...data.others,
//         ].filter(Boolean) as Array<{
//           id: string;
//           name: string;
//           avatarUrl: string | null;
//           score: number;
//         }>;

//         const mapped = rows.map((p, i) => toPlayer(p, i + 1));
//         setPlayers(mapped);
//       } catch (e) {
//         const msg =
//           e instanceof Error
//             ? e.message
//             : "Leaderboard ачааллахад алдаа гарлаа";
//         setError(msg);
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, []);

//   const podium = useMemo(() => {
//     const sorted = [...players].sort((a, b) => a.rank - b.rank);
//     return {
//       gold: sorted.find((p) => p.rank === 1) || null,
//       silver: sorted.find((p) => p.rank === 2) || null,
//       bronze: sorted.find((p) => p.rank === 3) || null,
//       others: sorted.filter((p) => p.rank > 3),
//     };
//   }, [players]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#FDFCFE] flex items-center justify-center text-[#5D3191] font-black">
//         Leaderboard ачааллаж байна...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-[#FDFCFE] flex items-center justify-center px-6 text-center text-red-500 font-bold">
//         {error}
//       </div>
//     );
//   }

//   if (players.length === 0) {
//     return (
//       <div className="min-h-screen bg-[#FDFCFE] flex items-center justify-center text-slate-500 font-bold">
//         Одоогоор leaderboard дээр хэрэглэгч алга.
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#FDFCFE] relative overflow-hidden pt-30 pb-10 flex">
//       <div className="container mx-auto px-4  relative z-10">
//         <div className="flex justify-center items-center mb-16 md:mb-26">
//           <div className="text-center">
//             <h1 className="text-[#5D3191] font-[1000] text-2xl md:text-4xl text-center tracking-tighter uppercase italic">
//               Шилдэг <span className="text-[#8DC63F]">Баатрууд</span>
//             </h1>
//           </div>
//         </div>

//         {(podium.gold || podium.silver || podium.bronze) && (
//           <div className="flex items-end justify-center gap-3 md:gap-8 mb-20">
//             {podium.silver && (
//               <PodiumHero
//                 player={podium.silver}
//                 size="w-28 h-28 md:w-40 md:h-40"
//                 delay={0.2}
//               />
//             )}
//             {podium.gold && (
//               <PodiumHero
//                 player={podium.gold}
//                 size="w-36 h-36 md:w-52 md:h-52"
//                 delay={0}
//               />
//             )}
//             {podium.bronze && (
//               <PodiumHero
//                 player={podium.bronze}
//                 size="w-24 h-24 md:w-36 md:h-36"
//                 delay={0.4}
//               />
//             )}
//           </div>
//         )}

//         <div className="max-w-2xl mx-auto space-y-3">
//           {podium.others.map((p, i) => (
//             <motion.div
//               key={p.id}
//               initial={{ opacity: 0, x: -20 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: i * 0.05 }}
//               whileHover={{
//                 x: 10,
//                 backgroundColor: "rgba(255, 255, 255, 0.9)",
//               }}
//               className="flex items-center justify-between p-3 md:p-4 bg-white/70 backdrop-blur-md rounded-[24px] border border-white shadow-sm hover:shadow-md transition-all group cursor-default"
//             >
//               <div className="flex items-center gap-4">
//                 <span className="w-6 text-center font-black text-[#5D3191]/30 text-sm md:text-lg italic group-hover:text-[#8DC63F] transition-colors">
//                   {p.rank}
//                 </span>
//                 <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-gray-100 to-white border border-gray-100 group-hover:rotate-3 transition-transform">
//                   <img
//                     src={p.avatar}
//                     className="w-full h-full object-cover rounded-[14px]"
//                     alt="avatar"
//                   />
//                 </div>
//                 <h3 className="text-[#5D3191] font-black text-sm md:text-lg">
//                   {p.name}
//                 </h3>
//               </div>

//               <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-50 shadow-inner group-hover:scale-105 transition-transform">
//                 <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
//                 <span className="text-[#5D3191] font-black text-sm md:text-lg">
//                   {p.stars}
//                 </span>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// type PodiumHeroProps = {
//   player: Player;
//   size: string;
//   delay: number;
// };

// const PodiumHero = ({ player, size, delay }: PodiumHeroProps) => {
//   const rankColors: Record<
//     number,
//     {
//       border: string;
//       bg: string;
//       shadow: string;
//       icon: React.ReactNode;
//       title: string;
//       aura: string
//       titleColor: string;
//     }
//   > = {
//     1: {
//       border: "border-yellow-400",
//       bg: "bg-yellow-400",
//       shadow: "shadow-yellow-100",
//       aura: "rgba(250, 204, 21, 0.45)",
//       icon: (
//         <Crown className="w-10 h-10 md:w-16 md:h-16 text-yellow-400 fill-yellow-400" />
//       ),
//       title: "Алтан Баатар",
//       titleColor: "text-yellow-600",
//     },
//     2: {
//       border: "border-slate-300",
//       bg: "bg-slate-400",
//       shadow: "shadow-slate-100",
//       aura: "rgba(148, 163, 184, 0.35)",
//       icon: (
//         <Trophy className="w-8 h-8 md:w-12 md:h-12 text-slate-300 fill-slate-100" />
//       ),
//       title: "Мөнгөн Баатар",
//       titleColor: "text-slate-500",
//     },
//     3: {
//       border: "border-orange-300",
//       bg: "bg-orange-400",
//       shadow: "shadow-orange-100",
//       aura: "rgba(251, 146, 60, 0.35)",
//       icon: (
//         <Trophy className="w-7 h-7 md:w-10 md:h-10 text-orange-300 fill-orange-100" />
//       ),
//       title: "Хүрэл Баатар",
//       titleColor: "text-orange-600",
//     },
//   };

//   const style = rankColors[player.rank] || rankColors[3];

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 40 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay, duration: 0.7, type: "spring" }}
//       className="flex flex-col items-center group"
//     >
//       <div className="relative mb-4">
//         <motion.div
//           animate={{ scale: [0.96, 1.06, 0.96], opacity: [0.35, 0.6, 0.35] }}
//           transition={{ repeat: Infinity, duration: 2.8 + player.rank * 0.4 }}
//           className="absolute -inset-4 md:-inset-6 rounded-[36px] md:rounded-[52px] blur-2xl z-0"
//           style={{ background: style.aura }}
//         />
//         <motion.div
//           animate={{ y: [0, -8, 0] }}
//           transition={{ repeat: Infinity, duration: 3 + player.rank }}
//           className="absolute -top-10 md:-top-16 left-1/2 -translate-x-1/2 z-20 group-hover:scale-125 transition-transform"
//         >
//           {style.icon}
//         </motion.div>
//         <div
//           className={`${size} ${style.border} ${style.shadow} rounded-[32px] md:rounded-[48px] overflow-hidden p-1.5 bg-white border-[4px] md:border-[6px] relative z-10 transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-2`}
//         >
//           <div
//             className="absolute inset-0 pointer-events-none"
//             style={{
//               background:
//                 "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 45%)",
//             }}
//           />
//           <img
//             src={player.avatar}
//             className="w-full h-full object-cover rounded-[24px] md:rounded-[38px]"
//             alt="avatar"
//           />
//         </div>
//         <div
//           className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white font-black shadow-lg z-20 text-[9px] md:text-[11px] uppercase tracking-wider ${style.bg} border-2 border-white group-hover:scale-110 transition-transform`}
//         >
//           #{player.rank}
//         </div>
//       </div>

//       <div className="text-center">
//         <p
//           className={`text-[9px] md:text-[15px] font-[1000] uppercase tracking-[0.2em] mb-0.5 ${style.titleColor}`}
//         >
//           {style.title}
//         </p>

//         <h3 className="text-[#5D3191] font-black text-xs md:text-l mb-1 truncate max-w-[120px] md:max-w-[200px] uppercase italic tracking-tighter">
//           {player.name}
//         </h3>
//         <div className="inline-flex items-center gap-1.5 bg-white border border-gray-100 px-3 py-1.5 rounded-xl shadow-sm group-hover:shadow-yellow-100 transition-all group-hover:border-yellow-200">
//           <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 group-hover:scale-125 transition-transform" />
//           <span className="text-[#5D3191] font-black text-sm md:text-lg leading-none tracking-tighter">
//             {player.stars}
//           </span>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default LeaderboardPage;

"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Crown } from "lucide-react";
import { getLeaderboard } from "@/lib/backend-api";

type Player = {
  id: string;
  name: string;
  avatar: string;
  rank: number;
  stars: number;
};

// --- ЗАСВАР: Fallback зураг тодорхойлох ---
const DEFAULT_AVATAR = "/16.png";

const toPlayer = (
  p: { id: string; name: string; avatarUrl: string | null; score: number },
  rank: number,
): Player => ({
  id: p.id,
  name: p.name || `Баатар #${rank}`,
  // ЗАСВАР: rank-аар биш, ирсэн avatarUrl-ийг авна. Байхгүй бол Default зураг.
  avatar: p.avatarUrl || DEFAULT_AVATAR,
  rank,
  stars: p.score,
});

const LeaderboardPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getLeaderboard();

        const rows = [
          data.topThree.gold,
          data.topThree.silver,
          data.topThree.bronze,
          ...data.others,
        ].filter(Boolean) as Array<{
          id: string;
          name: string;
          avatarUrl: string | null;
          score: number;
        }>;

        const mapped = rows.map((p, i) => toPlayer(p, i + 1));
        setPlayers(mapped);
      } catch (e) {
        const msg =
          e instanceof Error
            ? e.message
            : "Leaderboard ачааллахад алдаа гарлаа";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const podium = useMemo(() => {
    const sorted = [...players].sort((a, b) => a.rank - b.rank);
    return {
      gold: sorted.find((p) => p.rank === 1) || null,
      silver: sorted.find((p) => p.rank === 2) || null,
      bronze: sorted.find((p) => p.rank === 3) || null,
      others: sorted.filter((p) => p.rank > 3),
    };
  }, [players]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFE] flex items-center justify-center text-[#5D3191] font-black">
        Leaderboard ачааллаж байна...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFCFE] flex items-center justify-center px-6 text-center text-red-500 font-bold">
        {error}
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFCFE] flex items-center justify-center text-slate-500 font-bold">
        Одоогоор leaderboard дээр хэрэглэгч алга.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFE] relative overflow-hidden pt-30 pb-10 flex">
      <div className="container mx-auto px-4  relative z-10">
        <div className="flex justify-center items-center mb-16 md:mb-26">
          <div className="text-center">
            <h1 className="text-[#5D3191] font-[1000] text-2xl md:text-4xl text-center tracking-tighter uppercase italic">
              Шилдэг <span className="text-[#8DC63F]">Баатрууд</span>
            </h1>
          </div>
        </div>

        {(podium.gold || podium.silver || podium.bronze) && (
          <div className="flex items-end justify-center gap-3 md:gap-8 mb-20">
            {podium.silver && (
              <PodiumHero
                player={podium.silver}
                size="w-28 h-28 md:w-40 md:h-40"
                delay={0.2}
              />
            )}
            {podium.gold && (
              <PodiumHero
                player={podium.gold}
                size="w-36 h-36 md:w-52 md:h-52"
                delay={0}
              />
            )}
            {podium.bronze && (
              <PodiumHero
                player={podium.bronze}
                size="w-24 h-24 md:w-36 md:h-36"
                delay={0.4}
              />
            )}
          </div>
        )}

        <div className="max-w-2xl mx-auto space-y-3">
          {podium.others.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{
                x: 10,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              }}
              className="flex items-center justify-between p-3 md:p-4 bg-white/70 backdrop-blur-md rounded-[24px] border border-white shadow-sm hover:shadow-md transition-all group cursor-default"
            >
              <div className="flex items-center gap-4">
                <span className="w-6 text-center font-black text-[#5D3191]/30 text-sm md:text-lg italic group-hover:text-[#8DC63F] transition-colors">
                  {p.rank}
                </span>
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-gray-100 to-white border border-gray-100 group-hover:rotate-3 transition-transform">
                  <img
                    src={p.avatar}
                    className="w-full h-full object-cover rounded-[14px]"
                    alt="avatar"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                    }}
                  />
                </div>
                <h3 className="text-[#5D3191] font-black text-sm md:text-lg">
                  {p.name}
                </h3>
              </div>

              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-50 shadow-inner group-hover:scale-105 transition-transform">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-[#5D3191] font-black text-sm md:text-lg">
                  {p.stars}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

type PodiumHeroProps = {
  player: Player;
  size: string;
  delay: number;
};

const PodiumHero = ({ player, size, delay }: PodiumHeroProps) => {
  const rankColors: Record<
    number,
    {
      border: string;
      bg: string;
      shadow: string;
      icon: React.ReactNode;
      title: string;
      aura: string;
      titleColor: string;
    }
  > = {
    1: {
      border: "border-yellow-400",
      bg: "bg-yellow-400",
      shadow: "shadow-yellow-100",
      aura: "rgba(250, 204, 21, 0.45)",
      icon: (
        <Crown className="w-10 h-10 md:w-16 md:h-16 text-yellow-400 fill-yellow-400" />
      ),
      title: "Алтан Баатар",
      titleColor: "text-yellow-600",
    },
    2: {
      border: "border-slate-300",
      bg: "bg-slate-400",
      shadow: "shadow-slate-100",
      aura: "rgba(148, 163, 184, 0.35)",
      icon: (
        <Trophy className="w-8 h-8 md:w-12 md:h-12 text-slate-300 fill-slate-100" />
      ),
      title: "Мөнгөн Баатар",
      titleColor: "text-slate-500",
    },
    3: {
      border: "border-orange-300",
      bg: "bg-orange-400",
      shadow: "shadow-orange-100",
      aura: "rgba(251, 146, 60, 0.35)",
      icon: (
        <Trophy className="w-7 h-7 md:w-10 md:h-10 text-orange-300 fill-orange-100" />
      ),
      title: "Хүрэл Баатар",
      titleColor: "text-orange-600",
    },
  };

  const style = rankColors[player.rank] || rankColors[3];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, type: "spring" }}
      className="flex flex-col items-center group"
    >
      <div className="relative mb-4">
        <motion.div
          animate={{ scale: [0.96, 1.06, 0.96], opacity: [0.35, 0.6, 0.35] }}
          transition={{ repeat: Infinity, duration: 2.8 + player.rank * 0.4 }}
          className="absolute -inset-4 md:-inset-6 rounded-[36px] md:rounded-[52px] blur-2xl z-0"
          style={{ background: style.aura }}
        />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3 + player.rank }}
          className="absolute -top-10 md:-top-16 left-1/2 -translate-x-1/2 z-20 group-hover:scale-125 transition-transform"
        >
          {style.icon}
        </motion.div>
        <div
          className={`${size} ${style.border} ${style.shadow} rounded-[32px] md:rounded-[48px] overflow-hidden p-1.5 bg-white border-[4px] md:border-[6px] relative z-10 transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-2`}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 45%)",
            }}
          />
          <img
            src={player.avatar}
            className="w-full h-full object-cover rounded-[24px] md:rounded-[38px]"
            alt="avatar"
            // ЗАСВАР: Podium дээрх зураг ачаалахад алдаа гарвал DEFAULT харуулна
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
            }}
          />
        </div>
        <div
          className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white font-black shadow-lg z-20 text-[9px] md:text-[11px] uppercase tracking-wider ${style.bg} border-2 border-white group-hover:scale-110 transition-transform`}
        >
          #{player.rank}
        </div>
      </div>

      <div className="text-center">
        <p
          className={`text-[9px] md:text-[15px] font-[1000] uppercase tracking-[0.2em] mb-0.5 ${style.titleColor}`}
        >
          {style.title}
        </p>

        <h3 className="text-[#5D3191] font-black text-xs md:text-l mb-1 truncate max-w-[120px] md:max-w-[200px] uppercase italic tracking-tighter">
          {player.name}
        </h3>
        <div className="inline-flex items-center gap-1.5 bg-white border border-gray-100 px-3 py-1.5 rounded-xl shadow-sm group-hover:shadow-yellow-100 transition-all group-hover:border-yellow-200">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 group-hover:scale-125 transition-transform" />
          <span className="text-[#5D3191] font-black text-sm md:text-lg leading-none tracking-tighter">
            {player.stars}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default LeaderboardPage;
