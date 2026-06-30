import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { asset } from "@/lib/asset";

// Shared Draco decoder (the equipment GLBs are Draco-compressed). Decoder files
// live in public/draco (copied from three/examples/jsm/libs/draco).
let dracoLoader: DRACOLoader | null = null;
function getDraco(): DRACOLoader {
  if (!dracoLoader) {
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(asset("/draco/"));
  }
  return dracoLoader;
}

export interface GlbEdgesOptions {
  /** EdgesGeometry feature-edge threshold in degrees (lower = more lines). */
  thresholdAngle?: number;
  /** uniform-scale the result so its largest bounding dimension equals this. */
  targetSize?: number;
  /** recenter the merged geometry on the origin. */
  center?: boolean;
}

/**
 * Load a GLB and convert every mesh to feature-edge LINE geometry (THREE.EdgesGeometry),
 * baked into one merged BufferGeometry — so a solid PBR model reads as the same
 * wireframe "construction drawing" line art as the rest of the scene. Materials/
 * textures are discarded; only edges are kept. The result is centered and scaled
 * to a target footprint so it drops into a scene slot regardless of native units.
 */
export async function loadGlbEdges(
  url: string,
  opts: GlbEdgesOptions = {},
): Promise<THREE.BufferGeometry> {
  const { thresholdAngle = 20, targetSize = 14, center = true } = opts;

  const loader = new GLTFLoader();
  loader.setDRACOLoader(getDraco());
  const gltf = await loader.loadAsync(url);
  gltf.scene.updateMatrixWorld(true);

  const positions: number[] = [];
  const v = new THREE.Vector3();
  gltf.scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh && mesh.geometry) {
      const edges = new THREE.EdgesGeometry(mesh.geometry, thresholdAngle);
      const pos = edges.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
        positions.push(v.x, v.y, v.z);
      }
      edges.dispose();
    }
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

  // Normalize: center on origin + uniform scale so max dimension == targetSize.
  geometry.computeBoundingBox();
  const bb = geometry.boundingBox;
  if (bb) {
    const size = new THREE.Vector3();
    const ctr = new THREE.Vector3();
    bb.getSize(size);
    bb.getCenter(ctr);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetSize / maxDim;
    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = center ? pos.getX(i) - ctr.x : pos.getX(i);
      const y = center ? pos.getY(i) - ctr.y : pos.getY(i);
      const z = center ? pos.getZ(i) - ctr.z : pos.getZ(i);
      pos.setXYZ(i, x * scale, y * scale, z * scale);
    }
    pos.needsUpdate = true;
    geometry.computeBoundingBox();
  }

  return geometry;
}
