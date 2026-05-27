import Link from "next/link";
import { updateWorkflowTemplate } from "@/modules/admin/actions";
import { getWorkflowAdminData } from "@/modules/admin/queries";
import { getWorkflowInstances } from "@/modules/workflow-engine/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null) {
  if (!date) return "Em andamento";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminWorkflowsPage() {
  const [workflows, instances] = await Promise.all([
    getWorkflowAdminData(),
    getWorkflowInstances(),
  ]);

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <section className="mx-auto max-w-7xl">
        <Button asChild variant="outline">
          <Link href="/admin">Voltar</Link>
        </Button>
        <h1 className="mt-6 text-3xl font-semibold">Workflows</h1>
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Instancias recentes</h2>
          <div className="mt-3 space-y-3">
            {instances.length === 0 ? (
              <Card>
                <CardContent className="p-4 text-sm text-muted-foreground">
                  Nenhuma instancia iniciada.
                </CardContent>
              </Card>
            ) : (
              instances.map((instance) => (
                <Card key={instance.id}>
                  <CardContent className="grid gap-2 p-4 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <p className="font-medium">{instance.templateLabel}</p>
                      <p className="text-sm text-muted-foreground">
                        {instance.targetType} | {instance.currentState} | {instance.status}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Iniciado em {formatDate(instance.startedAt)}
                      </p>
                    </div>
                    <Button asChild variant="outline">
                      <Link href={`/${instance.targetType.replace("_", "-")}s/${instance.targetId}`}>
                        Abrir registro
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        <h2 className="mt-8 text-xl font-semibold">Templates</h2>
        <div className="mt-4 space-y-3">
          {workflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardContent className="p-4">
                <form action={updateWorkflowTemplate} className="grid gap-3">
                  <input name="id" type="hidden" value={workflow.id} />
                  <Input defaultValue={workflow.label} name="label" required />
                  <Input
                    defaultValue={
                      Array.isArray(workflow.states)
                        ? workflow.states.join(", ")
                        : ""
                    }
                    name="states"
                    required
                  />
                  <Button className="w-fit" type="submit" variant="outline">
                    Salvar workflow
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
