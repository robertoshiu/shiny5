import * as THREE from "three";
import type Experience from "./Experience";
import Postprocessing from "./postprocessing/Postprocessing";

/**
 * WebGL renderer (SCENE_SPEC §2). alpha + depth, no stencil, near-black clear.
 * Frames are drawn through the EffectComposer (Postprocessing) so chromatic
 * aberration is always applied and the glitch passes can be toggled. Color
 * management is disabled so authored hex colors map 1:1 to the framebuffer,
 * matching the original r95 build (no sRGB output encoding).
 */
export default class Renderer {
  instance: THREE.WebGLRenderer;
  post: Postprocessing;
  private experience: Experience;

  constructor(experience: Experience) {
    this.experience = experience;
    const { canvas, sizes } = experience;

    this.instance = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      stencil: false,
      depth: true,
      antialias: false,
      preserveDrawingBuffer: true, // QA: keep buffer for headless screenshots
    });
    this.instance.sortObjects = true;
    this.instance.setClearColor(0x05070f, 1);
    this.instance.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.instance.setPixelRatio(sizes.pixelRatio);
    this.instance.setSize(sizes.width, sizes.height);

    this.post = new Postprocessing(experience, this.instance);
  }

  resize(): void {
    const { sizes } = this.experience;
    this.instance.setPixelRatio(sizes.pixelRatio);
    this.instance.setSize(sizes.width, sizes.height);
    this.post.resize(this.instance);
  }

  update(): void {
    this.post.update();
    this.post.render();
  }

  destroy(): void {
    this.post.destroy();
    this.instance.dispose();
  }
}
