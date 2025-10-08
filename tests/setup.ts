// Vitest setup: polyfills for browser APIs missing in jsdom
// Provide a basic ResizeObserver implementation used by some libraries (Radix use-size)
class SimpleRO {
  observers: Set<Element> = new Set();
  callback: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) {
    this.callback = cb;
  }
  observe(target: Element) {
    this.observers.add(target);
    // immediately call to provide an initial size
    const rect = target.getBoundingClientRect();
    const entry = [{ target, contentRect: rect } as unknown as ResizeObserverEntry];
    Promise.resolve().then(() => this.callback(entry, this as unknown as ResizeObserver));
  }
  unobserve(target: Element) {
    this.observers.delete(target);
  }
  disconnect() {
    this.observers.clear();
  }
}

// @ts-ignore
if (typeof (globalThis as any).ResizeObserver === 'undefined') {
  // @ts-ignore
  (globalThis as any).ResizeObserver = SimpleRO;
}

// provide matchMedia minimal stub used in some libs
if (typeof (globalThis as any).matchMedia === 'undefined') {
  (globalThis as any).matchMedia = (query: string) => ({ matches: false, media: query, addListener: () => {}, removeListener: () => {} });
}
