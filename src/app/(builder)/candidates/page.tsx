'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ProcessCandidate, CandidateStatus } from '@/features/builder/candidates/candidate.types';
import { CandidateList } from '@/components/builder/candidates/CandidateList';
import { CandidateDetail } from '@/components/builder/candidates/CandidateDetail';
import { Input } from '@/components/ui/input';
import { getCandidatesAction } from '@/features/builder/candidates/candidates.actions';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<ProcessCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'all'>('all');

  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const response = await getCandidatesAction({ workspaceId: "00000000-0000-0000-0000-000000000000" });
        if (response.ok) {
          setCandidates(response.data);
        } else {
          setError(response.error.message);
        }
      } catch {
        setError("Erro ao carregar candidatos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const selectedCandidate = candidates.find(c => c.id === selectedId) || null;

  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (candidate.description && candidate.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [candidates, searchTerm, statusFilter]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-6 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-6 gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Process Candidates</h1>
          <p className="text-muted-foreground mt-1">
            Gestão de propostas de processos organizacionais (manuais ou sugeridos por agentes).
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Buscar candidatos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as CandidateStatus | 'all')}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-[200px]"
        >
          <option value="all">Todos os Status</option>
          <option value="draft">Rascunho</option>
          <option value="under_analysis">Em Análise</option>
          <option value="waiting_review">Aguardando Revisão</option>
          <option value="approved">Aprovado</option>
          <option value="rejected">Rejeitado</option>
          <option value="published">Publicado</option>
        </select>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        <div className="lg:col-span-2 flex flex-col overflow-hidden relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
              <span className="text-muted-foreground">Carregando...</span>
            </div>
          ) : null}
          <CandidateList
            candidates={filteredCandidates}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        <div className="lg:col-span-1 h-full overflow-hidden">
          <CandidateDetail candidate={selectedCandidate} />
        </div>
      </div>
    </div>
  );
}
