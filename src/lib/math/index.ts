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
  perftSequences,
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
  poissonLambda,
} from "./encounters";
export type { CityKey, CityProfile, PlaceProfile } from "./encounters";

export {
  confidenceInterval95,
  monteCarloFromHits,
  runBernoulliTrials,
} from "./montecarlo";
export type { MonteCarloResult } from "./montecarlo";
