import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";

type ComplexParameter = { real: number; imaginary: number };

type FractalViewerProps = { depth: number; parameter: ComplexParameter; amplifiers: number };

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 260;

export default function FractalViewer({ depth, parameter, amplifiers }: FractalViewerProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const resizeRef = useRef<ResizeObserver | null>(null);
  const [size, setSize] = useState({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });

  useEffect(() => {
    // Observe the container (pure-CSS alignment). The container width is
    // governed by the card layout, separator and other content, so observing
    // it ensures the canvas aligns visually with the separator and flex
    // content above.
    const target = containerRef.current ?? canvasRef.current;
    if (!target || typeof window === "undefined") return;

    if (resizeRef.current) resizeRef.current.disconnect();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const cr = entry.contentRect;
        setSize({ width: Math.max(50, Math.floor(cr.width)), height: Math.max(50, Math.floor(cr.height)) });
      });
      resizeRef.current = ro;
      ro.observe(target as Element);

      return () => {
        ro.disconnect();
        resizeRef.current = null;
      };
    }

    // Fallback: measure via getBoundingClientRect and listen for window resize
    const updateSize = () => {
      const rect = (target as Element).getBoundingClientRect();
      setSize({ width: Math.max(50, Math.floor(rect.width)), height: Math.max(50, Math.floor(rect.height)) });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    // compute pixel size based on CSS size and DPR
    const pixelWidth = Math.max(1, Math.floor(size.width * dpr));
    const pixelHeight = Math.max(1, Math.floor(size.height * dpr));

    // set canvas pixel dimensions and CSS size
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // terminate previous worker if any
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const workerCode = `
      self.onmessage = function(e) {
        const { width, height, depth, parameter, amplifiers, tileHeight } = e.data;
        const maxIterations = Math.floor(40 + depth * 14 + amplifiers * 12);
        const zoom = Math.pow(1.3, depth + amplifiers * 0.5);
        const paletteShift = (depth * 17 + amplifiers * 45) % 360;

        const clamp = (v, l, u) => Math.max(l, Math.min(v, u));
        const hslToRgb = (h, s, l) => {
          if (s === 0) { const val = Math.round(l * 255); return [val,val,val]; }
          const hueToRgb = (p,q,t) => {
            if (t < 0) t += 1; if (t > 1) t -= 1;
            if (t < 1/6) return p + (q-p)*6*t; if (t < 1/2) return q; if (t < 2/3) return p + (q-p)*(2/3 - t)*6; return p;
          };
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          const r = hueToRgb(p,q,h + 1/3);
          const g = hueToRgb(p,q,h);
          const b = hueToRgb(p,q,h - 1/3);
          return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
        };

        for (let y0 = 0; y0 < height; y0 += tileHeight) {
          const h = Math.min(tileHeight, height - y0);
          const buffer = new Uint8ClampedArray(width * h * 4);
          let di = 0;
          for (let py = y0; py < y0 + h; py++) {
            const imaginaryComponent = (py - height/2) / (0.5 * zoom * height) + parameter.imaginary;
            for (let px = 0; px < width; px++) {
              const realComponent = (px - width/2) / (0.5 * zoom * width) + parameter.real;
              let x = 0, y = 0, iter = 0;
              while (x*x + y*y <= 4 && iter < maxIterations) {
                const xt = x*x - y*y + realComponent;
                y = 2 * x * y + imaginaryComponent;
                x = xt; iter++;
              }
              const normalised = iter / maxIterations;
              const hue = (paletteShift + 360 * Math.pow(normalised, 0.6)) % 360;
              const saturation = 70 + Math.sin(depth * 0.4) * 10;
              const lightness = iter === maxIterations ? 5 : clamp(40 + normalised * 50, 10, 95);
              const [r,g,b] = hslToRgb(hue/360, saturation/100, lightness/100);
              buffer[di++] = r; buffer[di++] = g; buffer[di++] = b; buffer[di++] = 255;
            }
          }
          self.postMessage({ type: 'tile', y: y0, height: h, width: width, buffer: buffer.buffer }, [buffer.buffer]);
        }
        self.postMessage({ type: 'done' });
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    workerRef.current = worker;

    const tileHeight = Math.max(4, Math.floor(8 * dpr));

    worker.onmessage = (ev: MessageEvent) => {
      const msg = ev.data as
        | { type: 'tile'; y: number; height: number; width: number; buffer: ArrayBuffer }
        | { type: 'done' };
      if (msg.type === 'tile') {
        const { y, height: h, width, buffer } = msg;
        requestAnimationFrame(() => {
          try {
            const uint = new Uint8ClampedArray(buffer);
            const imageData = new ImageData(uint, width, h);
            // draw using pixel coordinates (worker produced DPR-scaled pixels)
            ctx.putImageData(imageData, 0, y);
          } catch {
            // ignore
          }
        });
      }
    };

    // start rendering with pixel dimensions
    worker.postMessage({ width: pixelWidth, height: pixelHeight, depth, parameter, amplifiers, tileHeight });

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [depth, parameter, amplifiers, size]);

  return (
    <div ref={containerRef} className="fractal-canvas-wrap">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="fractal-canvas"
        aria-label="Fractal renderer showing the current zoom level"
      />
    </div>
  );
}

