# Xadrez, War, Markov e síntese (slides 24–43)

## Xadrez

### 24. Hook

Não é “duas pessoas jogarem a Siciliana”.  
É: repetir **lance a lance** uma linha específica, se cada lado sorteasse um lance legal.

**Gancho:** primeiro, a armadilha do 20ⁿ.

---

### 25. Armadilha 20ⁿ

Fala (≈ 30 s):

“O modelo preguiçoso é: sempre 20 lances. Aí a árvore tem 20ⁿ sequências e a chance de um caminho é 1/20ⁿ.  
Na abertura isso **subestima a árvore** — tem mais linhas legais do que 20ⁿ — e **superestima a probabilidade** da linha específica. É o mesmo tipo de erro de denominador da orla.”

**Gancho:** Perft mostra a contagem real.

---

### 26. Perft

Ply = meio-lance. Depth 1 = os 20 das brancas.  
A tabela agora tem 20ⁿ ao lado: a partir de n = 3, razão &lt; 1.  
Perft inclui lances péssimos. Não é o número de Shannon.

**Gancho:** e a ramificação muda a cada estado.

---

### 27. Estado

B(S_t) = quantos lances legais nesta posição.  
No uniforme, P(lance | posição) = 1/B.  
O slider é um caminho **ilustrativo**, não uma partida gravada.

**Gancho:** a partida inteira vira um produto.

---

### 28. Produto

P desta trajetória = produto dos 1/B.  
É **um** caminho, não “a probabilidade do xadrez”.  
Humano não sorteia: teoria de aberturas concentra massa.

**Gancho:** no simulador, ingênuo vs real.

---

### 29. Simulador xadrez

Mostre lado a lado:

- 20ⁿ vs Perft (contagem)  
- 1/20ⁿ vs 1/Perft (chance)

Fala curta:

“1/20ⁿ é maior que 1/Perft: o modelo ingênuo superestima a chance.  
E uniforme ainda não é humano — uma Siciliana é bem mais comum que 1/Perft, mas repetir uma partida inteira continua minúsculo.”

**Gancho:** no War, a mesma ideia aparece em batalhas.

---

## War

### 30. Hook

Com 10 × 5, eu conquisto **este** território?  
War: até 3 dados de cada lado. Não é o jogo inteiro.

**Gancho:** a assimetria dos dados.

---

### 31. Combate — empate não é 50%

Fala (≈ 35 s):

“Dados justos não tornam o combate justo. Um contra um: 15 em 36, porque empate fica com a defesa — não é 50%.  
E 3 contra 3 não é três vezes 1v1: os dados são ordenados, universo 46.656. O defensor perde um pouco menos, em média.  
Risk clássico é 3v2. Aqui é War.”

**Gancho:** agora em sequência de turnos.

---

### 32. Cadeia

Cada rolagem atualiza o par (A, D).  
Atacante para em 1 tropa (deixa a origem).  
O slide mostra quantos dados cada lado está rolando agora.

**Gancho:** além da batalha, o setup já é gigante.

---

### 33. Partições

42 territórios, 6 jogadores nomeados, 7 cada:

42! / (7!)⁶ ≈ **8,57×10²⁸**

Às vezes aparece 1,03×10³¹ — está errado.  
Isso é combinatória do **setup**, não P(conquistar um território).

**Gancho:** Monte Carlo da conquista.

---

### 34. Simulador War

A pergunta do hook, com N batalhas i.i.d.  
p̂ + IC 95%. Defensor até 3 dados.

**Gancho:** agora o mesmo motor nos dois mundos — Markov.

---

## Markov

### 35. O que é Markov (visual)

Fala (≈ 40 s):

“Cadeia de Markov: o amanhã só precisa do hoje.  
Três lugares: casa, orla, faculdade. Cada seta é P(ir para B | estar em A).  
Clique amanhã. O token anda. A história completa não entra na próxima decisão — só o estado atual.

Isso é o mesmo motor do xadrez (posição) e do War (tropas).  
E liga de volta aos encontros: rotina no espaço, não só contagem de pessoas.”

**Gancho:** no tabuleiro, o estado é a posição.

---

### 36. Markov no xadrez

S_t = posição (peças + roque + en passant).  
Lances legais saem só daqui. Jogador pode ter memória; as **regras** não.

**Gancho:** no War, o estado é o par de tropas.

---

### 37. Markov War — a grade

Cada célula é um estado (A, D).  
Verde: D = 0 (conquistou). Âmbar: A = 1 (esgotou).  
Role uma transição: só anda para menos tropas.  
Conquistar = probabilidade de absorção no verde.

**Gancho:** vamos resumir a escada matemática inteira.

---

## Síntese

### 38. Escada

Subimos de fração → processo → simulação.  
Cada degrau teve um mundo: dado, orla, cães, xadrez.

### 39. Improvável ≠ impossível

10⁻⁶ não é zero.  
E[X] = N p: orla, Perft, 10×5 — com N grande o esperado deixa de ser desprezível.

### 40. Limites — falar com honestidade

Três (agora quatro) limites que impedem conclusão errada:

1. Parâmetro editável **≠** medição empírica.  
2. **Fluxo/hora ≠ população efetiva** — 1.200/h na orla não são as mesmas 1.200 toda hora.  
3. População da cidade **≠** denominador do encontro no calçadão.  
4. **P(raça | fatal) ≠ P(fatal | raça).**

Se sobrar 15 segundos, repita o item 2 — é o que salvou o bloco de encontros de parecer milagre.

### 41. Demo livre

Podemos voltar para qualquer simulador e testar hipótese da turma.  
Sugestão se perguntarem de encontros: “e se o N for metade?” — mexe no slider ao vivo.

### 42. Créditos

Fontes, parâmetros de modelo e stack — sem fingir que todo número é censo.

### 43. Obrigado

Obrigado.  
A pergunta permanece: quando algo parece impossível, **qual foi a cadeia de probabilidades** — e **qual era o denominador** — por trás?

Q&A.
