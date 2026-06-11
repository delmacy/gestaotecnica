'use client';

import React from 'react';
import { AsIsProcessMirror } from './as-is-mirror-types';
import { AsIsStepCard } from './AsIsStepCard';
import { ArrowDown } from 'lucide-react';

interface Props {
  mirror: AsIsProcessMirror;
  selectedStepId: string | null;
  onSelectStep: (id: string) => void;
}

export function AsIsStepMap({ mirror, selectedStepId, onSelectStep }: Props) {
  // Ordenar passos pela sequencia
  const sortedSteps = [...mirror.steps].sort((a, b) => a.sequence - b.sequence);

  if (sortedSteps.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400">
        No steps defined for this process.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50/50 p-8 flex justify-center">
      <div className="flex flex-col items-center max-w-2xl w-full pb-20">
        {sortedSteps.map((step, index) => (
          <React.Fragment key={step.id}>
            <AsIsStepCard
              step={step}
              isSelected={selectedStepId === step.id}
              onClick={() => onSelectStep(step.id)}
            />

            {index < sortedSteps.length - 1 && (
              <div className="py-3 flex flex-col items-center">
                <div className="w-px h-6 bg-slate-300"></div>
                <ArrowDown className="w-4 h-4 text-slate-300 -mt-1" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
