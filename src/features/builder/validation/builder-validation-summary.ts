import type { BuilderValidationIssue, BuilderValidationResult } from "../types";

export type BuilderValidationSummary = {
  valid: boolean;
  errorCount: number;
  warningCount: number;
  errors: BuilderValidationIssue[];
  warnings: BuilderValidationIssue[];
};

export function summarizeBuilderValidation(
  result: BuilderValidationResult,
): BuilderValidationSummary {
  const errors = result.issues.filter((issue) => issue.severity === "error");
  const warnings = result.issues.filter((issue) => issue.severity === "warning");

  return {
    valid: result.valid,
    errorCount: errors.length,
    warningCount: warnings.length,
    errors,
    warnings,
  };
}
