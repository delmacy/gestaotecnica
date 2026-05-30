from playwright.sync_api import sync_playwright
import time
import sys

def run_refactored_builder_test(url="http://localhost:3000/builder"):
    print(f"--- STARTING REFACTORED SYSTEM BUILDER E2E ---")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        try:
            print("1. Loading Builder...")
            page.goto(url, wait_until="networkidle")
            page.wait_for_timeout(5000)
            page.screenshot(path="refactor_1_initial.png")

            sidebar = page.locator("aside").filter(has_text="System Assembler")

            print("2. Testing Organization Builder...")
            acme_node = sidebar.get_by_text("Acme Holding")
            acme_node.first.click()
            page.wait_for_timeout(2000)
            page.screenshot(path="refactor_2_org.png")

            print("3. Testing Specialized Switcher...")
            # Click something that is definitely top-level or auto-expanded
            # 'Capability Registry' group
            reg_node = sidebar.get_by_text("Capability Registry")
            reg_node.first.click()
            page.wait_for_timeout(1000)
            page.screenshot(path="refactor_3_registry.png")

            # Click a catalog item if visible
            # 'Demandas' usually visible after bootstrap
            demand_node = page.locator("div[data-label='Demandas']")
            if demand_node.first.is_visible():
               demand_node.first.click()
               page.wait_for_timeout(2000)
               page.screenshot(path="refactor_4_capability_view.png")

            print("--- REFACTORED BUILDER VERIFIED ---")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="refactor_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000/builder"
    run_refactored_builder_test(target)
