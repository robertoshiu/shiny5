import * as THREE from "three";
import focusDistanceVertex from "../shaders/focusDistance.vert";
import lineFragment from "../shaders/line.frag";

/**
 * Distance-fade line material (SCENE_SPEC §7c + §7d) — barrels floor / delimiter.
 * Not used by Scene 0's hero models, provided for completeness of the shader set.
 */
export function createFocusDistanceMaterial(
  color: THREE.ColorRepresentation,
  focusPosition: THREE.Vector3,
  focusDistance: THREE.Vector2,
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: focusDistanceVertex,
    fragmentShader: lineFragment,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uFocusPosition: { value: focusPosition.clone() },
      uFocusDistance: { value: focusDistance.clone() },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}
