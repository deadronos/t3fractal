"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { GeometryType, SeasonId } from "@/lib/gameData";
import type { Leaf, Segment } from "@/lib/lsystem";
import { TreeBranches } from "./TreeBranches";
import { TreeLeaves } from "./TreeLeaves";
import { TreeFruits } from "./TreeFruits";

export type TreeProps = {
  segments: Segment[];
  leaves: Leaf[];
  analysisMode: boolean;
  season: SeasonId;
  geometry: GeometryType;
  fruitCount: number;
  growthKey: number;
  center: { x: number; y: number; z: number };
};

export function Tree({
  segments,
  leaves,
  analysisMode,
  season,
  geometry,
  fruitCount,
  growthKey,
  center,
}: TreeProps) {
  const growthStartRef = useRef<number | null>(null);
  const [growth, setGrowth] = useState(1);

  useEffect(() => {
    growthStartRef.current = performance.now();
  }, [growthKey, segments.length]);

  useFrame(() => {
    if (growthStartRef.current !== null) {
      const elapsed = performance.now() - growthStartRef.current;
      const progress = Math.min(1, elapsed / 1200);
      setGrowth(progress);
      if (progress >= 1) {
        growthStartRef.current = null;
      }
    }
  });

  return (
    <group position={[-center.x, 0, -center.z]}>
      <TreeBranches
        segments={segments}
        analysisMode={analysisMode}
        season={season}
        geometry={geometry}
        growth={growth}
      />
      <TreeLeaves
        leaves={leaves}
        analysisMode={analysisMode}
        season={season}
        growth={growth}
      />
      <TreeFruits
        leaves={leaves}
        fruitCount={fruitCount}
      />
    </group>
  );
}
