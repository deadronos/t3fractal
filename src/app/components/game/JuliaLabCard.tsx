import type { ReactElement } from "react";

import { Box, Button, Card, Flex, Grid, Heading, Separator, Slider, Text } from "@radix-ui/themes";

import FractalViewer, { type FractalRendererMode } from "@/app/pages/fractalviewer";
import type { ComplexParameter } from "@/store/gameStore";
import { formatNumber } from "@/lib/gameplay/formatters";

/**
 * Props for the JuliaLabCard component.
 */
export type JuliaLabCardProps = {
  /** Current Julia set depth. */
  juliaDepth: number;
  /** Current flux amount. */
  juliaFlux: number;
  /** Harmonic cores count. */
  harmonicCores: number;
  /** Transcension level. */
  transcensionLevel: number;
  /** Cost to study Julia set. */
  juliaStudyCost: number;
  /** Expected flux gain. */
  juliaFluxGain: number;
  /** Current bonus multiplier from flux. */
  juliaBonusMultiplier: number;
  /** Current Julia constant. */
  juliaConstant: ComplexParameter;
  /** Active renderer mode. */
  rendererMode: FractalRendererMode;
  /** Callback to change renderer mode. */
  onRendererChange: (mode: FractalRendererMode) => void;
  /** Handler to conduct study. */
  onStudy: () => void;
  /** Handler to change Julia constant. */
  onConstantChange: (changes: Partial<ComplexParameter>) => void;
};

/**
 * Card for managing Julia set research and upgrades (Endgame feature).
 *
 * @param props - Component props.
 * @returns The card component.
 */
export default function JuliaLabCard({
  juliaDepth,
  juliaFlux,
  harmonicCores,
  transcensionLevel,
  juliaStudyCost,
  juliaFluxGain,
  juliaBonusMultiplier,
  juliaConstant,
  rendererMode,
  onRendererChange,
  onStudy,
  onConstantChange,
}: JuliaLabCardProps): ReactElement {
  return (
    <Card className="fractal-card">
      <Flex justify="between" align="center" mb="3" wrap="wrap" gap="2">
        <Box>
          <Heading size="4">Julia Research Lab</Heading>
          <Text size="2" color="gray">
            Stabilise Julia filaments unlocked by Harmonic Transcendence.
          </Text>
        </Box>
        <Text size="2" color="mint">
          Flux bonus: +{((juliaBonusMultiplier - 1) * 100).toFixed(1)}% ·
          {" "}
          {rendererMode === "webgl" ? "WebGL" : "CPU"} renderer
        </Text>
      </Flex>
      <FractalViewer
        depth={Math.max(1, juliaDepth + 3)}
        parameter={juliaConstant}
        amplifiers={harmonicCores + transcensionLevel}
        formula="julia"
        juliaConstant={juliaConstant}
        onRendererChange={onRendererChange}
      />
      <Separator my="3" size="4" />
      <Grid columns={{ initial: "1", sm: "2" }} gap="4">
        <Card className="control-card">
          <Heading size="3">Julia Study</Heading>
          <Text color="gray" size="2" mb="3">
            Spend Fractal Data to chart new filaments and pull Flux for permanent multipliers.
          </Text>
          <Flex gap="3" mb="3" wrap="wrap" align="center">
            <Button onClick={onStudy} color="purple">
              Conduct Study (Cost: {formatNumber(juliaStudyCost)})
            </Button>
            <Text size="2" color="gray">
              Expected Flux: +{juliaFluxGain} | Depth: {juliaDepth.toFixed(2)}
            </Text>
          </Flex>
          <Text size="2" color="gray">
            Harmonic Cores amplify iteration budgets; Flux feeds the main frontier production.
          </Text>
        </Card>
        <Card className="control-card">
          <Heading size="3">Julia Constant</Heading>
          <Text size="2" color="gray">
            Adjust the complex constant c to explore wildly different Julia shapes.
          </Text>
          <Box className="slider-group">
            <Text weight="medium">Real: {juliaConstant.real.toFixed(3)}</Text>
            <Slider
              min={-1.25}
              max={1.25}
              step={0.005}
              value={[juliaConstant.real]}
              onValueChange={([value]) => onConstantChange({ real: value })}
            />
          </Box>
          <Box className="slider-group">
            <Text weight="medium">Imaginary: {juliaConstant.imaginary.toFixed(3)}i</Text>
            <Slider
              min={-1.25}
              max={1.25}
              step={0.005}
              value={[juliaConstant.imaginary]}
              onValueChange={([value]) => onConstantChange({ imaginary: value })}
            />
          </Box>
          <Flex gap="3" wrap="wrap">
            <Text size="2" color="mint">
              Flux stored: {formatNumber(juliaFlux)}
            </Text>
            <Text size="2" color="gray">
              Harmonic Cores: {harmonicCores}
            </Text>
          </Flex>
        </Card>
      </Grid>
    </Card>
  );
}
