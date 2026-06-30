"use client";

import { useEffect, useRef } from "react";
import Experience from "@/experience/Experience";

/**
 * Full-viewport WebGL canvas hosting the vanilla Three.js Experience.
 * SSR-safe: the engine is only constructed inside useEffect (client-only), and
 * torn down on unmount.
 */
export default function ExperienceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const experience = new Experience(canvas);
    (window as unknown as { __exp?: unknown }).__exp = experience;
    return () => experience.destroy();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ display: "block" }}
    />
  );
}
