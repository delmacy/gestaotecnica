import React from 'react';
import type { CandidateEvidenceViewModel } from './candidate-evidence-view-model';

interface CandidateObservedSignalsProps {
  signals?: CandidateEvidenceViewModel['observedSignals'];
}

export function CandidateObservedSignals({ signals }: CandidateObservedSignalsProps) {
  if (!signals || signals.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
          Sinais Observados
        </h3>
        <p className="text-sm text-muted-foreground italic">Nenhum sinal observado informado.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
        Sinais Observados
      </h3>
      <div className="space-y-3">
        {signals.map((signal, index) => (
          <div key={index} className="border rounded-md p-4 bg-muted/10 text-sm">
            <div className="flex justify-between items-start mb-2 gap-4">
               <div>
                  <span className="font-semibold text-foreground mr-2">Fonte:</span>
                  <span className="bg-muted px-2 py-0.5 rounded font-mono text-xs">{signal.source}</span>
               </div>
               {signal.occurredAt && (
                 <div className="text-xs text-muted-foreground whitespace-nowrap">
                   {new Date(signal.occurredAt).toLocaleString('pt-BR')}
                 </div>
               )}
            </div>

            <p className="text-foreground mt-2 leading-relaxed">
              {signal.summary}
            </p>

            {signal.reference && (
              <div className="mt-3 pt-3 border-t text-xs">
                 <span className="font-semibold text-muted-foreground mr-2">Referência:</span>
                 {signal.reference.startsWith('http') ? (
                   <a
                     href={signal.reference}
                     target="_blank"
                     rel="noreferrer"
                     className="text-primary hover:underline break-all"
                   >
                     {signal.reference}
                   </a>
                 ) : (
                   <span className="break-all">{signal.reference}</span>
                 )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
