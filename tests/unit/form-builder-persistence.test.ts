import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryFormPersistence } from '../../src/components/builder/form-builder/persistence/in-memory-form-persistence';
import { FormDefinition } from '../../src/components/builder/form-builder/contracts/form-definition-contract';

describe('Form Builder Persistence', () => {
  let persistence: InMemoryFormPersistence;

  const sampleForm: FormDefinition = {
    id: 'form-1',
    key: 'test-form',
    name: 'Test Form',
    version: '1.0.0',
    status: 'draft' as const,
    fields: [],
    layout: { sections: [] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    persistence = new InMemoryFormPersistence();
  });

  it('saves and loads a draft', async () => {
    await persistence.saveDraft(sampleForm);
    const loaded = await persistence.loadDraft(sampleForm.id);
    expect(loaded).toEqual(sampleForm);
  });

  it('returns null for non-existent draft', async () => {
    const loaded = await persistence.loadDraft('non-existent');
    expect(loaded).toBeNull();
  });

  it('lists versions by key', async () => {
    const v2 = { ...sampleForm, id: 'form-2', version: '2.0.0' };
    await persistence.saveDraft(sampleForm);
    await persistence.saveDraft(v2);

    const versions = await persistence.listVersions(sampleForm.key);
    expect(versions).toHaveLength(2);
    expect(versions).toContainEqual(sampleForm);
    expect(versions).toContainEqual(v2);
  });

  it('ensures isolation between forms', async () => {
    const otherForm = { ...sampleForm, id: 'other', key: 'other-key' };
    await persistence.saveDraft(sampleForm);
    await persistence.saveDraft(otherForm);

    const versions = await persistence.listVersions(sampleForm.key);
    expect(versions).toHaveLength(1);
    expect(versions[0].id).toBe(sampleForm.id);
  });

  it('deletes a draft', async () => {
    await persistence.saveDraft(sampleForm);
    await persistence.deleteDraft(sampleForm.id);
    const loaded = await persistence.loadDraft(sampleForm.id);
    expect(loaded).toBeNull();
  });

  it('prevents mutation via defensive copying on save', async () => {
    const form = { ...sampleForm };
    await persistence.saveDraft(form);
    form.name = 'Mutated';
    const loaded = await persistence.loadDraft(sampleForm.id);
    expect(loaded?.name).toBe('Test Form');
  });

  it('prevents mutation via defensive copying on load', async () => {
    await persistence.saveDraft(sampleForm);
    const loaded = await persistence.loadDraft(sampleForm.id);
    if (loaded) loaded.name = 'Mutated';
    const secondLoad = await persistence.loadDraft(sampleForm.id);
    expect(secondLoad?.name).toBe('Test Form');
  });
});
