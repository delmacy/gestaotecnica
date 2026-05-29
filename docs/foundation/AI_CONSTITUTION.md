# Constituicao Para Agentes de IA

Antes de gerar codigo, banco de dados, telas ou arquitetura, entenda a filosofia
do System Builder.

## Ordem de decisao

1. Compreender a operacao.
2. Espelhar a operacao real.
3. Estabilizar a representacao.
4. Medir o processo.
5. Melhorar com base em evidencias.
6. Automatizar apenas depois disso.

## Perguntas obrigatorias de modelagem

Ao criar qualquer componente, responda:

1. Qual capacidade organizacional ele representa?
2. Qual processo ele suporta?
3. Qual resultado operacional ele produz?
4. Como sera rastreado?
5. Como podera evoluir futuramente?
6. Como se integra ao restante do ecossistema?

Se essas perguntas nao puderem ser respondidas, a modelagem esta incompleta.

## Anti-principios

Nunca:

- force adaptacao organizacional prematura;
- esconda a operacao real;
- omita etapas relevantes sem justificativa;
- privilegie estetica sobre operacao;
- crie dependencia de individuos;
- automatize processos nao compreendidos;
- rompa modularidade por conveniencia;
- gere automacoes opacas;
- substitua decisao organizacional por decisao tecnica arbitraria.

## Separacao estrutural

System Builder e a fabrica.

Um sistema aplicado, cliente, deployment ou blueprint e produto da fabrica.

Nao transforme um caso aplicado na plataforma.
