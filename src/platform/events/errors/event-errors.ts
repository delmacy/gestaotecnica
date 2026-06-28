export type EventErrorCodes =
  | "MISSING_WORKSPACE_CONTEXT"
  | "INVALID_IDEMPOTENCY_KEY_TYPE"
  | "EMPTY_IDEMPOTENCY_KEY"
  | "IDEMPOTENCY_KEY_TOO_LONG"
  | "PERSISTENCE_FAILURE";

export class EventStoreError extends Error {
  constructor(
    public readonly code: EventErrorCodes,
    message: string,
    cause?: unknown
  ) {
    // Use the native 'cause' feature of Error (Node.js 16.9.0+)
    // It remains accessible via .cause but is not included in standard JSON/string representations
    super(message, { cause });
    this.name = "EventStoreError";
  }
}
