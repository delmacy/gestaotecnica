import { test } from 'node:test';
import assert from 'node:assert';
import { parseCandidateEvidence } from '../../src/components/builder/candidates/candidate-evidence-view-model';

test('parseCandidateEvidence', async (t) => {
  await t.test('handles null or undefined evidence safely', () => {
    const resultNull = parseCandidateEvidence(null);
    assert.strictEqual(resultNull.hasStructuredEvidence, false);
    assert.deepStrictEqual(resultNull.raw, {});

    const resultUndefined = parseCandidateEvidence(undefined);
    assert.strictEqual(resultUndefined.hasStructuredEvidence, false);
    assert.deepStrictEqual(resultUndefined.raw, {});
  });

  await t.test('handles empty object legacy evidence', () => {
    const legacy = {};
    const result = parseCandidateEvidence(legacy);
    assert.strictEqual(result.hasStructuredEvidence, false);
    assert.deepStrictEqual(result.raw, legacy);
  });

  await t.test('handles raw data legacy evidence without breaking', () => {
    const legacy = { some_old_key: "value123", another: 42 };
    const result = parseCandidateEvidence(legacy);
    assert.strictEqual(result.hasStructuredEvidence, false);
    assert.deepStrictEqual(result.raw, legacy);
  });

  await t.test('extracts agent properly', () => {
    const evidence = {
      agent: {
        source: 'paperclip',
        type: 'process_builder',
        name: 'SuperAgent',
        version: '1.0',
      }
    };
    const result = parseCandidateEvidence(evidence);
    assert.strictEqual(result.hasStructuredEvidence, true);
    assert.deepStrictEqual(result.agent, {
      source: 'paperclip',
      type: 'process_builder',
      name: 'SuperAgent',
      version: '1.0',
    });
  });

  await t.test('extracts confidenceScore', () => {
    const evidence = {
      proposal: {
        confidenceScore: 0.85
      }
    };
    const result = parseCandidateEvidence(evidence);
    assert.strictEqual(result.hasStructuredEvidence, true);
    assert.strictEqual(result.proposal?.confidenceScore, 0.85);
  });

  await t.test('extracts suggestedStates securely ignoring malformed items', () => {
    const evidence = {
      proposal: {
        suggestedStates: [
          { key: 'draft', label: 'Rascunho', description: 'desc', order: 1 },
          { key: 'review' }, // missing label, should be ignored
          "not an object",
          null
        ]
      }
    };
    const result = parseCandidateEvidence(evidence);
    assert.strictEqual(result.hasStructuredEvidence, true);
    assert.strictEqual(result.proposal?.suggestedStates?.length, 1);
    assert.deepStrictEqual(result.proposal?.suggestedStates?.[0], {
      key: 'draft', label: 'Rascunho', description: 'desc', order: 1
    });
  });

  await t.test('extracts suggestedForms securely ignoring malformed items', () => {
    const evidence = {
      proposal: {
        suggestedForms: [
          {
            key: 'form1',
            title: 'Meu Form',
            fields: [
              { key: 'f1', label: 'Field 1', type: 'text', required: true, options: ['A', 'B'] },
              { key: 'f2', label: 'Field 2' } // missing type, should be ignored
            ]
          },
          { key: 'form2' } // missing title, should be ignored
        ]
      }
    };
    const result = parseCandidateEvidence(evidence);
    assert.strictEqual(result.hasStructuredEvidence, true);
    assert.strictEqual(result.proposal?.suggestedForms?.length, 1);
    assert.deepStrictEqual(result.proposal?.suggestedForms?.[0].key, 'form1');
    assert.strictEqual(result.proposal?.suggestedForms?.[0].fields.length, 1);
    assert.deepStrictEqual(result.proposal?.suggestedForms?.[0].fields[0], {
      key: 'f1', label: 'Field 1', type: 'text', required: true, options: ['A', 'B']
    });
  });

  await t.test('extracts observedSignals securely', () => {
    const evidence = {
      observedSignals: [
        { source: 'slack', summary: 'Message sent', occurredAt: '2023-01-01T10:00:00Z', reference: 'msg-id' },
        { source: 'email' } // missing summary, should be ignored
      ]
    };
    const result = parseCandidateEvidence(evidence);
    assert.strictEqual(result.hasStructuredEvidence, true);
    assert.strictEqual(result.observedSignals?.length, 1);
    assert.deepStrictEqual(result.observedSignals?.[0], {
      source: 'slack', summary: 'Message sent', occurredAt: '2023-01-01T10:00:00Z', reference: 'msg-id'
    });
  });

  await t.test('extracts attachments securely', () => {
    const evidence = {
      attachments: [
        { name: 'doc.pdf', url: 'http://doc.pdf', mimeType: 'application/pdf', description: 'A doc' },
        { url: 'http://missing.name' } // missing name, should be ignored
      ]
    };
    const result = parseCandidateEvidence(evidence);
    assert.strictEqual(result.hasStructuredEvidence, true);
    assert.strictEqual(result.attachments?.length, 1);
    assert.deepStrictEqual(result.attachments?.[0], {
      name: 'doc.pdf', url: 'http://doc.pdf', mimeType: 'application/pdf', description: 'A doc'
    });
  });

  await t.test('extracts metadata and tags securely', () => {
    const evidence = {
      metadata: {
        externalReference: 'ext-123',
        submittedAt: '2023-01-01T10:00:00Z',
        tags: ['tag1', 123, 'tag2'] // 123 should be ignored
      }
    };
    const result = parseCandidateEvidence(evidence);
    assert.strictEqual(result.hasStructuredEvidence, true);
    assert.deepStrictEqual(result.metadata, {
      externalReference: 'ext-123',
      submittedAt: '2023-01-01T10:00:00Z',
      tags: ['tag1', 'tag2']
    });
  });
});
