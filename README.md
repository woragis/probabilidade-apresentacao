# Quão improvável é o acaso?

Apresentação interativa (Next.js) para a disciplina de Probabilidade — exploração de dados, encontros casuais, xadrez, War, Bayes, Monte Carlo e cadeias de Markov.

## Dev

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy

Vercel no próprio repo (`output: "export"`). No dashboard, deixe **Output Directory vazio** — o preset Next.js já serve `/`.

Falas no celular: [`/roteiro`](https://probabilidade.woragis.me/roteiro).

## Controles (projetor)

| Tecla | Ação |
|-------|------|
| → / Espaço / PageDown | Próximo slide |
| ← / PageUp | Slide anterior |
| Home | Primeiro slide |
| End | Último slide |
| `?s=12` na URL | Ir direto ao slide 12 (ensaio) |

Cliques ficam reservados a simulators e toggles.

**43 slides** · seções: Abertura → Fundamentos → Encontros → Cães & Bayes → Xadrez → War → Markov → Síntese.

Mídia: ver [`content/media-manifest.md`](content/media-manifest.md).

## Scripts

```bash
npm run build
npm run test
```

## Stack

Next.js (App Router) · TypeScript · Tailwind · Framer Motion · KaTeX · Recharts · Zustand
