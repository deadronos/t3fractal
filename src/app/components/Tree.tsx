"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SEASONS, type GeometryType, type SeasonId } from "@/lib/gameData";
import type { Leaf, Segment } from "@/lib/lsystem";

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

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

function createBranchGeometry(geometry: GeometryType) {
  if (geometry === "cone") {
    return new THREE.ConeGeometry(1, 1, 6);
  }
  if (geometry === "box") {
    return new THREE.BoxGeometry(1, 1, 1);
  }
  if (geometry === "tetra") {
    return new THREE.TetrahedronGeometry(0.9);
  }
  return new THREE.CylinderGeometry(1, 1, 1, 6);
}

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
  const branchRef = useRef<THREE.InstancedMesh>(null);
  const leafRef = useRef<THREE.InstancedMesh>(null);
  const fruitRef = useRef<THREE.InstancedMesh>(null);
  const growthStartRef = useRef<number | null>(null);

  const branchGeometry = useMemo(() => createBranchGeometry(geometry), [geometry]);
  const leafGeometry = useMemo(() => new THREE.SphereGeometry(1, 7, 7), []);
  const fruitGeometry = useMemo(() => new THREE.SphereGeometry(1, 8, 8), []);

  const branchMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: SEASONS[season].palette.bark,
        roughness: 0.7,
        metalness: 0.05,
        vertexColors: true,
      }),
    []
  );

  const leafMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: SEASONS[season].palette.leaf,
        roughness: 0.5,
        metalness: 0,
        emissive: new THREE.Color(SEASONS[season].palette.leaf),
        emissiveIntensity: 0.25,
        vertexColors: true,
      }),
    []
  );

  const fruitMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c4533a",
        roughness: 0.35,
        metalness: 0,
      }),
    []
  );

  useEffect(() => {
    branchMaterial.color.set(SEASONS[season].palette.bark);
    leafMaterial.color.set(SEASONS[season].palette.leaf);
    leafMaterial.emissive.set(SEASONS[season].palette.leaf);
  }, [branchMaterial, leafMaterial, season]);

  useEffect(() => {
    branchMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "#include <common>\nuniform float uTime;"
      );
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        [
          "#include <begin_vertex>",
          "float swayStrength = clamp(instanceMatrix[3].y / 12.0, 0.0, 1.0);",
          "float sway = sin(uTime + position.y * 5.0 + instanceMatrix[3].y * 0.2) * 0.08;",
          "float swayZ = cos(uTime * 0.7 + position.y * 4.0) * 0.05;",
          "transformed.x += sway * swayStrength;",
          "transformed.z += swayZ * swayStrength;",
        ].join("\n")
      );
      branchMaterial.userData.shader = shader;
    };
    branchMaterial.needsUpdate = true;
  }, [branchMaterial]);

  useEffect(() => {
    growthStartRef.current = performance.now();
  }, [growthKey, segments.length]);

  const updateBranches = (growth: number) => {
    const mesh = branchRef.current;
    if (!mesh) return;

    segments.forEach((segment, i) => {
      tempObject.position.copy(segment.mid);
      tempObject.quaternion.copy(segment.quaternion);
      tempObject.scale.set(segment.radius, segment.length * growth, segment.radius);
      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);

      if (mesh.instanceColor) {
        if (analysisMode) {
          const exposure = segment.exposure;
          tempColor.setRGB(0.05 + exposure * 0.15, 0.1 + exposure * 0.75, 0.05 + exposure * 0.15);
        } else {
          tempColor.set(SEASONS[season].palette.bark).offsetHSL(
            Math.sin(segment.depth * 0.3) * 0.01,
            -0.08,
            0
          );
        }
        mesh.setColorAt(i, tempColor);
      }
    });

    mesh.count = segments.length;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  };

  const updateLeaves = (growth: number) => {
    const mesh = leafRef.current;
    if (!mesh) return;

    leaves.forEach((leaf, i) => {
      tempObject.position.copy(leaf.position);
      tempObject.quaternion.identity();
      const scale = leaf.size * growth;
      tempObject.scale.set(scale, scale, scale);
      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);
      if (mesh.instanceColor) {
        const exposure = leaf.exposure;
        if (analysisMode) {
          tempColor.setRGB(0.05 + exposure * 0.2, 0.2 + exposure * 0.8, 0.05 + exposure * 0.2);
        } else {
          tempColor.set(SEASONS[season].palette.leaf).lerp(new THREE.Color("#1d1c18"), 1 - exposure);
        }
        mesh.setColorAt(i, tempColor);
      }
    });

    mesh.count = leaves.length;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  };

  const fruitPositions = useMemo(() => {
    if (fruitCount <= 0) return [];
    const count = Math.min(fruitCount, leaves.length);
    return leaves.slice(0, count).map((leaf) => leaf.position);
  }, [fruitCount, leaves]);

  const updateFruits = () => {
    const mesh = fruitRef.current;
    if (!mesh) return;
    fruitPositions.forEach((pos, i) => {
      tempObject.position.copy(pos);
      tempObject.scale.set(0.18, 0.18, 0.18);
      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);
    });
    mesh.count = fruitPositions.length;
    mesh.instanceMatrix.needsUpdate = true;
  };

  useEffect(() => {
    updateBranches(1);
    updateLeaves(1);
    updateFruits();
  }, [segments, leaves, analysisMode, season, fruitPositions]);

  useFrame(({ clock }) => {
    const shader = branchMaterial.userData.shader as { uniforms?: { uTime?: { value: number } } };
    if (shader?.uniforms?.uTime) {
      shader.uniforms.uTime.value = clock.elapsedTime;
    }

    if (growthStartRef.current !== null) {
      const elapsed = performance.now() - growthStartRef.current;
      const progress = Math.min(1, elapsed / 1200);
      updateBranches(progress);
      updateLeaves(progress);
      if (progress >= 1) {
        growthStartRef.current = null;
      }
    }
  });

  return (
    <group position={[-center.x, 0, -center.z]}>
      <instancedMesh key={'branch-' + geometry} ref={branchRef} args={[branchGeometry, branchMaterial, Math.max(1, segments.length)]} />
      <instancedMesh ref={leafRef} args={[leafGeometry, leafMaterial, Math.max(1, leaves.length)]} />
      <instancedMesh ref={fruitRef} args={[fruitGeometry, fruitMaterial, Math.max(1, fruitPositions.length)]} />
    </group>
  );
}

