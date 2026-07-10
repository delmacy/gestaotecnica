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

describe('Integration Boundary Static Test', () => {
  it('should not import runtime execution services from integration contracts', () => {
    const contractsDir = path.join(process.cwd(), 'src', 'platform', 'integrations', 'contracts');

    if (!fs.existsSync(contractsDir)) {
      return;
    }

    const files = walkDir(contractsDir).filter(f => f.endsWith('.ts'));

    const forbiddenPatterns = [
      { pattern: /(?:import|from)\s*\(?['"](.*runtime.*)(?:\/|'|")/, name: 'runtime' },
      { pattern: /(?:import|from)\s*\(?['"](.*src\/features\/workflow\/runtime.*)(?:\/|'|")/, name: 'src/features/workflow/runtime' },
      { pattern: /(?:import|from)\s*\(?['"](@\/features\/workflow\/runtime.*)(?:\/|'|")/, name: '@/features/workflow/runtime' },
      { pattern: /(?:import|from)\s*\(?['"](\.\.\/\.\.\/features\/workflow\/runtime.*)(?:\/|'|")/, name: 'relative runtime' }
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

    assert.deepEqual(violations, [], 'Found boundary violations in integration contracts');
  });
});
