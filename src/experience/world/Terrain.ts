import * as THREE from "three";
import gsap from "gsap";
import { TERRAIN, type Vec3 } from "../config";
import { createTerrainMaterial } from "../materials/terrainMaterial";

/**
 * Flowing grid-line terrain (SCENE_SPEC §7a). A single THREE.LineSegments grid
 * laid flat (rotation.x = -PI/2) at y = 0. Per-vertex attributes:
 *   guv (0..1 grid uv), noise, edgeRandom, edgeScafoldingRandom, edgeCenter.
 * Elevation comes from terrain-texture.r, alpha from terrain-texture.g, and the
 * focus region tints toward yellow.
 *
 * edgeCenter is set equal to the vertex position so the (unused-at-rest) edge
 * scale-in term resolves to zero — the static look depends only on guv + texture.
 */
const WIDTH = 60;
const DEPTH = 100;
const SEG_X = 80;
const SEG_Z = 140;

function buildTerrainGeometry(): THREE.BufferGeometry {
  const positions: number[] = [];
  const guvs: number[] = [];
  const noises: number[] = [];
  const edgeRandoms: number[] = [];
  const edgeScaffolds: number[] = [];
  const edgeCenters: number[] = [];

  const nodeCount = (SEG_X + 1) * (SEG_Z + 1);
  const nodeNoise = new Float32Array(nodeCount);
  const nodeEdgeRandom = new Float32Array(nodeCount);
  const nodeScaffold = new Float32Array(nodeCount);
  for (let i = 0; i < nodeCount; i++) {
    nodeNoise[i] = Math.random();
    nodeEdgeRandom[i] = Math.random();
    nodeScaffold[i] = Math.random();
  }
  const nodeIndex = (ix: number, iz: number) => iz * (SEG_X + 1) + ix;

  const push = (ix: number, iz: number) => {
    const x = -WIDTH / 2 + (ix / SEG_X) * WIDTH;
    const y = -DEPTH / 2 + (iz / SEG_Z) * DEPTH; // local Y -> world -Z after rotation
    positions.push(x, y, 0);
    guvs.push(ix / SEG_X, iz / SEG_Z);
    const i = nodeIndex(ix, iz);
    noises.push(nodeNoise[i]);
    edgeRandoms.push(nodeEdgeRandom[i]);
    edgeScaffolds.push(nodeScaffold[i]);
    edgeCenters.push(x, y, 0); // == position -> neutralizes edge scale at rest
  };

  // Horizontal grid lines
  for (let iz = 0; iz <= SEG_Z; iz++) {
    for (let ix = 0; ix < SEG_X; ix++) {
      push(ix, iz);
      push(ix + 1, iz);
    }
  }
  // Vertical grid lines
  for (let ix = 0; ix <= SEG_X; ix++) {
    for (let iz = 0; iz < SEG_Z; iz++) {
      push(ix, iz);
      push(ix, iz + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("guv", new THREE.Float32BufferAttribute(guvs, 2));
  geometry.setAttribute("noise", new THREE.Float32BufferAttribute(noises, 1));
  geometry.setAttribute("edgeRandom", new THREE.Float32BufferAttribute(edgeRandoms, 1));
  geometry.setAttribute(
    "edgeScafoldingRandom",
    new THREE.Float32BufferAttribute(edgeScaffolds, 1),
  );
  geometry.setAttribute("edgeCenter", new THREE.Float32BufferAttribute(edgeCenters, 3));
  return geometry;
}

export default class Terrain {
  mesh: THREE.LineSegments;
  private material: THREE.ShaderMaterial;
  private geometry: THREE.BufferGeometry;
  private texture: THREE.Texture;

  constructor(
    scene: THREE.Scene,
    options: { zOffset?: number; focusPosition?: Vec3 } = {},
  ) {
    this.texture = new THREE.TextureLoader().load(TERRAIN.texture);
    this.texture.colorSpace = THREE.NoColorSpace; // r/g are data, not color
    this.material = createTerrainMaterial(this.texture);
    if (options.focusPosition) {
      const f = options.focusPosition;
      (this.material.uniforms.uFocusPosition.value as THREE.Vector3).set(f[0], f[1], f[2]);
    }
    this.geometry = buildTerrainGeometry();

    this.mesh = new THREE.LineSegments(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.set(0, 0, options.zOffset ?? 0);
    this.mesh.frustumCulled = false;
    scene.add(this.mesh);
  }

  /** Fade the terrain in for the focused slide, down for the rest. */
  setActive(active: boolean): void {
    gsap.to(this.material.uniforms.uAlpha, {
      value: active ? 1 : 0.12,
      duration: 1.5,
      ease: "power2.inOut",
      overwrite: true,
    });
  }

  update(elapsed: number): void {
    this.material.uniforms.uTime.value = elapsed;
  }

  destroy(): void {
    this.geometry.dispose();
    this.material.dispose();
    this.texture.dispose();
  }
}
