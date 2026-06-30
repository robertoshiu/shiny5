import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Blender Pro — technical display face used across the HUD and big titles.
const blenderPro = localFont({
  variable: "--font-blender",
  display: "swap",
  src: [
    { path: "../fonts/BlenderPro-Thin.woff2", weight: "100", style: "normal" },
    { path: "../fonts/BlenderPro-Medium.woff2", weight: "500", style: "normal" },
  ],
});

// Nunito Sans — body copy.
const nunitoSans = localFont({
  variable: "--font-nunito",
  display: "swap",
  src: [
    { path: "../fonts/NunitoSans-ExtraLight.woff2", weight: "200", style: "normal" },
    { path: "../fonts/NunitoSans-Light.woff2", weight: "300", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "顯藝科技 ShinyLogic — 智能晶圓廠 IT/OT 全棧建置",
  description:
    "顯藝科技 ShinyLogic — 為晶圓廠交付並承擔 IT/OT+AI 全棧的建置、整合與維運責任。完整六層技術堆疊，從設備數據到 AI 決策閉環，100% 歸檔回您。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant" className={`${blenderPro.variable} ${nunitoSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
