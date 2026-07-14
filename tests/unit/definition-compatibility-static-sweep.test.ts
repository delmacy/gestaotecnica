import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Definition Compatibility Static Sweep', () => {
  it('should ensure definition compatibility fixtures are under the approved tests/fixtures directory', () => {
    const testsDir = path.join(process.cwd(), 'tests');

    const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []): string[] => {
      if (!fs.existsSync(dirPath)) return arrayOfFiles;
      const files = fs.readdirSync(dirPath);

      files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
          arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
          if (file.endsWith('.fixtures.ts') && file.includes('compatibility')) {
            arrayOfFiles.push(fullPath);
          }
        }
      });

      return arrayOfFiles;
    };

    const fixtureFiles = getAllFiles(testsDir);
    assert.ok(fixtureFiles.length > 0, 'Should find at least one compatibility fixture');

    const approvedDir = path.join(process.cwd(), 'tests', 'fixtures');

    for (const filePath of fixtureFiles) {
      assert.ok(
        filePath.startsWith(approvedDir),
        `Fixture file ${filePath} must be located under the approved directory: ${approvedDir}`
      );
    }
  });
});
