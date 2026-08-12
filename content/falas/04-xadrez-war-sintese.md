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

**O que é:** Perft = **PER**formance **T**est. No xadrez de computador, é a rotina que **conta quantas sequências legais** existem até profundidade n (plies), a partir de uma posição. Serve para testar o gerador de lances — inclui jogadas péssimas. Não é “partidas que humanos jogariam”, nem o número de Shannon (~10¹²⁰ jogos).

Ply = meio-lance. Depth 1 = os 20 das brancas.  
A tabela tem 20ⁿ ao lado: a partir de n = 3, razão &lt; 1.

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

Mostre lado a lado 20ⁿ vs Perft, depois o **relógio**:

- contar Perft(n) a 10⁹ posições/s ainda cabe  
- contar todas as partidas (~10¹²⁰, Shannon) são **idades do universo**

Fala curta:

“Por isso o computador não conta a árvore inteira — ele busca (Stockfish).  
1/20ⁿ superestima a chance. E uniforme ainda não é humano.”

**Gancho:** no War, a mesma ideia — e lá a máquina consegue prever.

---

## War

### 30. Hook

10 exércitos no seu território, 5 no do vizinho.  
**Ganha** se o defensor chegar a 0.  
**Para (não conquistou)** se você ficar com 1 — deixa alguém na origem.  
Não é o mapa inteiro.

**Gancho:** como se compara os dados.

---

### 31. Combate — como se joga

Fala (≈ 40 s):

“Rola até 3 dados. Ordena do maior para o menor. Compara par a par.  
Maior estrito ganha; empate fica com a defesa.  
Exemplo no slide: 6-4-2 contra 5-4-1 → A perde 1, D perde 2.  
Por isso 1v1 é 15 em 36, não 50%. 3v3 não é três vezes 1v1.”

**Gancho:** agora em sequência de turnos.

---

### 32. Cadeia

Começa 8 contra 4. Cada clique é uma rolagem.  
D = 0: conquistou. A = 1: parou — o território continua do defensor.

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

O computador **já prevê**: p exato da cadeia (A, D).  
Enumerar um 3v3 são microssegundos — no xadrez a árvore inteira não cabe.  
Monte Carlo confere (p̂ + IC).

**Gancho:** agora o mesmo motor nos dois mundos — Markov.

---

## Markov

### 35. O que é Markov (visual)

Fala (≈ 35 s):

“Não precisa da lista da semana. Onde você está **hoje** já diz as chances de amanhã.  
Clique Amanhã. Só as setas que saem do círculo âmbar importam.  
A trilha é memória para nós; a máquina ignora.

Depois: xadrez = a posição agora. War = as tropas agora. Mesma máquina.”

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
