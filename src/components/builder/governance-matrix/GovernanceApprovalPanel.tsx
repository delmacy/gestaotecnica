"use client";

import React from 'react';
import { GovernanceApprovalRule } from './governance-matrix-types';
import { Shield } from 'lucide-react';

interface GovernanceApprovalPanelProps {
  rules: GovernanceApprovalRule[];
}

export function GovernanceApprovalPanel({ rules }: GovernanceApprovalPanelProps) {
  if (!rules || rules.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 text-sm">
        Nenhuma regra de aprovação configurada.
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      <div>
        <h4 className="text-sm font-medium text-slate-900">Approval Rules</h4>
        <p className="text-xs text-slate-500">Regras de alçada e aprovação para este recurso/ação.</p>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <div key={rule.id} className="border rounded p-3 bg-white text-sm">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-slate-700">Required: {rule.required_role}</span>
            </div>
            <p className="text-xs text-slate-600">{rule.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
