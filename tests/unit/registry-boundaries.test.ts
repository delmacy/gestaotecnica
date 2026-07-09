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

describe('Registry Boundary Contracts', () => {
  it('should not import UI or app layers from src/platform/registry', () => {
    const registryDir = path.join(process.cwd(), 'src', 'platform', 'registry');

    if (!fs.existsSync(registryDir)) {
      return;
    }

    const files = walkDir(registryDir).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));

    // We want to block:
    // 1. absolute imports like src/app, src/components, src/features
    // 2. alias imports like @/app, @/components, @/features
    // 3. relative imports that go up and into those folders (e.g. ../../app)

    // Improved regex to handle trailing slashes/quotes and dynamic imports
    const forbiddenPatterns = [
      { pattern: /(?:import|from)\s*\(?['"](.*(?:src\/app|@\/app)(?:\/|'|"))/, name: 'src/app' },
      { pattern: /(?:import|from)\s*\(?['"](.*(?:src\/components|@\/components)(?:\/|'|"))/, name: 'src/components' },
      { pattern: /(?:import|from)\s*\(?['"](.*(?:src\/features|@\/features)(?:\/|'|"))/, name: 'src/features' },
      // Catch any import that resolves to the forbidden directories via relative path
      { pattern: /(?:import|from)\s*\(?['"](\.\.\/.*\/app(?:\/|'|"))/, name: 'relative app' },
      { pattern: /(?:import|from)\s*\(?['"](\.\.\/.*\/components(?:\/|'|"))/, name: 'relative components' },
      { pattern: /(?:import|from)\s*\(?['"](\.\.\/.*\/features(?:\/|'|"))/, name: 'relative features' }
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

    assert.deepEqual(violations, [], 'Found boundary violations in registry layer');
  });
});
