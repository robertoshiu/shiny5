/**
 * Shared scene/UI contract for the ShinyLogic "Innovation Slider".
 * Originally reverse-engineered from the Orano experience (see docs/research),
 * re-themed as a semiconductor fab: each slide shows a different process tool.
 * Consumed by BOTH the WebGL track (src/experience/**) and the DOM chrome (src/components/**).
 *
 * Coordinate units are Three.js units. Colors are hex.
 */

export type Vec3 = [number, number, number];

export interface ModelConfig {
  /** file under /assets/models (no extension needed) */
  file: string;
  /** line color, hex */
  color: string;
  /** "highlight" = the yellow hero model; "env" = grey environment line art; "silhouette" = near-black */
  role: "highlight" | "env" | "silhouette";
  /** reveal-shader origin (uRevealPosition); model "draws on" outward from here */
  reveal?: Vec3;
  /** spin animation, radians/elapsed-ms on an axis, e.g. {axis:"y", speed:0.015} */
  spin?: { axis: "x" | "y" | "z"; speed: number };
}

export interface CameraState {
  pos: Vec3;
  /** euler radians */
  rot: Vec3;
  /** cursor parallax amplitude */
  pan: [number, number];
}

export interface EquipmentConfig {
  /** GLB under /assets/models/equipment (no extension) — loaded as wireframe edges */
  file: string;
  /** EdgesGeometry feature-edge threshold in degrees (higher = fewer, cleaner lines) */
  thresholdAngle: number;
  /** normalize the model's largest dimension to this many local units (default 14) */
  targetSize?: number;
  /** extra Y rotation (radians) to choose a good viewing angle */
  rotationY?: number;
}

export interface SlideConfig {
  index: number; // 0..3
  slug: "protect" | "validate" | "training" | "investigate";
  /** big glitch verb title */
  title: string;
  /** intro copy */
  description: string;
  /** crossfading ambient track key while on this slide */
  soundAmbient: "under";
  /** container transform that holds the slide's equipment + topography */
  container: { position: Vec3; rotation: Vec3; scale: number };
  /** the semiconductor tool shown as the yellow wireframe highlight */
  equipment: EquipmentConfig;
  /** landscape camera rig states (angles.container offsets) */
  camera: { unfocus: CameraState; focus: CameraState };
  /** portrait (mobile) camera states. Falls back to `camera` when absent. */
  cameraPortrait?: { unfocus: CameraState; focus: CameraState };
  /** chromatic-aberration 3D focal dummy (projected to drive uRadialDumping.xy) */
  rgbFocal: Vec3;
}

/** ShinyLogic brand yellow + the grey ramp used by line materials. */
export const COLORS = {
  bg: "#05070f",
  accent: "#ffe600",
  white: "#ffffff",
  grey18: "#2e2e2e", // (0.18)
  grey14: "#242424", // (0.14)
  grey12: "#1f1f1f", // (0.12) — terrain base
  grey10: "#1a1a1a", // (0.10)
  grey40: "#666666", // (0.40)
  black: "#000000",
  win: "#4c9900",
  scanBlue: "#519bff",
  scanRed: "#ff2900",
} as const;

/** Terrain shader shared defaults. */
export const TERRAIN = {
  texture: "/assets/images/terrain-texture.png",
  color: COLORS.grey12,
  focusColor: COLORS.accent,
  elevationNoiseMultiplier: 0.07,
  focusMultiplier: 0.25, // tamed: 3 over-saturated the focal row into a hard yellow line
} as const;

/** Post-processing constants. */
export const POST = {
  rgbOffset: {
    strength: 15,
    radialDumping: [0.5, 0.5, 1, -0.5] as [number, number, number, number],
    teint: [1.165, 1.132, 1.274] as Vec3,
  },
  menuGlitch: { tileOffset: [0.1, 0.03] as [number, number], tileAmplitude: 2, gradientAmplitude: 0.5 },
  transitionGlitch: { tileOffset: [0.03, 0.1] as [number, number], tileAmplitude: 3, gradientAmplitude: 0, durationS: 3 },
} as const;

/** Camera + world globals. */
export const WORLD = {
  clearColor: COLORS.bg,
  camera: { fov: 35, near: 0.1, far: 40 },
  /** scenes are laid out in a row, this far apart along -Z */
  distanceBetween: 60,
  pixelRatioCap: 2,
} as const;

/** Howler audio map. file paths under /assets/audio */
export const AUDIO = {
  ambientDefault: { file: "/assets/audio/music-main.mp3", loop: true, volume: 1 },
  ambientUnder: { file: "/assets/audio/music-light.mp3", loop: true, volume: 1 },
  keypoint: { file: "/assets/audio/sfx-hotspot.mp3", loop: false, volume: 0.5 },
  pushButton: { file: "/assets/audio/sfx-loading.mp3", loop: false, volume: 0.6 },
  click: { file: "/assets/audio/sfx-click.mp3", loop: false, volume: 0.8 },
  valid: { file: "/assets/audio/sfx-valid.mp3", loop: false, volume: 1 },
  transition: { file: "/assets/audio/sfx-decor-change.mp3", loop: false, volume: 0.5 },
  woosh: { file: "/assets/audio/sfx-zoom-home.mp3", loop: false, volume: 1 },
} as const;

const PI = Math.PI;

// All four slides share the same framing (the proven INVESTIGATE rig): the tool sits
// at container (0,2,-5) inside each scene's row, normalized to ~14 local units, over the
// grid + topography construction lines. Per-slide variety comes from the tool + verb.
const CONTAINER = { position: [0, 2, -5] as Vec3, rotation: [0, -PI / 2, 0] as Vec3, scale: 0.05 };
const CAMERA = {
  unfocus: { pos: [-0.472, 2.713, -6.2] as Vec3, rot: [-0.55, 3.34, 0] as Vec3, pan: [0.06, 0.04] as [number, number] },
  focus: { pos: [0.872, 2.513, -5.6] as Vec3, rot: [-0.55, 2.34, 0] as Vec3, pan: [0.06, 0.04] as [number, number] },
};
const CAMERA_PORTRAIT = {
  unfocus: { pos: [-0.2, 2.7, -6.8] as Vec3, rot: [-0.5, 3.18, 0] as Vec3, pan: [0.06, 0.04] as [number, number] },
  focus: { pos: [-0.2, 2.7, -6.8] as Vec3, rot: [-0.5, 3.18, 0] as Vec3, pan: [0.06, 0.04] as [number, number] },
};
const focal = (i: number): Vec3 => [0, 2, i * 60 - 5]; // equipment world Z per scene row

export const SLIDES: SlideConfig[] = [
  {
    index: 0,
    slug: "protect",
    title: "Pattern",
    description:
      "The scanner projects each circuit layer onto the wafer, exposing features only nanometres wide. Every layer of the chip starts here, aligned to the one beneath it with sub-nanometre overlay.",
    soundAmbient: "under",
    container: CONTAINER,
    equipment: { file: "litho_scanner", thresholdAngle: 44 },
    camera: CAMERA,
    cameraPortrait: CAMERA_PORTRAIT,
    rgbFocal: focal(0),
  },
  {
    index: 1,
    slug: "validate",
    title: "Deposit",
    description:
      "Chemical vapour deposition grows atom-thin films across the wafer — conductors, insulators and barriers stacked layer upon layer to build each transistor in three dimensions.",
    soundAmbient: "under",
    container: CONTAINER,
    equipment: { file: "thinfilm_cvd", thresholdAngle: 38 },
    camera: CAMERA,
    cameraPortrait: CAMERA_PORTRAIT,
    rgbFocal: focal(1),
  },
  {
    index: 2,
    slug: "training",
    title: "Diffuse",
    description:
      "Inside the furnace, wafers are heated past a thousand degrees so dopant atoms diffuse into the silicon lattice, setting precisely where and how current will flow.",
    soundAmbient: "under",
    container: CONTAINER,
    equipment: { file: "diffusion_furnace", thresholdAngle: 28 },
    camera: CAMERA,
    cameraPortrait: CAMERA_PORTRAIT,
    rgbFocal: focal(2),
  },
  {
    index: 3,
    slug: "investigate",
    title: "Fabricate",
    description:
      "At the heart of the fab, a cluster tool links several vacuum process chambers around a central wafer-handling robot. Etch, deposition and metrology run back to back without ever breaking vacuum, fabricating each chip layer by layer with nanometre precision.",
    soundAmbient: "under",
    container: CONTAINER,
    equipment: { file: "cluster_tool", thresholdAngle: 35 },
    camera: CAMERA,
    cameraPortrait: CAMERA_PORTRAIT,
    rgbFocal: focal(3),
  },
];

export const HEADER_LABEL = "Innovation is part of our DNA";
export const MENU_LABEL = "Live the experiences";
