'use client';

import React from 'react';
import { AsIsProcessMirror } from './as-is-mirror-types';
import { MOCK_ACTOR_ROLES } from './as-is-mirror-data';
import { ArrowRight, MessageSquare } from 'lucide-react';

interface Props {
  mirror: AsIsProcessMirror;
}

export function AsIsHandoffPanel({ mirror }: Props) {
  if (mirror.handoffs.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500 bg-white rounded-lg border border-slate-200">
        <p>No handoffs registered for this process mirror.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <ArrowRight className="w-5 h-5 text-blue-500" />
        Process Handoffs
      </h3>

      <div className="space-y-4">
        {mirror.handoffs.map((handoff, index) => {
          const fromRole = Object.values(MOCK_ACTOR_ROLES).find(r => r.id === handoff.from_role_id)?.name || 'Unknown';
          const toRole = Object.values(MOCK_ACTOR_ROLES).find(r => r.id === handoff.to_role_id)?.name || 'Unknown';

          return (
            <div key={handoff.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-md border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                {index + 1}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-700 text-sm">{fromRole}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 mx-2" />
                  <span className="font-medium text-slate-700 text-sm">{toRole}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Method: <span className="font-medium text-slate-600">{handoff.method}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
