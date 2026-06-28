import fs from 'node:fs';
import path from 'node:path';

const INDEX_PATH = 'docs/product-roadmap/TASK_INDEX.md';
const ROADMAP_ROOT = 'docs/product-roadmap';

function parseMarkdownTable(content) {
  const lines = content.split('\n');
  const tableLines = lines.filter(line => line.trim().startsWith('|'));
  if (tableLines.length < 2) return [];

  const headers = tableLines[0]
    .split('|')
    .map(h => h.trim())
    .filter(h => h !== '');

  const rows = [];
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

function findSprintDir(sprintNum) {
  const sprintPrefix = `sprint-${sprintNum.padStart(2, '0')}`;
  if (!fs.existsSync(ROADMAP_ROOT)) return null;
  const dirs = fs.readdirSync(ROADMAP_ROOT);
  const sprintDir = dirs.find(d => d.startsWith(sprintPrefix));
  return sprintDir ? path.join(ROADMAP_ROOT, sprintDir) : null;
}

function findContractFile(sprintDir, taskId) {
  if (!sprintDir) return null;

  const files = fs.readdirSync(sprintDir);

  // 1. Look for individual task file (e.g., "00-...", "01-...", "SB-S01-T01.md")
  // Extract number from ID (SB-S01-T03 -> 03)
  const taskNumberMatch = taskId.match(/-T(\d{2})$/);
  const taskNumber = taskNumberMatch ? taskNumberMatch[1] : null;

  const individualFile = files.find(file => {
    if (!file.endsWith('.md') || file === 'README.md' || file === 'NORMALIZED_TASK_MAP.md') return false;
    if (file.includes(taskId)) return true;
    if (taskNumber && file.startsWith(taskNumber)) return true;
    return false;
  });

  if (individualFile) return path.join(sprintDir, individualFile);

  // 2. Fallback to README.md only if it contains legitimate contract info, not just a reference
  const readmePath = path.join(sprintDir, 'README.md');
  if (fs.existsSync(readmePath)) {
    const content = fs.readFileSync(readmePath, 'utf8');
    // Check if it has a header for the task or substantial info beyond a list item
    const hasHeader = content.includes(`## ${taskId}`) || content.includes(`### ${taskId}`);
    if (hasHeader) return readmePath;
  }

  return null;
}

function extractScope(contractFile, taskId) {
  if (!contractFile) return { allowed: 'Unknown', prohibited: 'Unknown' };
  const content = fs.readFileSync(contractFile, 'utf8');

  const lines = content.split('\n');
  let inTask = false;
  let allowed = [];
  let prohibited = [];
  let section = null;

  for (let line of lines) {
    if (line.includes(taskId)) {
      inTask = true;
      continue;
    }
    if (inTask && line.startsWith('## ')) {
        if (line.match(/SB-S\d{2}-T\d{2}/)) break;
    }

    if (inTask) {
        if (line.toLowerCase().includes('escopo') || line.toLowerCase().includes('diretórios permitidos')) {
            section = 'allowed';
        } else if (line.toLowerCase().includes('fora de escopo') || line.toLowerCase().includes('proibidos')) {
            section = 'prohibited';
        }

        if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
            if (section === 'allowed') allowed.push(line.trim());
            if (section === 'prohibited') prohibited.push(line.trim());
        }
    }
  }

  return {
    allowed: allowed.length > 0 ? allowed.join(', ') : 'Check contract file',
    prohibited: prohibited.length > 0 ? prohibited.join(', ') : 'Check global rules and contract file'
  };
}

async function main() {
  const ids = process.argv.slice(2);
  if (ids.length === 0) {
    console.error('Usage: node scripts/prove-task-discovery.mjs <TASK_ID>...');
    process.exit(1);
  }

  if (!fs.existsSync(INDEX_PATH)) {
    console.error(`Index not found at ${INDEX_PATH}`);
    process.exit(1);
  }

  const indexContent = fs.readFileSync(INDEX_PATH, 'utf8');
  const indexRows = parseMarkdownTable(indexContent);

  const results = [];
  let success = true;

  for (const id of ids) {
    if (!id.match(/^SB-S\d{2}-T\d{2}$/)) {
        console.error(`Invalid ID format: ${id}`);
        success = false;
        continue;
    }

    const indexEntry = indexRows.find(r => r.ID === id);
    if (!indexEntry) {
      console.error(`ID ${id} not found in index.`);
      success = false;
      continue;
    }

    const sprintNum = indexEntry.Sprint;
    const sprintDir = findSprintDir(sprintNum);
    const contractFile = findContractFile(sprintDir, id);

    if (!contractFile) {
        console.error(`Contract file not found for ${id} in ${sprintDir}`);
        success = false;
        continue;
    }

    // Check map for more info
    let mapEntry = null;
    if (sprintDir) {
        const mapPath = path.join(sprintDir, 'NORMALIZED_TASK_MAP.md');
        if (fs.existsSync(mapPath)) {
            const mapContent = fs.readFileSync(mapPath, 'utf8');
            const mapRows = parseMarkdownTable(mapContent);
            mapEntry = mapRows.find(r => r.normalized_id === id);
        }
    }

    const scope = extractScope(contractFile, id);

    results.push({
      task_id: id,
      index_location: INDEX_PATH,
      contract_location: contractFile,
      sprint: sprintNum,
      type: indexEntry.Tipo,
      mode: indexEntry.Modo,
      predecessors: mapEntry ? mapEntry.predecessor_ids : 'Check contract',
      successors: mapEntry ? mapEntry.successor_ids : 'Check contract',
      owner: mapEntry ? mapEntry.logical_owner : 'unassigned',
      state: mapEntry ? mapEntry.normalized_state : 'planned',
      artifacts: mapEntry ? mapEntry.origin_id : 'N/A',
      allowed_scope: scope.allowed,
      prohibited_scope: scope.prohibited,
      discovery_result: 'SUCCESS'
    });
  }

  if (results.length > 0) {
      console.log(JSON.stringify(results, null, 2));
  }

  if (!success) process.exit(1);
}

main();
