import { describe, it } from "node:test";
import assert from "node:assert";
import { getDefaultRouteForProfile, canAccessRoute } from "../../src/modules/auth/access-profiles";

describe("Access Profiles Domain", () => {
  describe("getDefaultRouteForProfile", () => {
    it("returns /admin for builder", () => {
      assert.strictEqual(getDefaultRouteForProfile("builder"), "/builder");
    });

    it("returns /operations for admin", () => {
      assert.strictEqual(getDefaultRouteForProfile("admin"), "/operations");
    });

    it("returns /operations for operador", () => {
      assert.strictEqual(getDefaultRouteForProfile("operador"), "/operations");
    });
  });

  describe("canAccessRoute", () => {
    it("allows builder to access /admin", () => {
      assert.strictEqual(canAccessRoute("builder", "/admin"), true);
    });

    it("denies admin access to /admin", () => {
      assert.strictEqual(canAccessRoute("admin", "/admin"), false);
    });

    it("denies operador access to /admin", () => {
      assert.strictEqual(canAccessRoute("operador", "/admin"), false);
    });

    it("allows operador to access /operations", () => {
      assert.strictEqual(canAccessRoute("operador", "/operations"), true);
    });

    it("denies access to unknown paths like /random", () => {
      assert.strictEqual(canAccessRoute("builder", "/random"), false);
    });
  });
});
