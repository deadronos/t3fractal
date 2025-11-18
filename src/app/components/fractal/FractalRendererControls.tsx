import { useCallback } from "react";
import type { ReactElement } from "react";

import { Button, Flex, Text } from "@radix-ui/themes";

import type { FractalRendererMode } from "@/lib/fractal/hooks/useFractalRenderer";

type FractalRendererControlsProps = {
  renderMode: FractalRendererMode;
  webglSupported: boolean | null;
  onModeChange: (mode: FractalRendererMode) => void;
};

export default function FractalRendererControls({
  renderMode,
  webglSupported,
  onModeChange,
}: FractalRendererControlsProps): ReactElement {
  const handleCpuClick = useCallback(() => onModeChange("cpu"), [onModeChange]);
  const handleWebglClick = useCallback(() => onModeChange("webgl"), [onModeChange]);

  return (
    <>
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
    </>
  );
}
