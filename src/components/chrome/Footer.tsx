"use client";

import { useState } from "react";
import { Logo } from "./Logo";

type Lang = "中" | "EN";

// ---- ShinyLogic logo lockup (leaf mark + wordmark) ----
interface OranoLogoProps {
  onReturnHome: () => void;
}

function OranoLogo({ onReturnHome }: OranoLogoProps) {
  return (
    <button
      onClick={onReturnHome}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        textDecoration: "none",
        pointerEvents: "auto",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
      aria-label="Return to ShinyLogic"
    >
      <Logo size={24} />

      {/* "顯藝科技 ShinyLogic" wordmark */}
      <span
        style={{
          fontFamily: "var(--font-nunito), system-ui, sans-serif",
          fontWeight: 300,
          fontSize: 13,
          letterSpacing: "0.06em",
          color: "#ffffff",
        }}
      >
        顯藝科技 ShinyLogic
      </span>
    </button>
  );
}

// ---- Language toggle ----
interface LangToggleProps {
  lang: Lang;
  onLangChange: (l: Lang) => void;
}

function LangToggle({ lang, onLangChange }: LangToggleProps) {
  const btnStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "var(--font-blender), 'Arial Narrow', sans-serif",
    fontWeight: 500,
    fontSize: 13,
    letterSpacing: "0.15em",
    color: active ? "#ffffff" : "#6b6b6b",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
    pointerEvents: "auto",
    position: "relative",
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <button
        style={btnStyle(lang === "EN")}
        onClick={() => onLangChange("EN")}
        aria-label="Switch to English"
      >
        EN
        {lang === "EN" && (
          <span
            style={{
              position: "absolute",
              bottom: -4,
              left: "50%",
              transform: "translateX(-50%)",
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: "#ffe600",
            }}
          />
        )}
      </button>
      <span style={{ color: "#6b6b6b", fontSize: 11 }}>/</span>
      <button
        style={btnStyle(lang === "中")}
        onClick={() => onLangChange("中")}
        aria-label="Switch to Chinese"
      >
        中
        {lang === "中" && (
          <span
            style={{
              position: "absolute",
              bottom: -4,
              left: "50%",
              transform: "translateX(-50%)",
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: "#ffe600",
            }}
          />
        )}
      </button>
    </div>
  );
}

// ---- 6-bar animated waveform sound toggle ----
const BAR_DURATIONS = [0.7, 1.0, 0.65, 0.9, 0.55, 0.8]; // seconds per bar
const BAR_DELAYS = [0, 0.15, 0.08, 0.22, 0.05, 0.18]; // offset start
const BAR_HEIGHTS = [14, 20, 10, 22, 12, 18]; // max height px

interface SoundToggleProps {
  on: boolean;
  onToggle: () => void;
}

function SoundToggle({ on, onToggle }: SoundToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={on ? "Mute sound" : "Unmute sound"}
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 3,
        height: 24,
        background: "none",
        border: "none",
        cursor: "pointer",
        pointerEvents: "auto",
        padding: 0,
      }}
    >
      {BAR_HEIGHTS.map((h, i) => (
        <span
          key={i}
          style={{
            display: "block",
            width: 3,
            height: h,
            background: on ? "#ffe600" : "#6b6b6b",
            borderRadius: 1,
            transformOrigin: "bottom",
            animation: on
              ? `chrome-bar-wave ${BAR_DURATIONS[i]}s ${BAR_DELAYS[i]}s ease-in-out infinite`
              : "none",
            transform: on ? undefined : "scaleY(0.2)",
            transition: "background 0.2s ease",
          }}
        />
      ))}
    </button>
  );
}

interface FooterProps {
  soundOn?: boolean;
  onSoundToggle?: () => void;
  lang: Lang;
  onLangChange: (l: Lang) => void;
  onReturnHome: () => void;
}

export function Footer({
  soundOn: soundOnProp,
  onSoundToggle: onSoundToggleProp,
  lang,
  onLangChange,
  onReturnHome,
}: FooterProps) {
  const [internalSoundOn, setInternalSoundOn] = useState(false);

  // Allow external control or internal fallback
  const soundOn = soundOnProp !== undefined ? soundOnProp : internalSoundOn;
  const handleSoundToggle =
    onSoundToggleProp !== undefined
      ? onSoundToggleProp
      : () => setInternalSoundOn((v) => !v);

  const footerBase: React.CSSProperties = {
    position: "fixed",
    bottom: 0,
    zIndex: 10,
  };

  return (
    <>
      {/* Bottom-left: Orano logo — desktop only (mobile shows logo in the header) */}
      <div
        className="max-md:hidden"
        style={{
          ...footerBase,
          left: 50,
          bottom: 62,
          pointerEvents: "auto",
        }}
      >
        <OranoLogo onReturnHome={onReturnHome} />
      </div>

      {/* Bottom-right cluster: lang / sound / return */}
      <div
        style={{
          ...footerBase,
          right: 50,
          bottom: 60,
          display: "flex",
          alignItems: "center",
          gap: 22,
          pointerEvents: "none",
        }}
      >
        {/* Lang toggle */}
        <LangToggle lang={lang} onLangChange={onLangChange} />

        {/* Sound waveform toggle */}
        <SoundToggle on={soundOn} onToggle={handleSoundToggle} />

        {/* Return button — hidden on mobile */}
        <button
          onClick={onReturnHome}
          style={{
            fontFamily: "var(--font-blender), 'Arial Narrow', sans-serif",
            fontWeight: 500,
            fontSize: 11,
            letterSpacing: "0.2em",
            color: "#8e8e8e",
            textDecoration: "none",
            textTransform: "uppercase",
            pointerEvents: "auto",
            whiteSpace: "nowrap",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Return to ShinyLogic
        </button>
      </div>
    </>
  );
}
