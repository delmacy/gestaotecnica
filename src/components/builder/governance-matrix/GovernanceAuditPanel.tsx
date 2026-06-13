"use client";

import React from 'react';
import { GovernanceAuditExpectation } from './governance-matrix-types';
import { ListTodo } from 'lucide-react';

interface GovernanceAuditPanelProps {
  expectations: GovernanceAuditExpectation[];
}

export function GovernanceAuditPanel({ expectations }: GovernanceAuditPanelProps) {
  if (!expectations || expectations.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 text-sm">
        Nenhuma expectativa de trilha de auditoria definida.
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      <div>
        <h4 className="text-sm font-medium text-slate-900">Audit Expectations</h4>
        <p className="text-xs text-slate-500">Campos obrigatórios esperados na trilha de auditoria para ações sensíveis.</p>
      </div>

      <div className="space-y-2">
        {expectations.map((exp) => (
          <div key={exp.id} className="flex flex-col gap-1 border rounded p-3 bg-white text-sm">
            <div className="flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-slate-400" />
              <span className="font-medium font-mono text-xs text-slate-600 bg-slate-100 px-1 py-0.5 rounded">
                Action: {exp.action}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Expected Data: <span className="font-medium text-slate-800">{exp.expected_data}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}
