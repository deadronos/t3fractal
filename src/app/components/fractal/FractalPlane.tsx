import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

import { calculateFractalParameters } from "@/lib/fractal/fractalMath";
import type { ComplexParameter, FractalFormula } from "@/lib/fractal/fractalMath";
import type { FractalMaterialInstance } from "@/lib/fractal/shaders";

type FractalPlaneProps = {
  depth: number;
  parameter: ComplexParameter;
  amplifiers: number;
  formula: FractalFormula;
  juliaConstant?: ComplexParameter;
};

export default function FractalPlane({
  depth,
  parameter,
  amplifiers,
  formula,
  juliaConstant,
}: FractalPlaneProps) {
  const materialRef = useRef<FractalMaterialInstance>(null);
  const { size, gl } = useThree();

  const parameters = useMemo(
    () => calculateFractalParameters(depth, amplifiers),
    [amplifiers, depth],
  );

  const constant = juliaConstant ?? parameter;

  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;

    material.uniforms.uCenter.value.set(parameter.real, parameter.imaginary);
    material.uniforms.uFormulaType.value = formula === "julia" ? 1 : 0;
    material.uniforms.uJuliaConstant.value.set(
      constant.real,
      constant.imaginary,
    );
  }, [constant.imaginary, constant.real, formula, parameter.imaginary, parameter.real]);

  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;

    material.uniforms.uMaxIterations.value = parameters.maxIterations;
    material.uniforms.uZoom.value = parameters.zoom;
    material.uniforms.uPaletteShift.value = parameters.paletteShift;
    material.uniforms.uSaturation.value = parameters.saturation;
  }, [parameters]);

  useFrame(() => {
    const material = materialRef.current;
    if (!material) return;

    const dpr = gl.getPixelRatio();
    material.uniforms.uResolution.value.set(
      size.width * dpr,
      size.height * dpr,
    );
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <fractalMaterial ref={materialRef} />
    </mesh>
  );
}
