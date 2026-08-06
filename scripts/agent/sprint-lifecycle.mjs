#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const closeRequested = args.has("--close");
const requestedSprint = process.argv.find((value) => value.startsWith("--sprint="))?.split("=")[1];

function readScalar(source, key) {
  const match = source.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim().replace(/^['"]|['"]$/g, "") ?? null;
}

function taskMetadata(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const block = source.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!block) return null;
  return {
    id: readScalar(block[1], "id"),
    sprintId: readScalar(block[1], "sprint_id"),
    modelTier: readScalar(block[1], "model_tier"),
    risk: readScalar(block[1], "risk"),
    storyPoints: Number(readScalar(block[1], "story_points") ?? 0),
  };
}

function listMarkdown(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory)
    .filter((name) => name.endsWith(".md"))
    .map((name) => path.join(directory, name));
}

const sprintRoot = path.join(root, ".agent", "sprints");
const sprintDirs = fs.existsSync(sprintRoot)
  ? fs.readdirSync(sprintRoot).filter((name) => fs.existsSync(path.join(sprintRoot, name, "sprint.yaml")))
  : [];

const sprintId = requestedSprint ?? sprintDirs.find((name) => {
  const source = fs.readFileSync(path.join(sprintRoot, name, "sprint.yaml"), "utf8");
  return readScalar(source, "status") === "active";
});

if (!sprintId) {
  console.error("No active sprint found. Pass --sprint=SPRINT-ID.");
  process.exit(1);
}

const sprintPath = path.join(sprintRoot, sprintId, "sprint.yaml");
if (!fs.existsSync(sprintPath)) {
  console.error(`Sprint manifest not found: ${sprintPath}`);
  process.exit(1);
}

const states = ["ready", "working", "review", "completed", "failed"];
const tasks = [];
for (const state of states) {
  for (const file of listMarkdown(path.join(root, ".agent", "tasks", state))) {
    const metadata = taskMetadata(file);
    if (metadata?.sprintId === sprintId) tasks.push({ ...metadata, state, file: path.relative(root, file) });
  }
}

if (tasks.length === 0) {
  console.error(`Sprint ${sprintId} has no linked tasks.`);
  process.exit(1);
}

const openTasks = tasks.filter((task) => !["completed"].includes(task.state));
const failedTasks = tasks.filter((task) => task.state === "failed");
const completedTasks = tasks.filter((task) => task.state === "completed");
const totalPoints = tasks.reduce((sum, task) => sum + task.storyPoints, 0);
const completedPoints = completedTasks.reduce((sum, task) => sum + task.storyPoints, 0);
const canClose = openTasks.length === 0 && failedTasks.length === 0;

const summary = {
  sprintId,
  status: canClose ? "ready_to_close" : "active",
  taskCount: tasks.length,
  completed: completedTasks.length,
  failed: failedTasks.length,
  open: openTasks.length,
  storyPoints: { completed: completedPoints, total: totalPoints },
  tasks,
  generatedAt: new Date().toISOString(),
};

console.log(JSON.stringify(summary, null, 2));

if (!closeRequested) process.exit(canClose ? 0 : 2);
if (!canClose) {
  console.error(`Sprint ${sprintId} cannot close while tasks remain open or failed.`);
  process.exit(2);
}

const sprintDir = path.join(sprintRoot, sprintId);
const reportDir = path.join(sprintDir, "reports");
fs.mkdirSync(reportDir, { recursive: true });

const report = `# ${sprintId} completion report\n\n- Generated: ${summary.generatedAt}\n- Tasks completed: ${completedTasks.length}/${tasks.length}\n- Story points completed: ${completedPoints}/${totalPoints}\n- Failed tasks: ${failedTasks.length}\n\n## Completed tasks\n\n${completedTasks.map((task) => `- ${task.id} (${task.modelTier}, ${task.risk}, ${task.storyPoints} points)`).join("\n")}\n`;
const retrospective = `# ${sprintId} retrospective\n\n## What was delivered\n\n${completedTasks.map((task) => `- ${task.id}`).join("\n")}\n\n## Factory observations\n\n- Review model duration, provider failures and retry count in GitHub Actions before planning the next sprint.\n- Split any task that exceeded the expected low-cost model session budget.\n- Promote unresolved findings into the backlog instead of broadening completed tasks.\n`;

fs.writeFileSync(path.join(reportDir, "completion-report.md"), report);
fs.writeFileSync(path.join(sprintDir, "retrospective.md"), retrospective);
fs.writeFileSync(path.join(reportDir, "metrics.json"), `${JSON.stringify(summary, null, 2)}\n`);

const manifest = fs.readFileSync(sprintPath, "utf8")
  .replace(/^status:\s*active$/m, "status: closed")
  .replace(/^closed_at:.*$/m, "")
  .trimEnd();
fs.writeFileSync(sprintPath, `${manifest}\nclosed_at: ${summary.generatedAt}\n`);
