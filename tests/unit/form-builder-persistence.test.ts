import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
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
    assert.deepStrictEqual(loaded, sampleForm);
  });

  it('returns null for non-existent draft', async () => {
    const loaded = await persistence.loadDraft('non-existent');
    assert.strictEqual(loaded, null);
  });

  it('lists versions by key', async () => {
    const v2 = { ...sampleForm, id: 'form-2', version: '2.0.0' };
    await persistence.saveDraft(sampleForm);
    await persistence.saveDraft(v2);

    const versions = await persistence.listVersions(sampleForm.key);
    assert.strictEqual(versions.length, 2);
    assert.ok(versions.some(v => v.id === sampleForm.id));
    assert.ok(versions.some(v => v.id === v2.id));
  });

  it('ensures isolation between forms', async () => {
    const otherForm = { ...sampleForm, id: 'other', key: 'other-key' };
    await persistence.saveDraft(sampleForm);
    await persistence.saveDraft(otherForm);

    const versions = await persistence.listVersions(sampleForm.key);
    assert.strictEqual(versions.length, 1);
    assert.strictEqual(versions[0].id, sampleForm.id);
  });

  it('deletes a draft', async () => {
    await persistence.saveDraft(sampleForm);
    await persistence.deleteDraft(sampleForm.id);
    const loaded = await persistence.loadDraft(sampleForm.id);
    assert.strictEqual(loaded, null);
  });

  it('prevents mutation via defensive copying on save', async () => {
    const form = { ...sampleForm };
    await persistence.saveDraft(form);
    form.name = 'Mutated';
    const loaded = await persistence.loadDraft(sampleForm.id);
    assert.strictEqual(loaded?.name, 'Test Form');
  });

  it('prevents mutation via defensive copying on load', async () => {
    await persistence.saveDraft(sampleForm);
    const loaded = await persistence.loadDraft(sampleForm.id);
    if (loaded) loaded.name = 'Mutated';
    const secondLoad = await persistence.loadDraft(sampleForm.id);
    assert.strictEqual(secondLoad?.name, 'Test Form');
  });
});
