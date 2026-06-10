# Tasker Board Mock Data Contract

Este documento define a estrutura conceitual (shape) dos dados mockados para o Tasker Board durante a fase de construção da plataforma.

**Importante:** Na fase inicial de implementação (MVP), esses dados serão hardcoded no frontend ou lidos de arquivos estáticos localmente. Eles são derivados de `docs/tasker/BACKLOG.md` e não devem editar o markdown real nem persistir no banco de dados. Eles não simulam um caso de uso do cliente Gestão Técnica.

## Tipos e Enumerações Conceituais

### TaskStatus
```typescript
type TaskStatus = 'backlog' | 'ready' | 'in_progress' | 'review' | 'done' | 'blocked' | 'cancelled';
```

### TaskPriority
```typescript
type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
```

### TaskGroup
```typescript
type TaskGroup = 'A' | 'B' | 'C' | 'D';
```

### TaskEvidence
```typescript
interface TaskEvidence {
  id: string;
  name: string;
  filePath: string;
  provided: boolean;
}
```

### TaskDependency
```typescript
interface TaskDependency {
  taskId: string;
  relationship: 'depends_on' | 'blocked_by' | 'blocks';
}
```

### TaskAgent
```typescript
interface TaskAgent {
  id: string;
  name: string;
  role: string; // Ex: "Jules UI Architect", "Jules Backend Dev"
}
```

### TaskTransition
```typescript
interface TaskTransition {
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  timestamp: string; // ISO String
  reason?: string; // Required for 'blocked' or 'cancelled'
}
```

## Entidade Principal: TaskItem

```typescript
interface TaskItem {
  id: string; // Ex: BUILDER-SHELL-001
  title: string;
  module: string; // Ex: ui, tasker, process_mirroring
  group: TaskGroup;
  type: 'architecture' | 'contract' | 'implementation' | 'documentation';
  priority: TaskPriority;
  status: TaskStatus;
  summary: string;
  depends_on: TaskDependency[];
  blocked_by: TaskDependency[];
  agent_owner?: TaskAgent;
  expected_files: string[]; // paths or filename patterns
  acceptance_criteria: string[];
  evidence: TaskEvidence[];
  created_at: string; // ISO String
  updated_at: string; // ISO String
  source_docs: string[]; // Related conceptual docs (e.g., contracts)
  next_action: string;
  is_synthetic?: boolean; // True for tasks simulating real data but using mocks
}
```
