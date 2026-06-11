'use client';

import React, { useState, useMemo } from 'react';
import { ProcessGap, GapStatus, GapSeverity, GapImpact } from './gap-tracker-types';
import { mockGaps } from './gap-tracker-data';
import { AlertCircle, ShieldAlert, FileSearch, HelpCircle } from 'lucide-react';

export default function GapTracker() {
  const [selectedGapId, setSelectedGapId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<GapStatus | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<GapSeverity | 'all'>('all');

  const filteredGaps = useMemo(() => {
    return mockGaps.filter(gap => {
      const matchStatus = statusFilter === 'all' || gap.status === statusFilter;
      const matchSeverity = severityFilter === 'all' || gap.severity === severityFilter;
      return matchStatus && matchSeverity;
    });
  }, [statusFilter, severityFilter]);

  const selectedGap = useMemo(() => {
    return mockGaps.find(gap => gap.id === selectedGapId) || null;
  }, [selectedGapId]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
      {/* Header and Synthetic Warning */}
      <div className="flex flex-col gap-2 p-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Gap Tracker</h1>
        <div className="flex items-center gap-2 p-3 text-sm rounded-md bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <AlertCircle className="w-4 h-4" />
          <p>
            <strong>Synthetic/Mock Mode:</strong> This tracker currently operates using simulated data.
            Real gaps are unresolved and real sources are pending. No real process is validated here.
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Gap List and Filters */}
        <div className="w-1/3 flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 overflow-hidden">

          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
            <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Filters</h2>
            <div className="flex gap-2">
               <select
                  className="p-2 text-sm border border-zinc-300 rounded-md dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as GapStatus | 'all')}
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="pending_source">Pending Source</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="reviewed_synthetic">Reviewed Synthetic</option>
                  <option value="blocked_real_source">Blocked Real Source</option>
                  <option value="deferred">Deferred</option>
               </select>

               <select
                  className="p-2 text-sm border border-zinc-300 rounded-md dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value as GapSeverity | 'all')}
                >
                  <option value="all">All Severities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
               </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {filteredGaps.length === 0 ? (
              <div className="text-sm text-zinc-500 text-center mt-10">No gaps found matching filters.</div>
            ) : (
              filteredGaps.map(gap => (
                <div
                  key={gap.id}
                  onClick={() => setSelectedGapId(gap.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedGapId === gap.id
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                      : 'bg-white border-zinc-200 hover:border-zinc-300 dark:bg-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold uppercase text-zinc-500">{gap.gap_type.replace(/_/g, ' ')}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getSeverityColor(gap.severity)}`}>
                      {gap.severity}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2">{gap.title}</h3>
                  <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                     <span>{gap.status.replace(/_/g, ' ')}</span>
                     <span className="text-blue-600 dark:text-blue-400 font-medium">{gap.data_source_mode.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Detail View */}
        <div className="w-2/3 flex flex-col overflow-y-auto bg-white dark:bg-zinc-950 p-6">
           {selectedGap ? (
             <div className="flex flex-col max-w-3xl gap-6">

                <div className="flex justify-between items-start">
                   <div>
                     <div className="flex items-center gap-2 mb-2">
                       <span className={`text-xs px-2 py-1 rounded-md font-medium uppercase ${getSeverityColor(selectedGap.severity)}`}>
                         Severity: {selectedGap.severity}
                       </span>
                       <span className={`text-xs px-2 py-1 rounded-md font-medium uppercase ${getImpactColor(selectedGap.impact)}`}>
                         Impact: {selectedGap.impact}
                       </span>
                       <span className="text-xs px-2 py-1 rounded-md bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 font-medium uppercase">
                         Status: {selectedGap.status.replace(/_/g, ' ')}
                       </span>
                     </div>
                     <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{selectedGap.title}</h2>
                     <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{selectedGap.description}</p>
                   </div>
                   <div className="text-right">
                     <span className="block text-xs text-zinc-500">Owner Role</span>
                     <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">{selectedGap.owner_role}</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
                     <div className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
                        <ShieldAlert className="w-4 h-4 text-red-500" />
                        <h3 className="text-sm font-semibold">Risk if Missing</h3>
                     </div>
                     <p className="text-sm text-zinc-600 dark:text-zinc-400">{selectedGap.risk_if_missing}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
                     <div className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
                        <HelpCircle className="w-4 h-4 text-blue-500" />
                        <h3 className="text-sm font-semibold">Next Action</h3>
                     </div>
                     <p className="text-sm text-zinc-600 dark:text-zinc-400">{selectedGap.next_action}</p>
                  </div>
                </div>

                {selectedGap.required_sources.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                       <FileSearch className="w-4 h-4 text-zinc-500" />
                       Required Sources
                    </h3>
                    <ul className="space-y-2">
                      {selectedGap.required_sources.map(src => (
                         <li key={src.id} className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-md flex justify-between items-center text-sm">
                           <div>
                             <span className="font-medium text-zinc-900 dark:text-zinc-100 block">{src.name}</span>
                             <span className="text-zinc-500 text-xs">{src.description}</span>
                           </div>
                           <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-600 dark:text-zinc-400">{src.id}</span>
                         </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedGap.missing_evidence.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Missing Evidence</h3>
                    <ul className="space-y-2">
                      {selectedGap.missing_evidence.map(evd => (
                         <li key={evd.id} className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm">
                           <span className="font-medium text-zinc-900 dark:text-zinc-100">{evd.name}</span>
                           <span className="ml-2 text-zinc-500 text-xs">({evd.type})</span>
                           <p className="text-zinc-500 text-xs mt-1">{evd.description}</p>
                         </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-8 p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                   <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Simulate Review Decision (Mock)</h3>
                   <select
                      className="p-2 w-full max-w-xs text-sm border border-zinc-300 rounded-md dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                      value={selectedGap.review_decision}
                      onChange={(e) => alert('Simulated Review Decision changed to: ' + e.target.value)}
                    >
                      <option value="not_reviewed">Not Reviewed</option>
                      <option value="synthetic_only">Synthetic Only</option>
                      <option value="usable_for_demo">Usable for Demo</option>
                      <option value="needs_real_source">Needs Real Source</option>
                      <option value="needs_validation">Needs Validation</option>
                      <option value="blocked">Blocked</option>
                      <option value="deferred">Deferred</option>
                   </select>
                   <p className="text-xs text-zinc-500 mt-2">Note: This is a client-side simulation. No real gaps are resolved here.</p>
                </div>

             </div>
           ) : (
             <div className="flex h-full items-center justify-center text-zinc-500 text-sm">
                Select a gap from the list to view details.
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

function getSeverityColor(sev: GapSeverity) {
  switch(sev) {
    case 'critical': return 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50';
    case 'high': return 'bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50';
    case 'medium': return 'bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50';
    case 'low': return 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50';
    default: return 'bg-zinc-100 text-zinc-700';
  }
}

function getImpactColor(imp: GapImpact) {
  switch(imp) {
    case 'blocking': return 'bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50';
    case 'high': return 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50';
    case 'medium': return 'bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50';
    case 'low': return 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50';
    default: return 'bg-zinc-100 text-zinc-700';
  }
}
