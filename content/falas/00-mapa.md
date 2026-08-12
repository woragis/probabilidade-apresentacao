# Mapa da apresentação

**Título:** Quão improvável é o acaso?  
**Formato:** deck fullscreen (← → / Space) · 43 slides

## Blocos e tempo sugerido

| Bloco | Slides | Tempo | Ideia central |
|-------|--------|-------|---------------|
| Abertura | 1–3 | 2 min | Pergunta + quatro cenários |
| Fundamentos | 4–9 | 5 min | Fração, dado, Venn, condicional |
| **Encontros** | **10–17** | **10 min** | **N efetivo + binomial/Poisson/Monte Carlo visuais** |
| Cães & Bayes | 18–23 | 8 min | Não inverter condicionais |
| Xadrez | 24–31 | 8 min | 20ⁿ vs Perft + **o que é Markov** |
| War | 32–37 | 6 min | Combate + grade de estados |
| Síntese | 38–43 | 4 min | Limites do modelo + Q&A |

## Momento crítico (não pular)

No bloco **Encontros**, pare no simulador e diga em voz alta a armadilha:

> “1200 pessoas por hora na orla **não** são as mesmas 1200 sempre.  
> O denominador é a **população efetiva** do lugar.”

Sem isso, o número no slide parece “mágico demais” e a turma desconfia — com razão.

## Glossário rápido (se a palavra travar)

- **Binomial:** n tentativas iguais, cada uma sim/não com a mesma p. X = quantos “sim”.
- **Poisson:** eventos raros no tempo; λ = quantos, em média, nesta janela. (Siméon Denis Poisson.)
- **Monte Carlo:** aproximar uma chance sorteando muitas vezes. p̂ = acertos / tentativas. (Nome do cassino.)
- **Perft:** PERformance Test — conta sequências legais de n plies no xadrez. Não é Shannon.

## Como ler `e+` no slide

`3.20e+6` = 3,20 × 10⁶ = 3,2 milhões. O número depois do `e` é **quantas casas** a vírgula anda: `e+6` seis para a direita, `e-4` quatro para a esquerda (`1.5e-4` = 0,00015).

Exemplos para falar em voz alta:

- `4.87e+6` → “cerca de 5 milhões”
- `8.50e+10` → “85 bilhões”
- `1.20e-3` → “um milésimo e pouco”
- `2.3e+93` → “2 vezes 10 elevado a 93” — não tente falar o inteiro

## Idade do universo (base do relógio no xadrez)

≈ **13,8 bilhões de anos** (13,8 × 10⁹).  
O simulador (slide 29) assume 10⁹ posições/s. Contar Perft nesta profundidade ainda cabe no relógio. Contar todas as partidas (~10¹²⁰) dá da ordem de **10⁹³ idades do universo** — por isso o computador busca, não enumera.
