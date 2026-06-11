import React from 'react';
import { Source } from './source-intake-types';

interface Props {
  source: Source;
}

export function SourceGapsPanel({ source }: Props) {
  return (
    <div className="p-4">
      <h3 className="font-bold mb-4">Gaps ({source.gaps.length})</h3>
      <ul className="list-disc pl-5">
        {source.gaps.map(g => (
          <li key={g.id}>{g.description}</li>
        ))}
      </ul>
    </div>
  );
}
