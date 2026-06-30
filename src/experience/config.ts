/**
 * Shared scene/UI contract for the ShinyLogic (顯藝科技) wafer-fab site.
 * The deck mirrors the site's seven pages — Home, About, Solutions, Technology,
 * Methodology, Careers, Contact — each a bilingual page-slide (EN glitch verb + ZH copy).
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
  index: number; // 0..6
  slug: "home" | "about" | "solutions" | "technology" | "methodology" | "careers" | "contact";
  /** big glitch verb title */
  title: string;
  /** English kicker / section label shown as a small mono line (bilingual deck) */
  kicker: string;
  /** intro copy */
  description: string;
  /** English description (for the EN language toggle) */
  descriptionEn: string;
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
    slug: "home",
    title: "Forge",
    kicker: "01 — HOME // INTELLIGENT WAFER FAB",
    description:
      "從 8 大工藝機台的訊號，到 AI 決策閉環，再到跨區域異地備援——顯藝科技為您的晶圓廠交付並承擔 IT/OT+AI 全棧的建置、整合與維運責任，完整六層技術堆疊 100% 歸檔回您。",
    descriptionEn:
      "From signals across 8 process tool types, to AI decision loops, to cross-region disaster recovery — ShinyLogic delivers and owns the full IT/OT+AI stack build, integration, and operations for your fab. Complete six-layer stack, 100% archived back to you.",
    soundAmbient: "under",
    container: CONTAINER,
    equipment: { file: "cluster_tool", thresholdAngle: 35 },
    camera: CAMERA,
    cameraPortrait: CAMERA_PORTRAIT,
    rgbFocal: focal(0),
  },
  {
    index: 1,
    slug: "about",
    title: "Define",
    kicker: "02 — ABOUT // WHO WE ARE",
    description:
      "顯藝科技為晶圓廠直接交付 IT/OT+AI 全棧技術棧——從 L1 設備訊號到 L6 備援層，以明確 SLA 承擔建置、整合與維運全程責任，並交還 100% 歸檔的跨廠範本。",
    descriptionEn:
      "ShinyLogic delivers the IT/OT+AI full-stack directly to your fab — from L1 equipment signals to L6 resilience, with clear SLA ownership across build, integration, and operations, returning a 100%-archived cross-fab template.",
    soundAmbient: "under",
    container: CONTAINER,
    equipment: { file: "litho_scanner", thresholdAngle: 44 },
    camera: CAMERA,
    cameraPortrait: CAMERA_PORTRAIT,
    rgbFocal: focal(1),
  },
  {
    index: 2,
    slug: "solutions",
    title: "Resolve",
    kicker: "03 — SOLUTIONS // SIX-LAYER STACK",
    description:
      "六層架構不只是技術分層——它是六個明確的解題框架。從設備訊號採集、到 AI 決策閉環、再到跨區域業務連續性，每一層承擔具體的業務問題、定義可衡量的交付範圍，並以合約 SLA 為後盾。",
    descriptionEn:
      "The six-layer stack is not just a technical taxonomy — it is six explicit problem-solving frameworks. From equipment signal ingestion to AI decision loops to cross-region business continuity, each layer owns a concrete business problem, defines a measurable delivery scope, and is backed by contractual SLAs.",
    soundAmbient: "under",
    container: CONTAINER,
    equipment: { file: "thinfilm_cvd", thresholdAngle: 38 },
    camera: CAMERA,
    cameraPortrait: CAMERA_PORTRAIT,
    rgbFocal: focal(2),
  },
  {
    index: 3,
    slug: "technology",
    title: "Compute",
    kicker: "04 — TECHNOLOGY // ENGINEERING DEEP-DIVE",
    description:
      "從 NVIDIA Blackwell Ultra 算力底座、高量產 MES 平台（FAB300）七模組，到 OT/IT 雙域安全架構與 RTO ≤ 4hr 異地備援——每一層技術均有規格、合規與合約為後盾。",
    descriptionEn:
      "From the NVIDIA Blackwell Ultra compute base and HVM MES Platform (FAB300) seven modules, to OT/IT dual-domain security and RTO <= 4hr resilience — every layer is backed by specifications, compliance, and contract.",
    soundAmbient: "under",
    container: CONTAINER,
    equipment: { file: "diffusion_furnace", thresholdAngle: 28 },
    camera: CAMERA,
    cameraPortrait: CAMERA_PORTRAIT,
    rgbFocal: focal(3),
  },
  {
    index: 4,
    slug: "methodology",
    title: "Deliver",
    kicker: "05 — METHODOLOGY // FAB300 REFERENCE",
    description:
      "以高量產 MES 平台（FAB300）為核心、NVIDIA GB300 NVL72 AI Fabric 為算力底座——顯藝科技直接為您的晶圓廠交付並承擔 IT/OT+AI 全棧整合責任，100% 方法論歸檔交回，可直接複製至下一座晶圓廠。",
    descriptionEn:
      "Built on the high-volume MES platform (FAB300) and NVIDIA GB300 NVL72 AI Fabric compute — ShinyLogic delivers directly to your fab and owns full IT/OT+AI integration end-to-end. 100% methodology archived and handed back, ready to replicate to the next fab.",
    soundAmbient: "under",
    container: CONTAINER,
    equipment: { file: "wafer_processor", thresholdAngle: 52 },
    camera: CAMERA,
    cameraPortrait: CAMERA_PORTRAIT,
    rgbFocal: focal(4),
  },
  {
    index: 5,
    slug: "careers",
    title: "Join",
    kicker: "06 — CAREERS // JOIN THE BUILD",
    description:
      "顯藝科技正以四階段節奏組建 IT 智能部，從建廠到量產，每一位工程師都在真實的前沿場景中擔任授權角色——不是執行清單，而是拿責任、驅動決策。",
    descriptionEn:
      "ShinyLogic is assembling the IT Intelligence Dept across four build phases — from site construction to high-volume manufacturing. Every engineer holds an authorized role in a real frontier environment: not a task list, but ownership and decisions that matter.",
    soundAmbient: "under",
    container: CONTAINER,
    equipment: { file: "robot_arm", thresholdAngle: 40 },
    camera: CAMERA,
    cameraPortrait: CAMERA_PORTRAIT,
    rgbFocal: focal(5),
  },
  {
    index: 6,
    slug: "contact",
    title: "Engage",
    kicker: "07 — CONTACT // ENGAGE",
    description:
      "顯藝科技直接為您的晶圓廠交付並承擔 IT/OT+AI 全棧的建置、整合與維運責任，並交還 100% 歸檔的跨廠範本。預約建置規劃諮詢、技術評估或招募對話：hello@shinylogic.tech。",
    descriptionEn:
      "ShinyLogic delivers and owns the full IT/OT+AI stack build, integration, and operations for your fab — and hands back 100%-archived cross-fab templates. For build planning, technical advisory, vendor coordination, or recruitment: hello@shinylogic.tech.",
    soundAmbient: "under",
    container: CONTAINER,
    equipment: { file: "vacuum_chamber", thresholdAngle: 60, targetSize: 12 },
    camera: CAMERA,
    cameraPortrait: CAMERA_PORTRAIT,
    rgbFocal: focal(6),
  },
];

export const HEADER_LABEL = "把設備數據，鍛造成可決策的智能";
export const MENU_LABEL = "探索六層全棧";
export const HEADER_LABEL_EN = "Forging equipment data into decision-grade intelligence";
export const MENU_LABEL_EN = "Explore the stack";
