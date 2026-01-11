"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SEASONS, type GeometryType, type SeasonId } from "@/lib/gameData";
import type { Segment } from "@/lib/lsystem";
import { createBranchGeometry } from "./geometry";

type TreeBranchesProps = {
  segments: Segment[];
  analysisMode: boolean;
  season: SeasonId;
  geometry: GeometryType;
  growth: number;
};

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

export function TreeBranches({
  segments,
  analysisMode,
  season,
  geometry,
  growth,
}: TreeBranchesProps) {
  const branchRef = useRef<THREE.InstancedMesh>(null);

  const branchGeometry = useMemo(() => createBranchGeometry(geometry), [geometry]);

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

  useEffect(() => {
    branchMaterial.color.set(SEASONS[season].palette.bark);
  }, [branchMaterial, season]);

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

  useFrame(({ clock }) => {
    const shader = branchMaterial.userData.shader as { uniforms?: { uTime?: { value: number } } };
    if (shader?.uniforms?.uTime) {
      shader.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  useEffect(() => {
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
  }, [segments, growth, analysisMode, season]);

  return (
    <instancedMesh key={'branch-' + geometry} ref={branchRef} args={[branchGeometry, branchMaterial, Math.max(1, segments.length)]} />
  );
}
