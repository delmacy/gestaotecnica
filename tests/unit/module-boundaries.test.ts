import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Recursively find all files in a directory
 */
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

/**
 * Extract imports from a file content
 */
function extractImports(content: string): string[] {
  const imports: string[] = [];

  const standardImportRegex = /(?:import|export)\s+.*?\s+from\s+['"](.*?)['"]/g;
  const sideEffectImportRegex = /import\s+['"](.*?)['"]/g;
  const dynamicImportRegex = /import\(['"](.*?)['"]\)/g;

  let match;
  while ((match = standardImportRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  while ((match = sideEffectImportRegex.exec(content)) !== null) {
    if (!imports.includes(match[1])) {
      imports.push(match[1]);
    }
  }
  while ((match = dynamicImportRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  return imports;
}

/**
 * Resolve import path to a normalized project path
 */
function resolveImport(importPath: string, sourceFilePath: string): string {
  if (importPath.startsWith('@/')) {
    return importPath.replace('@/', 'src/');
  }
  if (importPath.startsWith('.')) {
    const dir = path.dirname(sourceFilePath);
    const resolved = path.join(dir, importPath);
    return resolved.replace(/\\/g, '/'); // Normalize windows paths
  }
  return importPath; // External package
}

interface Violation {
  file: string;
  import: string;
  rule: string;
  severity: 'BLOCKER' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
}

const violations: Violation[] = [];

function addViolation(file: string, importPath: string, rule: string, severity: Violation['severity']) {
  violations.push({ file, import: importPath, rule, severity });
}

// 1. Scan all files
const allFiles = getAllFiles('src');

// 2. Map indices
const indices = allFiles.filter(f => f.endsWith('index.ts') || f.endsWith('index.tsx'))
                        .map(f => path.dirname(f).replace(/\\/g, '/'))
                        .filter(dir => dir !== 'src'); // Avoid src/index.ts making everything a deep import

// 3. Define Rules
const boundaryRules = [
  {
    name: 'Shared Contracts boundaries',
    path: 'src/platform/contracts',
    forbidden: ['src/platform/workflows', 'src/platform/events', 'src/components', 'src/app', 'src/db', 'next'],
    severity: 'BLOCKER' as const
  },
  {
    name: 'Events boundaries',
    path: 'src/platform/events',
    forbidden: ['src/platform/workflows', 'src/components', 'src/app', 'src/db', 'next'],
    severity: 'BLOCKER' as const
  },
  {
    name: 'Runtime boundaries',
    path: 'src/platform/workflows',
    forbidden: ['src/platform/events/event-log-service', 'src/components', 'src/app', 'src/db', 'next'],
    severity: 'BLOCKER' as const
  },
  {
    name: 'Form Builder Contracts boundaries',
    path: 'src/components/builder/form-builder/contracts',
    forbidden: ['src/platform/workflows', 'src/platform/events', 'src/db', 'next'],
    severity: 'BLOCKER' as const
  },
  {
    name: 'Form Builder Adapters boundaries',
    path: 'src/components/builder/form-builder/persistence',
    forbidden: ['src/db', 'src/platform/workflows'],
    severity: 'HIGH' as const
  },
  {
    name: 'Registry boundaries',
    path: 'src/platform/registry',
    forbidden: ['src/components', 'src/app', 'src/platform/workflows', 'src/db'],
    severity: 'HIGH' as const
  }
];

// 4. Run Analysis
allFiles.forEach(file => {
  const normalizedFile = file.replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf-8');
  const imports = extractImports(content);

  imports.forEach(imp => {
    const resolvedImp = resolveImport(imp, normalizedFile);

    // Boundary rules
    boundaryRules.forEach(rule => {
      if (normalizedFile.includes(rule.path)) {
        rule.forbidden.forEach(forbidden => {
          if (resolvedImp.startsWith(forbidden) || (forbidden === 'next' && imp === 'next')) {
            addViolation(normalizedFile, imp, rule.rule ?? rule.name, rule.severity);
          }
        });
      }
    });

    // Specific Detections

    // imports de Next.js em mappers
    if (normalizedFile.includes('/mappers/') && (imp.startsWith('next') || resolvedImp.startsWith('next'))) {
      addViolation(normalizedFile, imp, 'Next.js import in mapper', 'HIGH');
    }

    // imports de React em contratos
    if (normalizedFile.includes('/contracts/') && (imp.startsWith('react') || resolvedImp.startsWith('react'))) {
      addViolation(normalizedFile, imp, 'React import in contract', 'HIGH');
    }

    // imports de banco em tipos canônicos (contracts)
    if (normalizedFile.includes('/contracts/') && (resolvedImp.startsWith('src/db') || imp === '@/db')) {
      addViolation(normalizedFile, imp, 'Database import in canonical contract', 'BLOCKER');
    }

    // imports circulares entre runtime e events
    if (normalizedFile.includes('src/platform/events') && resolvedImp.includes('src/platform/workflows')) {
      addViolation(normalizedFile, imp, 'Circular dependency: Events -> Runtime', 'BLOCKER');
    }
    if (normalizedFile.includes('src/platform/workflows') && resolvedImp.includes('src/platform/events') && !resolvedImp.includes('/types') && !resolvedImp.includes('/contracts')) {
      // Runtime can depend on Event TYPES, but not Event SERVICES (already in boundary rules)
    }

    // acesso do Form Builder ao runtime
    if (normalizedFile.includes('src/components/builder/form-builder') && resolvedImp.includes('src/platform/workflows')) {
      addViolation(normalizedFile, imp, 'Form Builder access to Runtime', 'BLOCKER');
    }

    // acesso do registry à UI
    if (normalizedFile.includes('src/platform/registry') && (resolvedImp.startsWith('src/components') || resolvedImp.startsWith('src/app'))) {
      addViolation(normalizedFile, imp, 'Registry access to UI', 'HIGH');
    }

    // módulos de infraestrutura dentro de contracts
    if (normalizedFile.includes('/contracts/') && (resolvedImp.includes('/infra/') || resolvedImp.includes('/persistence/'))) {
      addViolation(normalizedFile, imp, 'Infra/Persistence import in contract', 'HIGH');
    }

    // Aliases quebrados
    if (imp.startsWith('@/') && !imp.startsWith('@/db') && !imp.startsWith('@/app')) {
       const possiblePath = resolvedImp.endsWith('.ts') || resolvedImp.endsWith('.tsx') ? resolvedImp : resolvedImp + '.ts';
       const possiblePathTsx = resolvedImp + '.tsx';
       const possiblePathIndex = path.join(resolvedImp, 'index.ts').replace(/\\/g, '/');
       const possiblePathIndexTsx = path.join(resolvedImp, 'index.tsx').replace(/\\/g, '/');

       if (!fs.existsSync(resolvedImp) &&
           !fs.existsSync(possiblePath) &&
           !fs.existsSync(possiblePathTsx) &&
           !fs.existsSync(possiblePathIndex) &&
           !fs.existsSync(possiblePathIndexTsx)) {
         addViolation(normalizedFile, imp, 'Broken alias or missing file', 'HIGH');
       }
    }

    // Deep internal imports
    if (!normalizedFile.includes('tests/')) {
      indices.forEach(indexDir => {
        if (resolvedImp.startsWith(indexDir + '/') && !normalizedFile.startsWith(indexDir)) {
          addViolation(normalizedFile, imp, `Deep import from ${indexDir}. Use public index instead.`, 'MEDIUM');
        }
      });
    }
  });
});

test('Module boundaries violations', () => {
  // Baseline of existing violations to allow the test to pass but still report them
  const baseline = [
    'src/platform/events/event-log-service.ts',
    'src/platform/registry/actions/kernel-actions.ts',
    'src/platform/registry/application/seed.ts',
    'src/platform/registry/infra/registry.queries.ts',
    'src/platform/workflows/application/kernel-actions.ts',
    'src/platform/workflows/infra/flow-runner-service.ts',
    'src/platform/workflows/runtime.ts'
  ];

  if (violations.length > 0) {
    console.log('\nBoundary violations found:');
    violations.forEach(v => {
      const isBaseline = baseline.some(b => v.file.includes(b));
      console.log(`${isBaseline ? '[BASELINE] ' : ''}[${v.severity}] ${v.file} -> ${v.import} (${v.rule})`);
    });
  }

  const newCriticalViolations = violations.filter(v =>
    (v.severity === 'BLOCKER' || v.severity === 'HIGH') &&
    !baseline.some(b => v.file.includes(b))
  );

  assert.strictEqual(newCriticalViolations.length, 0, `Found ${newCriticalViolations.length} NEW critical boundary violations (not in baseline)`);
});
