import type { ComponentType } from "react";
import {
  ChessHookSlide,
  ChessPerftSlide,
  ChessProductSlide,
  ChessSimulatorSlide,
  ChessStateSlide,
  ChessTrapSlide,
} from "./chess";
import {
  DogsBayesSlide,
  DogsChainSlide,
  DogsChartSlide,
  DogsEthicsSlide,
  DogsSimulatorSlide,
  DogsTakeawaySlide,
} from "./dogs";
import {
  BinomialSlide,
  ConfidenceIntervalSlide,
  EncounterHookSlide,
  EncounterModelSlide,
  EncounterMonteCarloSlide,
  EncounterSimulatorSlide,
  PoissonSlide,
} from "./encounters";
import { MonteCarloExplainerSlide } from "./methods";
import {
  BridgeSlide,
  ConditionalSlide,
  SingleDieSlide,
  TwoDiceSlide,
  VennSlide,
  WhatIsProbabilitySlide,
} from "./foundations";
import { PromiseSlide, RoadmapSlide, TitleSlide } from "./opening";
import {
  CreditsSlide,
  DemoQaSlide,
  ImprobableSlide,
  LadderSlide,
  LimitsSlide,
  ThanksSlide,
} from "./synthesis";
import type { SlideDef } from "./types";
import {
  WarChainSlide,
  WarCombatSlide,
  WarHookSlide,
  WarMarkovSlide,
  WarPartitionsSlide,
  WarSimulatorSlide,
} from "./war";

export type SlideEntry = SlideDef & {
  Component: ComponentType;
};

export const SLIDES: SlideEntry[] = [
  { id: "title", section: "abertura", title: "Título", Component: TitleSlide },
  { id: "promise", section: "abertura", title: "Promessa", Component: PromiseSlide },
  { id: "roadmap", section: "abertura", title: "Roteiro", Component: RoadmapSlide },
  {
    id: "what-is-p",
    section: "fundamentos",
    title: "O que é probabilidade",
    Component: WhatIsProbabilitySlide,
  },
  { id: "die", section: "fundamentos", title: "Um dado", Component: SingleDieSlide },
  { id: "two-dice", section: "fundamentos", title: "Dois dados", Component: TwoDiceSlide },
  { id: "venn", section: "fundamentos", title: "Venn", Component: VennSlide },
  {
    id: "conditional",
    section: "fundamentos",
    title: "Condicional",
    Component: ConditionalSlide,
  },
  { id: "bridge", section: "fundamentos", title: "Ponte", Component: BridgeSlide },
  {
    id: "enc-hook",
    section: "encontros",
    title: "Hook encontros",
    Component: EncounterHookSlide,
  },
  {
    id: "enc-model",
    section: "encontros",
    title: "Modelo",
    Component: EncounterModelSlide,
  },
  {
    id: "enc-sim",
    section: "encontros",
    title: "Em quantos dias",
    Component: EncounterSimulatorSlide,
    captureSpace: true,
  },
  {
    id: "binomial",
    section: "encontros",
    title: "Binomial",
    Component: BinomialSlide,
    captureSpace: true,
  },
  {
    id: "poisson",
    section: "encontros",
    title: "Poisson",
    Component: PoissonSlide,
    captureSpace: true,
  },
  {
    id: "mc-what",
    section: "encontros",
    title: "O que é Monte Carlo",
    Component: MonteCarloExplainerSlide,
    captureSpace: true,
  },
  {
    id: "enc-mc",
    section: "encontros",
    title: "Monte Carlo",
    Component: EncounterMonteCarloSlide,
    captureSpace: true,
  },
  {
    id: "ci",
    section: "encontros",
    title: "IC 95%",
    Component: ConfidenceIntervalSlide,
  },
  { id: "dogs-ethics", section: "caes", title: "Framing", Component: DogsEthicsSlide },
  { id: "dogs-chain", section: "caes", title: "Cadeia", Component: DogsChainSlide },
  { id: "dogs-bayes", section: "caes", title: "Bayes", Component: DogsBayesSlide },
  {
    id: "dogs-sim",
    section: "caes",
    title: "Simulator Bayes",
    Component: DogsSimulatorSlide,
  },
  { id: "dogs-chart", section: "caes", title: "Gráfico", Component: DogsChartSlide },
  {
    id: "dogs-takeaway",
    section: "caes",
    title: "Takeaway",
    Component: DogsTakeawaySlide,
  },
  { id: "chess-hook", section: "xadrez", title: "Hook xadrez", Component: ChessHookSlide },
  { id: "chess-trap", section: "xadrez", title: "20ⁿ", Component: ChessTrapSlide },
  { id: "chess-perft", section: "xadrez", title: "Perft", Component: ChessPerftSlide },
  { id: "chess-state", section: "xadrez", title: "Estado", Component: ChessStateSlide },
  {
    id: "chess-product",
    section: "xadrez",
    title: "Produto",
    Component: ChessProductSlide,
  },
  {
    id: "chess-sim",
    section: "xadrez",
    title: "Simulator xadrez",
    Component: ChessSimulatorSlide,
  },
  { id: "war-hook", section: "war", title: "Hook War", Component: WarHookSlide },
  { id: "war-combat", section: "war", title: "Combate", Component: WarCombatSlide },
  { id: "war-chain", section: "war", title: "Cadeia", Component: WarChainSlide, captureSpace: true },
  {
    id: "war-parts",
    section: "war",
    title: "Partições",
    Component: WarPartitionsSlide,
  },
  {
    id: "war-sim",
    section: "war",
    title: "Simulator War",
    Component: WarSimulatorSlide,
    captureSpace: true,
  },
  {
    id: "war-markov",
    section: "markov",
    title: "Markov War",
    Component: WarMarkovSlide,
    captureSpace: true,
  },
  { id: "ladder", section: "sintese", title: "Escada", Component: LadderSlide },
  {
    id: "improbable",
    section: "sintese",
    title: "Improvável",
    Component: ImprobableSlide,
  },
  { id: "limits", section: "sintese", title: "Limites", Component: LimitsSlide },
  { id: "demo", section: "sintese", title: "Demo", Component: DemoQaSlide },
  { id: "credits", section: "sintese", title: "Créditos", Component: CreditsSlide },
  { id: "thanks", section: "sintese", title: "Obrigado", Component: ThanksSlide },
];
