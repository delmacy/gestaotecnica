with open("src/app/admin/gateway/page.tsx", "r") as f:
    content = f.read()

content = content.replace('setError(res.error.message);', 'setError(res.error?.message ?? "An error occurred");')

with open("src/app/admin/gateway/page.tsx", "w") as f:
    f.write(content)
