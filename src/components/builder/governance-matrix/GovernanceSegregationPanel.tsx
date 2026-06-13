"use client";

import React from 'react';
import { GovernanceSegregationRule } from './governance-matrix-types';
import { Split } from 'lucide-react';

interface GovernanceSegregationPanelProps {
  rules: GovernanceSegregationRule[];
}

export function GovernanceSegregationPanel({ rules }: GovernanceSegregationPanelProps) {
  if (!rules || rules.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 text-sm">
        Nenhuma regra de segregação de função (SoD) definida.
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      <div>
        <h4 className="text-sm font-medium text-slate-900">Segregation of Duties (SoD)</h4>
        <p className="text-xs text-slate-500">Papéis que não podem ser combinados no mesmo usuário.</p>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <div key={rule.id} className="border border-orange-200 rounded p-3 bg-orange-50 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <Split className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-orange-800">
                {rule.role_a} <span className="text-orange-400 mx-1">≠</span> {rule.role_b}
              </span>
            </div>
            <p className="text-xs text-orange-700">{rule.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
