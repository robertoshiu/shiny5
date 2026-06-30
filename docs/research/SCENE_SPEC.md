# Orano "Innovation Slider" — WebGL Scene Spec (reverse-engineered)

Source bundles: `app.js` (461 KB, webpack/Vue), `vendor.js` (1.5 MB, Three.js r95 + postprocessing + Howler + GSAP), `app.css`.
All values below are extracted verbatim from the minified bundle. Decimal colors are converted to hex.
Coordinate/scale values are exactly as in the bundle (Three.js units).

---

## 1. Framework & libraries

| Concern | Finding |
|---|---|
| App framework | **Vue 2** (`version="2.5.13"`) + **Vue Router** (SPA, render functions, `$eventHub` global event bus, `$route.meta`-driven). Components: `app-animated-text`, `app-push-button`, page components per route. |
| 3D engine | **Three.js r95** (`REVISION="95"` in vendor.js). |
| Post-processing | **`postprocessing`** npm library (vanruesc) — provides `EffectComposer`, `RenderPass`, `ShaderPass`, `SMAAPass`, `CopyMaterial` (NOT three's examples/jsm). |
| Animation lib | **GSAP** — `TweenLite`, `TimelineLite`, eases `Power2/Power3/Power4.easeInOut/easeOut`. Also a hand-rolled eased-lerp tick loop (`value += (target-value)*delta*easing`). |
| Audio lib | **Howler.js** (`Howl`, `Howler`). |
| Debug | `dat.GUI` present but gated behind `this.debug`. |
| OBJ loader | **Custom minimal OBJ loader** — parses only `v` (vertices) and `l` (line elements). Models are line/wireframe geometry, rendered as `THREE.LineSegments`, NOT solid meshes. |
| Fonts | **Blender Pro** (Thin/Medium — headings & UI chrome), **Nunito Sans** (Light/ExtraLight — body copy). |
| Analytics | AT Internet `smarttag.js` / xiti (irrelevant to scene). |

---

## 2. Renderer + global scene

```js
renderer = new THREE.WebGLRenderer({ stencil:false, depth:true, alpha:true, canvas })
renderer.sortObjects   = true
renderer.setClearColor(0x05070F, 1)              // decimal 329487 — very dark blue-black (NOT pure #000)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(viewport.width, viewport.height)
composer = new EffectComposer(renderer, { depthTexture:true })
```

- **Clear / background color: `#05070F`** (RGB 5,7,15). This is also reused as the tablet-screen background tint (opacity 0.65).
- Tone mapping: not set (default `NoToneMapping`).
- **Fog: NONE.** No `Fog`/`FogExp2` anywhere. Depth falloff is faked per-shader via `uFocusDistance` (distance-based alpha) and additive blending on a black background.
- All scene line materials use `blending: THREE.AdditiveBlending`, `transparent:true`, `depthWrite:false`.

---

## 3. Global camera

```js
instance = new THREE.PerspectiveCamera(35, viewport.width/viewport.height, 0.1, 40)
```

- **fov 35, near 0.1, far 40.**
- Rig hierarchy (outer→inner): `angles.container` → `pan.container` → `instance`.
  - `angles` = the keyframed scene/state transform (position+rotation), eased toward a target each tick (`easing` lerp).
  - `pan` = subtle parallax driven by cursor (`pan.amplitude`, e.g. `{x:.06,y:.04}` per state).
- There is no single "default position"; the camera is **state-driven** (`camera.setState(name, duration, ease)`). See per-slide camera states in §4.
- `camera.type` is `"guided"` on desktop (scripted camera) — drives scroll destination + focus states.

---

## 4. The 5 experiences / slides

The experience is **HOME (Explore) + 4 numbered experiences**. The 4 scenes are laid out in a **row along −Z, spaced 60 units apart** (`terrainSizes = { scene:20, transition:40, distanceBetween:60 }`). Navigating between experiences slides the camera/scene index; the chromatic-aberration focal point and terrain focus tween to the new scene.

Routes (`$route.meta`):

| index | route/slug | title (EN) | soundAmbient | focusScene | interaction | rgbOffset key |
|---|---|---|---|---|---|---|
| (home) | `home` | "Innover est en nous" / hero | `default` | – | – | `intro` |
| – | `menu` / `slider` | menu + slider shell | `default` | – | – | `intro` |
| 0 | `protect` | **Protect** | `under` | protect | barrels | protect |
| 1 | `validate` | **Validate** | `under` | validate | tank | validate |
| 2 | `training` | **Training** (a.k.a. Simulate) | `under` | training | simulation | training |
| 3 | `investigate` | **Investigate** | `under` | investigate | droning | investigate |

> Note: the visible big verb titles ("PROTECT", etc.) are the experience `title`s rendered through the `app-animated-text` glitch component. There are only 4 numbered experiences in the menu (`01`–`04`); the 5th "experience" is the HOME/EXPLORE landing.

Per-scene **chromatic-aberration focal point** (3D dummy projected to screen, drives `uRadialDumping.xy`):
```
intro:       {x:.2,  y:.25, z:-5.3}
protect:     {x:.4,  y:.1,  z:-5.3}
validate:    {x:-.65,y:.13, z:1*60-5.48}
training:    {x:.95, y:.2,  z:2*60-4.9}
investigate: {x:0,   y:2,   z:3*60-4.88}
```
On `experience.changeIndex`: `TweenLite.to(dummy.position, 3, {...Power3.easeInOut})`.

Camera **landscape** states (rig `angles.container` transform; `setState(name+'Focus'|'Unfocus', 3, Power2.easeInOut)` on focus toggle). `angles[]` arrays are per-keypoint hotspot camera offsets.

```
protectPreIntro:  pos{.18,.12,-80.41}  rot{0,π,0}        pan{.02,.02}   // far intro fly-in
protectUnfocus:   pos{.24,.1,-5.8}     rot{0,3.24,0}     pan{.06,.04}   // overview (+4 keypoint angles)
protectFocus:     pos{.236,.1587,-5.7221} rot{-.2369,3.666,0} pan{.06,.04}
protectExperience:pos{-.177,-2.687,-6.45}  rot{-.676,3.665,0}  pan{0,0}

validateUnfocus:  pos{-.32,.12,-5.8}   rot{0,2.14,0}     pan{.06,.04}   // (+2 keypoint angles)
validateFocus:    pos{-.264,.1487,-5.7221} rot{0,2.25,0} pan{.06,.04}
validateExperience:pos{-.177,-2.687,-6.45} rot{-.676,3.665,0} pan{0,0}

trainingUnfocus:  pos{.18,.5,-5.8}     rot{-.25,3.64,0}  pan{.06,.04}   // (+4 keypoint angles)
trainingFocus:    pos{.6,.35,-5.8}     rot{-.15,3.7,0}   pan{.06,.04}
trainingExperience:pos{-.177,-11.687,-6.45} rot{-.676,3.665,0} pan{0,0}

investigateUnfocus:pos{-.472,2.713,-6.2} rot{-.55,3.34,0} pan{.06,.04}  // (+4 keypoint angles)
investigateFocus: pos{.872,2.513,-5.6}  rot{-.55,2.34,0}  pan{.06,.04}
investigateExperience:pos{-.177,-43.687,-6.45} rot{-.676,3.665,0} pan{0,0}
```
(A separate `portrait` set exists for mobile with different values.)

Every scene also contains a **flowing terrain plane** (see §7), base color `#1F1F1F` gray `(0.12,0.12,0.12)`, focus color **yellow `(1,0.9,0)`**, `uElevationNoiseMultiplier = 0.07`, terrain texture `terrain-texture.png`. Background per slide = global `#05070F` (no per-slide background change; the "decor change" is the glitch transition pass, §6/§8).

### HOME / EXPLORE (landing)
- **Hero plane**: `PlaneBufferGeometry(2,2,1,1)` textured with `hero.jpg` + `hero-mask.png`, ShaderMaterial with `uTextureRatio`, cursor-driven parallax (`±0.012 * cursor.fromCenter`, eased). Shows on home, hides on route change.
- DOM CTA "**Enter**" (`app-push-button`, `to:{name:"slider"}`) with CSS RGB-split layers (`.rgb-offset.red/.green`), blinks (interval `frequency=0.3s`) until active. Title `app-animated-text` shows after ~3s; description after 3.9s.
- Decorative **fresnel/scan ShaderMaterials** also exist in this area: `uPower/uC/uViewVector` + point-in-triangle mask (`uPointA/B/C`), colors **`#519BFF`** (blue, `uC .05`, `uViewVector (0,0,1)`) and **`#FF2900`** (red-orange, `uC .5`, `uViewVector (0,1,.7)`) — used as a scanning/area highlight overlay (`area.png`).

### Slide 0 — PROTECT (NanoPix gamma camera)  [scene class name "protect"]
Intro copy: *"Locating gamma radiation sources in nonaccessible area is challenging… Thanks to NanoPix, this miniature gamma camera can squeeze itself into tiny spaces making the invisible visible."*
Models (all `LineSegments`, reveal shader, additive):
- **nanopix container**: `rotation.y = -2.3`, `scale 0.2`, `position (0.4, 0, -5.3)`
  - `roverA` = **rover.obj**, reveal {0,.25,.68}, color `(.18,.18,.18)` gray
  - `cameraB` = **nanopix.obj**, reveal {0,.92,-.19}, color **`(1,0.9,0)` = #FFE600 YELLOW** ← the highlighted hero device
- **factory** = **factory.obj**, `rotation.y = π/2`, `scale 0.2`, `position (0,0,-4)`, color `(0,0,0)` black (silhouette)
- Interaction (barrels): **barrels-scene-floor.obj** + delimiter + room (see §7 floor), container `position (0.14,-3.34,-5.9)`, `rotation.order "YXZ"` `(0.64,0.52,0)`. Click barrels to "scan", warm colors mark radioactivity (`#FF2900` family).
- Keypoints: nanopix {-.15,.58,-.05}, rover {0,.3,.3}.

### Slide 1 — VALIDATE (augmented-reality tablet / TQC2)  [name "validate"]
Intro: *"The TQC2 (as designed/as built) project aims to use augmented reality to facilitate compliance monitoring…"*
- **room** = **factory-room.obj**, `rotation.y = π/2`, `scale 0.1`, `position (-0.9, ?, -5.1)`, color `(.1,.1,.1)`
- **tank** = **tank.obj**, `scale 0.1`, `position (-1.25, 0.16, -5)`, `rotation.y = -0.87`, color `(.14,.14,.14)`
- **tablet container**: `scale 0.06`, `position (-0.64, 0.13, -5.5)`, `rotation.y = -0.79π`, `rotation.z = π/2`; rotates with camera pan
  - `tablet.object` = **tablet.obj**, reveal {1.24,.15,-3.12}, color `(.18,.18,.18)` gray
  - `tablet.screenBackground` = `Mesh` (MeshBasicMaterial, opacity 0.65, color `#05070F`) showing **validate-tablet-screen-1.png** (AR screen) — this textured screen is the validate "highlight" (no yellow model here).
- Interaction (tank): drag cursor to verify conformity, "Discrepancy detected!" (uses tank-inside.obj / tank-error.obj).
- Keypoints: tablet1 {-.15,.2,-.1}, tablet2 {.25,.5,.7}, tablet3 {.4,.6,-.9}.

### Slide 2 — TRAINING / SIMULATE (polar-crane simulator)  [name "training"]
Intro: *"Training in the driving of a polar crane in a nuclear power plant…"*
- terrain `uAlpha 0` initially.
- **room** = **simulator-room.obj**, reveal {-57.66,1.24,18.7}, color `(.12,.12,.12)`; `scale 0.1`, `position (1,0,-4.85)`
- **simulator container** (`scale 0.1`, `position (1,0,-4.85)`):
  - `outside` = **simulator-outside.obj**, reveal {5.61,1.24,-.94}, color `(.18,.18,.18)`
  - `inside` = **simulator-inside.obj** (continues)
- Interaction (simulation): uses **simulation-scene.obj / simulation-pillar.obj / simulation-structure.obj**.
  - `pillar` starts gray `uColor (.4,.4,.4)` at container `(0.4,0.15,0.3)`; `scene.target` is **yellow `(1,.9,0)`**; `scene.object` gray `(.12,.12,.12)`.
  - **On win**: pillar + target → green `(.3,.6,0)`; structure drops, beam circles fade. Keyboard `space`/`shift` controls.
- Keypoints: simulator1 {0,3.5,-.8}, simulator2 {2.7,2.3,.7}, simulator3 {.55,1.6,-.4}.

### Slide 3 — INVESTIGATE (mining drone + topography)  [name "investigate"]
Intro: *"Drones have become essential in a number of our core businesses including our mining and dismantling & services activities…"*
- **drone container**: `scale 0.05`, `position (0, 2, -5)`, `rotation.y = -π/2`; child `drone.swaying` (Object3D, animated bob).
  - `base` = **drone-base.obj**, reveal {7,-1,0}, color **`(1,0.9,0)` YELLOW**
  - `rotor` = **drone-rotor.obj**, color **`(1,0.9,0)` YELLOW**, spins `rotation.y = 0.015*elapsed`
  - `backRotor` = **drone-back-rotor.obj** (drone-rotor reused), color **`(1,0.9,0)` YELLOW**, `position (-9.28, ?, -0.4)`, spins `rotation.z = 0.02*elapsed`
  - swaying anim: `rot.x=.02·sin(2e-4·t)`, `rot.z=.005·sin(6.78e-4·t)`, `pos.x=.2·sin(2.3e-4·t)`, `pos.z=.5·sin(7.78e-4·t)`, `pos.y=.3·sin(5.78e-4·t)`
  → **the drone is the yellow highlight model**.
- **topography**: container with layered **topography-1..4.obj** (`activeLayerIndex 4`, `size 10`, `progress 0`) + textures `investigate-topography-layer-1..4.png` + `investigate-terrain-texture.png`.
- Interaction (droning): explore area to map topography; keyboard `space`/`shift`.
- Keypoints: drone1 {4.5,-.5,0}, drone2 {1,-2.5,0}.

---

## 5. Materials & color palette

| Label | Value | Where |
|---|---|---|
| Background / clear color | **`#05070F`** (329487) | renderer clear, tablet screen bg |
| **Accent YELLOW (Orano)** | **`#FFE600`** = `rgb(255,230,0)` ≈ shader `(1,0.9,0)` (16770560) | highlight models, terrain focus color, particles, title yellow layer |
| Line/model base gray | `(0.12,0.12,0.12)`, `(0.1..0.18)` per model | reveal-shader `uColor` |
| Floor lines | gray `(0.2,0.2,0.2)` & `(0.7,0.7,0.7)` (near-white) | barrels floor/delimiter |
| Room mesh | `#222222` (2236962) | barrels room (MeshBasicMaterial) |
| Hero scan blue | `#519BFF` (5348351) | fresnel material |
| Hero scan red / radioactivity | `#FF2900` (16722176) | fresnel material / barrel scan |
| Win / success green | `(0.3,0.6,0)` | simulation pillar+target on win |
| Title RGB-split layers | red / green / yellow CSS copies | `app-animated-text` |
| Yellow stroke (UI rings) | `rgba(255,230,0,1)` | circular menu / loaders |

- **Geometry type:** all 3D models are **`THREE.LineSegments`** (OBJ `l` line elements) with custom `ShaderMaterial`, `AdditiveBlending`, `transparent`, `depthWrite:false`. The only non-line meshes are: the barrels `room` (`MeshBasicMaterial` LineSegments wireframe `#222222`), the tablet `screenBackground` (`Mesh`), and the hero plane.
- `wireframe:false` on the shader materials (they're already line geometry).
- Opacity is driven per-vertex via `vAlpha` (focus distance / reveal / fluctuation), not a flat material opacity.

---

## 6. Post-processing pipeline

Composer pass order (`postprocessing` lib). `updateRenderToScreen()` sets `renderToScreen` on the last enabled pass.

1. **RenderPass**(scene, camera.instance)
2. **SMAAPass**(smaaSearch, smaaArea) — `enabled = (window.devicePixelRatio <= 1)` (AA only on non-retina)
3. **rgbOffset** — *custom chromatic aberration* (`RGBOffsetMaterial`):
   `{ resolution: Vector2(w,h), strength: 15, radialDumping: Vector4(.5,.5,1,-.5), teint: Vector3(1.165,1.132,1.274) }`
   Always enabled; `radialDumping.xy` is animated to track the focal point (`vector3` mode projects a 3D dummy; `vector2` mode during focus). `easing` lerp toward target each tick.
4. **menuGlitch** — `GlitchMaterial`, `enabled:false`. Used for menu show/hide + page transition reveal.
5. **transitionGlitch** — `GlitchMaterial`, `enabled:false`. Used for the slide-to-slide "decor change".

> This is a **custom radial RGB-offset**, NOT three's `RGBShiftShader`. It splits R/G/B by sampling `tDiffuse` at 3 offsets 120° apart, scaled by a radial distance mask, then multiplies by a warm `teint`.

### 6a. Shared post-processing VERTEX shader (used by rgbOffset + glitch)
```glsl
varying vec2 vUv;

void main()
{
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

### 6b. Chromatic aberration — `RGBOffsetMaterial` FRAGMENT (verbatim)
Uniforms: `tDiffuse`(null), `uResolution`(Vector2), `uRadialDumping`(Vector4 = .5,.5,1,-.5), `uStrength`(float = 15), `uTeint`(Vector3 = 1.165,1.132,1.274). `depthWrite:false, depthTest:false`.
```glsl
#define M_PI 3.1415926535897932384626433832795

uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform vec4 uRadialDumping;
uniform vec3 uTeint;
uniform float uStrength;

varying vec2 vUv;

void main()
{
    // float distanceToCenter = distance(vUv, vec2(0.5, 0.4)) * 1.0;
    float distanceToCenter = distance(vUv, uRadialDumping.xy) * uRadialDumping.z;
    // float distanceStrength = distanceToCenter - 0.3;
    float distanceStrength = distanceToCenter + uRadialDumping.w;
    distanceStrength = clamp(distanceStrength, 0.0, 1.0);
    float strength = distanceStrength * uStrength;

    vec2 rOffset = vec2(sin(0.0), cos(0.0)) * strength / uResolution.x;
    vec2 gOffset = vec2(sin(M_PI * 2.0 / 3.0), cos(M_PI * 2.0 / 3.0)) * strength / uResolution.x;
    vec2 bOffset = vec2(sin(M_PI * 2.0 / 3.0 * 2.0), cos(M_PI * 2.0 / 3.0 * 2.0)) * strength / uResolution.x;

    vec4 r = texture2D(tDiffuse, vUv + rOffset);
    vec4 g = texture2D(tDiffuse, vUv + gOffset);
    vec4 b = texture2D(tDiffuse, vUv + bOffset);
    vec4 color = vec4(r.r, g.g, b.b, 1.0);

    // color.rgb = vec3(distanceStrength);

    color.rgb *= uTeint;
    // color.r *= 0.9;
    // color.g *= 0.95;
    // color.b *= 1.15;

    gl_FragColor = color;
}
```
Shift magnitude in px ≈ `(distanceStrength * 15) / resolution.x`. `uRadialDumping`: xy = screen center of effect (animated), z = radial scale (1), w = bias (-0.5, so center stays sharp, edges split).

### 6c. Glitch / transition — `GlitchMaterial` (menuGlitch & transitionGlitch share this)
Uniforms (all `Uniform`, defaults): `tDiffuse`(null), `tGradient`(null = glitchGradientTexture), `uTime`(0), `uTileProgressVertical`(0), `uTileProgressHorizontal`(0), `uTileAmplitude`(0), `uTileOffset`(Vector2 0,0), `uTileFrequency`(Vector2 1,1), `uWaveProgress`(0), `uWaveAmplitude`(0), `uWaveStrength`(Vector2 0,0), `uGradientProgress`(0), `uGradientOffset`(0), `uGradientAmplitude`(0), `uBlueProgress`(0), `uBlueAmplitude`(0), `uSaturation`(0), `uWhiteTileChances`(0), `uWhiteTileFrequency`(0), `uWhiteTileStrength`(0). Vertex = shared (§6a). `depthWrite:false, depthTest:false`.

FRAGMENT (verbatim):
```glsl
#define M_PI 3.1415926535897932384626433832795

uniform sampler2D tDiffuse;
uniform sampler2D tGradient;

uniform float uTime;

uniform float uTileProgressVertical;
uniform float uTileProgressHorizontal;
uniform float uTileAmplitude;
uniform vec2 uTileFrequency;
uniform vec2 uTileOffset;

uniform float uWaveProgress;
uniform float uWaveAmplitude;
uniform vec2 uWaveStrength;

uniform float uGradientProgress;
uniform float uGradientOffset;
uniform float uGradientAmplitude;

uniform float uBlueProgress;
uniform float uBlueAmplitude;

uniform float uWhiteTileChances;
uniform float uWhiteTileFrequency;
uniform float uWhiteTileStrength;

uniform float uSaturation;

varying vec2 vUv;

float random (in vec2 _st)
{
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 getTileCoord(vec2 pos, vec2 frequency)
{
    vec2 coord = vec2(floor(pos.x * frequency.x), floor(pos.y * frequency.y));
    coord /= frequency;

    return coord;
}

float toSin(float _value)
{
    return (sin((_value - 0.5) * M_PI) + 1.0) / 2.0;
}

void main()
{
    // Tiles
    vec2 tileCoord1 = getTileCoord(vUv, vec2(uTileFrequency * 1.8942));
    vec2 tileCoord2 = getTileCoord(vUv, vec2(uTileFrequency * 1.0));
    vec2 tileCoord3 = getTileCoord(vUv, vec2(uTileFrequency * 2.1245));
    vec2 tileCoord = tileCoord2 + step(random(tileCoord1), 0.5) * (tileCoord3 - tileCoord2);
    float tileRandom = random(tileCoord);
    float tileAngle = tileRandom * M_PI * 2.0;
    vec2 tileOffset = vec2(sin(tileAngle), cos(tileAngle)) * uTileOffset;
    // float tileProgress = 1.0 - (distance(tileCoord.x, uTileProgressHorizontal) / (uTileAmplitude * 0.5));
    float tileProgress = 1.0 - (distance(tileCoord.y, uTileProgressVertical) / (uTileAmplitude * 0.5));
    tileProgress = clamp(tileProgress, 0.0, 1.0);

    // Wave
    float waveProgress = 1.0 - (distance(vUv.x, uWaveProgress) / (uWaveAmplitude * 0.5));
    waveProgress = clamp(waveProgress, 0.0, 1.0);
    vec2 waveOffset = toSin(waveProgress) * uWaveStrength;

    // Gradient
    float gradientProgress = (tileCoord.x - uGradientProgress) / uGradientAmplitude;
    gradientProgress += (tileRandom - 0.5) * uGradientOffset;
    vec4 gradientColor = texture2D(tGradient, vec2(clamp(gradientProgress, 0.0, 1.0), 0.0));

    // Blue
    float blueProgress = (tileCoord.x - uBlueProgress) / uBlueAmplitude;
    blueProgress += tileOffset.x;
    blueProgress = clamp(blueProgress, 0.0, 1.0);

    // White tiles
    float whiteTileProgress = sin(uTime * uWhiteTileFrequency + tileRandom * M_PI * 2.0) * 0.5 + 0.5;
    whiteTileProgress = clamp(whiteTileProgress - (1.0 - uWhiteTileChances), 0.0, 1.0) * (1.0 / uWhiteTileChances) * uWhiteTileStrength;

    // Color
    vec2 uv = vUv;

    // Apply tiles
    uv += tileOffset * tileProgress; // Tiles

    // Apply waves
    // uv += waveOffset; // Wave

    // Repeat UV
    uv = mod(uv, vec2(1.0));

    vec4 color = texture2D(tDiffuse, uv);

    // Apply gradient
    color.rgb += gradientColor.rgb * gradientColor.a;

    // Apply white tile
    color.rgb += vec3(whiteTileProgress);

    // Apply blue
    vec3 blueColor = vec3((color.r + color.g + color.b) / 3.0) * vec3(0.3, 0.5, 1.0);
    color.rgb = mix(color.rgb, blueColor, vec3(blueProgress));

    // Apply saturation
    color.rgb *= uSaturation;

    gl_FragColor = color;
}
```

Animation presets driving the glitch (GSAP), see §8 for full timelines:
- **menuGlitch** init: `uTileOffset=(0.1,0.03)`, `uTileAmplitude=2`, `uGradientAmplitude=0.5`. Horizontal tile sweep.
- **transitionGlitch** init: `uTileOffset=(0.03,0.1)`, `uTileAmplitude=3`, `uGradientAmplitude=0`. Vertical tile sweep over 3 s.
- `tGradient` = `glitchGradientTexture` (loaded image) — the colored band injected during glitch.

---

## 7. Terrain / line-field / particles

### 7a. Flowing grid terrain (the "white flowing line terrain")
- Geometry: **custom `TerrainPlaneBufferGeometry(width, height, widthSegments, heightSegments, ?)`** — builds a grid of **line segments** (4 verts per cell). Custom attributes: `position`, `uv`, `guv` (grid uv), `noise` (per-segment random), `edgeRandom`, `edgeScafoldingRandom`, `edgeCenter` (cell center, for the scaffolding scale-in effect).
- Mesh: `THREE.LineSegments`, `rotation.x = -π/2` (flat on ground), `AdditiveBlending`, `transparent`, `depthWrite:false`.
- Material uniform defaults:
  ```
  uTerrainTexture = terrain-texture.png
  uElevationNoiseMultiplier = 0.07   uElevationMultiplier = 1
  uWaveDistance = 2  uWaveAmplitude = 1  uWaveStrength = 0
  uDistortionProgress = 0  uDistortionStrength = 1
  uColor = (0.12,0.12,0.12)           uFocusColor = (1, 0.9, 0)  // YELLOW near focus
  uFocusPosition = (0,0,-5)  uFocusDistance = (0,1)  uFocusMultiplier = 3
  uEdgeScaleMin = 0  uEdgeScale = 1
  uFloatingFrequency = 1e-4  uFloatingAmplitude = 0
  uAlpha = 1  uTime = elapsed
  ```
- Elevation from `terrainTexture.r`; line alpha from `terrainTexture.g`. Reset sets `uElevationMultiplier=0` (flat) and tweens up on scene enter.
- Fragment shader = the grid frag (§7d) `gl_FragColor = vec4(vColor, vAlpha)`.

TERRAIN VERTEX shader (verbatim):
```glsl
#define M_PI 3.1415926535897932384626433832795

uniform sampler2D uTerrainTexture;
uniform float uElevationMultiplier;
uniform float uElevationNoiseMultiplier;

uniform vec3 uWavePosition;
uniform float uWaveDistance;
uniform float uWaveAmplitude;
uniform float uWaveStrength;

uniform float uDistortionStrength;
uniform float uDistortionProgress;

uniform vec3 uColor;
uniform vec3 uFocusColor;

uniform vec3 uFocusPosition;
uniform vec2 uFocusDistance;
uniform float uFocusMultiplier;

uniform float uEdgeScaleMin;
uniform float uEdgeScale;

uniform float uFloatingFrequency;
uniform float uFloatingAmplitude;

uniform float uTime;

uniform float uAlpha;

attribute vec2 guv;
attribute float noise;
attribute float edgeRandom;
attribute float edgeScafoldingRandom;
attribute vec3 edgeCenter;

varying vec3 vColor;
varying float vAlpha;

float easeSin(float value)
{
    return sin((value - 0.5) * M_PI) * 0.5 + 0.5;
}

void main()
{
    // New position
    vec3 newPosition = position;

    // Edge scale
    float scaleValue = (uEdgeScale - 0.5 * edgeScafoldingRandom) * 2.0; // Apply scafolding
    scaleValue = clamp(scaleValue, 0.0, 1.0); // Clamp
    scaleValue = easeSin(scaleValue); // Ease
    scaleValue *= 1.0 - uEdgeScaleMin;
    scaleValue += uEdgeScaleMin; // Apply min scale

    newPosition += (edgeCenter - newPosition) * vec3(1.0 - scaleValue);

    // Position
    vec4 worldPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 cameraPosition = viewMatrix * worldPosition;

    // Terrain texture
    vec4 terrainTexture = texture2D(uTerrainTexture, guv);

    // Elevation
    float elevation = terrainTexture.r;
    worldPosition.y += elevation * uElevationMultiplier + noise * elevation * uElevationNoiseMultiplier;

    // Wave
    float waveValue = 1.0 - clamp(abs(distance(vec3(worldPosition), vec3(0.0)) - uWaveDistance) / uWaveAmplitude, 0.0, 1.0);
    worldPosition.y += waveValue * uWaveStrength;

    // Distortion
    float distortionValue = (uDistortionProgress - 0.5 * edgeScafoldingRandom) * 2.0; // Apply scafolding
    distortionValue = clamp(distortionValue, 0.0, 1.0); // Clamp
    distortionValue = easeSin(distortionValue); // Ease
    distortionValue *= waveValue; // Apply wave value
    distortionValue *= edgeRandom; // Apply edge random
    worldPosition.y += distortionValue * uDistortionStrength; // Update position

    // Floating
    worldPosition.y += (sin((uTime + 3000000.0) * uFloatingFrequency * edgeRandom + edgeRandom * M_PI * 2.0) * 0.5 + 0.5) * uFloatingAmplitude;

    // Alpha
    vAlpha = terrainTexture.g * uAlpha;

    // Focus
    float focusDistance = distance(vec3(worldPosition), uFocusPosition);
    focusDistance -= uFocusDistance.x;
    focusDistance /= uFocusDistance.y - uFocusDistance.x;
    focusDistance = 1.0 - clamp(focusDistance, 0.0, 1.0);
    focusDistance = smoothstep(0.0, 1.0, focusDistance);

    // Color
    vColor = mix(uColor, uFocusColor, focusDistance * uFocusMultiplier);

    // Return
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
```

### 7b. Model "reveal" line shader (used by every OBJ model)
Class params: `{ color:{x,y,z}, revealPosition:{x,y,z} }`. Material: ShaderMaterial, `AdditiveBlending`, `transparent`, `depthWrite:false`, `LineSegments`. Uniform defaults: `uColor`(Vector3 color), `uRevealPosition`(Vector3), `uRevealDistance`(0, animated up to reveal model), `uAlpha`(1), `uFluctuationFrequency`(0.001), `uFluctuationAmplitude`(40), `uTime`(elapsed).
```glsl
uniform float uTime;

uniform vec3 uColor;

uniform vec3 uRevealPosition;
uniform float uRevealDistance;

uniform float uFluctuationFrequency;
uniform float uFluctuationAmplitude;

varying vec3 vColor;
varying float vAlpha;

void main()
{
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vec4 cameraPosition = viewMatrix * worldPosition;

    // Focus (reveal radius)
    float focusDistance = distance(vec3(position), uRevealPosition);
    focusDistance = step(0.0, focusDistance - uRevealDistance);

    // Fluctuation (per-axis sin shimmer)
    float alphaFluctuation =
        sin(uTime * uFluctuationFrequency + worldPosition.x * uFluctuationAmplitude * 1.0) * 0.5 + 0.5 +
        sin(uTime * uFluctuationFrequency + worldPosition.y * uFluctuationAmplitude * 1.754) * 0.5 + 0.5 +
        sin(uTime * uFluctuationFrequency + worldPosition.z * uFluctuationAmplitude * 0.679) * 0.5 + 0.5
    ;
    alphaFluctuation /= 3.0;
    alphaFluctuation = alphaFluctuation * 0.9 + 0.1;

    vAlpha = focusDistance * alphaFluctuation;
    vColor = uColor;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
```

### 7c. Focus-distance line shader (barrels floor / delimiter variant)
Same idea, fades by distance to a focus point. Used by `barrels-scene-floor` / `delimiter` (scale 0.05; colors `(0.2)` and `(0.7)`; `uFocusDistance` Vector2 e.g. (0,10),(0,8)).
```glsl
uniform vec3 uColor;

uniform vec3 uFocusPosition;
uniform vec2 uFocusDistance;

varying vec3 vColor;
varying float vAlpha;

void main()
{
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vec4 cameraPosition = viewMatrix * worldPosition;

    float focusDistance = distance(vec3(position), uFocusPosition);
    focusDistance -= uFocusDistance.x;
    focusDistance /= uFocusDistance.y - uFocusDistance.x;
    focusDistance = 1.0 - clamp(focusDistance, 0.0, 1.0);

    vAlpha = focusDistance;
    vColor = uColor;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
```

### 7d. Shared line FRAGMENT (terrain, models, floor)
```glsl
uniform sampler2D uGridTexture;   // declared but unused in body

varying vec3 vColor;
varying float vAlpha;

void main()
{
    gl_FragColor = vec4(vColor, vAlpha);
}
```

### 7e. Particles (floating yellow dust)
- **globalParticles**: `THREE.Points`, 1000 verts, positions `x = 20*(rand-0.5)`, `y = 10*rand - 8`, `z = 220*rand - 5`. `frustumCulled=false`. Color **`#FFE600`**, `uWind = -8e-4`, `uAlpha = (home|slider ? 0 : 1)`. Wind drift in x (mod 20), sine bob in y, point size 1.5 distance-attenuated, alpha fades with distance.
  ```glsl
  // vertex (verbatim)
  #define M_PI 3.1415926535897932384626433832795
  uniform float uTime;
  uniform float uWind;
  varying float vAlpha;
  highp float random(vec2 co) {
      highp float a = 12.9898; highp float b = 78.233; highp float c = 43758.5453;
      highp float dt = dot(co.xy, vec2(a, b));
      highp float sn = mod(dt, M_PI);
      return fract(sin(sn) * c);
  }
  void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      modelPosition.x = mod(modelPosition.x + uTime * ((uWind * 0.5) + (uWind * 0.5) * random(modelPosition.yz)), 20.0) - 10.0;
      modelPosition.y = modelPosition.y + sin(modelPosition.x) * 0.3 + modelPosition.y + sin(modelPosition.x * 0.357) * 0.3;
      vec4 viewPosition = viewMatrix * modelPosition;
      float distance = distance(vec4(0.0), viewPosition);
      gl_PointSize = 1.5 - clamp((distance - 12.0) * 1.5, 0.0, 1.5);
      gl_Position = projectionMatrix * viewPosition;
      vAlpha = 1.0 - clamp(distance * 0.5 / 12.0, 0.0, 1.0);
  }
  // fragment
  uniform vec3 uColor; uniform float uAlpha; varying float vAlpha;
  void main() { gl_FragColor = vec4(uColor, vAlpha * uAlpha); }
  ```
- **previousParticles**: `Points`, 3000 verts in a cone/tunnel — `angle = rand*2π`, radius `rand*3`, `z = -80*rand - 5.3`. Color **`#FFE600`**, `uAlpha` 0 on home/slider — these streak past during the zoom/transition.

---

## 8. Interaction & state machine

### Loading sequence
1. Loader loads all OBJ/textures/audio; DOM loader `.stroke` scaleX = `loadedCount / toLoadCount`. Message: *"Loading, please turn on your volume."*
2. On load `end` (step 1): `setEnvironment()` builds renderer/composer/world; then:
   - if route is `home`/`slider` → `world.playLoading()` (terrain reset, camera `protectPreIntro`).
   - if `guided` camera → `setState(focusScene+"Focus", 0)`.
3. `playIntro()`: camera `setState("protectPreIntro",0)` then `setState("protectUnfocus",4, Power4.easeOut)` (4 s fly-in from z≈-80 to z≈-5.8); `rgbOffset` dummy tweens over 4 s. `menuGlitch.showTimeline.progress(1)` snaps menu glitch in.

### HOME → SLIDER
- Home shows hero + "Enter" CTA (router-link → `slider`). Title/desc fade in (~3–3.9 s).
- Home is also **scrollable**: scrolling past a threshold sets `isClosing`, then `setTimeout(()=> $router.push({name:"slider"}), 1000*t)` where `t = scroll.current/1000/5`.

### "Click and hold" — radial / circular menu (primary slide nav)
The wording `"Click and hold"` (`experience.clickHold`) is the instruction for the **circular menu**:
- **Mouse**: `mousedown` on the menu zone → `circularMenu.open()` + listen `mouseup`/`mousemove`. **Hold** to keep it open, **move** the cursor to point at a wedge, **release** (`mouseup`) → `circularMenu.close()` (selection under cursor navigates).
- **Touch**: `touchstart` → open, `touchmove` aims, `touchend` → close.
- There is **no fixed "fill duration"** — opening is immediate on press; the visual is GSAP tweens: cursor color/radius/lineWidth over 0.3 s; wedge `idleProgress 0→1` and radius over 0.6 s `Power3.easeInOut` with `0.035*i` stagger; sections angle to `-amplitude/2`. Closing reverses over 0.5 s, angle → `-π`.
- Yellow ring stroke `rgba(255,230,0,1)`. Plays `pushButton` sound on hotspot hover.

### Other navigation
- **Slider arrows** (prev/next buttons): on change emit `sound.play "transition"` + `experience.changeIndex(index, dir)`; `leftVisible = index>0`, `rightVisible = index<maxLimit-1` (maxLimit = 4).
- **Keyboard**: `→`(39)=next, `←`(37)=previous.
- **Swipe** supported (`setSwipe`).
- **Slider drag cursor** (`mousedown` on `$cursor`, drag) also drives index.
- **Menu trigger** button: if active `$router.go(-1)` else `$router.push({name:"menu"})`.

### Slide transition (camera + decor change + glitch)
On `experience.changeIndex`:
1. `sound.play "transition"` (9-…Chgt DECOR).
2. Camera `setState(sceneName + (isFocus?"Focus":"Unfocus"), 3, Power2.easeInOut)` — 3 s ease between scenes (60 units apart).
3. `rgbOffset` dummy `TweenLite.to(..., 3, Power3.easeInOut)` — aberration focal point glides.
4. **transitionGlitch** pass (`GlitchMaterial`): vertical tile sweep, `uTileAmplitude=3`, `transitionTimeline` animates `uTileProgressVertical` from `-amp/2` to `1+amp/2` over **3 s**, pass auto-disables on complete/reverse.
5. Terrain transition (`setTerrainTransitions`) morphs between terrains.

### Focus / unfocus (entering an experience's hero model)
- `playFocus()`: emits `experience.playFocusStart` (deactivates circular menu, switches rgbOffset to `vector2` mode), `setTimeout(()=> emit "experience.playFocusEnd", 1500)`. Camera → `…Focus` state.
- `quitFocus()`: camera back to `…Unfocus`; emits `experience.quitFocusEnd` (reactivates circular menu).

### Menu glitch reveal (show/hide) — GSAP (`timeScale 0.7`)
- `showTimeline`: enable pass; `uTileProgressHorizontal` 1.1 s (`1+amp/2 → -amp/2`); `uGradientProgress` 0.6 s @0.1; `uBlueProgress` 0.6 s @0.125; `uSaturation` flickers (0.52 s →1.01; 0.1 s →2.5 @0.32; 1.8 s →1 @0.92); `uWhiteTileStrength` 1 s →0.1 @0.3.
- `hideTimeline`: reverses the above over ~1.8 s, then disables pass.
- `uTileOffset=(0.1,0.03)`, `uTileAmplitude=2`, `uGradientAmplitude=0.5`.

### Glitch TITLE reveal (DOM, not WebGL) — `app-animated-text`
Big verb titles ("PROTECT", etc.) use the `app-animated-text` Vue component. Each letter renders stacked copies: `dummy`, `letter-inner red`, `letter-inner green`, `letter-inner yellow`, `letter-inner default`. Each copy gets a per-letter `transition-delay`/`animation-delay = (charCode +k) % steps * (duration/steps)`. Props: `duration:1.6`, `steps:10`, `hoverable`. CSS offsets the red/green/yellow copies → chromatic-aberration / glitch text. Activated by `is-active` class when `active` prop true. (`isTitleVisible` toggles it.)

### In-scene interactions (per experience)
- **protect/barrels**: `window mousedown` → if running + a current reference → run interaction (click barrels to scan; success → `sound.play "valid"` after 500/1500 ms).
- **validate/tank**: drag cursor to reveal discrepancies (tank-error overlay).
- **training/simulation** & **investigate/droning**: `space`/`shift` keys + UI buttons emit `experience.simulation.uiButtonDown` / `experience.droning.uiButtonDown`; success sets `interactions.won` → green color + `valid` sound.

---

## 9. Audio map (Howler)

Two looping ambient tracks autoplay and **crossfade by route** (`$route.meta.soundAmbient`): `default` for home/menu/slider, `under` for the 4 experiences. Master volume tween 0→1 over 1 s on first play; persisted in `localStorage.music`. Triggered via `$eventHub.$emit("sound.play", name)` → `seek(0).play()`.

| key | file | loop | volume | trigger |
|---|---|---|---|---|
| `ambientDefault` | `1-ORANO XP-Boucle musique principale.mp3` | yes (autoplay) | 1 if `soundAmbient=="default"` else 0 | main bg music (home/menu/slider) |
| `ambientUnder` | `2-ORANO XP-Boucle musique light.mp3` | yes (autoplay) | 1 if `soundAmbient=="under"` else 0 | light bg music (inside experiences) |
| `keypoint` | `6-ORANO XP-SD HOTSPOT.mp3` | no | 0.5 | hotspot / keypoint reveal |
| `pushButton` | `4-ORANO XP-SD EXPLORE Loading barre V3.mp3` | no | 0.6 | hover Enter button / hotspot (loading-bar SFX) |
| `click` | `5-ORANO XP-SD EXPLORE Clic.mp3` | no | 0.8 | UI click |
| `valid` | `7-ORANO XP SD Valid.mp3` | no | 1 (default) | interaction success / validation |
| `transition` | `9-ORANO XP-SD Chgt DECOR.mp3` | no | 0.5 | slide change ("decor change") |
| `woosh` | `8-ORANO XP-SD Zoom back home.mp3` | no | 1 (default) | zoom back to home |

`Howler.unload()` on destroy. Loading screen tells user to *"turn on your volume."*

---

## 10. Anything else a builder must know

- **Everything is line art on near-black + additive blending.** The "glow" is purely additive overlap of semi-transparent lines on `#05070F`. No lights, no PBR — all custom `ShaderMaterial`. Replicate with `AdditiveBlending`, `depthWrite:false`, `transparent:true`, line geometry.
- **Models must be line geometry** (OBJ `l` elements / `LineSegments`), not solid meshes. The provided `nanopix-test.obj` and the embedded base64 OBJs (e.g. `topography-*.blend`, `barrels-*.blend`, `simulation-*.blend`) confirm Blender-exported wireframe line meshes. If you only have triangulated OBJs, convert to `EdgesGeometry`/`WireframeGeometry` or `LineSegments`.
- **The single yellow accent (`#FFE600`)** is the brand hook: highlight model per scene (NanoPix / drone), terrain `uFocusColor`, particles, title yellow layer, UI rings. Everything else is grayscale lines.
- **Highlight model per slide**: protect = nanopix camera; investigate = drone (base+rotors); training = simulation `target` (+green on win); validate = AR tablet *screen texture* (no yellow model).
- **Scenes are spatially arranged** (z spacing 60); slide nav is a 3-second camera glide + glitch + aberration retarget, not a hard cut.
- **Two glitch passes** share one material (`menuGlitch` horizontal/amp2 for menu+page transitions; `transitionGlitch` vertical/amp3 for decor changes). Both need the `glitchGradientTexture` color-band image.
- **Chromatic aberration is always on** (`strength 15`, warm `teint`), radially masked so the focal region is sharp and edges split — it tracks the focused model on screen.
- **SMAA only on non-retina** (`devicePixelRatio<=1`); on retina there's no AA pass (pixelRatio capped at 2).
- **Title glitch + button chroma are CSS/DOM**, separate from the WebGL aberration pass — implement both.
- **Mobile** has a separate `portrait` camera-state set and reduced parallax (`*0.25`); circular menu uses touch.
- Camera rig is a 3-level nesting (angles→pan→instance); the `pan` parallax is cursor-driven and subtle (`amplitude ~0.06/0.04`).
- Localization: full FR + EN copy dictionaries are embedded (titles, intros, multi-section body copy, interaction texts, keypoint texts) — see `en_copy.txt`/`en_copy2.txt` in this folder for the complete English copy.
