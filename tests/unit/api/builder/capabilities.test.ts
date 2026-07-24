import { describe, it } from "node:test";
import assert from "node:assert";

import { MOCK_CAPABILITIES } from "../../../../src/platform/capabilities/mock-data/capability-data";

describe("Capabilities API Contract", () => {
  it("should contain the required mock capability schema fields", () => {
    assert.ok(MOCK_CAPABILITIES.length > 0);
    const first = MOCK_CAPABILITIES[0];

    assert.ok("id" in first);
    assert.ok("slug" in first);
    assert.ok("name" in first);
    assert.ok("category" in first);
    assert.ok("install_state" in first);
  });
});
