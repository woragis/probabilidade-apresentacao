export {
  factorial,
  factorialBig,
  permutations,
  combinations,
  combinationsBig,
} from "./combinatorics";

export {
  binomialPmf,
  binomialExpected,
  binomialPmfSeries,
  poissonPmf,
  poissonPmfSeries,
} from "./distributions";

export { conditional, bayes, bayesBinary, chainProduct } from "./bayes";

export {
  PERFT_INITIAL,
  naiveUniformSequences,
  naivePathProbability,
  perftSequences,
  uniformOverLeavesProbability,
  pathProbabilityFromBranching,
  log10InversePerft,
  SAMPLE_BRANCHING_PATH,
} from "./chess";

export {
  resolveWarRoll,
  rollDie,
  rollDice,
  diceCounts,
  pAttackerWinsOneVsOne,
  enumerateCombat,
  pConquestExact,
  simulateConquest,
  twoDiceSumPmf,
  warEqualPartitionCount,
} from "./war";

export {
  CITIES,
  observationsPerVisit,
  pNoticeOnce,
  pAtLeastOneReencounter,
  expectedReencounters,
  expectedVisitsUntilFirst,
  visitsUntilCdf,
  calendarDaysFromVisits,
  sampleGeometricTrials,
  poissonLambda,
} from "./encounters";
export type { CityKey, CityProfile, PlaceProfile } from "./encounters";

export {
  confidenceInterval95,
  monteCarloFromHits,
  runBernoulliTrials,
} from "./montecarlo";
export type { MonteCarloResult } from "./montecarlo";

export {
  COMPUTE_NODES_PER_SEC,
  SHANNON_GAME_TREE,
  secondsToEnumerate,
  formatDurationPt,
} from "./compute-scale";
