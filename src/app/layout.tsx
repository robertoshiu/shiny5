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
  title: "Orano — Innovation is part of our DNA",
  description:
    "Live the experiences: PROTECT, VALIDATE, TRAINING, INVESTIGATE — Orano innovation slider.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${blenderPro.variable} ${nunitoSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
