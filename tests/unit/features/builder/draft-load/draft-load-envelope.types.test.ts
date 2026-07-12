import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { DraftLoadEnvelope } from "@/features/builder/draft-load/draft-load-envelope.types";

describe("DraftLoadEnvelope", () => {
  it("should compile with valid data types", () => {
    const success: DraftLoadEnvelope<string> = {
      ok: true,
      data: "hello",
    };
    assert.equal(success.ok, true);
    if (success.ok) {
        assert.equal(success.data, "hello");
    }

    const notFound: DraftLoadEnvelope<string> = {
      ok: false,
      error: { type: "not_found", message: "Not found" },
    };
    assert.equal(notFound.ok, false);
    if (!notFound.ok) {
        assert.equal(notFound.error.type, "not_found");
    }

    const forbidden: DraftLoadEnvelope<string> = {
      ok: false,
      error: { type: "forbidden", message: "Forbidden" },
    };
    assert.equal(forbidden.ok, false);

    const invalidState: DraftLoadEnvelope<string> = {
      ok: false,
      error: { type: "invalid_state", message: "Invalid state" },
    };
    assert.equal(invalidState.ok, false);
  });
});
