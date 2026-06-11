'use client';

import React from 'react';
import { AsIsProcessStep } from './as-is-mirror-types';
import { MOCK_ACTOR_ROLES } from './as-is-mirror-data';
import { AlertTriangle, Flag, ShieldAlert, Zap } from 'lucide-react';

interface Props {
  step: AsIsProcessStep;
  isSelected: boolean;
  onClick: () => void;
}

export function AsIsStepCard({ step, isSelected, onClick }: Props) {
  // Encontrar o nome do role baseado no ID (mockado por enquanto)
  const roleName = Object.values(MOCK_ACTOR_ROLES).find(r => r.id === step.actor_role)?.name || 'Unknown Role';

  return (
    <div
      onClick={onClick}
      className={`relative min-w-[280px] p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 shadow-md bg-blue-50/30'
          : 'border-slate-200 bg-white hover:border-blue-300'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-mono text-slate-400">Step {step.sequence}</span>

        <div className="flex gap-1">
          {step.gap_refs.length > 0 && (
            <div title={`${step.gap_refs.length} Gaps found`}>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
          )}
          {step.risk_flags.length > 0 && (
            <div title="Risks identified">
              <Flag className="w-4 h-4 text-rose-500" />
            </div>
          )}
          {step.capability_candidates.length > 0 && (
            <div title="Capabilities identified">
              <Zap className="w-4 h-4 text-purple-500" />
            </div>
          )}
          {step.data_source_mode === 'synthetic' && (
            <div title="Synthetic Data">
               <ShieldAlert className="w-4 h-4 text-slate-400" />
            </div>
          )}
        </div>
      </div>

      <h4 className="font-medium text-slate-800 mb-1 leading-tight">{step.title}</h4>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
          {step.step_type}
        </span>
        <span className="text-xs text-slate-600 truncate" title={roleName}>
          {roleName}
        </span>
      </div>
    </div>
  );
}
