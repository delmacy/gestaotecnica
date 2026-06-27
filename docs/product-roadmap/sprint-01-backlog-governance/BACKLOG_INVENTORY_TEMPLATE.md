# Template de Inventário de Backlog

Este documento serve como modelo obrigatório para a task `SB-S01-T01`. Todas as colunas devem ser preenchidas.

## Legenda de Estados

### github_state
- `open`: Issue ou PR aberto no GitHub.
- `closed`: PR fechado sem merge ou Issue encerrada.
- `merged`: PR integrado à branch `main`.
- `branch-only`: Existe apenas como branch remota, sem PR.
- `investigar`: Estado não pôde ser confirmado com as ferramentas disponíveis.

### delivery_state
- `integrated`: O código/documento está presente na `main`.
- `pending`: Aguardando merge ou conclusão de desenvolvimento.
- `superseded`: Substituído por uma entrega mais recente.
- `investigar`: Estado não pôde ser confirmado com as ferramentas disponíveis.

## Tabela de Inventário

| origin_id | artifact_type | title | url_or_path | github_state | delivery_state | base_sha | head_sha | merge_sha | domain_or_capability | claimed_delivery | verified_delivery | duplicate_of | superseded_by | risk | recommendation | evidence | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| #123 | pr | Implementar Canonical Events | github.com/pull/123 | merged | integrated | a1b2c3d | e5f6g7h | i9j0k1l | platform/events | Event contract and writer | Fully integrated in main | N/A | N/A | low | N/A | `is-ancestor` returns 0 | Exemplo de PR mergeado |
| #124 | pr | Refatorar Auth (Tentativa 1) | github.com/pull/124 | closed | investigar | b2c3d4e | f6g7h8i | N/A | core/auth | Refactored auth flow | Not in main history | N/A | #130 | medium | Keep closed | `is-ancestor` returns 1 | Exemplo de PR fechado sem merge |
| #45 | issue | Bug no isolamento de workspace | github.com/issues/45 | open | pending | N/A | N/A | N/A | core/security | Fix for leak | Not delivered | N/A | N/A | high | Prioritize fix | `git log` shows no fix | Exemplo de issue aberta |
| feat/new-ui | branch | Protótipo de Nova UI | origin/feat/new-ui | branch-only | pending | c3d4e5f | g7h8i9j | N/A | builder/ui | New dashboard | commits found in branch | N/A | N/A | low | Create PR | `git branch -r` exists | Exemplo de branch sem PR |
| DOC-ROADMAP | doc | Roadmap de 50 Tasks | docs/product-roadmap/README.md | N/A | integrated | N/A | N/A | N/A | governance | Product roadmap | File exists on main | N/A | N/A | low | Main reference | File inspection | Exemplo de documento legado/roadmap |
| #99 | investigar | Item suspeito sem dados | N/A | investigar | investigar | investigar | investigar | investigar | N/A | Unknown | Unknown | N/A | N/A | high | Deep dive needed | No git reference found | Exemplo de item marcado como investigar |

## Resumo de Contagens
- Issues Abertas: 0
- Issues Fechadas: 0
- PRs Abertos: 0
- PRs Mergeados: 0
- PRs Closed-unmerged: 0
- Branches sem PR: 0
- Documentos Analisados: 0
- Itens Investigar: 0

---
*Justificativa de exclusões:*
(Descrever aqui itens encontrados mas não incluídos no inventário)
