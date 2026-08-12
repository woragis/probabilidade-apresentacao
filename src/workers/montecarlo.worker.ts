/// <reference lib="webworker" />

import { confidenceInterval95 } from "../lib/math/montecarlo";
import { simulateConquest } from "../lib/math/war";

export type BernoulliRequest = {
  id: string;
  type: "bernoulli";
  n: number;
  p: number;
};

export type WarConquestRequest = {
  id: string;
  type: "warConquest";
  n: number;
  attackerTroops: number;
  defenderTroops: number;
};

export type WorkerRequest = BernoulliRequest | WarConquestRequest;

export type WorkerJob = Omit<BernoulliRequest, "id"> | Omit<WarConquestRequest, "id">;

export type WorkerResponse = {
  id: string;
  hits: number;
  n: number;
  pHat: number;
  ci95: { low: number; high: number };
};

self.onmessage = (ev: MessageEvent<WorkerRequest>) => {
  const msg = ev.data;
  let hits = 0;
  const n = msg.n;

  if (msg.type === "bernoulli") {
    for (let i = 0; i < n; i++) {
      if (Math.random() < msg.p) hits++;
    }
  } else if (msg.type === "warConquest") {
    for (let i = 0; i < n; i++) {
      if (simulateConquest(msg.attackerTroops, msg.defenderTroops)) hits++;
    }
  }

  const pHat = n > 0 ? hits / n : 0;
  const response: WorkerResponse = {
    id: msg.id,
    hits,
    n,
    pHat,
    ci95: confidenceInterval95(pHat, n),
  };
  self.postMessage(response);
};
