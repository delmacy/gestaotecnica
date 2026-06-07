import React from 'react';
import type { ProcessCandidate } from '@/features/builder/candidates/candidate.types';
import { CandidateBadge, OriginBadge } from './CandidateBadge';

interface CandidateListProps {
  candidates: ProcessCandidate[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function CandidateList({ candidates, selectedId, onSelect }: CandidateListProps) {
  if (candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <p>Nenhum candidato encontrado.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md divide-y overflow-hidden bg-card">
      <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <div className="col-span-5">Nome</div>
        <div className="col-span-2">Origem</div>
        <div className="col-span-3">Status</div>
        <div className="col-span-2 text-right">Data</div>
      </div>

      <div className="divide-y max-h-[600px] overflow-y-auto">
        {candidates.map((candidate) => (
          <button
            type="button"
            key={candidate.id}
            onClick={() => onSelect(candidate.id)}
            aria-pressed={selectedId === candidate.id}
            aria-label={`Selecionar candidato ${candidate.name}`}
            className={`grid w-full grid-cols-12 gap-4 p-3 items-center text-left text-sm transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${selectedId === candidate.id ? 'bg-muted border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
          >
            <div className="col-span-5 font-medium truncate pr-4">
              {candidate.name}
            </div>
            <div className="col-span-2">
              <OriginBadge origin={candidate.origin} />
            </div>
            <div className="col-span-3">
              <CandidateBadge status={candidate.status} />
            </div>
            <div className="col-span-2 text-right text-muted-foreground text-xs">
              {new Date(candidate.createdAt).toLocaleDateString('pt-BR')}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
