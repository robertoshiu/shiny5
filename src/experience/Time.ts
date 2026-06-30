import EventEmitter from "./utils/EventEmitter";

/**
 * requestAnimationFrame loop. `elapsed` is milliseconds since start (matches the
 * original bundle's uTime convention); `delta` is ms since the last frame.
 * Emits 'tick'.
 */
export default class Time extends EventEmitter {
  start: number;
  current: number;
  elapsed: number;
  delta: number;

  private rafId = 0;

  constructor() {
    super();
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;
    // kick off on next frame so listeners can attach first
    this.rafId = window.requestAnimationFrame(() => this.tick());
  }

  private tick(): void {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.emit("tick");

    this.rafId = window.requestAnimationFrame(() => this.tick());
  }

  destroy(): void {
    window.cancelAnimationFrame(this.rafId);
    this.removeAll();
  }
}
