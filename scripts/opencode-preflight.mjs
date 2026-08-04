#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import process from "node:process";

const npm = "npm";
  const result = spawnSync(
    "npm.cmd",
    ["ci", "--dry-run", "--ignore-scripts", "--no-audit", "--fund=false"],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      windowsHide: true,
      shell: process.platform === "win32",
      timeout: 10 * 60_000,
      maxBuffer: 20 * 1024 * 1024,
    },
  );

if (result.error) {
  console.error(`[opencode:preflight] Não foi possível executar npm ci --dry-run: ${result.error.message}`);
  process.exit(1);
}

if (result.status !== 0) {
  console.error("[opencode:preflight] O lockfile não reproduz o package.json. A sessão OpenCode não será iniciada.");
  if (result.stdout) console.error(result.stdout.trim());
  if (result.stderr) console.error(result.stderr.trim());
  console.error("Corrija e versione package-lock.json em uma task própria antes de executar tarefas automatizadas.");
  process.exit(result.status ?? 1);
}

console.log("[opencode:preflight] package.json e package-lock.json são reproduzíveis por npm ci.");
