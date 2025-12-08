/**
 * Custom hook for managing fractal renderer state and canvas sizing.
 */

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Supported rendering modes (CPU or WebGL).
 */
export type FractalRendererMode = "cpu" | "webgl";

/**
 * Options for the useFractalRenderer hook.
 */
export interface UseFractalRendererOptions {
  /** Callback fired when the renderer mode changes. */
  onRendererChange?: (mode: FractalRendererMode) => void;
  /** Initial renderer mode. Defaults to "webgl". */
  defaultMode?: FractalRendererMode;
  /** Initial width of the canvas. Defaults to 360. */
  defaultWidth?: number;
  /** Initial height of the canvas. Defaults to 260. */
  defaultHeight?: number;
}

/**
 * Return value of the useFractalRenderer hook.
 */
export interface UseFractalRendererResult {
  /** Current active rendering mode. */
  renderMode: FractalRendererMode;
  /** Whether WebGL is supported by the browser. Null while checking. */
  webglSupported: boolean | null;
  /** Current size of the container/canvas. */
  size: { width: number; height: number };
  /** Ref to the container element for resizing. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Ref to the canvas element. */
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** Function to manually update the renderer mode. */
  updateRendererMode: (mode: FractalRendererMode) => void;
}

/**
 * Hook to manage fractal renderer mode, WebGL support detection, and canvas sizing.
 *
 * @param options - Configuration options.
 * @returns State and refs for the fractal renderer.
 */
export function useFractalRenderer(
  options: UseFractalRendererOptions = {},
): UseFractalRendererResult {
  const {
    onRendererChange,
    defaultMode = "webgl",
    defaultWidth = 360,
    defaultHeight = 260,
  } = options;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const resizeRef = useRef<ResizeObserver | null>(null);

  const [renderMode, setRenderMode] = useState<FractalRendererMode>(defaultMode);
  const [webglSupported, setWebglSupported] = useState<boolean | null>(true);
  const [size, setSize] = useState({
    width: defaultWidth,
    height: defaultHeight,
  });

  const updateRendererMode = useCallback((mode: FractalRendererMode) => {
    setRenderMode((prev) => {
      if (prev === mode) return prev;
      return mode;
    });
  }, []);

  // Detect WebGL support
  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = document.createElement("canvas");
    const support = Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
    );
    // eslint-disable-next-line
    setWebglSupported(support);
    if (!support) {
      updateRendererMode("cpu");
    }
  }, [updateRendererMode]);

  // Notify parent of renderer changes
  useEffect(() => {
    onRendererChange?.(renderMode);
  }, [onRendererChange, renderMode]);

  // Handle canvas/container resizing
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

    // Fallback for browsers without ResizeObserver
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

  return {
    renderMode,
    webglSupported,
    size,
    containerRef,
    canvasRef,
    updateRendererMode,
  };
}
