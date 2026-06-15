import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { InMemoryFormPersistence } from '../../src/components/builder/form-builder/persistence/in-memory-form-persistence';
import { FormDefinition } from '../../src/components/builder/form-builder/contracts/form-definition-contract';
import { WorkspaceDivergenceError } from '../../src/components/builder/form-builder/persistence/errors';

describe('Form Builder Persistence - Workspace Isolation', () => {
  let persistence: InMemoryFormPersistence;
  const workspaceA = '550e8400-e29b-41d4-a716-446655440000';
  const workspaceB = '660e8400-e29b-41d4-a716-446655440000';

  const sampleForm: FormDefinition = {
    id: 'form-1',
    key: 'test-form',
    name: 'Test Form',
    version: '1.0.0',
    status: 'draft' as const,
    workspace_id: workspaceA,
    fields: [],
    layout: { sections: [] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    persistence = new InMemoryFormPersistence();
  });

  it('saves and loads a draft in the same workspace', async () => {
    await persistence.saveDraft(workspaceA, sampleForm);
    const loaded = await persistence.loadDraft(workspaceA, sampleForm.id);
    assert.deepStrictEqual(loaded, sampleForm);
  });

  it('throws error when saving with divergent workspaceId', async () => {
    await assert.rejects(
      persistence.saveDraft(workspaceB, sampleForm),
      {
        name: 'WorkspaceDivergenceError',
        message: /does not match context workspaceId/
      }
    );
  });

  it('throws error when loading from different workspace', async () => {
    await persistence.saveDraft(workspaceA, sampleForm);
    await assert.rejects(
      persistence.loadDraft(workspaceB, sampleForm.id),
      {
        name: 'WorkspaceDivergenceError',
        message: /belongs to a different workspace/
      }
    );
  });

  it('returns null for non-existent draft', async () => {
    const loaded = await persistence.loadDraft(workspaceA, 'non-existent');
    assert.strictEqual(loaded, null);
  });

  it('lists versions isolated by workspace', async () => {
    const v2 = { ...sampleForm, id: 'form-2', version: '2.0.0' };
    const formB = { ...sampleForm, id: 'form-b', workspace_id: workspaceB };

    await persistence.saveDraft(workspaceA, sampleForm);
    await persistence.saveDraft(workspaceA, v2);
    await persistence.saveDraft(workspaceB, formB);

    const versionsA = await persistence.listVersions(workspaceA, sampleForm.key);
    assert.strictEqual(versionsA.length, 2);
    assert.ok(versionsA.every(v => v.workspace_id === workspaceA));

    const versionsB = await persistence.listVersions(workspaceB, sampleForm.key);
    assert.strictEqual(versionsB.length, 1);
    assert.strictEqual(versionsB[0].id, 'form-b');
  });

  it('handles forms with the same key in different workspaces', async () => {
    const formA = { ...sampleForm, id: 'form-a', key: 'shared-key', workspace_id: workspaceA };
    const formB = { ...sampleForm, id: 'form-b', key: 'shared-key', workspace_id: workspaceB };

    await persistence.saveDraft(workspaceA, formA);
    await persistence.saveDraft(workspaceB, formB);

    const listA = await persistence.listVersions(workspaceA, 'shared-key');
    assert.strictEqual(listA.length, 1);
    assert.strictEqual(listA[0].id, 'form-a');

    const listB = await persistence.listVersions(workspaceB, 'shared-key');
    assert.strictEqual(listB.length, 1);
    assert.strictEqual(listB[0].id, 'form-b');
  });

  it('deletes a draft in the same workspace', async () => {
    await persistence.saveDraft(workspaceA, sampleForm);
    await persistence.deleteDraft(workspaceA, sampleForm.id);
    const loaded = await persistence.loadDraft(workspaceA, sampleForm.id);
    assert.strictEqual(loaded, null);
  });

  it('throws error when deleting from different workspace', async () => {
    await persistence.saveDraft(workspaceA, sampleForm);
    await assert.rejects(
      persistence.deleteDraft(workspaceB, sampleForm.id),
      {
        name: 'WorkspaceDivergenceError',
        message: /Cannot delete form/
      }
    );
    // Verify it was not deleted
    const loaded = await persistence.loadDraft(workspaceA, sampleForm.id);
    assert.ok(loaded);
  });

  it('prevents mutation via defensive copying on save', async () => {
    const form = JSON.parse(JSON.stringify(sampleForm));
    await persistence.saveDraft(workspaceA, form);
    form.name = 'Mutated';
    const loaded = await persistence.loadDraft(workspaceA, sampleForm.id);
    assert.strictEqual(loaded?.name, 'Test Form');
  });

  it('prevents mutation via defensive copying on load', async () => {
    await persistence.saveDraft(workspaceA, sampleForm);
    const loaded = await persistence.loadDraft(workspaceA, sampleForm.id);
    if (loaded) loaded.name = 'Mutated';
    const secondLoad = await persistence.loadDraft(workspaceA, sampleForm.id);
    assert.strictEqual(secondLoad?.name, 'Test Form');
  });

  it('ensures no leakage between tenants in list', async () => {
    await persistence.saveDraft(workspaceA, sampleForm);
    const listB = await persistence.listVersions(workspaceB, sampleForm.key);
    assert.strictEqual(listB.length, 0);
  });
});
