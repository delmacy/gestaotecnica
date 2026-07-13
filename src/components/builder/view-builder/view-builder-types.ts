export type ViewType =
  | "table"
  | "detail"
  | "kanban"
  | "calendar"
  | "timeline"
  | "dashboard_cards"
  | "compact_list"
  | "split_master_detail";

export type FilterType =
  | "text_contains"
  | "equals"
  | "not_equals"
  | "date_range"
  | "number_range"
  | "status_in"
  | "role_scope_placeholder"
  | "capability_scope_placeholder"
  | "future_runtime_rule";

export type ActionType =
  | "open_detail"
  | "assign_placeholder"
  | "change_status_placeholder"
  | "export_placeholder"
  | "notify_placeholder"
  | "create_related_placeholder"
  | "future_runtime_action";

export type ReadinessStatus =
  | "draft"
  | "mock_ready"
  | "needs_validation"
  | "needs_real_sources"
  | "ready_for_demo"
  | "blocked_runtime"
  | "future_runtime";

export type DataSourceMode =
  | "synthetic"
  | "mock"
  | "real_pending"
  | "real_blocked"
  | "future_real_validation";

export interface ViewField {
  id: string;
  label: string;
  key: string;
  source_field_key: string;
  field_type: string;
  visible: boolean;
  sortable: boolean;
  filterable: boolean;
  groupable: boolean;
  width: string;
  format: string;
  binding: string;
  data_source_mode: DataSourceMode;
  readiness_status: ReadinessStatus;
  synthetic: boolean;
  notes: string;
}

export interface StaticViewModel {
  fields: ViewField[];
  layout: ViewLayoutRule;
  sample_rows: Record<string, unknown>[];
  display_metadata: Record<string, unknown>;
}

export interface ViewColumn {
  id: string;
  field_id: string;
  order: number;
}

export interface ViewFilter {
  id: string;
  field_id: string;
  filter_type: FilterType;
  default_value?: string;
}

export interface ViewSortRule {
  id: string;
  field_id: string;
  direction: "asc" | "desc";
  order: number;
}

export interface ViewGroupRule {
  id: string;
  field_id: string;
  order: number;
}

export interface ViewAction {
  id: string;
  label: string;
  action_type: ActionType;
  icon?: string;
}

export interface ViewLayoutRule {
  show_title: boolean;
  show_filters: boolean;
  show_actions: boolean;
  default_page_size: number;
}

export interface ViewBinding {
  id: string;
  target_type: "form" | "capability" | "process_step";
  target_id: string;
  description: string;
}

export interface ViewGovernanceWarning {
  id: string;
  message: string;
  severity: "info" | "warning" | "error";
}

export interface ViewPreviewState {
  has_mock_data: boolean;
  mock_row_count: number;
}

export interface ViewBlueprint {
  id: string;
  name: string;
  slug: string;
  description: string;
  process_area: string;
  view_type: ViewType;
  data_source_mode: DataSourceMode;
  readiness_status: ReadinessStatus;
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
}
