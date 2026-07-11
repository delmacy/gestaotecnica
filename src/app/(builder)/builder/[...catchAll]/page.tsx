import React from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function BuilderNotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-muted/30 p-6 rounded-full mb-6">
        <AlertCircle className="w-12 h-12 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Seção não encontrada</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        A seção do Builder que você está procurando não existe ou ainda não foi implementada nesta versão da plataforma.
      </p>
      <Link
        href="/builder"
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
      >
        Voltar para o Dashboard
      </Link>
    </div>
  );
}
