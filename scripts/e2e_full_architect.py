from playwright.sync_api import sync_playwright
import time
import os
import sys

def run_full_architect_journey(url="http://localhost:3000/builder"):
    print(f"--- STARTING FULL ARCHITECT JOURNEY ---")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        try:
            # 1. Load Builder Directly
            print("1. Loading platform builder...")
            page.goto(url, wait_until="networkidle")
            page.wait_for_timeout(5000)
            page.screenshot(path="e2e_0_builder_home.png")

            # 2. Add New Organization
            print("2. Adding new organization...")
            page.get_by_role("button", name="+ New Organization").click()
            page.wait_for_timeout(3000)
            page.screenshot(path="e2e_1_new_org.png")

            # 3. Rename Organization
            print("3. Renaming organization...")
            # Target the new component to select it
            page.get_by_text("Novo Componente").first.click()
            page.wait_for_timeout(2000)

            # Use specific selector for Inspector input
            inspector_input = page.locator("aside").filter(has_text="Inspector").locator("input").first
            inspector_input.click()
            inspector_input.fill("Global Industries")
            inspector_input.press("Enter")
            page.wait_for_timeout(2000)
            page.screenshot(path="e2e_2_renamed_org.png")

            # 4. Activate Capability from Catalog
            print("4. Activating capability from catalog...")
            # Find and expand Catálogo if needed
            catalog_header = page.get_by_text("Catálogo de Capacidades")
            catalog_header.scroll_into_view_if_needed()

            # Look for catalog items. They are level 1 children of 'catalog' group.
            # We can use the data-label and look for items inside the catalog area.
            # For simplicity, let's try to find an item that is definitely in the catalog.
            # Using data-testid for catalog_item might be better.

            # Let's try to click a catalog item by text, but ensuring it's not the one in 'Active Capacities'
            # 'Ordens de Serviço' usually isn't in the mock active set
            os_item = page.locator("div[data-label='Ordens de Serviço']")
            if not os_item.is_visible():
               # Expand catalog group
               catalog_header.click()
               page.wait_for_timeout(1000)

            os_item.first.click()
            page.wait_for_timeout(1000)

            # Handle activation dialog
            page.on("dialog", lambda dialog: dialog.accept())

            activate_btn = page.get_by_test_id("btn-activate-capability")
            if activate_btn.is_visible():
                activate_btn.click()
                print("Activated capability.")
            else:
                print("Activation button not found!")

            page.wait_for_timeout(3000)
            page.screenshot(path="e2e_3_activated_capability.png")

            # 5. Composition: Add Node to Canvas
            print("5. Composing organizational flow...")
            # Select something to activate canvas
            page.get_by_text("Global Industries").first.click()
            page.wait_for_timeout(2000)

            page.get_by_test_id("btn-add-state").click()
            page.wait_for_timeout(1000)
            page.get_by_test_id("btn-add-action").click()
            page.wait_for_timeout(1000)
            page.screenshot(path="e2e_4_canvas_composition.png")

            # 6. Persist to Registry
            print("6. Saving to Registry...")
            page.get_by_test_id("btn-save-architecture").click()
            page.wait_for_timeout(3000)
            page.screenshot(path="e2e_5_registry_persisted.png")

            # 7. Apply Changes
            print("7. Applying changes to environment...")
            page.get_by_test_id("btn-apply-changes").click()
            page.wait_for_timeout(2000)
            page.screenshot(path="e2e_6_final_state.png")

            print("--- JOURNEY COMPLETED SUCCESSFULLY ---")

        except Exception as e:
            print(f"Error during journey: {e}")
            page.screenshot(path="e2e_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000/builder"
    run_full_architect_journey(target)
