import React from 'react';
import { Source } from './source-intake-types';

interface Props {
  source: Source;
}

export function SensitivityReliabilityPanel({ source }: Props) {
  return (
    <div className="p-4">
      <h3 className="font-bold mb-4">Sensitivity & Reliability</h3>
      <p><strong>Sensitivity:</strong> {source.sensitivity}</p>
      <p><strong>Reliability:</strong> {source.reliability}</p>
      <p><strong>Retention Policy:</strong> {source.retention}</p>
    </div>
  );
}
