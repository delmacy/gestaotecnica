import Link from "next/link";
import { createSlaPolicy, deleteQueueItem, recoverQueueItem, updateQueueItem } from "@/modules/queues/actions";
import { getRecoverableDrafts, getQueueAdminData } from "@/modules/queues/queries";
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

          {queues.length === 0 ? (
            <div className="mt-4 border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
              <p className="text-sm text-[#5b6655]">Nenhuma fila configurada neste workspace.</p>
            </div>
          ) : (
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
          )}

          <h2 className="mt-8 text-xl font-semibold">Gerenciar Itens</h2>
          {items.length === 0 ? (
            <div className="mt-3 border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
              <p className="text-sm text-[#5b6655]">Nenhum item na fila para este workspace.</p>
            </div>
          ) : (
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
                          <Button
                            type="submit"
                            variant="default"
                            size="sm"
                            className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                          >
                            Recuperar
                          </Button>
                        </form>
                        <form action={deleteQueueItem} className="inline">
                          <input type="hidden" name="id" value={item.id} />
                          <Button
                            type="submit"
                            variant="destructive"
                            size="sm"
                            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                          >
                            Descartar
                          </Button>
                        </form>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nova política SLA</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createSlaPolicy} className="space-y-3">
                <Input name="key" placeholder="sla_padrão" required />
                <Input name="label" placeholder="SLA Padrão" required />
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
                  placeholder="Resolução em minutos"
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
              <CardTitle>Políticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {policies.length === 0 ? (
                <p className="text-sm text-[#5b6655]">Nenhuma política configurada.</p>
              ) : (
                policies.map((policy: QueueAdminPolicy) => (
                  <div className="border p-3" key={policy.id}>
                    <p className="font-medium">{policy.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {policy.targetEntityType}: {policy.responseMinutes}/
                      {policy.resolutionMinutes} min
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Navegação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/search">Busca Global</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin">Administração</Link>
              </Button>
            </CardContent>
          </Card>

          <DraftRecoverySection />
        </aside>
      </section>
    </main>
  );
}

async function DraftRecoverySection() {
  const { drafts } = await getRecoverableDrafts();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rascunhos Recuperáveis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {drafts.length === 0 ? (
          <p className="text-sm text-[#5b6655]">
            Nenhum rascunho pendente neste workspace.
          </p>
        ) : (
          drafts.map((draft: { id: string; entityType: string; priority: string; queueLabel: string | null }) => (
            <form key={draft.id} action={recoverQueueItem} className="flex items-center justify-between border border-[#e0e5d9] bg-[#fbfcf8] p-3">
              <div>
                <p className="font-medium text-sm text-[#182017]">
                  {draft.entityType}
                </p>
                <p className="text-xs text-[#5b6655]">
                  {draft.queueLabel} | {draft.priority}
                </p>
              </div>
              <Button type="submit" variant="default" size="sm">
                <input type="hidden" name="id" value={draft.id} />
                Recuperar
              </Button>
            </form>
          ))
        )}
      </CardContent>
    </Card>
  );
}