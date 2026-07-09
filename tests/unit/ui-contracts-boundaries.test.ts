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

describe('UI Contracts Viewer Boundary Contracts', () => {
  it('should not import server persistence or database modules from ui-contracts viewer', () => {
    const directoriesToCheck = [
      path.join(process.cwd(), 'src', 'components', 'builder', 'ui-contracts'),
      path.join(process.cwd(), 'src', 'app', '(builder)', 'builder', 'ui-contracts')
    ];

    const files = directoriesToCheck.flatMap(dir =>
      walkDir(dir).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'))
    );

    const forbiddenPatterns = [
      { pattern: /(?:import|from)\s*\(?['"].*drizzle-orm.*['"]\)?/, name: 'drizzle-orm' },
      { pattern: /(?:import|from)\s*\(?['"].*repository.*['"]\)?/, name: 'repository' },
      { pattern: /(?:import|from)\s*\(?['"].*service.*['"]\)?/, name: 'service' },
      { pattern: /(?:import|from)\s*\(?['"].*db.*['"]\)?/, name: 'db' },
      { pattern: /(?:import|from)\s*\(?['"].*drizzle.*['"]\)?/, name: 'drizzle' }
    ];

    const violations: string[] = [];

    for (const file of files) {
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

    assert.deepEqual(violations, [], 'Found boundary violations in UI contracts viewer');
  });
});
