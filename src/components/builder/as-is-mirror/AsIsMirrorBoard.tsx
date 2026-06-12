'use client';

import React, { useState } from 'react';
import { MOCK_MIRRORS } from './as-is-mirror-data';
import { AsIsMirrorList } from './AsIsMirrorList';
import { AsIsStepMap } from './AsIsStepMap';
import { AsIsStepDetailPanel } from './AsIsStepDetailPanel';
import { AsIsHandoffPanel } from './AsIsHandoffPanel';
import { AsIsGapOverlayPanel } from './AsIsGapOverlayPanel';
import { AsIsCapabilityPanel } from './AsIsCapabilityPanel';
import { ShieldAlert } from 'lucide-react';

export function AsIsMirrorBoard() {
  const [selectedMirrorId, setSelectedMirrorId] = useState<string>(MOCK_MIRRORS[0].id);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  const activeMirror = MOCK_MIRRORS.find(m => m.id === selectedMirrorId) || MOCK_MIRRORS[0];
  const activeStep = activeMirror.steps.find(s => s.id === selectedStepId) || null;

  const handleSelectMirror = (id: string) => {
    setSelectedMirrorId(id);
    setSelectedStepId(null);
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">

      {/* GLOBAL HEADER */}
      <div className="bg-amber-100 border-b border-amber-200 p-2 text-center text-xs font-semibold text-amber-800 flex items-center justify-center gap-2">
        <ShieldAlert className="w-4 h-4" />
        SYNTHETIC DEMO MODE: This is an As-Is Mirror observation board. It is NOT a runtime workflow engine.
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT BAR: List of Mirrors */}
        <AsIsMirrorList
          mirrors={MOCK_MIRRORS}
          selectedMirrorId={selectedMirrorId}
          onSelectMirror={handleSelectMirror}
        />

        {/* CENTER: Main content (Map + Overviews) */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50 relative">
          <div className="p-6 pb-0">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{activeMirror.title}</h2>
            <p className="text-slate-600 mb-6">{activeMirror.description}</p>

            <AsIsGapOverlayPanel mirror={activeMirror} />
            <AsIsHandoffPanel mirror={activeMirror} />
            <AsIsCapabilityPanel mirror={activeMirror} />
          </div>

          <div className="flex-1 mt-6 border-t border-slate-200 relative">
             <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded shadow-sm border border-slate-200 text-sm font-medium text-slate-700 z-10">
               Process Flow Map
             </div>
             <AsIsStepMap
                mirror={activeMirror}
                selectedStepId={selectedStepId}
                onSelectStep={setSelectedStepId}
             />
          </div>
        </div>

        {/* RIGHT BAR: Step Details */}
        <AsIsStepDetailPanel step={activeStep} />
      </div>
    </div>
  );
}
