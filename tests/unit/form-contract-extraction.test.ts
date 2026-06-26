import { test } from "node:test";
import assert from "node:assert";
import {
  FormDefinitionSchema,
  FormFieldTypeSchema,
  FieldDefinitionSchema,
  FormLayoutSchema,
  FormStatusSchema
} from "../../src/platform/forms/contracts";

import {
  FormDefinitionSchema as LegacyFormDefinitionSchema,
} from "../../src/components/builder/form-builder/schema/form-schema";

import {
  FormFieldTypeSchema as LegacyFormFieldTypeSchema,
  FieldDefinitionSchema as LegacyFieldDefinitionSchema,
} from "../../src/components/builder/form-builder/schema/field-schema";

import {
  FormLayoutSchema as LegacyFormLayoutSchema,
} from "../../src/components/builder/form-builder/schema/layout-schema";

test("Contract Extraction: Should be semantically equivalent", () => {
  assert.strictEqual(FormDefinitionSchema, LegacyFormDefinitionSchema);
  assert.strictEqual(FormFieldTypeSchema, LegacyFormFieldTypeSchema);
  assert.strictEqual(FieldDefinitionSchema, LegacyFieldDefinitionSchema);
  assert.strictEqual(FormLayoutSchema, LegacyFormLayoutSchema);
});

test("Contract Extraction: Should validate a minimal valid form", () => {
  const validForm = {
    id: "form-1",
    key: "test-form",
    name: "Test Form",
    version: "1.0.0",
    status: "draft",
    fields: [],
    layout: {
      sections: []
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const result = FormDefinitionSchema.safeParse(validForm);
  assert.strictEqual(result.success, true);
});

test("Contract Extraction: Should validate a complete valid form", () => {
  const validForm = {
    id: "form-1",
    key: "test-form",
    name: "Test Form",
    version: "1.0.0",
    status: "published",
    fields: [
      {
        id: "field-1",
        key: "name",
        type: "text",
        label: "Name",
        required: true,
        validation: [
          { type: "required", message: "Required" }
        ],
        visibility: []
      }
    ],
    layout: {
      sections: [
        {
          id: "section-1",
          title: "General",
          groups: [
            {
              id: "group-1",
              fieldReferences: ["field-1"]
            }
          ]
        }
      ]
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const result = FormDefinitionSchema.safeParse(validForm);
  if (!result.success) {
    console.error(JSON.stringify(result.error.format(), null, 2));
  }
  assert.strictEqual(result.success, true);
});

test("Contract Extraction: Should reject invalid field type", () => {
  const invalidField = {
    id: "field-1",
    key: "name",
    type: "invalid_type",
    label: "Name"
  };

  const result = FieldDefinitionSchema.safeParse(invalidField);
  assert.strictEqual(result.success, false);
});

test("Contract Extraction: Should reject layout with non-existent field reference", () => {
  const invalidForm = {
    id: "form-1",
    key: "test-form",
    name: "Test Form",
    version: "1.0.0",
    status: "draft",
    fields: [
      {
        id: "field-1",
        key: "name",
        type: "text",
        label: "Name"
      }
    ],
    layout: {
      sections: [
        {
          id: "section-1",
          title: "General",
          groups: [
            {
              id: "group-1",
              fieldReferences: ["non-existent"]
            }
          ]
        }
      ]
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const result = FormDefinitionSchema.safeParse(invalidForm);
  assert.strictEqual(result.success, false);
  if (!result.success) {
    assert.ok(result.error.message.includes("Layout references non-existent field ID"));
  }
});
