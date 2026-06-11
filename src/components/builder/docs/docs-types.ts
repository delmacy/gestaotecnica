export type DocsCategory =
  | "manifest"
  | "architecture"
  | "decision"
  | "tasker"
  | "ui_contract"
  | "capability"
  | "registry"
  | "process_mirroring"
  | "review_report"
  | "readiness"
  | "development_report"
  | "governance"
  | "enablement"
  | "runtime"
  | "integration";

export type DocsStatus =
  | "documented"
  | "needs_review"
  | "ready"
  | "done"
  | "blocked"
  | "future"
  | "archived";

export type DocsPhase =
  | "planning"
  | "readiness"
  | "development"
  | "review"
  | "approved"
  | "future";

export type DocsModule =
  | "shell"
  | "tasker"
  | "docs_viewer"
  | "capabilities"
  | "registry"
  | "process_mirroring"
  | "core";

export interface DocsRelation {
  id: string;
  type: "doc" | "task";
  label: string;
}

export interface DocsItem {
  id: string;
  title: string;
  slug: string;
  category: DocsCategory;
  module: DocsModule;
  phase: DocsPhase;
  status: DocsStatus;
  summary: string;
  source_path: string;
  related_docs: DocsRelation[];
  related_tasks: DocsRelation[];
  related_capabilities: string[];
  tags: string[];
  last_known_state: string;
  synthetic: boolean;
  notes?: string;
}