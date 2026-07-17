import { describe, it } from "node:test";
import assert from "node:assert";
import proxyquire from "proxyquire";
import { hashSessionToken } from "../../src/modules/auth/crypto";

describe("Session handling", () => {
  it("getCurrentUser returns null when there is no auth cookie", async () => {
    const { getCurrentUser } = proxyquire("../../src/modules/auth/session", {
      "next/headers": { cookies: () => ({ get: () => undefined }) },
      "@/db": { getDb: () => ({}) },
    });

    const user = await getCurrentUser();
    assert.strictEqual(user, null);
  });

  it("getCurrentUser returns user when valid token exists", async () => {
    const fakeToken = "fake-token";
    const hashedToken = hashSessionToken(fakeToken);

    const { getCurrentUser } = proxyquire("../../src/modules/auth/session", {
      "next/headers": { cookies: () => ({ get: () => ({ value: fakeToken }) }) },
      "@/db": {
        getDb: () => ({
          select: () => ({
            from: () => ({
              innerJoin: () => ({
                where: () => ({
                  limit: () => [{
                    userId: "user-1",
                    name: "Test User",
                    email: "test@example.com",
                    status: "active",
                    accessProfile: "admin",
                  }]
                })
              })
            })
          })
        })
      },
    });

    const user = await getCurrentUser();
    assert.deepStrictEqual(user, {
      userId: "user-1",
      name: "Test User",
      email: "test@example.com",
      status: "active",
      accessProfile: "admin",
    });
  });

  it("getCurrentUser returns null when valid token but no db record (expired, revoked or invalid)", async () => {
    const fakeToken = "fake-token";

    const { getCurrentUser } = proxyquire("../../src/modules/auth/session", {
      "next/headers": { cookies: () => ({ get: () => ({ value: fakeToken }) }) },
      "@/db": {
        getDb: () => ({
          select: () => ({
            from: () => ({
              innerJoin: () => ({
                where: () => ({
                  limit: () => [] // no records found
                })
              })
            })
          })
        })
      },
    });

    const user = await getCurrentUser();
    assert.strictEqual(user, null);
  });
});
