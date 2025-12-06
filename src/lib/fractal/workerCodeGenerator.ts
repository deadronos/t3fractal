/**
 * Generate worker code string for environments that need Blob URL workers.
 * This is a compatibility layer for Next.js which doesn't support module workers well.
 */

import {
  calculateMaxIterations,
  calculateZoom,
  calculatePaletteShift,
} from "@/lib/fractal/fractalMath";

/**
 * Generate the worker code as a string for Blob URL creation.
 * This allows us to maintain the worker logic in TypeScript while
 * still supporting environments that need inline worker code.
 *
 * @returns The complete source code of the worker as a string.
 */
export function generateWorkerCode(): string {
  // Inline the calculation functions into the worker code
  const maxIterationsCode = calculateMaxIterations.toString();
  const zoomCode = calculateZoom.toString();
  const paletteShiftCode = calculatePaletteShift.toString();

  return `
    // Fractal calculation functions
    const calculateMaxIterations = ${maxIterationsCode};
    const calculateZoom = ${zoomCode};
    const calculatePaletteShift = ${paletteShiftCode};

    function clamp(v, l, u) {
      return Math.max(l, Math.min(v, u));
    }

    function hslToRgb(h, s, l) {
      if (s === 0) {
        const val = Math.round(l * 255);
        return [val, val, val];
      }
      const hueToRgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q-p)*6*t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q-p)*(2/3 - t)*6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      const r = hueToRgb(p, q, h + 1/3);
      const g = hueToRgb(p, q, h);
      const b = hueToRgb(p, q, h - 1/3);
      return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
    }

    self.onmessage = function(e) {
      const { width, height, depth, parameter, amplifiers, tileHeight, formula, juliaConstant } = e.data;
      const maxIterations = calculateMaxIterations(depth, amplifiers);
      const zoom = calculateZoom(depth, amplifiers);
      const paletteShift = calculatePaletteShift(depth, amplifiers);
      const mode = formula || "mandelbrot";
      const centerReal = (parameter && parameter.real) || 0;
      const centerImag = (parameter && parameter.imaginary) || 0;
      const juliaReal = (juliaConstant && juliaConstant.real) || centerReal;
      const juliaImag = (juliaConstant && juliaConstant.imaginary) || centerImag;

      for (let y0 = 0; y0 < height; y0 += tileHeight) {
        const h = Math.min(tileHeight, height - y0);
        const buffer = new Uint8ClampedArray(width * h * 4);
        let di = 0;

        for (let py = y0; py < y0 + h; py++) {
          const imaginaryComponent = (py - height/2) / (0.5 * zoom * height) + centerImag;
          for (let px = 0; px < width; px++) {
            const realComponent = (px - width/2) / (0.5 * zoom * width) + centerReal;
            let x = mode === "julia" ? realComponent : 0;
            let y = mode === "julia" ? imaginaryComponent : 0;
            let iter = 0;
            const cReal = mode === "julia" ? juliaReal : realComponent;
            const cImag = mode === "julia" ? juliaImag : imaginaryComponent;
            while (x*x + y*y <= 4 && iter < maxIterations) {
              const xt = x*x - y*y + cReal;
              y = 2 * x * y + cImag;
              x = xt;
              iter++;
            }
            const normalised = iter / maxIterations;
            const hue = (paletteShift + 360 * Math.pow(normalised, 0.6)) % 360;
            const saturation = 70 + Math.sin(depth * 0.4) * 10;
            const lightness = iter === maxIterations ? 5 : clamp(40 + normalised * 50, 10, 95);
            const [r,g,b] = hslToRgb(hue/360, saturation/100, lightness/100);
            buffer[di++] = r;
            buffer[di++] = g;
            buffer[di++] = b;
            buffer[di++] = 255;
          }
        }
        self.postMessage({ type: 'tile', y: y0, height: h, width: width, buffer: buffer.buffer }, { transfer: [buffer.buffer] });
      }
      self.postMessage({ type: 'done' });
    };
  `;
}
