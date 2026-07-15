import { BlueprintExportResultEnvelope } from '../../../../../src/platform/blueprints/contracts/blueprint-export-result-envelope';

export const exportSuccessFixture: BlueprintExportResultEnvelope = {
  artifactMetadata: {
    filename: "export.zip",
    size: 1024
  },
  warnings: [],
  blockers: []
};

export const exportWarningFixture: BlueprintExportResultEnvelope = {
  artifactMetadata: {
    filename: "export.zip",
    size: 1024
  },
  warnings: ["Missing optional field"],
  blockers: []
};
