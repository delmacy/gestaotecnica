import React from 'react';
import type { ProcessCandidate } from '@/features/builder/candidates/candidate.types';
import { CandidateBadge, OriginBadge } from './CandidateBadge';
import { Button } from '@/components/ui/button';
import { parseCandidateEvidence } from './candidate-evidence-view-model';
import { CandidateAgentSummary } from './CandidateAgentSummary';
import { CandidateSuggestedStates } from './CandidateSuggestedStates';
import { CandidateSuggestedForms } from './CandidateSuggestedForms';
import { CandidateObservedSignals } from './CandidateObservedSignals';
import { CandidateAttachments } from './CandidateAttachments';

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

  const evidenceVM = parseCandidateEvidence(candidate.evidence);

  return (
    <div className="h-full flex flex-col border rounded-md bg-card overflow-hidden">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold leading-tight">{candidate.name}</h2>
        </div>
        <div className="flex gap-2 mt-3 items-center">
          <CandidateBadge status={candidate.status} />
          <OriginBadge origin={candidate.origin} />
          {candidate.origin === 'agent' && (
            <span className="text-xs text-muted-foreground ml-2 px-2 py-0.5 bg-muted rounded-full">
              Proposto por agente
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Descrição</h3>
          <p className="text-sm">
            {candidate.description || <span className="text-muted-foreground italic">Nenhuma descrição fornecida.</span>}
          </p>
        </div>

        {evidenceVM.hasStructuredEvidence ? (
          <div className="space-y-6">
            <CandidateAgentSummary agent={evidenceVM.agent} confidenceScore={evidenceVM.proposal?.confidenceScore} />

            {evidenceVM.summary && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Resumo da Evidência</h3>
                <p className="text-sm bg-muted/20 p-4 rounded-md border">{evidenceVM.summary}</p>
              </div>
            )}

            {(evidenceVM.proposal?.suggestedStates && evidenceVM.proposal.suggestedStates.length > 0) && (
              <CandidateSuggestedStates states={evidenceVM.proposal.suggestedStates} />
            )}

            {(evidenceVM.proposal?.suggestedForms && evidenceVM.proposal.suggestedForms.length > 0) && (
              <CandidateSuggestedForms forms={evidenceVM.proposal.suggestedForms} />
            )}

            {(evidenceVM.observedSignals && evidenceVM.observedSignals.length > 0) && (
              <CandidateObservedSignals signals={evidenceVM.observedSignals} />
            )}

            {(evidenceVM.attachments && evidenceVM.attachments.length > 0) && (
              <CandidateAttachments attachments={evidenceVM.attachments} />
            )}

            {evidenceVM.metadata && (
               <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Metadados</h3>
                  <div className="bg-muted/20 p-4 rounded-md border text-sm space-y-2">
                    {evidenceVM.metadata.externalReference && (
                      <div><span className="font-semibold text-muted-foreground mr-2">Ref Externa:</span>{evidenceVM.metadata.externalReference}</div>
                    )}
                    {evidenceVM.metadata.submittedAt && (
                      <div><span className="font-semibold text-muted-foreground mr-2">Enviado em:</span>{new Date(evidenceVM.metadata.submittedAt).toLocaleString('pt-BR')}</div>
                    )}
                    {evidenceVM.metadata.tags && evidenceVM.metadata.tags.length > 0 && (
                      <div className="flex gap-2 items-center mt-2">
                        <span className="font-semibold text-muted-foreground mr-2">Tags:</span>
                        {evidenceVM.metadata.tags.map(tag => (
                          <span key={tag} className="bg-muted px-2 py-0.5 rounded-full text-xs">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
               </div>
            )}

            <details className="border rounded-md group">
              <summary className="p-3 bg-muted/30 cursor-pointer font-medium text-sm hover:bg-muted/50 transition-colors">
                Evidência Bruta (JSON)
              </summary>
              <div className="p-3 bg-muted text-xs font-mono overflow-x-auto border-t">
                <pre>{JSON.stringify(evidenceVM.raw, null, 2)}</pre>
              </div>
            </details>
          </div>
        ) : (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Evidências</h3>
            <div className="bg-muted p-3 rounded-md text-xs font-mono overflow-x-auto">
              <pre>
                {Object.keys(candidate.evidence).length > 0
                  ? JSON.stringify(candidate.evidence, null, 2)
                  : 'Nenhuma evidência disponível.'}
              </pre>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Definição proposta</h3>
          <div className="bg-muted p-3 rounded-md text-xs font-mono overflow-x-auto">
            <pre>
              {Object.keys(candidate.proposedDefinition).length > 0
                ? JSON.stringify(candidate.proposedDefinition, null, 2)
                : 'Nenhuma definição proposta disponível.'}
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
