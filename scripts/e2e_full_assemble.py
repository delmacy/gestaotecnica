from playwright.sync_api import sync_playwright
import time
import sys

def run_assemble_journey(url="http://localhost:3000/builder"):
    print(f"--- STARTING SYSTEM ASSEMBLE JOURNEY ---")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        try:
            print("1. Loading Assembler...")
            page.goto(url, wait_until="networkidle")
            page.wait_for_timeout(5000)
            page.screenshot(path="assemble_1_initial.png")

            sidebar = page.locator("aside").filter(has_text="System Assembler")

            # 1. Select Existing Org to show Organization Builder
            print("2. Verifying Organization context...")
            sidebar.get_by_text("Acme Holding").first.click()
            page.wait_for_timeout(2000)
            page.screenshot(path="assemble_2_org.png")

            # 2. Add node
            print("3. Composing Generic Component...")
            page.get_by_role("button", name="+ New Organization").click()
            page.wait_for_timeout(3000)
            page.get_by_text("Nova Organização").first.click()
            page.wait_for_timeout(2000)
            page.screenshot(path="assemble_3_new_org.png")

            # 3. Publish
            print("4. Publishing Assembly...")
            page.get_by_test_id("btn-publish-workspace").click()
            page.wait_for_timeout(3000)
            page.screenshot(path="assemble_4_published.png")

            print("--- JOURNEY COMPLETED ---")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="assemble_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000/builder"
    run_assemble_journey(target)
