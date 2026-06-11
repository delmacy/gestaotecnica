'use client';

import React from 'react';
import { AsIsProcessStep } from './as-is-mirror-types';
import { Image as ImageIcon, FileText, MessageCircle, FileDown } from 'lucide-react';

interface Props {
  step: AsIsProcessStep;
}

export function AsIsEvidencePanel({ step }: Props) {
  if (step.evidence_refs.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'screenshot': return <ImageIcon className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'interview_quote': return <MessageCircle className="w-4 h-4" />;
      case 'observation_note': return <FileDown className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Linked Evidence</h4>
      <div className="grid grid-cols-1 gap-2">
        {step.evidence_refs.map(evidence => (
          <div key={evidence.id} className="flex items-center gap-3 p-2 bg-white rounded border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500">
              {getIcon(evidence.type)}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-700 leading-none mb-1">{evidence.title}</div>
              <div className="text-xs text-slate-400 capitalize">{evidence.type.replace('_', ' ')}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
