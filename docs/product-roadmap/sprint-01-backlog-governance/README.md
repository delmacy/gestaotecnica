# Sprint 01 — Organização do backlog e governança

## Objetivo

Converter issues, PRs, planos e documentos existentes no novo modelo determinístico de tasks, eliminando ambiguidades antes do desenvolvimento das demais sprints.

## Leitura obrigatória

1. `docs/product-roadmap/README.md`
2. `docs/product-roadmap/ARCHITECTURE_CONTEXT.md`
3. `docs/product-roadmap/EXECUTION_RULES.md`
4. `docs/product-roadmap/TASK_INDEX.md`
5. `docs/product-roadmap/sprint-01-backlog-governance/CONTEXT.md`
6. arquivo individual da task selecionada

## Fluxo da sprint

```text
SB-S01-T01
   ├── SB-S01-T02 ──┐
   └── SB-S01-T03 ──┤
                    ▼
               SB-S01-T04
                    ▼
               SB-S01-T05
```

T02 e T03 podem ser executadas em paralelo após T01, desde que não editem o mesmo arquivo simultaneamente.

## Tasks

### SB-S01-T01 — Inventariar backlog e PRs existentes
- Tipo: planejamento/auditoria
- Estado inicial: ready
- Arquivo: [`01-inventariar-backlog-e-prs.md`](./01-inventariar-backlog-e-prs.md)

### SB-S01-T02 — Normalizar IDs, estados e dependências
- Tipo: planejamento
- Estado inicial: blocked por T01
- Arquivo: [`02-normalizar-ids-estados-dependencias.md`](./02-normalizar-ids-estados-dependencias.md)

### SB-S01-T03 — Criar validador do catálogo de tasks
- Tipo: desenvolvimento interno
- Estado inicial: blocked por T01
- Arquivo: [`03-criar-validador-catalogo-tasks.md`](./03-criar-validador-catalogo-tasks.md)

### SB-S01-T04 — Auditar escopo, duplicidades e consistência
- Tipo: review independente
- Estado inicial: blocked por T02 e T03
- Arquivo: [`04-auditar-escopo-duplicidades.md`](./04-auditar-escopo-duplicidades.md)

### SB-S01-T05 — Provar descoberta e execução pelo Jules
- Tipo: teste operacional
- Estado inicial: blocked por T04
- Arquivo: [`05-provar-descoberta-pelo-jules.md`](./05-provar-descoberta-pelo-jules.md)

## Critério de conclusão da sprint

- inventário aprovado;
- mapeamento canônico aprovado;
- validador passando;
- review sem blocker aberto;
- prova de descoberta com três execuções corretas;
- nenhuma alteração funcional do produto misturada à sprint.

## Prompt mínimo para o Jules

```text
Busque a task <TASK_ID> no arquivo individual indicado em docs/product-roadmap/sprint-01-backlog-governance/README.md.
Leia os documentos obrigatórios da sprint.
Execute somente o contrato da task, publique branch e PR isolados e não faça merge automático.
```