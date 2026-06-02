export class ProcessDefinitionValidationError extends Error {
  constructor(
    message: string,
    public readonly issues: Array<{ code: string; message: string; path?: string }>,
  ) {
    super(message);
    this.name = "ProcessDefinitionValidationError";
  }
}

export class ProcessDefinitionPersistenceError extends Error {
  public readonly originalCause?: unknown;

  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "ProcessDefinitionPersistenceError";
    this.originalCause = options?.cause;

    if (options?.cause && typeof options.cause === "object" && "stack" in options.cause) {
      this.stack = `${this.stack}\nCaused by: ${(options.cause as Error).stack}`;
    }
  }
}
