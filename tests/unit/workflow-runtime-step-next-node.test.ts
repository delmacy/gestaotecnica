import { describe, it } from 'node:test';
import assert from 'node:assert';
import { planNextStep, RuntimeGraphNode, RuntimeGraphEdge } from '../../src/features/workflow/runtime/runtime-step.service';

describe('planNextStep', () => {
  it('should return complete with reason no_more_edges when there are no outgoing edges', () => {
    const nodes: RuntimeGraphNode[] = [
      { id: 'node-a', type: 'action' }
    ];
    const edges: RuntimeGraphEdge[] = [];
    const result = planNextStep(nodes, edges, 'node-a');

    assert.deepStrictEqual(result, { type: 'complete', reason: 'no_more_edges' });
  });

  it('should return complete with reason reached_end_node when the target is an end node', () => {
    const nodes: RuntimeGraphNode[] = [
      { id: 'node-a', type: 'action' },
      { id: 'node-b', type: 'end' }
    ];
    const edges: RuntimeGraphEdge[] = [
      { id: 'edge-1', source: 'node-a', target: 'node-b' }
    ];
    const result = planNextStep(nodes, edges, 'node-a');

    assert.deepStrictEqual(result, { type: 'complete', reason: 'reached_end_node' });
  });

  it('should return next_node with the correct node id for a normal next action node', () => {
    const nodes: RuntimeGraphNode[] = [
      { id: 'node-a', type: 'action' },
      { id: 'node-b', type: 'action' }
    ];
    const edges: RuntimeGraphEdge[] = [
      { id: 'edge-1', source: 'node-a', target: 'node-b' }
    ];
    const result = planNextStep(nodes, edges, 'node-a');

    assert.deepStrictEqual(result, { type: 'next_node', nextNodeId: 'node-b' });
  });

  it('should return an error when the target node is missing from the nodes array', () => {
    const nodes: RuntimeGraphNode[] = [
      { id: 'node-a', type: 'action' }
    ];
    const edges: RuntimeGraphEdge[] = [
      { id: 'edge-1', source: 'node-a', target: 'missing-node' }
    ];
    const result = planNextStep(nodes, edges, 'node-a');

    assert.deepStrictEqual(result, {
      type: 'error',
      error: { code: 'INVALID_PROCESS_DEFINITION', message: 'O nó alvo da aresta não existe no diagrama.' }
    });
  });
});
