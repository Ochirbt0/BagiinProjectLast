"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-[#5D3191] text-white p-10 font-sans  border-[#4a2775]">
      <div className="container mx-auto px-6 max-w-[1500px] md:p-0">
        <div className="flex flex-col md:flex-row md:justify-between gap-10 md:gap-0">
          <div className="md:w-[45%] space-y-6">
            <div className="flex items-center gap-4 group justify-start">
              <div className="relative w-12 h-12 bg-white rounded-xl p-1 shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition-transform group-hover:scale-105 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Зөв бичих баатар лого"
                  width={42}
                  height={42}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col text-left">
                <h2 className="text-[#FFD700] text-2xl md:text-3xl font-black tracking-tight uppercase leading-none">
                  ЦЭЭЖ БИЧИГ
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-left">
              <p className="inline-block bg-[#8DC63F] text-[#2D5100] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[0_3px_0_0_#6fa131]">
                Бага ангийнханд зориулсан
              </p>
              <p className="text-sm md:text-base leading-relaxed opacity-90 max-w-sm font-medium">
                Монгол хэлний цээж бичгийг{" "}
                <span className="text-[#8DC63F] font-black underline decoration-2 underline-offset-4">
                  хялбар аргаар,
                </span>{" "}
                хурдан эзэмшүүлэх шилдэг туслах.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-10 md:gap-20 text-left">
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 text-[#8DC63F]">
                Суралцах
              </h4>
              <ul className="space-y-4">
                {[
                  { name: "Түвшинүүд (1-5 анги)", href: "#" },
                  { name: "Цээж бичиг хийх", href: "#" },
                  { name: "Миний амжилт", href: "#" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm font-bold opacity-70 hover:opacity-100 hover:text-[#FFD700] transition-all flex items-center justify-start gap-2.5 group"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#8DC63F] group-hover:scale-125 transition-transform" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
