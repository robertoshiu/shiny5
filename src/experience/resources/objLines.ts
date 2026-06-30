import * as THREE from "three";

/**
 * Custom minimal OBJ -> LineSegments parser (SCENE_SPEC §1 / WEBGL_NOTES).
 * The Orano models contain ONLY `v` (vertices) and `l` (line elements) — no faces.
 * An `l` element may list >2 indices (a polyline); we expand it into consecutive
 * endpoint pairs so it renders as THREE.LineSegments.
 */
export function parseObjLines(text: string): THREE.BufferGeometry {
  const vertices: number[] = []; // flat [x,y,z, x,y,z, ...], 0-indexed by vertex
  const positions: number[] = []; // expanded segment endpoints

  const lines = text.split("\n");
  for (const raw of lines) {
    const line = raw.trim();
    if (line.length === 0) continue;

    if (line[0] === "v" && line[1] === " ") {
      const p = line.split(/\s+/);
      vertices.push(parseFloat(p[1]), parseFloat(p[2]), parseFloat(p[3]));
    } else if (line[0] === "l" && line[1] === " ") {
      const parts = line.split(/\s+/);
      // parts[0] === 'l'; remaining are 1-indexed vertex indices
      for (let i = 1; i < parts.length - 1; i++) {
        const a = parseInt(parts[i], 10) - 1;
        const b = parseInt(parts[i + 1], 10) - 1;
        positions.push(vertices[a * 3], vertices[a * 3 + 1], vertices[a * 3 + 2]);
        positions.push(vertices[b * 3], vertices[b * 3 + 1], vertices[b * 3 + 2]);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

/** Fetch an .obj and return a LineSegments built with the given material. */
export async function loadObjLines(
  url: string,
  material: THREE.Material,
): Promise<THREE.LineSegments> {
  const response = await fetch(url);
  const text = await response.text();
  const geometry = parseObjLines(text);
  return new THREE.LineSegments(geometry, material);
}
