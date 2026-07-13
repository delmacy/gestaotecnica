import { test, describe } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

describe("Static Audit Docs Analysis", () => {
  test("audit docs and fixtures do not contain secret placeholders", () => {
    // Check for obvious secret placeholders
    const rootDir = path.resolve(__dirname, "../../");

    // Check both docs and tests/fixtures
    const dirsToCheck = [
        path.join(rootDir, "docs"),
        path.join(rootDir, "tests/fixtures")
    ];

    // Function to recursively get files
    const getFiles = (dir: string, fileList: string[] = []) => {
      if (!fs.existsSync(dir)) return fileList;
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
          getFiles(filePath, fileList);
        } else {
          if (filePath.endsWith('.md') || filePath.endsWith('.json') || filePath.endsWith('.ts')) {
            fileList.push(filePath);
          }
        }
      }
      return fileList;
    };

    const allFiles: string[] = [];
    dirsToCheck.forEach(dir => getFiles(dir, allFiles));

    // Common secret keys
    const secretPatterns = [
      /YOUR_SECRET/i,
      /YOUR_API_KEY/i,
      /YOUR_TOKEN/i,
      /secret_key_placeholder/i,
      /api_key_placeholder/i,
    ];

    const violations: string[] = [];

    for (const file of allFiles) {
      // we only care about files in audit or fixtures directories or containing such in name
      if (file.toLowerCase().includes('audit') || file.toLowerCase().includes('fixture')) {
        const content = fs.readFileSync(file, 'utf8');
        for (const pattern of secretPatterns) {
          if (pattern.test(content)) {
            violations.push(`File ${file} contains secret placeholder matching ${pattern}`);
          }
        }
      }
    }

    assert.deepStrictEqual(violations, [], "Found secret placeholders in audit/fixture docs");
  });
});
