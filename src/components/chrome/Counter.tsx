"use client";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

interface CounterProps {
  current: number; // 0-based slide index
  total: number;
}

export function Counter({ current, total }: CounterProps) {
  const currentNum = current + 1;
  const nextNum = current >= total - 1 ? 0 : current + 2;

  return (
    <div
      style={{
        position: "fixed",
        top: 135,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      {/* Hachure background box */}
      <div
        className="chrome-hachure"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 14px",
          height: 50,
          minWidth: 140,
          justifyContent: "center",
        }}
      >
        {/* Current number — yellow */}
        <span
          style={{
            fontFamily: "var(--font-blender), 'Arial Narrow', sans-serif",
            fontWeight: 500,
            fontSize: 16,
            letterSpacing: "2.4px",
            textTransform: "uppercase",
            color: "#ffe600",
          }}
        >
          {pad(currentNum)}
        </span>

        {/* Separator */}
        <span
          style={{
            fontFamily: "var(--font-blender), 'Arial Narrow', sans-serif",
            fontWeight: 500,
            fontSize: 16,
            letterSpacing: "2.4px",
            color: "#6b6b6b",
          }}
        >
          —
        </span>

        {/* Next number — grey */}
        <span
          style={{
            fontFamily: "var(--font-blender), 'Arial Narrow', sans-serif",
            fontWeight: 500,
            fontSize: 16,
            letterSpacing: "2.4px",
            textTransform: "uppercase",
            color: "#6b6b6b",
          }}
        >
          {pad(nextNum)}
        </span>
      </div>
    </div>
  );
}
