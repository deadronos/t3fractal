"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { ReactElement } from "react";

import { Button, Flex, Text } from "@radix-ui/themes";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

import { calculateFractalParameters } from "@/lib/fractal/fractalMath";
import type { ComplexParameter } from "@/lib/fractal/fractalMath";
import { generateWorkerCode } from "@/lib/fractal/workerCodeGenerator";
import type { FractalMaterialInstance } from "@/lib/fractal/shaders";
import { useFractalRenderer } from "@/lib/fractal/hooks/useFractalRenderer";
import type { FractalRendererMode } from "@/lib/fractal/hooks/useFractalRenderer";
// Import to register the material with react-three-fiber
import "@/lib/fractal/shaders";

export type { FractalRendererMode };

type FractalViewerProps = {
  depth: number;
  parameter: ComplexParameter;
  amplifiers: number;
  onRendererChange?: (mode: FractalRendererMode) => void;
};

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 260;

type FractalPlaneProps = {
  depth: number;
  parameter: ComplexParameter;
  amplifiers: number;
};

function FractalPlane({ depth, parameter, amplifiers }: FractalPlaneProps) {
  const materialRef = useRef<FractalMaterialInstance>(null);
  const { size, gl } = useThree();

  const parameters = useMemo(
    () => calculateFractalParameters(depth, amplifiers),
    [amplifiers, depth],
  );

  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;

    material.uniforms.uCenter.value.set(parameter.real, parameter.imaginary);
  }, [parameter.imaginary, parameter.real]);

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

function FractalWebGLSurface({
  depth,
  parameter,
  amplifiers,
}: FractalPlaneProps) {
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

export default function FractalViewer({
  depth,
  parameter,
  amplifiers,
  onRendererChange,
}: FractalViewerProps): ReactElement {
  const workerRef = useRef<Worker | null>(null);
  
  // Use the fractal renderer hook to manage state and sizing
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

  useEffect(() => {
    if (renderMode !== "cpu") {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    const dpr = Math.max(1, window.devicePixelRatio ?? 1);

    const pixelWidth = Math.max(1, Math.floor(size.width * dpr));
    const pixelHeight = Math.max(1, Math.floor(size.height * dpr));

    if (canvas.width !== pixelWidth) {
      canvas.width = pixelWidth;
    }
    if (canvas.height !== pixelHeight) {
      canvas.height = pixelHeight;
    }
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }

    // Use externalized worker code
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
  }, [
    amplifiers,
    canvasRef,
    depth,
    parameter,
    renderMode,
    size.height,
    size.width,
  ]);

  const handleCpuClick = useCallback(
    () => updateRendererMode("cpu"),
    [updateRendererMode],
  );
  const handleWebglClick = useCallback(
    () => updateRendererMode("webgl"),
    [updateRendererMode],
  );

  return (
    <div className="fractal-viewer">
      <Flex
        className="fractal-renderer-controls"
        justify="between"
        align="center"
      >
        <Text size="2" color="gray">
          Renderer Mode
        </Text>
        <Flex gap="2" className="fractal-renderer-toggle-group">
          <Button
            size="1"
            variant={renderMode === "webgl" ? "solid" : "soft"}
            color={renderMode === "webgl" ? "mint" : "gray"}
            onClick={handleWebglClick}
            disabled={webglSupported === false}
          >
            WebGL
          </Button>
          <Button
            size="1"
            variant={renderMode === "cpu" ? "solid" : "soft"}
            color={renderMode === "cpu" ? "mint" : "gray"}
            onClick={handleCpuClick}
          >
            CPU
          </Button>
        </Flex>
      </Flex>
      {webglSupported === false && (
        <Text size="2" color="tomato" className="fractal-renderer-warning">
          WebGL is not available; falling back to the CPU renderer.
        </Text>
      )}
      <div ref={containerRef} className="fractal-canvas-wrap">
        {renderMode === "webgl" && webglSupported !== false ? (
          <FractalWebGLSurface
            depth={depth}
            parameter={parameter}
            amplifiers={amplifiers}
          />
        ) : (
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="fractal-canvas"
            aria-label="Fractal renderer showing the current zoom level"
          />
        )}
      </div>
    </div>
  );
}
