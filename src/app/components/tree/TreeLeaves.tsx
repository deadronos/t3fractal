"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SEASONS, type SeasonId } from "@/lib/gameData";
import type { Leaf } from "@/lib/lsystem";

type TreeLeavesProps = {
  leaves: Leaf[];
  analysisMode: boolean;
  season: SeasonId;
  growth: number;
};

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

export function TreeLeaves({
  leaves,
  analysisMode,
  season,
  growth,
}: TreeLeavesProps) {
  const leafRef = useRef<THREE.InstancedMesh>(null);

  const leafGeometry = useMemo(() => new THREE.SphereGeometry(1, 7, 7), []);

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

  useEffect(() => {
    leafMaterial.color.set(SEASONS[season].palette.leaf);
    leafMaterial.emissive.set(SEASONS[season].palette.leaf);
  }, [leafMaterial, season]);

  useEffect(() => {
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
  }, [leaves, growth, analysisMode, season]);

  return (
    <instancedMesh ref={leafRef} args={[leafGeometry, leafMaterial, Math.max(1, leaves.length)]} />
  );
}
