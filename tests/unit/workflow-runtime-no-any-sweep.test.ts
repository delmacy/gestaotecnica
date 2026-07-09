import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Runtime Core No-Any Sweep', () => {
  it('should not contain forbidden "any" patterns in runtime core files', () => {
    const runtimeDir = path.join(process.cwd(), 'src/features/workflow/runtime');

    // We want to check all .ts files under src/features/workflow/runtime recursively
    // excluding index.ts and tests.

    const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []): string[] => {
      const files = fs.readdirSync(dirPath);

      files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
          arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
          if (file.endsWith('.ts') && !file.endsWith('.test.ts') && file !== 'index.ts') {
            arrayOfFiles.push(fullPath);
          }
        }
      });

      return arrayOfFiles;
    };

    const filesToCheck = getAllFiles(runtimeDir);

    const forbiddenPatterns = [
      /Record<string,\s*any>/g,
      /z\.any\(\)/g,
      /as\s+any\b/g
    ];

    const allowedFiles = [
      'src/features/workflow/runtime/events/events.actions.ts'
    ];

    let foundViolations = false;
    let messages: string[] = [];

    for (const filePath of filesToCheck) {
      const relativePath = path.relative(process.cwd(), filePath);

      // Skip files explicitly in the allowlist
      if (allowedFiles.some(allowedFile => relativePath.includes(allowedFile.replace(/\//g, path.sep)))) {
        continue;
      }

      const content = fs.readFileSync(filePath, 'utf-8');

      for (const pattern of forbiddenPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          foundViolations = true;
          messages.push(`File ${relativePath} contains forbidden pattern ${pattern.toString()}. Found: ${matches.length} occurrences`);
        }
      }
    }

    assert.ok(!foundViolations, `Forbidden any patterns found:\n${messages.join('\n')}`);
  });
});
