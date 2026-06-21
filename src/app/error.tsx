"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="size-6" />
          </div>
          <CardTitle className="text-2xl">Erro inesperado</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          <p>
            Ocorreu um problema ao tentar carregar esta página. Nossa equipe já
            foi notificada (caso seja um erro do sistema).
          </p>
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 rounded-md bg-secondary/50 p-3 text-left font-mono text-xs text-secondary-foreground overflow-auto max-h-32">
              <p className="font-semibold">{error.name}</p>
              <p>{error.message}</p>
              {error.digest && <p className="mt-2 text-muted-foreground">Digest: {error.digest}</p>}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()} variant="outline" className="w-full sm:w-auto gap-2">
            <RefreshCw className="size-4" />
            Tentar novamente
          </Button>
          <Button asChild className="w-full sm:w-auto gap-2">
            <Link href="/">
              <Home className="size-4" />
              Ir para o Início
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
