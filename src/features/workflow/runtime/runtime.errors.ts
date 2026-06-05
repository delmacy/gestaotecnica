export type RuntimeErrorCode =
  | "INVALID_INPUT"
  | "PROCESS_VERSION_NOT_FOUND"
  | "PROCESS_VERSION_NOT_PUBLISHED"
  | "REPOSITORY_ERROR"
  | "INTERNAL_ERROR";

export interface RuntimeError {
  code: RuntimeErrorCode;
  message: string;
}

export type RuntimeResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: RuntimeError };
