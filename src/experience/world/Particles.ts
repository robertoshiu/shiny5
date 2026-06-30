import * as THREE from "three";
import { createParticlesMaterial } from "../materials/particlesMaterial";

/**
 * Global floating yellow dust (SCENE_SPEC §7e). 1000 THREE.Points with
 * positions x = 20*(rand-0.5), y = 10*rand - 8, z = 220*rand - 5.
 * Wind drift + sine bob handled in the vertex shader.
 */
const COUNT = 1000;

export default class Particles {
  points: THREE.Points;
  private material: THREE.ShaderMaterial;
  private geometry: THREE.BufferGeometry;

  constructor(scene: THREE.Scene) {
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = 20 * (Math.random() - 0.5);
      positions[i * 3 + 1] = 10 * Math.random() - 8;
      positions[i * 3 + 2] = 220 * Math.random() - 5;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    this.material = createParticlesMaterial();
    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false;
    scene.add(this.points);
  }

  update(elapsed: number): void {
    this.material.uniforms.uTime.value = elapsed;
  }

  destroy(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}
