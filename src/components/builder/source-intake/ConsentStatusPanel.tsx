import React from 'react';
import { Source } from './source-intake-types';

interface Props {
  source: Source;
}

export function ConsentStatusPanel({ source }: Props) {
  return (
    <div className="p-4">
      <h3 className="font-bold mb-4">Consent & Anonymization</h3>
      <p><strong>Consent Status:</strong> {source.consentStatus}</p>
      <p><strong>Anonymization Level:</strong> {source.anonymization}</p>
      <div className="mt-4 p-2 bg-yellow-50 text-sm border border-yellow-200">
        Note: Real PII must never enter the platform. Ensure anonymization is complete before changing status from pending.
      </div>
    </div>
  );
}
