with open('tests/unit/auth-setup.test.ts', 'r') as f:
    content = f.read()

# Fix proxyquire setupFirstAdmin binding
content = content.replace('const { } = proxyquire', 'const { setupFirstAdmin } = proxyquire')
content = content.replace('cb(tx)', '(cb as any)(tx)')

with open('tests/unit/auth-setup.test.ts', 'w') as f:
    f.write(content)
