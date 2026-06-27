# Sprint 01 — Organização do backlog e governança

Objetivo: converter issues, PRs e planos existentes no novo modelo determinístico de tasks.

## SB-S01-T00 — Preparar fontes e modelo verificável do inventário
- Tipo: planejamento preparatório
- Modo: sequencial
- Escopo: definir fontes, critérios de verificação e template obrigatório para a T01.
- Entrega: `INVENTORY_SOURCE_PLAN.md` e `BACKLOG_INVENTORY_TEMPLATE.md`.
- Aceite: a futura T01 pode ser executada sem inferir estados por nomes de branches ou omitir evidências.
- Arquivo: `00-preparar-fontes-e-modelo-do-inventario.md`

## SB-S01-T01 — Inventariar backlog e PRs existentes
- Tipo: planejamento
- Modo: sequencial após T00
- Escopo: issues abertas, PRs abertos/fechados recentes, roadmaps e documentos ativos.
- Entrega: `BACKLOG_INVENTORY.md` conforme o plano e template aprovados na T00.
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

## Fluxo

`T00 → T01 → (T02 || T03) → T04 → T05`

## Prompt Jules
`Busque a task <ID> no arquivo correspondente desta sprint, execute somente o escopo descrito, publique branch e PR isolados e apresente evidências dos critérios de aceite.`