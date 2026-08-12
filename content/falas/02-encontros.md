# Encontros (slides 10–16)

Este é o bloco em que a turma mais desconfia do número — e com razão se o modelo estiver errado.  
**Leia com atenção a seção “Armadilha do fluxo”.** Vale ensaiar em voz alta.

---

## 10. Hook — “Vou ver essa pessoa de novo?”

Pergunta simples, quase de novela:

> Qual a chance de eu rever **exatamente aquela pessoa**?

Não é “encontrar alguém bonito”. É **uma pessoa específica**.

A resposta **não** começa pela população da cidade.  
João Pessoa ter ~900 mil habitantes não diz quase nada sobre a orla naquele horário.

**Gancho (falar explícito):**

> Cuidado: fluxo por hora também **não** é o universo de pessoas.

---

## Armadilha do fluxo (falar no hook ou no modelo)

Use isto quase palavra por palavra quando chegar no assunto:

---

### Fala longa (≈ 45–60 s)

“Imagina a orla de João Pessoa com, digamos, mil e duzentas pessoas por hora.  
Se eu usar essas mil e duzentas como se fossem **sempre as mesmas** mil e duzentas, a chance de reencontrar alguém sobe absurdo — tipo noventa e poucos por cento em poucas visitas. Isso cheira mal.

Por quê? Porque fluxo por hora é **taxa**, não conjunto fechado.  
A cada hora passam pessoas **diferentes**. Ao longo de dias e semanas, o universo de quem circula na orla é bem maior — a gente chama de **população efetiva**, o N do modelo.

Então:

- **população da cidade** → contexto, não denominador do calçadão  
- **fluxo por hora (F)** → intensidade: o lugar está cheio ou vazio  
- **N efetivo** → pessoas **distintas** que frequentam aquele lugar no horizonte das suas visitas  

O denominador certo do ‘vou notar aquela pessoa de novo?’ é o N, não o F e não a cidade inteira.”

---

### Fala curta (≈ 20 s) — se estiver sem tempo

“Mil e duzentas por hora na orla **não** são as mesmas mil e duzentas toda hora.  
Fluxo é taxa. O denominador é a população efetiva do lugar — N.  
Cidade inteira também não: você não amostra 900 mil pessoas na beira-mar.”

---

### Número para ancorar (se quiser chocar)

Com defaults didáticos do simulador (2 h, 80 observações/h, 20 visitas):

| Denominador errado / certo | P(ao menos um “acerto”) |
|----------------------------|-------------------------|
| F = 1 200 (pool fechado)   | ~**93%** — suspeito     |
| N ≈ 80 000 (orla aberta)   | ~**4%** — faz mais sentido |

“Se o número sair surrealmente alto, primeiro questione o denominador.”

---

## 11. Modelo em 3 passos

Três camadas, cada uma legendada no slide:

1. **k = h · r** — h = horas, r = rostos/hora, k = olhadelas numa visita.  
2. **p_visita = 1 − (1 − 1/N)^k** — N = pessoas distintas do lugar, não o fluxo/hora.  
3. **P(X ≥ 1) = 1 − (1 − p)^n** — n visitas; independência entre visitas é hipótese.

Enquanto aponta a fórmula:

> “F, o fluxo por hora, mede se o lugar está agitado.  
> N é o universo de amostragem. Confundir F com N é o erro que infla o resultado.”

**Gancho:** agora mexemos nos parâmetros e o número fica vivo.

---

## 12. Simulador — o momento de demonstrar

Pergunta da turma: **vi aquela pessoa; em quantos dias eu veria de novo?**

À esquerda: hipóteses (cidade, lugar, **N efetivo**, horas, **idas por semana**, horizonte, obs/h).  
No centro: **esperança até o 1º reencontro** (geométrica: E[T] = 1/p, convertida em dias).  
À direita: P em n idas, E[X], e **sortear uma história**.

### O que mexer ao vivo (ordem sugerida)

1. **Orla JP**, N padrão (~80k), 3 idas/semana → o esperado são **anos**, não “semana que vem”.  
2. Subir idas/semana → o calendário encolhe; N manda mais que a frequência.  
3. Trocar para **Faculdade** (N menor, ~10k): mesma rotina, espera bem menor.  
4. Clique **Sortear uma história**: uma realização oscila; a média é o número grande.  
5. Opcional: Times Square / SP — N enorme → espera disparatada, mesmo com fluxo alto.

### Fala enquanto compara orla × faculdade

“Cidade grande não é o único fator.  
Na faculdade o fluxo até pode ser menor que na orla, mas o N é menor e a gente volta: o pool é recorrente.  
Por isso ‘cidade grande’ sozinho não explica reencontro — importa **quem compartilha o lugar com você**.”

### Lembrete honesto (10 s)

“Isso ainda é modelo: visitas independentes, mistura uniforme.  
Na vida real tem rotina — trabalho, academia — e isso **aumenta** reencontro. O modelo didático aqui tende a ser conservador nesse ponto.”

**Gancho:** com esse p, vemos a distribuição de repetições.

---

## 13. Binomial

**O que é:** probabilidade binomial = n tentativas iguais, cada uma só **sim ou não**, com a **mesma** chance p, independentes. A variável X é **quantos “sim”** saíram. Ex.: n idas à orla; X = quantas vezes você viu aquela pessoa.

História primeiro, fórmula no rodapé.

Você volta à orla **n vezes**. Cada ida: sim ou não, **mesma p**.  
Clique: cada tile é uma visita (âmbar = viu).  
A barra é a lei; os tiles são **uma** história.

**Gancho:** para eventos raros no tempo, paramos de contar visitas.

---

## 14. Poisson

**O que é:** Poisson (Siméon Denis Poisson) = modelo para **eventos raros numa janela de tempo**. Em vez de n tentativas, uma **taxa** λ: “quantos, em média, neste intervalo”. Os pontos no slide são onde o raro caiu.

Binomial = n tentativas. Poisson = taxa no tempo.  
λ é esse esperado. Sorteie uma janela.  
Na orla com N certo, λ derivado é pequenininho — o raro não explode.

**Gancho:** quando contar tudo é caro, a gente sorteia.

---

## 15. O que é Monte Carlo (visual)

**O que é:** Monte Carlo (nome do cassino) = **aproximar uma chance sorteando muitas vezes**, em vez de enumerar o universo. p̂ = acertos / tentativas. Não substitui a fórmula: é a lei dos grandes números no projetor.

Fala (≈ 30 s):

“Não dá para contar tudo? Sorteia.  
Cada célula é um sorteio. Âmbar acertou, teal não.  
p̂ = acertos / tentativas. O próximo slide é isto, com N enorme.”

Clique “sortear 20” umas vezes e mostre p̂ oscilando em direção a 20%.

**Gancho:** agora com N grande, números.

---

## 16. Monte Carlo (escala)

É o slide anterior, com N enorme.  
Teórico = a fórmula. p̂ = frequência dos sorteios. Devem se aproximar.  
Isto é Bernoulli i.i.d. — não o modelo completo da orla.

**Gancho:** com mais N, a incerteza cai.

---

## 17. Intervalo de confiança

A faixa de incerteza **dessa frequência**.  
IC 95% = onde o método acerta ~95% das vezes.  
Aqui p̂ está **fixo em 12%**. Mais n estreita a barra — não “prova mais”.

**Gancho:** agora o bloco mais sensível — cães e Bayes.

---

## Checklist mental antes de sair do bloco

- [ ] Falei que **fluxo/h ≠ N**  
- [ ] Falei que **pop. da cidade ≠ denominador do lugar**  
- [ ] Mostrei orla (N grande) vs faculdade (N menor)  
- [ ] Admiti limite: independência / rotina real
