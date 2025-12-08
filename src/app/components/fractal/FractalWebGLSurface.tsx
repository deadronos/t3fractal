import { Canvas } from "@react-three/fiber";

import FractalPlane from "./FractalPlane";
import type { ComplexParameter, FractalFormula } from "@/lib/fractal/fractalMath";
import "@/lib/fractal/shaders";

/**
 * Props for the FractalWebGLSurface component.
 */
type FractalWebGLSurfaceProps = {
  /** Current zoom depth. */
  depth: number;
  /** Center coordinates. */
  parameter: ComplexParameter;
  /** Number of amplifiers. */
  amplifiers: number;
  /** Formula type. */
  formula?: FractalFormula;
  /** Constant for Julia set. */
  juliaConstant?: ComplexParameter;
};

/**
 * A React Three Fiber Canvas wrapper for the fractal plane.
 * Sets up the camera and GL context.
 *
 * @param props - Component props.
 * @returns The Canvas element.
 */
export default function FractalWebGLSurface({
  depth,
  parameter,
  amplifiers,
  formula = "mandelbrot",
  juliaConstant,
}: FractalWebGLSurfaceProps) {
  return (
    <Canvas
      className="fractal-canvas"
      orthographic
      dpr={[1, 2]}
      gl={{ antialias: false }}
      camera={{ position: [0, 0, 1], zoom: 1 }}
    >
      <FractalPlane
        depth={depth}
        parameter={parameter}
        amplifiers={amplifiers}
        formula={formula}
        juliaConstant={juliaConstant}
      />
    </Canvas>
  );
}
