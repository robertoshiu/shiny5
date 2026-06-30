import * as THREE from "three";
import gsap from "gsap";
import type Experience from "./Experience";
import { SLIDES, WORLD, type CameraState } from "./config";

/**
 * 3-level camera rig (SCENE_SPEC §3):
 *   angles.container (Group, keyframed state) -> pan.container (Group, cursor
 *   parallax) -> instance (PerspectiveCamera).
 * `setState` tweens the angles container's position + rotation with GSAP.
 * States are read from SLIDES[i].camera (unfocus/focus). Starts at protectUnfocus.
 */
export default class Camera {
  instance: THREE.PerspectiveCamera;
  angles: THREE.Group; // keyframed state transform
  pan: THREE.Group; // cursor parallax

  private experience: Experience;
  private states: Record<string, CameraState> = {};
  private panAmplitude: [number, number] = [0, 0];
  private cursor = new THREE.Vector2(0, 0);
  /** Row offset (= index*60) added to every state's Z so the rig follows the
   * active scene down the line of slides. Set via setSceneIndex on navigation. */
  private sceneOffsetZ = 0;

  private handleMouseMove = (event: MouseEvent) => {
    const { sizes } = this.experience;
    this.cursor.x = (event.clientX / sizes.width - 0.5) * 2;
    this.cursor.y = (event.clientY / sizes.height - 0.5) * 2;
  };

  constructor(experience: Experience) {
    this.experience = experience;
    const { sizes, scene } = experience;

    this.instance = new THREE.PerspectiveCamera(
      WORLD.camera.fov,
      sizes.width / sizes.height,
      WORLD.camera.near,
      WORLD.camera.far,
    );

    this.angles = new THREE.Group();
    // Yaw-then-pitch order: with a ~180° yaw the default XYZ order inverts pitch,
    // so a negative rot.x looked up instead of down. YXZ keeps pitch relative to yaw.
    this.angles.rotation.order = "YXZ";
    this.pan = new THREE.Group();
    this.angles.add(this.pan);
    this.pan.add(this.instance);
    scene.add(this.angles);

    // Register every slide's unfocus/focus states, e.g. "protectUnfocus".
    for (const slide of SLIDES) {
      this.states[`${slide.slug}Unfocus`] = slide.camera.unfocus;
      this.states[`${slide.slug}Focus`] = slide.camera.focus;
    }

    this.setState("protectUnfocus", 0);
    window.addEventListener("mousemove", this.handleMouseMove);
  }

  /** Move the rig's base Z to the given slide's row (index * WORLD.distanceBetween). */
  setSceneIndex(index: number): void {
    this.sceneOffsetZ = index * WORLD.distanceBetween;
  }

  setState(name: string, duration = 3, ease = "power2.inOut"): void {
    const state = this.states[name];
    if (!state) return;

    this.panAmplitude = state.pan;
    const targetZ = state.pos[2] + this.sceneOffsetZ;

    if (duration === 0) {
      this.angles.position.set(state.pos[0], state.pos[1], targetZ);
      this.angles.rotation.set(state.rot[0], state.rot[1], state.rot[2]);
      return;
    }

    gsap.to(this.angles.position, {
      x: state.pos[0],
      y: state.pos[1],
      z: targetZ,
      duration,
      ease,
      overwrite: true,
    });
    gsap.to(this.angles.rotation, {
      x: state.rot[0],
      y: state.rot[1],
      z: state.rot[2],
      duration,
      ease,
      overwrite: true,
    });
  }

  update(): void {
    // Cursor parallax on the pan container, eased toward target.
    const targetX = this.cursor.x * this.panAmplitude[0];
    const targetY = -this.cursor.y * this.panAmplitude[1];
    this.pan.position.x += (targetX - this.pan.position.x) * 0.1;
    this.pan.position.y += (targetY - this.pan.position.y) * 0.1;
  }

  resize(): void {
    const { sizes } = this.experience;
    this.instance.aspect = sizes.width / sizes.height;
    this.instance.updateProjectionMatrix();
  }

  destroy(): void {
    window.removeEventListener("mousemove", this.handleMouseMove);
    gsap.killTweensOf(this.angles.position);
    gsap.killTweensOf(this.angles.rotation);
  }
}
