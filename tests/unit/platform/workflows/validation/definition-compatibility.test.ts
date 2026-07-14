import { describe, it } from 'node:test';
import assert from 'node:assert';
import { checkDefinitionCompatibility } from '../../../../../src/platform/workflows/validation/definition-compatibility';
import {
  baseVersion,
  COMPATIBLE_PROCESS_VERSION_ADDED_NODE,
  BREAKING_PROCESS_VERSION_REMOVED_NODE,
  BREAKING_PROCESS_VERSION_CHANGED_ACTION,
  BREAKING_PROCESS_VERSION_CHANGED_PAYLOAD
} from '../../../../fixtures/contracts/definition-compatibility.fixtures';

describe('checkDefinitionCompatibility', () => {
  it('should return compatible for added node', () => {
    const result = checkDefinitionCompatibility(baseVersion as never, COMPATIBLE_PROCESS_VERSION_ADDED_NODE as never);
    assert.strictEqual(result.compatible, true);
    assert.strictEqual(result.blockers.length, 0);
  });

  it('should return incompatible for removed node', () => {
    // The baseVersion has no nodes, so removing a node would mean going from something to nothing
    const oldVersion = COMPATIBLE_PROCESS_VERSION_ADDED_NODE;
    const newVersion = BREAKING_PROCESS_VERSION_REMOVED_NODE;

    const result = checkDefinitionCompatibility(oldVersion as never, newVersion as never);
    assert.strictEqual(result.compatible, false);
    assert.strictEqual(result.blockers.length, 2); // n1 and n2 removed
    assert.ok(result.blockers[0].includes('Node removed'));
  });

  it('should return incompatible for changed action', () => {
    const oldVersion = COMPATIBLE_PROCESS_VERSION_ADDED_NODE;
    const newVersion = BREAKING_PROCESS_VERSION_CHANGED_ACTION;

    const result = checkDefinitionCompatibility(oldVersion as never, newVersion as never);
    assert.strictEqual(result.compatible, false);
    assert.strictEqual(result.blockers.length, 1);
    assert.ok(result.blockers[0].includes('Action changed'));
  });

  it('should return incompatible for changed payload', () => {
    const oldVersion = {
      ...baseVersion,
      definition: {
        schemaVersion: "1.0.0",
        nodes: [{ id: "n1", key: "node-1", type: "start", name: "n1", position: { x: 0, y: 0 }, config: {} }],
        edges: []
      }
    };
    const newVersion = BREAKING_PROCESS_VERSION_CHANGED_PAYLOAD;

    const result = checkDefinitionCompatibility(oldVersion as never, newVersion as never);
    assert.strictEqual(result.compatible, false);
    assert.strictEqual(result.blockers.length, 1);
    assert.ok(result.blockers[0].includes('Payload/config changed'));
  });
});
