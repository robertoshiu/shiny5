# Orano Innovation Slider — DOM Chrome Spec (HUD over the WebGL canvas)

Source of truth for exact values: the downloaded **`app.css`** (169KB) and **`computed-styles.json`**,
plus reference screenshots in `design-refs/`. The chrome is a fixed/absolute overlay on top of a
full-viewport `<canvas>`. Framework on the live site: Vue 2 + vue-router (scoped `data-v-*` CSS).
Rebuild target: React components in Next.js. Keep DOM structure close to original class names so
`app.css` rules port cleanly.

## Design tokens (from app.css)
- `--bg`: `#05070f` (near-black navy; the page/canvas clear color)
- `--accent` (Orano yellow): `#ffe600` (a few `#fee600`); rgba form `rgba(255,230,0,a)`
- `--white`: `#fff` (wireframe lines, primary text)
- muted text grays: `#cfcfcf`, `#8e8e8e`, `#898989`, `#6b6b6b`
- glitch RGB-offset colors: green `#0aff15`, red (≈ `#ff0000`/`#f00`)
- panel/scrim darks: `#0f0f18`, `#15151e`, `#161611`; scrims `rgba(5,7,15,.5/.65/.75/.85)`

## Fonts
- **Blender Pro** — all HUD/display: big titles, pagination numbers, ENTER, menu list numbers, footer caps.
  Weights used: Thin (100) for titles, Medium (500) for counter/labels. Files: `BlenderPro-Thin.woff2`, `BlenderPro-Medium.woff2`.
- **Nunito Sans** — body descriptions, header label, menu-trigger label. Weights: ExtraLight (100/200), Light (300).
  Files: `NunitoSans-ExtraLight.woff2`, `NunitoSans-Light.woff2`.
- Load via next/font/local with CSS families exactly `"Blender Pro"` and `"Nunito Sans"`.

## Layout (desktop 1440×900), z above canvas
Fixed overlay grid; canvas behind everything. Key components & exact metrics:

1. **Header label** `.main-title` — text "Innovation is part of our DNA" (uppercase via CSS).
   Nunito Sans 16px / weight 100 / white. `position:fixed; top:35px; left:55px`. A small yellow tick/bar precedes it.
2. **Menu trigger** `.menu-trigger-container` (top-right) — label "LIVE THE EXPERIENCES" (`.menu-trigger`, Nunito Sans 16px/100, line-height 40, padding 0 20) + a hamburger icon. `fixed; top:35px; right:45px`. Toggles to "CLOSE ✕" when menu open.
3. **Pagination / counter** `.pagination` — center-top, `fixed top:135px left:664px` (≈ centered, w200 h50). Shows current "NN — NN" with a diagonal-striped (hachure) box behind, the current number in **yellow**, next in gray. `.index.is-active`: Blender Pro 16px / weight 500 / letter-spacing 2.4px / uppercase. Numbers animate (mover translateX, `.blinker`). Order: 01 02 03 04, last shows "00" as next end-cap.
4. **Glitch title** `.title > .word > .letter` — the big experience verb (PROTECT/VALIDATE/TRAINING/INVESTIGATE).
   Blender Pro **52px / weight 100 / letter-spacing 10.4px / line-height 62.4px / uppercase / white**.
   `position:relative` inside a right-column block; rect ≈ x792 y296. **Chromatic-aberration done in DOM**: each `.letter` has `.rgb-offset.red` and `.rgb-offset.green` duplicate layers offset by a few px (green `#0aff15`, red). On slide change the letters do a glitch reveal (rapid repeated letters then settle). zIndex above copy.
5. **Description** `.description` — body copy block under the title, right column (~x792, width ≈ 400). Nunito Sans, light, gray-white, ~16px / line-height ~28px. (Exact in computed-styles.json.)
6. **ENTER button** `.push-button` (`.before`/`.after` duplicated layers for glitch). White rectangular button (~228×52) with a **yellow accent bar on the left edge** (~8px). Label "ENTER" in Blender Pro, dark text on white. Sits below the description (~x792 y560). Hover animates.
7. **Nav arrows** `.arrow` / `.button-circle` — circular outline buttons with a thin arrow, mid-height (~y450) at left edge (~x55, prev) and right edge (~x1350, next). Prev hidden on slide 1; next hidden on slide 4. Click navigates; the whole slider is also **click-and-hold** ("CLICK AND HOLD" hint) and ArrowLeft/Right keys.
8. **Footer** `.footer` (`fixed`, bottom): 
   - `.main-logo` / `.orano-group` — Orano logo (the swirl glyph + "orano" wordmark), bottom-left `top:819px left:50px` (128×41), links to orano.group.
   - bottom-right cluster: `.langs > .lang` EN / FR toggle (active = white, inactive = gray; active has a small dot/underline), a `.sound` toggle rendered as a **6-bar waveform** (`.bar.bar-1..6`) that animates when audio on, and "RETURN TO ORANO.GROUP" caps link.
9. **Decorative HUD** — thin grid lines (`.line.horizontal/.vertical`), `.blinker`, `.triangle`, small corner ticks; subtle, low-opacity white.

## The "Live the experiences" menu  (`.circular-menu.is-active`)
Full-screen takeover (see `menu-open-1440.png`):
- Camera **pulls back** to reveal the whole 3D world; scene **color-grades to BLUE** (wireframe turns blue, a digital datamosh/glitch block band appears across the top).
- Header switches "LIVE THE EXPERIENCES" → **"CLOSE — ✕"**.
- Right side: vertical list of the 4 experiences, large gray Blender-Pro caps, right-aligned, each with its yellow index number to the right: `PROTECT 01`, `VALIDATE 02`, `TRAINING 03`, `INVESTIGATE 04`. Hover/click a row → go to that slide & close.
- Footer (logo, lang, sound, return) stays.

## Interaction / state machine
- Entry at `/slider` = slide 01 (PROTECT). (A first-visit loading screen with glitch reveal + "turn on your volume" exists on the `/en` intro route; secondary — a simple version is enough.)
- **Slide nav**: click-and-hold on side zones OR circular arrows OR ArrowLeft/Right keys. NO loop (stops at 01 and 04). Each transition: a "decor change" — camera move + glitch + the title glitch-reveals + counter animates; SFX `sfx-decor-change` + the peeking next-slide ghost (chromatic) slides in. ~1.5–2s.
- **ENTER** (`.push-button`): enters that experience's **explore mode** — camera flies into the scene; `.keypoints` (hotspots: `.dot` + pulsing `.circle-small/.circle-large` + `.stroke` + `.text` label) appear on points of the model; clicking a hotspot reveals its label (SFX `sfx-hotspot`). A back/home control returns (SFX `sfx-zoom-home`). [Secondary scope — build slider first.]
- **Menu**: click hamburger → blue pullback menu (above). Click experience → that slide.
- **Audio**: bg music loop (`music-main`, lighter `music-light` in menu/explore), `sfx-click`, `sfx-valid`, `sfx-loading` (hold progress), `sfx-decor-change`, `sfx-zoom-home`, `sfx-hotspot`. Sound toggle in footer (waveform) mutes/unmutes; starts muted until user enables.

## Verbatim slide copy
1. **PROTECT** — "Locating gamma radiation sources in nonaccessible area is challenging, and a major safety concern. Thanks to NanoPix, this miniature gamma camera can squeeze itself into tiny spaces making the invisible visible."
2. **VALIDATE** — "The TQC2 (as designed/as built) project aims to use augmented reality to facilitate compliance monitoring on potentially complex equipment or facilities, while offering better traceability and improving the comfort of operators."
3. **TRAINING** — "Training in the driving of a polar crane in a nuclear power plant in order to practice handling heavy loads and dealing with situations that are hazardous or require familiarization prior to implementation: moving large components in and out of the zone, positioning and maintenance of tooling."
4. **INVESTIGATE** — "Drones have become essential in a number of our core businesses including our mining and dismantling & services activities. They are used at different stages of the lifecycle of a mine, from exploration to rehabilitation, as well as for inspection."

### Explore-mode hotspot labels (verbatim, for later)
- PROTECT: "Due to its small size, the NanoPix is easy to transport" · "The camera can also be mounted on robots, mechanical arms and drones"
- VALIDATE: "Augmented reality features can be activated within the DIOTAPLAYER interface, overlaying 3D elements on top of your physical environment" · "Instructions on the physical object are combined with contextual information corresponding to outstanding tasks" · "To support ground operations we've made it easy to manipulate the collected data without extensive training"
- TRAINING: "The virtual cabin enables situational training for scenarios that are either risky or require sensitisation before real-world execution" · "The positioning of the seven screens is optimised for total immersion inside the environment, with identical audio and heat conditions" · "The equipment features the creation of scenarios on-demand, including extreme or unprecedented situations"
- INVESTIGATE: "Drones are used in exploration and support missions for mining or denuclearisation activities" · "The use of drones facilitates the acquisition of images and topographical data for inspection or cartography"

## Responsive (mobile 390 — see slide-01-mobile-390.png)
- Header collapses to: larger **Orano logo top-left** + **hamburger top-right** (no header label, no "LIVE THE EXPERIENCES" text).
- Canvas full-bleed, camera reframed for portrait (model centered/larger).
- Single circular **next arrow** on the right edge.
- Title glitch + counter reposition lower-left; description/ENTER appear lower (tap/scroll).
- Footer simplified: EN / FR · sound waveform · "RETURN TO ORANO.GROUP" (stacked right).
- Breakpoint ≈ 768px (tablet keeps desktop-ish layout, scaled).

## Reference screenshots (design-refs/)
slide-01..04-1440.png (4 hero scenes) · menu-open-1440.png (blue menu) · slide-01-mobile-390.png · intro-t*.png
