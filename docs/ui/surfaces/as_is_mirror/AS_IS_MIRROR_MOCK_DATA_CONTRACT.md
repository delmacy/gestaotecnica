# As-Is Mirror Mock Data Contract

Define a estrutura de dados sintéticos para o As-Is Mirror Board, que será usada em memória localmente no front-end durante a fase de desenvolvimento com limites.

## Tipos Conceituais

### `AsIsDataConfidence`
```typescript
type AsIsDataConfidence = 'low' | 'medium' | 'high' | 'unknown' | 'conflicting';
```

### `AsIsDataSourceMode`
```typescript
type AsIsDataSourceMode = 'synthetic' | 'mock' | 'real_pending' | 'real_blocked' | 'mixed' | 'future_real_validation';
```

### `AsIsValidationStatus`
```typescript
type AsIsValidationStatus = 'not_reviewed' | 'synthetic_only' | 'partially_supported' | 'needs_real_validation' | 'accepted_as_demo' | 'blocked_real_sources' | 'future_validation';
```

### `AsIsStepType`
```typescript
type AsIsStepType = 'intake' | 'triage' | 'decision' | 'assignment' | 'execution' | 'handoff' | 'approval' | 'documentation' | 'notification' | 'closure' | 'exception';
```

### `AsIsActorRole`
```typescript
interface AsIsActorRole {
  id: string;
  name: string; // e.g., 'Requester', 'Dispatcher', 'Technician', 'Supervisor'
  type: 'internal' | 'external' | 'system';
}
```

### `AsIsInput` / `AsIsOutput`
```typescript
interface AsIsDataPoint {
  id: string;
  name: string;
  type: 'document' | 'data_field' | 'physical_item' | 'verbal';
  description?: string;
}
```

### `AsIsTouchpoint` (Systems and Documents)
```typescript
interface AsIsTouchpoint {
  id: string;
  name: string;
  type: 'system' | 'spreadsheet' | 'paper' | 'chat' | 'other';
  description?: string;
}
```

### `AsIsEvidenceLink`
```typescript
interface AsIsEvidenceLink {
  id: string;
  title: string;
  url?: string; // Always synthetic/placeholder in this phase
  type: 'screenshot' | 'document' | 'interview_quote' | 'observation_note';
}
```

### `AsIsGapOverlay`
```typescript
interface AsIsGapOverlay {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}
```

### `AsIsRiskFlag`
```typescript
interface AsIsRiskFlag {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
}
```

### `AsIsCapabilityCandidate`
```typescript
interface AsIsCapabilityCandidate {
  id: string;
  capability_key: string; // e.g., 'requests', 'work_orders'
  reasoning: string;
}
```

### `AsIsHandoff`
```typescript
interface AsIsHandoff {
  id: string;
  from_role_id: string;
  to_role_id: string;
  method: string; // e.g., 'Verbal', 'WhatsApp', 'System Assignment'
  artifacts_passed: string[]; // IDs de inputs/outputs
}
```

---

## Estruturas Principais

### `AsIsProcessStep`
```typescript
interface AsIsProcessStep {
  id: string;
  sequence: number;
  title: string;
  description: string;
  step_type: AsIsStepType;
  actor_role: string; // ID of AsIsActorRole
  input_refs: string[]; // IDs of AsIsDataPoint (inputs)
  output_refs: string[]; // IDs of AsIsDataPoint (outputs)
  system_touchpoints: AsIsTouchpoint[];
  document_touchpoints: AsIsTouchpoint[];
  evidence_refs: AsIsEvidenceLink[];
  gap_refs: AsIsGapOverlay[];
  risk_flags: AsIsRiskFlag[];
  capability_candidates: AsIsCapabilityCandidate[];
  data_source_mode: AsIsDataSourceMode;
  confidence: AsIsDataConfidence;
  validation_status: AsIsValidationStatus;
  synthetic: boolean;
  notes?: string;
}
```

### `AsIsProcessMirror`
```typescript
interface AsIsProcessMirror {
  id: string;
  title: string;
  slug: string;
  description: string;
  process_area: string; // e.g., 'Technical Support'
  data_source_mode: AsIsDataSourceMode;
  validation_status: AsIsValidationStatus;
  confidence: AsIsDataConfidence;
  steps: AsIsProcessStep[];
  handoffs: AsIsHandoff[];
  gap_overlays: AsIsGapOverlay[]; // Gaps that apply to the whole process
  capability_candidates: AsIsCapabilityCandidate[]; // Candidates for the whole process
  related_sources: string[]; // IDs to mock sources
  related_evidence: string[]; // IDs to mock evidence
  related_observations: string[]; // IDs to mock observations
  related_docs: string[]; // IDs to mock docs
  synthetic: boolean;
  notes?: string;
}
```
