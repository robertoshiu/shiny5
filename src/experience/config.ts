/**
 * Shared scene/UI contract for the Orano "Innovation Slider" clone.
 * Values reverse-engineered from app.js — see docs/research/SCENE_SPEC.md.
 * Consumed by BOTH the WebGL track (src/experience/**) and the DOM chrome (src/components/**).
 *
 * Coordinate units are Three.js units exactly as in the original bundle.
 * Colors converted from shader (r,g,b) floats to hex.
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

export interface SlideConfig {
  index: number; // 0..3
  slug: "protect" | "validate" | "training" | "investigate";
  /** big glitch verb title */
  title: string;
  /** verbatim intro copy */
  description: string;
  /** crossfading ambient track key while on this slide */
  soundAmbient: "under";
  /** container transform that holds this slide's models */
  container: { position: Vec3; rotation: Vec3; scale: number };
  models: ModelConfig[];
  /** landscape camera rig states (angles.container offsets) */
  camera: { unfocus: CameraState; focus: CameraState };
  /** chromatic-aberration 3D focal dummy (projected to drive uRadialDumping.xy) */
  rgbFocal: Vec3;
  /** explore-mode hotspots: 3D anchor + label */
  keypoints: { id: string; anchor: Vec3; label: string }[];
}

/** Orano brand yellow + the grey ramp used by line materials. */
export const COLORS = {
  bg: "#05070f",
  accent: "#ffe600",
  white: "#ffffff",
  grey18: "#2e2e2e", // (0.18)
  grey14: "#242424", // (0.14)
  grey12: "#1f1f1f", // (0.12) — terrain base + several rooms
  grey10: "#1a1a1a", // (0.10)
  grey40: "#666666", // (0.40) — sim pillar
  black: "#000000", // factory silhouette
  win: "#4c9900", // (0.3,0.6,0) success green
  scanBlue: "#519bff",
  scanRed: "#ff2900",
} as const;

/** Terrain shader shared defaults (see SCENE_SPEC §7a). */
export const TERRAIN = {
  texture: "/assets/images/terrain-texture.png",
  color: COLORS.grey12, // uColor (0.12)
  focusColor: COLORS.accent, // uFocusColor (1,0.9,0)
  elevationNoiseMultiplier: 0.07,
  focusMultiplier: 0.25, // tamed: 3 over-saturated the focal row into a hard yellow line
} as const;

/** Post-processing constants (SCENE_SPEC §6). */
export const POST = {
  rgbOffset: {
    strength: 15,
    radialDumping: [0.5, 0.5, 1, -0.5] as [number, number, number, number],
    teint: [1.165, 1.132, 1.274] as Vec3,
  },
  menuGlitch: { tileOffset: [0.1, 0.03] as [number, number], tileAmplitude: 2, gradientAmplitude: 0.5 },
  transitionGlitch: { tileOffset: [0.03, 0.1] as [number, number], tileAmplitude: 3, gradientAmplitude: 0, durationS: 3 },
} as const;

/** Camera + world globals (SCENE_SPEC §2,§3,§4). */
export const WORLD = {
  clearColor: COLORS.bg,
  camera: { fov: 35, near: 0.1, far: 40 },
  /** scenes are laid out in a row, this far apart along -Z */
  distanceBetween: 60,
  pixelRatioCap: 2,
} as const;

/** Howler audio map (SCENE_SPEC §9). file paths under /assets/audio */
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

export const SLIDES: SlideConfig[] = [
  {
    index: 0,
    slug: "protect",
    title: "Protect",
    description:
      "Locating gamma radiation sources in nonaccessible area is challenging, and a major safety concern. Thanks to NanoPix, this miniature gamma camera can squeeze itself into tiny spaces making the invisible visible.",
    soundAmbient: "under",
    container: { position: [0.4, 0, -5.3], rotation: [0, -2.3, 0], scale: 0.2 },
    models: [
      { file: "rover", color: COLORS.grey18, role: "env", reveal: [0, 0.25, 0.68] },
      { file: "nanopix", color: COLORS.accent, role: "highlight", reveal: [0, 0.92, -0.19] },
      // faint grey, not pure black: additive blending made #000 invisible, but the
      // reference shows faint background factory/tower structures.
      { file: "factory", color: "#161616", role: "silhouette" },
    ],
    camera: {
      unfocus: { pos: [0.24, 0.1, -5.8], rot: [0, 3.24, 0], pan: [0.06, 0.04] },
      focus: { pos: [0.236, 0.1587, -5.7221], rot: [-0.2369, 3.666, 0], pan: [0.06, 0.04] },
    },
    rgbFocal: [0.4, 0.1, -5.3],
    keypoints: [
      { id: "nanopix", anchor: [-0.15, 0.58, -0.05], label: "Due to its small size, the NanoPix is easy to transport" },
      { id: "rover", anchor: [0, 0.3, 0.3], label: "The camera can also be mounted on robots, mechanical arms and drones" },
    ],
  },
  {
    index: 1,
    slug: "validate",
    title: "Validate",
    description:
      "The TQC2 (as designed/as built) project aims to use augmented reality to facilitate compliance monitoring on potentially complex equipment or facilities, while offering better traceability and improving the comfort of operators.",
    soundAmbient: "under",
    container: { position: [-0.64, 0.13, -5.5], rotation: [0, -0.79 * PI, PI / 2], scale: 0.06 },
    models: [
      { file: "factory-room", color: COLORS.grey10, role: "env" },
      { file: "tank", color: COLORS.grey14, role: "env" },
      // tablet body is the yellow highlight (matches the reference's yellow tablet frame);
      // the AR screen texture plane is added on top in ValidateScene.
      { file: "tablet", color: COLORS.accent, role: "highlight", reveal: [1.24, 0.15, -3.12] },
    ],
    camera: {
      unfocus: { pos: [-0.32, 0.12, -5.8], rot: [0, 2.14, 0], pan: [0.06, 0.04] },
      focus: { pos: [-0.264, 0.1487, -5.7221], rot: [0, 2.25, 0], pan: [0.06, 0.04] },
    },
    rgbFocal: [-0.65, 0.13, 54.52],
    keypoints: [
      { id: "tablet1", anchor: [-0.15, 0.2, -0.1], label: "Augmented reality features can be activated within the DIOTAPLAYER interface, overlaying 3D elements on top of your physical environment" },
      { id: "tablet2", anchor: [0.25, 0.5, 0.7], label: "Instructions on the physical object are combined with contextual information corresponding to outstanding tasks" },
      { id: "tablet3", anchor: [0.4, 0.6, -0.9], label: "To support ground operations we've made it easy to manipulate the collected data without extensive training" },
    ],
  },
  {
    index: 2,
    slug: "training",
    title: "Training",
    description:
      "Training in the driving of a polar crane in a nuclear power plant in order to practice handling heavy loads and dealing with situations that are hazardous or require familiarization prior to implementation: moving large components in and out of the zone, positioning and maintenance of tooling.",
    soundAmbient: "under",
    container: { position: [1, 0, -4.85], rotation: [0, 0, 0], scale: 0.1 },
    models: [
      { file: "simulator-room", color: COLORS.grey12, role: "env", reveal: [-57.66, 1.24, 18.7] },
      { file: "simulator-outside", color: COLORS.grey18, role: "env", reveal: [5.61, 1.24, -0.94] },
      { file: "simulator-inside", color: COLORS.accent, role: "highlight" }, // the yellow operator seat/cabin interior
    ],
    camera: {
      unfocus: { pos: [0.18, 0.5, -5.8], rot: [-0.25, 3.64, 0], pan: [0.06, 0.04] },
      focus: { pos: [0.6, 0.35, -5.8], rot: [-0.15, 3.7, 0], pan: [0.06, 0.04] },
    },
    rgbFocal: [0.95, 0.2, 115.1],
    keypoints: [
      { id: "simulator1", anchor: [0, 3.5, -0.8], label: "The virtual cabin enables situational training for scenarios that are either risky or require sensitisation before real-world execution" },
      { id: "simulator2", anchor: [2.7, 2.3, 0.7], label: "The positioning of the seven screens is optimised for total immersion inside the environment, with identical audio and heat conditions" },
      { id: "simulator3", anchor: [0.55, 1.6, -0.4], label: "The equipment features the creation of scenarios on-demand, including extreme or unprecedented situations" },
    ],
  },
  {
    index: 3,
    slug: "investigate",
    title: "Investigate",
    description:
      "Drones have become essential in a number of our core businesses including our mining and dismantling & services activities. They are used at different stages of the lifecycle of a mine, from exploration to rehabilitation, as well as for inspection.",
    soundAmbient: "under",
    container: { position: [0, 2, -5], rotation: [0, -PI / 2, 0], scale: 0.05 },
    models: [
      { file: "drone-base", color: COLORS.accent, role: "highlight", reveal: [7, -1, 0] },
      { file: "drone-rotor", color: COLORS.accent, role: "highlight", spin: { axis: "y", speed: 0.015 } },
      // topography contour layers (env) are added in code from topography-1..4
      { file: "topography-1", color: COLORS.grey18, role: "env" },
    ],
    camera: {
      unfocus: { pos: [-0.472, 2.713, -6.2], rot: [-0.55, 3.34, 0], pan: [0.06, 0.04] },
      focus: { pos: [0.872, 2.513, -5.6], rot: [-0.55, 2.34, 0], pan: [0.06, 0.04] },
    },
    rgbFocal: [0, 2, 175.12],
    keypoints: [
      { id: "drone1", anchor: [4.5, -0.5, 0], label: "Drones are used in exploration and support missions for mining or denuclearisation activities" },
      { id: "drone2", anchor: [1, -2.5, 0], label: "The use of drones facilitates the acquisition of images and topographical data for inspection or cartography" },
    ],
  },
];

export const HEADER_LABEL = "Innovation is part of our DNA";
export const MENU_LABEL = "Live the experiences";
