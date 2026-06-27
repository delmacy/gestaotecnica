# Template de Inventário de Backlog

Este documento serve como modelo obrigatório para a task `SB-S01-T01`. Todas as colunas devem ser preenchidas.

**Nota:** Os exemplos abaixo são fictícios e servem apenas para ilustrar o preenchimento correto da tabela.

## Legenda de Estados

### github_state
- `open`: Issue ou PR aberto no GitHub.
- `closed`: Issue encerrada.
- `closed-unmerged`: PR fechado sem integração à branch principal.
- `merged`: PR integrado à branch `main`.
- `investigar`: Estado não pôde ser confirmado com fontes autoritativas.

### delivery_state
- `integrated`: O código/documento está presente na `main`.
- `pending`: Aguardando merge ou conclusão de desenvolvimento.
- `superseded`: Substituído por uma entrega mais recente (exige evidência de substituição).
- `investigar`: Estado não pôde ser confirmado.

## Tabela de Inventário (EXEMPLO FICTÍCIO)

| origin_id | artifact_type | title | url_or_path | github_state | delivery_state | base_sha | head_sha | merge_sha | domain_or_capability | claimed_delivery | verified_delivery | duplicate_of | superseded_by | risk | recommendation | evidence | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| #123 | pr | Exemplo PR Mergeado | https://github.com/org/repo/pull/123 | merged | integrated | a1b2c3d | e5f6g7h | i9j0k1l | platform/events | Event contract | Fully integrated | N/A | N/A | low | N/A | [URL_GITHUB] / merge_sha found | Exemplo fictício |
| #124 | pr | Exemplo PR Rejeitado | https://github.com/org/repo/pull/124 | closed-unmerged | pending | b2c3d4e | f6g7h8i | N/A | core/auth | Refactored auth | Not in main | N/A | #130 | medium | Keep closed | [URL_GITHUB] closed | Exemplo fictício |
| #45 | issue | Exemplo Issue Aberta | https://github.com/org/repo/issues/45 | open | pending | N/A | N/A | N/A | core/security | Fix for leak | Not delivered | N/A | N/A | high | Prioritize | [URL_GITHUB] open | Exemplo fictício |
| #50 | pr | Exemplo Superseded | https://github.com/org/repo/pull/50 | closed-unmerged | superseded | c3d4e5f | g7h8i9j | N/A | builder/ui | Old UI Draft | Replaced | N/A | #60 | low | Ignore | [URL_GITHUB] superseded by #60 | Exemplo fictício |
| DOC-01 | doc | Exemplo Doc Legado | docs/product-roadmap/README.md | N/A | integrated | N/A | N/A | N/A | governance | Roadmap | File on main | N/A | N/A | low | Reference | File exists | Exemplo fictício |
| #99 | investigate | Exemplo Investigar | N/A | investigar | investigar | investigate | investigate | investigate | N/A | Unknown | Unknown | N/A | N/A | high | Deep dive | No authoritative source | Exemplo fictício |

## Resumo de Contagens
- Issues Abertas: 0
- Issues Fechadas: 0
- PRs Abertos: 0
- PRs Mergeados: 0
- PRs Closed-unmerged: 0
- Documentos Analisados: 0
- Itens Investigar: 0

---
*Justificativa de exclusões:*
(Listar itens identificados em consultas autoritativas mas que não foram incluídos no inventário por não serem relevantes para o backlog ativo)
