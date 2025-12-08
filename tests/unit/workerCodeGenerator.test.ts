import { describe, it, expect } from "vitest";
import { generateWorkerCode } from "@/lib/fractal/workerCodeGenerator";
import fs from 'fs';
import path from 'path';

describe("Worker Logic Aspect Ratio", () => {
  describe("generateWorkerCode", () => {
    it("should generate code that normalizes X coordinate by height to preserve aspect ratio", () => {
      const code = generateWorkerCode();

      // The buggy code divides by width: (0.5 * zoom * width)
      // The correct code should divide by height: (0.5 * zoom * height)
      // This ensures square pixels (1:1 aspect ratio) in the complex plane mapping.

      // We check that the X component calculation uses height in the divisor
      // Matches: const realComponent = (px - width/2) / (0.5 * zoom * height)
      expect(code).toContain("const realComponent = (px - width/2) / (0.5 * zoom * height)");

      // And we explicitly ensure it does NOT use width in the divisor
      expect(code).not.toContain("const realComponent = (px - width/2) / (0.5 * zoom * width)");
    });
  });

  describe("fractalCpu.worker.ts", () => {
    it("should use height for X coordinate normalization", () => {
      // Assuming test runs from repo root
      const workerPath = path.resolve(process.cwd(), 'src/workers/fractalCpu.worker.ts');
      const content = fs.readFileSync(workerPath, 'utf-8');

      // We expect to find (px - width / 2) / (0.5 * zoom * height)
      // Allowing for whitespace variations
      // This regex looks for the calculation of the real component normalizing by height
      const correctPattern = /\(px\s*-\s*width\s*\/\s*2\)\s*\/\s*\(0\.5\s*\*\s*zoom\s*\*\s*height\)/;

      // This regex matches the buggy version normalizing by width
      const buggyPattern = /\(px\s*-\s*width\s*\/\s*2\)\s*\/\s*\(0\.5\s*\*\s*zoom\s*\*\s*width\)/;

      expect(content).toMatch(correctPattern);
      expect(content).not.toMatch(buggyPattern);
    });
  });
});
