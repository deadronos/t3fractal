/**
 * Factory for creating and managing fractal CPU worker instances
 * Handles worker lifecycle, message typing, and cleanup
 */

import type {
  WorkerRequest,
  WorkerResponse,
} from "@/workers/fractalCpu.worker";

export type TileCallback = (tile: {
  y: number;
  height: number;
  width: number;
  buffer: ArrayBuffer;
}) => void;

export type DoneCallback = () => void;

export interface FractalWorkerInstance {
  postMessage: (request: WorkerRequest) => void;
  onTile: (callback: TileCallback) => void;
  onDone: (callback: DoneCallback) => void;
  terminate: () => void;
}

/**
 * Create a new fractal CPU worker with typed message interfaces
 * @returns Worker instance with typed API
 */
export function createFractalWorker(): FractalWorkerInstance {
  // Create worker using Vite's worker import syntax
  // Note: The ?worker suffix tells Vite to bundle this as a worker
  const worker = new Worker(
    new URL("@/workers/fractalCpu.worker.ts", import.meta.url),
    { type: "module" },
  );

  let tileCallback: TileCallback | null = null;
  let doneCallback: DoneCallback | null = null;

  // Set up message handler
  worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
    const msg = event.data;

    if (msg.type === "tile") {
      if (tileCallback) {
        tileCallback({
          y: msg.y,
          height: msg.height,
          width: msg.width,
          buffer: msg.buffer,
        });
      }
    } else if (msg.type === "done") {
      if (doneCallback) {
        doneCallback();
      }
    }
  };

  return {
    postMessage: (request: WorkerRequest) => {
      worker.postMessage(request);
    },

    onTile: (callback: TileCallback) => {
      tileCallback = callback;
    },

    onDone: (callback: DoneCallback) => {
      doneCallback = callback;
    },

    terminate: () => {
      tileCallback = null;
      doneCallback = null;
      worker.terminate();
    },
  };
}

/**
 * Fallback worker creation using Blob URL for environments
 * that don't support module workers
 * @param workerCode - Worker code as string
 * @returns Object with worker and cleanup function
 */
export function createFractalWorkerFromBlob(
  workerCode: string,
): { worker: Worker; cleanup: () => void } {
  const blob = new Blob([workerCode], { type: "application/javascript" });
  const objectUrl = URL.createObjectURL(blob);
  const worker = new Worker(objectUrl);

  return {
    worker,
    cleanup: () => {
      URL.revokeObjectURL(objectUrl);
    },
  };
}
