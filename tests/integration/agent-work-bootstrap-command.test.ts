import { describe, it } from "node:test";
import assert from "node:assert";
import { execSync } from "node:child_process";
import fs from "node:fs";

describe("Bootstrap and Break-Glass Commands", () => {
  it("should have a bootstrap command in package.json", () => {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
    assert.ok(pkg.scripts.bootstrap, "Missing bootstrap script");
    assert.match(pkg.scripts.bootstrap, /db:migrate/, "bootstrap should call migrate");
    assert.match(pkg.scripts.bootstrap, /db:preflight/, "bootstrap should call preflight");
    assert.match(pkg.scripts.bootstrap, /ensure-platform-admin/, "bootstrap should call admin seed");
  });

  it("should have a break-glass teardown script in package.json", () => {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
    assert.ok(pkg.scripts["db:break-glass:teardown"], "Missing db:break-glass:teardown script");
  });

  it("should fail break-glass without BREAK_GLASS_DATABASE_URL", () => {
    try {
      execSync("npx tsx src/scripts/db/break-glass-teardown.ts", {
        env: { ...process.env, BREAK_GLASS_DATABASE_URL: "" },
        stdio: "pipe",
      });
      assert.fail("Should have failed without BREAK_GLASS_DATABASE_URL");
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'stderr' in err) {
         assert.match((err as { stderr: Buffer | string }).stderr.toString(), /BLOCKER: BREAK_GLASS_DATABASE_URL must be set/);
      } else {
         assert.fail("Unexpected error format");
      }
    }
  });
});
