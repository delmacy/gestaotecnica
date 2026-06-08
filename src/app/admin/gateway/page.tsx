'use client';

import React, { useEffect, useState } from 'react';
import { listAgentCandidatesAction } from '@/features/platform/gateway/agent-gateway.actions';

export default function AgentGatewayPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      const res = await listAgentCandidatesAction();
      if (res.ok) {
        setCandidates(res.data);
      } else {
        setError(res.error?.message ?? "An error occurred");
      }
      setIsLoading(false);
    }
    void load();
  }, []);

  return (
    <main className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Agent Gateway Control Plane</h1>
        <p className="mt-1 text-muted-foreground">
          Submissões recebidas de agentes externos como Process Candidates.
        </p>
        <div className="mt-4 p-4 border border-blue-200 bg-blue-50 text-blue-800 rounded-md text-sm">
          <strong>Aviso Técnico:</strong> A auditoria completa do gateway (Correlation IDs, falhas de payload, tentativas não autenticadas) será persistida em uma fase futura. Atualmente, apenas submissões bem-sucedidas são listadas aqui.
        </div>
      </header>

      {isLoading && <div className="text-muted-foreground">Carregando submissões...</div>}

      {error && (
        <div className="p-4 border border-destructive/30 bg-destructive/5 text-destructive rounded-md">
          {error}
        </div>
      )}

      {!isLoading && !error && candidates.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground bg-muted/10 border rounded-md border-dashed">
          Nenhuma submissão de agente encontrada.
        </div>
      )}

      {!isLoading && !error && candidates.length > 0 && (
        <div className="border rounded-md overflow-hidden bg-card">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Nome do Candidato</th>
                <th className="px-4 py-3 font-medium">Workspace ID</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Data de Recebimento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {candidates.map(candidate => (
                <tr key={candidate.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{candidate.name}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{candidate.workspaceId}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-semibold">
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(candidate.createdAt).toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
