import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default async function BlockedPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const role = (await searchParams).role || "Premium";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="text-center max-w-md border rounded-xl p-10 bg-card shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 mb-6">
           <Lock className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-semibold mb-3">Plano Superior Necessário</h1>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          O acesso a esta área de gestão avançada da plataforma não está incluído no seu plano atual. Você precisa de um licenciamento {role} para continuar.
        </p>
        <div className="flex flex-col gap-3">
          <Button>Falar com Especialista</Button>
          <Button variant="outline" asChild>
            <Link href="/">Retornar ao Command Center</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
