import { setupFirstAdmin } from "@/modules/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SetupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Primeiro administrador</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={setupFirstAdmin} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Nome</span>
              <Input className="mt-1" name="name" required />
            </label>
            <label className="block">
              <span className="text-sm font-medium">E-mail</span>
              <Input className="mt-1" name="email" required type="email" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Senha</span>
              <Input className="mt-1" name="password" required type="password" />
            </label>
            <Button className="w-full" type="submit">
              Criar administrador
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
