import {
  FormDefinition,
  FormDefinitionSchema
} from "../contracts/form-definition-contract";
import {
  FormBuilderStudioState,
  FormBuilderStudioStateSchema,
  StudioFieldState,
  StudioLayoutGroupState,
  StudioSectionState,
} from "../view-model/studio-state";

export interface AdapterWarning {
  code: string;
  message: string;
  path?: string[];
}

export interface AdapterError {
  code: string;
  message: string;
  path?: string[];
}

export type AdapterResult<T> =
  | {
      success: true;
      value: T;
      warnings: AdapterWarning[];
    }
  | {
      success: false;
      errors: AdapterError[];
    };

export interface AdapterContext {
  workspaceId?: string;
}

export function formDefinitionToStudioState(form: FormDefinition): AdapterResult<FormBuilderStudioState> {
  try {
    const warnings: AdapterWarning[] = [];

    const studioState: FormBuilderStudioState = {
      id: form.id,
      key: form.key,
      name: form.name,
      description: form.description,
      version: form.version,
      status: form.status,
      workspaceId: form.workspace_id,
      fields: form.fields.map(field => {
        const studioField: StudioFieldState = {
          id: field.id,
          key: field.key,
          type: field.type,
          label: field.label,
          description: field.description,
          required: field.required,
          defaultValue: field.defaultValue,
          placeholder: field.placeholder,
          validation: field.validation.map(v => ({
            type: v.type,
            value: v.value,
            message: v.message,
            customRuleReference: v.customRuleReference,
          })),
          visibility: field.visibility.map(v => ({
            fieldReference: v.fieldReference,
            operator: v.operator,
            expectedValue: v.expectedValue,
          })),
          options: field.options?.map(o => ({
            label: o.label,
            value: o.value,
          })),
          metadata: field.metadata,
        };
        return studioField;
      }),
      layout: {
        sections: form.layout.sections.map(section => {
          const studioSection: StudioSectionState = {
            id: section.id,
            title: section.title,
            description: section.description,
            groups: section.groups.map(group => {
              const studioGroup: StudioLayoutGroupState = {
                id: group.id,
                title: group.title,
                description: group.description,
                fieldReferences: [...group.fieldReferences],
                columns: group.columns,
              };
              return studioGroup;
            }),
          };
          return studioSection;
        }),
      },
      metadata: form.metadata,
      createdAt: form.created_at,
      updatedAt: form.updated_at,
    };

    return {
      success: true,
      value: JSON.parse(JSON.stringify(studioState)),
      warnings,
    };
  } catch (error) {
    return {
      success: false,
      errors: [{
        code: "CONVERSION_ERROR",
        message: error instanceof Error ? error.message : String(error),
      }],
    };
  }
}

export function studioStateToFormDefinition(
  state: FormBuilderStudioState,
  context: AdapterContext = {}
): AdapterResult<FormDefinition> {
  const warnings: AdapterWarning[] = [];

  // 1. Validate Input Studio State
  const studioParse = FormBuilderStudioStateSchema.safeParse(state);
  if (!studioParse.success) {
    return {
      success: false,
      errors: studioParse.error.issues.map(issue => ({
        code: "INVALID_STUDIO_STATE",
        message: issue.message,
        path: issue.path.map(String),
      })),
    };
  }

  // 2. Resolve Workspace Identity
  const stateWorkspaceId = state.workspaceId;
  const contextWorkspaceId = context.workspaceId;

  // Requirement 5: Workspace divergence
  if (stateWorkspaceId != null && stateWorkspaceId !== "" &&
      contextWorkspaceId != null && contextWorkspaceId !== "" &&
      stateWorkspaceId !== contextWorkspaceId) {
    return {
      success: false,
      errors: [{
        code: "WORKSPACE_DIVERGENCE",
        message: "Workspace ID in state diverges from context",
        path: ["workspaceId"],
      }],
    };
  }

  // Requirement 1: Resolve using nullish logic (not ||)
  const resolvedWorkspaceId = stateWorkspaceId ?? contextWorkspaceId;

  if (!resolvedWorkspaceId || resolvedWorkspaceId === "") {
    return {
      success: false,
      errors: [{
        code: "MISSING_WORKSPACE_ID",
        message: "Workspace ID is mandatory",
        path: ["workspaceId"],
      }],
    };
  }

  // 3. Build Candidate Object
  const candidate = {
    id: state.id,
    key: state.key,
    name: state.name,
    description: state.description,
    version: state.version,
    status: state.status,
    workspace_id: resolvedWorkspaceId,
    fields: state.fields.map(field => ({
      id: field.id,
      key: field.key,
      type: field.type,
      label: field.label,
      description: field.description,
      required: field.required,
      defaultValue: field.defaultValue,
      placeholder: field.placeholder,
      validation: field.validation.map(v => ({
        type: v.type,
        value: v.value,
        message: v.message,
        customRuleReference: v.customRuleReference,
      })),
      visibility: field.visibility.map(v => ({
        fieldReference: v.fieldReference,
        operator: v.operator,
        expectedValue: v.expectedValue,
      })),
      options: field.options?.map(o => ({
        label: o.label,
        value: o.value,
      })),
      metadata: field.metadata,
    })),
    layout: {
      sections: state.layout.sections.map(section => ({
        id: section.id,
        title: section.title,
        description: section.description,
        groups: section.groups.map(group => ({
          id: group.id,
          title: group.title,
          description: group.description,
          fieldReferences: [...group.fieldReferences],
          columns: group.columns,
        })),
      })),
    },
    metadata: state.metadata,
    created_at: state.createdAt,
    updated_at: state.updatedAt,
  };

  // 4. Validate Final Canonical Contract
  const canonicalParse = FormDefinitionSchema.safeParse(candidate);
  if (!canonicalParse.success) {
    return {
      success: false,
      errors: canonicalParse.error.issues.map(issue => ({
        code: "INVALID_CANONICAL_DEFINITION",
        message: issue.message,
        path: issue.path.map(String),
      })),
    };
  }

  // Clean the output to match round-trip expectations exactly (removing undefineds)
  return {
    success: true,
    value: JSON.parse(JSON.stringify(canonicalParse.data)),
    warnings,
  };
}
