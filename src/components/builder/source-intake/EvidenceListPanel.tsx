import React from 'react';
import { Source } from './source-intake-types';

interface Props {
  source: Source;
}

export function EvidenceListPanel({ source }: Props) {
  return (
    <div className="p-4">
      <h3 className="font-bold mb-4">Evidences ({source.evidences.length})</h3>
      <ul className="list-disc pl-5">
        {source.evidences.map(e => (
          <li key={e.id} className="mb-2">
            <strong>{e.title}</strong> ({e.type}) - {e.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
