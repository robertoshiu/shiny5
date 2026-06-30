import * as THREE from "three";
import gsap from "gsap";
import { WORLD, type SlideConfig, type ModelConfig } from "../../config";
import { createRevealLineMaterial } from "../../materials/revealLineMaterial";
import { loadObjLines } from "../../resources/objLines";
import Terrain from "../Terrain";

/** Largest distance from `origin` to any vertex — the model's reveal radius. */
export function maxRevealRadius(geometry: THREE.BufferGeometry, origin: THREE.Vector3): number {
  const position = geometry.getAttribute("position") as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  let max = 0;
  for (let i = 0; i < position.count; i++) {
    v.fromBufferAttribute(position, i);
    const d = v.distanceTo(origin);
    if (d > max) max = d;
  }
  return max;
}

interface ModelEntry {
  material: THREE.ShaderMaterial;
  radius: number;
}

/**
 * Shared slide-scene base (SCENE_SPEC §4). Lays out one experience:
 *   group (row offset, +index*60 on Z) -> container (slide transform) -> models.
 * Every model is LineSegments with a reveal material; the active scene "draws on"
 * its models (uRevealDistance -> 0), inactive scenes stay hidden. Each scene owns
 * its own flowing terrain at the same row offset.
 *
 * Subclasses override build() for scene-specific content (validate AR screen,
 * investigate topography + drone rig). They must NOT use initialised class fields
 * (build() runs from this constructor before subclass field initialisers); declare
 * with `!` and assign inside build().
 */
export default class BaseScene {
  slide: SlideConfig;
  group: THREE.Group; // outer, anchored at the row offset along +Z
  container: THREE.Group; // inner, holds the slide's own transform
  terrain: Terrain;

  protected scene: THREE.Scene;
  protected materials: THREE.ShaderMaterial[] = [];
  protected entries: ModelEntry[] = [];
  protected spinning: { object: THREE.Object3D; axis: "x" | "y" | "z"; speed: number }[] = [];
  protected active = false;

  constructor(scene: THREE.Scene, slide: SlideConfig) {
    this.scene = scene;
    this.slide = slide;

    const zOffset = slide.index * WORLD.distanceBetween;

    this.group = new THREE.Group();
    this.group.position.z = zOffset;
    scene.add(this.group);

    this.container = new THREE.Group();
    const { position, rotation, scale } = slide.container;
    this.container.position.set(position[0], position[1], position[2]);
    this.container.rotation.set(rotation[0], rotation[1], rotation[2]);
    this.container.scale.setScalar(scale);
    this.group.add(this.container);

    this.terrain = new Terrain(scene, { zOffset, focusPosition: slide.rgbFocal });
  }

  /**
   * Build scene content. Called by World AFTER construction so that subclass
   * field initialisers (which run after super() under useDefineForClassFields)
   * have completed and won't clobber fields assigned here.
   */
  init(): void {
    this.build();
  }

  /** Default: load every model from the slide config. */
  protected build(): void {
    for (const model of this.slide.models) this.addModel(model);
  }

  /** Load one OBJ as LineSegments with a reveal material; wire reveal + spin. */
  protected addModel(model: ModelConfig, parent?: THREE.Object3D): Promise<THREE.LineSegments> {
    const reveal = model.reveal ?? [0, 0, 0];
    const material = createRevealLineMaterial(model.color, reveal);
    this.materials.push(material);

    return loadObjLines(`/assets/models/${model.file}.obj`, material).then((lines) => {
      (parent ?? this.container).add(lines);

      const origin = new THREE.Vector3(reveal[0], reveal[1], reveal[2]);
      const radius = maxRevealRadius(lines.geometry as THREE.BufferGeometry, origin);
      const entry: ModelEntry = { material, radius };
      this.entries.push(entry);
      this.applyReveal(entry, this.entries.length - 1);

      if (model.spin) {
        this.spinning.push({ object: lines, axis: model.spin.axis, speed: model.spin.speed });
      }
      return lines;
    });
  }

  /** Reveal the model on when active, hide it when inactive. */
  private applyReveal(entry: ModelEntry, index: number): void {
    gsap.killTweensOf(entry.material.uniforms.uRevealDistance);
    if (this.active) {
      gsap.fromTo(
        entry.material.uniforms.uRevealDistance,
        { value: entry.radius },
        { value: 0, duration: 1.8, ease: "power2.out", delay: 0.12 * index },
      );
    } else {
      entry.material.uniforms.uRevealDistance.value = entry.radius;
    }
  }

  /** World tells the scene whether it is the focused slide. */
  setActive(active: boolean): void {
    this.active = active;
    this.entries.forEach((entry, i) => this.applyReveal(entry, i));
    this.terrain.setActive(active);
  }

  update(elapsed: number): void {
    for (const material of this.materials) material.uniforms.uTime.value = elapsed;
    for (const s of this.spinning) s.object.rotation[s.axis] = s.speed * elapsed;
    this.terrain.update(elapsed);
  }

  destroy(): void {
    this.group.traverse((child) => {
      if (child instanceof THREE.LineSegments || child instanceof THREE.Mesh) {
        child.geometry.dispose();
      }
    });
    for (const material of this.materials) material.dispose();
    this.terrain.destroy();
  }
}
