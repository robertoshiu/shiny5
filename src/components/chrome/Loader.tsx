"use client";

import { useEffect } from "react";

interface LoaderProps {
  progress: number; // 0..1
  onDone: () => void;
}

export function Loader({ progress, onDone }: LoaderProps) {
  useEffect(() => {
    if (progress >= 1) {
      const id = setTimeout(onDone, 600);
      return () => clearTimeout(id);
    }
  }, [progress, onDone]);

  const pct = Math.min(1, Math.max(0, progress));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "#05070f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "all",
      }}
    >
      {/* SHINYLOGIC glitch heading */}
      <div
        style={{
          position: "relative",
          fontFamily: "var(--font-blender), 'Arial Narrow', sans-serif",
          fontWeight: 100,
          fontSize: 34,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#ffffff",
          animation: "chrome-loader-glow 2s ease-in-out infinite",
          marginBottom: 48,
        }}
      >
        {/* Red chromatic layer */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            color: "#ff003c",
            transform: "translate(-2px, 1px)",
            opacity: 0.4,
            userSelect: "none",
          }}
        >
          SHINYLOGIC
        </span>
        {/* Green chromatic layer */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            color: "#0aff15",
            transform: "translate(2px, -1px)",
            opacity: 0.4,
            userSelect: "none",
          }}
        >
          SHINYLOGIC
        </span>
        SHINYLOGIC
      </div>

      {/* Progress track */}
      <div
        style={{
          width: 240,
          height: 1,
          background: "rgba(255,255,255,0.15)",
          marginBottom: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${pct * 100}%`,
            background: "#ffe600",
            transition: "width 0.25s linear",
          }}
        />
      </div>

      {/* Loading message */}
      <p
        style={{
          fontFamily:
            "var(--font-nunito), system-ui, sans-serif",
          fontWeight: 200,
          fontSize: 13,
          letterSpacing: "0.2em",
          color: "#8e8e8e",
          textTransform: "uppercase",
        }}
      >
        Loading, please turn on your volume
      </p>
    </div>
  );
}
