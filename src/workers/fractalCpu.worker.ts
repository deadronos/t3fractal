/**
 * CPU-based Mandelbrot fractal renderer worker
 * Performs tile-based rendering to avoid blocking the main thread
 */

import {
  calculateMaxIterations,
  calculateZoom,
  calculatePaletteShift,
  type ComplexParameter,
} from "@/lib/fractal/fractalMath";

export type { ComplexParameter };

export type WorkerRequest = {
  width: number;
  height: number;
  depth: number;
  parameter: ComplexParameter;
  amplifiers: number;
  tileHeight: number;
};

export type TileMessage = {
  type: "tile";
  y: number;
  height: number;
  width: number;
  buffer: ArrayBuffer;
};

export type DoneMessage = {
  type: "done";
};

export type WorkerResponse = TileMessage | DoneMessage;

/**
 * Clamp a value between lower and upper bounds
 */
function clamp(v: number, l: number, u: number): number {
  return Math.max(l, Math.min(v, u));
}

/**
 * Convert HSL color to RGB
 * @param h - Hue (0-1)
 * @param s - Saturation (0-1)
 * @param l - Lightness (0-1)
 * @returns RGB array [r, g, b] with values 0-255
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const val = Math.round(l * 255);
    return [val, val, val];
  }

  const hueToRgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hueToRgb(p, q, h + 1 / 3);
  const g = hueToRgb(p, q, h);
  const b = hueToRgb(p, q, h - 1 / 3);
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Worker message handler
 */
self.onmessage = function (e: MessageEvent<WorkerRequest>) {
  const { width, height, depth, parameter, amplifiers, tileHeight } = e.data;
  const maxIterations = calculateMaxIterations(depth, amplifiers);
  const zoom = calculateZoom(depth, amplifiers);
  const paletteShift = calculatePaletteShift(depth, amplifiers);

  // Render tiles to avoid blocking for too long
  for (let y0 = 0; y0 < height; y0 += tileHeight) {
    const h = Math.min(tileHeight, height - y0);
    const buffer = new Uint8ClampedArray(width * h * 4);
    let di = 0;

    for (let py = y0; py < y0 + h; py++) {
      const imaginaryComponent =
        (py - height / 2) / (0.5 * zoom * height) + parameter.imaginary;

      for (let px = 0; px < width; px++) {
        const realComponent =
          (px - width / 2) / (0.5 * zoom * width) + parameter.real;
        let x = 0,
          y = 0,
          iter = 0;

        // Mandelbrot iteration
        while (x * x + y * y <= 4 && iter < maxIterations) {
          const xt = x * x - y * y + realComponent;
          y = 2 * x * y + imaginaryComponent;
          x = xt;
          iter++;
        }

        // Calculate color
        const normalised = iter / maxIterations;
        const hue = (paletteShift + 360 * Math.pow(normalised, 0.6)) % 360;
        const saturation = 70 + Math.sin(depth * 0.4) * 10;
        const lightness =
          iter === maxIterations
            ? 5
            : clamp(40 + normalised * 50, 10, 95);
        const [r, g, b] = hslToRgb(hue / 360, saturation / 100, lightness / 100);

        buffer[di++] = r;
        buffer[di++] = g;
        buffer[di++] = b;
        buffer[di++] = 255;
      }
    }

    // Send tile back to main thread
    const tileMessage: TileMessage = {
      type: "tile",
      y: y0,
      height: h,
      width: width,
      buffer: buffer.buffer,
    };
    self.postMessage(tileMessage, { transfer: [buffer.buffer] });
  }

  // Signal completion
  const doneMessage: DoneMessage = { type: "done" };
  self.postMessage(doneMessage);
};
