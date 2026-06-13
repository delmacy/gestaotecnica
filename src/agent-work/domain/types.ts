export type PackageStatus = "planned" | "in_progress" | "done" | "blocked";

export interface WorkPackage {
  key: string;
  title: string;
  moduleKey: string;
  laneKey: string;
  workerRole: string;
  waveKey: string;
  packageSize: string;
  priority: number;
  status: PackageStatus;
  objective: string;
  expectedOutcome: string;
  entryGate?: string | null;
  exitGate?: string | null;
  baseBranch: string;
  baseSha: string;
  targetBranch: string;
  integrationBranch: string;
  ownedPaths: string[];
  readOnlyPaths: string[];
  forbiddenPaths: string[];
  readFirst: string[];
  requiredTests: string[];
  acceptanceCriteria: string[];
  documentationImpacts: string[];
  integrationRisk: string;
  mergeOrder: number;
  rollbackNotes?: string | null;
  assignedWorkerKey?: string | null;
  revision: number;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date | null;
  completedAt?: Date | null;
}

export interface TaskKit {
  workerKey: string;
  workerRole: string;
  moduleKey: string;
  packageKey: string;
  waveKey: string;
  baseSha: string;
  targetBranch: string;
  integrationBranch: string;
  objective: string;
  readFirst: string[];
  ownedPaths: string[];
  readOnlyPaths: string[];
  forbiddenPaths: string[];
  dependencies: string[];
  contractsConsumed: string[];
  contractsProduced: string[];
  tasks: Array<{ id: string; description: string; order: number }>;
  acceptanceCriteria: string[];
  requiredTests: string[];
  documentationImpact: string[];
  securityGate: boolean;
  tenancyGate: boolean;
  migrationGate: boolean;
  receiptPath: string;
  handoff?: string;
  rollback?: string;
  completionCommands: string[];
}
