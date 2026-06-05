export type RuntimeErrorCode =
  | "INVALID_INPUT"
  | "PROCESS_VERSION_NOT_FOUND"
  | "PROCESS_VERSION_NOT_PUBLISHED"
  | "REPOSITORY_ERROR"
  | "INTERNAL_ERROR"
  | "INSTANCE_NOT_FOUND"
  | "NO_ACTIVE_STEP"
  | "INVALID_PROCESS_DEFINITION"
  | "END_NODE_REACHED";

export interface RuntimeError {
  code: RuntimeErrorCode;
  message: string;
}

export type RuntimeResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: RuntimeError };
