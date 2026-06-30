import * as THREE from "three";
import { SLIDES } from "../../config";
import { asset } from "@/lib/asset";
import BaseScene from "./BaseScene";

/**
 * Slide 1 — VALIDATE (SCENE_SPEC §4): augmented-reality tablet (TQC2).
 * factory-room + tank are grey env; the tablet body is grey, and its "highlight"
 * is a textured AR screen plane (validate-tablet-screen-1.png) — a translucent
 * Mesh (opacity 0.65) parented to the tablet so it tracks the tablet transform.
 * The dark screen tint is the global clear colour (#05070f) behind it.
 */
export default class ValidateScene extends BaseScene {
  constructor(scene: THREE.Scene) {
    super(scene, SLIDES[1]);
  }

  protected build(): void {
    for (const model of this.slide.models) {
      const loaded = this.addModel(model);
      if (model.file === "tablet") loaded.then((tablet) => this.addScreen(tablet));
    }
  }

  /** AR screen: a plane on the tablet's thinnest face, sized to its bounds. */
  private addScreen(tablet: THREE.LineSegments): void {
    const geometry = tablet.geometry as THREE.BufferGeometry;
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    if (!box) return;

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Sort axes: thinnest = screen normal; the two larger span the screen face.
    const axes = [
      { axis: "x" as const, extent: size.x },
      { axis: "y" as const, extent: size.y },
      { axis: "z" as const, extent: size.z },
    ].sort((a, b) => a.extent - b.extent);
    const normal = axes[0].axis;

    const plane = new THREE.PlaneGeometry(axes[2].extent * 0.86, axes[1].extent * 0.86);
    const texture = new THREE.TextureLoader().load(asset("/assets/images/validate-tablet-screen-1.png"));
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(plane, material);
    mesh.position.copy(center);
    // PlaneGeometry faces +Z by default; aim it along the thinnest axis.
    if (normal === "x") mesh.rotation.y = Math.PI / 2;
    else if (normal === "y") mesh.rotation.x = -Math.PI / 2;

    tablet.add(mesh);
  }
}
