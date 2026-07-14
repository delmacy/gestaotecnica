import { BlueprintImportRequest } from '../../../../src/platform/blueprints/contracts/blueprint-import-request';

export const validBlueprintImportRequest: BlueprintImportRequest = {
  sourceMetadata: {
    origin: 'test-origin',
    exportedAt: '2023-01-01T00:00:00Z'
  },
  checksum: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  dryRun: true,
  targetWorkspace: 'workspace-a'
};

export const executionBlueprintImportRequest: BlueprintImportRequest = {
  sourceMetadata: {
    origin: 'prod-origin'
  },
  checksum: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  dryRun: false,
  targetWorkspace: 'workspace-b'
};

export const invalidBlueprintImportRequestEmptyChecksum = {
  sourceMetadata: {},
  checksum: '',
  dryRun: true,
  targetWorkspace: 'workspace-a'
};

export const invalidBlueprintImportRequestInvalidChecksumShape = {
  sourceMetadata: {},
  checksum: 'sha256-dummy',
  dryRun: true,
  targetWorkspace: 'workspace-a'
};

export const invalidBlueprintImportRequestEmptyWorkspace = {
  sourceMetadata: {},
  checksum: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  dryRun: true,
  targetWorkspace: ''
};
