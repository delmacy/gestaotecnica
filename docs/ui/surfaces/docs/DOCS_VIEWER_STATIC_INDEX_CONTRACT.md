# Docs Viewer Static Index Contract

## Definição de Tipos Conceituais

### `DocsItem`
- `id` (string)
- `title` (string)
- `slug` (string)
- `category` (DocsCategory)
- `module` (DocsModule)
- `phase` (DocsPhase)
- `status` (DocsStatus)
- `summary` (string)
- `source_path` (string)
- `related_docs` (DocsRelation[])
- `related_tasks` (DocsRelation[])
- `related_capabilities` (string[])
- `tags` (string[])
- `last_known_state` (string)
- `synthetic` (boolean)
- `notes` (string)

### `DocsRelation`
- `id` (string)
- `type` ("doc" | "task")
- `label` (string)

### Categorias (`DocsCategory`)
- `manifest`
- `architecture`
- `decision`
- `tasker`
- `ui_contract`
- `capability`
- `registry`
- `process_mirroring`
- `review_report`
- `readiness`
- `development_report`
- `governance`
- `enablement`
- `runtime`
- `integration`

### Status (`DocsStatus`)
- `documented`
- `needs_review`
- `ready`
- `done`
- `blocked`
- `future`
- `archived`

### Fases (`DocsPhase`)
- `planning`
- `readiness`
- `development`
- `review`
- `approved`
- `future`

### Módulo (`DocsModule`)
- Ex: `shell`, `tasker`, `docs_viewer`, `capabilities`, `registry`

## Limitações do MVP
- O MVP usa um índice estático/mockado (`docs-data.ts` ou similar no frontend).
- Não lê filesystem em runtime.
- Não edita Markdown real.
- Não salva alterações.
- Não integra com GitHub.
- Não substitui a documentação fonte, atua apenas como índice de leitura e descoberta.