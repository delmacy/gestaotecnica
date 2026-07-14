import { BlueprintImportRequest } from '../../../../src/platform/blueprints/contracts/blueprint-import-request';

export const validBlueprintImportRequest: BlueprintImportRequest = {
  sourceMetadata: {
    origin: 'test-origin',
    exportedAt: '2023-01-01T00:00:00Z'
  },
  checksum: 'sha256-dummy-checksum-1234567890abcdef',
  dryRun: true,
  targetWorkspace: 'workspace-a'
};

export const executionBlueprintImportRequest: BlueprintImportRequest = {
  sourceMetadata: {
    origin: 'prod-origin'
  },
  checksum: 'sha256-another-checksum',
  dryRun: false,
  targetWorkspace: 'workspace-b'
};

export const invalidBlueprintImportRequestEmptyChecksum = {
  sourceMetadata: {},
  checksum: '',
  dryRun: true,
  targetWorkspace: 'workspace-a'
};

export const invalidBlueprintImportRequestEmptyWorkspace = {
  sourceMetadata: {},
  checksum: 'valid-checksum',
  dryRun: true,
  targetWorkspace: ''
};
