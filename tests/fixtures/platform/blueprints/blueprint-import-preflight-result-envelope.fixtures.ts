import { BlueprintImportPreflightResultEnvelope } from '../../../../src/platform/blueprints/contracts/blueprint-import-preflight-result-envelope';

export const validCompatibleResult: BlueprintImportPreflightResultEnvelope = {
  compatible: true,
  warnings: [],
  blockers: [],
  requiredApprovals: []
};

export const validIncompatibleResult: BlueprintImportPreflightResultEnvelope = {
  compatible: false,
  warnings: ['Deprecated action node detected'],
  blockers: ['Missing required schema validation'],
  requiredApprovals: ['SECURITY_TEAM', 'ARCHITECTURE_BOARD']
};

export const invalidMissingFields = {
  compatible: true
};

export const invalidEmptyStringInArrays = {
  compatible: false,
  warnings: [''],
  blockers: [''],
  requiredApprovals: ['']
};

export const importDryRunBlocker: BlueprintImportPreflightResultEnvelope = {
  compatible: false,
  warnings: [],
  blockers: ["Dry run validation failed"],
  requiredApprovals: []
};
