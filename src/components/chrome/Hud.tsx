"use client";

import { useState } from "react";
import { SLIDES } from "@/experience/config";
import { Header } from "./Header";
import { Counter } from "./Counter";
import { GlitchTitle } from "./GlitchTitle";
import { Description } from "./Description";
import { EnterButton } from "./EnterButton";
import { NavArrows } from "./NavArrows";
import { Footer } from "./Footer";
import { CircularMenu } from "./CircularMenu";

export interface HudProps {
  slideIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onEnter: () => void;
  onOpenMenu: () => void;
  /** Optional — called when user picks a slide from the circular menu. */
  onSelectSlide?: (index: number) => void;
}

export function Hud({
  slideIndex,
  total,
  onPrev,
  onNext,
  onEnter,
  onOpenMenu,
  onSelectSlide,
}: HudProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const slide = SLIDES[slideIndex];

  function handleOpenMenu() {
    setMenuOpen(true);
    onOpenMenu();
  }

  function handleCloseMenu() {
    setMenuOpen(false);
  }

  function handleSelectSlide(index: number) {
    setMenuOpen(false);
    onSelectSlide?.(index);
  }

  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      {/* ---- Header ---- */}
      <Header
        menuOpen={menuOpen}
        onOpenMenu={handleOpenMenu}
        onCloseMenu={handleCloseMenu}
      />

      {/* ---- Pagination counter (center-top) ---- */}
      <Counter current={slideIndex} total={total} />

      {/* ---- Right-column content: title + description + enter button ----
          Mobile (default): bottom-left, lower in the viewport.
          Desktop (md+):    left ≈ 55 % / top 296 px — per spec x792 y296 @ 1440.
          All positioning via Tailwind so responsive overrides work correctly.   */}
      <div
        className="
          fixed pointer-events-none
          left-6 bottom-[200px] w-[calc(100vw-48px)]
          md:left-[55%] md:top-[296px] md:bottom-auto md:w-[400px]
        "
      >
        {/* key= forces remount on every slide change → CSS animations replay */}
        <GlitchTitle key={slideIndex} title={slide.title} />
        <Description text={slide.description} />

        {/* Restore pointer-events for the interactive button */}
        <div className="pointer-events-auto">
          <EnterButton onClick={onEnter} />
        </div>
      </div>

      {/* ---- Navigation arrows ---- */}
      <NavArrows
        onPrev={onPrev}
        onNext={onNext}
        showPrev={slideIndex > 0}
        showNext={slideIndex < total - 1}
      />

      {/* ---- Footer ---- */}
      <Footer />

      {/* ---- Circular menu overlay ---- */}
      {menuOpen && (
        <CircularMenu onSelect={handleSelectSlide} onClose={handleCloseMenu} />
      )}
    </div>
  );
}
