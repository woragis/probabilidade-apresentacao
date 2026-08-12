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
- **Fala sugerida:** "Probabilidade aqui é parte favorável sobre universo possível. Essa ideia vai aparecer em todos os blocos."
- **Gancho:** "No dado, isso fica direto."

### 5. die
- **Objetivo:** Transformar fórmula em intuição.
- **Fala sugerida:** "Um face específica é 1 em 6. Repetindo rolagem, a frequência converge para essa ideia."
- **Gancho:** "Com dois dados, a geometria muda."

### 6. two-dice
- **Objetivo:** Mostrar que combinações têm pesos diferentes.
- **Fala sugerida:** "Sete aparece mais porque tem mais pares possíveis. Não é sorte: é contagem."
- **Gancho:** "Agora duas condições juntas."

### 7. venn
- **Objetivo:** Visualizar interseção.
- **Fala sugerida:** "Interseção é o pedaço onde A e B acontecem ao mesmo tempo. Isso é o coração do resto da apresentação."
- **Gancho:** "Quando condicionamos, o universo muda."

### 8. conditional
- **Objetivo:** Mostrar sensibilidade de P(A|B).
- **Fala sugerida:** "Mantendo P(A∩B), só de mudar P(B), o resultado final muda bastante."
- **Gancho:** "No mundo real, empilhar condicionais derruba a probabilidade."

### 9. bridge
- **Objetivo:** Fechar base e entrar nos casos.
- **Fala sugerida:** "Tudo daqui para frente é esse princípio: produto de condicionais."
- **Gancho:** "Vamos testar isso em reencontro de pessoas."

## Encontros

### 10. enc-hook
- **Objetivo:** Criar identificação imediata.
- **Fala sugerida:** "Pergunta simples: qual chance de rever exatamente aquela pessoa?"
- **Gancho:** "A resposta começa no fluxo local."

### 11. enc-model
- **Objetivo:** Mostrar o modelo em 3 camadas.
- **Fala sugerida:** "Hora, visita e série de visitas. O modelo cresce em três passos curtos."
- **Gancho:** "Agora mexemos nos parâmetros e vemos o número vivo."

### 12. enc-sim
- **Objetivo:** Exibir painel pergunta->resposta.
- **Fala sugerida:** "À esquerda ficam hipóteses. No centro, a resposta dominante: P de reencontro."
- **Gancho:** "Com esse p, vemos distribuição de repetições."

### 13. binomial
- **Objetivo:** Mostrar forma da distribuição.
- **Fala sugerida:** "Com n visitas e p por visita, a binomial mostra onde a massa de probabilidade concentra."
- **Gancho:** "Para eventos raros por unidade de tempo, Poisson simplifica."

### 14. poisson
- **Objetivo:** Introduzir taxa lambda.
- **Fala sugerida:** "Lambda resume taxa média por janela. Mudou lambda, muda toda a curva."
- **Gancho:** "Vamos comparar teoria e simulação."

### 15. enc-mc
- **Objetivo:** Validar com Monte Carlo.
- **Fala sugerida:** "A simulação aproxima o teórico. Aqui o foco é diferença pequena, não coincidência perfeita."
- **Gancho:** "E com mais N, a incerteza cai."

### 16. ci
- **Objetivo:** Evidenciar IC encolhendo.
- **Fala sugerida:** "O intervalo estreita conforme n cresce. Essa é a noção prática de confiança."
- **Gancho:** "Agora o bloco mais sensível: cães e Bayes."

## Cães e Bayes

### 17. dogs-ethics
- **Objetivo:** Enquadramento responsável.
- **Fala sugerida:** "Estamos modelando cenário de risco, não definindo essência de raça."
- **Gancho:** "Com isso claro, montamos a cadeia."

### 18. dogs-chain
- **Objetivo:** Mostrar multiplicação de fatores.
- **Fala sugerida:** "Cada fator sozinho pode parecer comum; juntos, o resultado muda de escala."
- **Gancho:** "E o erro clássico aparece na leitura das condicionais."

### 19. dogs-bayes
- **Objetivo:** Contrastar duas condicionais.
- **Fala sugerida:** "Essas duas fórmulas parecem parecidas no texto, mas respondem perguntas opostas."
- **Gancho:** "Vamos quantificar com um cenário ajustável."

### 20. dogs-sim
- **Objetivo:** Tornar Bayes palpável.
- **Fala sugerida:** "Ao mexer no prior e nas taxas condicionais, o posterior muda imediatamente."
- **Gancho:** "Agora olhamos o dado observado, sem confundir interpretação."

### 21. dogs-chart
- **Objetivo:** Ler gráfico corretamente.
- **Fala sugerida:** "Esse gráfico é P(raça|fatal). Ele não responde risco individual por raça."
- **Gancho:** "Fechando com a frase-chave."

### 22. dogs-takeaway
- **Objetivo:** Fixar inversão condicional.
- **Fala sugerida:** "Mesmas palavras, sentidos diferentes. É isso que Bayes protege."
- **Gancho:** "No xadrez, veremos outro erro intuitivo clássico."

## Xadrez

### 23. chess-hook
- **Objetivo:** Trazer o problema de repetição.
- **Fala sugerida:** "Duas partidas idênticas lance a lance parecem possíveis, mas quão prováveis são?"
- **Gancho:** "Primeiro, a armadilha do 20ⁿ."

### 24. chess-trap
- **Objetivo:** Mostrar simplificação ruim.
- **Fala sugerida:** "20ⁿ assume ramificação fixa. O tabuleiro real não funciona assim."
- **Gancho:** "Perft mostra a contagem real por profundidade."

### 25. chess-perft
- **Objetivo:** Expor escala real.
- **Fala sugerida:** "Os números explodem rápido. Aqui já vemos por que repetição exata é tão rara."
- **Gancho:** "E isso muda a cada estado."

### 26. chess-state
- **Objetivo:** Associar chance ao estado S_t.
- **Fala sugerida:** "B(S_t) varia por posição. Probabilidade local muda lance a lance."
- **Gancho:** "A partida inteira vira um produto."

### 27. chess-product
- **Objetivo:** Fechar matemática de trajetória.
- **Fala sugerida:** "Multiplicando escolhas locais, a chance total cai para ordens de magnitude muito pequenas."
- **Gancho:** "Esse fluxo é naturalmente uma cadeia de estados."

### 28. chess-markov
- **Objetivo:** Introduzir visão markoviana.
- **Fala sugerida:** "Cada posição transiciona para próximas posições com probabilidades condicionais."
- **Gancho:** "No simulador, comparamos modelo ingênuo e real."

### 29. chess-sim
- **Objetivo:** Contraste visual direto.
- **Fala sugerida:** "Aqui o ponto é a razão entre 20ⁿ e Perft. Esse fator resume o erro de simplificação."
- **Gancho:** "No War, a mesma ideia aparece em batalhas."

## War

### 30. war-hook
- **Objetivo:** Definir pergunta operacional.
- **Fala sugerida:** "Com essa configuração de tropas, qual chance de conquista?"
- **Gancho:** "Antes da simulação, três números base."

### 31. war-combat
- **Objetivo:** Mostrar métricas essenciais.
- **Fala sugerida:** "Vitória 1v1 e perdas médias 3v2 já explicam muita coisa do comportamento do jogo."
- **Gancho:** "Agora vemos isso em sequência de turnos."

### 32. war-chain
- **Objetivo:** Tornar processo temporal visível.
- **Fala sugerida:** "Cada rolagem atualiza estado e muda a próxima decisão."
- **Gancho:** "Além da batalha, o setup inicial já é gigante."

### 33. war-parts
- **Objetivo:** Mostrar escala combinatória inicial.
- **Fala sugerida:** "Só a distribuição inicial de territórios já está na casa de 10³¹."
- **Gancho:** "Fechamos com Monte Carlo da conquista."

### 34. war-sim
- **Objetivo:** Responder pergunta com p̂.
- **Fala sugerida:** "Escolho tropas, rodo N batalhas e leio probabilidade estimada com IC."
- **Gancho:** "Esse mesmo processo cabe numa visão de estado."

### 35. war-markov
- **Objetivo:** Conectar com cadeia de estados.
- **Fala sugerida:** "War também é evolução de estado: combate após combate."
- **Gancho:** "Vamos resumir a escada matemática inteira."

## Síntese

### 36. ladder
- **Objetivo:** Relembrar progressão.
- **Fala sugerida:** "Partimos de contagem simples e chegamos em inferência e processos estocásticos."
- **Gancho:** "Então, o improvável existe ou não?"

### 37. improbable
- **Objetivo:** Fechar tese central.
- **Fala sugerida:** "Improvável não é impossível. Com muitas tentativas, o raro aparece."
- **Gancho:** "Mas modelos têm limites."

### 38. limits
- **Objetivo:** Mostrar honestidade metodológica.
- **Fala sugerida:** "Aqui estão três limites que impedem conclusões erradas."
- **Gancho:** "Agora vamos para navegação livre."

### 39. demo
- **Objetivo:** Abrir discussão orientada.
- **Fala sugerida:** "Podemos voltar para qualquer simulador e testar hipóteses da turma."
- **Gancho:** "Encerrando com referências."

### 40. credits
- **Objetivo:** Registrar fontes e stack.
- **Fala sugerida:** "Essas são as bases de dados e ferramentas usadas no projeto."
- **Gancho:** "Fecho com a pergunta inicial."

### 41. thanks
- **Objetivo:** Encerramento memorável.
- **Fala sugerida:** "Obrigado. A pergunta permanece: quando algo parece impossível, qual foi a cadeia de probabilidades por trás?"
- **Gancho:** "Q&A."
