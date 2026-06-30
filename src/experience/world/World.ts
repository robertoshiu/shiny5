import type Experience from "../Experience";
import Particles from "./Particles";
import BaseScene from "./scenes/BaseScene";
import ProtectScene from "./scenes/ProtectScene";
import ValidateScene from "./scenes/ValidateScene";
import TrainingScene from "./scenes/TrainingScene";
import InvestigateScene from "./scenes/InvestigateScene";

/**
 * Owns the world contents: the 4 slide scenes laid out in a row (each owns its
 * own terrain, offset by index*60 along Z) plus the global floating particles.
 * Only the active scene reveals its models / brightens its terrain.
 * Drives per-tick uniforms (uTime) off Time.elapsed (ms).
 */
export default class World {
  scenes: BaseScene[];
  private particles: Particles;

  constructor(experience: Experience) {
    const { scene } = experience;
    this.scenes = [
      new ProtectScene(scene),
      new ValidateScene(scene),
      new TrainingScene(scene),
      new InvestigateScene(scene),
    ];
    // build() AFTER all constructors so subclass field initialisers (which run
    // after super() under useDefineForClassFields) don't clobber fields set in build().
    for (const slideScene of this.scenes) slideScene.init();
    this.particles = new Particles(scene);

    this.setActiveScene(0);
  }

  setActiveScene(index: number): void {
    this.scenes.forEach((slideScene, i) => slideScene.setActive(i === index));
  }

  update(elapsed: number): void {
    for (const slideScene of this.scenes) slideScene.update(elapsed);
    this.particles.update(elapsed);
  }

  destroy(): void {
    for (const slideScene of this.scenes) slideScene.destroy();
    this.particles.destroy();
  }
}
