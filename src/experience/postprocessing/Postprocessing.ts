import * as THREE from "three";
import gsap from "gsap";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import type Experience from "../Experience";
import type { Vec3 } from "../config";
import { SLIDES, POST } from "../config";
import { createRGBOffsetMaterial } from "./RGBOffsetMaterial";
import { createGlitchMaterial } from "./GlitchMaterial";

/**
 * Composer pipeline (SCENE_SPEC §6):
 *   RenderPass -> [SMAAPass when dpr<=1] -> rgbOffset (always on)
 *              -> menuGlitch (off) -> transitionGlitch (off)
 * EffectComposer auto-routes renderToScreen to the last enabled pass.
 *
 * - rgbOffset's `uRadialDumping.xy` is driven each frame by projecting a 3D focal
 *   dummy (per-slide `rgbFocal`) to screen UV. Navigation tweens the dummy.
 * - transitionGlitch runs the 3 s vertical tile sweep on slide change.
 * - menu glitch + blue tint are approximate (menu is a stub).
 */
export default class Postprocessing {
  composer: EffectComposer;

  private experience: Experience;
  private rgbMaterial: THREE.ShaderMaterial;
  private menuMaterial: THREE.ShaderMaterial;
  private transitionMaterial: THREE.ShaderMaterial;
  private menuPass: ShaderPass;
  private transitionPass: ShaderPass;
  private gradient: THREE.DataTexture;

  // Chromatic-aberration focal point (world space), projected to UV each frame.
  private focalDummy: THREE.Vector3;
  private projected = new THREE.Vector3();

  constructor(experience: Experience, renderer: THREE.WebGLRenderer) {
    this.experience = experience;
    const { sizes, scene, camera } = experience;

    this.composer = new EffectComposer(renderer);
    this.composer.setPixelRatio(sizes.pixelRatio);
    this.composer.setSize(sizes.width, sizes.height);

    this.composer.addPass(new RenderPass(scene, camera.instance));

    // SMAA only on non-retina (SCENE_SPEC §6). Optional — skip if unavailable.
    if (window.devicePixelRatio <= 1) {
      try {
        this.composer.addPass(new SMAAPass());
      } catch {
        /* SMAA textures unavailable — fine, skip AA */
      }
    }

    // (3) Chromatic aberration — always enabled.
    this.rgbMaterial = createRGBOffsetMaterial();
    const rgbPass = new ShaderPass(this.rgbMaterial);
    rgbPass.enabled = true;
    this.composer.addPass(rgbPass);

    // 1x1 transparent gradient — neutralises the glitch gradient term (and its
    // div-by-zero) while keeping a valid sampler bound.
    this.gradient = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1, THREE.RGBAFormat);
    this.gradient.needsUpdate = true;

    // (4) menuGlitch — disabled by default.
    this.menuMaterial = createGlitchMaterial(this.gradient);
    this.menuPass = new ShaderPass(this.menuMaterial);
    this.menuPass.enabled = false;
    this.composer.addPass(this.menuPass);

    // (5) transitionGlitch — disabled by default.
    this.transitionMaterial = createGlitchMaterial(this.gradient);
    this.transitionPass = new ShaderPass(this.transitionMaterial);
    this.transitionPass.enabled = false;
    this.composer.addPass(this.transitionPass);

    this.focalDummy = new THREE.Vector3(...SLIDES[0].rgbFocal);
    this.updateResolution(renderer);
  }

  private updateResolution(renderer: THREE.WebGLRenderer): void {
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    (this.rgbMaterial.uniforms.uResolution.value as THREE.Vector2).copy(size);
  }

  /** Per-frame: refresh glitch time + reproject the aberration focal point. */
  update(): void {
    const elapsed = this.experience.time.elapsed;
    this.menuMaterial.uniforms.uTime.value = elapsed;
    this.transitionMaterial.uniforms.uTime.value = elapsed;

    const cam = this.experience.camera.instance;
    cam.updateWorldMatrix(true, false);
    cam.matrixWorldInverse.copy(cam.matrixWorld).invert();
    this.projected.copy(this.focalDummy).project(cam);

    const rd = this.rgbMaterial.uniforms.uRadialDumping.value as THREE.Vector4;
    rd.x = this.projected.x * 0.5 + 0.5;
    rd.y = this.projected.y * 0.5 + 0.5;
  }

  render(): void {
    this.composer.render();
  }

  /** Glide the aberration focal point to a slide's rgbFocal (SCENE_SPEC §4/§6). */
  setFocal(target: Vec3, duration = 3): void {
    gsap.to(this.focalDummy, {
      x: target[0],
      y: target[1],
      z: target[2],
      duration,
      ease: "power3.inOut",
      overwrite: true,
    });
  }

  /** Decor-change glitch: vertical tile sweep over 3 s, then auto-disable (§8). */
  playTransitionGlitch(): void {
    const u = this.transitionMaterial.uniforms;
    const { tileOffset, tileAmplitude, gradientAmplitude, durationS } = POST.transitionGlitch;
    (u.uTileOffset.value as THREE.Vector2).set(tileOffset[0], tileOffset[1]);
    (u.uTileFrequency.value as THREE.Vector2).set(1, 1);
    u.uTileAmplitude.value = tileAmplitude;
    u.uGradientAmplitude.value = gradientAmplitude || 1; // avoid div-by-zero
    u.uGradientProgress.value = 2;
    u.uSaturation.value = 1;
    u.uBlueAmplitude.value = 1;
    u.uBlueProgress.value = 2; // push blue tint out of [0,1] -> no blue
    u.uWhiteTileChances.value = 1; // avoid 1/0 -> nan
    u.uWhiteTileStrength.value = 0;

    const amp = tileAmplitude;
    this.transitionPass.enabled = true;
    gsap.fromTo(
      u.uTileProgressVertical,
      { value: -amp * 0.5 },
      {
        value: 1 + amp * 0.5,
        duration: durationS,
        ease: "power2.inOut",
        overwrite: true,
        onComplete: () => {
          this.transitionPass.enabled = false;
        },
      },
    );
  }

  /** Menu reveal — approximate horizontal sweep + blue tint (SCENE_SPEC §8). */
  showMenuGlitch(): void {
    const u = this.menuMaterial.uniforms;
    const { tileOffset, tileAmplitude, gradientAmplitude } = POST.menuGlitch;
    (u.uTileOffset.value as THREE.Vector2).set(tileOffset[0], tileOffset[1]);
    (u.uTileFrequency.value as THREE.Vector2).set(1, 1);
    u.uTileAmplitude.value = tileAmplitude;
    u.uGradientAmplitude.value = gradientAmplitude || 1;
    u.uGradientProgress.value = 2;
    u.uSaturation.value = 1;
    u.uBlueAmplitude.value = 1;
    u.uWhiteTileChances.value = 1;
    u.uWhiteTileStrength.value = 0;

    const amp = tileAmplitude;
    this.menuPass.enabled = true;
    gsap.fromTo(
      u.uTileProgressHorizontal,
      { value: 1 + amp * 0.5 },
      { value: -amp * 0.5, duration: 1.1, ease: "power2.inOut", overwrite: true },
    );
    // Blue tint in: uBlueProgress -1 with amplitude 1 saturates blueProgress -> 1.
    gsap.fromTo(u.uBlueProgress, { value: 2 }, { value: -1, duration: 0.8, overwrite: true });
  }

  hideMenuGlitch(): void {
    const u = this.menuMaterial.uniforms;
    gsap.to(u.uBlueProgress, { value: 2, duration: 0.6, overwrite: true });
    gsap.to(u.uTileProgressHorizontal, {
      value: 1 + (u.uTileAmplitude.value as number) * 0.5,
      duration: 0.6,
      overwrite: true,
      onComplete: () => {
        this.menuPass.enabled = false;
      },
    });
  }

  resize(renderer: THREE.WebGLRenderer): void {
    const { sizes } = this.experience;
    this.composer.setPixelRatio(sizes.pixelRatio);
    this.composer.setSize(sizes.width, sizes.height);
    this.updateResolution(renderer);
  }

  destroy(): void {
    gsap.killTweensOf(this.focalDummy);
    this.composer.dispose();
    this.gradient.dispose();
    this.rgbMaterial.dispose();
    this.menuMaterial.dispose();
    this.transitionMaterial.dispose();
  }
}
