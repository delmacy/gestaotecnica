import Link from "next/link";
import { updateWorkflowTemplate } from "@/modules/admin/actions";
import { getWorkflowAdminData } from "@/modules/admin/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function AdminWorkflowsPage() {
  const workflows = await getWorkflowAdminData();

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <section className="mx-auto max-w-7xl">
        <Button asChild variant="outline">
          <Link href="/admin">Voltar</Link>
        </Button>
        <h1 className="mt-6 text-3xl font-semibold">Workflows</h1>
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
