import Link from "next/link";
import { createSlaPolicy, deleteQueueItem, updateQueueItem } from "@/modules/queues/actions";
import { getQueueAdminData } from "@/modules/queues/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

type QueueAdminItem = {
  id: string;
  entityType: string;
  entityId: string;
  status: string;
  priority: string;
  dueAt: Date | null;
  createdAt: Date;
  queueLabel: string;
  assigneeName: string | null;
};

type QueueAdminQueue = {
  id: string;
  label: string;
  description: string | null;
};

type QueueAdminPolicy = {
  id: string;
  label: string;
  targetEntityType: string;
  responseMinutes: number;
  resolutionMinutes: number;
};

export default async function AdminQueuesPage() {
  const { items, openItems, policies, queues } = await getQueueAdminData();

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/admin">Voltar</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/search">Busca</Link>
            </Button>
          </div>
          <h1 className="mt-6 text-3xl font-semibold">Filas e SLA</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Itens abertos: {openItems}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {queues.map((queue: QueueAdminQueue) => (
              <Card key={queue.id}>
                <CardContent className="p-4">
                  <p className="font-medium">{queue.label}</p>
                  <p className="text-sm text-muted-foreground">{queue.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="mt-8 text-xl font-semibold">Gerenciar Itens</h2>
          <div className="mt-3 space-y-3">
            {items.map((item: QueueAdminItem) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.queueLabel}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.entityType} - {item.entityId}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <form action={updateQueueItem} className="inline">
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="status" value="open" />
                        <button
                          type="submit"
                          className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                        >
                          Recuperar
                        </button>
                      </form>
                      <form action={deleteQueueItem} className="inline">
                        <input type="hidden" name="id" value={item.id} />
                        <button
                          type="submit"
                          className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                        >
                          Descartar
                        </button>
                      </form>
                    </div>
                  </div>
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
              {policies.map((policy: QueueAdminPolicy) => (
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