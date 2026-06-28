import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ALLOWED_STATES = [
  'planned',
  'ready',
  'in_progress',
  'review',
  'blocked',
  'approved',
  'merged',
  'superseded',
  'closed-unmerged',
  'unmapped',
  'investigar',
];

const ALLOWED_OWNERS = [
  'governance',
  'platform/core',
  'platform/events',
  'platform/builder',
  'platform/capabilities',
  'platform/persistence',
  'platform/observability',
  'platform/deployment',
  'modules/workforce',
  'modules/scheduling',
  'modules/cases',
  'modules/approvals',
  'modules/inventory',
  'modules/assets',
  'modules/documents',
  'integration',
  'unassigned',
];

export const OFFICIAL_ID_REGEX = /^SB-S\d{2}-T\d{2}$/;

export function parseMarkdownTable(content) {
  const lines = content.split('\n');
  const tableLines = lines.filter(line => line.trim().startsWith('|'));
  if (tableLines.length < 2) return [];

  const headers = tableLines[0]
    .split('|')
    .map(h => h.trim())
    .filter(h => h !== '');

  const rows = [];
  // Skip headers and the separator line (|---|---|...)
  for (let i = 2; i < tableLines.length; i++) {
    const cells = tableLines[i]
      .split('|')
      .map(c => c.trim())
      .filter((_, index, array) => index > 0 && index < array.length - 1);

    if (cells.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = cells[index];
      });
      rows.push(row);
    }
  }
  return rows;
}

export class Validator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.tasks = new Map();
    this.artifacts = [];
    this.dependencies = 0;
  }

  addError(code, file, item, message, evidence) {
    this.errors.push({ code, file, item, message, evidence });
  }

  addWarning(code, file, item, message, evidence) {
    this.warnings.push({ code, file, item, message, evidence });
  }

  validateId(id, file, item, isOfficial = true) {
    if (!id || id === 'N/A' || id === 'unmapped') return true;
    if (isOfficial) {
      if (!OFFICIAL_ID_REGEX.test(id)) {
        this.addError('INVALID_ID_FORMAT', file, item, `ID "${id}" does not follow the official pattern ^SB-S\\d{2}-T\\d{2}$`, id);
        return false;
      }
    }
    return true;
  }

  validateState(state, file, item) {
    if (!state || state === 'N/A') return true;
    if (!ALLOWED_STATES.includes(state)) {
      this.addError('INVALID_STATE', file, item, `State "${state}" is not in the allowed list`, state);
      return false;
    }
    return true;
  }

  validateOwner(owner, file, item) {
    if (!owner || owner === 'N/A') return true;
    if (!ALLOWED_OWNERS.includes(owner)) {
      this.addError('INVALID_OWNER', file, item, `Owner "${owner}" is not in the allowed list`, owner);
      return false;
    }
    return true;
  }

  validateFileReference(ref, file, item) {
    if (!ref || ref === 'N/A' || ref.startsWith('http') || ref.startsWith('PR #') || ref.startsWith('Issue #')) return true;

    // Check if it's a local path
    const fullPath = path.resolve(process.cwd(), ref);
    if (!fs.existsSync(fullPath)) {
      // It might be a branch or other reference that is not a file,
      // but the requirement says "Verificar se caminhos locais usados como referências realmente existem no repositório"
      // So we should be careful what we consider a file reference.
      // Usually artifacts like .md or directories.
      if (ref.includes('.') || ref.includes('/')) {
         this.addWarning('MISSING_FILE', file, item, `Local reference "${ref}" not found in repository`, ref);
      }
    }
    return true;
  }

  validateIndex(rows, filePath) {
    rows.forEach((row, index) => {
      const itemLabel = `Line ${index + 3}`;
      const id = row.ID;

      if (!id || id === 'N/A') {
        this.addError('MISSING_REQUIRED_FIELD', filePath, itemLabel, 'ID is missing in TASK_INDEX', '');
      } else {
        if (this.tasks.has(id)) {
          this.addError('DUPLICATE_ID', filePath, itemLabel, `Duplicate ID "${id}" found in TASK_INDEX`, id);
        }
        this.validateId(id, filePath, itemLabel);
        this.tasks.set(id, { ...row, source: 'index' });
      }

      if (!row.Sprint || row.Sprint === 'N/A') this.addError('MISSING_REQUIRED_FIELD', filePath, itemLabel, 'Sprint is missing', '');
      if (!row.Tipo || row.Tipo === 'N/A') this.addError('MISSING_REQUIRED_FIELD', filePath, itemLabel, 'Tipo is missing', '');
      if (!row.Título || row.Título === 'N/A') this.addError('MISSING_REQUIRED_FIELD', filePath, itemLabel, 'Título is missing', '');
      if (!row.Modo || row.Modo === 'N/A') this.addError('MISSING_REQUIRED_FIELD', filePath, itemLabel, 'Modo is missing', '');
    });
  }

  validateMap(rows, filePath) {
    rows.forEach((row, index) => {
      const itemLabel = `Line ${index + 3}`;
      const normalizedId = row.normalized_id;

      if (normalizedId && normalizedId !== 'N/A' && normalizedId !== 'unmapped') {
        this.validateId(normalizedId, filePath, itemLabel);
        if (!this.tasks.has(normalizedId)) {
           // If it's an official ID but not in the index, it's a reference to an inexistent task
           this.addError('MISSING_REFERENCE', filePath, itemLabel, `Normalized ID "${normalizedId}" refers to a task not found in TASK_INDEX`, normalizedId);
        } else {
           const task = this.tasks.get(normalizedId);
           task.mapped = true;
           task.logical_owner = row.logical_owner;
           task.normalized_state = row.normalized_state;
        }
      }

      this.validateState(row.normalized_state, filePath, itemLabel);
      this.validateOwner(row.logical_owner, filePath, itemLabel);

      // Candidate ID usage
      if (row.candidate_id && row.candidate_id !== 'N/A') {
        if (OFFICIAL_ID_REGEX.test(row.candidate_id)) {
           this.addError('INVALID_CANDIDATE_ID_USAGE', filePath, itemLabel, `Official ID pattern used as candidate_id: "${row.candidate_id}"`, row.candidate_id);
        }
      }

      // Required fields for normalized map
      const required = ['normalized_id', 'origin_id', 'artifact_type', 'title', 'normalized_state', 'logical_owner', 'predecessor_ids', 'successor_ids', 'evidence', 'normalization_reason'];
      required.forEach(field => {
        if (!row[field] || row[field] === '') {
          this.addError('MISSING_REQUIRED_FIELD', filePath, itemLabel, `Field "${field}" is missing in NORMALIZED_TASK_MAP`, '');
        }
      });

      this.validateFileReference(row.canonical_url_or_path, filePath, itemLabel);
      this.artifacts.push(row);
    });
  }

  checkDependencies() {
    this.artifacts.forEach(item => {
      const id = item.normalized_id;
      if (!id || id === 'N/A' || id === 'unmapped') return;

      const preds = item.predecessor_ids.split(',').map(s => s.trim()).filter(s => s && s !== 'N/A');
      const succs = item.successor_ids.split(',').map(s => s.trim()).filter(s => s && s !== 'N/A');

      preds.forEach(predId => {
        this.dependencies++;
        if (!this.tasks.has(predId)) {
          this.addError('MISSING_REFERENCE', 'NORMALIZED_TASK_MAP', id, `Predecessor "${predId}" does not exist`, predId);
        } else {
          // Check asymmetry
          const predArtifact = this.artifacts.find(a => a.normalized_id === predId);
          if (predArtifact) {
            const predSuccs = predArtifact.successor_ids.split(',').map(s => s.trim());
            if (!predSuccs.includes(id)) {
              this.addWarning('ASYMMETRIC_DEPENDENCY', 'NORMALIZED_TASK_MAP', id, `Task "${id}" has predecessor "${predId}", but "${predId}" does not have "${id}" as successor`, `${id} -> ${predId}`);
            }
          }
        }
      });

      succs.forEach(succId => {
        if (!this.tasks.has(succId)) {
          this.addError('MISSING_REFERENCE', 'NORMALIZED_TASK_MAP', id, `Successor "${succId}" does not exist`, succId);
        }
      });
    });
  }

  checkCycles() {
    const adj = new Map();
    for (const [id] of this.tasks) {
      adj.set(id, []);
    }

    this.artifacts.forEach(item => {
      const id = item.normalized_id;
      if (!id || id === 'N/A' || id === 'unmapped') return;
      const succs = item.successor_ids.split(',').map(s => s.trim()).filter(s => s && s !== 'N/A');
      succs.forEach(succ => {
        if (adj.has(id) && adj.has(succ)) {
          adj.get(id).push(succ);
        }
      });
    });

    const visited = new Set();
    const recStack = new Set();
    const path = [];

    const hasCycle = (v) => {
      if (!visited.has(v)) {
        visited.add(v);
        recStack.add(v);
        path.push(v);

        const neighbors = adj.get(v) || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor) && hasCycle(neighbor)) return true;
          if (recStack.has(neighbor)) {
            path.push(neighbor);
            const cycleStart = path.indexOf(neighbor);
            const cycle = path.slice(cycleStart).join(' -> ');
            this.addError('DEPENDENCY_CYCLE', 'NORMALIZED_TASK_MAP', v, `Dependency cycle detected: ${cycle}`, cycle);
            return true;
          }
        }
      }
      recStack.delete(v);
      path.pop();
      return false;
    };

    for (const [id] of this.tasks) {
      if (hasCycle(id)) {
        // We only report one cycle for now to keep it simple, or we could continue.
        // Requirement says "Exibir o caminho do ciclo encontrado".
      }
    }
  }

  validateSprint01Flow() {
    // SB-S01-T00 -> SB-S01-T01 -> (SB-S01-T02 || SB-S01-T03) -> SB-S01-T04 -> SB-S01-T05
    const flow = [
      { id: 'SB-S01-T01', pred: 'SB-S01-T00' },
      { id: 'SB-S01-T02', pred: 'SB-S01-T01' },
      { id: 'SB-S01-T03', pred: 'SB-S01-T01' },
      { id: 'SB-S01-T04', preds: ['SB-S01-T02', 'SB-S01-T03'] },
      { id: 'SB-S01-T05', pred: 'SB-S01-T04' },
    ];

    flow.forEach(step => {
      const artifact = this.artifacts.find(a => a.normalized_id === step.id);
      if (!artifact) return;

      const preds = artifact.predecessor_ids.split(',').map(s => s.trim());
      if (step.pred) {
        if (!preds.includes(step.pred)) {
          this.addError('INVALID_SPRINT_01_FLOW', 'NORMALIZED_TASK_MAP', step.id, `Sprint 01 Flow violation: ${step.id} should have ${step.pred} as predecessor`, artifact.predecessor_ids);
        }
      }
      if (step.preds) {
        step.preds.forEach(p => {
           if (!preds.includes(p)) {
             this.addError('INVALID_SPRINT_01_FLOW', 'NORMALIZED_TASK_MAP', step.id, `Sprint 01 Flow violation: ${step.id} should have ${p} as predecessor`, artifact.predecessor_ids);
           }
        });
      }
    });
  }

  report() {
    if (this.errors.length === 0) {
      console.log('TASK CATALOG VALID');
      console.log(`Tasks: ${this.tasks.size}`);
      console.log(`Normalized artifacts: ${this.artifacts.length}`);
      console.log(`Dependencies: ${this.dependencies}`);
      console.log('Errors: 0');
      console.log(`Warnings: ${this.warnings.length}`);

      if (this.warnings.length > 0) {
        console.log('\nWarnings:');
        this.warnings.forEach(w => {
          console.log(`[${w.code}] ${w.file} (${w.item}): ${w.message} [Evidence: ${w.evidence}]`);
        });
      }
      process.exit(0);
    } else {
      console.log('TASK CATALOG INVALID');
      console.log(`Errors: ${this.errors.length}`);
      console.log(`Warnings: ${this.warnings.length}`);
      console.log('\nErrors:');
      this.errors.forEach(e => {
        console.log(`- Code: ${e.code}`);
        console.log(`  File: ${e.file}`);
        console.log(`  Item: ${e.item}`);
        console.log(`  Message: ${e.message}`);
        console.log(`  Evidence: ${e.evidence}`);
        console.log('');
      });
      if (this.warnings.length > 0) {
        console.log('Warnings:');
        this.warnings.forEach(w => {
          console.log(`- Code: ${w.code}`);
          console.log(`  File: ${w.file}`);
          console.log(`  Item: ${w.item}`);
          console.log(`  Message: ${w.message}`);
          console.log(`  Evidence: ${w.evidence}`);
          console.log('');
        });
      }
      process.exit(1);
    }
  }
}

export async function main() {
  const args = process.argv.slice(2);
  let indexPath = 'docs/product-roadmap/TASK_INDEX.md';
  let mapPath = 'docs/product-roadmap/sprint-01-backlog-governance/NORMALIZED_TASK_MAP.md';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--index' && args[i + 1]) {
      indexPath = args[i + 1];
      i++;
    } else if (args[i] === '--map' && args[i + 1]) {
      mapPath = args[i + 1];
      i++;
    }
  }

  const validator = new Validator();

  try {
    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      const indexRows = parseMarkdownTable(indexContent);
      validator.validateIndex(indexRows, indexPath);
    } else {
      validator.addError('MISSING_FILE', 'CLI', 'index', `Index file not found: ${indexPath}`, indexPath);
    }

    if (fs.existsSync(mapPath)) {
      const mapContent = fs.readFileSync(mapPath, 'utf8');
      const mapRows = parseMarkdownTable(mapContent);
      validator.validateMap(mapRows, mapPath);
    } else {
      validator.addError('MISSING_FILE', 'CLI', 'map', `Map file not found: ${mapPath}`, mapPath);
    }

    validator.checkDependencies();
    validator.checkCycles();
    validator.validateSprint01Flow();

    validator.report();
  } catch (error) {
    console.error('Validation crashed:', error);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
