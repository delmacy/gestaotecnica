import { test, expect } from "@playwright/test";
import { allowAuthenticatedArea } from "./auth-helper";

test.describe("UX-NAV-01-038: Empty and unavailable state taxonomy - Frontend experience", () => {

  test.beforeEach(async ({ page }) => {
    await allowAuthenticatedArea(page);
  });

  test("Renders synthetic mode alert correctly", async ({ page }) => {
    // Intercept the API call to mock a synthetic state
    await page.route("**/api/builder/capabilities", async (route) => {
      const json = {
        state: "synthetic",
        capabilities: [
          {
            id: "cap-1",
            slug: "test-capability",
            name: "Test Capability",
            category: "commercial",
            description: "A test capability",
            core_business: true,
            mvp_priority: "critical",
            status: "documented",
            depends_on: [],
            used_by: [],
            owns_entities: [],
            does_not_own: [],
            main_processes: [],
            main_events: [],
            related_docs: [],
            boundary_risk: [],
            install_state: "available",
            synthetic_notes: ""
          }
        ],
        viewStateOutcome: {
          state: "synthetic",
          title: "Explore registry",
          description: "You are exploring the Demo environment. Changes made here will not affect your production workspace.",
          isActionAllowed: false
        }
      };
      await route.fulfill({ json });
    });

    await page.goto("/builder/capabilities");

    // Verify the synthetic alert is visible
    await expect(page.getByText("Explore registry")).toBeVisible();
    await expect(page.getByText("You are exploring the Demo environment.")).toBeVisible();

    // Verify capabilities list is still rendered
    await expect(page.getByText("Test Capability", { exact: true })).toBeVisible();
  });

  test("Renders blocked state correctly", async ({ page }) => {
    // Intercept the API call to mock a blocked state
    await page.route("**/api/builder/capabilities", async (route) => {
      const json = {
        state: "blocked",
        capabilities: [],
        viewStateOutcome: {
          state: "blocked",
          title: "Module Unavailable",
          description: "This configuration requires additional privileges or is not enabled for your workspace. Contact your administrator to request access.",
          isActionAllowed: false
        }
      };
      await route.fulfill({ json });
    });

    await page.goto("/builder/capabilities");

    // Verify the empty state with blocked info is visible
    await expect(page.getByText("Module Unavailable")).toBeVisible();
    await expect(page.getByText("This configuration requires additional privileges")).toBeVisible();

    // Verify CTA is present and points to dashboard
    const backButton = page.getByRole("link", { name: "Back to Dashboard" });
    await expect(backButton).toBeVisible();
    await expect(backButton).toHaveAttribute("href", "/builder");
  });

  test("Renders empty state correctly with primary action", async ({ page }) => {
    // Intercept the API call to mock an empty state
    await page.route("**/api/builder/capabilities", async (route) => {
      const json = {
        state: "empty",
        capabilities: [],
        viewStateOutcome: {
          state: "empty",
          title: "Define Capabilities",
          description: "Streamline your operations. Define your first business capability.",
          primaryActionLabel: "Create Capability",
          primaryActionHref: "/builder/capabilities/new",
          isActionAllowed: true
        }
      };
      await route.fulfill({ json });
    });

    await page.goto("/builder/capabilities");

    // Verify the empty state with CTA is visible
    await expect(page.getByText("Define Capabilities")).toBeVisible();
    await expect(page.getByText("Streamline your operations. Define your first business capability.")).toBeVisible();

    // Verify primary action CTA is present and points to the correct href
    const createButton = page.getByRole("link", { name: "Create Capability" });
    await expect(createButton).toBeVisible();
    await expect(createButton).toHaveAttribute("href", "/builder/capabilities/new");
  });
});
