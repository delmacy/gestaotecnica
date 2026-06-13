# Operator Guide - Static Index Contract

Este documento define a estrutura sintética de dados (tipagem) a ser utilizada para o Operator Guide na fase mock/static.

## Entidades e Campos

### `OperatorGuide`
- `id`: string (Identificador único).
- `title`: string (Título de exibição).
- `slug`: string (Para URLs, se aplicável).
- `description`: string (Resumo do guia).
- `category`: string (Categoria principal do guia).
- `audiences`: string[] (Perfis recomendados).
- `difficulty`: string (Nível de dificuldade).
- `readiness_status`: string (Status do guia).
- `data_source_mode`: string (Origem dos dados).
- `prerequisites`: OperatorPrerequisite[]
- `procedures`: OperatorProcedureStep[]
- `warnings`: OperatorWarning[]
- `troubleshooting`: OperatorTroubleshootingItem[]
- `related_surfaces`: string[]
- `related_routes`: OperatorRelatedRoute[]
- `related_docs`: string[]
- `synthetic`: boolean (Flag de dados não reais).
- `notes`: string (Notas internas).

### `OperatorProcedureStep`
- `id`: string
- `order`: number (Sequência numérica do passo).
- `title`: string
- `description`: string
- `expected_result`: string (Opcional, resultado deste passo específico).
- `warning_refs`: string[] (Opcional, referências a avisos específicos).
- `related_route`: string (Opcional).
- `command_text_placeholder`: string (Opcional, texto para ser copiado).
- `is_optional`: boolean
- `synthetic`: boolean
- `notes`: string

### `OperatorPrerequisite`
- `id`: string
- `description`: string

### `OperatorWarning`
- `id`: string
- `level`: 'info' | 'warning' | 'critical'
- `message`: string

### `OperatorTroubleshootingItem`
- `id`: string
- `problem_statement`: string
- `solution_steps`: string[]

### `OperatorRelatedRoute`
- `route_path`: string
- `label`: string
- `description`: string

## Domínios Estritos

### Categorias Permitidas (`OperatorGuideCategory`)
- `getting_started`
- `platform_access`
- `navigation`
- `process_mirroring`
- `form_builder`
- `view_builder`
- `workflow_builder`
- `governance`
- `review_and_validation`
- `troubleshooting`

### Audiências Permitidas (`OperatorGuideAudience`)
- `platform_builder`
- `platform_admin`
- `operator`
- `reviewer`
- `process_analyst`
- `future_workspace_owner`

### Dificuldade (`OperatorGuideDifficulty`)
- `beginner`
- `intermediate`
- `advanced`
- `reference`

### Readiness Status
- `draft`
- `mock_ready`
- `ready_for_demo`
- `needs_validation`
- `future_dynamic_docs`

### Data Source Mode
- `static_documentation`
- `synthetic`
- `mock`
- `existing_surface_reference`
- `future_dynamic_source`
