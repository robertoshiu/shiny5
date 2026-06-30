'use client';

import { HeroParticles } from '@/components/hero/HeroParticles';

type Lang = '中' | 'EN';

interface HeroLandingProps {
  lang: Lang;
  onLangChange?: (l: Lang) => void;
  onEnter: () => void;
  /** CTA is disabled until ready===true (resources loaded) */
  ready: boolean;
  /** Kept mounted always; hidden (and particles paused) when the slider is showing. */
  visible?: boolean;
}

const monoFont = "'Spline Sans Mono', monospace";

const CHIPS_ZH = ['≤4hr', '六層架構', '≥95%', '100%'];
const CHIPS_EN = ['≤4hr', 'Six-Layer Architecture', '≥95%', '100%'];

/**
 * Hero landing screen — shown during the loading phase.
 * Replaces the old Loader UI with an immersive espresso-background landing page
 * backed by the WebGL particle-ring engine. The primary CTA is disabled while
 * resources are loading (ready===false) and calls onEnter on click when ready.
 */
export function HeroLanding({
  lang,
  onLangChange,
  onEnter,
  ready,
  visible = true,
}: HeroLandingProps) {
  const isZh = lang === '中';
  const chips = isZh ? CHIPS_ZH : CHIPS_EN;

  return (
    <div
      aria-hidden={!visible}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: '#14100D',
        overflow: 'hidden',
        // Stay mounted so the WebGL context survives; just hide + go click-through
        // while the slider is active.
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 600ms ease',
      }}
    >
      {/* Particle background — absolute to fill this container.
          Paused while hidden so we don't render two GL scenes at once. */}
      <HeroParticles active={visible} />

      {/* ---- Lang toggle — top-right corner ---- */}
      {onLangChange && (
        <div
          style={{
            position: 'absolute',
            top: 24,
            right: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            zIndex: 2,
          }}
        >
          {(['EN', '中'] as const).map((l, i, arr) => (
            <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => onLangChange(l)}
                style={{
                  fontFamily: monoFont,
                  fontWeight: 500,
                  fontSize: 12,
                  letterSpacing: '0.15em',
                  color: lang === l ? '#ffffff' : '#6b6b6b',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
                aria-label={l === 'EN' ? 'Switch to English' : '切換為中文'}
              >
                {l}
              </button>
              {i < arr.length - 1 && (
                <span style={{ color: '#6b6b6b', fontSize: 11 }}>/</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* ---- Centre content ---- */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
          zIndex: 1,
        }}
      >
        {/* Subtle radial scrim behind text for legibility over particles */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(20,16,13,0.75) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            maxWidth: 760,
            width: '100%',
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: monoFont,
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#E9C46A',
              margin: 0,
              marginBottom: 20,
            }}
          >
            INTELLIGENT WAFER FAB // SYSTEMS INTEGRATOR
          </p>

          {/* H1 Headline */}
          <h1
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 900,
              fontSize: 'clamp(2.6rem, 8vw, 6rem)',
              lineHeight: 1.08,
              color: '#ffffff',
              margin: 0,
              marginBottom: 32,
            }}
          >
            {isZh
              ? '把設備數據，鍛造成可決策的智能。'
              : 'Forge equipment data into actionable decisions.'}
          </h1>

          {/* Chips */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 10,
              marginBottom: 36,
            }}
          >
            {chips.map((chip) => (
              <span
                key={chip}
                style={{
                  fontFamily: monoFont,
                  fontWeight: 500,
                  fontSize: 12,
                  letterSpacing: '0.12em',
                  color: '#E9C46A',
                  border: '1px solid rgba(233,196,106,0.35)',
                  borderRadius: 2,
                  padding: '5px 14px',
                  background: 'rgba(233,196,106,0.07)',
                }}
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Primary CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <button
              onClick={ready ? onEnter : undefined}
              disabled={!ready}
              style={{
                fontFamily: monoFont,
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#ffffff',
                background: ready ? '#E07A5F' : 'rgba(224,122,95,0.32)',
                border: 'none',
                borderRadius: 2,
                padding: '14px 40px',
                cursor: ready ? 'pointer' : 'not-allowed',
                transition: 'background 0.3s ease, opacity 0.3s ease',
                opacity: ready ? 1 : 0.5,
              }}
              aria-disabled={!ready}
            >
              {isZh ? '進入體驗 →' : 'Enter the experience →'}
            </button>

            {/* Hint line */}
            <p
              style={{
                fontFamily: monoFont,
                fontWeight: 400,
                fontSize: 11,
                letterSpacing: '0.14em',
                color: 'rgba(255,255,255,0.32)',
                margin: 0,
              }}
            >
              {isZh ? '點擊進入 · 開啟聲音體驗' : 'Click to enter — sound on'}
            </p>
          </div>
        </div>
      </div>

      {/* ---- HUD: bottom-left ---- */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 24,
          left: 28,
          fontFamily: monoFont,
          fontSize: 10,
          letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.22)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        X:0720 Y:0450 [REC]
      </div>

      {/* ---- HUD: bottom-right ---- */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 24,
          right: 28,
          fontFamily: monoFont,
          fontSize: 10,
          letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.22)',
          pointerEvents: 'none',
          zIndex: 2,
          textAlign: 'right',
        }}
      >
        顯藝科技 SHINYLOGIC // SYS-v5
      </div>
    </div>
  );
}
