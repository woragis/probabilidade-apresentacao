"use client";

type Props = {
  label: string;
  kind: "observado" | "derivado" | "parâmetro do modelo";
};

const COLORS = {
  observado: "border-teal/40 text-teal-muted",
  derivado: "border-amber/40 text-amber",
  "parâmetro do modelo": "border-cream/25 text-cream/55",
};

export function DataLabel({ label, kind }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-[10px] tracking-wide uppercase ${COLORS[kind]}`}
    >
      <span className="opacity-70">{kind}</span>
      <span className="normal-case tracking-normal text-cream/80">{label}</span>
    </span>
  );
}
