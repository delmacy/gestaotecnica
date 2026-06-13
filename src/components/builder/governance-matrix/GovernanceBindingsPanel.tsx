"use client";

import React from 'react';
import { GovernanceBinding } from './governance-matrix-types';
import { Link, LayoutTemplate, Workflow, FormInput } from 'lucide-react';

interface GovernanceBindingsPanelProps {
  bindings: GovernanceBinding[];
}

export function GovernanceBindingsPanel({ bindings }: GovernanceBindingsPanelProps) {
  if (!bindings || bindings.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 text-sm">
        Nenhum vínculo detectado com a plataforma.
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'form': return <FormInput className="w-4 h-4 text-slate-500" />;
      case 'view': return <LayoutTemplate className="w-4 h-4 text-slate-500" />;
      case 'workflow': return <Workflow className="w-4 h-4 text-slate-500" />;
      default: return <Link className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div>
        <h4 className="text-sm font-medium text-slate-900">Component Bindings</h4>
        <p className="text-xs text-slate-500">Superfícies e fluxos onde este papel tem influência.</p>
      </div>

      <div className="space-y-2">
        {bindings.map((binding) => (
          <div key={binding.id} className="flex items-center gap-3 border rounded p-2 bg-white text-sm">
            <div className="p-1.5 bg-slate-100 rounded">
              {getIcon(binding.type)}
            </div>
            <div className="flex-1">
              <div className="font-medium text-slate-700 text-xs">{binding.description}</div>
              <div className="text-[10px] text-slate-500 font-mono">ID: {binding.target_id}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
