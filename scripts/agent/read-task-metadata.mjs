import { readFileSync } from "node:fs";

const taskFile = process.argv[2];
if (!taskFile) throw new Error("Task file path is required.");

const source = readFileSync(taskFile, "utf8");
const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
if (!match) throw new Error(`Missing YAML frontmatter in ${taskFile}`);

const lines = match[1].split(/\r?\n/);
const metadata = {};
let listKey = null;

for (const rawLine of lines) {
  const line = rawLine.trimEnd();
  const listItem = line.match(/^\s+-\s+(.+)$/);
  if (listItem && listKey) {
    metadata[listKey] ??= [];
    metadata[listKey].push(listItem[1].trim());
    continue;
  }

  const pair = line.match(/^([a-z_]+):\s*(.*)$/);
  if (!pair) continue;
  const [, key, rawValue] = pair;
  const value = rawValue.trim();
  if (!value) {
    listKey = key;
    metadata[key] = [];
  } else {
    listKey = null;
    metadata[key] = value;
  }
}

const required = ["id", "title", "status", "priority", "model_tier", "risk", "max_files"];
for (const key of required) {
  if (!metadata[key]) throw new Error(`Missing task metadata: ${key}`);
}

if (metadata.status !== "ready") throw new Error(`Task status must be ready, got ${metadata.status}`);
if (!["simple", "standard", "advanced"].includes(metadata.model_tier)) {
  throw new Error(`Unsupported model_tier: ${metadata.model_tier}`);
}
if (!["low", "medium", "high"].includes(metadata.risk)) {
  throw new Error(`Unsupported risk: ${metadata.risk}`);
}

process.stdout.write(JSON.stringify(metadata));
