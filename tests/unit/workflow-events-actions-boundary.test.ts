import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';

test('events.actions.ts should respect boundaries and schema validations', () => {
  const actionsPath = path.resolve(
    process.cwd(),
    'src/features/workflow/runtime/events/events.actions.ts'
  );

  const content = fs.readFileSync(actionsPath, 'utf8');

  // Forbidden patterns, built dynamically
  const forbiddenPatterns = [
    'db ' + 'as ' + 'any'
  ];

  for (const pattern of forbiddenPatterns) {
    if (content.includes(pattern)) {
      assert.fail(`events.actions.ts contains forbidden pattern: "${pattern}"`);
    }
  }

  // Required patterns
  const requiredPatterns = [
    'EventDb',
    'getTimelineForInstanceInputSchema'
  ];

  for (const pattern of requiredPatterns) {
    if (!content.includes(pattern)) {
      assert.fail(`events.actions.ts is missing required pattern: "${pattern}"`);
    }
  }
});
