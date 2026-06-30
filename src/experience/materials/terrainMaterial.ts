import * as THREE from "three";
import { TERRAIN } from "../config";
import terrainVertex from "../shaders/terrain.vert";
import lineFragment from "../shaders/line.frag";

/**
 * Flowing grid terrain material (SCENE_SPEC §7a + §7d).
 * Defaults verbatim from spec: elevation from texture.r, alpha from texture.g,
 * yellow focus tint near uFocusPosition.
 */
export function createTerrainMaterial(texture: THREE.Texture): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: terrainVertex,
    fragmentShader: lineFragment,
    uniforms: {
      uTerrainTexture: { value: texture },
      uElevationMultiplier: { value: 1 },
      uElevationNoiseMultiplier: { value: TERRAIN.elevationNoiseMultiplier },
      uWavePosition: { value: new THREE.Vector3(0, 0, 0) },
      uWaveDistance: { value: 2 },
      uWaveAmplitude: { value: 1 },
      uWaveStrength: { value: 0 },
      uDistortionStrength: { value: 1 },
      uDistortionProgress: { value: 0 },
      uColor: { value: new THREE.Color(TERRAIN.color) },
      uFocusColor: { value: new THREE.Color(TERRAIN.focusColor) },
      uFocusPosition: { value: new THREE.Vector3(0, 0, -5) },
      uFocusDistance: { value: new THREE.Vector2(0, 1) },
      uFocusMultiplier: { value: TERRAIN.focusMultiplier },
      uEdgeScaleMin: { value: 0 },
      uEdgeScale: { value: 1 },
      uFloatingFrequency: { value: 1e-4 },
      uFloatingAmplitude: { value: 0 },
      uTime: { value: 0 },
      uAlpha: { value: 1 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}
