import { BlueprintImportPreflightResultEnvelope } from '../../../../../src/platform/blueprints/contracts/blueprint-import-preflight-result-envelope';

export const importDryRunBlockerFixture: BlueprintImportPreflightResultEnvelope = {
  compatible: false,
  warnings: [],
  blockers: ["Missing required schema validation"],
  requiredApprovals: []
};
