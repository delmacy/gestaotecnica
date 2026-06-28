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
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = "EventStoreError";
  }
}
