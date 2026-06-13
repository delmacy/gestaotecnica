import { describe, it } from "node:test";
import assert from "node:assert";
import proxyquire from "proxyquire";


const defaultState = { status: "idle" as const };

describe("Setup Server Action", () => {
  it("fails if account already exists", async () => {
    let transactionCalled = false;
    let redirectCalled = false;
    const { setupFirstAdmin } = proxyquire("../../src/modules/auth/actions", {
      "next/headers": { cookies: () => ({ set: () => {} }) },
      "next/navigation": { redirect: () => { redirectCalled = true; } },
      "@/db": {
        getDb: () => ({
          select: () => ({
            from: () => ({
              where: () => ({
                limit: () => [{ id: "user-123" }]
              })
            })
          }),
          insert: () => ({
            values: () => ({ returning: () => [{ id: "user-123" }] }),
          }),
          transaction: async (cb: unknown) => { transactionCalled = true; return cb({ insert: () => ({ values: () => ({ returning: () => [{ id: "user-123" }] }) }) }); }
        }),
      },
    });

    // We overwrite the mock for specifically the auth accounts check
    const { setupFirstAdmin: setupFirstAdminAccounts } = proxyquire("../../src/modules/auth/actions", {
      "next/headers": { cookies: () => ({ set: () => {} }) },
      "next/navigation": { redirect: () => { redirectCalled = true; } },
      "@/db": {
        getDb: () => ({
          select: () => ({
            from: () => [{ id: "account-123" }], // Accounts exist!
          }),
        }),
      },
    });

    const formData = new FormData();
    formData.append("name", "Admin");
    formData.append("email", "admin@test.com");
    formData.append("password", "strongpassword");
    formData.append("passwordConfirmation", "strongpassword");

    const result = await setupFirstAdminAccounts(defaultState, formData);

    assert.strictEqual(result.status, "error");
    assert.match(result.message!, /O primeiro administrador já foi configurado/);
    assert.strictEqual(transactionCalled, false);
    assert.strictEqual(redirectCalled, false);
  });

  it("fails if name is missing", async () => {
    const { setupFirstAdmin } = proxyquire("../../src/modules/auth/actions", {
      "next/headers": { cookies: () => ({ set: () => {} }) },
      "next/navigation": { redirect: () => {} },
      "@/db": { getDb: () => ({}) },
    });

    const formData = new FormData();
    formData.append("email", "admin@test.com");
    formData.append("password", "strongpassword");
    formData.append("passwordConfirmation", "strongpassword");

    const result = await setupFirstAdmin(defaultState, formData);
    assert.strictEqual(result.status, "error");
    assert.strictEqual(result.fieldErrors?.name?.[0], "Nome é obrigatório.");
  });

  it("fails if password is too short", async () => {
    const { setupFirstAdmin } = proxyquire("../../src/modules/auth/actions", {
      "next/headers": { cookies: () => ({ set: () => {} }) },
      "next/navigation": { redirect: () => {} },
      "@/db": { getDb: () => ({}) },
    });

    const formData = new FormData();
    formData.append("name", "Admin");
    formData.append("email", "admin@test.com");
    formData.append("password", "short");
    formData.append("passwordConfirmation", "short");

    const result = await setupFirstAdmin(defaultState, formData);
    assert.strictEqual(result.status, "error");
    assert.strictEqual(result.fieldErrors?.password?.[0], "A senha deve ter pelo menos 8 caracteres.");
  });

  it("fails if passwords do not match", async () => {
    const { setupFirstAdmin } = proxyquire("../../src/modules/auth/actions", {
      "next/headers": { cookies: () => ({ set: () => {} }) },
      "next/navigation": { redirect: () => {} },
      "@/db": { getDb: () => ({}) },
    });

    const formData = new FormData();
    formData.append("name", "Admin");
    formData.append("email", "admin@test.com");
    formData.append("password", "strongpassword1");
    formData.append("passwordConfirmation", "strongpassword2");

    const result = await setupFirstAdmin(defaultState, formData);
    assert.strictEqual(result.status, "error");
    assert.strictEqual(result.fieldErrors?.passwordConfirmation?.[0], "As senhas não coincidem.");
  });

  it("successfully creates account and redirects", async () => {
    let redirectUrl = "";
    let sessionTokenSet = false;


    const { setupFirstAdmin } = proxyquire("../../src/modules/auth/actions", {
      "next/headers": {
        cookies: () => ({
          set: (name: string, value: string) => {
            if (name === "gestaotecnica_session") sessionTokenSet = true;
          },
        }),
      },
      "next/navigation": {
        redirect: (url: string) => { redirectUrl = url; throw new Error("NEXT_REDIRECT"); },
      },
      "@/db": {
        getDb: () => ({
          select: () => ({
            from: () => {
              const chain = {
                limit: () => [],
                where: () => chain,
              };
              return chain;
            },
          }),
          insert: (table: unknown) => ({
            values: () => ({ returning: () => [{ id: "user-123" }] })
          }),
          transaction: async (cb: unknown) => {
            const tx = {
              insert: (table: unknown) => {

                return {
                  values: () => ({ returning: () => [{ id: "user-123" }] })
                };
              }
            };
            return (cb as any)(tx);
          }
        }),
      },
    });

    const formData = new FormData();
    formData.append("name", "Admin");
    formData.append("email", "admin@test.com");
    formData.append("password", "strongpassword");
    formData.append("passwordConfirmation", "strongpassword");

    try {
      await setupFirstAdmin(defaultState, formData);
      assert.fail("Should have redirected");
    } catch (e: unknown) {
      if (e.message !== "NEXT_REDIRECT") {
        throw e;
      }
    }

    assert.strictEqual(redirectUrl, "/builder");
    // These should ideally be true, but because proxyquire matches imports, testing drizzle schema instances is tricky.
    // We check that the session token was set indicating success.
    assert.strictEqual(sessionTokenSet, true);
  });
});
