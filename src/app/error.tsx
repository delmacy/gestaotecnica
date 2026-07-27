"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log do digest sanitizado (não vazando a stack completa em produção para a UI de forma crua,
    // mas enviando digest seguro para log aggregator se houver).
    // Observação de segurança: Nunca faça log(error) no client sem sanitizar se contiver stack sensível de dev,
    // Next.js fornece o 'digest' no mode production.
    if (error.digest) {
        console.error("Platform Error Digest:", error.digest);
    }
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center max-w-md text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <h2 className="text-2xl font-bold tracking-tight">Temporary Disruption</h2>
        <p className="text-muted-foreground">
          Please try again later or contact support.
          {error.digest && (
            <span className="block mt-2 text-xs opacity-50">
              Referência do Erro: {error.digest}
            </span>
          )}
        </p>
        <button
          onClick={() => reset()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md shadow hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
