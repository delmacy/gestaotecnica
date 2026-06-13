"use client";

import React from 'react';
import { GovernancePermission, GovernancePermissionEffect } from './governance-matrix-types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GovernancePermissionDetailPanelProps {
  permission: GovernancePermission;
  onSimulateEffect: (effect: GovernancePermissionEffect) => void;
}

export function GovernancePermissionDetailPanel({ permission, onSimulateEffect }: GovernancePermissionDetailPanelProps) {
  return (
    <div className="space-y-4 py-4">
      <div>
        <h4 className="text-sm font-medium text-slate-900">Permission Details</h4>
        <p className="text-xs text-slate-500">Simulate changes locally.</p>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Action</Label>
        <div className="text-sm font-mono bg-slate-50 p-2 rounded border">{permission.action}</div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Effect</Label>
        <Select
          value={permission.effect}
          onValueChange={(val) => onSimulateEffect(val as GovernancePermissionEffect)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="allowed">Allowed</SelectItem>
            <SelectItem value="denied">Denied</SelectItem>
            <SelectItem value="conditional">Conditional</SelectItem>
            <SelectItem value="approval_required">Approval Required</SelectItem>
            <SelectItem value="future_policy">Future Policy</SelectItem>
            <SelectItem value="not_defined">Not Defined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded p-3 text-xs text-blue-800">
        <strong>Nota de Design:</strong> Alterar o <em>effect</em> aqui apenas simula a matriz visualmente (mock). Nenhuma regra de autorização real é modificada no servidor ou banco de dados.
      </div>
    </div>
  );
}
