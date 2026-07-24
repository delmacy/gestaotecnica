import { test, expect } from "@playwright/test";
import { getRuntimeDb } from "../../../src/db/index";
import { authAccounts, authSessions, users } from "../../../src/db/legacy/schema";
import { eq, inArray } from "drizzle-orm";
import { hashPassword, hashSessionToken } from "../../../src/modules/auth/crypto";
import crypto from "crypto";
import { allowAuthenticatedArea } from "../auth-helper";

test.describe("Platform vs Workspace Scope Clarity", () => {
  test.setTimeout(30000);
  const TEST_ID = crypto.randomUUID();
  const TEST_EMAIL = `admin-${TEST_ID}@scope.test`;
  const TEST_PASS = crypto.randomUUID();
  const SESSION_TOKEN = `e2e-authenticated-shell-admin-${TEST_ID}`;

  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    const db = getRuntimeDb();
    const existingUsers = await db.select({ id: users.id }).from(users).where(eq(users.email, TEST_EMAIL));

    if (existingUsers.length > 0) {
      const userIds = existingUsers.map((u: { id: string }) => u.id);
      await db.delete(authSessions).where(inArray(authSessions.userId, userIds));
      await db.delete(authAccounts).where(inArray(authAccounts.userId, userIds));
      await db.delete(users).where(inArray(users.id, userIds));
    }
  });

  test.afterAll(async () => {
    const db = getRuntimeDb();
    const testUsers = await db.select({ id: users.id }).from(users).where(eq(users.email, TEST_EMAIL));

    if (testUsers.length > 0) {
      const userIds = testUsers.map((u: { id: string }) => u.id);
      await db.delete(authSessions).where(inArray(authSessions.userId, userIds));
      await db.delete(authAccounts).where(inArray(authAccounts.userId, userIds));
      await db.delete(users).where(inArray(users.id, userIds));
    }
  });

  test.beforeEach(async ({ context }) => {
    // Seed real user
    const db = getRuntimeDb();

    // Check if already seeded to avoid unique constraint errors during serial
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, TEST_EMAIL));
    let userId;

    if (existing.length === 0) {
        const [user] = await db
          .insert(users)
          .values({
            name: "Scope Test Admin",
            email: TEST_EMAIL,
            status: "active",
            accessProfile: "builder",
          })
          .returning({ id: users.id });
        userId = user.id;

        const { hash, salt } = hashPassword(TEST_PASS);

        await db.insert(authAccounts).values({
          userId: userId,
          passwordHash: hash,
          passwordSalt: salt,
          isActive: true,
        });

        // Insert session directly for the cookie
        const tokenHash = hashSessionToken(SESSION_TOKEN);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1);

        await db.insert(authSessions).values({
            id: crypto.randomUUID(),
            userId: userId,
            tokenHash: tokenHash,
            expiresAt: expiresAt,
        });
    }

    await context.addCookies([
      {
        name: "gestaotecnica_session",
        value: SESSION_TOKEN,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
      },
    ]);
  });


  test("E2E Path Verification: User can switch between /builder and /admin and UI updates context", async ({ page }) => {
    // Go to workspace builder
    await page.goto("/builder");
    // Ensure we await navigation completely
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Workspace").first()).toBeVisible();

    const breadcrumbNav = page.locator("nav").filter({ hasText: "Builder" }).first();
    await expect(breadcrumbNav).toBeVisible();

    // Go to platform admin
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");
    // Verify Platform Admin layout is distinct
    await expect(page.getByText("Painel admin", { exact: false }).first()).toBeVisible();
  });

  test("Responsive Validation: Sidebar collapses appropriately on mobile in Admin", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    const desktopAdminSidebar = page.locator("aside").first();
    await expect(desktopAdminSidebar).not.toBeVisible();

    const mobileHamburger = page.locator(".lg\\:hidden").nth(1);
    await expect(mobileHamburger).not.toBeVisible();
  });
});
