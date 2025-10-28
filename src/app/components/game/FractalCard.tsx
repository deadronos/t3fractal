import type { ReactElement } from "react";
import { Box, Button, Card, Flex, Grid, Heading, Separator, Slider, Text } from "@radix-ui/themes";

import FractalViewer, { type FractalRendererMode } from "@/app/pages/fractalviewer";
import type { ComplexParameter } from "@/store/gameStore";
import { formatNumber } from "@/lib/gameplay/formatters";

type FractalCardProps = {
  depth: number;
  complexParameter: ComplexParameter;
  amplifiers: number;
  zoneBonus: number;
  zoomCost: number;
  passiveDepthGain: number;
  dimensionalEfficiency: string;
  rendererMode: FractalRendererMode;
  onRendererChange: (mode: FractalRendererMode) => void;
  onZoomDeeper: () => void;
  onZoomOut: () => void;
  onParameterChange: (changes: Partial<ComplexParameter>) => void;
};

export default function FractalCard({
  depth,
  complexParameter,
  amplifiers,
  zoneBonus,
  zoomCost,
  passiveDepthGain,
  dimensionalEfficiency,
  rendererMode,
  onRendererChange,
  onZoomDeeper,
  onZoomOut,
  onParameterChange,
}: FractalCardProps): ReactElement {
  return (
    <Card className="fractal-card">
      <Flex justify="between" align="center" mb="3">
        <Heading size="4">
          Fractal Frontier {rendererMode === "webgl" ? "WebGL" : "CPU"}
        </Heading>
        <Text size="2" color="mint">
          Zone bonus: +{Math.round((zoneBonus - 1) * 100)}%
        </Text>
      </Flex>
      <FractalViewer
        depth={depth}
        parameter={complexParameter}
        amplifiers={amplifiers}
        onRendererChange={onRendererChange}
      />
      <Separator my="3" size="4" />
      <Grid columns={{ initial: "1", sm: "2" }} gap="4">
        <Card className="control-card">
          <Heading size="3">Manual Navigation</Heading>
          <Text color="gray" size="2" mb="3">
            Each zoom consumes Fractal Data but reveals exponentially
            richer structures.
          </Text>
          <Flex gap="3" mb="3" wrap="wrap">
            <Button onClick={onZoomDeeper} color="green">
              Zoom Deeper (Cost: {formatNumber(zoomCost)})
            </Button>
            <Button onClick={onZoomOut} variant="soft" color="gray">
              Ease Out
            </Button>
          </Flex>
          <Text size="2" color="gray">
            Passive stabilisers add {passiveDepthGain.toFixed(2)} depth /
            sec when active.
          </Text>
        </Card>
        <Card className="control-card">
          <Heading size="3">Complex Parameter Tuning</Heading>
          <Text size="2" color="gray">
            Align with the sweet spot (c = -0.75 + 0.11i) to maximise
            efficiency.
          </Text>
          <Box className="slider-group">
            <Text weight="medium">
              Real: {complexParameter.real.toFixed(2)}
            </Text>
            <Slider
              min={-2}
              max={1}
              step={0.01}
              value={[complexParameter.real]}
              onValueChange={([value]) =>
                onParameterChange({ real: value })
              }
            />
          </Box>
          <Box className="slider-group">
            <Text weight="medium">
              Imaginary: {complexParameter.imaginary.toFixed(2)}i
            </Text>
            <Slider
              min={-1}
              max={1}
              step={0.01}
              value={[complexParameter.imaginary]}
              onValueChange={([value]) =>
                onParameterChange({ imaginary: value })
              }
            />
          </Box>
          <Text size="2" color="mint">
            Dimensional efficiency: {dimensionalEfficiency}%
          </Text>
        </Card>
      </Grid>
    </Card>
  );
}
