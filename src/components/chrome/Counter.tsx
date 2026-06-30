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
      className="
        fixed z-10 pointer-events-none
        left-6 bottom-[300px]
        md:left-[664px] md:top-[135px] md:bottom-auto md:w-[200px]
      "
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
          width: "100%",
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
