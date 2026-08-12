export type MonteCarloResult = {
  n: number;
  hits: number;
  pHat: number;
  ci95: { low: number; high: number };
};

/** Wald 95% CI for a proportion */
export function confidenceInterval95(pHat: number, n: number): { low: number; high: number } {
  if (n <= 0) return { low: NaN, high: NaN };
  const se = Math.sqrt((pHat * (1 - pHat)) / n);
  const z = 1.96;
  return {
    low: Math.max(0, pHat - z * se),
    high: Math.min(1, pHat + z * se),
  };
}

export function monteCarloFromHits(hits: number, n: number): MonteCarloResult {
  const pHat = n > 0 ? hits / n : 0;
  return { n, hits, pHat, ci95: confidenceInterval95(pHat, n) };
}

/** Run n Bernoulli trials with success probability p (main thread / tests). */
export function runBernoulliTrials(n: number, p: number, rng = Math.random): MonteCarloResult {
  let hits = 0;
  for (let i = 0; i < n; i++) {
    if (rng() < p) hits++;
  }
  return monteCarloFromHits(hits, n);
}
