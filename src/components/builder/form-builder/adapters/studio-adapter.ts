import { FormDefinition, FieldDefinition, LayoutSection, LayoutGroup, FormStatus } from "../contracts/form-definition-contract";
import {
  FormBuilderStudioState,
  StudioFieldState,
  StudioLayoutState,
  StudioSectionState,
  StudioLayoutGroupState,
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
        sections: form.layout.sections.map(section => ({
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
      metadata: form.metadata,
      createdAt: form.created_at,
      updatedAt: form.updated_at,
    };

    // Use JSON.parse(JSON.stringify()) once at the end to clean undefined and ensure deep copy
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
  try {
    const warnings: AdapterWarning[] = [];
    const errors: AdapterError[] = [];

    if (!state.id) errors.push({ code: "MISSING_ID", message: "Form ID is required", path: ["id"] });

    const fields: FieldDefinition[] = state.fields.map((field, index) => {
      if (!field.id) errors.push({ code: "MISSING_ID", message: `Field at index ${index} is missing ID`, path: ["fields", String(index), "id"] });

      const fieldDef: FieldDefinition = {
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
        metadata: field.metadata,
      };

      if (field.options) {
        fieldDef.options = field.options.map(o => ({
          label: o.label,
          value: o.value,
        }));
      }

      return fieldDef;
    });

    const sections: LayoutSection[] = state.layout.sections.map((section, sIdx) => {
      if (!section.id) errors.push({ code: "MISSING_ID", message: `Section at index ${sIdx} is missing ID`, path: ["layout", "sections", String(sIdx), "id"] });

      return {
        id: section.id,
        title: section.title,
        description: section.description,
        groups: section.groups.map((group, gIdx) => {
          if (!group.id) errors.push({ code: "MISSING_ID", message: `Group at index ${gIdx} in section ${sIdx} is missing ID`, path: ["layout", "sections", String(sIdx), "groups", String(gIdx), "id"] });

          return {
            id: group.id,
            title: group.title,
            description: group.description,
            fieldReferences: [...group.fieldReferences],
            columns: group.columns,
          };
        }),
      };
    });

    if (errors.length > 0) {
      return { success: false, errors };
    }

    const formDef: FormDefinition = {
      id: state.id,
      key: state.key,
      name: state.name,
      description: state.description,
      version: state.version,
      status: state.status as FormStatus,
      workspace_id: state.workspaceId || context.workspaceId,
      fields,
      layout: {
        sections,
      },
      metadata: state.metadata,
      created_at: state.createdAt,
      updated_at: state.updatedAt,
    };

    return {
      success: true,
      value: JSON.parse(JSON.stringify(formDef)) as FormDefinition,
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
