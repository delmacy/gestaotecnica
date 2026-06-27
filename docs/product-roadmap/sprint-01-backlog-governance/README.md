# Sprint 01 — Organização do backlog e governança

Objetivo: converter issues, PRs e planos existentes no novo modelo determinístico de tasks.

## SB-S01-T01 — Inventariar backlog e PRs existentes
- Tipo: planejamento
- Modo: sequencial
- Escopo: issues abertas, PRs abertos/fechados recentes, roadmaps e documentos ativos.
- Entrega: `BACKLOG_INVENTORY.md` com item, fonte, estado real, duplicidade, substituto e risco.
- Aceite: nenhuma task existente relevante fica sem classificação; estado deriva do GitHub real.

## SB-S01-T02 — Normalizar IDs, estados e dependências
- Tipo: planejamento
- Modo: paralelo após T01
- Entrega: mapa entre issues existentes e IDs `SB-*`; dependências e ordem de execução.
- Aceite: cada item tem um único ID, owner lógico, estado permitido e predecessor explícito.

## SB-S01-T03 — Criar validador do catálogo de tasks
- Tipo: desenvolvimento
- Modo: paralelo após T01
- Entrega: script read-only que valida IDs duplicados, referências inexistentes, ciclos e campos obrigatórios.
- Aceite: execução determinística e falha não-zero diante de catálogo inválido.

## SB-S01-T04 — Auditar escopo e duplicidades
- Tipo: review
- Depende: T02, T03
- Entrega: `SPRINT_REVIEW.md` com duplicidades, tasks obsoletas e correções.
- Aceite: não alterar código funcional; apontar evidência por caminho/issue/PR.

## SB-S01-T05 — Provar descoberta pelo Jules
- Tipo: teste
- Depende: T04
- Entrega: teste operacional com três IDs, verificando localização, leitura, branch isolada e PR correto.
- Aceite: Jules executa sem prompt extenso e sem confundir sprint, task ou escopo.

## Prompt Jules
`Busque a task <ID> em docs/product-roadmap/sprint-01-backlog-governance/README.md, execute somente o escopo descrito, publique branch e PR isolados e apresente evidências dos critérios de aceite.`