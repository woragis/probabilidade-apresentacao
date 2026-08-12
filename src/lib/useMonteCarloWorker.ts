"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WorkerJob, WorkerRequest, WorkerResponse } from "@/workers/montecarlo.worker";

export function useMonteCarloWorker() {
  const workerRef = useRef<Worker | null>(null);
  const pending = useRef(new Map<string, (r: WorkerResponse) => void>());
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/montecarlo.worker.ts", import.meta.url),
      { type: "module" },
    );
    workerRef.current = worker;
    worker.onmessage = (ev: MessageEvent<WorkerResponse>) => {
      const resolve = pending.current.get(ev.data.id);
      if (resolve) {
        pending.current.delete(ev.data.id);
        resolve(ev.data);
      }
      if (pending.current.size === 0) setRunning(false);
    };
    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const run = useCallback((req: WorkerJob) => {
    return new Promise<WorkerResponse>((resolve, reject) => {
      const worker = workerRef.current;
      if (!worker) {
        reject(new Error("Worker not ready"));
        return;
      }
      const id = crypto.randomUUID();
      pending.current.set(id, resolve);
      setRunning(true);
      const message = { ...req, id } as WorkerRequest;
      worker.postMessage(message);
    });
  }, []);

  return { run, running };
}
