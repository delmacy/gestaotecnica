"use client";

import React from 'react';
import { GovernancePermission } from './governance-matrix-types';
import { CheckCircle2, XCircle, AlertTriangle, Shield, HelpCircle, Lock } from 'lucide-react';

interface GovernancePermissionCellProps {
  permission?: GovernancePermission;
  isSelected: boolean;
  onClick: () => void;
}

export function GovernancePermissionCell({ permission, isSelected, onClick }: GovernancePermissionCellProps) {
  if (!permission) {
    return (
      <div
        className={`w-full h-10 border rounded flex items-center justify-center bg-slate-50 cursor-pointer ${isSelected ? 'ring-2 ring-primary border-primary' : 'hover:bg-slate-100'}`}
        onClick={onClick}
      >
        <span className="text-slate-300 text-xs">-</span>
      </div>
    );
  }

  const { effect } = permission;

  let bgClass = '';
  let icon = null;

  switch (effect) {
    case 'allowed':
      bgClass = 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      icon = <CheckCircle2 className="w-4 h-4 text-green-600" />;
      break;
    case 'denied':
      bgClass = 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
      icon = <XCircle className="w-4 h-4 text-red-500" />;
      break;
    case 'conditional':
      bgClass = 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100';
      icon = <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      break;
    case 'approval_required':
      bgClass = 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      icon = <Shield className="w-4 h-4 text-blue-600" />;
      break;
    case 'future_policy':
      bgClass = 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
      icon = <Lock className="w-4 h-4 text-purple-500" />;
      break;
    case 'not_defined':
    default:
      bgClass = 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100';
      icon = <HelpCircle className="w-4 h-4 text-slate-400" />;
      break;
  }

  return (
    <div
      className={`w-full h-10 border rounded flex items-center justify-center cursor-pointer transition-colors ${bgClass} ${isSelected ? 'ring-2 ring-primary shadow-sm' : ''}`}
      onClick={onClick}
      title={`Effect: ${effect}. ${effect === 'denied' ? 'Access blocked: You do not have permission.' : ''}`}
    >
      {icon}
    </div>
  );
}
