// Vitest setup: polyfills for browser APIs missing in jsdom
// Provide a basic ResizeObserver implementation used by some libraries (Radix use-size)
function SimpleRO(cb) {
  this.callback = cb;
  this.observers = new Set();
}
SimpleRO.prototype.observe = function (target) {
  this.observers.add(target);
  // immediately call to provide an initial size
  var rect = target.getBoundingClientRect();
  var entry = [{ target: target, contentRect: rect }];
  // use microtask to emulate async nature
  Promise.resolve().then(() => this.callback(entry, this));
};
SimpleRO.prototype.unobserve = function (target) {
  this.observers.delete(target);
};
SimpleRO.prototype.disconnect = function () {
  this.observers.clear();
};

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = SimpleRO;
}

// provide matchMedia minimal stub used in some libs
if (typeof globalThis.matchMedia === 'undefined') {
  globalThis.matchMedia = function (query) {
    return { matches: false, media: query, addListener: function () {}, removeListener: function () {} };
  };
}
