import { describe, it } from "node:test";
import * as assert from "node:assert/strict";
import { IntegrationCommandResponse } from "../../src/platform/integrations/integration-command-types";

describe("IntegrationCommandResponse Type Validation", () => {
  it("should allow a valid success response", () => {
    const response: IntegrationCommandResponse = {
      success: true,
      data: { result: "ok" },
      correlationId: "abc-123",
    };
    assert.equal(response.success, true);
    assert.equal(response.correlationId, "abc-123");
  });

  it("should allow a valid error response", () => {
    const response: IntegrationCommandResponse = {
      success: false,
      error: { code: "ERR_1", message: "Error occurred" },
      correlationId: "def-456",
    };
    assert.equal(response.success, false);
    if (!response.success) {
      assert.equal(response.error.code, "ERR_1");
    }
  });

  it("should flag success response with error as invalid type", () => {
    // @ts-expect-error - A successful response should not have an error
    const response: IntegrationCommandResponse = {
      success: true,
      error: { code: "ERR_2", message: "Should not exist" },
      correlationId: "ghi-789",
    };
    assert.ok(response);
  });

  it("should flag error response without error object as invalid type", () => {
    // @ts-expect-error - An error response must include the error object
    const response: IntegrationCommandResponse = {
      success: false,
      correlationId: "jkl-012",
    };
    assert.ok(response);
  });
});
