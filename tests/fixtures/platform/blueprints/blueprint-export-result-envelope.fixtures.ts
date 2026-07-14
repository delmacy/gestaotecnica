export const VALID_EXPORT_RESULT_ENVELOPE = {
  artifactMetadata: {
    filename: "export.zip",
    size: 1024
  },
  warnings: [],
  blockers: []
};

export const VALID_EXPORT_RESULT_ENVELOPE_WITH_WARNINGS = {
  artifactMetadata: {
    filename: "export.zip",
    size: 1024
  },
  warnings: ["Missing optional field"],
  blockers: []
};

export const VALID_EXPORT_RESULT_ENVELOPE_WITH_BLOCKERS = {
  artifactMetadata: {
    filename: "export.zip",
    size: 1024
  },
  warnings: [],
  blockers: ["Incompatible dependency version"]
};

export const INVALID_EXPORT_RESULT_ENVELOPE_MISSING_ARTIFACT_METADATA = {
  warnings: [],
  blockers: []
};

export const INVALID_EXPORT_RESULT_ENVELOPE_MISSING_WARNINGS = {
  artifactMetadata: {
    filename: "export.zip"
  },
  blockers: []
};

export const INVALID_EXPORT_RESULT_ENVELOPE_MISSING_BLOCKERS = {
  artifactMetadata: {
    filename: "export.zip"
  },
  warnings: []
};

export const INVALID_EXPORT_RESULT_ENVELOPE_EMPTY_WARNING = {
  artifactMetadata: {
    filename: "export.zip"
  },
  warnings: [""],
  blockers: []
};

export const INVALID_EXPORT_RESULT_ENVELOPE_EMPTY_BLOCKER = {
  artifactMetadata: {
    filename: "export.zip"
  },
  warnings: [],
  blockers: [""]
};

export const exportSuccess = {
  artifactMetadata: {
    filename: "export.zip",
    size: 2048
  },
  warnings: [],
  blockers: []
};

export const exportWarning = {
  artifactMetadata: {
    filename: "export.zip",
    size: 2048
  },
  warnings: ["Missing optional metadata"],
  blockers: []
};
