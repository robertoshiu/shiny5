import gsap from "gsap";
import type Experience from "./Experience";
import { SLIDES } from "./config";

/**
 * Slide navigation + transitions (SCENE_SPEC §8). Holds the current slide index
 * (0..3) and drives the 3 s camera glide, chromatic-aberration focal retarget,
 * and decor-change glitch on every change. Also exposes focus/menu entry points.
 *
 * Keyboard: ArrowRight = next, ArrowLeft = prev.
 */
export default class Navigation {
  currentIndex = 0;
  private experience: Experience;
  private focused = false;
  private menuOpen = false;

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") this.next();
    else if (event.key === "ArrowLeft") this.prev();
  };

  constructor(experience: Experience) {
    this.experience = experience;
    window.addEventListener("keydown", this.handleKeyDown);
  }

  next(): void {
    this.goTo(this.currentIndex + 1);
  }

  prev(): void {
    this.goTo(this.currentIndex - 1);
  }

  goTo(index: number): void {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, index));
    if (clamped === this.currentIndex) return;

    this.currentIndex = clamped;
    this.focused = false;
    const slide = SLIDES[clamped];
    const { camera, renderer, world } = this.experience;

    // 3 s camera glide to the new slide's overview (Unfocus) state.
    camera.setSceneIndex(clamped);
    camera.setState(`${slide.slug}Unfocus`, 3, "power2.inOut");

    // Aberration focal point glides to the new slide; decor-change glitch fires.
    renderer.post.setFocal(slide.rgbFocal, 3);
    renderer.post.playTransitionGlitch();

    // Reveal the new scene, dim the others.
    world.setActiveScene(clamped);

    this.experience.onChange?.(clamped);
  }

  /** Enter a slide's hero model (camera -> Focus state). */
  enterFocus(): void {
    if (this.focused) return;
    this.focused = true;
    const slide = SLIDES[this.currentIndex];
    this.experience.camera.setState(`${slide.slug}Focus`, 3, "power2.inOut");
  }

  /** Leave focus (camera -> Unfocus state). */
  exitFocus(): void {
    if (!this.focused) return;
    this.focused = false;
    const slide = SLIDES[this.currentIndex];
    this.experience.camera.setState(`${slide.slug}Unfocus`, 3, "power2.inOut");
  }

  /** Approximate menu: glitch + blue tint + gentle camera pull-back (stub). */
  openMenu(): void {
    if (this.menuOpen) return;
    this.menuOpen = true;
    const { camera, renderer } = this.experience;
    renderer.post.showMenuGlitch();
    gsap.to(camera.angles.position, {
      z: camera.angles.position.z - 6,
      duration: 1,
      ease: "power2.inOut",
      overwrite: true,
    });
  }

  closeMenu(): void {
    if (!this.menuOpen) return;
    this.menuOpen = false;
    const { camera, renderer } = this.experience;
    renderer.post.hideMenuGlitch();
    camera.setState(`${SLIDES[this.currentIndex].slug}Unfocus`, 1, "power2.inOut");
  }

  destroy(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
  }
}
