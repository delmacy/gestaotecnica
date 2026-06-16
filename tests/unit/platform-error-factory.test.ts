import { describe, it } from "node:test";
import assert from "node:assert";
import {
  createPlatformError,
  CreatePlatformErrorInput,
  PlatformErrorContext
} from "../../src/platform/errors";
import { ZodError } from "zod";

describe("Platform Error Factory", () => {
  const validContext: PlatformErrorContext = Object.freeze({
    id: "err_123",
    timestamp: "2024-05-20T10:00:00Z",
    workspaceId: "123e4567-e89b-12d3-a456-426614174000",
    correlationId: "corr_abc",
    causationId: "caus_xyz",
  });

  const minimalInput: CreatePlatformErrorInput = Object.freeze({
    code: "VALIDATION.FIELD.INVALID",
    category: "validation",
    severity: "error",
    message: "Invalid field value",
  });

  it("should create a minimal valid envelope", () => {
    const context: PlatformErrorContext = {
      id: "err_min",
      timestamp: "2024-05-20T10:00:00Z",
    };
    const result = createPlatformError(minimalInput, context);

    assert.strictEqual(result.id, context.id);
    assert.strictEqual(result.timestamp, context.timestamp);
    assert.strictEqual(result.code, minimalInput.code);
    assert.strictEqual(result.message, minimalInput.message);
    assert.strictEqual(result.workspaceId, undefined);
    assert.strictEqual(result.correlationId, undefined);
    assert.strictEqual(result.causationId, undefined);
  });

  it("should create a complete valid envelope", () => {
    const input: CreatePlatformErrorInput = {
      ...minimalInput,
      userMessage: "O valor informado é inválido.",
      source: { pointer: "/data/name" },
      details: { field: "name", expected: "string" },
      validationIssues: [
        { code: "too_short", message: "Too short", path: ["name"] }
      ],
      retry: { retryable: false },
      metadata: { env: "prod" },
    };

    const result = createPlatformError(input, validContext);

    assert.strictEqual(result.id, validContext.id);
    assert.strictEqual(result.timestamp, validContext.timestamp);
    assert.strictEqual(result.workspaceId, validContext.workspaceId);
    assert.strictEqual(result.correlationId, validContext.correlationId);
    assert.strictEqual(result.causationId, validContext.causationId);
    assert.strictEqual(result.userMessage, input.userMessage);
    assert.deepStrictEqual(result.source, input.source);
    assert.deepStrictEqual(result.details, input.details);
    assert.deepStrictEqual(result.validationIssues, input.validationIssues);
    assert.deepStrictEqual(result.retry, input.retry);
    assert.deepStrictEqual(result.metadata, input.metadata);
  });

  it("should ensure id comes from context", () => {
    const inputWithId = { ...minimalInput, id: "wrong_id" } as unknown as CreatePlatformErrorInput;
    const result = createPlatformError(inputWithId, validContext);
    assert.strictEqual(result.id, validContext.id);
  });

  it("should ensure timestamp comes from context", () => {
    const inputWithTs = { ...minimalInput, timestamp: "2000-01-01T00:00:00Z" } as unknown as CreatePlatformErrorInput;
    const result = createPlatformError(inputWithTs, validContext);
    assert.strictEqual(result.timestamp, validContext.timestamp);
  });

  it("should propagate workspaceId from context", () => {
    const result = createPlatformError(minimalInput, validContext);
    assert.strictEqual(result.workspaceId, validContext.workspaceId);
  });

  it("should propagate correlationId from context", () => {
    const result = createPlatformError(minimalInput, validContext);
    assert.strictEqual(result.correlationId, validContext.correlationId);
  });

  it("should propagate causationId from context", () => {
    const result = createPlatformError(minimalInput, validContext);
    assert.strictEqual(result.causationId, validContext.causationId);
  });

  it("should not create optional fields if absent in context", () => {
    const sparseContext: PlatformErrorContext = {
      id: "err_sparse",
      timestamp: "2024-05-20T10:00:00Z",
    };
    const result = createPlatformError(minimalInput, sparseContext);
    assert.ok(!("workspaceId" in result) || result.workspaceId === undefined);
    assert.ok(!("correlationId" in result) || result.correlationId === undefined);
    assert.ok(!("causationId" in result) || result.causationId === undefined);
  });

  it("should be deterministic (same arguments generate identical result)", () => {
    const res1 = createPlatformError(minimalInput, validContext);
    const res2 = createPlatformError(minimalInput, validContext);
    assert.deepStrictEqual(res1, res2);
  });

  it("should reject invalid input (missing required fields)", () => {
    const invalidInput = { message: "missing code" } as unknown as CreatePlatformErrorInput;
    assert.throws(() => createPlatformError(invalidInput, validContext), ZodError);
  });

  it("should reject invalid code format", () => {
    const invalidInput: CreatePlatformErrorInput = {
      ...minimalInput,
      code: "invalid-code",
    };
    assert.throws(() => createPlatformError(invalidInput, validContext), (err: ZodError) => {
      return err.issues.some(i => i.path.includes("code"));
    });
  });

  it("should reject invalid category", () => {
    const invalidInput = {
      ...minimalInput,
      category: "invalid_cat",
    } as unknown as CreatePlatformErrorInput;
    assert.throws(() => createPlatformError(invalidInput, validContext), (err: ZodError) => {
      return err.issues.some(i => i.path.includes("category"));
    });
  });

  it("should reject invalid severity", () => {
    const invalidInput = {
      ...minimalInput,
      severity: "critical_high",
    } as unknown as CreatePlatformErrorInput;
    assert.throws(() => createPlatformError(invalidInput, validContext), (err: ZodError) => {
      return err.issues.some(i => i.path.includes("severity"));
    });
  });

  it("should reject invalid timestamp in context", () => {
    const invalidContext = {
      ...validContext,
      timestamp: "not-a-date",
    };
    assert.throws(() => createPlatformError(minimalInput, invalidContext), (err: ZodError) => {
      return err.issues.some(i => i.path.includes("timestamp"));
    });
  });

  it("should preserve metadata", () => {
    const input: CreatePlatformErrorInput = {
      ...minimalInput,
      metadata: { foo: "bar", nested: { a: 1 } },
    };
    const result = createPlatformError(input, validContext);
    assert.deepStrictEqual(result.metadata, input.metadata);
  });

  it("should preserve validationIssues", () => {
    const issues = [{ code: "REQUIRED", message: "Field is required", path: ["email"] }];
    const input: CreatePlatformErrorInput = {
      ...minimalInput,
      validationIssues: issues,
    };
    const result = createPlatformError(input, validContext);
    assert.deepStrictEqual(result.validationIssues, issues);
  });

  it("should preserve retry instructions", () => {
    const retry = { retryable: true, afterSeconds: 30 };
    const input: CreatePlatformErrorInput = {
      ...minimalInput,
      retry,
    };
    const result = createPlatformError(input, validContext);
    assert.deepStrictEqual(result.retry, retry);
  });

  it("should reject unknown fields in input via schema strictness", () => {
    const inputWithExtra = {
      ...minimalInput,
      extra: "should not be here",
    } as unknown as CreatePlatformErrorInput;

    assert.throws(() => createPlatformError(inputWithExtra, validContext), (err: ZodError) => {
      return err.issues.some(i => i.code === "unrecognized_keys" && i.path.length === 0);
    });
  });

  it("should work with frozen input", () => {
    const frozenInput = Object.freeze({ ...minimalInput });
    const result = createPlatformError(frozenInput, validContext);
    assert.strictEqual(result.code, minimalInput.code);
  });

  it("should work with frozen context", () => {
    const result = createPlatformError(minimalInput, validContext);
    assert.strictEqual(result.id, validContext.id);
  });

  it("should not mutate input", () => {
    const input = { ...minimalInput };
    createPlatformError(input, validContext);
    assert.deepStrictEqual(input, minimalInput);
  });

  it("should not mutate context", () => {
    const context = { ...validContext };
    createPlatformError(minimalInput, context);
    assert.deepStrictEqual(context, validContext);
  });

  it("should return a frozen object", () => {
    const result = createPlatformError(minimalInput, validContext);
    assert.ok(Object.isFrozen(result));
  });
});
