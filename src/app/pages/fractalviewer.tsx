import { useEffect, useRef } from "react";
import type { ReactElement } from "react";

type ComplexParameter = {
  real: number;
  imaginary: number;
};

type FractalViewerProps = {
  depth: number;
  parameter: ComplexParameter;
  amplifiers: number;
};

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 260;

const clamp = (value: number, lower: number, upper: number): number =>
  Math.max(lower, Math.min(value, upper));

const renderFractal = (
  context: CanvasRenderingContext2D,
  depth: number,
  parameter: ComplexParameter,
  amplifiers: number,
) => {
  const width = context.canvas.width;
  const height = context.canvas.height;
  const maxIterations = Math.floor(40 + depth * 14 + amplifiers * 12);
  const zoom = Math.pow(1.3, depth + amplifiers * 0.5);
  const paletteShift = (depth * 17 + amplifiers * 45) % 360;

  const imageData = context.createImageData(width, height);
  const data = imageData.data;

  let dataIndex = 0;

  for (let py = 0; py < height; py += 1) {
    const imaginaryComponent =
      (py - height / 2) / (0.5 * zoom * height) + parameter.imaginary;

    for (let px = 0; px < width; px += 1) {
      const realComponent =
        (px - width / 2) / (0.5 * zoom * width) + parameter.real;

      let x = 0;
      let y = 0;
      let iteration = 0;

      while (x * x + y * y <= 4 && iteration < maxIterations) {
        const xTemp = x * x - y * y + realComponent;
        y = 2 * x * y + imaginaryComponent;
        x = xTemp;
        iteration += 1;
      }

      const normalised = iteration / maxIterations;
      const hue = (paletteShift + 360 * Math.pow(normalised, 0.6)) % 360;
      const saturation = 70 + Math.sin(depth * 0.4) * 10;
      const lightness = iteration === maxIterations ? 5 : clamp(40 + normalised * 50, 10, 95);

      const [r, g, b] = hslToRgb(hue / 360, saturation / 100, lightness / 100);

      data[dataIndex + 0] = r;
      data[dataIndex + 1] = g;
      data[dataIndex + 2] = b;
      data[dataIndex + 3] = 255;
      dataIndex += 4;
    }
  }

  context.putImageData(imageData, 0, 0);
};

const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  if (s === 0) {
    const value = Math.round(l * 255);
    return [value, value, value];
  }

  const hueToRgb = (p: number, q: number, t: number): number => {
    let temp = t;
    if (temp < 0) {
      temp += 1;
    }
    if (temp > 1) {
      temp -= 1;
    }
    if (temp < 1 / 6) {
      return p + (q - p) * 6 * temp;
    }
    if (temp < 1 / 2) {
      return q;
    }
    if (temp < 2 / 3) {
      return p + (q - p) * (2 / 3 - temp) * 6;
    }
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = hueToRgb(p, q, h + 1 / 3);
  const g = hueToRgb(p, q, h);
  const b = hueToRgb(p, q, h - 1 / 3);

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

export default function FractalViewer({
  depth,
  parameter,
  amplifiers,
}: FractalViewerProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    renderFractal(context, depth, parameter, amplifiers);
  }, [depth, parameter, amplifiers]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="fractal-canvas"
      aria-label="Fractal renderer showing the current zoom level"
    />
  );
}

