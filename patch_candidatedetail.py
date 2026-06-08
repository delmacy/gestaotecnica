with open("src/components/builder/candidates/CandidateDetail.tsx", "r") as f:
    content = f.read()

replacement = """
import React, { useState, useTransition } from 'react';
import type { ProcessCandidate } from '@/features/builder/candidates/candidate.types';
import { CandidateBadge, OriginBadge } from './CandidateBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { approveCandidateAction, rejectCandidateAction } from '@/features/builder/candidates/candidates.actions';

interface CandidateDetailProps {
  candidate: ProcessCandidate | null;
}

export function CandidateDetail({ candidate }: CandidateDetailProps) {
  const [isPending, startTransition] = useTransition();
  const [justification, setJustification] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!candidate) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-muted/20 border rounded-md border-dashed">
        <p>Selecione um candidato na lista para visualizar os detalhes.</p>
      </div>
    );
  }

  const handleAction = (actionType: 'approve' | 'reject') => {
    if (!justification.trim()) {
      setError('Justificativa é obrigatória.');
      return;
    }
    setError(null);
    startTransition(async () => {
      const payload = {
        workspaceId: candidate.workspaceId,
        candidateId: candidate.id,
        reviewerId: 'alpha-reviewer-id', // TODO: replace with real user context
        justification
      };

      let result;
      if (actionType === 'approve') {
        result = await approveCandidateAction(payload);
      } else {
        result = await rejectCandidateAction(payload);
      }

      if (!result.ok) {
        setError(result.error.message);
      } else {
        setJustification('');
        // Reload is typically handled by parent component or a router refresh in Next.js
        window.location.reload();
      }
    });
  };

  const isReviewable = candidate.status === 'under_analysis' || candidate.status === 'waiting_review';

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
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-3 py-2 rounded-md text-sm">
            {error}
          </div>
        )}
"""

content = content.replace("import React from 'react';\nimport type { ProcessCandidate } from '@/features/builder/candidates/candidate.types';\nimport { CandidateBadge, OriginBadge } from './CandidateBadge';\nimport { Button } from '@/components/ui/button';\n\ninterface CandidateDetailProps {\n  candidate: ProcessCandidate | null;\n}\n\nexport function CandidateDetail({ candidate }: CandidateDetailProps) {\n  if (!candidate) {\n    return (\n      <div className=\"h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-muted/20 border rounded-md border-dashed\">\n        <p>Selecione um candidato na lista para visualizar os detalhes.</p>\n      </div>\n    );\n  }\n\n  return (\n    <div className=\"h-full flex flex-col border rounded-md bg-card overflow-hidden\">\n      <div className=\"p-4 border-b bg-muted/30\">\n        <div className=\"flex justify-between items-start mb-2\">\n          <h2 className=\"text-xl font-semibold leading-tight\">{candidate.name}</h2>\n        </div>\n        <div className=\"flex gap-2 mt-3\">\n          <CandidateBadge status={candidate.status} />\n          <OriginBadge origin={candidate.origin} />\n        </div>\n      </div>\n\n      <div className=\"flex-1 overflow-y-auto p-4 space-y-6\">\n", replacement)

bottom_replacement = """
      <div className="p-4 border-t bg-muted/30 flex flex-col gap-2">
        {isReviewable ? (
          <>
            <Input
              placeholder="Justificativa (obrigatório)"
              value={justification}
              onChange={e => setJustification(e.target.value)}
              disabled={isPending}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={() => handleAction('reject')} disabled={isPending || !justification.trim()}>Recusar</Button>
              <Button variant="default" size="sm" onClick={() => handleAction('approve')} disabled={isPending || !justification.trim()}>Aprovar</Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground italic text-right">
            Nenhuma ação disponível para o status atual.
          </p>
        )}
      </div>
"""
content = content.replace('      <div className="p-4 border-t bg-muted/30 flex justify-end gap-2">\n        <Button variant="outline" size="sm" disabled>Recusar</Button>\n        <Button variant="default" size="sm" disabled>Aprovar para Publicação</Button>\n      </div>', bottom_replacement)

with open("src/components/builder/candidates/CandidateDetail.tsx", "w") as f:
    f.write(content)
