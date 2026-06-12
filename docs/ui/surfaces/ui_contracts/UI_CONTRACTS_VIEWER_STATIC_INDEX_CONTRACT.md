# UI Contracts Viewer - Static Index Contract

Este documento define os contratos de dados estáticos para a inicialização da aplicação em estado "mock/static". Define as interfaces do Typescript que serão usadas no frontend.

## Type Definitions

```typescript
export type UiContractGroup =
  | 'group_a_platform_foundation'
  | 'group_b_builder_design'
  | 'group_c_runtime_integration'
  | 'group_d_client_real';

export type UiContractImplementationStatus =
  | 'documented'
  | 'ready_for_readiness'
  | 'ready_for_dev'
  | 'implemented'
  | 'reviewed'
  | 'approved'
  | 'future'
  | 'blocked';

export type UiContractDevStatus =
  | 'not_started'
  | 'planned'
  | 'ready'
  | 'in_progress'
  | 'done'
  | 'blocked'
  | 'future';

export interface UiContractReviewLink {
  id: string;
  name: string;
  status: string;
}

export interface UiContractDependency {
  id: string;
  name: string;
  reason?: string;
  isBlocking: boolean;
}

export interface UiContractField {
  name: string;
  description: string;
  type?: string;
}

export interface UiContractRoute {
  path: string;
  isDynamic: boolean;
  parameters?: string[];
}

export interface UiContractEvidence {
  description: string;
  requiredFor: string;
}

export interface UiContractRisk {
  description: string;
  mitigation: string;
}

export interface UiSurfaceContract {
  id: string;
  surface_id: string;
  surface_name: string;
  slug: string;
  group: UiContractGroup;
  route_candidate: string; // Simplificando da interface UiContractRoute para string no index
  purpose: string;
  persona: string | string[];
  scope: string;
  workspace_or_global: 'workspace' | 'global' | 'mixed';
  implementation_status: UiContractImplementationStatus;
  dev_status: UiContractDevStatus;
  related_capabilities: string[];
  data_inputs: string[];
  data_outputs: string[];
  commands: string[];
  frontend_risks: string | string[]; // Suportando array e texto longo do markdown
  evidence_required: string | string[];
  e2e_test_expectation: string;
  related_reviews: string[]; // Simplificado para array de IDs/Nomes
  related_tasks: string[];
  dependencies: UiContractDependency[];
  synthetic: boolean;
  notes: string;
}

export interface UiContractStaticIndex {
  version: string;
  lastUpdated: string;
  contracts: UiSurfaceContract[];
}
```

## Propriedades Mínimas Obrigatórias (para a visualização)
Em modo Mock, o contrato estático requer sempre ao menos:
- `id`
- `surface_id`
- `surface_name`
- `slug`
- `group`
- `route_candidate`
- `purpose`
- `implementation_status`
- `dev_status`

A interface permite tipos variados (string ou array de strings) para lidar com a natureza orgânica de conversão de Markdown para objetos de UI, assegurando robustez no frontend.
