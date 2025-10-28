"use client";

import "@/styles/starthere.css";

import { useState } from "react";
import type { ReactElement } from "react";

import { Box, Flex, Grid } from "@radix-ui/themes";

import { type FractalRendererMode } from "./fractalviewer";
import StartHereMenu from "./startheremenu";
import { useGameState, useGameActions } from "@/app/hooks/useGameState";
import { useGameCalculations } from "@/app/hooks/useGameCalculations";
import { useGameHandlers } from "@/app/hooks/useGameHandlers";
import { useGameEffects } from "@/app/hooks/useGameEffects";
import FractalCard from "@/app/components/game/FractalCard";
import CosmicEventCard from "@/app/components/game/CosmicEventCard";
import ExplorationZonesCard from "@/app/components/game/ExplorationZonesCard";
import UpgradesCard from "@/app/components/game/UpgradesCard";
import PrestigeCard from "@/app/components/game/PrestigeCard";
import ActivityLogCard from "@/app/components/game/ActivityLogCard";

export default function StartHere(): ReactElement {
  const state = useGameState();
  const actions = useGameActions();
  const calculations = useGameCalculations(state);
  
  const handlers = useGameHandlers(
    {
      depth: state.depth,
      resonance: state.resonance,
      anomalies: state.anomalies,
      ascensionLevel: state.ascensionLevel,
      dimensionalPoints: state.dimensionalPoints,
      fractalData: state.fractalData,
      zoomCost: calculations.zoomCost,
      expeditionCost: calculations.expeditionCost,
      expeditionPreview: calculations.expeditionPreview,
      stabiliseCost: calculations.stabiliseCost,
      upgradeCost: calculations.upgradeCost,
      ascendReady: calculations.ascendReady,
      ascensionYield: calculations.ascensionYield,
      amplifierCost: calculations.amplifierCost,
    },
    actions,
  );

  useGameEffects({
    effectiveDataPerSecond: calculations.effectiveDataPerSecond,
    passiveDepthGain: calculations.passiveDepthGain,
    currentZone: calculations.currentZone,
    lastZone: state.lastZone,
    addFractalData: actions.addFractalData,
    incrementDepth: actions.incrementDepth,
    pushLog: actions.pushActivityLog,
    setLastZone: actions.setLastZone,
    triggerCosmicEvent: handlers.triggerCosmicEvent,
    decrementEventCountdown: actions.decrementEventCountdown,
    setEventCountdown: actions.setEventCountdown,
  });

  const [rendererMode, setRendererMode] =
    useState<FractalRendererMode>("webgl");

  return (
    <Box className="startherebox">
      <StartHereMenu
        fractalData={state.fractalData}
        depth={state.depth}
        dataPerSecond={calculations.effectiveDataPerSecond}
        dimensionalPoints={state.dimensionalPoints}
        resonance={state.resonance}
        anomalies={state.anomalies}
      />
      <Grid
        className="starthere-grid"
        columns={{ initial: "1", md: "2" }}
        gap="4"
      >
        <Flex direction="column" gap="4">
          <FractalCard
            depth={state.depth}
            complexParameter={state.complexParameter}
            amplifiers={state.amplifiers}
            zoneBonus={calculations.zoneBonus}
            zoomCost={calculations.zoomCost}
            passiveDepthGain={calculations.passiveDepthGain}
            dimensionalEfficiency={calculations.dimensionalEfficiency}
            rendererMode={rendererMode}
            onRendererChange={setRendererMode}
            onZoomDeeper={handlers.handleZoomDeeper}
            onZoomOut={handlers.handleZoomOut}
            onParameterChange={handlers.handleParameterChange}
          />
          <CosmicEventCard
            eventCountdown={state.eventCountdown}
            resonance={state.resonance}
            anomalies={state.anomalies}
            expeditionCost={calculations.expeditionCost}
            expeditionPreview={calculations.expeditionPreview}
            stabiliseCost={calculations.stabiliseCost}
            omenMessage={calculations.omenMessage}
            onExpedition={handlers.handleExpedition}
            onStabiliseAnomaly={handlers.handleStabiliseAnomaly}
          />
          <ExplorationZonesCard depth={state.depth} />
        </Flex>
        <Flex direction="column" gap="4">
          <UpgradesCard
            upgrades={state.upgrades}
            upgradeCost={calculations.upgradeCost}
            onPurchase={handlers.handleUpgradePurchase}
          />
          <PrestigeCard
            ascensionYield={calculations.ascensionYield}
            ascendReady={calculations.ascendReady}
            amplifiers={state.amplifiers}
            amplifierCost={calculations.amplifierCost}
            onAscend={handlers.handleAscend}
            onAmplifierPurchase={handlers.handleAmplifierPurchase}
          />
          <ActivityLogCard activityLog={state.activityLog} />
        </Flex>
      </Grid>
    </Box>
  );
}
