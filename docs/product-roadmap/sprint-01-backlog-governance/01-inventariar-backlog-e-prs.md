# SB-S01-T01 — Inventariar backlog e PRs existentes

## Tipo
Planejamento e auditoria documental.

## Estado inicial
`ready`

## Objetivo de negócio
Criar uma visão confiável de tudo que já foi solicitado, desenvolvido, substituído, abandonado ou integrado, evitando que novas execuções repitam trabalho ou usem artefatos obsoletos.

## Contexto atual
O projeto possui issues, PRs, roadmaps, decisões arquiteturais e documentos produzidos em fases distintas. Alguns PRs foram fechados sem merge, outros substituíram implementações anteriores e alguns documentos descrevem estados que já mudaram. O inventário deve refletir o GitHub e a `main`, não relatos históricos isolados.

## Resultado esperado
Criar `docs/product-roadmap/sprint-01-backlog-governance/BACKLOG_INVENTORY.md` contendo, para cada item relevante:

- identificador de origem;
- tipo: issue, PR, documento, roadmap ou decisão;
- título;
- URL ou caminho;
- estado real;
- merged ou closed-unmerged, quando PR;
- domínio/capability;
- entrega alegada;
- entrega verificável;
- duplicidade ou substituto;
- risco;
- recomendação: mapear, arquivar, superseder, manter ou investigar.

## Fontes obrigatórias

- issues abertas;
- PRs abertos;
- PRs recentes relacionados às Waves e módulos em reconstrução;
- documentos ativos em `docs/` que atuem como roadmap, plano, board ou contrato;
- `docs/product-roadmap/**`;
- estado atual da `main` para confirmar entregas integradas.

## Dependências
Nenhuma.

## Pode executar em paralelo com
Nenhuma task da Sprint 01. Esta task prepara a base das demais.

## Diretórios permitidos

- `docs/product-roadmap/sprint-01-backlog-governance/BACKLOG_INVENTORY.md`
- documentação auxiliar estritamente dentro da pasta da sprint.

## Diretórios proibidos

- `src/**`
- `tests/**`
- `scripts/**`
- `.github/**`
- arquivos de configuração e dependências.

## Regras obrigatórias

1. Não alterar issues, PRs ou seus estados.
2. Não inferir `merged` a partir de `closed`.
3. Não considerar código local ou branch sem PR remoto como entrega.
4. Registrar incerteza explicitamente.
5. Não apagar nem mover documentos existentes.
6. Separar “declaração do artefato” de “evidência verificável”.

## Procedimento recomendado

1. Ler os documentos globais e o contexto da sprint.
2. Listar issues e PRs relevantes.
3. Confirmar estado, merge e head SHA dos PRs.
4. Localizar documentos de roadmap e decisões.
5. Agrupar por domínio.
6. Identificar conflitos, duplicidades e substituições.
7. Produzir o inventário em ordem verificável.

## Cenários obrigatórios

- PR fechado sem merge;
- PR substituído por outro;
- issue aberta com implementação parcial;
- documento desatualizado que declara conclusão;
- tarefa existente sem equivalente nas 50 tasks;
- duas tarefas que aparentam cobrir o mesmo escopo.

## Critérios de aceite

- todos os itens recentes e estruturalmente relevantes estão classificados;
- cada classificação possui evidência;
- estados usam a taxonomia global;
- nenhuma alteração funcional foi feita;
- itens não compreendidos estão marcados como `investigar`, sem conclusão inventada.

## Evidências obrigatórias no PR

- consultas/fontes utilizadas;
- quantidade de issues, PRs e documentos analisados;
- lista de itens excluídos e motivo;
- diff restrito à pasta da sprint;
- base SHA e head SHA.

## Rollback
Reverter o arquivo documental criado. Nenhum estado externo deve ter sido alterado.

## Prompt Jules
Busque a task `SB-S01-T01` em `docs/product-roadmap/sprint-01-backlog-governance/01-inventariar-backlog-e-prs.md`, leia os contextos obrigatórios e execute somente este inventário documental.