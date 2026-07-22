import { test } from "node:test";
import assert from "node:assert";
import { LAUNCH_ALPHA } from "../../src/scripts/launch-alpha/constants";

test("Launch Alpha Seed Configuration", async (t) => {
    await t.test("should not contain any PII", () => {
        // Assert email is a local example address
        assert.ok(LAUNCH_ALPHA.user.email.endsWith("@example.local"), "Email should be a local/example address");
        assert.ok(LAUNCH_ALPHA.user.name.includes("Alpha Real User"), "Name should indicate real alpha user");

        // Assert no real phone numbers, CPF, etc. exist in the config
        assert.ok(!("phone" in LAUNCH_ALPHA.user), "Should not contain phone numbers");
        assert.ok(!("cpf" in LAUNCH_ALPHA.user), "Should not contain CPF");
    });

    await t.test("should distinguish real-data from demo behavior", () => {
        assert.ok(LAUNCH_ALPHA.workspace.name.includes("Real"), "Workspace name should indicate real data");
        assert.ok(LAUNCH_ALPHA.organization.name.includes("Real"), "Organization name should indicate real data");
    });

    await t.test("should have valid capabilities defined", () => {
        assert.ok(LAUNCH_ALPHA.capabilities.length > 0, "Must have capabilities defined");
        LAUNCH_ALPHA.capabilities.forEach((cap) => {
            assert.ok(cap.key.startsWith("capability_"), "Capability key should follow naming convention");
            assert.ok(cap.name.includes("Real"), "Capability name should clearly indicate it is for real processes");
        });
    });

    await t.test("should define a valid process candidate", () => {
        assert.ok(LAUNCH_ALPHA.candidate.name.includes("Real"), "Candidate name should reflect real mode");
        assert.ok(Object.keys(LAUNCH_ALPHA.nodes).length > 0, "Candidate must have nodes");
        assert.ok(LAUNCH_ALPHA.edges.length > 0, "Candidate must have edges");
    });
});
