export type OperatorGuideCategory =
  | "getting_started"
  | "platform_access"
  | "navigation"
  | "process_mirroring"
  | "form_builder"
  | "view_builder"
  | "workflow_builder"
  | "governance"
  | "review_and_validation"
  | "troubleshooting";

export type OperatorGuideAudience =
  | "platform_builder"
  | "platform_admin"
  | "operator"
  | "reviewer"
  | "process_analyst"
  | "ux_architect"
  | "future_workspace_owner";

export type OperatorGuideDifficulty =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "reference";

export type OperatorGuideReadinessStatus =
  | "draft"
  | "mock_ready"
  | "ready_for_demo"
  | "needs_validation"
  | "future_dynamic_docs";

export type OperatorGuideDataSourceMode =
  | "static_documentation"
  | "synthetic"
  | "mock"
  | "existing_surface_reference"
  | "future_dynamic_source";

export interface OperatorPrerequisite {
  id: string;
  description: string;
}

export interface OperatorProcedureStep {
  id: string;
  order: number;
  title: string;
  description: string;
  expected_result?: string;
  warning_refs?: string[];
  related_route?: string;
  command_text_placeholder?: string;
  is_optional: boolean;
  synthetic: boolean;
  notes?: string;
}

export interface OperatorWarning {
  id: string;
  level: "info" | "warning" | "critical";
  message: string;
}

export interface OperatorTroubleshootingItem {
  id: string;
  problem_statement: string;
  solution_steps: string[];
}

export interface OperatorRelatedRoute {
  route_path: string;
  label: string;
  description: string;
}

export interface OperatorGuide {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: OperatorGuideCategory;
  audiences: OperatorGuideAudience[];
  difficulty: OperatorGuideDifficulty;
  readiness_status: OperatorGuideReadinessStatus;
  data_source_mode: OperatorGuideDataSourceMode;
  prerequisites: OperatorPrerequisite[];
  procedures: OperatorProcedureStep[];
  warnings: OperatorWarning[];
  troubleshooting: OperatorTroubleshootingItem[];
  related_surfaces: string[];
  related_routes: OperatorRelatedRoute[];
  related_docs: string[];
  synthetic: boolean;
  notes?: string;
}
