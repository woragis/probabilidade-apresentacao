/** Optimistic ceiling: a top machine visiting 10⁹ positions per second. */
export const COMPUTE_NODES_PER_SEC = 1_000_000_000;

/** Shannon’s order-of-magnitude game-tree size (legal games, not Perft). */
export const SHANNON_GAME_TREE = 1e120;

const UNIVERSE_AGE_SECONDS = 13.8e9 * 365.25 * 24 * 3600;

export function secondsToEnumerate(
  nodes: number,
  nps = COMPUTE_NODES_PER_SEC,
): number {
  if (!Number.isFinite(nodes) || nodes < 0) return Number.NaN;
  return nodes / nps;
}

export function formatDurationPt(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "—";
  if (seconds === 0) return "0 s";
  if (seconds < 1e-6) return `${Math.max(1, seconds * 1e9).toFixed(0)} ns`;
  if (seconds < 1e-3) return `${(seconds * 1e6).toFixed(1)} µs`;
  if (seconds < 1) return `${(seconds * 1e3).toFixed(1)} ms`;
  if (seconds < 60) return `${seconds.toFixed(1)} s`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)} min`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} h`;
  const days = seconds / 86400;
  if (days < 365.25) return `${days.toFixed(1)} dias`;
  const years = days / 365.25;
  const universes = seconds / UNIVERSE_AGE_SECONDS;
  if (universes >= 1) return `${universes.toExponential(1)} idades do universo`;
  if (years >= 1000) return `${years.toExponential(1)} anos`;
  return `${Math.round(years).toLocaleString("pt-BR")} anos`;
}
