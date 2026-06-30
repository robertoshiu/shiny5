import * as THREE from "three";
import { SLIDES, COLORS } from "../../config";
import BaseScene from "./BaseScene";

/**
 * Slide 3 — INVESTIGATE (SCENE_SPEC §4): mining drone over topography.
 * The drone (base + main rotor + back rotor) is the yellow highlight and sits
 * under a swaying Object3D (slow sine bob). The main rotor spins on Y, the back
 * rotor on Z. The terrain is mapped by 4 stacked topography contour layers
 * (config lists layer 1; layers 2-4 are added here).
 */
export default class InvestigateScene extends BaseScene {
  private swaying!: THREE.Object3D;

  constructor(scene: THREE.Scene) {
    super(scene, SLIDES[3]);
  }

  protected build(): void {
    this.swaying = new THREE.Object3D();
    this.container.add(this.swaying);

    // Config models: drone parts ride the swaying rig; topography stays grounded.
    for (const model of this.slide.models) {
      const parent = model.file.startsWith("drone") ? this.swaying : this.container;
      this.addModel(model, parent);
    }

    // Extra topography contour layers (config only declares layer 1).
    for (let i = 2; i <= 4; i++) {
      this.addModel({ file: `topography-${i}`, color: COLORS.grey18, role: "env" }, this.container);
    }

    // Back rotor reuses drone-rotor.obj: offset on X, spins on Z.
    this.addModel(
      { file: "drone-rotor", color: COLORS.accent, role: "highlight", spin: { axis: "z", speed: 0.02 } },
      this.swaying,
    ).then((rotor) => rotor.position.set(-9.28, 0, -0.4));
  }

  update(elapsed: number): void {
    if (!this.swaying) {
      super.update(elapsed);
      return;
    }
    const t = elapsed;
    this.swaying.rotation.x = 0.02 * Math.sin(2e-4 * t);
    this.swaying.rotation.z = 0.005 * Math.sin(6.78e-4 * t);
    this.swaying.position.x = 0.2 * Math.sin(2.3e-4 * t);
    this.swaying.position.z = 0.5 * Math.sin(7.78e-4 * t);
    this.swaying.position.y = 0.3 * Math.sin(5.78e-4 * t);
    super.update(elapsed);
  }
}
