import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function walkDir(dir: string, fileList: string[] = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      walkDir(path.join(dir, file), fileList);
    } else {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

describe('Event Receipt Boundary Static Test', () => {
  it('should not import database or migration modules from receipt contracts', () => {
    const eventsDir = path.join(process.cwd(), 'src', 'platform', 'events');
    if (!fs.existsSync(eventsDir)) return;

    // Explicitly target event receipt contracts and type definition files
    const contractFiles = [
      path.join(eventsDir, 'event-types.ts'),
      path.join(eventsDir, 'canonical-contract.ts'),
      ...walkDir(path.join(eventsDir, 'types')).filter(f => f.endsWith('.ts'))
    ].filter(f => fs.existsSync(f));

    const forbiddenPatterns = [
      { pattern: /(?:import|from)\s*\(?['"](.*drizzle-orm.*)(?:\/|'|")/, name: 'drizzle-orm' },
      { pattern: /(?:import|from)\s*\(?['"](@\/db.*)(?:\/|'|")/, name: '@/db' },
      { pattern: /(?:import|from)\s*\(?['"](.*migrate.*)(?:\/|'|")/, name: 'migrations' }
    ];

    const violations: string[] = [];

    for (const file of contractFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Skip comments
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
          return;
        }

        for (const { pattern, name } of forbiddenPatterns) {
          if (pattern.test(line)) {
            violations.push(`File ${path.relative(process.cwd(), file)}:${index + 1} contains forbidden import matching pattern for ${name}: ${trimmed}`);
          }
        }
      });
    }

    assert.deepEqual(violations, [], 'Found boundary violations in event receipt contracts');
  });
});
