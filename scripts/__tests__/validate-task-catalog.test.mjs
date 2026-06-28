import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { Validator, parseMarkdownTable } from '../validate-task-catalog.mjs';

const INDEX_HEADER = '| ID | Sprint | Tipo | Título | Modo |\n|---|---:|---|---|---|\n';
const MAP_HEADER = '| normalized_id | candidate_id | origin_id | artifact_type | title | canonical_url_or_path | normalized_state | logical_owner | predecessor_ids | successor_ids | evidence | normalization_reason | risk | notes |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n';

test('Validator - Valid Catalog', () => {
  const validator = new Validator();
  const indexRows = parseMarkdownTable(INDEX_HEADER + '| SB-S01-T01 | 01 | planejamento | Title | sequencial |');
  const mapRows = parseMarkdownTable(MAP_HEADER + '| SB-S01-T01 | N/A | id | pr | Title | path | merged | governance | SB-S01-T00 | SB-S01-T02 | evidence | reason | low | notes |');

  // Setup T00 in tasks to avoid MISSING_REFERENCE error
  validator.tasks.set('SB-S01-T00', { source: 'index' });
  validator.tasks.set('SB-S01-T02', { source: 'index' });

  validator.validateIndex(indexRows, 'test_index.md');
  validator.validateMap(mapRows, 'test_map.md');
  validator.checkDependencies();

  assert.strictEqual(validator.errors.length, 0);
});

test('Validator - Duplicate ID', () => {
  const validator = new Validator();
  const indexRows = parseMarkdownTable(INDEX_HEADER +
    '| SB-S01-T01 | 01 | planejamento | Title | sequencial |\n' +
    '| SB-S01-T01 | 01 | planejamento | Title | sequencial |'
  );
  validator.validateIndex(indexRows, 'test_index.md');
  assert.ok(validator.errors.some(e => e.code === 'DUPLICATE_ID'));
});

test('Validator - Missing Reference', () => {
  const validator = new Validator();
  const mapRows = parseMarkdownTable(MAP_HEADER + '| SB-S01-T01 | N/A | id | pr | Title | path | merged | governance | SB-S01-T99 | N/A | evidence | reason | low | notes |');

  // SB-S01-T01 exists in index, but SB-S01-T99 does not
  validator.tasks.set('SB-S01-T01', { source: 'index' });
  validator.validateMap(mapRows, 'test_map.md');
  validator.checkDependencies();

  assert.ok(validator.errors.some(e => e.code === 'MISSING_REFERENCE' && e.evidence === 'SB-S01-T99'));
});

test('Validator - Simple Cycle', () => {
  const validator = new Validator();
  const mapRows = parseMarkdownTable(MAP_HEADER +
    '| SB-S01-T01 | N/A | id | pr | T1 | path | merged | governance | SB-S01-T02 | SB-S01-T02 | ev | re | low | no |\n' +
    '| SB-S01-T02 | N/A | id | pr | T2 | path | merged | governance | SB-S01-T01 | SB-S01-T01 | ev | re | low | no |'
  );
  validator.tasks.set('SB-S01-T01', { source: 'index' });
  validator.tasks.set('SB-S01-T02', { source: 'index' });
  validator.validateMap(mapRows, 'test_map.md');
  validator.checkCycles();
  assert.ok(validator.errors.some(e => e.code === 'DEPENDENCY_CYCLE'));
});

test('Validator - Cycle with 3 tasks', () => {
  const validator = new Validator();
  const mapRows = parseMarkdownTable(MAP_HEADER +
    '| SB-S01-T01 | N/A | id | pr | T1 | path | merged | governance | SB-S01-T03 | SB-S01-T02 | ev | re | low | no |\n' +
    '| SB-S01-T02 | N/A | id | pr | T2 | path | merged | governance | SB-S01-T01 | SB-S01-T03 | ev | re | low | no |\n' +
    '| SB-S01-T03 | N/A | id | pr | T3 | path | merged | governance | SB-S01-T02 | SB-S01-T01 | ev | re | low | no |'
  );
  validator.tasks.set('SB-S01-T01', { source: 'index' });
  validator.tasks.set('SB-S01-T02', { source: 'index' });
  validator.tasks.set('SB-S01-T03', { source: 'index' });
  validator.validateMap(mapRows, 'test_map.md');
  validator.checkCycles();
  assert.ok(validator.errors.some(e => e.code === 'DEPENDENCY_CYCLE'));
});

test('Validator - Invalid State', () => {
  const validator = new Validator();
  const mapRows = parseMarkdownTable(MAP_HEADER + '| SB-S01-T01 | N/A | id | pr | Title | path | invalid_state | governance | N/A | N/A | ev | re | low | no |');
  validator.validateMap(mapRows, 'test_map.md');
  assert.ok(validator.errors.some(e => e.code === 'INVALID_STATE'));
});

test('Validator - Invalid Owner', () => {
  const validator = new Validator();
  const mapRows = parseMarkdownTable(MAP_HEADER + '| SB-S01-T01 | N/A | id | pr | Title | path | merged | invalid_owner | N/A | N/A | ev | re | low | no |');
  validator.validateMap(mapRows, 'test_map.md');
  assert.ok(validator.errors.some(e => e.code === 'INVALID_OWNER'));
});

test('Validator - Missing Required Field', () => {
  const validator = new Validator();
  const indexRows = parseMarkdownTable('| ID | Sprint | Tipo | Título | Modo |\n|---|---|---|---|---|\n| SB-S01-T01 | 01 | planejamento | | sequencial |');
  validator.validateIndex(indexRows, 'test_index.md');
  assert.ok(validator.errors.some(e => e.code === 'MISSING_REQUIRED_FIELD'));
});

test('Validator - Invalid Candidate ID Usage', () => {
  const validator = new Validator();
  const mapRows = parseMarkdownTable(MAP_HEADER + '| unmapped | SB-S01-T01 | id | pr | Title | path | merged | governance | N/A | N/A | ev | re | low | no |');
  validator.validateMap(mapRows, 'test_map.md');
  assert.ok(validator.errors.some(e => e.code === 'INVALID_CANDIDATE_ID_USAGE'));
});

test('Validator - Incorrect Sprint 01 Flow', () => {
  const validator = new Validator();
  const mapRows = parseMarkdownTable(MAP_HEADER + '| SB-S01-T01 | N/A | id | pr | Title | path | merged | governance | N/A | N/A | ev | re | low | no |');
  validator.tasks.set('SB-S01-T01', { source: 'index' });
  validator.validateMap(mapRows, 'test_map.md');
  validator.validateSprint01Flow();
  // SB-S01-T01 should have SB-S01-T00 as predecessor
  assert.ok(validator.errors.some(e => e.code === 'INVALID_SPRINT_01_FLOW'));
});

test('Validator - Missing Local Path', () => {
  const validator = new Validator();
  const mapRows = parseMarkdownTable(MAP_HEADER + '| SB-S01-T01 | N/A | id | pr | Title | non_existent_file.md | merged | governance | N/A | N/A | ev | re | low | no |');
  validator.validateMap(mapRows, 'test_map.md');
  assert.ok(validator.warnings.some(w => w.code === 'MISSING_FILE'));
});

test('Validator - Real Catalog Check', () => {
  const indexPath = 'docs/product-roadmap/TASK_INDEX.md';
  const mapPath = 'docs/product-roadmap/sprint-01-backlog-governance/NORMALIZED_TASK_MAP.md';

  if (!fs.existsSync(indexPath) || !fs.existsSync(mapPath)) {
    console.log('Skipping real catalog check, files not found');
    return;
  }

  const validator = new Validator();
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  const indexRows = parseMarkdownTable(indexContent);
  validator.validateIndex(indexRows, indexPath);

  const mapContent = fs.readFileSync(mapPath, 'utf8');
  const mapRows = parseMarkdownTable(mapContent);
  validator.validateMap(mapRows, mapPath);

  validator.checkDependencies();
  validator.checkCycles();
  validator.validateSprint01Flow();

  console.log(`Real catalog validation: ${validator.errors.length} errors, ${validator.warnings.length} warnings`);
  // We don't assert 0 errors here because the real catalog might be invalid as per task description.
});
