import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

// --- TYPES ---

export type Severity = 'BLOCKER' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface Violation {
  file: string;
  importPath: string;
  ruleName: string;
  severity: Severity;
}

export interface BaselineEntry {
  file: string;
  importPath: string;
  ruleName: string;
  severity: Severity;
}

export interface BoundaryRule {
  name: string;
  path: string;
  forbidden: string[];
  severity: Severity;
}

export interface AnalysisConfig {
  root: string;
  boundaryRules: BoundaryRule[];
  baseline: BaselineEntry[];
  publicIndices: string[];
}

// --- UTILS ---

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

function extractImports(content: string): string[] {
  const imports: string[] = [];
  const standardImportRegex = /(?:import|export)\s+(?:type\s+)?[\s\S]*?\s*from\s+['"](.*?)['"]/g;
  const sideEffectImportRegex = /import\s+['"](.*?)['"]/g;
  const dynamicImportRegex = /import\(['"](.*?)['"]\)/g;
  const danglingFromRegex = /\}\s+from\s+['"](.*?)['"]/g;

  let match;
  while ((match = standardImportRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  while ((match = sideEffectImportRegex.exec(content)) !== null) {
    if (!imports.includes(match[1])) imports.push(match[1]);
  }
  while ((match = dynamicImportRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  while ((match = danglingFromRegex.exec(content)) !== null) {
    if (!imports.includes(match[1])) imports.push(match[1]);
  }

  return imports;
}

function resolveImport(imp: string, sourceFile: string): string {
  if (imp.startsWith('@/')) return imp.replace('@/', 'src/');
  if (imp.startsWith('.')) {
    const dir = path.dirname(sourceFile);
    return path.join(dir, imp).replace(/\\/g, '/');
  }
  return imp;
}

// --- ANALYZER ---

export function analyze(config: AnalysisConfig, virtualFiles?: Record<string, string>): Violation[] {
  const violations: Violation[] = [];
  const files = virtualFiles ? Object.keys(virtualFiles) : getAllFiles(config.root);

  const normalizedPublicIndices = config.publicIndices.map(p => p.replace(/\\/g, '/'));
  const publicIndexDirs = normalizedPublicIndices.map(p => path.dirname(p).replace(/\\/g, '/'));

  files.forEach(file => {
    const normalizedFile = file.replace(/\\/g, '/');
    const content = virtualFiles ? virtualFiles[file] : fs.readFileSync(file, 'utf-8');
    const imports = extractImports(content);

    imports.forEach(imp => {
      const resolvedImp = resolveImport(imp, normalizedFile);

      // 1. Boundary Rules
      config.boundaryRules.forEach(rule => {
        if (normalizedFile.includes(rule.path)) {
          rule.forbidden.forEach(forbidden => {
            if (resolvedImp.startsWith(forbidden) || (forbidden === 'next' && imp === 'next')) {
              violations.push({ file: normalizedFile, importPath: imp, ruleName: rule.name, severity: rule.severity });
            }
          });
        }
      });

      // 2. Specific Detections

      // Next.js in mappers
      if (normalizedFile.includes('/mappers/') && (imp.startsWith('next') || resolvedImp.startsWith('next'))) {
        violations.push({ file: normalizedFile, importPath: imp, ruleName: 'Next.js import in mapper', severity: 'HIGH' });
      }

      // React in contracts
      if (normalizedFile.includes('/contracts/') && (imp.startsWith('react') || resolvedImp.startsWith('react'))) {
        violations.push({ file: normalizedFile, importPath: imp, ruleName: 'React import in contract', severity: 'HIGH' });
      }

      // Database in canonical contracts
      if (normalizedFile.includes('src/platform/contracts/') && (resolvedImp.startsWith('src/db') || imp === '@/db')) {
        violations.push({ file: normalizedFile, importPath: imp, ruleName: 'Database import in canonical type', severity: 'BLOCKER' });
      }

      // Circular/Prohibited Cycles: Events <-> Runtime
      if (normalizedFile.includes('src/platform/events') && resolvedImp.includes('src/platform/workflows')) {
        violations.push({ file: normalizedFile, importPath: imp, ruleName: 'Prohibited cycle: Events -> Runtime', severity: 'BLOCKER' });
      }
      if (normalizedFile.includes('src/platform/workflows') && resolvedImp.includes('src/platform/events')) {
        // Allowed: event types
        const isAllowedEventImport = resolvedImp.includes('/types/') || resolvedImp.endsWith('/types') || resolvedImp.includes('/contracts/') || resolvedImp.endsWith('/contracts');
        if (!isAllowedEventImport) {
          violations.push({ file: normalizedFile, importPath: imp, ruleName: 'Prohibited cycle: Runtime -> Events Service', severity: 'BLOCKER' });
        }
      }

      // Form Builder access to Runtime
      if (normalizedFile.includes('src/components/builder/form-builder') && resolvedImp.includes('src/platform/workflows')) {
        violations.push({ file: normalizedFile, importPath: imp, ruleName: 'Form Builder access to Runtime', severity: 'BLOCKER' });
      }

      // Registry access to UI
      if (normalizedFile.includes('src/platform/registry') && (resolvedImp.startsWith('src/components') || resolvedImp.startsWith('src/app'))) {
        violations.push({ file: normalizedFile, importPath: imp, ruleName: 'Registry access to UI', severity: 'HIGH' });
      }

      // Infra/Persistence in contracts
      if (normalizedFile.includes('/contracts/') && (resolvedImp.includes('/infra/') || resolvedImp.includes('/persistence/'))) {
        violations.push({ file: normalizedFile, importPath: imp, ruleName: 'Infra/Persistence import in contract', severity: 'HIGH' });
      }

      // Broken Aliases
      if (imp.startsWith('@/') && !imp.startsWith('@/db') && !imp.startsWith('@/app') && !virtualFiles) {
        const possiblePaths = [resolvedImp, resolvedImp + '.ts', resolvedImp + '.tsx', path.join(resolvedImp, 'index.ts'), path.join(resolvedImp, 'index.tsx')].map(p => p.replace(/\\/g, '/'));
        if (!possiblePaths.some(p => fs.existsSync(p))) {
          violations.push({ file: normalizedFile, importPath: imp, ruleName: 'Broken alias or missing file', severity: 'HIGH' });
        }
      }

      // Deep internal imports
      if (!normalizedFile.includes('tests/')) {
        publicIndexDirs.forEach((indexDir, idx) => {
          if (resolvedImp.startsWith(indexDir + '/') && !normalizedFile.startsWith(indexDir) && resolvedImp !== normalizedPublicIndices[idx]) {
            violations.push({ file: normalizedFile, importPath: imp, ruleName: 'Deep import from ' + indexDir + '. Use public index instead.', severity: 'MEDIUM' });
          }
        });
      }
    });
  });

  return violations;
}

// --- CONFIGURATION ---

const boundaryRules: BoundaryRule[] = [
  {
    name: 'Shared Contracts boundaries',
    path: 'src/platform/contracts',
    forbidden: ['src/platform/workflows', 'src/platform/events', 'src/components', 'src/app', 'src/db', 'next'],
    severity: 'BLOCKER'
  },
  {
    name: 'Events boundaries',
    path: 'src/platform/events',
    forbidden: ['src/platform/workflows', 'src/components', 'src/app', 'src/db', 'next'],
    severity: 'BLOCKER'
  },
  {
    name: 'Runtime boundaries',
    path: 'src/platform/workflows',
    forbidden: ['src/platform/events/event-log-service', 'src/components', 'src/app', 'src/db', 'next'],
    severity: 'BLOCKER'
  },
  {
    name: 'Form Builder Contracts boundaries',
    path: 'src/components/builder/form-builder/contracts',
    forbidden: ['src/platform/workflows', 'src/platform/events', 'src/db', 'next'],
    severity: 'BLOCKER'
  },
  {
    name: 'Form Builder Adapters boundaries',
    path: 'src/components/builder/form-builder/adapters',
    forbidden: ['src/db', 'src/platform/workflows', 'react', 'next'],
    severity: 'HIGH'
  },
  {
    name: 'Form Builder Persistence boundaries',
    path: 'src/components/builder/form-builder/persistence',
    forbidden: ['src/components', 'src/app', 'src/platform/workflows'],
    severity: 'HIGH'
  },
  {
    name: 'Registry boundaries',
    path: 'src/platform/registry',
    forbidden: ['src/components', 'src/app', 'src/platform/workflows', 'src/db'],
    severity: 'HIGH'
  }
];

const baseline: BaselineEntry[] = [
  { file: 'src/components/builder/form-builder/persistence/form-persistence-port.ts', importPath: '../contracts/form-definition-contract', ruleName: 'Form Builder Persistence boundaries', severity: 'HIGH' },
  { file: 'src/components/builder/form-builder/persistence/in-memory-form-persistence.ts', importPath: '../contracts/form-definition-contract', ruleName: 'Form Builder Persistence boundaries', severity: 'HIGH' },
  { file: 'src/components/builder/form-builder/persistence/in-memory-form-persistence.ts', importPath: './form-persistence-port', ruleName: 'Form Builder Persistence boundaries', severity: 'HIGH' },
  { file: 'src/components/builder/form-builder/persistence/in-memory-form-persistence.ts', importPath: './errors', ruleName: 'Form Builder Persistence boundaries', severity: 'HIGH' },
  { file: 'src/platform/events/event-log-service.ts', importPath: '@/db', ruleName: 'Events boundaries', severity: 'BLOCKER' },
  { file: 'src/platform/events/event-log-service.ts', importPath: '@/db/runtime/schema/workflow', ruleName: 'Events boundaries', severity: 'BLOCKER' },
  { file: 'src/platform/events/event-log-service.ts', importPath: '@/db/runtime/schema/workflow', ruleName: 'Deep import from src/db. Use public index instead.', severity: 'MEDIUM' },
  { file: 'src/platform/registry/actions/kernel-actions.ts', importPath: '@/db', ruleName: 'Registry boundaries', severity: 'HIGH' },
  { file: 'src/platform/registry/actions/kernel-actions.ts', importPath: '@/db/platform/schema/registry', ruleName: 'Registry boundaries', severity: 'HIGH' },
  { file: 'src/platform/registry/actions/kernel-actions.ts', importPath: '@/db/platform/schema/registry', ruleName: 'Deep import from src/db. Use public index instead.', severity: 'MEDIUM' },
  { file: 'src/platform/registry/application/seed.ts', importPath: '@/db', ruleName: 'Registry boundaries', severity: 'HIGH' },
  { file: 'src/platform/registry/application/seed.ts', importPath: '@/db/platform/schema/registry', ruleName: 'Registry boundaries', severity: 'HIGH' },
  { file: 'src/platform/registry/application/seed.ts', importPath: '@/db/platform/schema/registry', ruleName: 'Deep import from src/db. Use public index instead.', severity: 'MEDIUM' },
  { file: 'src/platform/registry/infra/registry.queries.ts', importPath: '@/db', ruleName: 'Registry boundaries', severity: 'HIGH' },
  { file: 'src/platform/registry/infra/registry.queries.ts', importPath: '@/db/platform/schema/registry', ruleName: 'Registry boundaries', severity: 'HIGH' },
  { file: 'src/platform/registry/infra/registry.queries.ts', importPath: '@/db/platform/schema/registry', ruleName: 'Deep import from src/db. Use public index instead.', severity: 'MEDIUM' },
  { file: 'src/platform/workflows/application/kernel-actions.ts', importPath: '@/db', ruleName: 'Runtime boundaries', severity: 'BLOCKER' },
  { file: 'src/platform/workflows/application/kernel-actions.ts', importPath: '@/db/runtime/schema/workflow', ruleName: 'Runtime boundaries', severity: 'BLOCKER' },
  { file: 'src/platform/workflows/application/kernel-actions.ts', importPath: '@/db/runtime/schema/workflow', ruleName: 'Deep import from src/db. Use public index instead.', severity: 'MEDIUM' },
  { file: 'src/platform/workflows/infra/flow-runner-service.ts', importPath: '@/db', ruleName: 'Runtime boundaries', severity: 'BLOCKER' },
  { file: 'src/platform/workflows/infra/flow-runner-service.ts', importPath: '@/db/runtime/schema/workflow', ruleName: 'Runtime boundaries', severity: 'BLOCKER' },
  { file: 'src/platform/workflows/infra/flow-runner-service.ts', importPath: '@/db/runtime/schema/workflow', ruleName: 'Deep import from src/db. Use public index instead.', severity: 'MEDIUM' },
  { file: 'src/platform/workflows/infra/flow-runner-service.ts', importPath: '@/platform/events', ruleName: 'Prohibited cycle: Runtime -> Events Service', severity: 'BLOCKER' },
  { file: 'src/platform/workflows/infra/process-orchestrator.ts', importPath: '@/platform/events', ruleName: 'Prohibited cycle: Runtime -> Events Service', severity: 'BLOCKER' },
  { file: 'src/platform/workflows/runtime.ts', importPath: '@/db', ruleName: 'Runtime boundaries', severity: 'BLOCKER' },
  { file: 'src/platform/workflows/runtime.ts', importPath: '@/db/runtime/schema/workflow', ruleName: 'Runtime boundaries', severity: 'BLOCKER' },
  { file: 'src/platform/workflows/runtime.ts', importPath: '@/db/runtime/schema/workflow', ruleName: 'Deep import from src/db. Use public index instead.', severity: 'MEDIUM' }
];

const publicIndices = [
  'src/platform/contracts/index.ts',
  'src/platform/events/index.ts',
  'src/platform/workflows/runtime.ts', // Serving as entrypoint
  'src/db/index.ts'
];

// --- EXECUTION ---

test('Boundary Verifier Self-Tests', async (t) => {
  const config: AnalysisConfig = { root: 'fake', boundaryRules, baseline: [], publicIndices };

  await t.test('detects Next.js in mapper', () => {
    const virtualFiles = { 'src/platform/events/mappers/test.ts': "import { next } from 'next';" };
    const res = analyze(config, virtualFiles);
    assert.ok(res.some(v => v.ruleName === 'Next.js import in mapper'));
  });

  await t.test('detects React in contract', () => {
    const virtualFiles = { 'src/platform/contracts/test.ts': "import React from 'react';" };
    const res = analyze(config, virtualFiles);
    assert.ok(res.some(v => v.ruleName === 'React import in contract'));
  });

  await t.test('detects database in canonical type', () => {
    const virtualFiles = { 'src/platform/contracts/test.ts': "import { db } from '@/db';" };
    const res = analyze(config, virtualFiles);
    assert.ok(res.some(v => v.ruleName === 'Database import in canonical type'));
  });

  await t.test('detects Events -> Runtime cycle', () => {
    const virtualFiles = { 'src/platform/events/test.ts': "import { r } from '@/platform/workflows/runtime';" };
    const res = analyze(config, virtualFiles);
    assert.ok(res.some(v => v.ruleName === 'Prohibited cycle: Events -> Runtime'));
  });

  await t.test('detects Runtime -> Events Service cycle', () => {
    const virtualFiles = { 'src/platform/workflows/test.ts': "import { e } from '@/platform/events/event-log-service';" };
    const res = analyze(config, virtualFiles);
    assert.ok(res.some(v => v.ruleName === 'Prohibited cycle: Runtime -> Events Service'));
  });

  await t.test('allows Runtime -> Events Types', () => {
    const virtualFiles = { 'src/platform/workflows/test.ts': "import { e } from '@/platform/events/types/canonical-event';" };
    const res = analyze(config, virtualFiles);
    assert.strictEqual(res.filter(v => v.ruleName.includes('Prohibited cycle')).length, 0);
  });

  await t.test('detects Registry -> UI', () => {
    const virtualFiles = { 'src/platform/registry/test.ts': "import { c } from '@/components/button';" };
    const res = analyze(config, virtualFiles);
    assert.ok(res.some(v => v.ruleName === 'Registry access to UI'));
  });

  await t.test('detects dangling from imports', () => {
    const virtualFiles = { 'src/test.ts': '} from "@' + '/db/runtime/schema/workflow";' };
    const res = analyze(config, virtualFiles);
    assert.ok(res.some(v => v.importPath === '@/db/runtime/schema/workflow'));
  });

  await t.test('detects deep import through public index', () => {
    const virtualFiles = { 'src/other/test.ts': "import { c } from '@/platform/contracts/actor';" };
    const res = analyze(config, virtualFiles);
    assert.ok(res.some(v => v.ruleName.includes('Deep import from src/platform/contracts')));
  });

  await t.test('allows import through public index', () => {
    const virtualFiles = { 'src/other/test.ts': "import { c } from '@/platform/contracts';" };
    const res = analyze(config, virtualFiles);
    assert.strictEqual(res.filter(v => v.ruleName.includes('Deep import')).length, 0);
  });
});

test('Production Module Boundaries Audit', () => {
  const config: AnalysisConfig = { root: 'src', boundaryRules, baseline, publicIndices };
  const allViolations = analyze(config);

  const isBaseline = (v: Violation) => baseline.some(b =>
    b.file === v.file &&
    b.importPath === v.importPath &&
    b.ruleName === v.ruleName &&
    b.severity === v.severity
  );

  const criticalViolations = allViolations.filter(v => v.severity === 'BLOCKER' || v.severity === 'HIGH');
  const newCritical = criticalViolations.filter(v => !isBaseline(v));

  if (allViolations.length > 0) {
    console.log('\nBoundary violations found:');
    allViolations.forEach(v => {
      const b = isBaseline(v);
      if (!b && (v.severity === 'BLOCKER' || v.severity === 'HIGH')) {
          console.log('[NEW CRITICAL] [' + v.severity + '] ' + v.file + ' -> ' + v.importPath + ' (' + v.ruleName + ')');
      } else {
          console.log((b ? '[BASELINE] ' : '') + '[' + v.severity + '] ' + v.file + ' -> ' + v.importPath + ' (' + v.ruleName + ')');
      }
    });
  }

  if (newCritical.length > 0) {
      console.log('\nFAILED: Found NEW critical boundary violations:');
      newCritical.forEach(v => console.log(JSON.stringify(v, null, 2)));
  }

  assert.strictEqual(newCritical.length, 0, 'Found ' + newCritical.length + ' NEW critical boundary violations');
});
