import React from 'react';
import { Source } from './source-intake-types';

interface Props {
  source: Source;
}

export function SourceConflictsPanel({ source }: Props) {
  return (
    <div className="p-4">
      <h3 className="font-bold mb-4">Conflicts ({source.conflicts.length})</h3>
      <ul className="list-disc pl-5">
        {source.conflicts.map(c => (
          <li key={c.id}>{c.description}</li>
        ))}
      </ul>
    </div>
  );
}
