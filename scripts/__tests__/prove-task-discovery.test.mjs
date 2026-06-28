import test from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

test('Discovery script - Valid ID', () => {
  const output = execSync('node scripts/prove-task-discovery.mjs SB-S01-T01').toString();
  const results = JSON.parse(output);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].task_id, 'SB-S01-T01');
  assert.strictEqual(results[0].sprint, '01');
  assert.ok(results[0].contract_location.includes('sprint-01-backlog-governance/README.md'));
});

test('Discovery script - Individual File (T00)', () => {
  const output = execSync('node scripts/prove-task-discovery.mjs SB-S01-T00').toString();
  const results = JSON.parse(output);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].task_id, 'SB-S01-T00');
  assert.ok(results[0].contract_location.includes('00-preparar-fontes-e-modelo-do-inventario.md'));
});

test('Discovery script - Preparatory T00', () => {
  const output = execSync('node scripts/prove-task-discovery.mjs SB-S01-T00').toString();
  const results = JSON.parse(output);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].task_id, 'SB-S01-T00');
  assert.strictEqual(results[0].type, 'planejamento preparatório');
});

test('Discovery script - Development Task (T03)', () => {
    const output = execSync('node scripts/prove-task-discovery.mjs SB-S01-T03').toString();
    const results = JSON.parse(output);
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].task_id, 'SB-S01-T03');
    assert.strictEqual(results[0].type, 'desenvolvimento');
});

test('Discovery script - Task from another sprint (S02-T06)', () => {
    const output = execSync('node scripts/prove-task-discovery.mjs SB-S02-T06').toString();
    const results = JSON.parse(output);
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].task_id, 'SB-S02-T06');
    assert.strictEqual(results[0].sprint, '02');
    assert.ok(results[0].contract_location.includes('sprint-02-core-events'));
});

test('Discovery script - Multiple IDs', () => {
  const output = execSync('node scripts/prove-task-discovery.mjs SB-S01-T01 SB-S02-T06').toString();
  const results = JSON.parse(output);
  assert.strictEqual(results.length, 2);
  assert.strictEqual(results[0].task_id, 'SB-S01-T01');
  assert.strictEqual(results[1].task_id, 'SB-S02-T06');
});

test('Discovery script - Invalid ID format', () => {
    try {
      execSync('node scripts/prove-task-discovery.mjs INVALID-ID', { stdio: 'pipe' });
      assert.fail('Should have failed');
    } catch (error) {
      assert.strictEqual(error.status, 1);
      assert.ok(error.stderr.toString().includes('Invalid ID format'));
    }
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

test('Discovery script - Missing Contract', () => {
    // Create a fake sprint dir and add a task to index that doesn't have a contract
    const originalIndex = fs.readFileSync('docs/product-roadmap/TASK_INDEX.md', 'utf8');
    const fakeIndex = originalIndex + '\n| SB-S99-T99 | 99 | teste | Missing | seq |';
    fs.writeFileSync('docs/product-roadmap/TASK_INDEX.md', fakeIndex);

    const fakeSprintDir = 'docs/product-roadmap/sprint-99-test';
    fs.mkdirSync(fakeSprintDir, { recursive: true });

    try {
        execSync('node scripts/prove-task-discovery.mjs SB-S99-T99', { stdio: 'pipe' });
        assert.fail('Should have failed');
    } catch (error) {
        assert.strictEqual(error.status, 1);
        assert.ok(error.stderr.toString().includes('Contract file not found'));
    } finally {
        fs.writeFileSync('docs/product-roadmap/TASK_INDEX.md', originalIndex);
        fs.rmSync(fakeSprintDir, { recursive: true, force: true });
    }
});

test('Discovery script - Missing Index', () => {
    const originalIndex = 'docs/product-roadmap/TASK_INDEX.md';
    const tempIndex = 'docs/product-roadmap/TASK_INDEX.md.bak';
    fs.renameSync(originalIndex, tempIndex);
    try {
        execSync('node scripts/prove-task-discovery.mjs SB-S01-T01', { stdio: 'pipe' });
        assert.fail('Should have failed');
    } catch (error) {
        assert.strictEqual(error.status, 1);
        assert.ok(error.stderr.toString().includes('Index not found'));
    } finally {
        fs.renameSync(tempIndex, originalIndex);
    }
});
