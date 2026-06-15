import { test } from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PlatformErrorEnvelopeSchema } from "../../src/platform/errors/schema";

test("PlatformErrorEnvelopeSchema", async (t) => {
  const validMin = {
    id: "err_123",
    code: "VALIDATION.FIELD.INVALID",
    category: "validation",
    severity: "error",
    message: "Invalid field value",
    timestamp: "2023-10-27T10:00:00Z",
  };

  const validFull = {
    id: "err_456",
    code: "INFRASTRUCTURE.DATABASE.CONNECTION_TIMEOUT",
    category: "infrastructure",
    severity: "critical",
    message: "Database connection timeout",
    timestamp: "2023-10-27T10:05:00Z",
    userMessage: "We are experiencing technical difficulties. Please try again later.",
    workspaceId: "123e4567-e89b-12d3-a456-426614174000",
    correlationId: "corr_789",
    causationId: "caus_012",
    source: {
      pointer: "/data/attributes/email",
    },
    details: {
      hint: "Check your internet connection",
    },
    validationIssues: [
      {
        code: "invalid_format",
        message: "Email format is invalid",
        path: ["data", "attributes", "email"],
      },
    ],
    retry: {
      retryable: true,
      afterSeconds: 30,
    },
    metadata: {
      region: "us-east-1",
    },
  };

  await t.test("should validate minimum valid envelope", () => {
    const result = PlatformErrorEnvelopeSchema.safeParse(validMin);
    assert.strictEqual(result.success, true);
  });

  await t.test("should validate full valid envelope", () => {
    const result = PlatformErrorEnvelopeSchema.safeParse(validFull);
    assert.strictEqual(result.success, true);
  });

  await t.test("should reject when mandatory field is missing", () => {
    const invalid: Record<string, unknown> = { ...validMin };
    delete invalid.id;
    const result = PlatformErrorEnvelopeSchema.safeParse(invalid);
    assert.strictEqual(result.success, false);
  });

  await t.test("should reject invalid category", () => {
    const invalid = { ...validMin, category: "invalid_category" };
    const result = PlatformErrorEnvelopeSchema.safeParse(invalid);
    assert.strictEqual(result.success, false);
  });

  await t.test("should reject invalid severity", () => {
    const invalid = { ...validMin, severity: "invalid_severity" };
    const result = PlatformErrorEnvelopeSchema.safeParse(invalid);
    assert.strictEqual(result.success, false);
  });

  await t.test("should validate correct code format", () => {
    const result = PlatformErrorEnvelopeSchema.safeParse({
      ...validMin,
      code: "A1.B2.C3",
    });
    assert.strictEqual(result.success, true);
  });

  await t.test("should reject malformed code format", () => {
    const invalidCodes = [
      "INVALID",
      "INVALID.CODE",
      "invalid.resource.reason",
      "INVALID.RESOURCE.REASON.EXTRA",
      "INVALID..REASON",
    ];
    for (const code of invalidCodes) {
      const result = PlatformErrorEnvelopeSchema.safeParse({ ...validMin, code });
      assert.strictEqual(result.success, false, `Code "${code}" should be invalid`);
    }
  });

  await t.test("should reject invalid timestamp", () => {
    const invalid = { ...validMin, timestamp: "not-a-date" };
    const result = PlatformErrorEnvelopeSchema.safeParse(invalid);
    assert.strictEqual(result.success, false);
  });

  await t.test("should validate valid retry instruction", () => {
    const result = PlatformErrorEnvelopeSchema.safeParse({
      ...validMin,
      retry: { retryable: false },
    });
    assert.strictEqual(result.success, true);
  });

  await t.test("should reject negative afterSeconds in retry", () => {
    const invalid = {
      ...validMin,
      retry: { retryable: true, afterSeconds: -1 },
    };
    const result = PlatformErrorEnvelopeSchema.safeParse(invalid);
    assert.strictEqual(result.success, false);
  });

  await t.test("should validate valid validation issues", () => {
    const result = PlatformErrorEnvelopeSchema.safeParse({
      ...validMin,
      validationIssues: [
        { code: "REQUIRED", message: "Field is required", path: ["field"] },
      ],
    });
    assert.strictEqual(result.success, true);
  });

  await t.test("should validate valid details", () => {
    const result = PlatformErrorEnvelopeSchema.safeParse({
      ...validMin,
      details: { foo: "bar", num: 1, bool: true, obj: { a: 1 } },
    });
    assert.strictEqual(result.success, true);
  });

  await t.test("should validate valid metadata", () => {
    const result = PlatformErrorEnvelopeSchema.safeParse({
      ...validMin,
      metadata: { env: "prod" },
    });
    assert.strictEqual(result.success, true);
  });

  await t.test("should reject unknown fields (strict)", () => {
    const invalid = { ...validMin, unknownField: "should-fail" };
    const result = PlatformErrorEnvelopeSchema.safeParse(invalid);
    assert.strictEqual(result.success, false);
  });

  await t.test("should support JSON serialization and re-validation", () => {
    const json = JSON.stringify(validFull);
    const parsed = JSON.parse(json);
    const result = PlatformErrorEnvelopeSchema.safeParse(parsed);
    assert.strictEqual(result.success, true);
  });

  await t.test("should not use 'any' in production file", () => {
    const content = readFileSync(join(__dirname, "../../src/platform/errors/schema.ts"), "utf-8");
    assert.strictEqual(content.includes("any"), false, "Production code should not contain 'any'");
  });
});
