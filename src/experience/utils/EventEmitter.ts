/**
 * Minimal typed event emitter used by Sizes ('resize') and Time ('tick').
 * Imperative engine plumbing — not React.
 */
type Listener = (...args: unknown[]) => void;

export default class EventEmitter {
  private listeners = new Map<string, Set<Listener>>();

  on(event: string, callback: Listener): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(callback);
    return () => this.off(event, callback);
  }

  off(event: string, callback: Listener): void {
    this.listeners.get(event)?.delete(callback);
  }

  emit(event: string, ...args: unknown[]): void {
    this.listeners.get(event)?.forEach((callback) => callback(...args));
  }

  removeAll(): void {
    this.listeners.clear();
  }
}
