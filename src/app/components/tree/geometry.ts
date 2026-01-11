import * as THREE from "three";
import { type GeometryType } from "@/lib/gameData";

export function createBranchGeometry(geometry: GeometryType) {
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
