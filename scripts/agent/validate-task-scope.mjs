import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

const baseRef = process.argv[2] || "origin/main";
const taskId = process.argv[3];
if (!taskId) throw new Error("Task ID is required.");

const candidates = [
  `.agent/tasks/ready/${taskId}.md`,
  `.agent/tasks/completed/${taskId}.md`,
];
const taskFile = candidates.find(existsSync);
if (!taskFile) throw new Error(`Task file not found for ${taskId}.`);

const source = readFileSync(taskFile, "utf8");
const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
if (!match) throw new Error(`Missing YAML frontmatter in ${taskFile}.`);

const metadata = {};
let listKey = null;
for (const rawLine of match[1].split(/\r?\n/)) {
  const listItem = rawLine.match(/^\s+-\s+(.+)$/);
  if (listItem && listKey) {
    metadata[listKey] ??= [];
    metadata[listKey].push(listItem[1].trim());
    continue;
  }
  const pair = rawLine.match(/^([a-z_]+):\s*(.*)$/);
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

const allowed = metadata.allowed_paths ?? [];
const forbidden = metadata.forbidden_paths ?? [];
if (allowed.length === 0) throw new Error("allowed_paths must contain at least one pattern.");

const globToRegExp = (glob) => {
  const escaped = glob.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped.replaceAll("**", "§§").replaceAll("*", "[^/]*").replaceAll("§§", ".*")}$`);
};
const matches = (path, patterns) => patterns.some((pattern) => globToRegExp(pattern).test(path));

const changed = execFileSync("git", ["diff", "--name-only", `${baseRef}...HEAD`], { encoding: "utf8" })
  .split(/\r?\n/)
  .map((value) => value.trim())
  .filter(Boolean);

const taskPaths = new Set([
  `.agent/tasks/ready/${taskId}.md`,
  `.agent/tasks/completed/${taskId}.md`,
]);
const relevant = changed.filter((path) => !taskPaths.has(path));
const forbiddenHits = relevant.filter((path) => matches(path, forbidden));
const outsideAllowed = relevant.filter((path) => !matches(path, allowed));

if (forbiddenHits.length > 0 || outsideAllowed.length > 0) {
  if (forbiddenHits.length > 0) console.error(`Forbidden paths changed:\n${forbiddenHits.join("\n")}`);
  if (outsideAllowed.length > 0) console.error(`Paths outside allowed scope:\n${outsideAllowed.join("\n")}`);
  process.exit(1);
}

console.log(`Task scope validated for ${relevant.length} implementation file(s).`);
