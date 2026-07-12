export type BuilderId = string;
export type BuilderDraftId = string;
export type BuilderOwnerId = string;

export type BuilderJson =
  | string
  | number
  | boolean
  | null
  | BuilderJson[]
  | { [key: string]: BuilderJson };

export type BuilderMetadata = Record<string, BuilderJson>;

export type BuilderPosition = {
  x: number;
  y: number;
};

export type BuilderConnectionHandle = {
  id: BuilderId;
  label?: string;
  description?: string;
};

export type BuilderValidationIssueSeverity = "error" | "warning";

export type BuilderValidationIssue = {
  code: string;
  message: string;
  severity: BuilderValidationIssueSeverity;
  path?: string;
};

export type BuilderValidationResult = {
  valid: boolean;
  issues: BuilderValidationIssue[];
};
