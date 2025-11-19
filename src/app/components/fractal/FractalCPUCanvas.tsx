import { useEffect, useRef } from "react";

import { generateWorkerCode } from "@/lib/fractal/workerCodeGenerator";
import type { ComplexParameter, FractalFormula } from "@/lib/fractal/fractalMath";

type FractalCPUCanvasProps = {
  depth: number;
  parameter: ComplexParameter;
  amplifiers: number;
  formula: FractalFormula;
  juliaConstant: ComplexParameter;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  width: number;
  height: number;
};

export default function FractalCPUCanvas({
  depth,
  parameter,
  amplifiers,
  formula,
  juliaConstant,
  canvasRef,
  width,
  height,
}: FractalCPUCanvasProps) {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    const dpr = Math.max(1, window.devicePixelRatio ?? 1);

    const pixelWidth = Math.max(1, Math.floor(width * dpr));
    const pixelHeight = Math.max(1, Math.floor(height * dpr));

    if (canvas.width !== pixelWidth) {
      canvas.width = pixelWidth;
    }
    if (canvas.height !== pixelHeight) {
      canvas.height = pixelHeight;
    }
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }

    const workerCode = generateWorkerCode();
    const blob = new Blob([workerCode], { type: "application/javascript" });
    const objectUrl = URL.createObjectURL(blob);
    const worker = new Worker(objectUrl);
    workerRef.current = worker;

    const tileHeight = Math.max(4, Math.floor(8 * dpr));
    const pendingTiles: Array<{ y: number; data: ImageData }> = [];
    let scheduled = false;

    const flushTiles = () => {
      if (!ctx) return;
      scheduled = false;
      for (const tile of pendingTiles.splice(0, pendingTiles.length)) {
        ctx.putImageData(tile.data, 0, tile.y);
      }
    };

    worker.onmessage = (ev) => {
      const msg = ev.data as
        | {
            type: "tile";
            y: number;
            height: number;
            width: number;
            buffer: ArrayBuffer;
          }
        | { type: "done" };
      if (msg.type === "tile") {
        const { y, height: h, width, buffer } = msg;
        const uint = new Uint8ClampedArray(buffer);
        const imageData = new ImageData(uint, width, h);
        pendingTiles.push({ y, data: imageData });
        if (!scheduled) {
          scheduled = true;
          requestAnimationFrame(flushTiles);
        }
      }
    };

    worker.postMessage({
      width: pixelWidth,
      height: pixelHeight,
      depth,
      parameter,
      formula,
      juliaConstant,
      amplifiers,
      tileHeight,
    });

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      URL.revokeObjectURL(objectUrl);
    };
  }, [amplifiers, canvasRef, depth, formula, height, juliaConstant, parameter, width]);

  return null;
}
