"use client";

import "@/styles/starthere.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";

import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Separator,
  Slider,
  Text,
} from "@radix-ui/themes";

import FractalViewer, { type FractalRendererMode } from "./fractalviewer";
import StartHereMenu from "./startheremenu";
import { resolveCosmicEvent } from "./cosmicEvents";

type UpgradeKey = "probe" | "processor" | "stabilizer";

type ComplexParameter = {
  real: number;
  imaginary: number;
};

type UpgradeConfig = {
  title: string;
  description: string;
  baseCost: number;
  growth: number;
  flavor: string;
};

const UPGRADE_CONFIG: Record<UpgradeKey, UpgradeConfig> = {
  probe: {
    title: "Fractal Probes",
    description:
      "Deploy autonomous explorers that map detail while you plan the next zoom.",
    baseCost: 35,
    growth: 1.45,
    flavor: "Their quantum lenses never blink.",
  },
  processor: {
    title: "Quantum Processors",
    description:
      "Accelerate every calculation, multiplying the insight gathered by your probes.",
    baseCost: 120,
    growth: 1.6,
    flavor: "The algorithms hum in complex harmony.",
  },
  stabilizer: {
    title: "Dimensional Stabilizers",
    description:
      "Anchor deeper zoom levels so the structure holds while automation continues.",
    baseCost: 220,
    growth: 1.55,
    flavor: "Reality threads itself tighter around the frontier.",
  },
};

const FRACTAL_ZONES = [
  {
    name: "Mandelbrot Core",
    requirement: 0,
    bonus: 0.0,
    description: "The familiar heart of the set, steady and welcoming.",
  },
  {
    name: "Seahorse Valley",
    requirement: 4,
    bonus: 0.08,
    description:
      "Filigree spirals curl like cosmic seahorses, enriching every data packet.",
  },
  {
    name: "Spiral Nebula",
    requirement: 7,
    bonus: 0.18,
    description:
      "Twin galaxies of recursion feed each other, boosting production dramatically.",
  },
  {
    name: "Mini-Brot Frontier",
    requirement: 11,
    bonus: 0.3,
    description:
      "Self-similarity upon self-similarity. You glimpse new universes in each pixel.",
  },
  {
    name: "Hyperbolic Bloom",
    requirement: 15,
    bonus: 0.45,
    description:
      "Geometries bloom beyond Euclid. Ascension-grade knowledge saturates every line.",
  },
];

const DIMENSIONAL_TARGET: ComplexParameter = { real: -0.75, imaginary: 0.11 };

const formatNumber = (value: number): string => {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }
  return value.toFixed(0);
};

export default function StartHere(): ReactElement {
  const [fractalData, setFractalData] = useState<number>(42);
  const [depth, setDepth] = useState<number>(0);
  const [upgrades, setUpgrades] = useState<Record<UpgradeKey, number>>({
    probe: 0,
    processor: 0,
    stabilizer: 0,
  });
  const [dimensionalPoints, setDimensionalPoints] = useState<number>(0);
  const [ascensionLevel, setAscensionLevel] = useState<number>(0);
  const [amplifiers, setAmplifiers] = useState<number>(0);
  const [resonance, setResonance] = useState<number>(4);
  const [anomalies, setAnomalies] = useState<number>(0);
  const [expeditionRank, setExpeditionRank] = useState<number>(0);
  const [eventCountdown, setEventCountdown] = useState<number>(18);
  const [complexParameter, setComplexParameter] = useState<ComplexParameter>({
    ...DIMENSIONAL_TARGET,
  });
  const [activityLog, setActivityLog] = useState<string[]>([
    "Begin exploration: calibrating renderers…",
  ]);
  const [lastZone, setLastZone] = useState<string>(
    FRACTAL_ZONES[0]?.name ?? "",
  );
  const latestSnapshotRef = useRef({
    depth,
    resonance,
    anomalies,
    ascensionLevel,
    dimensionalPoints,
    fractalData,
  });

  const pushLog = useCallback((message: string) => {
    setActivityLog((previous) => [message, ...previous].slice(0, 6));
  }, []);

  const upgradeCost = useCallback(
    (key: UpgradeKey) => {
      const config = UPGRADE_CONFIG[key];
      const owned = upgrades[key];
      return Math.floor(config.baseCost * Math.pow(config.growth, owned));
    },
    [upgrades],
  );

  const nextDepthLevel = Math.floor(depth) + 1;
  const zoomCost = useMemo(
    () => Math.floor(18 * Math.pow(1.55, nextDepthLevel)),
    [nextDepthLevel],
  );

  const productionMultiplier = useMemo(() => {
    const ascensionBonus = 1 + ascensionLevel * 0.25 + amplifiers * 0.35;
    const depthBonus = 1 + Math.floor(depth) * 0.05;
    const dimensionalBonus = 1 + dimensionalPoints * 0.02;
    const resonanceBonus = 1 + resonance * 0.015;
    const anomalyPenalty = Math.max(0.6, 1 - anomalies * 0.03);
    return (
      ascensionBonus *
      depthBonus *
      dimensionalBonus *
      resonanceBonus *
      anomalyPenalty
    );
  }, [
    ascensionLevel,
    amplifiers,
    anomalies,
    depth,
    dimensionalPoints,
    resonance,
  ]);

  const parameterEfficiency = useMemo(() => {
    const distance = Math.hypot(
      complexParameter.real - DIMENSIONAL_TARGET.real,
      complexParameter.imaginary - DIMENSIONAL_TARGET.imaginary,
    );
    return Math.max(0.65, 1.45 - distance * 1.1);
  }, [complexParameter]);

  const baseProduction = useMemo(() => {
    const probeYield = upgrades.probe * 0.9;
    const processorYield = upgrades.processor * 3.5;
    const stabilizerYield = upgrades.stabilizer * 1.6;
    return probeYield + processorYield + stabilizerYield;
  }, [upgrades]);

  const dataPerSecond = useMemo(() => {
    if (baseProduction <= 0) {
      return 0;
    }
    return baseProduction * productionMultiplier * parameterEfficiency;
  }, [baseProduction, productionMultiplier, parameterEfficiency]);

  const unlockedZones = useMemo(
    () => FRACTAL_ZONES.filter((zone) => depth >= zone.requirement),
    [depth],
  );

  const currentZone =
    unlockedZones[unlockedZones.length - 1] ?? FRACTAL_ZONES[0];

  const zoneBonus = currentZone ? 1 + currentZone.bonus : 1;

  const effectiveDataPerSecond = dataPerSecond * zoneBonus;

  const passiveDepthGain = useMemo(() => {
    if (upgrades.stabilizer <= 0) {
      return 0;
    }
    const resonanceAssist = 1 + Math.min(resonance * 0.02, 0.6);
    return (
      (0.06 + upgrades.stabilizer * 0.025) *
      parameterEfficiency *
      resonanceAssist
    );
  }, [parameterEfficiency, resonance, upgrades.stabilizer]);

  const expeditionCost = useMemo(
    () =>
      Math.floor(90 + depth * 25 + ascensionLevel * 35 + expeditionRank * 20),
    [ascensionLevel, depth, expeditionRank],
  );

  const expeditionPreview = useMemo(
    () => Math.floor(6 + depth * 0.6 + resonance * 0.3 + ascensionLevel * 1.5),
    [ascensionLevel, depth, resonance],
  );

  const stabiliseCost = useMemo(
    () => Math.floor(24 + anomalies * 9 + ascensionLevel * 6),
    [anomalies, ascensionLevel],
  );

  useEffect(() => {
    latestSnapshotRef.current = {
      depth,
      resonance,
      anomalies,
      ascensionLevel,
      dimensionalPoints,
      fractalData,
    };
  }, [
    anomalies,
    ascensionLevel,
    depth,
    dimensionalPoints,
    fractalData,
    resonance,
  ]);

  useEffect(() => {
    if (effectiveDataPerSecond <= 0 && passiveDepthGain <= 0) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      if (effectiveDataPerSecond > 0) {
        setFractalData((previous) => previous + effectiveDataPerSecond / 2);
      }
      if (passiveDepthGain > 0) {
        setDepth((previous) => previous + passiveDepthGain / 2);
      }
    }, 500);

    return () => window.clearInterval(interval);
  }, [effectiveDataPerSecond, passiveDepthGain]);

  useEffect(() => {
    if (!currentZone || currentZone.name === lastZone) {
      return;
    }
    pushLog(
      `New region unlocked: ${currentZone.name}. ${currentZone.description}`,
    );
    setLastZone(currentZone.name);
  }, [currentZone, lastZone, pushLog]);

  const triggerCosmicEvent = useCallback(() => {
    const { event, outcome } = resolveCosmicEvent(latestSnapshotRef.current);
    const {
      dataDelta = 0,
      resonanceDelta = 0,
      anomaliesDelta = 0,
      depthDelta = 0,
      dimensionalPointsDelta = 0,
    } = outcome;

    if (dataDelta !== 0) {
      setFractalData((previous) => Math.max(0, previous + dataDelta));
    }
    if (resonanceDelta !== 0) {
      setResonance((previous) => Math.max(0, previous + resonanceDelta));
    }
    if (anomaliesDelta !== 0) {
      setAnomalies((previous) => Math.max(0, previous + anomaliesDelta));
    }
    if (depthDelta !== 0) {
      setDepth((previous) => Math.max(0, previous + depthDelta));
    }
    if (dimensionalPointsDelta !== 0) {
      setDimensionalPoints((previous) =>
        Math.max(0, previous + dimensionalPointsDelta),
      );
    }
    pushLog(`[Event] ${event.name}: ${outcome.log}`);
  }, [pushLog]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setEventCountdown((previous) => {
        if (previous <= 1) {
          triggerCosmicEvent();
          return 16 + Math.floor(Math.random() * 9);
        }
        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [triggerCosmicEvent]);

  const handleZoomDeeper = useCallback(() => {
    let zoomApproved = false;
    setFractalData((previous) => {
      if (previous < zoomCost) {
        return previous;
      }
      zoomApproved = true;
      return previous - zoomCost;
    });
    if (zoomApproved) {
      setDepth((previous) => {
        const updated = previous + 1;
        pushLog(`Zoomed to depth ${Math.floor(updated)}. Details blossom.`);
        return updated;
      });
    } else {
      pushLog("Insufficient Fractal Data to penetrate deeper.");
    }
  }, [pushLog, zoomCost]);

  const handleZoomOut = useCallback(() => {
    setDepth((previous) => Math.max(0, previous - 1));
    pushLog("Stabilised view at a safer zoom.");
  }, [pushLog]);

  const handleExpedition = useCallback(() => {
    let authorised = false;
    setFractalData((previous) => {
      if (previous < expeditionCost) {
        return previous;
      }
      authorised = true;
      return previous - expeditionCost;
    });
    if (!authorised) {
      pushLog("Expedition denied: insufficient Fractal Data for launch.");
      return;
    }
    const variableReward = expeditionPreview + Math.floor(Math.random() * 4);
    setResonance((previous) => previous + variableReward);
    setDepth((previous) => previous + 0.25);
    setExpeditionRank((previous) => previous + 1);
    if (Math.random() > 0.72) {
      setAnomalies((previous) => previous + 1);
      pushLog(
        `Expedition reports ${variableReward} resonance shards and an excitable anomaly hitchhiker.`,
      );
      return;
    }
    pushLog(
      `Expedition returns triumphantly with ${variableReward} resonance shards.`,
    );
  }, [expeditionCost, expeditionPreview, pushLog]);

  const handleStabiliseAnomaly = useCallback(() => {
    if (anomalies <= 0) {
      pushLog("Calibration steady: no anomalies demand stabilisation.");
      return;
    }
    let authorised = false;
    setFractalData((previous) => {
      if (previous < stabiliseCost) {
        return previous;
      }
      authorised = true;
      return previous - stabiliseCost;
    });
    if (!authorised) {
      pushLog(
        "Stabilisation cancelled: gather more Fractal Data for the ritual.",
      );
      return;
    }
    setAnomalies((previous) => Math.max(0, previous - 1));
    setResonance((previous) => previous + 2);
    pushLog("Quantum botanists prune an anomaly garden into calm symmetry.");
  }, [anomalies, pushLog, stabiliseCost]);

  const handleUpgradePurchase = useCallback(
    (key: UpgradeKey) => {
      const cost = upgradeCost(key);
      let purchase = false;
      setFractalData((previous) => {
        if (previous < cost) {
          return previous;
        }
        purchase = true;
        return previous - cost;
      });
      if (!purchase) {
        pushLog("The frontier demands more data before that upgrade.");
        return;
      }
      setUpgrades((previous) => ({ ...previous, [key]: previous[key] + 1 }));
      pushLog(`Upgrade secured: ${UPGRADE_CONFIG[key].title}.`);
    },
    [pushLog, upgradeCost],
  );

  const ascendReady = depth >= 6 && fractalData >= 1200;
  const ascensionYield = useMemo(() => {
    const depthContribution = Math.floor(Math.max(depth, 0));
    const dataContribution = Math.floor(fractalData / 400);
    const total = depthContribution + dataContribution + upgrades.processor;
    return Math.max(1, Math.floor(total * 0.75));
  }, [depth, fractalData, upgrades.processor]);

  const handleAscend = useCallback(() => {
    if (!ascendReady) {
      pushLog("The fractal resists ascension – reach deeper detail first.");
      return;
    }
    setDimensionalPoints((previous) => previous + ascensionYield);
    setAscensionLevel((previous) => previous + 1);
    setFractalData(40 + ascensionYield * 15);
    setDepth(0);
    setUpgrades({ probe: 0, processor: 0, stabilizer: 0 });
    setAmplifiers(0);
    setResonance((previous) =>
      Math.max(3, Math.floor(previous * 0.35) + ascensionYield),
    );
    setAnomalies(0);
    setEventCountdown(18);
    setExpeditionRank(0);
    pushLog(
      `Dimensional Ascension complete. Gained ${ascensionYield} Dimensional Points.`,
    );
  }, [ascendReady, ascensionYield, pushLog]);

  const amplifierCost = useMemo(
    () => Math.floor(3 * Math.pow(2.4, amplifiers)),
    [amplifiers],
  );

  const handleAmplifierPurchase = useCallback(() => {
    let purchase = false;
    setDimensionalPoints((previous) => {
      if (previous < amplifierCost) {
        return previous;
      }
      purchase = true;
      return previous - amplifierCost;
    });
    if (!purchase) {
      pushLog("Need more Dimensional Points to stabilise an amplifier.");
      return;
    }
    setAmplifiers((previous) => previous + 1);
    pushLog("Dimensional Amplifier anchors permanent insight.");
  }, [amplifierCost, pushLog]);

  const handleParameterChange = useCallback(
    (changes: Partial<ComplexParameter>) => {
      setComplexParameter((previous) => ({ ...previous, ...changes }));
    },
    [],
  );

  const dimensionalEfficiency = (parameterEfficiency * 100).toFixed(0);
  const nextEventLabel =
    eventCountdown <= 0 ? "Imminent" : `${eventCountdown}s`;
  const currentZoneRequirement = currentZone?.requirement ?? 0;

  const omenMessage = useMemo(() => {
    if (anomalies >= 4) {
      return "Council warning: anomaly gardens are blooming; stabilise soon.";
    }
    if (resonance >= 18) {
      return "The Cosmic Choir hums in harmony. Expect generous events.";
    }
    if (currentZoneRequirement >= 10) {
      return "Frontier scouts taste complexity in the air; brace for dazzling storms.";
    }
    return "Sensors idle with a gentle purr. Perfect time to chart expeditions.";
  }, [anomalies, currentZoneRequirement, resonance]);

  const [rendererMode, setRendererMode] =
    useState<FractalRendererMode>("webgl");

  return (
    <Box className="startherebox">
      <StartHereMenu
        fractalData={fractalData}
        depth={depth}
        dataPerSecond={effectiveDataPerSecond}
        dimensionalPoints={dimensionalPoints}
        resonance={resonance}
        anomalies={anomalies}
      />
      <Grid
        className="starthere-grid"
        columns={{ initial: "1", md: "2" }}
        gap="4"
      >
        <Flex direction="column" gap="4">
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
              onRendererChange={setRendererMode}
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
                  <Button onClick={handleZoomDeeper} color="green">
                    Zoom Deeper (Cost: {formatNumber(zoomCost)})
                  </Button>
                  <Button onClick={handleZoomOut} variant="soft" color="gray">
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
                      handleParameterChange({ real: value })
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
                      handleParameterChange({ imaginary: value })
                    }
                  />
                </Box>
                <Text size="2" color="mint">
                  Dimensional efficiency: {dimensionalEfficiency}%
                </Text>
              </Card>
            </Grid>
          </Card>
          <Card className="event-card">
            <Heading size="4">Cosmic Forecast</Heading>
            <Text size="2" color="gray">
              The Galactic Cartographers share whimsical predictions about your
              frontier.
            </Text>
            <Separator my="3" size="4" />
            <Flex justify="between" align="center" mb="3">
              <Flex direction="column">
                <Text size="2" color="gray">
                  Next phenomenon
                </Text>
                <Text size="3" weight="bold" color="mint">
                  {nextEventLabel}
                </Text>
              </Flex>
              <Badge
                color={anomalies > 0 ? "iris" : "mint"}
                variant="soft"
                className="countdown-badge"
              >
                {omenMessage}
              </Badge>
            </Flex>
            <Flex direction="column" gap="2" className="cosmic-stat">
              <Flex justify="between" align="center">
                <Text size="2">Resonance Flow</Text>
                <Text size="2" color="mint">
                  {resonance.toFixed(0)}
                </Text>
              </Flex>
              <Box className="cosmic-meter">
                <Box
                  className="cosmic-meter-fill"
                  style={{ width: `${Math.min(100, resonance * 5)}%` }}
                />
              </Box>
            </Flex>
            <Flex direction="column" gap="2" className="cosmic-stat">
              <Flex justify="between" align="center">
                <Text size="2">Anomaly Bloom</Text>
                <Text size="2" color={anomalies > 0 ? "iris" : "gray"}>
                  {anomalies}
                </Text>
              </Flex>
              <Box className="cosmic-meter anomaly">
                <Box
                  className="cosmic-meter-fill"
                  style={{ width: `${Math.min(100, anomalies * 20)}%` }}
                />
              </Box>
            </Flex>
            <Separator my="3" size="4" />
            <Flex direction="column" gap="3">
              <Button onClick={handleExpedition} color="cyan">
                Dispatch Expedition (Cost: {formatNumber(expeditionCost)})
              </Button>
              <Text size="2" color="gray">
                Expected haul: ~{expeditionPreview} resonance shards plus modest
                depth insights.
              </Text>
              <Button
                onClick={handleStabiliseAnomaly}
                variant="soft"
                color="purple"
              >
                Stabilise Anomaly (Cost: {formatNumber(stabiliseCost)})
              </Button>
            </Flex>
          </Card>
          <Card className="zone-card">
            <Heading size="4">Exploration Zones</Heading>
            <Text size="2" color="gray">
              Deeper zooms reveal new fractal biomes. Each grants a unique
              production bonus.
            </Text>
            <Separator my="3" size="4" />
            <Flex direction="column" gap="3">
              {FRACTAL_ZONES.map((zone) => {
                const unlocked = depth >= zone.requirement;
                return (
                  <Card
                    key={zone.name}
                    className={`zone-entry ${unlocked ? "zone-unlocked" : "zone-locked"}`}
                  >
                    <Flex justify="between" align="center" mb="1">
                      <Heading size="3">{zone.name}</Heading>
                      <Text size="2" color={unlocked ? "mint" : "gray"}>
                        {unlocked ? "Unlocked" : `Depth ${zone.requirement}`}
                      </Text>
                    </Flex>
                    <Text size="2" color="gray">
                      {zone.description}
                    </Text>
                    <Text size="2" color="mint">
                      Bonus: +{Math.round(zone.bonus * 100)}% production
                    </Text>
                  </Card>
                );
              })}
            </Flex>
          </Card>
        </Flex>
        <Flex direction="column" gap="4">
          <Card className="upgrade-card">
            <Heading size="4" mb="1">
              Automation Upgrades
            </Heading>
            <Text size="2" color="gray">
              Invest Fractal Data to automate exploration. Each stack compounds
              with your dimensional bonuses.
            </Text>
            <Separator my="3" size="4" />
            <Flex direction="column" gap="3">
              {Object.entries(UPGRADE_CONFIG).map(([key, config]) => {
                const typedKey = key as UpgradeKey;
                const owned = upgrades[typedKey];
                const cost = upgradeCost(typedKey);
                return (
                  <Card key={key} className="upgrade-row">
                    <Flex justify="between" align="center" mb="2">
                      <Heading size="3">{config.title}</Heading>
                      <Text size="2" color="gray">
                        Owned: {owned}
                      </Text>
                    </Flex>
                    <Text size="2" color="gray">
                      {config.description}
                    </Text>
                    <Text size="2" color="mint" mb="2">
                      {config.flavor}
                    </Text>
                    <Button onClick={() => handleUpgradePurchase(typedKey)}>
                      Purchase ({formatNumber(cost)} Data)
                    </Button>
                  </Card>
                );
              })}
            </Flex>
          </Card>
          <Card className="prestige-card">
            <Heading size="4" mb="1">
              Dimensional Ascension
            </Heading>
            <Text size="2" color="gray">
              Collapse the current fractal and start anew with permanent
              insight. Costs your progress but grants Dimensional Points.
            </Text>
            <Separator my="3" size="4" />
            <Flex align="center" justify="between" mb="3">
              <Box>
                <Text size="2">Ascension yield: {ascensionYield} DP</Text>
                <Text size="2" color={ascendReady ? "mint" : "gray"}>
                  Status: {ascendReady ? "Ready" : "Not yet"}
                </Text>
              </Box>
              <Button
                onClick={handleAscend}
                color={ascendReady ? "purple" : "gray"}
                variant={ascendReady ? "solid" : "soft"}
              >
                Ascend
              </Button>
            </Flex>
            <Box className="prestige-upgrades">
              <Heading size="3">Dimensional Amplifiers</Heading>
              <Text size="2" color="gray">
                Spend Dimensional Points for permanent production boosts that
                survive resets.
              </Text>
              <Flex align="center" justify="between" mt="2">
                <Text size="2">Amplifiers owned: {amplifiers}</Text>
                <Button
                  onClick={handleAmplifierPurchase}
                  variant="soft"
                  color="mint"
                >
                  Buy ({amplifierCost} DP)
                </Button>
              </Flex>
            </Box>
          </Card>
          <Card className="log-card">
            <Heading size="4" mb="2">
              Mission Log
            </Heading>
            <Flex direction="column" gap="2">
              {activityLog.map((entry, index) => (
                <Text
                  key={`${entry}-${index}`}
                  size="2"
                  color={index === 0 ? "mint" : "gray"}
                >
                  {entry}
                </Text>
              ))}
            </Flex>
          </Card>
        </Flex>
      </Grid>
    </Box>
  );
}
