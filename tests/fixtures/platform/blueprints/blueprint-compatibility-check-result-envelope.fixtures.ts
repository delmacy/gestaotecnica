export const VALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE = {
  compatible: true,
  warnings: [],
  blockers: []
};

export const VALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_WITH_WARNINGS = {
  compatible: true,
  warnings: ["Missing optional field"],
  blockers: []
};

export const VALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_WITH_BLOCKERS = {
  compatible: false,
  warnings: [],
  blockers: ["Incompatible dependency version"]
};

export const INVALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_MISSING_COMPATIBLE = {
  warnings: [],
  blockers: []
};

export const INVALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_MISSING_WARNINGS = {
  compatible: true,
  blockers: []
};

export const INVALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_MISSING_BLOCKERS = {
  compatible: true,
  warnings: []
};

export const INVALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_EMPTY_WARNING = {
  compatible: true,
  warnings: [""],
  blockers: []
};

export const INVALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_EMPTY_BLOCKER = {
  compatible: false,
  warnings: [],
  blockers: [""]
};
