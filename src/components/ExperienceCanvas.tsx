"use client";

import { useEffect, useRef } from "react";
import Experience from "@/experience/Experience";

interface ExperienceCanvasProps {
  /** Called once, right after the engine is constructed, so a parent can
   *  drive (goTo/next/prev/openMenu…) and observe (onChange) the experience. */
  onReady?: (exp: Experience) => void;
}

/**
 * Full-viewport WebGL canvas hosting the vanilla Three.js Experience.
 * SSR-safe: the engine is only constructed inside useEffect (client-only), and
 * torn down on unmount.
 */
export default function ExperienceCanvas({ onReady }: ExperienceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const experience = new Experience(canvas);
    onReady?.(experience);
    return () => experience.destroy();
    // Construct once; onReady is captured from first render (stable in practice).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ display: "block" }}
    />
  );
}
