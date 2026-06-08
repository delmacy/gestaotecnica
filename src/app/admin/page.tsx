import Link from "next/link";
import { logout } from "@/modules/auth/actions";
import { getCurrentUser } from "@/modules/auth/session";
import { getAdminSummary } from "@/modules/admin/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const links = [
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/organizations", label: "Organizações" },
  { href: "/admin/workspaces", label: "Workspace ativo" },
  { href: "/admin/workflows", label: "Workflows" },
  { href: "/admin/permissions", label: "Permissoes" },
  { href: "/admin/queues", label: "Filas/SLA" },
  { href: "/workspace-config", label: "Catalogos" },
];

export default async function AdminPage() {
  const [user, summary] = await Promise.all([getCurrentUser(), getAdminSummary()]);

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Administracao</p>
            <h1 className="text-4xl font-semibold">Painel admin</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sessao: {user?.name ?? "Usuario autenticado"}
            </p>
          </div>
          <form action={logout}>
            <Button type="submit" variant="outline">
              Sair
            </Button>
          </form>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {summary.map((item: any) => (
            <Card key={item.label}>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {links.map((link: any) => (
            <Button asChild key={link.href} variant="outline">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>
      </section>
    </main>
  );
}
