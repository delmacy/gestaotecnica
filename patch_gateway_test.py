with open("tests/e2e/gateway.spec.ts", "r") as f:
    content = f.read()

content = "import { allowAuthenticatedArea } from './auth-helper';\n" + content
content = content.replace("await page.goto('/admin/gateway');", "await allowAuthenticatedArea(page);\n    await page.goto('/admin/gateway');")

with open("tests/e2e/gateway.spec.ts", "w") as f:
    f.write(content)
