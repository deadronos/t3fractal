import { useMemo } from "react";
import type * as THREE from "three";
import { generateSentence, interpretSentence, type Leaf, type Segment } from "@/lib/lsystem";

export type LSystemStats = {
  leafCount: number;
  avgExposure: number;
  totalVolume: number;
  rootDepth: number;
  maxHeight: number;
  segmentCount: number;
  sentenceLength: number;
  suggestedAngle: number;
  center: THREE.Vector3;
  limitReached: boolean;
};

export type UseLSystemResult = {
  sentence: string;
  segments: Segment[];
  leaves: Leaf[];
  stats: LSystemStats;
};

export type UseLSystemConfig = {
  axiom: string;
  rules: Record<string, string>;
  iterations: number;
  angle: number;
  step: number;
  width: number;
  enablePitch: boolean;
  enableRoll: boolean;
  maxSegments?: number;
  maxSentenceLength?: number;
};

const DEFAULT_MAX_SEGMENTS = 3500;
const DEFAULT_MAX_SENTENCE = 12000;

function distanceToSegment2D(
  px: number,
  pz: number,
  ax: number,
  az: number,
  bx: number,
  bz: number
): number {
  const abx = bx - ax;
  const abz = bz - az;
  const apx = px - ax;
  const apz = pz - az;
  const denom = abx * abx + abz * abz;
  const t = denom === 0 ? 0 : Math.max(0, Math.min(1, (apx * abx + apz * abz) / denom));
  const cx = ax + abx * t;
  const cz = az + abz * t;
  const dx = px - cx;
  const dz = pz - cz;
  return Math.sqrt(dx * dx + dz * dz);
}



export function useLSystem(config: UseLSystemConfig): UseLSystemResult {
  return useMemo(() => {
    const sentence = generateSentence(
      config.axiom,
      config.rules,
      config.iterations,
      config.maxSentenceLength ?? DEFAULT_MAX_SENTENCE
    );

    const { segments, leaves, bounds } = interpretSentence(sentence, {
      axiom: config.axiom,
      rules: config.rules,
      iterations: config.iterations,
      angle: config.angle,
      step: config.step,
      width: config.width,
      enablePitch: config.enablePitch,
      enableRoll: config.enableRoll,
      maxSegments: config.maxSegments ?? DEFAULT_MAX_SEGMENTS,
      maxSentenceLength: config.maxSentenceLength ?? DEFAULT_MAX_SENTENCE,
    });

    // Spatial grid for exposure optimization
    const gridSize = 1.5;
    const grid = new Map<string, { ax: number; az: number; bx: number; bz: number; maxY: number; radius: number }[]>();

    const occluders = segments.map((segment) => ({
      ax: segment.start.x,
      az: segment.start.z,
      bx: segment.end.x,
      bz: segment.end.z,
      maxY: Math.max(segment.start.y, segment.end.y),
      radius: segment.radius,
    }));

    for (const occ of occluders) {
      const minX = Math.min(occ.ax, occ.bx) - occ.radius;
      const maxX = Math.max(occ.ax, occ.bx) + occ.radius;
      const minZ = Math.min(occ.az, occ.bz) - occ.radius;
      const maxZ = Math.max(occ.az, occ.bz) + occ.radius;

      for (let x = Math.floor(minX / gridSize); x <= Math.floor(maxX / gridSize); x++) {
        for (let z = Math.floor(minZ / gridSize); z <= Math.floor(maxZ / gridSize); z++) {
          const key = `${x},${z}`;
          if (!grid.has(key)) grid.set(key, []);
          grid.get(key)!.push(occ);
        }
      }
    }

    function computeExposureGrid(
      point: THREE.Vector3,
      spatialGrid: Map<string, { ax: number; az: number; bx: number; bz: number; maxY: number; radius: number }[]>
    ): number {
      const gx = Math.floor(point.x / gridSize);
      const gz = Math.floor(point.z / gridSize);
      const key = `${gx},${gz}`;
      const candidates = spatialGrid.get(key);
      if (!candidates) return 1;

      for (const segment of candidates) {
        if (segment.maxY <= point.y + 0.02) continue;
        const distance = distanceToSegment2D(point.x, point.z, segment.ax, segment.az, segment.bx, segment.bz);
        if (distance < segment.radius * 1.2) {
          return 0.15;
        }
      }
      return 1;
    }

    let exposureSum = 0;
    for (const leaf of leaves) {
      const exposure = computeExposureGrid(leaf.position, grid);
      leaf.exposure = exposure;
      exposureSum += exposure;
    }

    for (const segment of segments) {
      segment.exposure = computeExposureGrid(segment.end, grid);
    }

    const totalVolume = segments.reduce(
      (sum, segment) => sum + Math.PI * segment.radius * segment.radius * segment.length,
      0
    );

    const leafCount = leaves.length;
    const avgExposure = leafCount > 0 ? exposureSum / leafCount : 1;
    const rootDepth = Math.max(0.5, Math.abs(bounds.min.y));
    const maxHeight = bounds.max.y;

    const suggestedAngle = Math.min(85, Math.max(10, 20 + (1 - avgExposure) * 55));
    const limitReached = segments.length >= (config.maxSegments ?? DEFAULT_MAX_SEGMENTS) || sentence.length >= (config.maxSentenceLength ?? DEFAULT_MAX_SENTENCE);

    return {
      sentence,
      segments,
      leaves,
      stats: {
        leafCount,
        avgExposure,
        totalVolume,
        rootDepth,
        maxHeight,
        segmentCount: segments.length,
        sentenceLength: sentence.length,
        suggestedAngle,
        center: bounds.center,
        limitReached,
      },
    };
  }, [
    config.axiom,
    config.rules,
    config.iterations,
    config.angle,
    config.step,
    config.width,
    config.enablePitch,
    config.enableRoll,
    config.maxSegments,
    config.maxSentenceLength,
  ]);
}
