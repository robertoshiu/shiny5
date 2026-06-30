"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type Experience from "@/experience/Experience";
import ExperienceCanvas from "./ExperienceCanvas";
import { SLIDES } from "@/experience/config";
import { Loader } from "./chrome/Loader";
import { Header } from "./chrome/Header";
import { Counter } from "./chrome/Counter";
import { GlitchTitle } from "./chrome/GlitchTitle";
import { Description } from "./chrome/Description";
import { EnterButton } from "./chrome/EnterButton";
import { NavArrows } from "./chrome/NavArrows";
import { Footer } from "./chrome/Footer";
import { CircularMenu } from "./chrome/CircularMenu";
import { useAudio } from "./chrome/audio/useAudio";

const TOTAL = SLIDES.length; // 4
const LOADER_MS = 2400; // drive the loader 0 → 1 over ~2.4s

/**
 * Top-level interactive composite for the Orano "Innovation Slider".
 *
 * Owns the state machine and bridges the React chrome ↔ the vanilla WebGL
 * engine. The engine is the source of truth for the active slide (keyboard
 * arrows live inside it); we observe it via `onChange` and drive it via
 * goTo/next/prev/enterFocus/openMenu/closeMenu.
 *
 *   phase: 'loading' → (Loader, ~3s) → 'slider'
 *   slideIndex: 0..3   (mirrors engine.currentIndex, synced through onChange)
 *   menuOpen:   circular "Live the experiences" menu
 *   soundOn:    audio starts muted; footer waveform toggles it
 *
 * Stacking: canvas z-0 · slide HUD z-10 · circular menu z-40 ·
 *           header + footer z-50 (kept above the menu scrim) · loader z-50.
 */
export default function OranoExperience() {
  const expRef = useRef<Experience | null>(null);
  const [phase, setPhase] = useState<"loading" | "slider">("loading");
  const [slideIndex, setSlideIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [progress, setProgress] = useState(0);

  // Audio manager — keep a fresh ref so engine/event callbacks always read the
  // latest (mute-aware) `play`, not a stale closure captured at construction.
  const audio = useAudio();
  const audioRef = useRef(audio);
  useEffect(() => {
    audioRef.current = audio;
  });

  // ---- Engine hookup: observe slide changes (covers keyboard nav too) ----
  const handleReady = useCallback((exp: Experience) => {
    expRef.current = exp;
    exp.onChange = (i: number) => {
      setSlideIndex(i);
      audioRef.current.play("transition");
    };
  }, []);

  // ---- Loader: animate progress 0 → 1, then hand off to the slider ----
  useEffect(() => {
    if (phase !== "loading") return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / LOADER_MS);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const handleLoaderDone = useCallback(() => setPhase("slider"), []);

  // ---- Keep real audio mute in sync with the soundOn toggle ----
  useEffect(() => {
    audioRef.current.setMuted(!soundOn);
  }, [soundOn]);

  // ---- Chrome → engine wiring ----
  const handlePrev = useCallback(() => expRef.current?.prev(), []);
  const handleNext = useCallback(() => expRef.current?.next(), []);

  const handleEnter = useCallback(() => {
    expRef.current?.enterFocus();
    audioRef.current.play("click");
  }, []);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
    expRef.current?.openMenu();
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    expRef.current?.closeMenu();
  }, []);

  const handleSelectSlide = useCallback((index: number) => {
    expRef.current?.goTo(index);
    setSlideIndex(index);
    audioRef.current.play("click");
    setMenuOpen(false);
    expRef.current?.closeMenu();
  }, []);

  const toggleSound = useCallback(() => setSoundOn((on) => !on), []);

  const slide = SLIDES[slideIndex];

  return (
    <>
      {/* WebGL world — fixed inset-0 z-0, behind everything */}
      <ExperienceCanvas onReady={handleReady} />

      {/* Loading screen (z-50) */}
      {phase === "loading" && (
        <Loader progress={progress} onDone={handleLoaderDone} />
      )}

      {phase === "slider" && (
        <>
          {/* ---- Per-slide HUD (z-10) — hidden while the menu is open ---- */}
          {!menuOpen && (
            <div className="fixed inset-0 z-10 pointer-events-none">
              <Counter current={slideIndex} total={TOTAL} />

              {/* Right-column block: title + description + ENTER.
                  Mobile: lower-left. Desktop (md+): ~55% / top 296px. */}
              <div
                className="
                  fixed pointer-events-none
                  left-6 bottom-[200px] w-[calc(100vw-48px)]
                  md:left-[55%] md:top-[296px] md:bottom-auto md:w-[400px]
                "
              >
                {/* key forces remount → the glitch reveal replays per slide */}
                <GlitchTitle key={slideIndex} title={slide.title} />
                <Description text={slide.description} />
                <div className="pointer-events-auto">
                  <EnterButton onClick={handleEnter} />
                </div>
              </div>

              <NavArrows
                onPrev={handlePrev}
                onNext={handleNext}
                showPrev={slideIndex > 0}
                showNext={slideIndex < TOTAL - 1}
              />
            </div>
          )}

          {/* ---- Circular "Live the experiences" menu (z-40) ---- */}
          {menuOpen && (
            <CircularMenu onSelect={handleSelectSlide} onClose={closeMenu} />
          )}

          {/* ---- Header + Footer (z-50) — always above the menu scrim ---- */}
          <div className="relative z-50">
            <Header
              menuOpen={menuOpen}
              onOpenMenu={openMenu}
              onCloseMenu={closeMenu}
            />
          </div>
          <div className="relative z-50">
            <Footer soundOn={soundOn} onSoundToggle={toggleSound} />
          </div>
        </>
      )}
    </>
  );
}
