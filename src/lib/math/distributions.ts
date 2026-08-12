import { combinations } from "./combinatorics";

/** P(X = k) for X ~ Bin(n, p) */
export function binomialPmf(n: number, k: number, p: number): number {
  if (k < 0 || k > n) return 0;
  if (p <= 0) return k === 0 ? 1 : 0;
  if (p >= 1) return k === n ? 1 : 0;
  return combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

export function binomialExpected(n: number, p: number): number {
  return n * p;
}

/** Log-PMF for numerical stability when building histograms */
export function binomialPmfSeries(n: number, p: number): number[] {
  const out: number[] = [];
  for (let k = 0; k <= n; k++) out.push(binomialPmf(n, k, p));
  return out;
}

/** P(X = k) for X ~ Poisson(λ) */
export function poissonPmf(lambda: number, k: number): number {
  if (k < 0 || lambda < 0) return 0;
  if (lambda === 0) return k === 0 ? 1 : 0;
  // recursive: P(k) = P(k-1) * λ / k
  let p = Math.exp(-lambda);
  for (let i = 1; i <= k; i++) p *= lambda / i;
  return p;
}

export function poissonPmfSeries(lambda: number, maxK: number): number[] {
  const out: number[] = [];
  for (let k = 0; k <= maxK; k++) out.push(poissonPmf(lambda, k));
  return out;
}
