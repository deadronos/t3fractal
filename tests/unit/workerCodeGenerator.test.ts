import { describe, it, expect } from "vitest";
import { generateWorkerCode } from "@/lib/fractal/workerCodeGenerator";

describe("workerCodeGenerator", () => {
  it("should generate code that correctly handles aspect ratio", () => {
    const code = generateWorkerCode();

    // We expect the real component calculation to use height for normalization
    // to match the imaginary component and ensure square pixels.
    // The incorrect code uses width: (0.5 * zoom * width)
    // The correct code should use height: (0.5 * zoom * height)

    // Note: checking for exact string match requires matching whitespace exactly as generated.
    const correctCalculation = "const realComponent = (px - width/2) / (0.5 * zoom * height) + centerReal;";
    const incorrectCalculation = "const realComponent = (px - width/2) / (0.5 * zoom * width) + centerReal;";

    // This assertion will fail until the bug is fixed
    expect(code).toContain(correctCalculation);
    expect(code).not.toContain(incorrectCalculation);
  });
});
