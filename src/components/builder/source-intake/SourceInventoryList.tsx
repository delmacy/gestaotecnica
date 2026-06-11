import React from 'react';
import { Source } from './source-intake-types';

interface Props {
  sources: Source[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SourceInventoryList({ sources, selectedId, onSelect }: Props) {
  return (
    <div className="border p-4 rounded bg-gray-50 flex flex-col gap-2 h-full overflow-y-auto">
      <h3 className="font-bold mb-2">Sources Inventory</h3>
      {sources.map(s => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`text-left p-2 rounded border ${
            selectedId === s.id ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-200 hover:bg-gray-100'
          }`}
        >
          <div className="font-semibold">{s.name}</div>
          <div className="text-xs text-gray-500">{s.context}</div>
          <div className="text-xs mt-1">
            <span className={`px-1 py-0.5 rounded text-white ${
              s.status === 'synthetic' ? 'bg-green-500' :
              s.status === 'real_pending' ? 'bg-yellow-500' :
              s.status === 'real_blocked' ? 'bg-red-500' : 'bg-gray-500'
            }`}>
              {s.status}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
