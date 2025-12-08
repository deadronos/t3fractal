/**
 * Vitest setup file for configuring the test environment.
 * Includes polyfills for browser APIs (ResizeObserver, matchMedia) not present in jsdom.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

// Provide a basic ResizeObserver implementation used by some libraries (Radix use-size)
class SimpleRO {
  observers: Set<Element> = new Set<Element>();
  callback: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) {
    this.callback = cb;
  }
  observe(target: Element) {
    this.observers.add(target);
    // immediately call to provide an initial size
    const rect = target.getBoundingClientRect();
    const entry = [{ target, contentRect: rect } as unknown as ResizeObserverEntry];
    void Promise.resolve().then(() => {
      this.callback(entry, this as unknown as ResizeObserver);
    });
  }
  unobserve(target: Element) {
    this.observers.delete(target);
  }
  disconnect() {
    this.observers.clear();
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalAny = globalThis as any;

if (typeof globalAny.ResizeObserver === 'undefined') {
  globalAny.ResizeObserver = SimpleRO;
}

// provide matchMedia minimal stub used in some libs
if (typeof globalAny.matchMedia === 'undefined') {
  globalAny.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    addListener: () => { /* empty */ },
    removeListener: () => { /* empty */ },
  });
}
