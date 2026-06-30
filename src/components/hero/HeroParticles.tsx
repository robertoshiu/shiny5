'use client';

import { useEffect, useRef } from 'react';
import { initHeroParticles, type HeroParticlesHandle } from './heroParticlesEngine';

/**
 * Full-screen WebGL particle-ring background from the heroParticles engine.
 * Positioned absolute so it fills its nearest positioned ancestor.
 *
 * The GL context is created ONCE on mount and lives for the component's
 * lifetime — we never tear it down and rebuild it on show/hide (that churned
 * WebGL contexts and made the hero come up blank after returning from the
 * slider). Instead `active` pauses/resumes the render loop while the context
 * stays alive.
 *
 * Reduced-motion: skips init entirely — the canvas shows the espresso
 * #14100D background via its CSS background property.
 */
export function HeroParticles({ active = true }: { active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<HeroParticlesHandle | null>(null);

  // Init once — context persists for the component lifetime.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handle = initHeroParticles(canvas);
    handleRef.current = handle;
    return () => {
      handle.destroy();
      handleRef.current = null;
    };
  }, []);

  // Pause/resume the loop when the hero is hidden behind / revealed over the slider.
  useEffect(() => {
    handleRef.current?.setActive(active);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        background: '#14100D',
      }}
    />
  );
}
