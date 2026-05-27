import Link from "next/link";
import { createSlaPolicy } from "@/modules/queues/actions";
import { getQueueAdminData } from "@/modules/queues/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function AdminQueuesPage() {
  const { items, openItems, policies, queues } = await getQueueAdminData();

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <Button asChild variant="outline">
            <Link href="/admin">Voltar</Link>
          </Button>
          <h1 className="mt-6 text-3xl font-semibold">Filas e SLA</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Itens abertos: {openItems}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {queues.map((queue) => (
              <Card key={queue.id}>
                <CardContent className="p-4">
                  <p className="font-medium">{queue.label}</p>
                  <p className="text-sm text-muted-foreground">{queue.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="mt-8 text-xl font-semibold">Itens recentes</h2>
          <div className="mt-3 space-y-3">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <p className="font-medium">{item.queueLabel}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.entityType} - {item.entityId}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nova politica SLA</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createSlaPolicy} className="space-y-3">
                <Input name="key" placeholder="sla_padrao" required />
                <Input name="label" placeholder="SLA Padrao" required />
                <Input
                  name="targetEntityType"
                  placeholder="work_item"
                  required
                />
                <Input
                  name="responseMinutes"
                  placeholder="Resposta em minutos"
                  type="number"
                />
                <Input
                  name="resolutionMinutes"
                  placeholder="Resolucao em minutos"
                  type="number"
                />
                <Button className="w-full" type="submit">
                  Salvar SLA
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Politicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {policies.map((policy) => (
                <div className="border p-3" key={policy.id}>
                  <p className="font-medium">{policy.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {policy.targetEntityType}: {policy.responseMinutes}/
                    {policy.resolutionMinutes} min
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}
