# Form Builder - Static Schema Contract

Este documento descreve as interfaces Typescript fundamentais que representarão a estrutura do "Form Blueprint" neste estágio Mock.

## Tipos e Enums

```typescript
export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'datetime'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'file_placeholder'
  | 'photo_placeholder'
  | 'signature_placeholder'
  | 'user_reference_placeholder'
  | 'asset_reference_placeholder'
  | 'status_badge'
  | 'computed_placeholder';

export type FormValidationType =
  | 'required'
  | 'min_length'
  | 'max_length'
  | 'min_value'
  | 'max_value'
  | 'regex_placeholder'
  | 'allowed_values'
  | 'date_range'
  | 'custom_future_rule';

export type FormReadinessStatus =
  | 'draft'
  | 'mock_ready'
  | 'needs_validation'
  | 'needs_real_sources'
  | 'ready_for_demo'
  | 'blocked_runtime'
  | 'future_runtime';

export type FormDataSourceMode =
  | 'synthetic'
  | 'mock'
  | 'real_pending'
  | 'real_blocked'
  | 'future_real_validation';

export interface FormFieldValidation {
  type: FormValidationType;
  value?: string | number | string[];
  message: string;
}

export interface FormBinding {
  capability: string;
  entity: string;
  field: string;
}

export interface FormGovernanceWarning {
  field_key: string;
  warning_type: 'pii_risk' | 'compliance_risk' | 'data_leak_risk';
  message: string;
}

export interface FormLayoutRule {
  gridSpan?: number;
  hidden?: boolean;
}

export interface FormField {
  id: string;
  section_id: string;
  label: string;
  key: string;
  field_type: FormFieldType;
  required: boolean;
  placeholder: string;
  help_text: string;
  default_value?: any;
  validation_rules: FormFieldValidation[];
  layout: FormLayoutRule;
  binding?: FormBinding;
  data_source_mode: FormDataSourceMode;
  readiness_status: FormReadinessStatus;
  synthetic: boolean;
  notes: string;
  options?: { label: string; value: string }[]; // Para selects, radios
}

export interface FormSection {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface FormBlueprint {
  id: string;
  name: string;
  slug: string;
  description: string;
  process_area: string;
  data_source_mode: FormDataSourceMode;
  readiness_status: FormReadinessStatus;
  sections: FormSection[];
  fields: FormField[]; // Fields referenciam section_id
  bindings: FormBinding[]; // Bindings em nível de form (ex: qual processo ele inicia)
  governance_warnings: FormGovernanceWarning[];
  related_capabilities: string[];
  related_process_steps: string[];
  related_docs: string[];
  synthetic: boolean;
  notes: string;
}

export interface FormBuilderStaticData {
  version: string;
  lastUpdated: string;
  blueprints: FormBlueprint[];
}
```

## Regras de integridade
- Ao mockar os Blueprints, cada formulário (Blueprint) deve conter suas seções e os campos alocados em cada seção.
- O campo `data_source_mode` deve garantir o alinhamento com a fase atual do projeto.
