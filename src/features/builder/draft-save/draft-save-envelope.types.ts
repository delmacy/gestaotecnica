import type { BuilderValidationIssue } from "@/features/builder/types";

export type DraftSaveEnvelope<T> =
  | { ok: true; data: T }
  | { ok: false; error: { type: "validation_failure"; errors: BuilderValidationIssue[] } }
  | { ok: false; error: { type: "conflict_failure"; message: string; baseVersion: string } };
