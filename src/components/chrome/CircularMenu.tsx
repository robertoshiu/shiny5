"use client";

import { useState } from "react";
import { SLIDES } from "@/experience/config";

interface CircularMenuProps {
  onSelect: (index: number) => void;
  onClose: () => void;
}

interface MenuRowProps {
  slide: (typeof SLIDES)[number];
  onSelect: (index: number) => void;
}

function MenuRow({ slide, onSelect }: MenuRowProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <li>
      <button
        onClick={() => onSelect(slide.index)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "10px 0",
          width: "100%",
          textAlign: "left",
          pointerEvents: "auto",
          outline: "none",
        }}
        aria-label={`Go to ${slide.title}`}
      >
        {/* Experience title — large grey caps, brightens on hover */}
        <span
          style={{
            fontFamily: "var(--font-blender), 'Arial Narrow', sans-serif",
            fontWeight: 100,
            fontSize: "clamp(36px, 4.5vw, 72px)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: hovered ? "#cfcfcf" : "#4a4a4a",
            transition: "color 0.25s ease",
            lineHeight: 1,
          }}
        >
          {slide.title}
        </span>

        {/* Yellow index number */}
        <span
          style={{
            fontFamily: "var(--font-blender), 'Arial Narrow', sans-serif",
            fontWeight: 500,
            fontSize: "clamp(14px, 1.4vw, 22px)",
            letterSpacing: "0.2em",
            color: "#ffe600",
            lineHeight: 1,
            minWidth: "2.5ch",
          }}
        >
          {String(slide.index + 1).padStart(2, "0")}
        </span>
      </button>
    </li>
  );
}

export function CircularMenu({ onSelect, onClose }: CircularMenuProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 40,
        pointerEvents: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Subtle scrim — lets the blue 3D world show through (click anywhere to close) */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(5,7,15,0.2)",
        }}
      />

      {/* Menu content — sits in the right column (~55% from left, like the slide
          title), vertically centered. Titles left-align; numbers right-align. */}
      <div className="relative flex-1 flex items-center justify-start pl-6 md:pl-[55%] pointer-events-none">
        <ul
          className="w-[calc(100vw-48px)] md:w-[380px]"
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {SLIDES.map((slide) => (
            <MenuRow key={slide.slug} slide={slide} onSelect={onSelect} />
          ))}
        </ul>
      </div>
    </div>
  );
}
