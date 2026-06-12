# View Builder Static Schema Contract

Este documento descreve as estruturas de dados (schemas) permitidas para operar a simulação client-side do View Builder durante a fase design-only.

## Tipos Conceituais

- `ViewBlueprint`
- `ViewType`
- `ViewField`
- `ViewColumn`
- `ViewFilter`
- `ViewSortRule`
- `ViewGroupRule`
- `ViewAction`
- `ViewLayoutRule`
- `ViewBinding`
- `ViewPreviewState`
- `ViewGovernanceWarning`
- `ViewReadinessStatus`
- `ViewVersionDraft`
- `ViewDataSourceMode`

## Estrutura Base de Dados

### ViewBlueprint
```ts
id: string;
name: string;
slug: string;
description: string;
process_area: string;
view_type: ViewType;
data_source_mode: ViewDataSourceMode;
readiness_status: ViewReadinessStatus;
fields: ViewField[];
columns: ViewColumn[];
filters: ViewFilter[];
sort_rules: ViewSortRule[];
group_rules: ViewGroupRule[];
actions: ViewAction[];
layout: ViewLayoutRule;
bindings: ViewBinding[];
governance_warnings: ViewGovernanceWarning[];
preview_state: ViewPreviewState;
related_form_blueprints: string[];
related_capabilities: string[];
related_process_steps: string[];
related_docs: string[];
synthetic: boolean;
notes: string;
```

### ViewField
```ts
id: string;
label: string;
key: string;
source_field_key: string;
field_type: string; // text, number, date, boolean, enum, etc
visible: boolean;
sortable: boolean;
filterable: boolean;
groupable: boolean;
width: string; // '100px', 'auto'
format: string; // formatting options mock
binding: string;
data_source_mode: ViewDataSourceMode;
readiness_status: ViewReadinessStatus;
synthetic: boolean;
notes: string;
```

## Enums Estritos

### View types
- `table`
- `detail`
- `kanban`
- `calendar`
- `timeline`
- `dashboard_cards`
- `compact_list`
- `split_master_detail`

### Filter types
- `text_contains`
- `equals`
- `not_equals`
- `date_range`
- `number_range`
- `status_in`
- `role_scope_placeholder`
- `capability_scope_placeholder`
- `future_runtime_rule`

### Action types
- `open_detail`
- `assign_placeholder`
- `change_status_placeholder`
- `export_placeholder`
- `notify_placeholder`
- `create_related_placeholder`
- `future_runtime_action`

### Readiness status
- `draft`
- `mock_ready`
- `needs_validation`
- `needs_real_sources`
- `ready_for_demo`
- `blocked_runtime`
- `future_runtime`

### Data source modes
- `synthetic`
- `mock`
- `real_pending`
- `real_blocked`
- `future_real_validation`
