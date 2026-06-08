import React from 'react';
import type { CandidateEvidenceViewModel } from './candidate-evidence-view-model';

interface CandidateSuggestedStatesProps {
  states?: NonNullable<CandidateEvidenceViewModel['proposal']>['suggestedStates'];
}

export function CandidateSuggestedStates({ states }: CandidateSuggestedStatesProps) {
  if (!states || states.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
          Estados Sugeridos
        </h3>
        <p className="text-sm text-muted-foreground italic">Nenhum estado sugerido.</p>
      </div>
    );
  }

  // Sort states by order if available
  const sortedStates = [...states].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return 0;
  });

  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
        Estados Sugeridos
      </h3>
      <div className="border rounded-md divide-y overflow-hidden text-sm">
        <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-3">Chave</div>
          <div className="col-span-4">Rótulo</div>
          <div className="col-span-4">Descrição</div>
        </div>
        {sortedStates.map((state, index) => (
          <div key={state.key} className="grid grid-cols-12 gap-4 p-3 items-start">
            <div className="col-span-1 text-center text-muted-foreground">
              {state.order !== undefined ? state.order : index + 1}
            </div>
            <div className="col-span-3 font-mono text-xs bg-muted/50 px-1.5 py-0.5 rounded w-fit h-fit">
              {state.key}
            </div>
            <div className="col-span-4 font-medium">
              {state.label}
            </div>
            <div className="col-span-4 text-muted-foreground">
              {state.description || '-'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
