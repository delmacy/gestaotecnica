# Capability Explorer - Mock Data Contract

## Objetivo
Definir a estrutura conceitual de dados (Mock Data) que alimentará a UI do Capability Explorer durante a fase de desenvolvimento, garantindo paridade com o Registry Documental sem necessidade de persistência real ou banco de dados.

## Origem e Restrições
- Os dados mockados devem ser derivados dos contratos existentes: `CAPABILITY_REGISTRY.md`, `CAPABILITY_TAXONOMY.md` e `CAP-VAL-001_BOUNDARY_REVIEW.md`.
- Durante a fase de desenvolvimento (frontend), estes dados serão hardcoded ou gerenciados em memória local (`client-side` ou constantes).
- **NÃO DEVE** editar arquivos Markdown reais.
- **NÃO DEVE** persistir dados em banco de dados ou utilizar ORM/Drizzle para buscar capabilities.
- **NÃO DEVE** instalar capabilities de verdade nem provisionar workspace/runtime reais.

## Tipos e Enums

### `CapabilityCategory`
Categorias estritamente compatíveis com `CAPABILITY_TAXONOMY.md`.
- `foundation`
- `relationship`
- `work-management`
- `resource`
- `information`
- `control`
- `intelligence`
- `commercial`
- `legal`

### `CapabilityMvpPriority`
Níveis de prioridade para a composição do Core da plataforma.
- `critical`
- `high`
- `medium`
- `low`
- `future`

### `CapabilityStatus`
Status documental e de ciclo de vida.
- `documented`
- `needs_review`
- `ready_for_design`
- `future`
- `blocked`

### `CapabilityInstallState`
Estado de instalação (apenas simulação em memória).
- `available`
- `simulated_requested`
- `not_available`
- `future`

## Interfaces Conceptuais

### `CapabilityDependency` e `CapabilityBoundary`
```typescript
type CapabilityDependency = string; // Slug ou ID da capability

interface CapabilityBoundary {
  type: 'overlap' | 'composition' | 'external';
  description: string;
}
```

### `CapabilityDocumentLink`
```typescript
interface CapabilityDocumentLink {
  title: string;
  url: string; // Caminho simulado ou real para o repositório documental (ex: docs/capabilities/universal/...)
}
```

### `CapabilityItem`
Shape mínimo esperado para a entidade `CapabilityItem` na camada de visualização (UI):

```typescript
interface CapabilityItem {
  id: string; // Identificador único (UUID mockado)
  slug: string; // ex: 'work_orders'
  name: string; // ex: 'Work Orders'
  category: CapabilityCategory; // ex: 'work-management'
  description: string; // Descrição curta para exibição nos cards.
  core_business: boolean; // Indica se é core business ou função de suporte.
  mvp_priority: CapabilityMvpPriority;
  status: CapabilityStatus;
  depends_on: CapabilityDependency[]; // Array de slugs de capabilities necessárias.
  used_by: CapabilityDependency[]; // Array de slugs que dependem desta capability.
  owns_entities: string[]; // Lista das principais entidades gerenciadas (ex: ['WorkOrder', 'Task']).
  does_not_own: string[]; // Entidades que interage mas não possui (ex: ['User', 'Asset']).
  main_processes: string[]; // Principais processos de negócio (ex: ['Execute Work']).
  main_events: string[]; // Principais eventos emitidos (ex: ['work_order.completed']).
  related_docs: CapabilityDocumentLink[]; // Links documentais.
  boundary_risk: CapabilityBoundary[]; // Riscos documentados na fronteira de domínios.
  install_state: CapabilityInstallState; // Estado simulado na UI.
  synthetic_notes: string; // Notas indicando que este é um registro mockado.
}
```
