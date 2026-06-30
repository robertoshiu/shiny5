"use client";

// Duration & steps match app-animated-text original: duration=1.6s, steps=10
const DURATION = 1.6; // seconds
const STEPS = 10;
const STEP_MS = (DURATION / STEPS) * 1000; // ms per step

function letterDelay(char: string, index: number): number {
  const code = char.toUpperCase().charCodeAt(0);
  return ((code + index) % STEPS) * STEP_MS;
}

interface GlitchLetterProps {
  char: string;
  index: number;
}

function GlitchLetter({ char, index }: GlitchLetterProps) {
  if (char === " ") {
    return <span style={{ display: "inline-block", width: "0.4em" }} />;
  }

  const delay = `${letterDelay(char, index)}ms`;
  const cssVars = { "--letter-delay": delay } as React.CSSProperties;

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      {/* Red chromatic-aberration layer */}
      <span
        aria-hidden
        style={{
          ...cssVars,
          position: "absolute",
          top: 0,
          left: 0,
          color: "#ff003c",
          opacity: 0,
          animation: `chrome-rgb-red-reveal ${DURATION}s ease-out both`,
          animationDelay: delay,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {char}
      </span>

      {/* Green chromatic-aberration layer */}
      <span
        aria-hidden
        style={{
          ...cssVars,
          position: "absolute",
          top: 0,
          left: 0,
          color: "#0aff15",
          opacity: 0,
          animation: `chrome-rgb-green-reveal ${DURATION}s ease-out both`,
          animationDelay: delay,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {char}
      </span>

      {/* Default white layer (takes space) */}
      <span
        style={{
          ...cssVars,
          display: "block",
          color: "#ffffff",
          opacity: 0,
          animation: `chrome-letter-reveal ${DURATION}s ease-out both`,
          animationDelay: delay,
        }}
      >
        {char}
      </span>
    </span>
  );
}

interface GlitchTitleProps {
  title: string;
}

export function GlitchTitle({ title }: GlitchTitleProps) {
  const letters = title.toUpperCase().split("");

  return (
    <h1
      style={{
        fontFamily: "var(--font-blender), 'Arial Narrow', sans-serif",
        fontWeight: 100,
        fontSize: 52,
        lineHeight: "62.4px",
        letterSpacing: "10.4px",
        textTransform: "uppercase",
        color: "#ffffff",
        margin: 0,
        marginBottom: 24,
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {letters.map((char, i) => (
        <GlitchLetter key={i} char={char} index={i} />
      ))}
    </h1>
  );
}
