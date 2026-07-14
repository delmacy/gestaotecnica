export const VALID_DEFINITION_COMPATIBILITY_RESULT = {
  compatible: true,
  warnings: [],
  blockers: []
};

export const VALID_DEFINITION_COMPATIBILITY_RESULT_WITH_WARNINGS = {
  compatible: true,
  warnings: ["warning 1", "warning 2"],
  blockers: []
};

export const VALID_DEFINITION_COMPATIBILITY_RESULT_WITH_BLOCKERS = {
  compatible: false,
  warnings: [],
  blockers: ["blocker 1", "blocker 2"]
};

export const INVALID_DEFINITION_COMPATIBILITY_RESULT_MISSING_COMPATIBLE = {
  warnings: [],
  blockers: []
};

export const INVALID_DEFINITION_COMPATIBILITY_RESULT_MISSING_WARNINGS = {
  compatible: true,
  blockers: []
};

export const INVALID_DEFINITION_COMPATIBILITY_RESULT_MISSING_BLOCKERS = {
  compatible: true,
  warnings: []
};

export const INVALID_DEFINITION_COMPATIBILITY_RESULT_EMPTY_WARNING = {
  compatible: true,
  warnings: [""],
  blockers: []
};

export const INVALID_DEFINITION_COMPATIBILITY_RESULT_EMPTY_BLOCKER = {
  compatible: false,
  warnings: [],
  blockers: [""]
};
