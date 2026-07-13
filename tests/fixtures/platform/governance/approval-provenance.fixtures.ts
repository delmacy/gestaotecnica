export const VALID_APPROVAL_PROVENANCE_ACTOR = {
  type: "user",
  id: "user-123",
} as const;

export const INVALID_APPROVAL_PROVENANCE_ACTOR_MISSING_ID = {
  type: "user",
} as const;

export const INVALID_APPROVAL_PROVENANCE_ACTOR_UNKNOWN_TYPE = {
  type: "alien",
  id: "alien-1",
} as const;
