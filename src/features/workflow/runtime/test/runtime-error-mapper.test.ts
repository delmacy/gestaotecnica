import * as assert from "node:assert";
import { describe, it } from "node:test";
import { mapRuntimeErrorToPublicDiagnostic } from "../mappers/runtime-error.mapper";
import { RuntimeError, RuntimeErrorCode } from "../runtime.errors";
import { RuntimeDiagnosticEnvelope } from "../envelopes/runtime-diagnostic-envelope";
import { INVALID_RUNTIME_DIAGNOSTIC_ENVELOPE_WITH_PAYLOAD } from "../../../../../tests/fixtures/features/workflow/runtime/runtime-diagnostic-envelope.fixtures";

describe("mapRuntimeErrorToPublicDiagnostic", () => {
  it("diagnostic output does not expose raw payload fields by default", () => {
    const error: RuntimeError = { code: "INVALID_INPUT", message: "Internal detail message" };
    const context = INVALID_RUNTIME_DIAGNOSTIC_ENVELOPE_WITH_PAYLOAD as unknown as Partial<RuntimeDiagnosticEnvelope>;

    const result = mapRuntimeErrorToPublicDiagnostic(error, context);

    assert.strictEqual("payload" in result, false);
  });

  it("should map a known error correctly", () => {
    const error: RuntimeError = { code: "INVALID_INPUT", message: "Internal detail message" };
    const context: Partial<RuntimeDiagnosticEnvelope> = {
      correlationId: "corr-123",
      processId: "proc-123",
      actionId: "act-123",
    };

    const result = mapRuntimeErrorToPublicDiagnostic(error, context);

    assert.strictEqual(result.code, "INVALID_INPUT");
    assert.strictEqual(result.message, "Os dados fornecidos para o comando são inválidos.");
    assert.strictEqual(result.retryable, false);
    assert.strictEqual(result.correlationId, "corr-123");
    assert.strictEqual(result.processId, "proc-123");
    assert.strictEqual(result.actionId, "act-123");
  });

  it("should map an unknown error to INTERNAL_ERROR", () => {
    const error = { code: "SOME_UNKNOWN_CODE" as RuntimeErrorCode, message: "Whoops" };

    const result = mapRuntimeErrorToPublicDiagnostic(error);

    assert.strictEqual(result.code, "INTERNAL_ERROR");
    assert.strictEqual(result.message, "Ocorreu um erro interno irrecuperável.");
    assert.strictEqual(result.retryable, true);
    assert.strictEqual(result.correlationId, undefined);
  });

  it("should handle known retryable errors correctly", () => {
    const error: RuntimeError = { code: "CONCURRENT_MODIFICATION", message: "Transaction failed" };

    const result = mapRuntimeErrorToPublicDiagnostic(error);

    assert.strictEqual(result.code, "CONCURRENT_MODIFICATION");
    assert.strictEqual(result.message, "O recurso foi atualizado por outro processo simultâneo. Tente novamente.");
    assert.strictEqual(result.retryable, true);
  });
});
