import * as THREE from "three";
import { SLIDES } from "../../config";
import BaseScene from "./BaseScene";

/**
 * Slide 2 — TRAINING / SIMULATE (SCENE_SPEC §4): polar-crane simulator.
 * simulator-room + simulator-outside are grey env; simulator-inside is the yellow
 * highlight (the operator cabin interior). Shared BaseScene loader — no extras.
 */
export default class TrainingScene extends BaseScene {
  constructor(scene: THREE.Scene) {
    super(scene, SLIDES[2]);
  }
}
