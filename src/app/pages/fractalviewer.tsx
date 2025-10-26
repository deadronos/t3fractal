"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";

import { Button, Flex, Text } from "@radix-ui/themes";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import type { ThreeElement } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

import { calculateFractalParameters } from "@/lib/fractal/fractalMath";
import type { ComplexParameter } from "@/lib/fractal/fractalMath";
import { generateWorkerCode } from "@/lib/fractal/workerCodeGenerator";

export type FractalRendererMode = "cpu" | "webgl";

type FractalViewerProps = {
  depth: number;
  parameter: ComplexParameter;
  amplifiers: number;
  onRendererChange?: (mode: FractalRendererMode) => void;
};

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 260;

const FractalMaterial = shaderMaterial(
  {
    uResolution: new THREE.Vector2(1, 1),
    uCenter: new THREE.Vector2(0, 0),
    uZoom: 1,
    uMaxIterations: 100,
    uPaletteShift: 0,
    uSaturation: 0.7,
  },
  /* gl_Position in clip space */
  /* language=GLSL */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  /* language=GLSL */ `
    precision highp float;

    varying vec2 vUv;

    uniform vec2 uResolution;
    uniform vec2 uCenter;
    uniform float uZoom;
    uniform float uMaxIterations;
    uniform float uPaletteShift;
    uniform float uSaturation;

    const int ITERATION_CAP = 1000;

    vec3 hslToRgb(float h, float s, float l) {
      float c = (1.0 - abs(2.0 * l - 1.0)) * s;
      float hp = h * 6.0;
      float x = c * (1.0 - abs(mod(hp, 2.0) - 1.0));
      vec3 rgb = vec3(0.0);

      if (hp < 1.0) rgb = vec3(c, x, 0.0);
      else if (hp < 2.0) rgb = vec3(x, c, 0.0);
      else if (hp < 3.0) rgb = vec3(0.0, c, x);
      else if (hp < 4.0) rgb = vec3(0.0, x, c);
      else if (hp < 5.0) rgb = vec3(x, 0.0, c);
      else rgb = vec3(c, 0.0, x);

      float m = l - 0.5 * c;
      return rgb + vec3(m);
    }

    void main() {
      // Convert UV to centered coordinates with aspect correction
      vec2 uv = vUv * 2.0 - 1.0;
      float aspect = uResolution.x / uResolution.y;
      uv.x *= aspect;

      vec2 c = vec2(
        uCenter.x + uv.x / uZoom,
        uCenter.y + uv.y / uZoom
      );

      vec2 z = vec2(0.0);
      float maxIter = clamp(uMaxIterations, 1.0, float(ITERATION_CAP));
      float iter = maxIter;

      for (int i = 0; i < ITERATION_CAP; i++) {
        if (float(i) >= maxIter) {
          break;
        }

        float x = z.x * z.x - z.y * z.y + c.x;
        float y = 2.0 * z.x * z.y + c.y;
        z = vec2(x, y);

        if (dot(z, z) > 4.0) {
          iter = float(i);
          break;
        }
      }

      if (iter == maxIter) {
        vec3 interior = hslToRgb(mod(uPaletteShift / 360.0, 1.0), uSaturation, 0.05);
        gl_FragColor = vec4(interior, 1.0);
        return;
      }

      float smoothIter = iter;
      float zn = length(z);
      if (zn > 0.0) {
        smoothIter = iter + 1.0 - log(log(zn)) / log(2.0);
      }
      float normalised = smoothIter / maxIter;
      float hue = mod((uPaletteShift + 360.0 * pow(normalised, 0.6)) / 360.0, 1.0);
      float lightness = clamp(0.4 + normalised * 0.5, 0.1, 0.95);
      vec3 color = hslToRgb(hue, clamp(uSaturation, 0.0, 1.0), lightness);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
);
extend({ FractalMaterial });

type FractalMaterialUniforms = {
  uResolution: { value: THREE.Vector2 };
  uCenter: { value: THREE.Vector2 };
  uZoom: { value: number };
  uMaxIterations: { value: number };
  uPaletteShift: { value: number };
  uSaturation: { value: number };
};

type FractalMaterialInstance = InstanceType<typeof FractalMaterial> & {
  uniforms: FractalMaterialUniforms;
};

declare module "@react-three/fiber" {
  interface ThreeElements {
    fractalMaterial: ThreeElement<typeof FractalMaterial>;
  }
}

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const resizeRef = useRef<ResizeObserver | null>(null);
  const [size, setSize] = useState({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  });
  const [renderMode, setRenderMode] = useState<FractalRendererMode>("webgl");
  const [webglSupported, setWebglSupported] = useState<boolean | null>(true);

  const updateRendererMode = useCallback((mode: FractalRendererMode) => {
    setRenderMode((prev) => {
      if (prev === mode) return prev;
      return mode;
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = document.createElement("canvas");
    const support = Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
    );
    setWebglSupported(support);
    if (!support) {
      updateRendererMode("cpu");
    }
  }, [updateRendererMode]);

  useEffect(() => {
    onRendererChange?.(renderMode);
  }, [onRendererChange, renderMode]);

  useEffect(() => {
    const target = containerRef.current ?? canvasRef.current;
    if (!target || typeof window === "undefined") return;

    if (resizeRef.current) resizeRef.current.disconnect();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const cr = entry.contentRect;
        setSize({
          width: Math.max(50, Math.floor(cr.width)),
          height: Math.max(50, Math.floor(cr.height)),
        });
      });
      resizeRef.current = ro;
      ro.observe(target as Element);

      return () => {
        ro.disconnect();
        resizeRef.current = null;
      };
    }

    const updateSize = () => {
      const rect = (target as Element).getBoundingClientRect();
      setSize({
        width: Math.max(50, Math.floor(rect.width)),
        height: Math.max(50, Math.floor(rect.height)),
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

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
  }, [amplifiers, depth, parameter, renderMode, size.height, size.width]);

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
