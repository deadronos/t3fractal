import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore } from "@/store/gameStore";

describe("Game Store", () => {
  beforeEach(() => {
    // Reset the store before each test
    useGameStore.getState().resetGame();
  });

  describe("Resource Management", () => {
    it("should initialize with default fractal data", () => {
      const state = useGameStore.getState();
      expect(state.fractalData).toBe(42);
    });

    it("should add fractal data", () => {
      const { addFractalData } = useGameStore.getState();
      addFractalData(10);
      expect(useGameStore.getState().fractalData).toBe(52);
    });

    it("should spend fractal data when sufficient", () => {
      const { spendFractalData } = useGameStore.getState();
      const success = spendFractalData(20);
      expect(success).toBe(true);
      expect(useGameStore.getState().fractalData).toBe(22);
    });

    it("should not spend fractal data when insufficient", () => {
      const { spendFractalData } = useGameStore.getState();
      const success = spendFractalData(100);
      expect(success).toBe(false);
      expect(useGameStore.getState().fractalData).toBe(42);
    });

    it("should manage dimensional points", () => {
      const { addDimensionalPoints, spendDimensionalPoints } =
        useGameStore.getState();
      addDimensionalPoints(10);
      expect(useGameStore.getState().dimensionalPoints).toBe(10);

      const success = spendDimensionalPoints(5);
      expect(success).toBe(true);
      expect(useGameStore.getState().dimensionalPoints).toBe(5);
    });
  });

  describe("Exploration State", () => {
    it("should manage depth", () => {
      const { setDepth, incrementDepth } = useGameStore.getState();
      setDepth(5);
      expect(useGameStore.getState().depth).toBe(5);

      incrementDepth(2);
      expect(useGameStore.getState().depth).toBe(7);
    });

    it("should not allow negative depth", () => {
      const { setDepth } = useGameStore.getState();
      setDepth(-5);
      expect(useGameStore.getState().depth).toBe(0);
    });

    it("should update complex parameters", () => {
      const { setComplexParameter } = useGameStore.getState();
      setComplexParameter({ real: -0.5 });
      const param = useGameStore.getState().complexParameter;
      expect(param.real).toBe(-0.5);
      expect(param.imaginary).toBe(0.11); // Should retain old value
    });
  });

  describe("Upgrades", () => {
    it("should initialize upgrades at zero", () => {
      const { upgrades } = useGameStore.getState();
      expect(upgrades.probe).toBe(0);
      expect(upgrades.processor).toBe(0);
      expect(upgrades.stabilizer).toBe(0);
    });

    it("should increment upgrade levels", () => {
      const { incrementUpgrade } = useGameStore.getState();
      incrementUpgrade("probe");
      incrementUpgrade("probe");
      expect(useGameStore.getState().upgrades.probe).toBe(2);
    });

    it("should reset upgrades", () => {
      const { incrementUpgrade, resetUpgrades } = useGameStore.getState();
      incrementUpgrade("probe");
      incrementUpgrade("processor");
      resetUpgrades();
      const { upgrades } = useGameStore.getState();
      expect(upgrades.probe).toBe(0);
      expect(upgrades.processor).toBe(0);
    });
  });

  describe("Activity Log", () => {
    it("should push log messages", () => {
      const { pushActivityLog } = useGameStore.getState();
      pushActivityLog("Test message 1");
      pushActivityLog("Test message 2");
      const { activityLog } = useGameStore.getState();
      expect(activityLog[0]).toBe("Test message 2");
      expect(activityLog[1]).toBe("Test message 1");
    });

    it("should limit log to 6 entries", () => {
      const { pushActivityLog } = useGameStore.getState();
      for (let i = 0; i < 10; i++) {
        pushActivityLog(`Message ${i}`);
      }
      const { activityLog } = useGameStore.getState();
      expect(activityLog.length).toBe(6);
    });
  });

  describe("Ascension", () => {
    it("should perform ascension correctly", () => {
      const { setDepth, addFractalData, incrementUpgrade, performAscension } =
        useGameStore.getState();

      setDepth(10);
      addFractalData(1000);
      incrementUpgrade("probe");
      incrementUpgrade("processor");

      performAscension(5);

      const state = useGameStore.getState();
      expect(state.ascensionLevel).toBe(1);
      expect(state.dimensionalPoints).toBe(5);
      expect(state.depth).toBe(0);
      expect(state.upgrades.probe).toBe(0);
      expect(state.upgrades.processor).toBe(0);
      expect(state.fractalData).toBe(115); // 40 + 5 * 15
    });
  });

  describe("Anomalies and Resonance", () => {
    it("should manage anomalies", () => {
      const { addAnomalies, removeAnomaly, setAnomalies } =
        useGameStore.getState();
      
      addAnomalies(3);
      expect(useGameStore.getState().anomalies).toBe(3);
      
      removeAnomaly();
      expect(useGameStore.getState().anomalies).toBe(2);
      
      setAnomalies(0);
      expect(useGameStore.getState().anomalies).toBe(0);
    });

    it("should manage resonance", () => {
      const { setResonance, addResonance } = useGameStore.getState();
      
      setResonance(10);
      expect(useGameStore.getState().resonance).toBe(10);
      
      addResonance(5);
      expect(useGameStore.getState().resonance).toBe(15);
    });
  });

  describe("Event Countdown", () => {
    it("should decrement event countdown", () => {
      const { setEventCountdown, decrementEventCountdown } =
        useGameStore.getState();
      
      setEventCountdown(10);
      const newValue = decrementEventCountdown();
      expect(newValue).toBe(9);
      expect(useGameStore.getState().eventCountdown).toBe(9);
    });

    it("should not go below zero", () => {
      const { setEventCountdown, decrementEventCountdown } =
        useGameStore.getState();
      
      setEventCountdown(0);
      const newValue = decrementEventCountdown();
      expect(newValue).toBe(0);
    });
  });

  describe("Transcendence", () => {
    it("should perform transcendence correctly", () => {
      const {
        setAscensionLevel,
        addDimensionalPoints,
        setDepth,
        addFractalData,
        performTranscendence,
      } = useGameStore.getState();

      setAscensionLevel(5);
      addDimensionalPoints(100);
      setDepth(20);
      addFractalData(5000);

      performTranscendence(3);

      const state = useGameStore.getState();
      expect(state.transcensionLevel).toBe(1);
      expect(state.harmonicCores).toBe(3);
      expect(state.dimensionalPoints).toBe(0);
      expect(state.ascensionLevel).toBe(0);
      expect(state.depth).toBe(0);
      expect(state.fractalData).toBe(120); // 60 + 3 * 20
      expect(state.juliaFlux).toBe(0);
    });
  });
});
