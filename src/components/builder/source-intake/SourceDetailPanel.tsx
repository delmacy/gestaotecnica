import React from 'react';
import { Source } from './source-intake-types';

interface Props {
  source: Source;
}

export function SourceDetailPanel({ source }: Props) {
  return (
    <div className="p-4 border rounded bg-white">
      <h2 className="text-xl font-bold mb-2">{source.name}</h2>
      <p className="text-sm text-gray-600 mb-4">{source.context}</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-semibold">Status:</span> {source.status}
        </div>
        <div>
          <span className="font-semibold">Consent:</span> {source.consentStatus}
        </div>
        <div>
          <span className="font-semibold">Anonymization:</span> {source.anonymization}
        </div>
      </div>
    </div>
  );
}
