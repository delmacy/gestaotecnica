import Link from "next/link";
import { toggleWorkspaceModule } from "@/modules/admin/actions";
import { getWorkspaceAdminData } from "@/modules/admin/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminWorkspacesPage() {
  const { modules, workspace } = await getWorkspaceAdminData();

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <section className="mx-auto max-w-7xl">
        <Button asChild variant="outline">
          <Link href="/admin">Voltar</Link>
        </Button>
        <h1 className="mt-6 text-3xl font-semibold">{workspace.name}</h1>
        <div className="mt-4 space-y-3">
          {modules.map((module: any) => (
            <Card key={module.id}>
              <CardContent className="p-4">
                <form
                  action={toggleWorkspaceModule}
                  className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <input name="id" type="hidden" value={module.id} />
                  <div>
                    <p className="font-medium">{module.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      defaultChecked={module.isEnabled}
                      name="isEnabled"
                      type="checkbox"
                    />
                    Habilitado
                  </label>
                  <Button type="submit" variant="outline">
                    Salvar
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
