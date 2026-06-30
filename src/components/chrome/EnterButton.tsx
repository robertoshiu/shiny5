"use client";

import { useState } from "react";

type Lang = "中" | "EN";

interface EnterButtonProps {
  focused: boolean;
  onToggle: () => void;
  onHover?: () => void;
  lang: Lang;
}

export function EnterButton({ focused, onToggle, onHover, lang }: EnterButtonProps) {
  const [hovered, setHovered] = useState(false);

  const label = focused
    ? lang === "中" ? "返回" : "BACK"
    : lang === "中" ? "近觀" : "INSPECT";

  const ariaLabel = focused ? "Return from inspect" : "Inspect model";

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => { setHovered(true); onHover?.(); }}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "stretch",
        width: 228,
        height: 52,
        border: "none",
        padding: 0,
        cursor: "pointer",
        background: "transparent",
        pointerEvents: "auto",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
        transition: "transform 0.2s ease",
        outline: "none",
      }}
      aria-label={ariaLabel}
    >
      {/* Yellow left accent bar */}
      <span
        style={{
          display: "block",
          width: 8,
          background: "#ffe600",
          flexShrink: 0,
          transition: "width 0.2s ease",
        }}
      />

      {/* White body */}
      <span
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: hovered ? "#f0f0f0" : "#ffffff",
          transition: "background 0.2s ease",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-blender), 'Arial Narrow', sans-serif",
            fontWeight: 500,
            fontSize: 16,
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#05070f",
          }}
        >
          {label}
        </span>
      </span>
    </button>
  );
}
