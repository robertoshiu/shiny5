// Terrain grid VERTEX shader — VERBATIM from SCENE_SPEC.md §7a.
// Used by world/Terrain.ts via materials/terrainMaterial.ts.
const terrainVertex = /* glsl */ `
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
`;

export default terrainVertex;
