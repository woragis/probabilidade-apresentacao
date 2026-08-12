export type CityKey = "jp" | "recife" | "sp" | "tokyo" | "timesSquare";

export type CityProfile = {
  key: CityKey;
  name: string;
  /** City population — contextual only, NOT encounter denominator */
  population: number;
  populationLabel: "observado";
  places: {
    id: string;
    name: string;
    /** Pedestrians per hour in the place (model parameter) */
    flowPerHour: number;
    flowLabel: "parâmetro do modelo" | "derivado";
  }[];
};

export const CITIES: CityProfile[] = [
  {
    key: "jp",
    name: "João Pessoa",
    population: 897_633,
    populationLabel: "observado",
    places: [
      { id: "orla", name: "Orla", flowPerHour: 1_200, flowLabel: "parâmetro do modelo" },
      { id: "centro", name: "Centro", flowPerHour: 2_500, flowLabel: "parâmetro do modelo" },
      { id: "faculdade", name: "Faculdade", flowPerHour: 800, flowLabel: "parâmetro do modelo" },
    ],
  },
  {
    key: "recife",
    name: "Recife",
    population: 1_588_376,
    populationLabel: "observado",
    places: [
      { id: "centro", name: "Centro", flowPerHour: 4_000, flowLabel: "parâmetro do modelo" },
      { id: "boa-viagem", name: "Boa Viagem", flowPerHour: 3_200, flowLabel: "parâmetro do modelo" },
    ],
  },
  {
    key: "sp",
    name: "São Paulo",
    population: 11_904_961,
    populationLabel: "observado",
    places: [
      { id: "paulista", name: "Av. Paulista", flowPerHour: 12_000, flowLabel: "parâmetro do modelo" },
      { id: "centro", name: "Centro", flowPerHour: 15_000, flowLabel: "parâmetro do modelo" },
    ],
  },
  {
    key: "tokyo",
    name: "Tóquio",
    population: 14_299_726,
    populationLabel: "observado",
    places: [
      { id: "shibuya", name: "Shibuya", flowPerHour: 25_000, flowLabel: "parâmetro do modelo" },
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
      },
    ],
  },
];

/**
 * Probability of "noticing" a specific target person during one visit,
 * under independent uniform mixing in the place flow.
 *
 * Model: each hour you effectively sample `observeRate` people from the hourly flow.
 * p_hour ≈ 1 - (1 - 1/flow)^observeRate ≈ observeRate / flow for small rates.
 * Then p_visit = 1 - (1 - p_hour)^hours.
 */
export function pNoticeOnce(opts: {
  flowPerHour: number;
  hours: number;
  observeRatePerHour: number;
}): number {
  const { flowPerHour, hours, observeRatePerHour } = opts;
  if (flowPerHour <= 0 || hours <= 0) return 0;
  const pHour = 1 - Math.pow(1 - 1 / flowPerHour, observeRatePerHour);
  return 1 - Math.pow(1 - pHour, hours);
}

/**
 * Probability of at least one re-encounter across `visits` independent visits,
 * given per-visit notice probability p.
 * X ~ Bin(visits, p); P(X ≥ 1) = 1 - (1-p)^visits
 */
export function pAtLeastOneReencounter(pVisit: number, visits: number): number {
  if (visits <= 0) return 0;
  return 1 - Math.pow(1 - pVisit, visits);
}

/** Expected re-encounters E[X] = n p */
export function expectedReencounters(pVisit: number, visits: number): number {
  return visits * pVisit;
}

/**
 * Poisson rate for rare notices: λ = hours * observeRate / flow
 * (approximation when observeRate << flow)
 */
export function poissonLambda(opts: {
  flowPerHour: number;
  hours: number;
  observeRatePerHour: number;
}): number {
  return (opts.hours * opts.observeRatePerHour) / Math.max(1, opts.flowPerHour);
}
