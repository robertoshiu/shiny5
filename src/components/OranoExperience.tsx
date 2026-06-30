"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type Experience from "@/experience/Experience";
import ExperienceCanvas from "./ExperienceCanvas";
import { SLIDES, HEADER_LABEL, HEADER_LABEL_EN, MENU_LABEL, MENU_LABEL_EN } from "@/experience/config";
import { HeroLanding } from "./chrome/HeroLanding";
import { Header } from "./chrome/Header";
import { Counter } from "./chrome/Counter";
import { GlitchTitle } from "./chrome/GlitchTitle";
import { Description } from "./chrome/Description";
import { EnterButton } from "./chrome/EnterButton";
import { NavArrows } from "./chrome/NavArrows";
import { Footer } from "./chrome/Footer";
import { CircularMenu } from "./chrome/CircularMenu";
import { useAudio } from "./chrome/audio/useAudio";
import { InspectPanel } from "./chrome/InspectPanel";
import { DETAILS } from "@/content/details";

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
 *   phase: 'loading' → (HeroLanding CTA click) → 'slider'
 *   slideIndex: 0..N   (mirrors engine.currentIndex, synced through onChange)
 *   menuOpen:   circular "Live the experiences" menu
 *   soundOn:    audio starts muted; footer waveform toggles it
 *   focused:    INSPECT/BACK camera-swing toggle
 *   lang:       "中" | "EN" — single source of truth for UI language
 *
 * Stacking: canvas z-0 · slide HUD z-10 · circular menu z-40 ·
 *           header + footer z-50 (kept above the menu scrim) · hero landing z-50.
 */
export default function OranoExperience() {
  const expRef = useRef<Experience | null>(null);
  const [phase, setPhase] = useState<"loading" | "slider">("loading");
  const [slideIndex, setSlideIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lang, setLang] = useState<"中" | "EN">("中");
  const [focused, setFocused] = useState(false);

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
      setFocused(false);
      audioRef.current.play("transition");
    };
  }, []);

  // ---- Loader: animate progress 0 → 1 once, then hand off to the slider.
  //      On a later return to the hero, resources are already loaded, so jump
  //      straight to ready (no second 2.4s wait before the CTA re-enables). ----
  const loadedRef = useRef(false);
  useEffect(() => {
    if (phase !== "loading") return;
    if (loadedRef.current) {
      setProgress(1);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / LOADER_MS);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else loadedRef.current = true;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // ---- HeroLanding CTA: enter experience on user gesture, start audio ----
  const handleEnterExperience = useCallback(() => {
    setPhase("slider");
    setSoundOn(true);
    audioRef.current.setAmbient("ambientUnder");
    audioRef.current.play("woosh");
  }, []);

  // ---- Keep real audio mute in sync with the soundOn toggle ----
  useEffect(() => {
    audioRef.current.setMuted(!soundOn);
  }, [soundOn]);

  // ---- Focus toggle: INSPECT ↔ BACK ----
  const handleToggleFocus = useCallback(() => {
    if (!focused) {
      expRef.current?.enterFocus();
      audioRef.current.play("click");
      setFocused(true);
    } else {
      expRef.current?.exitFocus();
      audioRef.current.play("woosh");
      setFocused(false);
    }
  }, [focused]);

  // ---- Return to home: exit focus + menu, then back to hero landing ----
  const handleReturnHome = useCallback(() => {
    setFocused(false);
    expRef.current?.exitFocus();
    setMenuOpen(false);
    expRef.current?.closeMenu?.();
    setPhase("loading");
    expRef.current?.goTo(0);
    setSlideIndex(0);
    audioRef.current.play("woosh");
  }, []);

  // ---- Chrome → engine wiring ----
  const handlePrev = useCallback(() => {
    expRef.current?.prev();
    audioRef.current.play("click");
  }, []);

  const handleNext = useCallback(() => {
    expRef.current?.next();
    audioRef.current.play("click");
  }, []);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
    expRef.current?.openMenu();
    audioRef.current.play("click");
    audioRef.current.setAmbient("ambientDefault");
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    expRef.current?.closeMenu();
    audioRef.current.play("click");
    audioRef.current.setAmbient("ambientUnder");
  }, []);

  const handleSelectSlide = useCallback((index: number) => {
    expRef.current?.goTo(index);
    setSlideIndex(index);
    audioRef.current.play("click");
    setMenuOpen(false);
    expRef.current?.closeMenu();
    setFocused(false);
  }, []);

  const toggleSound = useCallback(() => setSoundOn((on) => !on), []);

  const slide = SLIDES[slideIndex];

  return (
    <>
      {/* WebGL world — fixed inset-0 z-0, behind everything */}
      <ExperienceCanvas onReady={handleReady} />

      {/* Hero landing screen (z-50) — replaces the old Loader UI.
          Kept mounted always (visibility-toggled) so its WebGL particle context
          survives entering/returning instead of being rebuilt each time. */}
      <HeroLanding
        lang={lang}
        onLangChange={setLang}
        onEnter={handleEnterExperience}
        ready={progress >= 1}
        visible={phase === "loading"}
      />

      {phase === "slider" && (
        <>
          {/* ---- Per-slide HUD (z-10) — hidden while the menu is open ---- */}
          {!menuOpen && (
            <div className="fixed inset-0 z-10 pointer-events-none">
              {!focused && <Counter current={slideIndex} total={TOTAL} />}

              {/* Right-column block: title + description + ENTER.
                  Mobile: lower-left. Desktop (md+): ~55% / top 296px. */}
              <div
                className="
                  fixed pointer-events-none
                  left-6 bottom-[200px] w-[calc(100vw-48px)]
                  md:left-[55%] md:top-[296px] md:bottom-auto md:w-[400px]
                "
              >
                {/* Title + description fade out when focused so swung-in model is unobstructed */}
                <div
                  style={{
                    opacity: focused ? 0 : 1,
                    transition: "opacity 400ms ease",
                    pointerEvents: focused ? "none" : undefined,
                  }}
                >
                  {/* key forces remount → the glitch reveal replays per slide */}
                  <GlitchTitle key={slideIndex} title={slide.title} />
                  <Description
                    text={lang === "中" ? slide.description : slide.descriptionEn}
                    kicker={slide.kicker}
                  />
                </div>

                <div className="pointer-events-auto">
                  <EnterButton
                    focused={focused}
                    onToggle={handleToggleFocus}
                    onHover={() => audioRef.current.play("pushButton")}
                    lang={lang}
                  />
                </div>
              </div>

              {!focused && (
                <NavArrows
                  onPrev={handlePrev}
                  onNext={handleNext}
                  showPrev={slideIndex > 0}
                  showNext={slideIndex < TOTAL - 1}
                />
              )}
            </div>
          )}

          {/* ---- Inspect detail panel (left, z-40 internal) — foreground when focused.
                  Rendered bare (no full-screen wrapper) so the right side stays
                  clickable — otherwise a transparent inset-0 layer swallowed the
                  BACK/返回 button's clicks. ---- */}
          {focused && DETAILS[slide.slug] && (
            <InspectPanel
              detail={DETAILS[slide.slug]}
              lang={lang}
              onClose={handleToggleFocus}
            />
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
              headerLabel={lang === "中" ? HEADER_LABEL : HEADER_LABEL_EN}
              menuLabel={lang === "中" ? MENU_LABEL : MENU_LABEL_EN}
              hideLabel={focused}
            />
          </div>
          <div className="relative z-50">
            <Footer
              soundOn={soundOn}
              onSoundToggle={toggleSound}
              lang={lang}
              onLangChange={setLang}
              onReturnHome={handleReturnHome}
            />
          </div>
        </>
      )}
    </>
  );
}
