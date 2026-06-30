import EventEmitter from "./utils/EventEmitter";
import { WORLD } from "./config";

/** Viewport size + pixel ratio (capped at 2). Emits 'resize'. */
export default class Sizes extends EventEmitter {
  width: number;
  height: number;
  pixelRatio: number;

  private handleResize = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, WORLD.pixelRatioCap);
    this.emit("resize");
  };

  constructor() {
    super();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, WORLD.pixelRatioCap);
    window.addEventListener("resize", this.handleResize);
  }

  destroy(): void {
    window.removeEventListener("resize", this.handleResize);
    this.removeAll();
  }
}
