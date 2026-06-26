"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ReportsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f6f7f4] p-6 text-center">
      <div className="max-w-md border border-[#d7dccf] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#111510]">Algo deu errado</h1>
        <p className="mt-4 text-sm leading-6 text-[#5b6655]">
          Nao foi possivel carregar a visao de relatorios. Tente novamente ou volte ao inicio.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-[10px] text-[#7a8474]">
            ID: {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="flex-1 bg-[#1f2a1c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#31402d]"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="flex-1 border border-[#c8d0bf] bg-white px-4 py-2 text-sm font-semibold text-[#273025] shadow-sm transition hover:bg-[#f1f3ed]"
          >
            Voltar ao inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
