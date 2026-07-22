import Link from "next/link";
import { getDb } from "@/db";
import { authAccounts } from "@/db/legacy/schema";
import { SetupForm } from "./SetupForm";
import { parseDatabaseError } from "@/modules/auth/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Setup - System Builder",
};

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  let hasAccount = false;
  let dbBlockerMessage: string | null = null;

  try {
    const db = getDb();
    const existingAccounts = await db.select({ id: authAccounts.id }).from(authAccounts).limit(1);
    hasAccount = existingAccounts.length > 0;
  } catch (err: unknown) {
    dbBlockerMessage = await parseDatabaseError(err) || `BLOCKER: Database connection failed. Contact support.`;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      {dbBlockerMessage ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Erro de Ambiente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded bg-destructive/15 p-3 text-sm text-destructive font-mono whitespace-pre-wrap">
              {dbBlockerMessage}
            </div>
          </CardContent>
        </Card>
      ) : hasAccount ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Configuração já concluída</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              O administrador da plataforma já foi configurado. Por motivos de segurança, este formulário de configuração inicial não está mais disponível.
            </p>
            <p className="text-sm text-muted-foreground">
              Caso precise recuperar o acesso, consulte o procedimento administrativo de recuperação seguro documentado em <code>docs/auth/PLATFORM_ADMIN_ACCESS.md</code>.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/login">Entrar</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <SetupForm />
      )}
    </main>
  );
}
