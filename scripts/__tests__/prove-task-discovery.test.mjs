import test from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import fs from 'node:fs';

test('Discovery script - Valid ID', () => {
  const output = execSync('node scripts/prove-task-discovery.mjs SB-S01-T01').toString();
  const results = JSON.parse(output);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].task_id, 'SB-S01-T01');
  assert.strictEqual(results[0].sprint, '01');
  assert.ok(results[0].contract_location.includes('sprint-01-backlog-governance'));
});

test('Discovery script - Preparatory T00', () => {
  const output = execSync('node scripts/prove-task-discovery.mjs SB-S01-T00').toString();
  const results = JSON.parse(output);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].task_id, 'SB-S01-T00');
  assert.strictEqual(results[0].type, 'planejamento preparatório');
});

test('Discovery script - Multiple IDs', () => {
  const output = execSync('node scripts/prove-task-discovery.mjs SB-S01-T01 SB-S02-T06').toString();
  const results = JSON.parse(output);
  assert.strictEqual(results.length, 2);
  assert.strictEqual(results[0].task_id, 'SB-S01-T01');
  assert.strictEqual(results[1].task_id, 'SB-S02-T06');
});

test('Discovery script - Non-existent ID', () => {
  try {
    execSync('node scripts/prove-task-discovery.mjs SB-S99-T99', { stdio: 'pipe' });
    assert.fail('Should have failed');
  } catch (error) {
    assert.strictEqual(error.status, 1);
    assert.ok(error.stderr.toString().includes('not found in index'));
  }
});
