/**
 * WebGL shader materials for fractal rendering
 * Handles GPU-based Mandelbrot set computation with smooth coloring
 */

import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import type { ThreeElement } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Vertex shader for fractal rendering
 * Passes UV coordinates to fragment shader
 */
const vertexShader = /* language=GLSL */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

/**
 * Fragment shader for Mandelbrot set rendering
 * Performs iteration-based computation with smooth coloring
 */
const fragmentShader = /* language=GLSL */ `
  precision highp float;

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform vec2 uCenter;
  uniform float uZoom;
  uniform float uMaxIterations;
  uniform float uPaletteShift;
  uniform float uSaturation;

  const int ITERATION_CAP = 1000;

  vec3 hslToRgb(float h, float s, float l) {
    float c = (1.0 - abs(2.0 * l - 1.0)) * s;
    float hp = h * 6.0;
    float x = c * (1.0 - abs(mod(hp, 2.0) - 1.0));
    vec3 rgb = vec3(0.0);

    if (hp < 1.0) rgb = vec3(c, x, 0.0);
    else if (hp < 2.0) rgb = vec3(x, c, 0.0);
    else if (hp < 3.0) rgb = vec3(0.0, c, x);
    else if (hp < 4.0) rgb = vec3(0.0, x, c);
    else if (hp < 5.0) rgb = vec3(x, 0.0, c);
    else rgb = vec3(c, 0.0, x);

    float m = l - 0.5 * c;
    return rgb + vec3(m);
  }

  void main() {
    // Convert UV to centered coordinates with aspect correction
    vec2 uv = vUv * 2.0 - 1.0;
    float aspect = uResolution.x / uResolution.y;
    uv.x *= aspect;

    vec2 c = vec2(
      uCenter.x + uv.x / uZoom,
      uCenter.y + uv.y / uZoom
    );

    vec2 z = vec2(0.0);
    float maxIter = clamp(uMaxIterations, 1.0, float(ITERATION_CAP));
    float iter = maxIter;

    for (int i = 0; i < ITERATION_CAP; i++) {
      if (float(i) >= maxIter) {
        break;
      }

      float x = z.x * z.x - z.y * z.y + c.x;
      float y = 2.0 * z.x * z.y + c.y;
      z = vec2(x, y);

      if (dot(z, z) > 4.0) {
        iter = float(i);
        break;
      }
    }

    if (iter == maxIter) {
      vec3 interior = hslToRgb(mod(uPaletteShift / 360.0, 1.0), uSaturation, 0.05);
      gl_FragColor = vec4(interior, 1.0);
      return;
    }

    float smoothIter = iter;
    float zn = length(z);
    if (zn > 0.0) {
      smoothIter = iter + 1.0 - log(log(zn)) / log(2.0);
    }
    float normalised = smoothIter / maxIter;
    float hue = mod((uPaletteShift + 360.0 * pow(normalised, 0.6)) / 360.0, 1.0);
    float lightness = clamp(0.4 + normalised * 0.5, 0.1, 0.95);
    vec3 color = hslToRgb(hue, clamp(uSaturation, 0.0, 1.0), lightness);
    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * Default uniforms for the fractal shader material
 */
const defaultUniforms = {
  uResolution: new THREE.Vector2(1, 1),
  uCenter: new THREE.Vector2(0, 0),
  uZoom: 1,
  uMaxIterations: 100,
  uPaletteShift: 0,
  uSaturation: 0.7,
};

/**
 * Create and register the fractal shader material
 */
export const FractalMaterial = shaderMaterial(
  defaultUniforms,
  vertexShader,
  fragmentShader,
);

// Register the material with react-three-fiber
extend({ FractalMaterial });

/**
 * Type definitions for fractal material uniforms
 */
export type FractalMaterialUniforms = {
  uResolution: { value: THREE.Vector2 };
  uCenter: { value: THREE.Vector2 };
  uZoom: { value: number };
  uMaxIterations: { value: number };
  uPaletteShift: { value: number };
  uSaturation: { value: number };
};

/**
 * Type for fractal material instance with uniforms
 */
export type FractalMaterialInstance = InstanceType<typeof FractalMaterial> & {
  uniforms: FractalMaterialUniforms;
};

/**
 * Module augmentation for react-three-fiber to include our custom material
 */
declare module "@react-three/fiber" {
  interface ThreeElements {
    fractalMaterial: ThreeElement<typeof FractalMaterial>;
  }
}
