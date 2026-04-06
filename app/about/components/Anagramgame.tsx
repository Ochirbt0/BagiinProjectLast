// import { useState, useCallback, useRef } from "react"

// // ── Types & constants ────────────────────────────────────────────────────────

// export interface PlacedLetter { letter: string; trayIdx: number }

// export type SlotState = PlacedLetter | null

// export type SlotAnim  = "idle" | "error" | "success" | "drop"

// export const BLOCK_COLORS = [

//   { bg: "#cfe5ff", shadow: "#99cbff", color: "#004a78" },

//   { bg: "#9ff79f", shadow: "#83da85", color: "#005318" },

//   { bg: "#ffdf9e", shadow: "#fabd00", color: "#261a00" },

//   { bg: "#ffd9f0", shadow: "#f0a8d8", color: "#5a1040" },

// ]

// export const CONFETTI_COLORS = ["#ffdf9e","#9ff79f","#cfe5ff","#ffd9f0","#fabd00","#83da85"]

// export function shuffle<T>(arr: T[]): T[] {

//   const a = [...arr]

//   for (let i = a.length - 1; i > 0; i--) {

//     const j = Math.floor(Math.random() * (i + 1))

//     ;[a[i], a[j]] = [a[j], a[i]]

//   }

//   return a

// }

// // ── Fetch incorrect words from API ───────────────────────────────────────────

// export async function fetchIncorrectWords(text: string): Promise<string[]> {

//   const res = await fetch("/api/spell-check", {

//     method: "POST",

//     headers: { "Content-Type": "application/json" },

//     body: JSON.stringify({ text }),

//   })

//   if (!res.ok) throw new Error("Spell check failed")

//   const data = await res.json()

//   // Uppercase, dedupe, filter empty

//   return [...new Set<string>(

//     (data.incorrectWords as string[])

//       .map((w: string) => w.trim().toUpperCase())

//       .filter((w: string) => w.length > 1)

//   )]

// }

// // ── Game hook ────────────────────────────────────────────────────────────────

// export function useAnagramGame() {

//   const [words, setWords]             = useState<string[]>([])

//   const [wordIdx, setWordIdx]         = useState(0)

//   const [shuffled, setShuffled]       = useState<string[]>([])

//   const [placed, setPlaced]           = useState<SlotState[]>([])

//   const [hintCount, setHintCount]     = useState(0)

//   const [isChecking, setIsChecking]   = useState(false)

//   const [isLoading, setIsLoading]     = useState(false)

//   const [loadError, setLoadError]     = useState<string | null>(null)

//   const [slotAnims, setSlotAnims]     = useState<Record<number, SlotAnim>>({})

//   const [blockHidden, setBlockHidden] = useState<Record<number, boolean>>({})

//   const [showSuccess, setShowSuccess] = useState(false)

//   const lockRef                       = useRef(false)

//   const currentWord = words[wordIdx] ?? ""

//   // ── Load words from API ──────────────────────────────────────────────────

//   const loadWords = useCallback(async (text: string) => {

//     setIsLoading(true)

//     setLoadError(null)

//     try {

//       const incorrect = await fetchIncorrectWords(text)

//       if (incorrect.length === 0) {

//         setLoadError("Алдаатай үг олдсонгүй")

//         return

//       }

//       setWords(incorrect)

//       initRound(incorrect, 0)

//     } catch {

//       setLoadError("Сүлжээний алдаа гарлаа")

//     } finally {

//       setIsLoading(false)

//     }

//   }, []) // eslint-disable-line

//   // ── Init a round ─────────────────────────────────────────────────────────

//   const initRound = (wordList: string[], idx: number) => {

//     const word = wordList[idx]

//     if (!word) return

//     setWordIdx(idx)

//     setShuffled(shuffle([...word]))

//     setPlaced(Array(word.length).fill(null))

//     setHintCount(0)

//     setIsChecking(false)

//     setSlotAnims({})

//     setBlockHidden({})

//     setShowSuccess(false)

//     lockRef.current = false

//   }

//   const hideBlock = (ti: number) => setBlockHidden(b => ({ ...b, [ti]: true  }))

//   const showBlock = (ti: number) => setBlockHidden(b => ({ ...b, [ti]: false }))

//   const setAnim   = (i: number, a: SlotAnim) => setSlotAnims(s => ({ ...s, [i]: a }))

//   // ── Check ────────────────────────────────────────────────────────────────

//   const runCheck = useCallback((cur: SlotState[], word: string) => {

//     const formed = cur.map(p => p?.letter ?? "_").join("")

//     if (formed === word) {

//       cur.forEach((_, i) => setAnim(i, "success"))

//       setTimeout(() => setShowSuccess(true), 400)

//       return

//     }

//     lockRef.current = true

//     setIsChecking(true)

//     const wrong = cur.map((p, i) => (!p || p.letter !== word[i] ? i : -1)).filter(i => i >= 0)

//     wrong.forEach(i => setAnim(i, "error"))

//     setTimeout(() => {

//       wrong.forEach(i => setAnim(i, "drop"))

//       setTimeout(() => {

//         wrong.forEach(i => { const p = cur[i]; if (p) showBlock(p.trayIdx) })

//         setPlaced(prev => {

//           const next = [...prev]

//           wrong.forEach(i => { next[i] = null })

//           return next

//         })

//         wrong.forEach(i => setAnim(i, "idle"))

//         lockRef.current = false

//         setIsChecking(false)

//       }, 350)

//     }, 530)

//   }, []) // eslint-disable-line

//   // ── Place block ──────────────────────────────────────────────────────────

//   const placeBlock = useCallback((trayIdx: number) => {

//     if (lockRef.current) return

//     setPlaced(prev => {

//       const slot = prev.findIndex(p => p === null)

//       if (slot === -1) return prev

//       const next = [...prev]

//       next[slot] = { letter: shuffled[trayIdx], trayIdx }

//       hideBlock(trayIdx)

//       setAnim(slot, "idle")

//       if (next.every(Boolean)) {

//         const word = words[wordIdx]

//         setTimeout(() => runCheck(next, word), 280)

//       }

//       return next

//     })

//   }, [shuffled, wordIdx, words, runCheck])

//   // ── Hint ─────────────────────────────────────────────────────────────────

//   const giveHint = useCallback(() => {

//     if (hintCount >= 2 || lockRef.current) return

//     setHintCount(c => c + 1)

//     const word = words[wordIdx]

//     setPlaced(prev => {

//       for (let i = 0; i < word.length; i++) {

//         if (!prev[i]) {

//           const ti = shuffled.findIndex((l, idx) => l === word[i] && !prev.some(p => p?.trayIdx === idx))

//           if (ti !== -1) {

//             const next = [...prev]

//             next[i] = { letter: word[i], trayIdx: ti }

//             hideBlock(ti)

//             setAnim(i, "idle")

//             if (next.every(Boolean)) setTimeout(() => runCheck(next, word), 300)

//             return next

//           }

//         }

//       }

//       return prev

//     })

//   }, [hintCount, shuffled, wordIdx, words, runCheck])

//   // ── Next word ────────────────────────────────────────────────────────────

//   const nextWord = useCallback(() => {

//     const next = wordIdx + 1

//     if (next < words.length) {

//       initRound(words, next)

//     } else {

//       // All words done — reset to first

//       initRound(words, 0)

//     }

//   }, [wordIdx, words])

//   return {

//     currentWord, wordIdx, wordCount: words.length,

//     shuffled, placed, hintCount, isChecking,

//     isLoading, loadError,

//     slotAnims, blockHidden, showSuccess,

//     placeBlock, giveHint, nextWord, loadWords,

//   }

// }

// ene game.ts nertei lib dotor bairlana

// "use client"

// import { useEffect, useRef, useState } from "react"

// import { useAnagramGame, BLOCK_COLORS, CONFETTI_COLORS, type SlotState, type SlotAnim } from "@/lib/game"

// // ── Main component ───────────────────────────────────────────────────────────

// export default function AnagramGame() {

//   const game = useAnagramGame()

//   const { currentWord, wordIdx, wordCount, shuffled, placed, hintCount,

//           isChecking, isLoading, loadError,

//           slotAnims, blockHidden, showSuccess,

//           placeBlock, giveHint, nextWord, loadWords } = game

//   useEffect(() => {

//     if (showSuccess) {

//       const t = setTimeout(nextWord, 2400)

//       return () => clearTimeout(t)

//     }

//   }, [showSuccess, nextWord])

//   // Show input screen until words are loaded

//   if (wordCount === 0) {

//     return (
// <InputScreen

//         onSubmit={loadWords}

//         isLoading={isLoading}

//         error={loadError}

//       />

//     )

//   }

//   return (
// <div className="flex flex-col h-screen overflow-hidden" style={{ background: "#fbfaee" }}>
// <style>{GLOBAL_CSS}</style>

//       {/* Header */}
// <header className="w-full h-16 px-6 flex justify-between items-center z-50 relative"

//         style={{ background: "#fbfaee", boxShadow: "0 2px 16px rgba(120,89,0,0.07)" }}>
// <div className="flex items-center gap-4">
// <span className="text-xl font-bold text-[#785900]" style={{ fontFamily: JK }}>Spelling Adventure</span>
// <div className="hidden md:flex h-9 rounded-full px-4 items-center gap-3" style={{ background: "#e9e9dd" }}>
// <div className="w-20 h-2.5 rounded-full overflow-hidden" style={{ background: "#dbdbcf" }}>
// <div className="h-full rounded-full transition-all"

//                 style={{ background: "#fabd00", width: `${Math.max((wordIdx / wordCount) * 100, 6)}%` }} />
// </div>
// <span className="text-xs font-bold text-[#785900]" style={{ fontFamily: JK }}>

//               {wordIdx + 1} / {wordCount}
// </span>
// </div>
// </div>
// <button className="w-10 h-10 flex items-center justify-center rounded-full hover:scale-105 transition-transform active:scale-95"

//           style={{ background: "#e4e3d7" }}

//           onClick={() => window.location.reload()}>
// <span className="material-symbols-outlined text-[#785900] text-xl">refresh</span>
// </button>
// </header>

//       {/* Main */}
// <main className="relative flex flex-col flex-1 overflow-hidden">
// <BackgroundSheet />
// <div className="absolute inset-0 z-20 flex items-center justify-center p-4"

//           style={{ background: "rgba(251,250,238,0.45)", backdropFilter: "blur(3px)" }}>
// <div className="relative w-full" style={{ maxWidth: 680 }}>

//             <div className="w-full relative p-8" style={{

//               borderRadius: "3rem", border: "3px solid white",

//               background: "rgba(251,250,238,0.97)", backdropFilter: "blur(12px)",

//               boxShadow: showSuccess

//                 ? "0 32px 64px rgba(120,89,0,0.15),0 0 0 4px rgba(18,109,39,0.2)"

//                 : "0 32px 64px rgba(120,89,0,0.15)",

//               transition: "box-shadow 0.4s",

//             }}>
// <ConfettiLayer active={showSuccess} />

//               {showSuccess && <SuccessOverlay />}

//               {/* Target slots */}
// <div className="flex flex-wrap justify-center gap-4 mb-8">

//                 {currentWord.split("").map((_, i) => (
// <TargetSlot key={i} placed={placed[i] ?? null} anim={slotAnims[i] ?? "idle"} />

//                 ))}
// </div>

//               <div className="h-px mx-8 mb-8" style={{ background: "rgba(216,196,160,0.2)" }} />

//               {/* Letter tray */}
// <div className="rounded-full px-8 py-6 flex flex-wrap justify-center gap-5 mb-8"

//                 style={{ background: "#f5f4e8", boxShadow: "inset 0 4px 16px rgba(120,89,0,0.06)", border: "2px solid white" }}>

//                 {shuffled.map((letter, i) => (
// <LetterBlock key={i} letter={letter} trayIdx={i}

//                     hidden={blockHidden[i] ?? false}

//                     onClick={isChecking ? () => {} : placeBlock} />

//                 ))}
// </div>

//               {/* Actions */}
// <div className="flex flex-col items-center gap-4">
// <button className="group flex items-center gap-3 rounded-full px-12 py-4 text-lg font-bold text-white"

//                   style={{ fontFamily: JK, background: "#785900", boxShadow: "0 10px 0 #5b4300", transition: "transform .1s,box-shadow .1s" }}

//                   onMouseDown={e => { e.currentTarget.style.transform = "translateY(6px)"; e.currentTarget.style.boxShadow = "0 4px 0 #5b4300" }}

//                   onMouseUp={e =>   { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 10px 0 #5b4300" }}

//                   onMouseLeave={e =>{ e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 10px 0 #5b4300" }}>
// <span>Шалгах</span>
// <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
// </button>
// <button onClick={giveHint} className="flex items-center gap-2 font-bold transition-opacity"

//                   style={{ color: "rgba(120,89,0,0.65)", fontFamily: VN, opacity: hintCount >= 2 ? 0.3 : 1, pointerEvents: hintCount >= 2 ? "none" : "auto" }}>
// <span className="material-symbols-outlined text-base">lightbulb</span>
// <span className="text-xs uppercase tracking-widest">Санаа өгөх</span>
// </button>
// </div>
// </div>

//             {/* Progress dots */}
// <div className="flex justify-center gap-2 mt-5">

//               {Array.from({ length: wordCount }).map((_, i) => (
// <div key={i} className="rounded-full transition-all duration-300" style={{

//                   width: i === wordIdx ? 24 : 10, height: 10,

//                   background: i < wordIdx ? "#126d27" : i === wordIdx ? "#fabd00" : "#e4e3d7",

//                 }} />

//               ))}
// </div>
// </div>
// </div>
// </main>

//       <Footer />
// </div>

//   )

// }

// // ── Input screen ─────────────────────────────────────────────────────────────

// function InputScreen({ onSubmit, isLoading, error }: {

//   onSubmit: (text: string) => void

//   isLoading: boolean

//   error: string | null

// }) {

//   const [text, setText] = useState("")

//   return (
// <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#fbfaee" }}>
// <style>{GLOBAL_CSS}</style>
// <div className="w-full" style={{ maxWidth: 520 }}>

//         {/* Logo */}
// <div className="text-center mb-10">
// <div className="text-5xl mb-3">📝</div>
// <h1 className="text-3xl font-extrabold text-[#785900] mb-2" style={{ fontFamily: JK }}>

//             Spelling Adventure
// </h1>
// <p className="text-sm text-[#785900]/60" style={{ fontFamily: VN }}>

//             Текст оруулахад алдаатай үгсийг олж анаграм тоглоом үүсгэнэ
// </p>
// </div>

//         {/* Card */}
// <div className="p-8 relative" style={{

//           background: "rgba(251,250,238,0.97)",

//           borderRadius: "3rem",

//           border: "3px solid white",

//           boxShadow: "0 24px 56px rgba(120,89,0,0.12)",

//         }}>
// <label className="block text-sm font-bold mb-3 text-[#785900]/70 uppercase tracking-widest"

//             style={{ fontFamily: VN }}>

//             Текст бичнэ үү
// </label>
// <textarea

//             value={text}

//             onChange={e => setText(e.target.value)}

//             placeholder="Жишээ: Миний нохой маш сайхан байдаг..."

//             rows={5}

//             className="w-full resize-none outline-none text-base"

//             style={{

//               background: "#f5f4e8",

//               borderRadius: "1.5rem",

//               border: "none",

//               padding: "16px 20px",

//               fontFamily: VN,

//               color: "#1b1c15",

//               boxShadow: "inset 0 3px 10px rgba(120,89,0,0.05)",

//               marginBottom: 20,

//             }}

//           />

//           {error && (
// <div className="mb-4 px-4 py-3 rounded-2xl text-sm font-bold"

//               style={{ background: "#ffdad6", color: "#93000a", fontFamily: VN }}>

//               {error}
// </div>

//           )}

//           <button

//             onClick={() => text.trim() && onSubmit(text.trim())}

//             disabled={isLoading || !text.trim()}

//             className="w-full flex items-center justify-center gap-3 rounded-full py-4 text-lg font-bold text-white transition-all"

//             style={{

//               fontFamily: JK,

//               background: isLoading || !text.trim() ? "#c4a870" : "#785900",

//               boxShadow: isLoading || !text.trim() ? "0 6px 0 #a88d50" : "0 10px 0 #5b4300",

//               cursor: isLoading || !text.trim() ? "not-allowed" : "pointer",

//               transition: "transform .1s, box-shadow .1s",

//             }}

//             onMouseDown={e => { if (!isLoading && text.trim()) { e.currentTarget.style.transform = "translateY(6px)"; e.currentTarget.style.boxShadow = "0 4px 0 #5b4300" }}}

//             onMouseUp={e =>   { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 10px 0 #5b4300" }}

//             onMouseLeave={e =>{ e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 10px 0 #5b4300" }}
// >

//             {isLoading ? (
// <>
// <span className="material-symbols-outlined text-2xl" style={{ animation: "spin 1s linear infinite" }}>sync</span>
// <span>Шалгаж байна...</span>
// </>

//             ) : (
// <>
// <span>Тоглоом эхлүүлэх</span>
// <span className="material-symbols-outlined text-2xl">arrow_forward</span>
// </>

//             )}
// </button>
// </div>
// </div>
// </div>

//   )

// }

// // ── Sub-components ───────────────────────────────────────────────────────────

// function TargetSlot({ placed, anim }: { placed: SlotState; anim: SlotAnim }) {

//   const ref = useRef<HTMLDivElement>(null)

//   useEffect(() => {

//     const el = ref.current; if (!el) return

//     el.classList.remove("slot-pop-in","slot-error","slot-success")

//     void el.offsetWidth

//     if (anim === "error")              el.classList.add("slot-error")

//     if (anim === "success")            el.classList.add("slot-success")

//     if (placed && anim === "idle")     el.classList.add("slot-pop-in")

//   }, [anim, placed])

//   const s: React.CSSProperties = anim === "drop"

//     ? { position:"absolute",inset:8,borderRadius:"9999px",display:"flex",alignItems:"center",justifyContent:"center",background:"#ba1a1a",boxShadow:"0 4px 0 #8c0009",color:"white",transition:"transform .32s ease-in,opacity .32s ease-in",transform:"translateY(32px) scale(0.5)",opacity:0 }

//     : placed

//     ? { position:"absolute",inset:8,borderRadius:"9999px",display:"flex",alignItems:"center",justifyContent:"center",background:"#ffdf9e",boxShadow:"0 4px 0 #fabd00" }

//     : { position:"absolute",inset:8,borderRadius:"9999px",display:"flex",alignItems:"center",justifyContent:"center" }

//   return (
// <div className="relative flex items-center justify-center" style={{ width:72,height:72 }}>
// <div className="absolute inset-0 rounded-full" style={{ background:"#f5f4e8",border:"3px dashed rgba(216,196,160,0.4)" }} />
// <div ref={ref} style={s}>

//         {placed && <span className="text-2xl font-extrabold" style={{ fontFamily:JK,color:"#5b4300" }}>{placed.letter}</span>}
// </div>
// </div>

//   )

// }

// function LetterBlock({ letter, trayIdx, hidden, onClick }: { letter:string; trayIdx:number; hidden:boolean; onClick:(i:number)=>void }) {

//   const { bg, shadow, color } = BLOCK_COLORS[trayIdx % 4]

//   const up = { transform:"scale(1)", boxShadow:`0 8px 0 ${shadow}` }

//   return (
// <button onClick={() => onClick(trayIdx)} style={{ width:64,height:64,borderRadius:"9999px",background:bg,boxShadow:`0 8px 0 ${shadow}`,color,fontFamily:JK,fontWeight:800,fontSize:"1.4rem",border:"none",cursor:hidden?"default":"pointer",userSelect:"none",display:"flex",alignItems:"center",justifyContent:"center",opacity:hidden?0:1,pointerEvents:hidden?"none":"auto",transform:hidden?"scale(0.5)":"scale(1)",transition:"opacity .2s,transform .3s cubic-bezier(0.34,1.56,0.64,1)" }}

//       onMouseEnter={e=>{ if(hidden)return; Object.assign(e.currentTarget.style,{ transform:"translateY(-4px) scale(1.08) rotate(2deg)",boxShadow:`0 6px 0 ${shadow}` }) }}

//       onMouseLeave={e=>{ if(hidden)return; Object.assign(e.currentTarget.style, up) }}

//       onMouseDown={e=> { if(hidden)return; Object.assign(e.currentTarget.style,{ transform:"translateY(4px) scale(0.96)",boxShadow:"none" }) }}

//       onMouseUp={e=>   { if(hidden)return; Object.assign(e.currentTarget.style, up) }}>

//       {letter}
// </button>

//   )

// }

// function ConfettiLayer({ active }: { active:boolean }) {

//   const ref = useRef<HTMLDivElement>(null)

//   useEffect(() => {

//     if (!active || !ref.current) return

//     const c = ref.current

//     for (let i = 0; i < 28; i++) {

//       const el = document.createElement("div"), size = Math.random()*10+6

//       el.style.cssText = `position:absolute;width:${size}px;height:${size}px;background:${CONFETTI_COLORS[Math.floor(Math.random()*6)]};border-radius:${Math.random()>.5?"50%":"3px"};left:${Math.random()*100}%;top:${-size}px;animation:confetti-fall ${.8+Math.random()*1.2}s ease-in forwards;animation-delay:${Math.random()*.5}s`

//       c.appendChild(el); setTimeout(() => el.remove(), 2500)

//     }

//   }, [active])

//   return <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius:"3rem",zIndex:50 }} />

// }

// function SuccessOverlay() {

//   return (
// <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bounce-in"

//       style={{ borderRadius:"3rem",background:"rgba(159,247,159,0.25)",backdropFilter:"blur(2px)",zIndex:40 }}>
// <div className="text-6xl mb-3">🎉</div>
// <p className="font-extrabold text-5xl" style={{ color:"#126d27",fontFamily:JK }}>Маш сайн!</p>
// </div>

//   )

// }

// function BackgroundSheet() {

//   return (
// <div className="absolute inset-0 z-0 opacity-40 blur-sm pointer-events-none">
// <div className="h-full w-full max-w-5xl mx-auto bg-white rounded-t-3xl mt-4 flex flex-col p-10">
// <p className="text-2xl font-bold mb-1" style={{ color:"rgba(27,28,21,0.4)",fontFamily:JK }}>Dictation Exercise</p>
// <p className="text-sm mb-6" style={{ color:"rgba(27,28,21,0.25)" }}>Lesson 12: Orchard Wonders</p>
// <div className="flex-1" style={{ backgroundImage:"repeating-linear-gradient(transparent,transparent 31px,#d1d5db 31px,#d1d5db 32px)",backgroundSize:"100% 32px" }} />
// </div>
// </div>

//   )

// }

// function Footer() {

//   return (
// <footer className="py-3 px-10 flex justify-between items-center z-50"

//       style={{ background:"rgba(245,244,232,0.85)",backdropFilter:"blur(12px)" }}>
// <span className="text-xs" style={{ color:"rgba(27,28,21,0.4)",fontFamily:VN }}>© 2024 The Kinetic Storybook</span>
// <div className="flex gap-6">

//         {["Privacy","Help"].map(l => (
// <a key={l} href="#" className="text-xs hover:underline" style={{ color:"rgba(27,28,21,0.4)",fontFamily:VN }}>{l}</a>

//         ))}
// </div>
// </footer>

//   )

// }

// // ── Constants ────────────────────────────────────────────────────────────────

// const JK = "'Plus Jakarta Sans', sans-serif"

// const VN = "'Be Vietnam Pro', sans-serif"

// const GLOBAL_CSS = `

//   @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&family=Be+Vietnam+Pro:wght@400;500&display=swap%27);

//   @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap%27);

//   .material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24}

//   @keyframes spin{to{transform:rotate(360deg)}}

//   @keyframes slot-pop-in{0%{transform:scale(.4) rotate(-8deg);opacity:0}60%{transform:scale(1.15) rotate(3deg);opacity:1}80%{transform:scale(.95) rotate(-1deg)}100%{transform:scale(1) rotate(0);opacity:1}}

//   @keyframes slot-error-shake{0%{transform:translate(0,0)}15%{transform:translate(-6px,0);background:#ba1a1a}30%{transform:translate(6px,0)}45%{transform:translate(-5px,0)}60%{transform:translate(5px,0)}75%{transform:translate(-2px,0)}100%{transform:translate(0,0)}}

//   @keyframes slot-success-pulse{0%{transform:scale(1) rotate(0);box-shadow:0 0 0 0 rgba(18,109,39,.5)}40%{transform:scale(1.18) rotate(4deg);box-shadow:0 0 0 12px rgba(18,109,39,0)}70%{transform:scale(.95) rotate(-2deg)}100%{transform:scale(1) rotate(0);box-shadow:0 0 0 0 rgba(18,109,39,0)}}

//   @keyframes confetti-fall{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(120px) rotate(720deg);opacity:0}}

//   @keyframes bounce-in{0%{transform:scale(.5) translateY(30px);opacity:0}60%{transform:scale(1.1) translateY(-8px);opacity:1}80%{transform:scale(.96) translateY(2px)}100%{transform:scale(1) translateY(0);opacity:1}}

//   .slot-pop-in{animation:slot-pop-in .38s cubic-bezier(.34,1.56,.64,1) forwards}

//   .slot-error{animation:slot-error-shake .5s ease both}

//   .slot-success{animation:slot-success-pulse .5s ease forwards}

//   .bounce-in{animation:bounce-in .5s cubic-bezier(.34,1.56,.64,1) forwards}

// `
