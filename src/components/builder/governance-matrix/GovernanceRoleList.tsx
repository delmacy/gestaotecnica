"use client";

import React from 'react';
import { GovernanceRole } from './governance-matrix-types';
import { Badge } from '@/components/ui/badge';
import { Users, Info } from 'lucide-react';

interface GovernanceRoleListProps {
  roles: GovernanceRole[];
  selectedRoleId: string | null;
  onSelectRole: (id: string) => void;
}

export function GovernanceRoleList({ roles, selectedRoleId, onSelectRole }: GovernanceRoleListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Papéis (Roles)</h3>
      <div className="flex flex-col gap-1 border rounded-md p-2 bg-slate-50">
        {roles.map(role => (
          <div
            key={role.id}
            className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm ${selectedRoleId === role.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-100 text-slate-700'}`}
            onClick={() => onSelectRole(role.id)}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{role.label}</span>
            </div>
            {role.data_source_mode === 'existing_profile_reference' && (
              <div title="Existing Profile Reference">
                <Badge variant="outline" className="text-[10px] h-5 px-1 bg-blue-50 text-blue-700 border-blue-200 cursor-help flex items-center gap-1">
                  <Info className="w-3 h-3" /> ref
                </Badge>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
