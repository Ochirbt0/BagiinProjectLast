// import type { Metadata } from "next";
// import { Lexend, Lora } from "next/font/google";
// import "./globals.css";
// import Header from "./components/Header";
// import Footer from "./components/Footer"

// const lexend = Lexend({
//   variable: "--font-lexend",
//   subsets: ["latin"] as any,
//   weight: ["300", "400", "500", "700"],
//   display: "swap",
// });

// const lora = Lora({
//   variable: "--font-lora",
//   subsets: ["latin"] as any,
//   style: ["italic", "normal"],
//   weight: ["400", "500", "700"],
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: "Зөв Бичгийн Баатар",
//   description: "Монгол хэлний цээж бичгийн платформ",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="mn">
//       <head />
//       <body className={`${lexend.variable} ${lora.variable} font-sans antialiased min-h-screen flex flex-col`}>
//         <Header />
//         {children}
//         <Footer />
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Lexend, Lora } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
// 1. ClerkProvider-ийг импортлох
import { ClerkProvider } from "@clerk/nextjs";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Зөв Бичгийн Баатар",
  description: "Монгол хэлний цээж бичгийн платформ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="mn">
        <head />
        <body
          className={`${lexend.variable} ${lora.variable} font-sans antialiased min-h-screen flex flex-col`}
        >
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
