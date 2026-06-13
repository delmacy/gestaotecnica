"use client";

import React from 'react';
import { GovernancePermission, GovernanceScopeType } from './governance-matrix-types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GovernanceScopePanelProps {
  permission: GovernancePermission;
  onSimulateScope: (scope: GovernanceScopeType) => void;
}

export function GovernanceScopePanel({ permission, onSimulateScope }: GovernanceScopePanelProps) {
  return (
    <div className="space-y-4 py-4">
      <div>
        <h4 className="text-sm font-medium text-slate-900">Scope Boundaries</h4>
        <p className="text-xs text-slate-500">Simulate scope resolution for this permission.</p>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Current Scope</Label>
        <Select
          value={permission.scope || 'not_defined'}
          onValueChange={(val) => onSimulateScope(val as GovernanceScopeType)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="global">Global</SelectItem>
            <SelectItem value="platform">Platform</SelectItem>
            <SelectItem value="workspace">Workspace</SelectItem>
            <SelectItem value="team">Team</SelectItem>
            <SelectItem value="own_records">Own Records</SelectItem>
            <SelectItem value="assigned_records">Assigned Records</SelectItem>
            <SelectItem value="process_instance">Process Instance</SelectItem>
            <SelectItem value="capability">Capability</SelectItem>
            <SelectItem value="future_dynamic_scope">Future Dynamic Scope</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-slate-50 border rounded p-3 text-xs text-slate-700">
        <p>O escopo define até onde esta permissão alcança. Um papel pode ter <strong>view</strong>, mas apenas no escopo <strong>own_records</strong>.</p>
      </div>
    </div>
  );
}
