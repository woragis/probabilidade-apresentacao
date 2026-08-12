/**
 * Perft leaf counts from the initial chess position (known values).
 * Source: chess programming wiki / Stockfish perft.
 */
export const PERFT_INITIAL: Record<number, number> = {
  1: 20,
  2: 400,
  3: 8_902,
  4: 197_281,
  5: 4_865_609,
  6: 119_060_324,
  7: 3_195_901_860,
  // depth 8+ exceeds safe Number for display; keep as approximate scientific
};

/** Naive uniform branching model: 20^n */
export function naiveUniformSequences(depth: number): number {
  return Math.pow(20, depth);
}

/** Legal sequences to depth n from initial position (Perft). */
export function perftSequences(depth: number): number | null {
  return PERFT_INITIAL[depth] ?? null;
}

/**
 * Probability of one specific path under state-dependent uniform legal moves:
 * P = ∏ 1/B(S_t)
 * When only average branching is known, approximate with geometric mean.
 */
export function pathProbabilityFromBranching(branchingPerPly: number[]): number {
  if (branchingPerPly.length === 0) return 1;
  return branchingPerPly.reduce((p, b) => p / Math.max(1, b), 1);
}

/**
 * Approximate log10 of 1 / Perft(n) — "chance of one random walk matching a fixed line"
 * under uniform-over-legal-at-root-tree interpretation (pedagogical).
 */
export function log10InversePerft(depth: number): number | null {
  const n = perftSequences(depth);
  if (n == null || n <= 0) return null;
  return Math.log10(n);
}

/** Sample illustrative branching factors B(S_t) across a midgame-ish path. */
export const SAMPLE_BRANCHING_PATH = [20, 20, 22, 28, 31, 35, 33, 29, 24, 18];
