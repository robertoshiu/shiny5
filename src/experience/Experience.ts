import * as THREE from "three";
import Sizes from "./Sizes";
import Time from "./Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./world/World";
import Navigation from "./Navigation";

/**
 * Vanilla Three.js orchestrator (imperative, not react-three-fiber).
 * Owns Sizes, Time, Scene, Camera, Renderer, World, Navigation and wires the
 * resize / tick loop. Construct with a canvas; call destroy() to tear down.
 *
 * The React chrome drives + observes slide state through `goTo`/`next`/`prev`,
 * the `currentIndex` getter, and the `onChange` callback. enterFocus/exitFocus
 * and openMenu/closeMenu expose the focus + menu transitions.
 */
export default class Experience {
  canvas: HTMLCanvasElement;
  sizes: Sizes;
  time: Time;
  scene: THREE.Scene;
  camera: Camera;
  renderer: Renderer;
  world: World;
  navigation: Navigation;

  /** Fired with the new slide index whenever the active slide changes. */
  onChange: ((index: number) => void) | null = null;

  private offResize: () => void;
  private offTick: () => void;

  constructor(canvas: HTMLCanvasElement) {
    // Disable color management so authored hex colors map 1:1 (matches r95 build).
    THREE.ColorManagement.enabled = false;

    this.canvas = canvas;
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera(this);
    this.renderer = new Renderer(this);
    this.world = new World(this);
    this.navigation = new Navigation(this);

    this.offResize = this.sizes.on("resize", () => this.resize());
    this.offTick = this.time.on("tick", () => this.update());
  }

  /** Active slide index (0..3). */
  get currentIndex(): number {
    return this.navigation.currentIndex;
  }

  goTo(index: number): void {
    this.navigation.goTo(index);
  }

  next(): void {
    this.navigation.next();
  }

  prev(): void {
    this.navigation.prev();
  }

  enterFocus(): void {
    this.navigation.enterFocus();
  }

  exitFocus(): void {
    this.navigation.exitFocus();
  }

  openMenu(): void {
    this.navigation.openMenu();
  }

  closeMenu(): void {
    this.navigation.closeMenu();
  }

  private resize(): void {
    this.camera.resize();
    this.renderer.resize();
  }

  private update(): void {
    this.camera.update();
    this.world.update(this.time.elapsed);
    this.renderer.update();
  }

  destroy(): void {
    this.offResize();
    this.offTick();

    this.navigation.destroy();
    this.world.destroy();
    this.camera.destroy();
    this.renderer.destroy();
    this.time.destroy();
    this.sizes.destroy();

    // Drop any remaining GPU resources reachable from the scene.
    this.scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const material = (mesh as { material?: THREE.Material | THREE.Material[] }).material;
      if (Array.isArray(material)) material.forEach((m) => m.dispose());
      else if (material) material.dispose();
    });
  }
}
