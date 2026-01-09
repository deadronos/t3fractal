import * as THREE from "three";

export type LSystemRules = Record<string, string>;

export type Segment = {
  start: THREE.Vector3;
  end: THREE.Vector3;
  mid: THREE.Vector3;
  quaternion: THREE.Quaternion;
  radius: number;
  length: number;
  depth: number;
  exposure: number;
};

export type Leaf = {
  position: THREE.Vector3;
  exposure: number;
  size: number;
};

export type LSystemConfig = {
  axiom: string;
  rules: LSystemRules;
  iterations: number;
  angle: number;
  step: number;
  width: number;
  enablePitch: boolean;
  enableRoll: boolean;
  maxSegments: number;
  maxSentenceLength: number;
};

export type LSystemResult = {
  sentence: string;
  segments: Segment[];
  leaves: Leaf[];
  bounds: {
    min: THREE.Vector3;
    max: THREE.Vector3;
    center: THREE.Vector3;
  };
};

const UP = new THREE.Vector3(0, 1, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);
const X_AXIS = new THREE.Vector3(1, 0, 0);
const Y_AXIS = new THREE.Vector3(0, 1, 0);

export function generateSentence(
  axiom: string,
  rules: LSystemRules,
  iterations: number,
  maxLength: number
): string {
  let sentence = axiom;
  for (let i = 0; i < iterations; i += 1) {
    let next = "";
    for (const char of sentence) {
      const replacement = rules[char];
      next += replacement ?? char;
      if (next.length >= maxLength) {
        break;
      }
    }
    sentence = next;
    if (sentence.length >= maxLength) {
      break;
    }
  }
  return sentence;
}

export function interpretSentence(
  sentence: string,
  config: LSystemConfig
): Omit<LSystemResult, "sentence"> {
  const angleRad = THREE.MathUtils.degToRad(config.angle);
  const segments: Segment[] = [];
  const leaves: Leaf[] = [];

  const position = new THREE.Vector3(0, 0, 0);
  const rotation = new THREE.Quaternion();
  const stack: { position: THREE.Vector3; rotation: THREE.Quaternion; depth: number }[] = [];

  const min = new THREE.Vector3(0, 0, 0);
  const max = new THREE.Vector3(0, 0, 0);

  let depth = 0;
  let moved = false;

  for (const char of sentence) {
    if (char === "F") {
      const direction = UP.clone().applyQuaternion(rotation).normalize();
      const next = position.clone().addScaledVector(direction, config.step);
      const radius = Math.max(0.01, config.width * Math.pow(0.9, depth));
      const segmentVector = next.clone().sub(position);
      const length = segmentVector.length();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        UP,
        segmentVector.clone().normalize()
      );
      const mid = position.clone().addScaledVector(direction, config.step * 0.5);
      segments.push({
        start: position.clone(),
        end: next.clone(),
        mid,
        quaternion,
        radius,
        length,
        depth,
        exposure: 1,
      });
      position.copy(next);
      min.min(position);
      max.max(position);
      moved = true;
      if (segments.length >= config.maxSegments) {
        break;
      }
      continue;
    }

    if (char === "+") {
      rotation.multiply(new THREE.Quaternion().setFromAxisAngle(Z_AXIS, angleRad));
      continue;
    }
    if (char === "-") {
      rotation.multiply(new THREE.Quaternion().setFromAxisAngle(Z_AXIS, -angleRad));
      continue;
    }
    if (char === "&" && config.enablePitch) {
      rotation.multiply(new THREE.Quaternion().setFromAxisAngle(X_AXIS, angleRad));
      continue;
    }
    if (char === "^" && config.enablePitch) {
      rotation.multiply(new THREE.Quaternion().setFromAxisAngle(X_AXIS, -angleRad));
      continue;
    }
    if (char === "/" && config.enableRoll) {
      rotation.multiply(new THREE.Quaternion().setFromAxisAngle(Y_AXIS, angleRad));
      continue;
    }
    if (char === "\\" && config.enableRoll) {
      rotation.multiply(new THREE.Quaternion().setFromAxisAngle(Y_AXIS, -angleRad));
      continue;
    }
    if (char === "[") {
      stack.push({ position: position.clone(), rotation: rotation.clone(), depth });
      depth += 1;
      moved = false;
      continue;
    }
    if (char === "]") {
      if (moved) {
        leaves.push({ position: position.clone(), exposure: 1, size: config.width * 3.2 });
      }
      const previous = stack.pop();
      if (previous) {
        position.copy(previous.position);
        rotation.copy(previous.rotation);
        depth = previous.depth;
      }
      moved = false;
    }
  }

  if (moved) {
    leaves.push({ position: position.clone(), exposure: 1, size: config.width * 3.2 });
  }

  const center = new THREE.Vector3(
    (min.x + max.x) / 2,
    (min.y + max.y) / 2,
    (min.z + max.z) / 2
  );

  return {
    segments,
    leaves,
    bounds: { min, max, center },
  };
}
