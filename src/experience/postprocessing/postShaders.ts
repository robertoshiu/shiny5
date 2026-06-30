// Post-processing GLSL — VERBATIM from SCENE_SPEC.md §6.
// One shared vertex shader (§6a) feeds both the chromatic-aberration pass (§6b)
// and the glitch passes (§6c).

/** Shared post VERTEX shader — SCENE_SPEC §6a. */
export const POST_VERTEX = /* glsl */ `
varying vec2 vUv;

void main()
{
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/** Chromatic aberration — RGBOffsetMaterial FRAGMENT — SCENE_SPEC §6b (verbatim). */
export const RGB_OFFSET_FRAGMENT = /* glsl */ `
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
`;

/** Glitch / transition — GlitchMaterial FRAGMENT — SCENE_SPEC §6c (verbatim). */
export const GLITCH_FRAGMENT = /* glsl */ `
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
`;
