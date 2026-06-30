// heroParticles.ts
// Framework-agnostic WebGL1 particle ring engine ported from shiny4/src/scripts/hero-webgl.ts.
// GPU particle system: ~15–17k ember particles in 8 concentric diffraction rings.
// Cursor-reactive flow field (repel + swirl) | alternating ring rotation |
// breathing pulse | per-particle flicker | scroll parallax-fade | additive bloom.
// WebGL1 gl.POINTS with dual-gaussian fragment for natural particle glow.
// Degrades to 2D canvas. Honors reduced-motion, Save-Data, DPR≤2, pause offscreen.
//
// Usage (React/Next.js):
//   useEffect(() => {
//     const { destroy } = initHeroParticles(canvasRef.current!);
//     return destroy;
//   }, []);

/* ─── Ring layout ─────────────────────────────────────────────────────────── */
// 8 diffraction rings; radii as fractions of disc max-radius (0..1).
const RING_RADII = [0.11, 0.20, 0.30, 0.41, 0.53, 0.65, 0.78, 0.93];
const N_RING_PARTICLES = 14_400; // particles on rings at full density
const N_SCATTER        =  2_000; // diffuse ember field between rings

/* ─── Vertex Shader ───────────────────────────────────────────────────────── */
const VERT = /* glsl */ `
precision highp float;

attribute float a_angle;   // initial angle [0, 2π)
attribute float a_radius;  // ring fraction [0..1]
attribute float a_ringIdx; // 0.0..7.0  (scatter: ~3.5)
attribute float a_phase;   // random seed [0, 2π)
attribute float a_speed;   // rotation multiplier [0.3..1.3]

uniform float u_time;
uniform float u_aspect;        // canvas w / h
uniform vec2  u_mouse;         // cursor in NDC (x ∈ −1..1, y up, ∈ −1..1)
uniform float u_influenceR;    // cursor influence radius in particle space
uniform float u_scroll;        // 0 = hero visible, 1 = scrolled away
uniform float u_maxPtSize;     // ALIASED_POINT_SIZE_RANGE[1] clamped at 20

varying float v_bright;
varying float v_ring;      // 0..1 → gold → clay colour lerp
varying float v_influence; // cursor proximity for colour boost in frag

void main() {
  // ── Circular-ring scale: compensates aspect ratio so rings are always round ──
  float scaleX = 0.87 * min(1.0, 1.0 / u_aspect);
  float scaleY = 0.87 * min(1.0, u_aspect);

  // ── Alternating rotation direction: odd rings clockwise, even counter ────────
  float parity   = (mod(a_ringIdx, 2.0) < 1.0) ? 1.0 : -1.0;
  float rotSpeed = 0.046 * parity * a_speed * mix(1.3, 0.75, a_radius);
  float angle    = a_angle + u_time * rotSpeed;

  // ── Breathing pulse (per-ring phase → rings breathe in phase offset) ─────────
  float breath = 1.0 + 0.026 * sin(u_time * 0.80 + a_radius * 6.283 + a_phase * 0.3);
  float r      = a_radius * breath;

  // ── Base position in particle space (unit circle = disc edge) ────────────────
  float px = cos(angle) * r;
  float py = sin(angle) * r;

  // ── Cursor force ─────────────────────────────────────────────────────────────
  vec2 mouseP    = vec2(u_mouse.x / scaleX, u_mouse.y / scaleY);
  vec2 diff      = mouseP - vec2(px, py);
  float safeDist = max(length(diff), 0.001);
  float influence = smoothstep(u_influenceR, 0.0, safeDist);

  // Repel: push particles away from cursor
  vec2 repelDir = diff / safeDist;
  px -= repelDir.x * influence * 0.12;
  py -= repelDir.y * influence * 0.12;

  // Swirl: tangential spin around cursor
  vec2 tang = vec2(-diff.y, diff.x) / safeDist;
  px += tang.x * influence * 0.06;
  py += tang.y * influence * 0.06;

  // ── Scroll parallax: particles drift upward as hero scrolls away ─────────────
  py += u_scroll * 0.58;

  // ── Clip space output ─────────────────────────────────────────────────────────
  float clip_x = px * scaleX;
  float clip_y = py * scaleY;

  // ── Brightness ────────────────────────────────────────────────────────────────
  float flicker     = 0.60 + 0.40 * sin(u_time * 2.9 + a_phase * 4.83 + a_ringIdx * 1.57);
  float scrollFade  = clamp(1.0 - u_scroll * 1.9, 0.0, 1.0);
  float cursorBoost = 1.0 + influence * 2.4;

  v_bright    = flicker * scrollFade * cursorBoost;
  v_ring      = clamp(a_ringIdx / 7.0, 0.0, 1.0);
  v_influence = influence;

  // ── Point size: inner rings fine, outer coarser; cursor proximity enlarges ────
  float baseSize = mix(1.5, 3.8, v_ring);
  gl_PointSize   = clamp(baseSize * (1.0 + influence * 3.0), 1.0, u_maxPtSize);

  gl_Position = vec4(clip_x, clip_y, 0.0, 1.0);
}
`;

/* ─── Fragment Shader ─────────────────────────────────────────────────────── */
const FRAG = /* glsl */ `
precision mediump float;

varying float v_bright;
varying float v_ring;
varying float v_influence;

// Design-system colours — espresso background #14100D, gold→clay ring palette
const vec3 GOLD  = vec3(0.914, 0.769, 0.416);  // #E9C46A
const vec3 CLAY  = vec3(0.878, 0.478, 0.373);  // #E07A5F
const vec3 WHITE = vec3(1.00,  0.96,  0.86);   // near-white warm highlight

void main() {
  // gl_PointCoord ∈ [0,1]²  → c ∈ [−0.5, 0.5]²
  vec2  c  = gl_PointCoord - 0.5;
  float d2 = dot(c, c) * 4.0;

  // Narrow bright core + wide soft halo (dual-gaussian = photographic bloom)
  float core  = exp(-d2 * 5.0);
  float halo  = exp(-d2 * 0.85);
  float alpha = (core * 0.90 + halo * 0.12) * v_bright;

  if (alpha < 0.007) discard;

  // Gold → Clay by ring index; cursor proximity shifts toward warm white-gold
  vec3 base  = mix(GOLD, CLAY, v_ring);
  vec3 color = mix(base, WHITE * GOLD, v_influence * 0.50);

  gl_FragColor = vec4(color, alpha);
}
`;

/* ─── WebGL helpers ───────────────────────────────────────────────────────── */
function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(`Shader: ${gl.getShaderInfoLog(sh)}`);
  }
  return sh;
}

/* ─── Particle data builder ───────────────────────────────────────────────── */
function buildParticleData(density: number): Float32Array {
  const scale    = Math.min(1.0, Math.max(0.15, density));
  const ringN    = Math.floor(N_RING_PARTICLES * scale);
  const scatterN = Math.floor(N_SCATTER * scale);
  const totalRad = RING_RADII.reduce((s, r) => s + r, 0);
  const data: number[] = [];

  for (let ri = 0; ri < RING_RADII.length; ri++) {
    const ringR  = RING_RADII[ri];
    const nParts = Math.max(12, Math.round((ringR / totalRad) * ringN));
    const step   = (Math.PI * 2) / nParts;
    for (let i = 0; i < nParts; i++) {
      const baseAngle    = i * step;
      const angleJitter  = (Math.random() - 0.5) * step * 0.7;
      const radialJitter = (Math.random() - 0.5) * 0.018;
      data.push(
        baseAngle + angleJitter,
        Math.max(0.05, Math.min(1.0, ringR + radialJitter)),
        ri,
        Math.random() * Math.PI * 2,
        0.7 + Math.random() * 0.6,
      );
    }
  }

  for (let i = 0; i < scatterN; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r     = Math.sqrt(Math.random()) * 0.90;
    data.push(
      angle,
      Math.max(0.04, r),
      3.5,
      Math.random() * Math.PI * 2,
      0.25 + Math.random() * 0.35,
    );
  }

  return new Float32Array(data);
}

/* ─── Public API ──────────────────────────────────────────────────────────── */
export interface HeroParticlesHandle {
  destroy(): void;
  resize(): void;
  /** Pause (false) / resume (true) the render loop without tearing down the GL context. */
  setActive(active: boolean): void;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Public entry point                                                         */
/* ═══════════════════════════════════════════════════════════════════════════ */
export function initHeroParticles(canvas: HTMLCanvasElement): HeroParticlesHandle {
  // ── Reduced-motion: return no-op, let the caller render a static fallback ──
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return { destroy() {}, resize() {}, setActive() {} };

  // ── Connection hints ───────────────────────────────────────────────────────
  type NavConn = { saveData?: boolean; effectiveType?: string };
  const conn     = (navigator as unknown as { connection?: NavConn }).connection;
  const saveData = conn?.saveData ?? false;
  const slowNet  = conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g';
  const density  = saveData || slowNet ? 0.35 : 1.0;

  // ── WebGL context ──────────────────────────────────────────────────────────
  const glOrNull = canvas.getContext('webgl', {
    antialias: false,
    alpha: false,
    premultipliedAlpha: false,
    powerPreference: 'default',
  });
  if (!glOrNull) return init2DFallback(canvas, density);
  const gl: WebGLRenderingContext = glOrNull;

  // ── Build shader program ───────────────────────────────────────────────────
  let program: WebGLProgram;
  try {
    program = gl.createProgram()!;
    gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`Link: ${gl.getProgramInfoLog(program)}`);
    }
  } catch (e) {
    console.warn('[heroParticles] GPU init failed, falling back to 2D canvas', e);
    return init2DFallback(canvas, density);
  }
  gl.useProgram(program);

  // ── Upload static particle VBO ─────────────────────────────────────────────
  const particleData  = buildParticleData(density);
  const particleCount = particleData.length / 5;

  const vbo = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, particleData, gl.STATIC_DRAW);

  const STRIDE = 5 * 4; // 5 floats × 4 bytes
  const bindAttr = (name: string, byteOffset: number) => {
    const loc = gl.getAttribLocation(program, name);
    if (loc < 0) return;
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 1, gl.FLOAT, false, STRIDE, byteOffset);
  };
  bindAttr('a_angle',   0);
  bindAttr('a_radius',  4);
  bindAttr('a_ringIdx', 8);
  bindAttr('a_phase',   12);
  bindAttr('a_speed',   16);

  // ── Uniform locations ──────────────────────────────────────────────────────
  const uTime       = gl.getUniformLocation(program, 'u_time');
  const uAspect     = gl.getUniformLocation(program, 'u_aspect');
  const uMouse      = gl.getUniformLocation(program, 'u_mouse');
  const uInfluenceR = gl.getUniformLocation(program, 'u_influenceR');
  const uScroll     = gl.getUniformLocation(program, 'u_scroll');
  const uMaxPtSize  = gl.getUniformLocation(program, 'u_maxPtSize');

  // ── Hardware point-size cap ────────────────────────────────────────────────
  const hwMaxPt   = (gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE) as Float32Array)[1];
  const maxPtSize = Math.min(hwMaxPt, 20.0);
  gl.uniform1f(uMaxPtSize, maxPtSize);

  // ── Blending: SRC_ALPHA + ONE = additive "fire" blend ─────────────────────
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.disable(gl.DEPTH_TEST);
  gl.clearColor(0.078, 0.063, 0.051, 1.0); // #14100D warm espresso

  // ── Runtime state ─────────────────────────────────────────────────────────
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let scrollProgress  = 0;
  let cachedAspect    = canvas.clientWidth / (canvas.clientHeight || 1);
  let cachedInfluenceR = 400 / (0.87 * (canvas.clientHeight || 900));
  let running = true;
  let manualActive = true; // caller-controlled (pause while the hero is hidden behind the slider)
  let raf     = 0;
  const start = performance.now();
  let   last  = 0;
  const MIN_INTERVAL = saveData ? 1000 / 30 : 1000 / 60;

  // ── Resize ─────────────────────────────────────────────────────────────────
  function doResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw  = canvas.clientWidth;
    const ch  = canvas.clientHeight || 1;
    const w   = Math.floor(cw * dpr);
    const h   = Math.floor(ch * dpr);
    if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
      canvas.width  = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    cachedAspect     = cw / ch;
    const scaleY     = 0.87 * Math.min(1.0, cachedAspect);
    cachedInfluenceR = 400 / (scaleY * ch);
  }
  window.addEventListener('resize', doResize, { passive: true });
  doResize();

  // ── Pointer tracking ───────────────────────────────────────────────────────
  function onMouseMove(e: MouseEvent) {
    mouse.tx =   (e.clientX / window.innerWidth)  * 2 - 1;
    mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  }
  function onTouchMove(e: TouchEvent) {
    const t = e.touches[0];
    if (!t) return;
    mouse.tx =   (t.clientX / window.innerWidth)  * 2 - 1;
    mouse.ty = -((t.clientY / window.innerHeight) * 2 - 1);
  }
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });

  // ── Internal scroll listener ───────────────────────────────────────────────
  function onScroll() {
    const rect     = canvas.getBoundingClientRect();
    const h        = rect.height || window.innerHeight;
    scrollProgress = Math.max(0, Math.min(1, -rect.top / h));
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Render loop ────────────────────────────────────────────────────────────
  function frame(now: number) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (now - last < MIN_INTERVAL) return;
    last = now;

    mouse.x += (mouse.tx - mouse.x) * 0.07;
    mouse.y += (mouse.ty - mouse.y) * 0.07;

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uTime,       (now - start) / 1000);
    gl.uniform1f(uAspect,     cachedAspect);
    gl.uniform2f(uMouse,      mouse.x, mouse.y);
    gl.uniform1f(uInfluenceR, cachedInfluenceR);
    gl.uniform1f(uScroll,     scrollProgress);

    gl.drawArrays(gl.POINTS, 0, particleCount);
  }
  raf = requestAnimationFrame(frame);

  // ── Pause offscreen via IntersectionObserver ───────────────────────────────
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !running && manualActive) {
          running = true;
          raf = requestAnimationFrame(frame);
        } else if (!e.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      }
    },
    { threshold: 0 },
  );
  io.observe(canvas);

  // ── Pause when tab hidden ──────────────────────────────────────────────────
  function onVisibility() {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (!running && manualActive) {
      running = true;
      raf = requestAnimationFrame(frame);
    }
  }
  document.addEventListener('visibilitychange', onVisibility);

  // ── Handle ─────────────────────────────────────────────────────────────────
  return {
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('mousemove',        onMouseMove);
      window.removeEventListener('touchmove',        onTouchMove);
      window.removeEventListener('scroll',           onScroll);
      window.removeEventListener('resize',           doResize);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.deleteBuffer(vbo);
      gl.deleteProgram(program);
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    },
    resize() {
      doResize();
    },
    setActive(active: boolean) {
      manualActive = active;
      if (active) {
        if (!running) {
          running = true;
          doResize(); // canvas may have resized while paused
          raf = requestAnimationFrame(frame);
        }
      } else if (running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    },
  };
}

/* ─── 2D Canvas Fallback ──────────────────────────────────────────────────── */
function init2DFallback(canvas: HTMLCanvasElement, density: number): HeroParticlesHandle {
  const ctxOrNull = canvas.getContext('2d');
  if (!ctxOrNull) return { destroy() {}, resize() {}, setActive() {} };
  const ctx: CanvasRenderingContext2D = ctxOrNull;

  let raf     = 0;
  let running = true;
  const start = performance.now();
  let last    = 0;
  const MIN_INTERVAL = 1000 / 30;
  let scrollProgress = 0;

  const RING_FRACS   = RING_RADII;
  const RING_OPACITY = [0.05, 0.10, 0.15, 0.20, 0.17, 0.12, 0.07, 0.04];

  function doResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.floor(canvas.clientWidth  * dpr);
    canvas.height = Math.floor(canvas.clientHeight * dpr);
  }
  window.addEventListener('resize', doResize, { passive: true });
  doResize();

  function onScroll() {
    const rect     = canvas.getBoundingClientRect();
    const h        = rect.height || window.innerHeight;
    scrollProgress = Math.max(0, Math.min(1, -rect.top / h));
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  function draw(now: number) {
    if (!running) return;
    raf = requestAnimationFrame(draw);
    if (now - last < MIN_INTERVAL) return;
    last = now;

    const t  = (now - start) / 1000;
    const w  = canvas.width;
    const h  = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const maxR       = Math.min(w, h) * 0.43;
    const scrollFade = Math.max(0, 1 - scrollProgress * 1.8);

    ctx.fillStyle = '#14100d';
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = scrollFade;

    for (let i = 0; i < RING_FRACS.length; i++) {
      const rr = RING_FRACS[i] * maxR;
      const a  = RING_OPACITY[i] * (0.70 + 0.30 * Math.sin(rr * 0.02 - t * 1.1));
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(233,196,106,${a})`;
      ctx.lineWidth   = 1;
      ctx.stroke();
    }

    const step = Math.max(18, Math.floor(w / 42));
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const ux   = x / w;
        const uy   = 1 - y / h;
        const diag = Math.max(0, 1 - (ux * 0.40 + uy * 0.26));
        const flick = 0.55 + 0.45 * Math.sin(t * 1.9 + (x * 0.7 + y * 0.3));
        const dist  = Math.hypot(x - cx, y - cy);
        const rim   = Math.min(1, Math.max(0, dist / (maxR * 0.20)));
        const a     = Math.max(0, diag * flick * 0.75 * density * rim);
        if (a <= 0.02) continue;
        const ramp = Math.min(1, (dist / maxR) * 1.8);
        ctx.fillStyle = ramp < 0.5 ? `rgba(233,196,106,${a})` : `rgba(224,122,95,${a})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
    ctx.globalAlpha = 1;
  }
  raf = requestAnimationFrame(draw);

  return {
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', doResize);
      window.removeEventListener('scroll', onScroll);
    },
    resize() {
      doResize();
    },
    setActive(active: boolean) {
      if (active) {
        if (!running) {
          running = true;
          doResize();
          raf = requestAnimationFrame(draw);
        }
      } else if (running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    },
  };
}
