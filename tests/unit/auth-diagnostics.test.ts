import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import proxyquire from "proxyquire";

describe("runAuthDiagnostics Unit Tests", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("returns failure if database URLs are missing", async () => {
    delete process.env.DATABASE_URL;
    delete process.env.RUNTIME_DATABASE_URL;
    delete process.env.PLATFORM_DATABASE_URL;

    const { runAuthDiagnostics } = await import("../../src/modules/auth/diagnostics");
    const result = await runAuthDiagnostics();

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.hasDbUrl, false);
    assert.match(result.errorMessage || "", /não está configurada/);
  });

  test("handles database connection failure gracefully without leaking passwords", async () => {
    process.env.DATABASE_URL = "postgresql://my_secret_username:my_super_secret_password_123456@localhost:5432/db";

    const mockPostgres = () => {
      const sqlMock = () => {
        throw new Error("connection failed: postgresql://my_secret_username:my_super_secret_password_123456@localhost:5432/db failed to connect");
      };
      sqlMock.end = async () => {};
      return sqlMock;
    };

    const diagnosticsModule = proxyquire("../../src/modules/auth/diagnostics", {
      postgres: mockPostgres,
    });

    const result = await diagnosticsModule.runAuthDiagnostics();

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.canConnect, false);
    assert.ok(result.errorMessage);
    assert.ok(!result.errorMessage!.includes("my_super_secret_password_123456"));
    assert.match(result.errorMessage!, /postgresql:\/\/\*\*\*\*@/);
  });

  test("detects missing schemas correctly", async () => {
    process.env.DATABASE_URL = "postgresql://app_runtime@localhost:5432/db";

    const mockPostgres = () => {
      const sqlMock = async (strings: TemplateStringsArray) => {
        const query = strings[0].trim();
        if (query.startsWith("SELECT 1")) {
          return [{ connected: 1 }];
        }
        if (query.includes("information_schema.schemata")) {
          // Missing 'builder' and 'workflow'
          return [
            { schema_name: "public" },
            { schema_name: "identity" },
            { schema_name: "workspace" },
            { schema_name: "registry" },
            { schema_name: "documents" },
            { schema_name: "storage" },
            { schema_name: "blueprints" },
          ];
        }
        if (query.startsWith("SELECT current_user")) {
          return [{ current_user: "app_runtime" }];
        }
        if (query.includes("pg_roles")) {
          return [{ rolsuper: false }];
        }
        if (query.includes("has_schema_privilege")) {
          return [{ can_create: false }];
        }
        if (query.includes("information_schema.tables")) {
          return [];
        }
        return [];
      };
      sqlMock.end = async () => {};
      return sqlMock;
    };

    const diagnosticsModule = proxyquire("../../src/modules/auth/diagnostics", {
      postgres: mockPostgres,
    });

    const result = await diagnosticsModule.runAuthDiagnostics();

    assert.strictEqual(result.success, true);
    assert.deepStrictEqual(result.missingSchemas, ["workflow", "builder"]);
  });

  test("detects superuser and CREATE privilege violations", async () => {
    process.env.RUNTIME_DATABASE_URL = "postgresql://app_runtime@localhost:5432/db";
    process.env.DATABASE_URL = "postgresql://owner@localhost:5432/db"; // Non-matching URLs -> non-synthetic!

    const mockPostgres = () => {
      const sqlMock = async (strings: TemplateStringsArray, ...values: unknown[]) => {
        const query = strings[0].trim();
        if (query.startsWith("SELECT 1")) {
          return [{ connected: 1 }];
        }
        if (query.includes("information_schema.schemata")) {
          return diagnosticsModule.REQUIRED_SCHEMAS.map((s: string) => ({ schema_name: s }));
        }
        if (query.startsWith("SELECT current_user")) {
          return [{ current_user: "app_runtime" }];
        }
        if (query.includes("pg_roles")) {
          return [{ rolsuper: true }];
        }
        if (query.includes("has_schema_privilege")) {
          const schema = values[1];
          if (schema === "builder") {
            return [{ can_create: true }];
          }
          return [{ can_create: false }];
        }
        if (query.includes("information_schema.tables")) {
          return [];
        }
        return [];
      };
      sqlMock.end = async () => {};
      return sqlMock;
    };

    const diagnosticsModule = proxyquire("../../src/modules/auth/diagnostics", {
      postgres: mockPostgres,
    });

    const result = await diagnosticsModule.runAuthDiagnostics();

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.isSynthetic, false);
    assert.strictEqual(result.isSuperuser, true);
    assert.strictEqual(result.hasCreatePrivilege, true);
    assert.deepStrictEqual(result.violatedSchemas, ["builder"]);
  });
});
