with open('src/modules/auth/actions.ts', 'r') as f:
    content = f.read()

content = content.replace('async (tx) => {', 'async (tx: any) => {')

with open('src/modules/auth/actions.ts', 'w') as f:
    f.write(content)
