"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Leaf } from "@/lib/lsystem";

type TreeFruitsProps = {
  leaves: Leaf[];
  fruitCount: number;
};

const tempObject = new THREE.Object3D();

export function TreeFruits({
  leaves,
  fruitCount,
}: TreeFruitsProps) {
  const fruitRef = useRef<THREE.InstancedMesh>(null);

  const fruitGeometry = useMemo(() => new THREE.SphereGeometry(1, 8, 8), []);

  const fruitMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c4533a",
        roughness: 0.35,
        metalness: 0,
      }),
    []
  );

  const fruitPositions = useMemo(() => {
    if (fruitCount <= 0) return [];
    const count = Math.min(fruitCount, leaves.length);
    return leaves.slice(0, count).map((leaf) => leaf.position);
  }, [fruitCount, leaves]);

  useEffect(() => {
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
  }, [fruitPositions]);

  return (
    <instancedMesh ref={fruitRef} args={[fruitGeometry, fruitMaterial, Math.max(1, fruitPositions.length)]} />
  );
}
