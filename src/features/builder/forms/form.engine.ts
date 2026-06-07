import {
  FormDefinition,
  formDefinitionSchema,
  FormValidationResult,
  FormValidationIssue,
  InformalSignal,
  FormSubmission,
  formSubmissionSchema,
  FormFieldDefinition,
  SignalOrigin,
} from "./form.types";

export function validateFormDefinition(
  definition: unknown
): FormValidationResult {
  const result = formDefinitionSchema.safeParse(definition);

  if (!result.success) {
    const issues: FormValidationIssue[] = result.error.issues.map((issue) => ({
      code: issue.code,
      message: issue.message,
      path: issue.path.map(String),
    }));
    return { valid: false, issues };
  }

  const def = result.data;
  const issues: FormValidationIssue[] = [];

  const keys = new Set<string>();

  for (let i = 0; i < def.fields.length; i++) {
    const field = def.fields[i];

    if (keys.has(field.key)) {
      issues.push({
        code: "duplicate_key",
        message: `Duplicate field key: ${field.key}`,
        path: ["fields", i, "key"],
      });
    }
    keys.add(field.key);

    if (field.type === "dropdown") {
      const options = field.config?.options || [];
      if (options.length === 0) {
        issues.push({
          code: "empty_options",
          message: "Dropdown must have at least one option",
          path: ["fields", i, "config", "options"],
        });
      } else {
        const optionSet = new Set<string>();
        for (let j = 0; j < options.length; j++) {
          const opt = options[j];
          if (optionSet.has(opt)) {
            issues.push({
              code: "duplicate_option",
              message: `Duplicate option in dropdown: ${opt}`,
              path: ["fields", i, "config", "options", j],
            });
          }
          optionSet.add(opt);
        }
      }
    }
  }

  if (issues.length > 0) {
    return { valid: false, issues };
  }

  return { valid: true };
}

export function normalizeSignalToSubmission(
  definition: FormDefinition,
  signal: InformalSignal
): FormSubmission {
  const data: Record<string, unknown> = {};

  const structuredData = signal.structuredData || {};

  // Preserve origin if it's a field
  const originFields = definition.fields.filter(f => f.type === "origin");

  for (const field of definition.fields) {
    if (field.type === "origin") {
      data[field.key] = signal.origin;
      continue;
    }

    let value = structuredData[field.key];

    if (value === undefined && field.defaultValue !== undefined) {
      value = field.defaultValue;
    }

    if (field.type === "text" && typeof value === "string") {
      value = value.trim();
    }

    if (value !== undefined) {
      data[field.key] = value;
    }
  }

  // Handle unknown fields
  // the instructions say: ignore or reject unknown fields based on a policy. We will ignore them by just strictly picking from fields.

  return {
    candidateId: signal.candidateId,
    formDefinitionId: signal.formDefinitionId,
    origin: signal.origin,
    originalText: signal.originalText,
    data,
    submittedAt: signal.submittedAt || new Date(),
  };
}

export function validateFormSubmission(
  definition: FormDefinition,
  submission: FormSubmission
): FormValidationResult {
  const result = formSubmissionSchema.safeParse(submission);
  if (!result.success) {
    const issues: FormValidationIssue[] = result.error.issues.map((issue) => ({
      code: issue.code,
      message: issue.message,
      path: issue.path.map(String),
    }));
    return { valid: false, issues };
  }

  const issues: FormValidationIssue[] = [];

  if (submission.candidateId !== definition.candidateId) {
    issues.push({
      code: "invalid_candidate",
      message: "Submission candidateId does not match definition candidateId",
      path: ["candidateId"],
    });
  }

  if (submission.formDefinitionId !== definition.id) {
    issues.push({
      code: "invalid_definition",
      message: "Submission formDefinitionId does not match definition id",
      path: ["formDefinitionId"],
    });
  }

  // Find unknown fields
  const definedKeys = new Set(definition.fields.map(f => f.key));
  for (const key of Object.keys(submission.data)) {
    if (!definedKeys.has(key)) {
       issues.push({
         code: "unknown_field",
         message: `Unknown field: ${key}`,
         path: ["data", key],
       });
    }
  }

  for (const field of definition.fields) {
    const value = submission.data[field.key];

    if (value === undefined || value === null || value === "") {
      if (field.required) {
        issues.push({
          code: "missing_required_field",
          message: `Missing required field: ${field.key}`,
          path: ["data", field.key],
        });
      }
      continue;
    }

    if (field.type === "text") {
      if (typeof value !== "string") {
        issues.push({
          code: "invalid_type",
          message: `Field ${field.key} must be a string`,
          path: ["data", field.key],
        });
      } else {
        const config = field.config as any;
        if (config?.minLength !== undefined && value.length < config.minLength) {
          issues.push({
            code: "too_short",
            message: `Field ${field.key} is too short`,
            path: ["data", field.key],
          });
        }
        if (config?.maxLength !== undefined && value.length > config.maxLength) {
          issues.push({
            code: "too_long",
            message: `Field ${field.key} is too long`,
            path: ["data", field.key],
          });
        }
      }
    } else if (field.type === "dropdown") {
      if (typeof value !== "string") {
         issues.push({
          code: "invalid_type",
          message: `Field ${field.key} must be a string`,
          path: ["data", field.key],
        });
      } else {
        const config = field.config as any;
        const options = config?.options || [];
        if (!options.includes(value)) {
          issues.push({
            code: "invalid_option",
            message: `Invalid option for field ${field.key}: ${value}`,
            path: ["data", field.key],
          });
        }
      }
    } else if (field.type === "origin") {
       if (value !== submission.origin) {
         issues.push({
           code: "invalid_origin",
           message: `Origin field ${field.key} cannot be overwritten`,
           path: ["data", field.key]
         });
       }
    }
  }

  if (issues.length > 0) {
    return { valid: false, issues };
  }

  return { valid: true };
}
