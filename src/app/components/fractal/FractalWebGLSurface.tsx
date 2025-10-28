import { Canvas } from "@react-three/fiber";

import FractalPlane from "./FractalPlane";
import type { ComplexParameter } from "@/lib/fractal/fractalMath";
import "@/lib/fractal/shaders";

type FractalWebGLSurfaceProps = {
  depth: number;
  parameter: ComplexParameter;
  amplifiers: number;
};

export default function FractalWebGLSurface({
  depth,
  parameter,
  amplifiers,
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
      />
    </Canvas>
  );
}
