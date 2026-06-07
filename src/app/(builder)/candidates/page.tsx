'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CandidateDetail } from '@/components/builder/candidates/CandidateDetail';
import { CandidateList } from '@/components/builder/candidates/CandidateList';
import { filterProcessCandidates, findSelectedProcessCandidate } from '@/features/builder/candidates/candidate-filter';
import { getCandidatesAction } from '@/features/builder/candidates/candidates.actions';
import { TEMPORARY_CANDIDATES_WORKSPACE_ID } from '@/features/builder/candidates/constants';
import type { CandidateStatus, ProcessCandidate } from '@/features/builder/candidates/candidate.types';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<ProcessCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'all'>('all');

  const fetchCandidates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getCandidatesAction({ workspaceId: TEMPORARY_CANDIDATES_WORKSPACE_ID });
      if (response.ok) {
        setCandidates(response.data);
      } else {
        setError(response.error.message);
      }
    } catch {
      setError('Erro ao carregar candidatos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchCandidates);
  }, [fetchCandidates]);

  const filteredCandidates = useMemo(
    () => filterProcessCandidates(candidates, { searchTerm, status: statusFilter }),
    [candidates, searchTerm, statusFilter]
  );
  const selectedCandidate = findSelectedProcessCandidate(filteredCandidates, selectedId);

  return (
    <main className="flex h-[calc(100vh-4rem)] flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Process Candidates</h1>
        <p className="mt-1 text-muted-foreground">
          Gestão de propostas de processos organizacionais manuais ou sugeridos por agentes.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-4">
        <Input
          aria-label="Buscar candidatos"
          placeholder="Buscar candidatos..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="max-w-sm"
        />
        <select
          aria-label="Filtrar candidatos por status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as CandidateStatus | 'all')}
          className="flex h-10 w-full max-w-[220px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="all">Todos os status</option>
          <option value="draft">Rascunho</option>
          <option value="under_analysis">Em análise</option>
          <option value="waiting_review">Aguardando revisão</option>
          <option value="approved">Aprovado</option>
          <option value="rejected">Rejeitado</option>
          <option value="published">Publicado</option>
        </select>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-3">
        <section aria-label="Lista de candidatos" className="relative flex min-h-0 flex-col overflow-hidden lg:col-span-2">
          {isLoading && (
            <div role="status" className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
              <span className="text-muted-foreground">Carregando candidatos...</span>
            </div>
          )}

          {error ? (
            <div role="alert" className="flex h-full flex-col items-center justify-center gap-3 border border-destructive/30 bg-destructive/5 p-6 text-center">
              <p className="text-sm font-medium text-destructive">{error}</p>
              <Button type="button" variant="outline" size="sm" onClick={() => void fetchCandidates()}>
                Tentar novamente
              </Button>
            </div>
          ) : (
            <CandidateList candidates={filteredCandidates} selectedId={selectedId} onSelect={setSelectedId} />
          )}
        </section>

        <aside aria-label="Detalhes do candidato" className="min-h-0 overflow-hidden">
          <CandidateDetail candidate={selectedCandidate} />
        </aside>
      </div>
    </main>
  );
}
