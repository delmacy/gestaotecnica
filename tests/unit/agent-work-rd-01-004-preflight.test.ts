import { test, describe } from "node:test";
import assert from "node:assert";

describe("Preflight Script Syntax and Behavior", () => {
  test("script can be imported without executing by default", async () => {
    // Importing the script should not throw
    const preflight = await import("../../src/scripts/db/preflight-env-binding");
    assert.ok(preflight.runPreflight);
    assert.ok(preflight.runPreflightChecks);
  });

  test("runPreflightChecks validates schema presence", async () => {
    const preflight = await import("../../src/scripts/db/preflight-env-binding");

    // Mock the sql execution returning missing schemas
    const mockSql = async (strings: any, ...values: any[]) => {
      const q = strings[0].trim();
      if (q.startsWith("SELECT schema_name")) {
        return [{ schema_name: "public" }]; // Missing others
      }
      return [];
    };

    await assert.rejects(
      preflight.runPreflightChecks(mockSql as any),
      /BLOCKER: Missing required schemas: identity, workspace, workflow, registry, documents, storage, blueprints, builder/
    );
  });

  test("runPreflightChecks validates non-superuser", async () => {
    const preflight = await import("../../src/scripts/db/preflight-env-binding");

    // Mock the sql execution returning all schemas, but user is superuser
    const mockSql = async (strings: any, ...values: any[]) => {
      const q = strings[0].trim();
      if (q.startsWith("SELECT schema_name")) {
        return preflight.REQUIRED_SCHEMAS.map(s => ({ schema_name: s }));
      }
      if (q.startsWith("SELECT current_user")) {
        return [{ current_user: "admin" }];
      }
      if (q.startsWith("SELECT rolsuper")) {
        return [{ rolsuper: true }];
      }
      return [];
    };

    await assert.rejects(
      preflight.runPreflightChecks(mockSql as any),
      /BLOCKER: Runtime database user 'admin' is a superuser/
    );
  });

  test("runPreflightChecks validates no CREATE privileges", async () => {
    const preflight = await import("../../src/scripts/db/preflight-env-binding");

    // Mock the sql execution returning schemas, non-super, but has CREATE on 'builder'
    const mockSql = async (strings: any, ...values: any[]) => {
      const q = strings[0].trim();
      if (q.startsWith("SELECT schema_name")) {
        return preflight.REQUIRED_SCHEMAS.map(s => ({ schema_name: s }));
      }
      if (q.startsWith("SELECT current_user")) {
        return [{ current_user: "app_user" }];
      }
      if (q.startsWith("SELECT rolsuper")) {
        return [{ rolsuper: false }];
      }
      if (q.startsWith("SELECT has_schema_privilege")) {
         const schema = values[1];
         if (schema === "builder") {
             return [{ can_create: true }];
         }
         return [{ can_create: false }];
      }
      return [];
    };

    await assert.rejects(
      preflight.runPreflightChecks(mockSql as any),
      /BLOCKER: Runtime user 'app_user' has CREATE privileges on 'builder' schema/
    );
  });

  test("runPreflightChecks passes on correct setup", async () => {
    const preflight = await import("../../src/scripts/db/preflight-env-binding");

    // Mock the sql execution returning schemas, non-super, no CREATE privileges
    const mockSql = async (strings: any, ...values: any[]) => {
      const q = strings[0].trim();
      if (q.startsWith("SELECT schema_name")) {
        return preflight.REQUIRED_SCHEMAS.map(s => ({ schema_name: s }));
      }
      if (q.startsWith("SELECT current_user")) {
        return [{ current_user: "app_user" }];
      }
      if (q.startsWith("SELECT rolsuper")) {
        return [{ rolsuper: false }];
      }
      if (q.startsWith("SELECT has_schema_privilege")) {
         return [{ can_create: false }];
      }
      return [];
    };

    await preflight.runPreflightChecks(mockSql as any); // Should not throw
    assert.ok(true);
  });
});
