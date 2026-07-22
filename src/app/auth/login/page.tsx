import Link from "next/link";
import { runAuthDiagnostics } from "@/modules/auth/diagnostics";
import { LoginForm } from "./LoginForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Login - System Builder",
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const diagnostics = await runAuthDiagnostics();

  const isBlocked =
    !diagnostics.hasDbUrl ||
    !diagnostics.canConnect ||
    diagnostics.missingSchemas.length > 0 ||
    (!diagnostics.isSynthetic && (diagnostics.isSuperuser || diagnostics.hasCreatePrivilege));

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-4">
        {/* Environment Badge */}
        <div className="flex justify-center">
          {diagnostics.isSynthetic ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Ambiente de Demonstração (Dados Sintéticos)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Ambiente Operacional Real (Dados Reais)
            </span>
          )}
        </div>

        {isBlocked ? (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 text-destructive">
                <ShieldAlert className="h-5 w-5" />
                <CardTitle className="text-xl">Bloqueio de Inicialização</CardTitle>
              </div>
              <CardDescription>
                Detectamos problemas de configuração do banco de dados que impedem a operação segura da plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-destructive/20 bg-background p-4 space-y-3 text-sm">
                {!diagnostics.hasDbUrl && (
                  <div>
                    <h4 className="font-semibold text-destructive">Variável de ambiente ausente</h4>
                    <p className="text-muted-foreground mt-1">
                      A variável <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">RUNTIME_DATABASE_URL</code> ou <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">DATABASE_URL</code> não está configurada no ambiente.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <strong>Ação:</strong> Configure as variáveis no arquivo <code className="text-xs font-semibold font-mono">.env</code> ou nas variáveis de ambiente.
                    </p>
                  </div>
                )}

                {diagnostics.hasDbUrl && !diagnostics.canConnect && (
                  <div>
                    <h4 className="font-semibold text-destructive">Falha de Conexão com o Banco</h4>
                    <p className="text-muted-foreground mt-1">
                      Não foi possível estabelecer conexão com o banco de dados configurado.
                    </p>
                    {diagnostics.errorMessage && (
                      <pre className="mt-1 max-h-24 overflow-y-auto rounded bg-muted p-2 text-[10px] text-muted-foreground font-mono leading-tight whitespace-pre-wrap">
                        {diagnostics.errorMessage}
                      </pre>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Ação:</strong> Verifique se o servidor PostgreSQL está ativo e aceitando conexões no host especificado.
                    </p>
                  </div>
                )}

                {diagnostics.canConnect && diagnostics.missingSchemas.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-destructive">Estrutura ou esquemas ausentes</h4>
                    <p className="text-muted-foreground mt-1">
                      Esquemas obrigatórios não foram encontrados no banco de dados atual: <code className="bg-muted px-1 py-0.5 rounded text-xs text-destructive font-mono">{diagnostics.missingSchemas.join(", ")}</code>.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Ação:</strong> Execute as migrações e scripts de inicialização usando o comando <code className="text-xs font-semibold font-mono">npm run bootstrap</code> ou <code className="text-xs font-semibold font-mono">npm run db:migrate</code>.
                    </p>
                  </div>
                )}

                {diagnostics.canConnect && !diagnostics.isSynthetic && diagnostics.isSuperuser && (
                  <div>
                    <h4 className="font-semibold text-destructive">Uso de Superusuário em Runtime Detectado</h4>
                    <p className="text-muted-foreground mt-1">
                      O usuário do banco de dados configurado possui privilégios de superusuário (<code className="bg-muted px-1 py-0.5 rounded text-xs text-destructive font-mono">superuser</code>).
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Ação:</strong> Utilize uma credencial com privilégios limitados (ex: <code className="text-xs font-semibold font-mono">app_runtime</code>) para as operações em runtime, aderindo ao princípio do menor privilégio.
                    </p>
                  </div>
                )}

                {diagnostics.canConnect && !diagnostics.isSynthetic && diagnostics.hasCreatePrivilege && (
                  <div>
                    <h4 className="font-semibold text-destructive">Privilégios de Criação (CREATE) Excessivos</h4>
                    <p className="text-muted-foreground mt-1">
                      O usuário possui privilégios CREATE nos esquemas da aplicação: <code className="bg-muted px-1 py-0.5 rounded text-xs text-destructive font-mono">{diagnostics.violatedSchemas.join(", ")}</code>.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Ação:</strong> Revogue privilégios CREATE no banco de dados para a credencial de runtime e use um usuário específico de migração (<code className="text-xs font-semibold font-mono">owner_migration</code>) apenas para alterações estruturais.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button asChild className="w-full" variant="outline">
                  <Link href="/auth/setup">Tentar Configuração</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Entrar</CardTitle>
              <CardDescription>
                Acesso Builder, Admin da Organização ou Operador
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <LoginForm />
              <Button asChild className="w-full" variant="outline">
                <Link href="/auth/setup">Primeiro acesso / Configuração</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
