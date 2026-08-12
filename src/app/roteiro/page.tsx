import type { Metadata } from "next";
import Link from "next/link";
import { loadFalaChapters } from "@/lib/falas";

export const metadata: Metadata = {
  title: "Roteiro · Falas",
  description: "Falas da apresentação Quão improvável é o acaso? — para ensaiar no celular.",
};

export default function RoteiroPage() {
  const chapters = loadFalaChapters();

  return (
    <div className="min-h-dvh bg-ink text-cream">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-teal-muted uppercase">Falas</p>
            <h1 className="font-display text-lg leading-tight text-cream">Roteiro</h1>
          </div>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-4 text-sm text-cream/80"
          >
            Deck
          </Link>
        </div>
        <nav
          className="mx-auto flex max-w-xl gap-2 overflow-x-auto px-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Capítulos"
        >
          {chapters.map((ch) => (
            <a
              key={ch.slug}
              href={`#${ch.slug}`}
              className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-white/10 px-4 text-sm text-cream/85"
            >
              {ch.nav}
            </a>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-xl px-4 pt-6 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        {chapters.map((ch) => (
          <section key={ch.slug} id={ch.slug} className="scroll-mt-36 pb-10">
            <div
              className="falas prose-falas"
              dangerouslySetInnerHTML={{ __html: ch.html }}
            />
          </section>
        ))}
      </main>
    </div>
  );
}
