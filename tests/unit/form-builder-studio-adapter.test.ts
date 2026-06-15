import { test, describe } from "node:test";
import assert from "node:assert";
import { FormDefinition } from "../../src/components/builder/form-builder/contracts/form-definition-contract";
import {
  formDefinitionToStudioState,
  studioStateToFormDefinition,
  AdapterResult
} from "../../src/components/builder/form-builder/adapters/studio-adapter";
import { FormBuilderStudioState } from "../../src/components/builder/form-builder/view-model/studio-state";

describe("FormBuilderStudio Adapter", () => {
  const minForm: FormDefinition = JSON.parse(JSON.stringify({
    id: "form-1",
    key: "min-form",
    name: "Minimal Form",
    version: "1.0.0",
    status: "draft",
    fields: [],
    layout: { sections: [] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  const completeForm: FormDefinition = JSON.parse(JSON.stringify({
    id: "form-2",
    key: "complete-form",
    name: "Complete Form",
    description: "Full test form",
    version: "2.1.0",
    status: "published",
    workspace_id: "ws-123",
    fields: [
      {
        id: "f1",
        key: "name",
        type: "text",
        label: "Name",
        required: true,
        validation: [{ type: "minLength", value: 3, message: "Too short" }],
        visibility: [],
      },
      {
        id: "f2",
        key: "age",
        type: "number",
        label: "Age",
        required: false,
        validation: [{ type: "min", value: 18 }],
        visibility: [{ fieldReference: "name", operator: "exists" }],
      },
      {
        id: "f3",
        key: "role",
        type: "select",
        label: "Role",
        required: true,
        options: [
          { label: "Admin", value: "admin" },
          { label: "User", value: "user" },
        ],
        validation: [],
        visibility: [],
      }
    ],
    layout: {
      sections: [
        {
          id: "s1",
          title: "Section 1",
          groups: [
            {
              id: "g1",
              title: "Group 1",
              fieldReferences: ["f1", "f2"],
            }
          ]
        }
      ]
    },
    metadata: { theme: "blue" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  test("should convert minimal FormDefinition to StudioState", () => {
    const result = formDefinitionToStudioState(minForm);
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.value.id, minForm.id);
      assert.strictEqual(result.value.key, minForm.key);
      assert.deepStrictEqual(result.value.fields, []);
    }
  });

  test("should convert complete FormDefinition to StudioState", () => {
    const result = formDefinitionToStudioState(completeForm);
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.value.id, completeForm.id);
      assert.strictEqual(result.value.workspaceId, completeForm.workspace_id);
      assert.strictEqual(result.value.fields.length, 3);
      assert.strictEqual(result.value.layout.sections.length, 1);
      assert.deepStrictEqual(result.value.metadata, completeForm.metadata);
    }
  });

  test("should perform round trip without semantic loss", () => {
    const toStudio = formDefinitionToStudioState(completeForm);
    assert.strictEqual(toStudio.success, true);
    if (toStudio.success) {
      const fromStudio = studioStateToFormDefinition(toStudio.value);
      assert.strictEqual(fromStudio.success, true);
      if (fromStudio.success) {
        assert.deepStrictEqual(fromStudio.value, completeForm);
      }
    }
  });

  test("should preserve workspaceId from context if missing in state", () => {
    const toStudioResult = formDefinitionToStudioState(minForm);
    if (toStudioResult.success) {
      const state: FormBuilderStudioState = {
        ...toStudioResult.value,
        workspaceId: undefined
      };
      const result = studioStateToFormDefinition(state, { workspaceId: "ws-context" });
      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.strictEqual(result.value.workspace_id, "ws-context");
      }
    } else {
      assert.fail("Setup failed");
    }
  });

  test("should return error if ID is missing during studioStateToFormDefinition", () => {
    const toStudioResult = formDefinitionToStudioState(minForm);
    if (toStudioResult.success) {
      const state: FormBuilderStudioState = { ...toStudioResult.value, id: "" };
      const result = studioStateToFormDefinition(state);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.errors.some(e => e.code === "MISSING_ID"));
      }
    } else {
      assert.fail("Setup failed");
    }
  });

  test("should handle all field types", () => {
    const types = [
      "text", "textarea", "number", "boolean", "date", "datetime", "select", "multiselect", "radio", "checkbox", "file", "reference"
    ] as const;

    const formWithAllTypes: FormDefinition = JSON.parse(JSON.stringify({
      ...minForm,
      fields: types.map((type, i) => ({
        id: `f${i}`,
        key: `k${i}`,
        type,
        label: `Label ${i}`,
        required: false,
        validation: [],
        visibility: [],
        options: ["select", "multiselect", "radio", "checkbox"].includes(type) ? [{ label: "O1", value: "v1" }] : undefined
      }))
    }));

    const result = formDefinitionToStudioState(formWithAllTypes);
    assert.strictEqual(result.success, true);
    if (result.success) {
      const roundTrip = studioStateToFormDefinition(result.value);
      assert.strictEqual(roundTrip.success, true);
      if (roundTrip.success) {
        assert.deepStrictEqual(roundTrip.value, formWithAllTypes);
      }
    }
  });

  test("should not mutate input objects", () => {
    const originalForm = JSON.parse(JSON.stringify(completeForm));
    formDefinitionToStudioState(completeForm);
    assert.deepStrictEqual(completeForm, originalForm);

    const studioStateResult = formDefinitionToStudioState(completeForm);
    if (studioStateResult.success) {
      const originalState = JSON.parse(JSON.stringify(studioStateResult.value));
      studioStateToFormDefinition(studioStateResult.value);
      assert.deepStrictEqual(studioStateResult.value, originalState);
    }
  });

  test("should handle frozen input", () => {
    const frozenForm = Object.freeze(JSON.parse(JSON.stringify(completeForm))) as FormDefinition;
    assert.doesNotThrow(() => formDefinitionToStudioState(frozenForm));

    const studioStateResult = formDefinitionToStudioState(completeForm);
    if (studioStateResult.success) {
       const frozenState = Object.freeze(JSON.parse(JSON.stringify(studioStateResult.value))) as FormBuilderStudioState;
       assert.doesNotThrow(() => studioStateToFormDefinition(frozenState));
    }
  });

  test("should be deterministic", () => {
    const result1 = formDefinitionToStudioState(completeForm);
    const result2 = formDefinitionToStudioState(completeForm);
    assert.deepStrictEqual(result1, result2);

    if (result1.success && result2.success) {
      const back1 = studioStateToFormDefinition(result1.value);
      const back2 = studioStateToFormDefinition(result2.value);
      assert.deepStrictEqual(back1, back2);
    }
  });

  test("should detect missing IDs in fields, sections and groups", () => {
    const toStudioResult = formDefinitionToStudioState(completeForm);
    if (toStudioResult.success) {
      const stateWithErrors = JSON.parse(JSON.stringify(toStudioResult.value)) as FormBuilderStudioState;
      stateWithErrors.fields[0].id = "";
      stateWithErrors.layout.sections[0].id = "";
      stateWithErrors.layout.sections[0].groups[0].id = "";

      const result = studioStateToFormDefinition(stateWithErrors);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.strictEqual(result.errors.length, 3);
        assert.ok(result.errors.every(e => e.code === "MISSING_ID"));
      }
    } else {
      assert.fail("Setup failed");
    }
  });
});
