import { test } from "node:test";
import assert from "node:assert";
import proxyquire from "proxyquire";
import { LAUNCH_DEMO } from "../../src/scripts/launch-demo/constants";

test("Launch Demo Seed Configuration", async (t) => {
    await t.test("should not contain any PII", () => {
        // Assert email is a local example address
        assert.ok(LAUNCH_DEMO.user.email.endsWith("@example.local"), "Email should be a local/example address");
        assert.ok(LAUNCH_DEMO.user.name.includes("Demo"), "Name should clearly indicate it is a demo");

        // Assert no real phone numbers, CPF, etc. exist in the config
        assert.ok(!("phone" in LAUNCH_DEMO.user), "Should not contain phone numbers");
        assert.ok(!("cpf" in LAUNCH_DEMO.user), "Should not contain CPF");
    });

    await t.test("should have valid capabilities defined", () => {
        assert.ok(LAUNCH_DEMO.capabilities.length > 0, "Must have capabilities defined");
        LAUNCH_DEMO.capabilities.forEach((cap) => {
            assert.ok(cap.key.startsWith("capability_"), "Capability key should follow naming convention");
            assert.ok(cap.name, "Capability must have a name");
        });
    });

    await t.test("should define a valid process candidate", () => {
        assert.ok(LAUNCH_DEMO.candidate.name, "Candidate must have a name");
        assert.ok(Object.keys(LAUNCH_DEMO.nodes).length > 0, "Candidate must have nodes");
        assert.ok(LAUNCH_DEMO.edges.length > 0, "Candidate must have edges");
    });
});
