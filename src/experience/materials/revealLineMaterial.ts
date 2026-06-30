import * as THREE from "three";
import type { Vec3 } from "../config";
import revealLineVertex from "../shaders/revealLine.vert";
import lineFragment from "../shaders/line.frag";

/**
 * Reveal line material (SCENE_SPEC §7b + §7d) for every OBJ LineSegments model.
 * Additive, transparent, no depth write — pure glow on near-black.
 * `uColor` is a THREE.Color (uploaded as vec3). `uRevealDistance` is animated
 * down to 0 to "draw on" the model.
 */
export function createRevealLineMaterial(
  color: THREE.ColorRepresentation,
  revealPosition: Vec3,
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: revealLineVertex,
    fragmentShader: lineFragment,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uRevealPosition: {
        value: new THREE.Vector3(revealPosition[0], revealPosition[1], revealPosition[2]),
      },
      uRevealDistance: { value: 0 },
      uFluctuationFrequency: { value: 0.001 },
      uFluctuationAmplitude: { value: 40 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}
