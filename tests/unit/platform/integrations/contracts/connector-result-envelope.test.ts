import { test } from "node:test";
import assert from "node:assert";
import { z } from "zod";
import { ConnectorResultEnvelopeSchema } from "@/platform/integrations/contracts/connector-result-envelope";

test("ConnectorResultEnvelopeSchema validates valid success", () => {
    assert.doesNotThrow(() => ConnectorResultEnvelopeSchema.parse({ status: "success", data: { id: 1 } }));
});

test("ConnectorResultEnvelopeSchema validates valid retryable_failure", () => {
    assert.doesNotThrow(() => ConnectorResultEnvelopeSchema.parse({ status: "retryable_failure", errorCode: "timeout" }));
});

test("ConnectorResultEnvelopeSchema rejects invalid payload missing error code", () => {
    assert.throws(() => ConnectorResultEnvelopeSchema.parse({ status: "permanent_failure" }), (err) => {
        assert(err instanceof z.ZodError);
        return true;
    });
});
