import { Canvas } from "@react-three/fiber";

import FractalPlane from "./FractalPlane";
import type { ComplexParameter, FractalFormula } from "@/lib/fractal/fractalMath";
import "@/lib/fractal/shaders";

type FractalWebGLSurfaceProps = {
  depth: number;
  parameter: ComplexParameter;
  amplifiers: number;
  formula?: FractalFormula;
  juliaConstant?: ComplexParameter;
};

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
