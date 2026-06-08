with open("src/components/layout/AppShell.tsx", "r") as f:
    content = f.read()

content = content.replace('{ href: "/admin", label: "Admin", description: "Controles da plataforma", icon: ShieldCheck },', '{ href: "/admin", label: "Admin", description: "Controles da plataforma", icon: ShieldCheck },\n      { href: "/admin/gateway", label: "Agent Gateway", description: "Auditoria de agentes", icon: ShieldCheck },')

with open("src/components/layout/AppShell.tsx", "w") as f:
    f.write(content)
