"use client";

import { useState } from "react";

interface ArrowButtonProps {
  direction: "prev" | "next";
  onClick: () => void;
}

function ArrowButton({ direction, onClick }: ArrowButtonProps) {
  const [hovered, setHovered] = useState(false);
  const isPrev = direction === "prev";

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={isPrev ? "Previous slide" : "Next slide"}
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        border: `1.5px solid ${hovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)"}`,
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        pointerEvents: "auto",
        transition: "border-color 0.2s ease, transform 0.2s ease",
        transform: hovered
          ? isPrev
            ? "translateX(-3px)"
            : "translateX(3px)"
          : "translateX(0)",
        outline: "none",
        padding: 0,
      }}
    >
      {/* Arrow SVG */}
      <svg
        width="18"
        height="14"
        viewBox="0 0 18 14"
        fill="none"
        aria-hidden="true"
        style={{
          transform: isPrev ? "rotate(180deg)" : undefined,
        }}
      >
        <path
          d="M11 1L17 7L11 13"
          stroke="white"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="1"
          y1="7"
          x2="17"
          y2="7"
          stroke="white"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

interface NavArrowsProps {
  onPrev: () => void;
  onNext: () => void;
  showPrev: boolean;
  showNext: boolean;
}

export function NavArrows({
  onPrev,
  onNext,
  showPrev,
  showNext,
}: NavArrowsProps) {
  const midStyle: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
  };

  return (
    <>
      {/* Prev — left edge, hidden on mobile and on first slide */}
      <div
        style={{
          ...midStyle,
          left: 55,
          opacity: showPrev ? 1 : 0,
          pointerEvents: showPrev ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
        className="max-md:hidden"
      >
        <ArrowButton direction="prev" onClick={onPrev} />
      </div>

      {/* Next — right edge */}
      <div
        style={{
          ...midStyle,
          right: 55,
          opacity: showNext ? 1 : 0,
          pointerEvents: showNext ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      >
        <ArrowButton direction="next" onClick={onNext} />
      </div>
    </>
  );
}
