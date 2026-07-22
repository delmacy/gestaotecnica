import { describe, it } from "node:test";
import assert from "node:assert";
import { execSync } from "node:child_process";

describe("Admin Path Least-Privilege Verification", () => {
  it("should successfully execute ensure-platform-admin.ts using app_runtime role", () => {
    // We expect the script to execute successfully using the restricted role
    const output = execSync(
      'RUNTIME_DATABASE_URL="postgres://app_runtime:password@localhost:5432/gestaotecnica" npx tsx src/scripts/ensure-platform-admin.ts',
      { encoding: "utf-8", stdio: "pipe" }
    );

    assert(output.includes("Verificando administrador plataforma"), "Script started successfully");
    assert(output.includes("Superusuário da Plataforma Configurado!"), "Admin setup completed successfully");
  });

  it("should block destructive operations when executing via app_runtime role", () => {
    // Attempting a break-glass destructive operation with the runtime credential should fail
    try {
      execSync(
        'BREAK_GLASS_DATABASE_URL="postgres://app_runtime:password@localhost:5432/gestaotecnica" npx tsx src/scripts/db/break-glass-teardown.ts',
        { encoding: "utf-8", stdio: "pipe" }
      );
      assert.fail("Should have thrown an error due to insufficient privileges");
    } catch (error: any) {
      assert(error.stderr?.includes("permission denied") || error.stdout?.includes("must be owner"), "Operation should be blocked by Postgres due to missing privileges");
    }
  });
});
