import React from 'react';
import { ProcessPilot } from './process-mirroring-types';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export function ProcessPilotDetail({ pilot }: { pilot: ProcessPilot }) {
  const [activeTab, setActiveTab] = useState('sources');

  const tabs = [
    { id: 'sources', label: 'Sources' },
    { id: 'observations', label: 'Observations' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'gaps', label: 'Gaps' },
    { id: 'asis', label: 'As-Is Draft' },
    { id: 'validation', label: 'Validation' },
    { id: 'capabilities', label: 'Capabilities' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{pilot.name}</h1>
        <p className="text-slate-600 mt-1">{pilot.description}</p>

        <div className="flex gap-3 mt-4 flex-wrap">
          <Badge variant="outline">Status: {pilot.status}</Badge>
          <Badge variant="secondary">Mode: {pilot.data_source_mode}</Badge>
          <Badge variant="outline">Workspace: {pilot.workspace_label}</Badge>
          {pilot.synthetic && <Badge variant="destructive">Synthetic Demo</Badge>}
        </div>
        <p className="text-sm text-red-600 font-medium mt-2">Real sources pending.</p>
      </div>

      <div className="w-full">
        <div className="flex flex-wrap gap-2 w-full justify-start h-auto p-1 bg-slate-100 rounded-md">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4 border rounded-md p-4 bg-slate-50">
          {activeTab === 'sources' && (
            <div>
            <h3 className="font-semibold mb-3">Source Inventory</h3>
            {pilot.source_inventory.length === 0 ? <p className="text-sm text-slate-500">No sources.</p> : (
              <ul className="space-y-2">
                {pilot.source_inventory.map(s => (
                  <li key={s.id} className="p-3 bg-white border rounded text-sm">
                    <span className="font-medium">[{s.type}]</span> {s.description} <Badge variant="outline" className="ml-2 text-xs">{s.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
            </div>
          )}

          {activeTab === 'observations' && (
            <div>
            <h3 className="font-semibold mb-3">Observation Log</h3>
             {pilot.observations.length === 0 ? <p className="text-sm text-slate-500">No observations.</p> : (
              <ul className="space-y-2">
                {pilot.observations.map(o => (
                  <li key={o.id} className="p-3 bg-white border rounded text-sm">
                    <span className="font-medium">{o.actor}</span>: {o.action} <span className="text-slate-500 text-xs ml-2">via {o.system}</span>
                  </li>
                ))}
              </ul>
            )}
            </div>
          )}

          {activeTab === 'evidence' && (
            <div>
             <h3 className="font-semibold mb-3">Evidence Matrix</h3>
             {pilot.evidence_items.length === 0 ? <p className="text-sm text-slate-500">No evidence.</p> : (
              <ul className="space-y-2">
                {pilot.evidence_items.map(e => (
                  <li key={e.id} className="p-3 bg-white border rounded text-sm">
                    {e.description} <Badge variant="secondary" className="ml-2 text-xs">Strength: {e.strength}</Badge>
                  </li>
                ))}
              </ul>
            )}
            </div>
          )}

          {activeTab === 'gaps' && (
            <div>
            <h3 className="font-semibold mb-3">Collection Gaps</h3>
             {pilot.collection_gaps.length === 0 ? <p className="text-sm text-slate-500">No gaps identified.</p> : (
              <ul className="space-y-2">
                {pilot.collection_gaps.map(g => (
                  <li key={g.id} className="p-3 bg-white border rounded text-sm flex justify-between items-center">
                    <span><span className="font-medium">[{g.type}]</span> {g.description}</span>
                    <Badge variant={g.status === 'open' ? 'destructive' : 'outline'} className="text-xs">{g.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
            </div>
          )}

          {activeTab === 'asis' && (
            <div>
             <h3 className="font-semibold mb-3">As-Is Summary</h3>
             <p className="text-sm text-slate-700 mb-4">{pilot.as_is_summary.summary}</p>
             <h4 className="font-medium text-sm mb-2">Key Steps:</h4>
             {pilot.as_is_summary.keySteps.length === 0 ? <p className="text-sm text-slate-500">No steps documented.</p> : (
               <ol className="list-decimal list-inside text-sm space-y-1 ml-2">
                 {pilot.as_is_summary.keySteps.map((step, idx) => (
                   <li key={idx}>{step}</li>
                 ))}
               </ol>
             )}
            </div>
          )}

          {activeTab === 'validation' && (
            <div>
             <h3 className="font-semibold mb-3">Validation Decision</h3>
             <div className="p-4 bg-white border rounded">
                <Badge variant="outline" className="mb-2 text-sm">{pilot.validation_decision.status}</Badge>
                <p className="text-sm mt-2">{pilot.validation_decision.notes || 'No notes.'}</p>
             </div>
            </div>
          )}

          {activeTab === 'capabilities' && (
            <div>
             <h3 className="font-semibold mb-3">Capability Candidates</h3>
             {pilot.capability_candidates.length === 0 ? <p className="text-sm text-slate-500">No capabilities proposed.</p> : (
              <ul className="space-y-2">
                {pilot.capability_candidates.map(c => (
                  <li key={c.id} className="p-3 bg-white border rounded text-sm">
                    <span className="font-medium">{c.name}</span>: {c.justification}
                  </li>
                ))}
              </ul>
            )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
