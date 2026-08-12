"use client";

import { Hint } from "@/components/deck/Hint";

type Props = {
  label: string;
  kind: "observado" | "derivado" | "parâmetro do modelo";
  hint?: string;
};

const COLORS = {
  observado: "border-teal/40 text-teal-muted",
  derivado: "border-amber/40 text-amber",
  "parâmetro do modelo": "border-cream/25 text-cream/55",
};

const KIND_HINT: Record<Props["kind"], string> = {
  observado: "Número com fonte externa (censo, contagem publicada). Não é o denominador do modelo de reencontro.",
  derivado: "Calculado a partir de um dado observado — por exemplo, pedestres/dia dividido em horas de pico.",
  "parâmetro do modelo":
    "Hipótese didática, não medição. Você pode (e deve) mexer: o ponto é ver como o resultado reage, não tratar o valor como verdade empírica.",
};

export function DataLabel({ label, kind, hint }: Props) {
  return (
    <Hint title={kind} body={hint ?? KIND_HINT[kind]} side="bottom">
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-[10px] tracking-wide uppercase ${COLORS[kind]}`}
      >
        <span className="opacity-70">{kind}</span>
        <span className="normal-case tracking-normal text-cream/80">{label}</span>
      </span>
    </Hint>
  );
}
