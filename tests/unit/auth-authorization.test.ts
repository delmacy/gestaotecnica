import { describe, it } from "node:test";
import assert from "node:assert";
import proxyquire from "proxyquire";

describe("Authorization checks", () => {
  it("requireCurrentUser redirects to login if no user is found", async () => {
    let redirectCalledWith = "";
    const { requireCurrentUser } = proxyquire("../../src/modules/auth/authorization", {
      "./session": { getCurrentUser: async () => null },
      "next/navigation": { redirect: (url: string) => { redirectCalledWith = url; throw new Error("NEXT_REDIRECT"); } },
    });

    try {
      await requireCurrentUser();
      assert.fail("Should have redirected");
    } catch (e: unknown) {
      if (e instanceof Error && e.message !== "NEXT_REDIRECT") throw e;
    }
    assert.strictEqual(redirectCalledWith, "/auth/login");
  });

  it("requireCurrentUser returns user if found", async () => {
    const fakeUser = { id: "u-1", name: "User" };
    const { requireCurrentUser } = proxyquire("../../src/modules/auth/authorization", {
      "./session": { getCurrentUser: async () => fakeUser },
      "next/navigation": { redirect: () => { assert.fail("Should not redirect"); } },
    });

    const user = await requireCurrentUser();
    assert.deepStrictEqual(user, fakeUser);
  });

  it("requireAccessProfile redirects if user does not have allowed profile", async () => {
    let redirectCalledWith = "";
    const fakeUser = { id: "u-1", accessProfile: "operador" };
    const { requireAccessProfile } = proxyquire("../../src/modules/auth/authorization", {
      "./session": { getCurrentUser: async () => fakeUser },
      "next/navigation": { redirect: (url: string) => { redirectCalledWith = url; throw new Error("NEXT_REDIRECT"); } },
    });

    try {
      await requireAccessProfile(["admin", "builder"]);
      assert.fail("Should have redirected");
    } catch (e: unknown) {
      if (e instanceof Error && e.message !== "NEXT_REDIRECT") throw e;
    }
    assert.strictEqual(redirectCalledWith, "/blocked?role=admin%2C%20builder");
  });

  it("requireAccessProfile returns user if user has allowed profile", async () => {
    const fakeUser = { id: "u-1", accessProfile: "admin" };
    const { requireAccessProfile } = proxyquire("../../src/modules/auth/authorization", {
      "./session": { getCurrentUser: async () => fakeUser },
      "next/navigation": { redirect: () => { assert.fail("Should not redirect"); } },
    });

    const user = await requireAccessProfile(["admin", "builder"]);
    assert.deepStrictEqual(user, fakeUser);
  });
});
