import type { Page } from "@playwright/test";

export async function allowAuthenticatedArea(page: Page) {
  await page.context().addCookies([
    {
      name: "gestaotecnica_session",
      value: "e2e-authenticated-shell",
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
}
