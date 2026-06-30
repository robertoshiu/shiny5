import * as THREE from "three";
import { COLORS } from "../config";
import particlesVertex from "../shaders/particles.vert";
import particlesFragment from "../shaders/particles.frag";

/**
 * Global floating-dust particle material (SCENE_SPEC §7e).
 * Yellow points, wind drift, additive. `uAlpha` is 1 inside an experience
 * (0 on home/slider in the original).
 */
export function createParticlesMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: particlesVertex,
    fragmentShader: particlesFragment,
    uniforms: {
      uTime: { value: 0 },
      uWind: { value: -8e-4 },
      uColor: { value: new THREE.Color(COLORS.accent) },
      uAlpha: { value: 1 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}
