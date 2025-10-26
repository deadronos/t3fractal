/**
 * Custom hook for managing fractal renderer state and canvas sizing
 */

import { useCallback, useEffect, useRef, useState } from "react";

export type FractalRendererMode = "cpu" | "webgl";

export interface UseFractalRendererOptions {
  onRendererChange?: (mode: FractalRendererMode) => void;
  defaultMode?: FractalRendererMode;
  defaultWidth?: number;
  defaultHeight?: number;
}

export interface UseFractalRendererResult {
  renderMode: FractalRendererMode;
  webglSupported: boolean | null;
  size: { width: number; height: number };
  containerRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  updateRendererMode: (mode: FractalRendererMode) => void;
}

/**
 * Hook to manage fractal renderer mode, WebGL support detection, and canvas sizing
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
