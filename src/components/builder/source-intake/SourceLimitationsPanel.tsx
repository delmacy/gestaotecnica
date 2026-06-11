import React from 'react';
import { Source } from './source-intake-types';

interface Props {
  source: Source;
}

export function SourceLimitationsPanel({ source }: Props) {
  return (
    <div className="p-4">
      <h3 className="font-bold mb-4">Limitations ({source.limitations.length})</h3>
      <ul className="list-disc pl-5">
        {source.limitations.map(l => (
          <li key={l.id}>{l.description}</li>
        ))}
      </ul>
    </div>
  );
}
