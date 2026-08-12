export type CityKey = "jp" | "recife" | "sp" | "tokyo" | "timesSquare";

export type PlaceProfile = {
  id: string;
  name: string;
  /**
   * Pedestrians per hour — intensity / turnover hint, NOT the encounter
   * denominator. Useful to motivate how large the effective pool can get.
   */
  flowPerHour: number;
  flowLabel: "parâmetro do modelo" | "derivado";
  /**
   * Distinct people who circulate in this place over the relevant horizon
   * (days/weeks of visits). This is the sampling universe for noticing a
   * specific target. Always ≫ flowPerHour for open public spaces.
   */
  effectivePopulation: number;
  populationLabel: "parâmetro do modelo" | "derivado";
};

export type CityProfile = {
  key: CityKey;
  name: string;
  /** City population — contextual only, NOT encounter denominator */
  population: number;
  populationLabel: "observado";
  places: PlaceProfile[];
};

export const CITIES: CityProfile[] = [
  {
    key: "jp",
    name: "João Pessoa",
    population: 897_633,
    populationLabel: "observado",
    places: [
      {
        id: "orla",
        name: "Orla",
        flowPerHour: 1_200,
        flowLabel: "parâmetro do modelo",
        // ~1.2k/h × muitas horas × alta rotatividade de visitantes distintos
        effectivePopulation: 80_000,
        populationLabel: "parâmetro do modelo",
      },
      {
        id: "centro",
        name: "Centro",
        flowPerHour: 2_500,
        flowLabel: "parâmetro do modelo",
        effectivePopulation: 120_000,
        populationLabel: "parâmetro do modelo",
      },
      {
        id: "faculdade",
        name: "Faculdade",
        flowPerHour: 800,
        flowLabel: "parâmetro do modelo",
        // comunidade mais fechada / recorrente
        effectivePopulation: 10_000,
        populationLabel: "parâmetro do modelo",
      },
    ],
  },
  {
    key: "recife",
    name: "Recife",
    population: 1_588_376,
    populationLabel: "observado",
    places: [
      {
        id: "centro",
        name: "Centro",
        flowPerHour: 4_000,
        flowLabel: "parâmetro do modelo",
        effectivePopulation: 200_000,
        populationLabel: "parâmetro do modelo",
      },
      {
        id: "boa-viagem",
        name: "Boa Viagem",
        flowPerHour: 3_200,
        flowLabel: "parâmetro do modelo",
        effectivePopulation: 150_000,
        populationLabel: "parâmetro do modelo",
      },
    ],
  },
  {
    key: "sp",
    name: "São Paulo",
    population: 11_904_961,
    populationLabel: "observado",
    places: [
      {
        id: "paulista",
        name: "Av. Paulista",
        flowPerHour: 12_000,
        flowLabel: "parâmetro do modelo",
        effectivePopulation: 800_000,
        populationLabel: "parâmetro do modelo",
      },
      {
        id: "centro",
        name: "Centro",
        flowPerHour: 15_000,
        flowLabel: "parâmetro do modelo",
        effectivePopulation: 1_000_000,
        populationLabel: "parâmetro do modelo",
      },
    ],
  },
  {
    key: "tokyo",
    name: "Tóquio",
    population: 14_299_726,
    populationLabel: "observado",
    places: [
      {
        id: "shibuya",
        name: "Shibuya",
        flowPerHour: 25_000,
        flowLabel: "parâmetro do modelo",
        effectivePopulation: 1_500_000,
        populationLabel: "parâmetro do modelo",
      },
    ],
  },
  {
    key: "timesSquare",
    name: "Times Square (NY)",
    population: 8_335_897,
    populationLabel: "observado",
    places: [
      {
        id: "times",
        name: "Times Square",
        flowPerHour: 27_500, // ~220k/day busy stretch ≈ model param
        flowLabel: "derivado",
        // ~220k pedestres/dia como universo diário exposto
        effectivePopulation: 220_000,
        populationLabel: "derivado",
      },
    ],
  },
];

/**
 * People noticed in one visit under a constant observe rate.
 */
export function observationsPerVisit(hours: number, observeRatePerHour: number): number {
  return Math.max(0, hours) * Math.max(0, observeRatePerHour);
}

/**
 * Probability of noticing a specific target person during one visit,
 * sampling uniformly (with replacement approximation) from the effective
 * population N of the place — not from the hourly flow.
 *
 * Model: you effectively sample k = hours × observeRate distinct glances
 * from universe N.
 *   p_visit = 1 − (1 − 1/N)^k ≈ k/N when k ≪ N
 *
 * Flow/hour is a different quantity (intensity). Using it as N wrongly
 * assumes the same ~F people return every hour.
 */
export function pNoticeOnce(opts: {
  effectivePopulation: number;
  hours: number;
  observeRatePerHour: number;
}): number {
  const { effectivePopulation: N, hours, observeRatePerHour } = opts;
  if (N <= 0 || hours <= 0 || observeRatePerHour <= 0) return 0;
  const k = observationsPerVisit(hours, observeRatePerHour);
  if (k <= 0) return 0;
  return 1 - Math.pow(1 - 1 / N, k);
}

/**
 * Probability of at least one notice across `visits` independent visits,
 * given per-visit notice probability p.
 * X ~ Bin(visits, p); P(X ≥ 1) = 1 - (1-p)^visits
 */
export function pAtLeastOneReencounter(pVisit: number, visits: number): number {
  if (visits <= 0) return 0;
  return 1 - Math.pow(1 - pVisit, visits);
}

/** Expected notices E[X] = n p */
export function expectedReencounters(pVisit: number, visits: number): number {
  return visits * pVisit;
}

/**
 * Geometric waiting time: trials until first success.
 * E[T] = 1/p. Each visit to the place is one trial.
 */
export function expectedVisitsUntilFirst(pVisit: number): number {
  if (pVisit <= 0) return Number.POSITIVE_INFINITY;
  if (pVisit >= 1) return 1;
  return 1 / pVisit;
}

/**
 * Smallest n with P(T ≤ n) ≥ q for T ~ Geometric(p) (trials until first success).
 * 50% → mediana; 90% → “quase certeza” no modelo.
 */
export function visitsUntilCdf(pVisit: number, q: number): number {
  if (pVisit <= 0) return Number.POSITIVE_INFINITY;
  if (pVisit >= 1 || q <= 0) return 1;
  const clamped = Math.min(Math.max(q, 0), 1 - Number.EPSILON);
  return Math.max(1, Math.ceil(Math.log(1 - clamped) / Math.log(1 - pVisit)));
}

/** Convert visit count to calendar days given how often you return. */
export function calendarDaysFromVisits(visits: number, visitsPerWeek: number): number {
  if (!Number.isFinite(visits) || visitsPerWeek <= 0) return Number.POSITIVE_INFINITY;
  return visits * (7 / visitsPerWeek);
}

/** Inverse-transform sample of Geometric(p): number of visits until first notice. */
export function sampleGeometricTrials(
  pVisit: number,
  rng: () => number = Math.random,
): number {
  if (pVisit <= 0) return Number.POSITIVE_INFINITY;
  if (pVisit >= 1) return 1;
  const u = Math.min(Math.max(rng(), Number.EPSILON), 1 - Number.EPSILON);
  return Math.max(1, Math.ceil(Math.log(1 - u) / Math.log(1 - pVisit)));
}

/**
 * Poisson rate for rare notices across visits:
 * λ = visits × hours × observeRate / N
 * (approximation when k ≪ N per visit)
 */
export function poissonLambda(opts: {
  effectivePopulation: number;
  hours: number;
  observeRatePerHour: number;
  visits?: number;
}): number {
  const visits = opts.visits ?? 1;
  const k = observationsPerVisit(opts.hours, opts.observeRatePerHour);
  return (visits * k) / Math.max(1, opts.effectivePopulation);
}
