export type StudioFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'datetime'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'boolean'
  | 'file'
  | 'reference';

export interface StudioValidationRule {
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'enum' | 'custom';
  value?: unknown;
  message?: string;
  customRuleReference?: string;
}

export interface StudioVisibilityRule {
  fieldReference: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'exists';
  expectedValue?: unknown;
}

export interface StudioFieldOption {
  label: string;
  value: string | number | boolean;
}

export interface StudioFieldState {
  id: string;
  key: string;
  type: StudioFieldType;
  label: string;
  description?: string;
  required: boolean;
  defaultValue?: unknown;
  placeholder?: string;
  validation: StudioValidationRule[];
  visibility: StudioVisibilityRule[];
  options?: StudioFieldOption[];
  metadata?: Record<string, unknown>;
}

export interface StudioLayoutGroupState {
  id: string;
  title?: string;
  description?: string;
  fieldReferences: string[];
  columns?: number;
}

export interface StudioSectionState {
  id: string;
  title: string;
  description?: string;
  groups: StudioLayoutGroupState[];
}

export interface StudioLayoutState {
  sections: StudioSectionState[];
}

export interface FormBuilderStudioState {
  id: string;
  key: string;
  name: string;
  description?: string;
  version: string;
  status: 'draft' | 'published' | 'archived';
  workspaceId?: string;
  fields: StudioFieldState[];
  layout: StudioLayoutState;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
