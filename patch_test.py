with open('tests/unit/auth-setup.test.ts', 'r') as f:
    content = f.read()

# Fix linting errors in auth-setup.test.ts
content = content.replace('import { randomUUID } from "node:crypto";', '')
content = content.replace('const { setupFirstAdmin } = proxyquire', 'const { } = proxyquire')
content = content.replace('let userInserted = false;\n    let accountInserted = false;', '')
content = content.replace('if (table.sym?.name === \'users\') userInserted = true;\n                if (table.sym?.name === \'auth_accounts\') accountInserted = true;', '')
content = content.replace('any', 'unknown')

with open('tests/unit/auth-setup.test.ts', 'w') as f:
    f.write(content)
