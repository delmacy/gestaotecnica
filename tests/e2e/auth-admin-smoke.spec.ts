import { test, expect } from "@playwright/test";
import { getRuntimeDb } from "../../src/db/index";
import { authAccounts, authSessions, users } from "../../src/db/legacy/schema";
import { eq, inArray } from "drizzle-orm";
import { execSync } from "child_process";
import crypto from "crypto";

test.describe("Auth Admin Smoke Paths under Runtime Constraints", () => {
  const TEST_ID = crypto.randomUUID();
  const TEST_EMAIL = `admin-${TEST_ID}@smoke.test`;
  const TEST_PASS = crypto.randomUUID();

  // Use sequential mode because we need to safely create/teardown our specific test user
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    // Teardown any leftover test data
    const db = getRuntimeDb();
    const existingUsers = await db.select({ id: users.id }).from(users).where(eq(users.email, TEST_EMAIL));

    if (existingUsers.length > 0) {
      const userIds = existingUsers.map(u => u.id);
      await db.delete(authSessions).where(inArray(authSessions.userId, userIds));
      await db.delete(authAccounts).where(inArray(authAccounts.userId, userIds));
      await db.delete(users).where(inArray(users.id, userIds));
    }
  });

  test.afterAll(async () => {
    // Clean up our specific test data
    const db = getRuntimeDb();
    const testUsers = await db.select({ id: users.id }).from(users).where(eq(users.email, TEST_EMAIL));

    if (testUsers.length > 0) {
      const userIds = testUsers.map(u => u.id);
      await db.delete(authSessions).where(inArray(authSessions.userId, userIds));
      await db.delete(authAccounts).where(inArray(authAccounts.userId, userIds));
      await db.delete(users).where(inArray(users.id, userIds));
    }
  });

  test("can hit /auth/login, fail, then succeed using seeded auth", async ({ page, context }) => {
    // Clear cookies to simulate a fresh session
    await context.clearCookies();

    await page.goto("/auth/login");

    // Attempt invalid login first
    await page.fill('input[name="email"]', TEST_EMAIL);
    await page.fill('input[name="password"]', "WrongPass!");
    await page.click('button[type="submit"]:has-text("Entrar")');

    // We should see an error
    await expect(page.locator("text=Credenciais inválidas.")).toBeVisible();

    // Now seed the user via the admin script
    execSync('npx tsx src/scripts/ensure-platform-admin.ts', {
      env: { ...process.env, PLATFORM_ADMIN_EMAIL: TEST_EMAIL, PLATFORM_ADMIN_PASSWORD: TEST_PASS },
      stdio: 'inherit'
    });

    // Ensure the new user is applied by waiting or double-checking (script runs synchronously so it should be fine).
    // Now enter correct password. The email should still be populated, but let's re-fill to be safe.
    await page.fill('input[name="email"]', TEST_EMAIL);
    await page.fill('input[name="password"]', TEST_PASS);
    await page.click('button[type="submit"]:has-text("Entrar")');

    // Expected to redirect to builder
    await expect(page).toHaveURL(/\/builder/, { timeout: 10000 });

    // Make sure we landed safely in the authenticated area
    await expect(page.getByRole("heading", { name: "System Builder", exact: false }).first()).toBeVisible();
  });
});
