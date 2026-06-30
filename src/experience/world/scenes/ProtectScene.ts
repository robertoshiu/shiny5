import * as THREE from "three";
import { SLIDES } from "../../config";
import BaseScene from "./BaseScene";

/**
 * Slide 0 — PROTECT (SCENE_SPEC §4): NanoPix gamma camera (yellow highlight),
 * rover (grey env) and factory silhouette. Uses the shared BaseScene loader —
 * no scene-specific extras.
 */
export default class ProtectScene extends BaseScene {
  constructor(scene: THREE.Scene) {
    super(scene, SLIDES[0]);
  }
}
