import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { MOCK_UI_CONTRACTS_INDEX, getUiContractDevStatusSummary, getUiContractGroupSummary } from '../../src/components/builder/ui-contracts/ui-contracts-data';
import { UiSurfaceContract } from '../../src/components/builder/ui-contracts/ui-contracts-types';

describe('UI Contracts Data Uniqueness', () => {
  it('should have unique ids for all UI contracts', () => {
    const ids = MOCK_UI_CONTRACTS_INDEX.contracts.map(contract => contract.id);
    const uniqueIds = new Set(ids);
    assert.equal(ids.length, uniqueIds.size, 'Duplicate UI contract id found');
  });

  it('should have unique surface_ids for all UI contracts', () => {
    const surfaceIds = MOCK_UI_CONTRACTS_INDEX.contracts.map(contract => contract.surface_id);
    const uniqueSurfaceIds = new Set(surfaceIds);
    assert.equal(surfaceIds.length, uniqueSurfaceIds.size, 'Duplicate UI contract surface_id found');
  });

  it('should have unique route_candidates for all UI contracts', () => {
    const routes = MOCK_UI_CONTRACTS_INDEX.contracts.map(contract => contract.route_candidate);
    const uniqueRoutes = new Set(routes);
    assert.equal(routes.length, uniqueRoutes.size, 'Duplicate UI contract route_candidate found');
  });
});

describe('getUiContractGroupSummary', () => {
  it('should summarize group correctly', () => {
    const mockContracts: Partial<UiSurfaceContract>[] = [
      { id: '1', group: 'group_a_platform_foundation' },
      { id: '2', group: 'group_a_platform_foundation' },
      { id: '3', group: 'group_b_builder_design' },
      { id: '4', group: 'group_c_runtime_integration' },
      { id: '5', group: 'group_d_client_real' },
    ];

    const summary = getUiContractGroupSummary(mockContracts as UiSurfaceContract[]);

    assert.equal(summary.group_a_platform_foundation, 2);
    assert.equal(summary.group_b_builder_design, 1);
    assert.equal(summary.group_c_runtime_integration, 1);
    assert.equal(summary.group_d_client_real, 1);
  });

  it('should return empty summary for empty input', () => {
    const summary = getUiContractGroupSummary([]);

    assert.equal(summary.group_a_platform_foundation, 0);
    assert.equal(summary.group_b_builder_design, 0);
    assert.equal(summary.group_c_runtime_integration, 0);
    assert.equal(summary.group_d_client_real, 0);
  });
});

describe('getUiContractDevStatusSummary', () => {
  it('should summarize dev_status correctly', () => {
    const mockContracts: Partial<UiSurfaceContract>[] = [
      { id: '1', dev_status: 'done' },
      { id: '2', dev_status: 'done' },
      { id: '3', dev_status: 'in_progress' },
      { id: '4', dev_status: 'planned' },
      { id: '5', dev_status: 'blocked' },
    ];

    const summary = getUiContractDevStatusSummary(mockContracts as UiSurfaceContract[]);

    assert.equal(summary.done, 2);
    assert.equal(summary.in_progress, 1);
    assert.equal(summary.planned, 1);
    assert.equal(summary.blocked, 1);
    assert.equal(summary.not_started, 0);
    assert.equal(summary.ready, 0);
    assert.equal(summary.future, 0);
  });
});
