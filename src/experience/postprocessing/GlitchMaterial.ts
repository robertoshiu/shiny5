import * as THREE from "three";
import { POST_VERTEX, GLITCH_FRAGMENT } from "./postShaders";

/**
 * Glitch / decor-transition material (SCENE_SPEC §6c). Tile-displaces + colour-
 * grades tDiffuse. ONE material backs both passes (menuGlitch + transitionGlitch);
 * the controlling code (Postprocessing) sets per-use uniforms and animates the
 * tile-progress sweep. Uniform DEFAULTS here are the verbatim §6c values; the pass
 * is disabled by default so these never reach the screen until operated on.
 *
 * NOTE: several uniforms appear in divisors in the shader (uTileAmplitude,
 * uGradientAmplitude, uBlueAmplitude, uWhiteTileChances). When the pass is
 * enabled, Postprocessing assigns safe non-zero values so no div-by-zero washes
 * the frame.
 */
export function createGlitchMaterial(gradient: THREE.Texture): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: POST_VERTEX,
    fragmentShader: GLITCH_FRAGMENT,
    uniforms: {
      tDiffuse: { value: null },
      tGradient: { value: gradient },
      uTime: { value: 0 },
      uTileProgressVertical: { value: 0 },
      uTileProgressHorizontal: { value: 0 },
      uTileAmplitude: { value: 0 },
      uTileOffset: { value: new THREE.Vector2(0, 0) },
      uTileFrequency: { value: new THREE.Vector2(1, 1) },
      uWaveProgress: { value: 0 },
      uWaveAmplitude: { value: 0 },
      uWaveStrength: { value: new THREE.Vector2(0, 0) },
      uGradientProgress: { value: 0 },
      uGradientOffset: { value: 0 },
      uGradientAmplitude: { value: 0 },
      uBlueProgress: { value: 0 },
      uBlueAmplitude: { value: 0 },
      uSaturation: { value: 0 },
      uWhiteTileChances: { value: 0 },
      uWhiteTileFrequency: { value: 0 },
      uWhiteTileStrength: { value: 0 },
    },
    depthTest: false,
    depthWrite: false,
  });
}
