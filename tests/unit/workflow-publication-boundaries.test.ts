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

describe('Workflow Publication Boundaries', () => {
  it('should not import runtime execution services from workflow publication contract/validation files', () => {
    const definitionsDir = path.join(process.cwd(), 'src', 'features', 'workflow', 'definitions');

    if (!fs.existsSync(definitionsDir)) {
      return;
    }

    const files = walkDir(definitionsDir).filter(f =>
      f.endsWith('.validation.ts') ||
      f.endsWith('.types.ts') ||
      f.endsWith('.api-types.ts') ||
      f.endsWith('.errors.ts') ||
      f.endsWith('.fixtures.ts')
    );

    const forbiddenPatterns = [
      { pattern: /(?:import|from)\s*\(?['"](.*runtime.*)(?:\/|'|")/, name: 'runtime' },
      { pattern: /(?:import|from)\s*\(?['"](.*src\/features\/workflow\/runtime.*)(?:\/|'|")/, name: 'src/features/workflow/runtime' },
      { pattern: /(?:import|from)\s*\(?['"](\.\.\/runtime.*)(?:\/|'|")/, name: 'relative runtime' }
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

    assert.deepEqual(violations, [], 'Found boundary violations in workflow publication contracts/validations');
  });
});
