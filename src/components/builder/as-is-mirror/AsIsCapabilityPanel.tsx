'use client';

import React from 'react';
import { AsIsProcessMirror } from './as-is-mirror-types';
import { Zap } from 'lucide-react';

interface Props {
  mirror: AsIsProcessMirror;
}

export function AsIsCapabilityPanel({ mirror }: Props) {
  // Aggregate capabilities from mirror and steps
  const allCaps = [
    ...mirror.capability_candidates,
    ...mirror.steps.flatMap(step => step.capability_candidates)
  ];

  if (allCaps.length === 0) {
    return null;
  }

  // Remove duplicate capability keys for overview
  const uniqueCaps = Array.from(new Set(allCaps.map(c => c.capability_key)));

  return (
    <div className="bg-purple-50 rounded-lg border border-purple-200 p-5 mt-6">
      <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5" />
        Candidate Capabilities
      </h3>
      <p className="text-sm text-purple-700 mb-4">
        Based on this process, the following capabilities are candidates for the To-Be model:
      </p>

      <div className="flex flex-wrap gap-2">
        {uniqueCaps.map(capKey => (
          <span key={capKey} className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-white text-purple-700 border border-purple-200 shadow-sm">
            {capKey}
          </span>
        ))}
      </div>
    </div>
  );
}
