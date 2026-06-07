'use client';

import React, { useState, useMemo } from 'react';
import { ProcessCandidate, CandidateStatus } from '@/features/builder/candidates/candidate.types';
import { CandidateList } from '@/components/builder/candidates/CandidateList';
import { CandidateDetail } from '@/components/builder/candidates/CandidateDetail';
import { Input } from '@/components/ui/input';

const MOCK_CANDIDATES: ProcessCandidate[] = [
  {
    id: 'cand-1',
    name: 'Onboarding de Fornecedor (Proposta)',
    description: 'Processo sugerido para o cadastro e aprovação de novos fornecedores baseado nas ações da última semana.',
    status: 'under_analysis',
    origin: 'agent',
    createdAt: new Date('2023-10-25T10:00:00Z'),
    updatedAt: new Date('2023-10-25T14:30:00Z'),
    metadata: {
      source: 'Paperclip Integration',
      confidenceScore: 0.85,
      suggestedNodes: 5,
    }
  },
  {
    id: 'cand-2',
    name: 'Revisão de Contratos de TI',
    description: 'Fluxo manual de revisão desenhado pela equipe de compliance.',
    status: 'draft',
    origin: 'manual',
    createdAt: new Date('2023-10-26T09:15:00Z'),
    updatedAt: new Date('2023-10-26T09:15:00Z'),
  },
  {
    id: 'cand-3',
    name: 'Aprovação de Despesas de Viagem',
    description: 'Candidato aprovado e pronto para publicação no Runtime.',
    status: 'approved',
    origin: 'manual',
    createdAt: new Date('2023-10-20T11:20:00Z'),
    updatedAt: new Date('2023-10-24T16:45:00Z'),
    metadata: {
      approverId: 'usr-456',
      approvalNotes: 'Revisado e validado conforme política vigente.',
    }
  },
  {
    id: 'cand-4',
    name: 'Integração de Novo Colaborador',
    description: 'Fluxo sugerido pelo agente observando padrões de emails do RH.',
    status: 'waiting_review',
    origin: 'agent',
    createdAt: new Date('2023-10-27T08:00:00Z'),
    updatedAt: new Date('2023-10-27T08:00:00Z'),
    metadata: {
      source: 'Email Pattern Observer',
    }
  }
];

export default function CandidatesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'all'>('all');

  const selectedCandidate = MOCK_CANDIDATES.find(c => c.id === selectedId) || null;

  const filteredCandidates = useMemo(() => {
    return MOCK_CANDIDATES.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (candidate.description && candidate.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

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
        <div className="lg:col-span-2 flex flex-col overflow-hidden">
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
