import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';

test('runtime.service.ts should not use forbidden DB-boundary cast patterns', () => {
  const servicePath = path.resolve(
    process.cwd(),
    'src/features/workflow/runtime/runtime.service.ts'
  );

  const content = fs.readFileSync(servicePath, 'utf8');

  // Forbidden patterns, built dynamically to avoid triggering static checks on this test file
  const patterns = [
    'db ' + 'as ' + 'any',
    'logEvent(db ' + 'as ' + 'any',
    'getProcessVersionById(db ' + 'as ' + 'any'
  ];

  for (const pattern of patterns) {
    if (content.includes(pattern)) {
      assert.fail(`runtime.service.ts contains forbidden pattern: "${pattern}"`);
    }
  }
});
