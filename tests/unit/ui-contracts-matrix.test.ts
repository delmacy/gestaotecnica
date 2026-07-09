import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';

describe('UiContractImplementationMatrix Component Static Analysis', () => {
  it('should consume the expected implementation_status fields', () => {
    const componentPath = path.resolve(process.cwd(), 'src/components/builder/ui-contracts/UiContractImplementationMatrix.tsx');
    const fileContent = fs.readFileSync(componentPath, 'utf8');

    // Expected statuses consumed in the implementation matrix
    const expectedStatuses = ['implemented', 'approved', 'blocked'];

    expectedStatuses.forEach(status => {
      // Look for contract.implementation_status === 'status'
      assert.ok(
        fileContent.includes(`contract.implementation_status === '${status}'`),
        `Implementation matrix should consume implementation_status for: ${status}`
      );
    });
  });
});
