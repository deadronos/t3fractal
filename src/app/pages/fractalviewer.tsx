"use client";

import type { ReactElement } from "react";

import type { ComplexParameter } from "@/lib/fractal/fractalMath";
import { useFractalRenderer } from "@/lib/fractal/hooks/useFractalRenderer";
import type { FractalRendererMode } from "@/lib/fractal/hooks/useFractalRenderer";

import FractalWebGLSurface from "@/app/components/fractal/FractalWebGLSurface";
import FractalCPUCanvas from "@/app/components/fractal/FractalCPUCanvas";
import FractalRendererControls from "@/app/components/fractal/FractalRendererControls";

export type { FractalRendererMode };

type FractalViewerProps = {
  depth: number;
  parameter: ComplexParameter;
  amplifiers: number;
  onRendererChange?: (mode: FractalRendererMode) => void;
};

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 260;

export default function FractalViewer({
  depth,
  parameter,
  amplifiers,
  onRendererChange,
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
