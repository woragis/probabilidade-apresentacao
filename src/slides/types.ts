export type SlideSection =
  | "abertura"
  | "fundamentos"
  | "encontros"
  | "caes"
  | "xadrez"
  | "war"
  | "sintese";

export const SECTION_LABELS: Record<SlideSection, string> = {
  abertura: "Abertura",
  fundamentos: "Fundamentos",
  encontros: "Encontros",
  caes: "Cães & Bayes",
  xadrez: "Xadrez",
  war: "War",
  sintese: "Síntese",
};

export type SlideDef = {
  id: string;
  section: SlideSection;
  title: string;
  /** When true, Space should not advance (simulator owns space for roll etc.) — still arrows work */
  captureSpace?: boolean;
};
