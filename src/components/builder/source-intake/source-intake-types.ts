export type SourceStatus = 'mock' | 'synthetic' | 'real_pending' | 'real_blocked';

export interface Evidence {
  id: string;
  title: string;
  type: string;
  description: string;
}

export interface Limitation {
  id: string;
  description: string;
}

export interface Conflict {
  id: string;
  description: string;
}

export interface Gap {
  id: string;
  description: string;
}

export interface Source {
  id: string;
  name: string;
  context: string;
  status: SourceStatus;
  evidences: Evidence[];
  limitations: Limitation[];
  conflicts: Conflict[];
  gaps: Gap[];
  consentStatus: string;
  anonymization: string;
  sensitivity: string;
  reliability: string;
  retention: string;
}
