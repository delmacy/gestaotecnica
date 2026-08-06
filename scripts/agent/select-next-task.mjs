#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const requested = process.argv.find((arg) => arg.startsWith("--task="))?.split("=")[1] ?? "";

function readMetadata(file) {
  return JSON.parse(execFileSync(process.execPath, [path.join(root, "scripts/agent/read-task-metadata.mjs"), file], { encoding: "utf8" }));
}

function completedIds() {
  const dir = path.join(root, ".agent/tasks/completed");
  if (!fs.existsSync(dir)) return new Set();
  return new Set(fs.readdirSync(dir).filter((name) => name.endsWith(".md")).map((name) => readMetadata(path.join(dir, name)).id));
}

const activeSprint = fs.readdirSync(path.join(root, ".agent/sprints"))
  .find((id) => fs.readFileSync(path.join(root, ".agent/sprints", id, "sprint.yaml"), "utf8").match(/^status:\s*active\s*$/m));

if (!activeSprint) {
  process.stdout.write(JSON.stringify({ hasTask: false, reason: "no_active_sprint" }));
  process.exit(0);
}

const readyDir = path.join(root, ".agent/tasks/ready");
const files = fs.readdirSync(readyDir).filter((name) => name.endsWith(".md")).sort();
const done = completedIds();

for (const name of files) {
  if (requested && name !== requested) continue;
  const file = path.join(readyDir, name);
  const metadata = readMetadata(file);
  if (metadata.sprint_id !== activeSprint) continue;
  const dependencies = Array.isArray(metadata.depends_on) ? metadata.depends_on : [];
  const blockedBy = dependencies.filter((id) => !done.has(id));
  if (blockedBy.length) continue;
  process.stdout.write(JSON.stringify({ hasTask: true, sprintId: activeSprint, file: `.agent/tasks/ready/${name}`, name, metadata }));
  process.exit(0);
}

process.stdout.write(JSON.stringify({ hasTask: false, sprintId: activeSprint, reason: requested ? "requested_task_blocked_or_missing" : "no_unblocked_task" }));
