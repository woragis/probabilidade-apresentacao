# Talk Track — Quão improvável é o acaso?

Formato por slide:
- **Objetivo**
- **Fala sugerida (20-45s)**
- **Gancho**

## Abertura

### 1. title
- **Objetivo:** Abrir com a pergunta central.
- **Fala sugerida:** "Hoje eu não vou tentar provar que o acaso não existe. Vou mostrar como eventos comuns ficam raros quando a gente empilha condições."
- **Gancho:** "Primeiro, o mapa do que vamos comparar."

### 2. promise
- **Objetivo:** Mostrar os 4 domínios de uma vez.
- **Fala sugerida:** "Vamos passar por encontros, cães e Bayes, xadrez e War. Quatro cenários, mesma matemática."
- **Gancho:** "Antes disso, 5 minutos de base visual."

### 3. roadmap
- **Objetivo:** Dar previsibilidade da jornada.
- **Fala sugerida:** "A ordem é: fundamento curto, depois simuladores, e no fim síntese."
- **Gancho:** "Começando pelo mais simples possível: uma fração."

## Fundamentos

### 4. what-is-p
- **Objetivo:** Fixar probabilidade como fração.
- **Fala sugerida:** "Ω é o universo, A é o que conta. A fração só vale se os resultados forem equiprováveis."
- **Gancho:** "No dado, isso fica direto."

### 5. die
- **Objetivo:** Transformar fórmula em intuição.
- **Fala sugerida:** "Uma face entre seis iguais. Um clique não é frequência; muitos cliques que convergem."
- **Gancho:** "Com dois dados, a geometria muda."

### 6. two-dice
- **Objetivo:** Mostrar que combinações têm pesos diferentes.
- **Fala sugerida:** "7 tem 6 pares; 2 e 12 têm 1. Não é sorte: é contagem."
- **Gancho:** "Agora duas condições juntas."

### 7. venn
- **Objetivo:** Visualizar interseção e não confundir com independência.
- **Fala sugerida:** "O overlap é os dois ao mesmo tempo. O produto P(A)P(B) é independência, não a definição de interseção."
- **Gancho:** "Quando condicionamos, o universo muda."

### 8. conditional
- **Objetivo:** Mostrar que o universo encolhe para B.
- **Fala sugerida:** "Dado que choveu, o resto some. P(A|B) = interseção sobre P(B). O slider é parâmetro, não dado."
- **Gancho:** "No mundo real, empilhar condicionais derruba a probabilidade."

### 9. bridge
- **Objetivo:** Fechar base e entrar nos casos.
- **Fala sugerida:** "Cada 'e também' multiplica e o número despenca. Daqui: orla, cães, xadrez, War."
- **Gancho:** "Vamos testar isso em reencontro de pessoas."

## Encontros

### 10. enc-hook
- **Objetivo:** Criar identificação imediata.
- **Fala sugerida:** "Pergunta simples: qual chance de rever exatamente aquela pessoa?"
- **Gancho:** "Cuidado: fluxo por hora não é o universo de pessoas."

### 11. enc-model
- **Objetivo:** Mostrar o modelo em 3 camadas.
- **Fala sugerida:** "h e r dão k numa visita; N é o universo; n visitas independentes — hipótese. Fluxo/hora é intensidade, não denominador."
- **Gancho:** "Agora mexemos nos parâmetros e vemos o número vivo."

### 12. enc-sim
- **Objetivo:** Responder “vi aquela pessoa — em quantos dias eu veria de novo?”
- **Fala sugerida:** "Cada volta é um sorteio. A espera é geométrica: E[T]=1/p. Na orla, 3 idas/semana, o esperado são anos; na faculdade, bem menos. Sorteie uma história."
- **Gancho:** "Com esse p, vemos a distribuição de repetições."

### 13. binomial
- **Objetivo:** História primeiro: n idas iguais, contar “sim”. Fórmula só no rodapé.
- **Fala sugerida:** "Você volta à orla n vezes. Cada ida é sim ou não, mesma chance. Clique: cada tile é uma visita. A barra é a lei; os tiles são uma história."
- **Gancho:** "Para eventos raros no tempo, paramos de contar visitas."

### 14. poisson
- **Objetivo:** Raro demais para contar visitas — taxa λ na janela.
- **Fala sugerida:** "Binomial = n tentativas. Poisson = taxa no tempo: quantos, em média, nesta janela. Sorteie: os pontos são onde o raro caiu. Na orla com N certo, λ é pequenininho."
- **Gancho:** "Quando contar tudo é caro, a gente sorteia."

### 15. mc-what
- **Objetivo:** Monte Carlo = sortear quando não dá para enumerar.
- **Fala sugerida:** "Não dá para contar tudo? Sorteia. Cada célula é um sorteio. p̂ = acertos / tentativas. O próximo slide é isto, com N enorme."
- **Gancho:** "Agora com N grande, números."

### 16. enc-mc
- **Objetivo:** A mesma ideia do 15, em escala.
- **Fala sugerida:** "É o slide anterior, com N enorme. Teórico = a fórmula; p̂ = frequência. Devem se aproximar. Bernoulli i.i.d. — não o modelo da orla."
- **Gancho:** "E com mais N, a incerteza cai."

### 17. ci
- **Objetivo:** Faixa de incerteza daquela frequência.
- **Fala sugerida:** "A faixa de incerteza dessa frequência. p̂ aqui está fixo em 12%. Mais n estreita a barra — não prova mais."
- **Gancho:** "Agora o bloco mais sensível: cães e Bayes."

## Cães e Bayes

### 18. dogs-ethics
- **Objetivo:** Enquadramento responsável. Olho na cena de rua, não num retrato de raça.
- **Fala sugerida:** "Cena de encontro — pessoa e cão no parque, de costas. Não é retrato de raça. Estamos modelando cenário de risco, não essência. A marca SVG segue nos próximos slides."
- **Gancho:** "Com isso claro, montamos a cadeia."

### 19. dogs-chain
- **Objetivo:** Mostrar multiplicação de fatores.
- **Fala sugerida:** "Multiplicamos porque TODAS as condições precisam acontecer. S, C, R, I. Os números são hipóteses, não censo."
- **Gancho:** "E o erro clássico aparece na leitura das condicionais."

### 20. dogs-bayes
- **Objetivo:** Contrastar duas condicionais.
- **Fala sugerida:** "Dado o fatal, de que grupo veio? não é dado o grupo, qual o risco? Bayes inverte a condicional."
- **Gancho:** "Vamos quantificar com um cenário ajustável."

### 21. dogs-sim
- **Objetivo:** Tornar Bayes palpável.
- **Fala sugerida:** "A é o grupo, B é o sinal. Prior = quão comum; P(B|A) = se A, o sinal; P(B|¬A) = alarme falso. O número grande é P(A|B)."
- **Gancho:** "Agora olhamos o dado observado, sem confundir interpretação."

### 22. dogs-chart
- **Objetivo:** Ler gráfico corretamente.
- **Fala sugerida:** "Esse gráfico é P(raça|fatal). Ele não responde risco individual por raça."
- **Gancho:** "Fechando com a frase-chave."

### 23. dogs-takeaway
- **Objetivo:** Fixar inversão condicional.
- **Fala sugerida:** "Mesmas palavras, sentidos diferentes. É isso que Bayes protege."
- **Gancho:** "No xadrez, veremos outro erro intuitivo clássico."

## Xadrez

### 24. chess-hook
- **Objetivo:** Cravar a pergunta (linha específica, sorteio legal).
- **Fala sugerida:** "Não é duas pessoas jogarem a Siciliana. É repetir lance a lance uma linha específica se cada lado sorteasse um lance legal."
- **Gancho:** "Primeiro, a armadilha do 20ⁿ."

### 25. chess-trap
- **Objetivo:** Separar contagem e probabilidade no modelo ingênuo.
- **Fala sugerida:** "20ⁿ assume ramificação fixa. Na abertura isso subestima a árvore e superestima P de um caminho. 1/20ⁿ é a chance ingênua."
- **Gancho:** "Perft mostra a contagem real por profundidade."

### 26. chess-perft
- **Objetivo:** Expor escala real e a razão 20ⁿ/Perft < 1.
- **Fala sugerida:** "Ply é meio-lance. Depth 1 são os 20 das brancas. A partir de n=3, Perft é maior que 20ⁿ. Inclui lances péssimos."
- **Gancho:** "E a ramificação muda a cada estado."

### 27. chess-state
- **Objetivo:** Traduzir B(S_t) como lances legais na posição.
- **Fala sugerida:** "B é quantos lances legais tem agora. No uniforme, a chance local é 1/B. Este caminho é ilustrativo, não uma partida real."
- **Gancho:** "A partida inteira vira um produto."

### 28. chess-product
- **Objetivo:** Um caminho ≠ o xadrez; uniforme ≠ humano.
- **Fala sugerida:** "Multiplicando 1/B, cai a chance DESTA trajetória. Humano não sorteia: teoria concentra massa em poucas linhas."
- **Gancho:** "No simulador, comparamos modelo ingênuo e real."

### 29. chess-sim
- **Objetivo:** Contraste 20ⁿ vs Perft, e o relógio: Perft cabe, Shannon não.
- **Fala sugerida:** "Olha as duas chances. Depois o relógio: contar esta profundidade a 10⁹/s ainda dá. Contar todas as partidas (~10¹²⁰) são idades do universo. Por isso o computador busca, não enumera."
- **Gancho:** "No War, a mesma ideia aparece em batalhas — e lá a máquina consegue prever."

## War

### 30. war-hook
- **Objetivo:** Definir a batalha e quando ganha/para.
- **Fala sugerida:** "10 no seu território, 5 no do vizinho. Ganha se o defensor chegar a 0. Para — não conquistou — se você ficar com 1, porque deixa alguém na origem. Não é o mapa inteiro."
- **Gancho:** "Antes da simulação, como se compara os dados."

### 31. war-combat
- **Objetivo:** Regras visíveis: ordena, compara, empate com a defesa; 1v1 ≠ 50%.
- **Fala sugerida:** "Rola até 3, ordena, compara par a par. Maior estrito ganha; empate fica com a defesa. Exemplo: 6-4-2 vs 5-4-1, A perde 1 e D perde 2. Por isso 1v1 é 15 em 36, não 50%."
- **Gancho:** "Agora vemos isso em sequência de turnos."

### 32. war-chain
- **Objetivo:** Uma rolagem de cada vez até D=0 ou A=1.
- **Fala sugerida:** "Clique rolar. O painel compara A1×D1, A2×D2, A3×D3 — quem ganhou cada linha e quem levou a rolagem. D=0 conquistou. A=1 parou."
- **Gancho:** "Além da batalha, o setup inicial já é gigante."

### 33. war-parts
- **Objetivo:** Combinatória do setup, número certo.
- **Fala sugerida:** "42 territórios, 6 jogadores, 7 cada: 42! / (7!)⁶ ≈ 8,57×10²⁸. Às vezes citam 10³¹ — está errado. E isso não é a chance de conquistar um território."
- **Gancho:** "Fechamos com Monte Carlo da conquista."

### 34. war-sim
- **Objetivo:** Previsão exata do computador vs Monte Carlo; contraste com o xadrez.
- **Fala sugerida:** "Aqui a batalha cabe na máquina: p exato já aparece. Enumerar um 3v3 são microssegundos. Monte Carlo confere. No xadrez a árvore inteira não cabe."
- **Gancho:** "Agora o estado no xadrez e no War — só o agora conta."

## Markov

### 35. chess-markov
- **Objetivo:** Markov nas regras, com estado completo.
- **Fala sugerida:** "O próximo lance legal só depende da posição agora — peças, roque, en passant. O jogador pode ter memória; as regras não."
- **Gancho:** "No War, o estado é o par de tropas."

### 36. war-markov
- **Objetivo:** Grade (A, D) com absorção visível.
- **Fala sugerida:** "Cada célula é um estado. Verde conquistou, âmbar esgotou. Role uma transição: só anda para menos tropas. Conquistar é a chance de cair no verde."
- **Gancho:** "Vamos resumir a escada matemática inteira."

## Síntese

### 37. ladder
- **Objetivo:** Relembrar progressão.
- **Fala sugerida:** "Subimos de fração para processo para simulação. Cada degrau teve um mundo: dado, orla, cães, xadrez."
- **Gancho:** "Então, o improvável existe ou não?"

### 38. improbable
- **Objetivo:** Fechar tese central.
- **Fala sugerida:** "10⁻⁶ não é zero. E[X]=Np: orla, Perft, 10×5 — com N grande o esperado deixa de ser desprezível."
- **Gancho:** "Mas modelos têm limites."

### 39. limits
- **Objetivo:** Mostrar honestidade metodológica.
- **Fala sugerida:** "Aqui estão três limites que impedem conclusões erradas."
- **Gancho:** "Agora vamos para navegação livre."

### 40. demo
- **Objetivo:** Abrir discussão orientada.
- **Fala sugerida:** "Podemos voltar para qualquer simulador e testar hipóteses da turma."
- **Gancho:** "Encerrando com referências."

### 41. credits
- **Objetivo:** Registrar fontes e stack.
- **Fala sugerida:** "Essas são as bases de dados e ferramentas usadas no projeto."
- **Gancho:** "Fecho com a pergunta inicial."

### 42. thanks
- **Objetivo:** Encerramento memorável.
- **Fala sugerida:** "Obrigado. A pergunta permanece: quando algo parece impossível, qual foi a cadeia de probabilidades por trás?"
- **Gancho:** "Q&A."
