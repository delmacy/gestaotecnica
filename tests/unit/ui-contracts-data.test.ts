import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { MOCK_UI_CONTRACTS_INDEX } from '../../src/components/builder/ui-contracts/ui-contracts-data';

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
