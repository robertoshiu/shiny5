# WebGL Rebuild — Critical Notes (complements SCENE_SPEC.md)

## Models are LINE WIREFRAMES, not meshes
- Every `.obj` contains ONLY `v` (vertices) + `l` (line/edge elements). NO `f` (faces), NO `vn` (normals).
  e.g. `l 3 441` = a line segment between vertex 3 and 441 (1-indexed).
- Render each model as **`THREE.LineSegments`** with **`LineBasicMaterial`**, NOT meshes.
  - three's `OBJLoader` DOES parse `l` elements and yields LineSegments — but VERIFY: with R3F `useLoader(OBJLoader, url)` the returned Group's children should be LineSegments. If a loader version ignores `l`, parse the OBJ manually (read `v` into a positions array, build an indexed/expanded LineSegments geometry from the `l` pairs). A tiny custom OBJ-lines loader is safest and ~30 lines.
- Materials:
  - Environment models (rover, tank, factory, simulator room, topography, etc.): white `#ffffff` LineBasicMaterial, **low opacity** (transparent, ~0.25–0.5), additive-ish faint look.
  - The ONE highlighted/hero model per slide (nanopix, tablet, simulator seat, drone): **yellow `#ffe600`**, higher opacity (~0.9–1).
  - Exact per-slide colors/opacities: see SCENE_SPEC.md §4/§5 (from app.js).

## Scale / framing
- Models are ~unit scale, centered near origin, sitting on y≈0 (rover bounds x[-0.40,0.40] y[0,0.43] z[-0.54,0.59]).
- Camera distances/positions in app.js are in these same small units — use SCENE_SPEC camera values verbatim.

## Vertex/edge counts (perf is fine)
nanopix 1990v/2937l · rover 1779v/3458l · tablet 356v/484l · drone-rotor 248v/420l · drone-base 2185v ·
factory 14428v · tank-inside 18600v (heavy) · simulation-scene 4076v · topography-1..4 3746/2468/1108/483v (contour polylines, l==v).

## Slide → highlighted (yellow) model + environment (from screenshots; confirm models in SCENE_SPEC)
1. PROTECT: yellow = **nanopix**; env = rover + background factory/structures.
2. VALIDATE: yellow = **tablet** (DIOTAPLAYER) over white tank; env = tank/tank-inside + factory bg.
3. TRAINING: yellow = simulator **seat/cabin** (simulator-inside / a seat) inside white simulator-room/structure; flowing line-wave on top.
4. INVESTIGATE: yellow = **drone** (drone-base + drone-rotor) over **topography** contour lines + grid floor.

## Background / world (all slides)
- Pure near-black `#05070f`. Perspective **grid floor** (lines). Faint white wireframe environment models. A **flowing white line-field** band (looks like an audio waveform / wind) across upper area (esp. slides 1,3) — likely a custom line/Points shader animated over time. **Fog** fades distant lines into black.
- **Chromatic aberration** post-processing: the whole scene has subtle RGB split that intensifies during slide transitions (and the peeking next-slide ghost is heavily RGB-split). Check SCENE_SPEC §6 for the exact RGBShift/ShaderPass GLSL + amount.

## Menu mode
- Camera pulls back to show whole world; color grade shifts to **blue**; a digital datamosh/glitch block band appears top. (Likely a uniform tint + a glitch pass turned up.)

## Transitions
- Slide change = camera move + glitch burst + decor swap; ~1.5–2s; SFX `sfx-decor-change`. See SCENE_SPEC §8 for tween durations/easings (gsap/TWEEN).
