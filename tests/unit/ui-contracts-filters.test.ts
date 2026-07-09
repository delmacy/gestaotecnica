import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';

describe('UiContract Component Static Analysis', () => {
  it('should define group filter option labels and values stably', () => {
    const componentPath = path.resolve(process.cwd(), 'src/components/builder/ui-contracts/UiContractFilters.tsx');
    const fileContent = fs.readFileSync(componentPath, 'utf8');

    // Extract the groups array definition
    const groupsMatch = fileContent.match(/const groups: [^=]+=\s*(\[[^\]]+\]);/);
    assert.ok(groupsMatch, 'Could not find groups array definition in UiContractFilters');

    // Expected stable group definitions
    const expectedValues = [
      'all',
      'group_a_platform_foundation',
      'group_b_builder_design',
      'group_c_runtime_integration',
      'group_d_client_real'
    ];

    const expectedLabels = [
      'All Groups',
      'A - Platform',
      'B - Design',
      'C - Runtime',
      'D - Client Real'
    ];

    const groupsCode = groupsMatch[1];

    expectedValues.forEach(value => {
      assert.ok(groupsCode.includes(`value: "${value}"`), `Missing expected value: ${value}`);
    });

    expectedLabels.forEach(label => {
      assert.ok(groupsCode.includes(`label: "${label}"`), `Missing expected label: ${label}`);
    });
  });

  it('should define status mappings stably in list and matrix components', () => {
    // For status labels, we check where the statuses are visually converted,
    // which according to my search is in UiContractList.tsx and UiContractTypes
    const typesPath = path.resolve(process.cwd(), 'src/components/builder/ui-contracts/ui-contracts-types.ts');
    const typesContent = fs.readFileSync(typesPath, 'utf8');

    // Make sure all the status values from the implementation status exist
    const expectedImplementationStatuses = [
      'documented',
      'ready_for_readiness',
      'ready_for_dev',
      'implemented',
      'reviewed',
      'approved',
      'future',
      'blocked'
    ];

    expectedImplementationStatuses.forEach(status => {
      assert.ok(typesContent.includes(`'${status}'`), `Missing expected status type: ${status}`);
    });

    // Status visual formatting is currently `.replace(/_/g, " ")`
    // Verify this formatting strategy exists for implementation_status
    const listPath = path.resolve(process.cwd(), 'src/components/builder/ui-contracts/UiContractList.tsx');
    const listContent = fs.readFileSync(listPath, 'utf8');
    assert.ok(listContent.includes('contract.implementation_status.replace(/_/g, " ")'), 'Status formatting strategy missing in list');
  });
});
