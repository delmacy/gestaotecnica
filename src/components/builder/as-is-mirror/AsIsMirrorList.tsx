'use client';

import React from 'react';
import { AsIsProcessMirror } from './as-is-mirror-types';
import { CheckCircle2, CircleDashed, FileSearch, HelpCircle } from 'lucide-react';

interface Props {
  mirrors: AsIsProcessMirror[];
  selectedMirrorId: string | null;
  onSelectMirror: (id: string) => void;
}

export function AsIsMirrorList({ mirrors, selectedMirrorId, onSelectMirror }: Props) {
  return (
    <div className="w-80 border-r border-slate-200 bg-white h-full flex flex-col overflow-hidden shrink-0">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-slate-500" />
          Process Mirrors
        </h2>
        <p className="text-xs text-slate-500 mt-1">Select an As-Is mirror to analyze.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {mirrors.map(mirror => {
          const isSelected = mirror.id === selectedMirrorId;
          return (
            <button
              key={mirror.id}
              onClick={() => onSelectMirror(mirror.id)}
              className={`w-full text-left p-3 rounded-md transition-colors text-sm ${
                isSelected
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="font-medium text-slate-800 mb-1">{mirror.title}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {mirror.process_area}
                </span>

                {mirror.validation_status === 'synthetic_only' && (
                  <CircleDashed className="w-3.5 h-3.5 text-slate-400" title="Synthetic" />
                )}
                {mirror.validation_status === 'needs_real_validation' && (
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" title="Needs real validation" />
                )}
                {mirror.validation_status === 'not_reviewed' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" title="Not reviewed" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
