import React from 'react';
import { ProcessPilot } from './process-mirroring-types';
import { Badge } from '@/components/ui/badge';

interface ProcessPilotListProps {
  pilots: ProcessPilot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ProcessPilotList({ pilots, selectedId, onSelect }: ProcessPilotListProps) {
  if (pilots.length === 0) {
    return <div className="p-4 text-sm text-slate-500">No pilots found.</div>;
  }

  return (
    <div className="divide-y">
      {pilots.map((pilot) => (
        <button
          key={pilot.id}
          onClick={() => onSelect(pilot.id)}
          className={`w-full text-left p-4 hover:bg-slate-100 transition-colors ${
            selectedId === pilot.id ? 'bg-slate-100 border-l-4 border-blue-500' : ''
          }`}
        >
          <div className="font-medium text-slate-900">{pilot.name}</div>
          <div className="text-sm text-slate-500 mb-2 truncate">{pilot.description}</div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">{pilot.status}</Badge>
            <Badge variant="secondary" className="text-xs">{pilot.data_source_mode}</Badge>
          </div>
        </button>
      ))}
    </div>
  );
}
