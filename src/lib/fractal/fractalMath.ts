/**
 * Shared fractal calculation utilities used by both CPU and GPU renderers
 */

export type ComplexParameter = { real: number; imaginary: number };
export type FractalFormula = "mandelbrot" | "julia";

/**
 * Calculate maximum iterations based on depth and amplifiers
 * @param depth - Current fractal depth level
 * @param amplifiers - Number of amplifiers active
 * @returns Maximum number of Mandelbrot iterations to perform
 */
export function calculateMaxIterations(
  depth: number,
  amplifiers: number,
): number {
  return Math.min(1000, Math.floor(40 + depth * 14 + amplifiers * 12));
}

/**
 * Calculate zoom level based on depth and amplifiers
 * @param depth - Current fractal depth level
 * @param amplifiers - Number of amplifiers active
 * @returns Zoom multiplier
 */
export function calculateZoom(depth: number, amplifiers: number): number {
  return Math.pow(1.3, depth + amplifiers * 0.5);
}

/**
 * Calculate palette shift for color cycling
 * @param depth - Current fractal depth level
 * @param amplifiers - Number of amplifiers active
 * @returns Hue shift in degrees (0-360)
 */
export function calculatePaletteShift(
  depth: number,
  amplifiers: number,
): number {
  return (((depth * 17 + amplifiers * 45) % 360) + 360) % 360;
}

/**
 * Calculate saturation based on depth
 * @param depth - Current fractal depth level
 * @returns Saturation value (0-1)
 */
export function calculateSaturation(depth: number): number {
  return Math.min(1, Math.max(0, 0.7 + Math.sin(depth * 0.4) * 0.1));
}

/**
 * Calculate all fractal rendering parameters at once
 * @param depth - Current fractal depth level
 * @param amplifiers - Number of amplifiers active
 * @returns Object containing all calculated parameters
 */
export function calculateFractalParameters(depth: number, amplifiers: number) {
  return {
    maxIterations: calculateMaxIterations(depth, amplifiers),
    zoom: calculateZoom(depth, amplifiers),
    paletteShift: calculatePaletteShift(depth, amplifiers),
    saturation: calculateSaturation(depth),
  };
}
