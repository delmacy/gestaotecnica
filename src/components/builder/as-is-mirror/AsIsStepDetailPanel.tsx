'use client';

import React from 'react';
import { AsIsProcessStep } from './as-is-mirror-types';
import { MOCK_DATA_POINTS, MOCK_ACTOR_ROLES } from './as-is-mirror-data';
import { FileInput, FileOutput, Server, Users, AlertTriangle, ShieldAlert, Zap, BookOpen } from 'lucide-react';

interface Props {
  step: AsIsProcessStep | null;
}

export function AsIsStepDetailPanel({ step }: Props) {
  if (!step) {
    return (
      <div className="w-96 border-l border-slate-200 bg-white h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
        <BookOpen className="w-12 h-12 mb-4 opacity-20" />
        <p>Select a step in the map to view its details, inputs, and gaps.</p>
      </div>
    );
  }

  const roleName = Object.values(MOCK_ACTOR_ROLES).find(r => r.id === step.actor_role)?.name || 'Unknown';

  const inputs = step.input_refs.map(ref => Object.values(MOCK_DATA_POINTS).find(dp => dp.id === ref)).filter(Boolean);
  const outputs = step.output_refs.map(ref => Object.values(MOCK_DATA_POINTS).find(dp => dp.id === ref)).filter(Boolean);

  return (
    <div className="w-96 border-l border-slate-200 bg-white h-full flex flex-col overflow-y-auto shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">

      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
        <div className="text-xs font-mono text-slate-500 mb-1">Step {step.sequence}</div>
        <h3 className="text-lg font-semibold text-slate-800 leading-tight mb-2">{step.title}</h3>
        <p className="text-sm text-slate-600">{step.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
            <Users className="w-3.5 h-3.5" />
            {roleName}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200 text-slate-600">
            Type: {step.step_type}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-6">

        {/* Confiança e Status */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Observation Status</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="block text-xs text-slate-400 mb-0.5">Source Mode</span>
              <span className="font-medium text-slate-700">{step.data_source_mode.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-400 mb-0.5">Confidence</span>
              <span className="font-medium text-slate-700 capitalize">{step.confidence}</span>
            </div>
          </div>
          {step.synthetic && (
            <div className="mt-3 flex items-start gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>This data is synthetic. Needs validation with real operational sources.</span>
            </div>
          )}
        </div>

        {/* Inputs / Outputs */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <FileInput className="w-4 h-4" /> Data & Artifacts
          </h4>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-slate-400 font-medium mb-1.5 block">Inputs Required</span>
              {inputs.length === 0 ? (
                <div className="text-sm text-slate-400 italic">None identified</div>
              ) : (
                <ul className="space-y-1">
                  {inputs.map((inp: any) => (
                    <li key={inp.id} className="text-sm text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      {inp.name} <span className="text-xs text-slate-400">({inp.type})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium mb-1.5 block">Outputs Generated</span>
              {outputs.length === 0 ? (
                <div className="text-sm text-slate-400 italic">None identified</div>
              ) : (
                <ul className="space-y-1">
                  {outputs.map((out: any) => (
                    <li key={out.id} className="text-sm text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100 flex items-center gap-2">
                      <FileOutput className="w-3.5 h-3.5 text-slate-400" />
                      {out.name} <span className="text-xs text-slate-400">({out.type})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Touchpoints */}
        {(step.system_touchpoints.length > 0 || step.document_touchpoints.length > 0) && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Server className="w-4 h-4" /> Touchpoints
            </h4>
            <div className="flex flex-wrap gap-2">
              {step.system_touchpoints.map(sys => (
                <span key={sys.id} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {sys.name} ({sys.type})
                </span>
              ))}
              {step.document_touchpoints.map(doc => (
                <span key={doc.id} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {doc.name} ({doc.type})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gaps e Riscos */}
        {(step.gap_refs.length > 0 || step.risk_flags.length > 0) && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Issues & Risks
            </h4>
            <div className="space-y-2">
              {step.gap_refs.map(gap => (
                <div key={gap.id} className="p-2.5 rounded bg-amber-50 border border-amber-200">
                  <div className="text-sm font-semibold text-amber-800 mb-0.5">{gap.title}</div>
                  <div className="text-xs text-amber-700">{gap.description}</div>
                </div>
              ))}
              {step.risk_flags.map(risk => (
                <div key={risk.id} className="p-2.5 rounded bg-rose-50 border border-rose-200">
                  <div className="text-sm font-semibold text-rose-800 mb-0.5">{risk.title}</div>
                  <div className="text-xs text-rose-700">{risk.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Capabilities */}
        {step.capability_candidates.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Capabilities
            </h4>
            <div className="space-y-2">
              {step.capability_candidates.map(cap => (
                <div key={cap.id} className="p-2.5 rounded bg-purple-50 border border-purple-100">
                  <div className="text-sm font-semibold text-purple-800 flex items-center justify-between">
                    {cap.capability_key}
                    <span className="text-[10px] uppercase bg-purple-200 text-purple-700 px-1.5 rounded">Candidate</span>
                  </div>
                  <div className="text-xs text-purple-600 mt-1">{cap.reasoning}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
