import { describe, it, expect } from 'vitest';
import { FormDefinitionSchema } from '../../src/components/builder/form-builder/schema/form-schema';

describe('Form Builder Contracts', () => {
  const validMinimalForm = {
    id: 'form-1',
    key: 'test-form',
    name: 'Test Form',
    version: '1.0.0',
    status: 'draft',
    fields: [],
    layout: { sections: [] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  it('validates a minimal valid form', () => {
    const result = FormDefinitionSchema.safeParse(validMinimalForm);
    expect(result.success).toBe(true);
  });

  it('validates a complete valid form', () => {
    const completeForm = {
      ...validMinimalForm,
      fields: [
        {
          id: 'field-1',
          key: 'field_1',
          type: 'text',
          label: 'Field 1',
          required: true,
          validation: [{ type: 'minLength', value: 3, message: 'Too short' }]
        },
        {
          id: 'field-2',
          key: 'field_2',
          type: 'select',
          label: 'Field 2',
          options: [{ label: 'Opt 1', value: '1' }]
        }
      ],
      layout: {
        sections: [
          {
            id: 'sec-1',
            title: 'Section 1',
            groups: [
              {
                id: 'grp-1',
                fieldReferences: ['field-1', 'field-2']
              }
            ]
          }
        ]
      }
    };
    const result = FormDefinitionSchema.safeParse(completeForm);
    expect(result.success).toBe(true);
  });

  it('rejects duplicate field keys', () => {
    const invalidForm = {
      ...validMinimalForm,
      fields: [
        { id: 'f1', key: 'dup', type: 'text', label: 'L1' },
        { id: 'f2', key: 'dup', type: 'text', label: 'L2' }
      ]
    };
    const result = FormDefinitionSchema.safeParse(invalidForm);
    expect(result.success).toBe(false);
  });

  it('rejects duplicate field IDs', () => {
    const invalidForm = {
      ...validMinimalForm,
      fields: [
        { id: 'dup', key: 'k1', type: 'text', label: 'L1' },
        { id: 'dup', key: 'k2', type: 'text', label: 'L2' }
      ]
    };
    const result = FormDefinitionSchema.safeParse(invalidForm);
    expect(result.success).toBe(false);
  });

  it('rejects layout referencing non-existent field ID', () => {
    const invalidForm = {
      ...validMinimalForm,
      fields: [{ id: 'f1', key: 'k1', type: 'text', label: 'L1' }],
      layout: {
        sections: [{
          id: 's1',
          title: 'S1',
          groups: [{ id: 'g1', fieldReferences: ['f2'] }]
        }]
      }
    };
    const result = FormDefinitionSchema.safeParse(invalidForm);
    expect(result.success).toBe(false);
  });

  it('rejects visibility referencing non-existent field key', () => {
    const invalidForm = {
      ...validMinimalForm,
      fields: [{
        id: 'f1',
        key: 'k1',
        type: 'text',
        label: 'L1',
        visibility: [{ fieldReference: 'k2', operator: 'eq', expectedValue: 'val' }]
      }]
    };
    const result = FormDefinitionSchema.safeParse(invalidForm);
    expect(result.success).toBe(false);
  });

  it('performs JSON round trip correctly', () => {
    const result = FormDefinitionSchema.parse(validMinimalForm);
    const json = JSON.stringify(result);
    const back = JSON.parse(json);
    expect(back).toEqual(validMinimalForm);
  });

  it('rejects incompatible defaultValue for number field', () => {
    const invalidForm = {
      ...validMinimalForm,
      fields: [{ id: 'f1', key: 'k1', type: 'number', label: 'L1', defaultValue: 'string' }]
    };
    const result = FormDefinitionSchema.safeParse(invalidForm);
    expect(result.success).toBe(false);
  });

  it('rejects missing options for select field', () => {
    const invalidForm = {
      ...validMinimalForm,
      fields: [{ id: 'f1', key: 'k1', type: 'select', label: 'L1' }]
    };
    const result = FormDefinitionSchema.safeParse(invalidForm);
    expect(result.success).toBe(false);
  });
});
