import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('UI Contracts Route Smoke Test', () => {
  it('should import the viewer and remain scoped to the builder UI contracts surface', () => {
    const routePath = path.join(process.cwd(), 'src', 'app', '(builder)', 'builder', 'ui-contracts', 'page.tsx');

    // Assert the file exists
    assert.ok(fs.existsSync(routePath), 'UI contracts route file does not exist');

    const content = fs.readFileSync(routePath, 'utf8');
    const lines = content.split('\n');

    // Check that it imports UiContractsViewer from the correct path
    const hasViewerImport = lines.some(line =>
      line.includes('import') &&
      line.includes('UiContractsViewer') &&
      line.includes('@/components/builder/ui-contracts/UiContractsViewer')
    );
    assert.ok(hasViewerImport, 'Route must import UiContractsViewer from its component path');

    // Check that it renders the viewer
    const rendersViewer = content.includes('<UiContractsViewer />');
    assert.ok(rendersViewer, 'Route must render <UiContractsViewer />');

    // Check that there are no unauthorized imports
    // The route should only import React, types, or from the components/builder/ui-contracts directory
    const imports = lines.filter(line => line.trim().startsWith('import '));

    for (const importLine of imports) {
      const match = importLine.match(/from\s+['"]([^'"]+)['"]/);
      if (match) {
        const importPath = match[1];

        const isAllowed =
          importPath === 'react' ||
          importPath.startsWith('@/components/builder/ui-contracts/') ||
          importPath.startsWith('next/'); // Next.js related imports if any

        assert.ok(isAllowed, `Unauthorized import found: ${importPath}. Route should remain strictly scoped to builder UI contracts surface.`);
      }
    }
  });
});
