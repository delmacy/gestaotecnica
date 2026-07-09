import { validateBuilderDraft } from "@/features/builder/process-editor/validate-builder-draft";
import type { BuilderDraft } from "@/features/builder/types";

export type PublicationPreflightResult = {
  valid: boolean;
  issues: Array<{ code: string; message: string; severity: "error" | "warning"; path?: string }>;
};

/**
 * Validates a workflow draft for publication readiness.
 * Acts as a pure preflight helper before committing a publication.
 */
export function preflightPublication(draft: BuilderDraft): PublicationPreflightResult {
  const result = validateBuilderDraft(draft);

  return {
    valid: result.valid,
    issues: result.issues,
  };
}
