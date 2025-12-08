"use client";

import type { ReactElement } from "react";

import type { ComplexParameter, FractalFormula } from "@/lib/fractal/fractalMath";
import { useFractalRenderer } from "@/lib/fractal/hooks/useFractalRenderer";
import type { FractalRendererMode } from "@/lib/fractal/hooks/useFractalRenderer";

import FractalWebGLSurface from "@/app/components/fractal/FractalWebGLSurface";
import FractalCPUCanvas from "@/app/components/fractal/FractalCPUCanvas";
import FractalRendererControls from "@/app/components/fractal/FractalRendererControls";

export type { FractalRendererMode };

/**
 * Props for the FractalViewer component.
 */
type FractalViewerProps = {
  /** Current zoom depth. */
  depth: number;
  /** Center coordinates. */
  parameter: ComplexParameter;
  /** Number of amplifiers. */
  amplifiers: number;
  /** Callback to change renderer mode. */
  onRendererChange?: (mode: FractalRendererMode) => void;
  /** Formula type (optional, default mandelbrot). */
  formula?: FractalFormula;
  /** Julia constant (optional). */
  juliaConstant?: ComplexParameter;
};

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 260;

/**
 * A composite component that renders the fractal visualization.
 * It manages switching between WebGL and CPU rendering and handles controls.
 *
 * @param props - Component props.
 * @returns The fractal viewer UI.
 */
export default function FractalViewer({
  depth,
  parameter,
  amplifiers,
  onRendererChange,
  formula = "mandelbrot",
  juliaConstant,
}: FractalViewerProps): ReactElement {
  const {
    renderMode,
    webglSupported,
    size,
    containerRef,
    canvasRef,
    updateRendererMode,
  } = useFractalRenderer({
    onRendererChange,
    defaultWidth: CANVAS_WIDTH,
    defaultHeight: CANVAS_HEIGHT,
  });

  const juliaConstantValue = juliaConstant ?? parameter;

  return (
    <div className="fractal-viewer">
      <FractalRendererControls
        renderMode={renderMode}
        webglSupported={webglSupported}
        onModeChange={updateRendererMode}
      />
      <div ref={containerRef} className="fractal-canvas-wrap">
        {renderMode === "webgl" && webglSupported !== false ? (
          <FractalWebGLSurface
            depth={depth}
            parameter={parameter}
            amplifiers={amplifiers}
            formula={formula}
            juliaConstant={juliaConstantValue}
          />
        ) : (
          <>
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="fractal-canvas"
              aria-label="Fractal renderer showing the current zoom level"
            />
            <FractalCPUCanvas
              depth={depth}
              parameter={parameter}
              amplifiers={amplifiers}
              formula={formula}
              juliaConstant={juliaConstantValue}
              canvasRef={canvasRef}
              width={size.width}
              height={size.height}
            />
          </>
        )}
      </div>
    </div>
  );
}
