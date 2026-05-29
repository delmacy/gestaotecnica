import Link from "next/link";
import { createAdminUser } from "@/modules/admin/actions";
import { getAdminUsers } from "@/modules/admin/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <Button asChild variant="outline">
            <Link href="/admin">Voltar</Link>
          </Button>
          <h1 className="mt-6 text-3xl font-semibold">Usuarios</h1>
          <div className="mt-4 space-y-3">
            {users.map((user: any) => (
              <Card key={user.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {user.hasAuth ? "Com login" : "Sem login"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Novo usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createAdminUser} className="space-y-4">
              <Input name="name" placeholder="Nome" required />
              <Input name="email" placeholder="E-mail" required type="email" />
              <Input name="password" placeholder="Senha opcional" type="password" />
              <Button className="w-full" type="submit">
                Salvar usuario
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
