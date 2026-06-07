import React from 'react';
import { ProcessCandidate } from '@/features/builder/candidates/candidate.types';
import { CandidateBadge, OriginBadge } from './CandidateBadge';
import { Button } from '@/components/ui/button';

interface CandidateDetailProps {
  candidate: ProcessCandidate | null;
}

export function CandidateDetail({ candidate }: CandidateDetailProps) {
  if (!candidate) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-muted/20 border rounded-md border-dashed">
        <p>Selecione um candidato na lista para visualizar os detalhes.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border rounded-md bg-card overflow-hidden">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold leading-tight">{candidate.name}</h2>
        </div>
        <div className="flex gap-2 mt-3">
          <CandidateBadge status={candidate.status} />
          <OriginBadge origin={candidate.origin} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Descrição</h3>
          <p className="text-sm">
            {candidate.description || <span className="text-muted-foreground italic">Nenhuma descrição fornecida.</span>}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Metadados</h3>
          <div className="bg-muted p-3 rounded-md text-xs font-mono overflow-x-auto">
            <pre>
              {candidate.metadata ? JSON.stringify(candidate.metadata, null, 2) : 'Nenhum metadado disponível.'}
            </pre>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold text-muted-foreground mb-1">Criado em</h3>
            <p>{new Date(candidate.createdAt).toLocaleString('pt-BR')}</p>
          </div>
          <div>
            <h3 className="font-semibold text-muted-foreground mb-1">Atualizado em</h3>
            <p>{new Date(candidate.updatedAt).toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t bg-muted/30 flex justify-end gap-2">
        <Button variant="outline" size="sm" disabled>Recusar</Button>
        <Button variant="default" size="sm" disabled>Aprovar para Publicação</Button>
      </div>
    </div>
  );
}
