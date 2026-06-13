import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { EnterpriseMapNodeData } from './enterprise-map-types';

export function EnterpriseMapNode({ data, selected }: NodeProps<import('@xyflow/react').Node<EnterpriseMapNodeData>>) {
  const isSynthetic = data.synthetic;
  const isPending = data.dataSourceMode === 'real_pending';
  const isBlocked = data.dataSourceMode === 'real_blocked';

  let bgColor = 'bg-white';
  let borderColor = 'border-slate-300';
  let typeColor = 'text-slate-500';

  switch (data.type) {
    case 'domain':
      bgColor = 'bg-indigo-50';
      borderColor = 'border-indigo-300';
      typeColor = 'text-indigo-600';
      break;
    case 'capability':
      bgColor = 'bg-blue-50';
      borderColor = 'border-blue-300';
      typeColor = 'text-blue-600';
      break;
    case 'process':
    case 'process_step':
    case 'value_stream':
      bgColor = 'bg-emerald-50';
      borderColor = 'border-emerald-300';
      typeColor = 'text-emerald-600';
      break;
    case 'system':
    case 'application':
    case 'integration_placeholder':
      bgColor = 'bg-orange-50';
      borderColor = 'border-orange-300';
      typeColor = 'text-orange-600';
      break;
    case 'data_object':
    case 'document':
      bgColor = 'bg-cyan-50';
      borderColor = 'border-cyan-300';
      typeColor = 'text-cyan-600';
      break;
    case 'actor_role':
    case 'owner_placeholder':
      bgColor = 'bg-purple-50';
      borderColor = 'border-purple-300';
      typeColor = 'text-purple-600';
      break;
    case 'risk':
    case 'gap':
      bgColor = 'bg-red-50';
      borderColor = 'border-red-300';
      typeColor = 'text-red-600';
      break;
    case 'evidence':
    case 'governance_rule':
      bgColor = 'bg-yellow-50';
      borderColor = 'border-yellow-300';
      typeColor = 'text-yellow-600';
      break;
  }

  if (isPending) {
    borderColor = 'border-dashed border-amber-400';
  } else if (isBlocked) {
    borderColor = 'border-dashed border-red-400';
  }

  return (
    <div
      className={`px-4 py-2 shadow-sm rounded-md border-2 w-48 ${bgColor} ${borderColor} ${
        selected ? 'ring-2 ring-blue-500 shadow-md' : ''
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="flex flex-col">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${typeColor}`}>
          {data.type.replace('_', ' ')}
        </span>
        <span className="text-sm font-semibold text-slate-800 break-words">{data.label}</span>
        {isSynthetic && (
          <span className="text-[9px] text-slate-400 mt-1 italic">synthetic</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}
