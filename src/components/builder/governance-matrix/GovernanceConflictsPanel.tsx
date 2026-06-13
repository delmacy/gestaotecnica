"use client";

import React from 'react';
import { GovernanceConflict } from './governance-matrix-types';
import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface GovernanceConflictsPanelProps {
  conflicts: GovernanceConflict[];
}

export function GovernanceConflictsPanel({ conflicts }: GovernanceConflictsPanelProps) {
  if (!conflicts || conflicts.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 text-sm">
        Nenhum conflito de permissão detectado.
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      <div>
        <h4 className="text-sm font-medium text-slate-900">Detected Conflicts</h4>
        <p className="text-xs text-slate-500">Conflitos de regras resolvidos condicionalmente.</p>
      </div>

      <div className="space-y-3">
        {conflicts.map((conflict) => (
          <div key={conflict.id} className="border border-red-200 rounded p-3 bg-red-50 text-sm">
            <div className="flex items-center gap-2 mb-2 justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="font-medium text-red-800">Conflito Detectado</span>
              </div>
              <Badge variant={conflict.severity === 'high' ? 'destructive' : 'secondary'} className="text-[10px]">
                {conflict.severity}
              </Badge>
            </div>
            <p className="text-xs text-red-700">{conflict.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
