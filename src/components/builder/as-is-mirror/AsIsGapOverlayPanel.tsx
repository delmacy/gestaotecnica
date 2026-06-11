'use client';

import React from 'react';
import { AsIsProcessMirror } from './as-is-mirror-types';
import { AlertTriangle } from 'lucide-react';

interface Props {
  mirror: AsIsProcessMirror;
}

export function AsIsGapOverlayPanel({ mirror }: Props) {
  // Aggregate gaps from mirror and steps
  const allGaps = [
    ...mirror.gap_overlays,
    ...mirror.steps.flatMap(step => step.gap_refs)
  ];

  if (allGaps.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-50 rounded-lg border border-amber-200 p-5 mb-6">
      <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        Process Gaps Overview
      </h3>

      <div className="space-y-3">
        {allGaps.map(gap => (
          <div key={gap.id} className="bg-white p-3 rounded-md border border-amber-100 shadow-sm flex items-start gap-3">
             <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                gap.severity === 'high' ? 'bg-rose-500' :
                gap.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-400'
              }`} />
             <div>
               <h4 className="text-sm font-semibold text-slate-800">{gap.title}</h4>
               <p className="text-xs text-slate-600 mt-1">{gap.description}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
