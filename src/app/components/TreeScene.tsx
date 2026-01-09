"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Tree } from "@/app/components/Tree";
import { SEASONS, type GeometryType, type SeasonId } from "@/lib/gameData";
import type { Leaf, Segment } from "@/lib/lsystem";

export type TreeSceneProps = {
  segments: Segment[];
  leaves: Leaf[];
  season: SeasonId;
  analysisMode: boolean;
  geometry: GeometryType;
  fruitCount: number;
  growthKey: number;
  center: { x: number; y: number; z: number };
};

export default function TreeScene({
  segments,
  leaves,
  season,
  analysisMode,
  geometry,
  fruitCount,
  growthKey,
  center,
}: TreeSceneProps) {
  const palette = SEASONS[season].palette;

  return (
    <Canvas
      camera={{ position: [6, 7, 12], fov: 46 }}
      gl={{ antialias: true, alpha: false }}
      shadows
    >
      <color attach="background" args={[palette.sky]} />
      <fog attach="fog" args={[palette.sky, 12, 32]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[8, 12, 6]} intensity={1.1} castShadow />
      <directionalLight position={[-6, 8, -4]} intensity={0.5} />

      <group position={[0, 0, 0]}>
        <Tree
          segments={segments}
          leaves={leaves}
          season={season}
          analysisMode={analysisMode}
          geometry={geometry}
          fruitCount={fruitCount}
          growthKey={growthKey}
          center={center}
        />
      </group>

      <mesh rotation-x={-Math.PI / 2} position={[0, -0.2, 0]} receiveShadow>
        <circleGeometry args={[18, 64]} />
        <meshStandardMaterial color="#d8d1c4" roughness={1} />
      </mesh>

      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={6}
        maxDistance={22}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  );
}
