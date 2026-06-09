# System Builder Documentation

Esta pasta é o sistema de comando modular do System Builder e a fonte de verdade operacional do projeto.

## Princípio

```text
Markdown primeiro.
Contrato depois.
Código por último.
```

## Fluxo do produto

```text
Process Mirroring
→ Pattern Extraction
→ Capability Matching
→ Enterprise Architecture
→ Adapted Process Modeling
→ Builder Composition
→ Runtime Execution
→ Audit
→ Continuous Improvement
```

## Navegação

| Camada | Responsabilidade |
|---|---|
| `tasker/` | Backlog, sprint, dependências e agentes |
| `process_mirroring/` | Captura e validação do trabalho real |
| `capabilities/` | Capabilities universais e seus contratos |
| `enterprise_architecture/` | Mapas de capacidades, valor, dados e responsabilidades |
| `governance/` | Papéis, permissões, segregação e auditoria |
| `enablement/` | Instruções, checklists e treinamento por papel |
| `registry/` | Índice oficial de capabilities |
| `ui/`, `workflow/`, `runtime/`, `integrations/` | Contratos das superfícies e execução futura |
| `archive/` | Histórico preservado; não é board operacional atual |

Comece por `PROJECT_MANIFEST.md`, `ARCHITECTURE.md`, `DEVELOPMENT_RULES.md` e `GLOBAL_WORK_BOARD.md`.
