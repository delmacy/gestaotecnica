# Progresso — UX-NAV-04 Builder Identity

Atualizado em: 2026-08-04
Estado da fase: `in_progress`
Task atual: `UX-NAV-04-G01`

## Resumo

A etapa 001 foi integrada e estabeleceu persistência no banco, seed idempotente, membership e use cases. A camada de sessão, API, UI e propagação do contexto ainda não foi implementada dentro do escopo registrado.

## Registro

| Task | Implementação | Merge | Validação | Estado |
|---|---|---|---|---|
| UX-NAV-04-001 | schema `builder.workspace_selections`, migration, seed, use cases e integração test | merge de 2026-08-04 | confirmar comandos em checkout integrado | merged |
| UX-NAV-04-G01 | não iniciada | — | — | ready |

## Bloqueios e riscos

- endpoint atual possui descoberta anônima/fallback incompatível com a identidade real;
- contextos Builder, admin e runtime ainda podem divergir;
- seleção local não pode ser tratada como autorização;
- é necessário importar eventual catálogo numérico existente antes de renomear gaps.

## Próximo passo

Executar `G01` em PR isolado, resolvendo identidade pela sessão e retornando portfólio agrupado por organização sem fallback sintético.

## Evidências de referência

- `docs/archive/phases/UX_NAV_04.md`;
- `docs/agent-runs/jules/UX-NAV-04-001-platform-admin-boundary-database/**/EVIDENCE.md`.
