#!/usr/bin/env node
import { parseArgs } from "node:util";
import { spawn, spawnSync } from "node:child_process";
import { promises as fs, readFileSync } from "node:fs";
import path from "node:path";
import net from "node:net";
import process from "node:process";

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    phase: { type: "string" },
    task: { type: "string" },
    next: { type: "boolean", default: false },
    base: { type: "string", default: "main" },
    agent: { type: "string", default: "system-builder-task" },
    model: { type: "string" },
    port: { type: "string" },
    "max-fixes": { type: "string", default: "3" },
    "ci-timeout-minutes": { type: "string", default: "45" },
    "ci-grace-seconds": { type: "string", default: "90" },
    "server-timeout-seconds": { type: "string", default: "60" },
    resume: { type: "boolean", default: false },
    "keep-session": { type: "boolean", default: false },
    "keep-worktree": { type: "boolean", default: false },
    "insecure-local": { type: "boolean", default: false },
    "dry-run": { type: "boolean", default: false },
  },
  strict: true,
  allowPositionals: false,
});

const maxFixes = positiveInt(values["max-fixes"], "--max-fixes");
const ciTimeoutMs = positiveInt(values["ci-timeout-minutes"], "--ci-timeout-minutes") * 60_000;
const ciGraceMs = positiveInt(values["ci-grace-seconds"], "--ci-grace-seconds") * 1_000;
const serverTimeoutMs = positiveInt(values["server-timeout-seconds"], "--server-timeout-seconds") * 1_000;

let serverChild;
let sessionId;
let worktreePath;
let repositoryRoot;
let runStatePath;
let serverLogHandle;
let delivered = false;
let worktreeCreated = false;
let cleaningUp = false;

main().catch(async (error) => {
  console.error(`\n[opencode-task-runner] ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
  await cleanup();
  process.exitCode = 1;
});

process.once("SIGINT", () => void interrupt("SIGINT"));
process.once("SIGTERM", () => void interrupt("SIGTERM"));

async function main() {
  repositoryRoot = git(["rev-parse", "--show-toplevel"], process.cwd()).trim();
  const phase = await resolvePhase(repositoryRoot, values.phase);
  const taskCatalog = await parseTaskCatalog(phase.tasksFile);
  const task = selectTask(taskCatalog, values.task, values.next);

  if (!values.resume && normalizeState(task.state) !== "ready") {
    throw new Error(`A task ${task.id} está '${task.state}', não 'ready'. O runner não infere autorização.`);
  }

  const phaseId = phaseIdFromDirectory(path.basename(phase.directory));
  const branch = `${phaseId}/${task.id}-${slug(task.title)}`;
  const runId = `${task.id}-${new Date().toISOString().replace(/[:.]/g, "-")}`;
  const runtimeDirectory = path.join(repositoryRoot, ".opencode", "task-runs");
  await fs.mkdir(runtimeDirectory, { recursive: true });
  runStatePath = path.join(runtimeDirectory, `${runId}.json`);

  await writeState({
    runId,
    status: "selected",
    phase: phase.relativeDirectory,
    task,
    base: values.base,
    branch,
    startedAt: new Date().toISOString(),
  });

  if (values["dry-run"]) {
    const contextFiles = await loadContextFiles(repositoryRoot, phase);
    console.log(JSON.stringify({ task, branch, contextFiles: contextFiles.map((item) => item.path) }, null, 2));
    await writeState({ status: "dry_run_complete", completedAt: new Date().toISOString() });
    return;
  }

  await preflight(repositoryRoot);
  git(["fetch", "origin", values.base], repositoryRoot, { stdio: "inherit" });
  const requestedWorktreePath = path.join(repositoryRoot, ".worktrees", "opencode", safeName(runId));
  await fs.mkdir(path.dirname(requestedWorktreePath), { recursive: true });
  const worktree = createWorktree(repositoryRoot, requestedWorktreePath, branch, values.base, values.resume);
  worktreePath = worktree.path;
  worktreeCreated = worktree.created;

  const worktreePhase = await resolvePhase(worktreePath, phase.relativeDirectory);
  const contextFiles = await loadContextFiles(worktreePath, worktreePhase);
  await writeState({ status: "worktree_ready", worktreePath, contextFiles: contextFiles.map((item) => item.path) });

  const password = process.env.OPENCODE_SERVER_PASSWORD;
  if (!password && !values["insecure-local"]) {
    throw new Error("Defina OPENCODE_SERVER_PASSWORD ou use --insecure-local explicitamente.");
  }

  const port = values.port ? positiveInt(values.port, "--port") : await findFreePort();
  const serverUrl = `http://127.0.0.1:${port}`;
  const serverLogPath = path.join(runtimeDirectory, `${runId}.server.log`);
  serverLogHandle = await fs.open(serverLogPath, "a");
  serverChild = startOpenCodeServer(worktreePath, port, serverLogHandle.fd);
  await waitForHealth(serverUrl, serverTimeoutMs, password);
  await writeState({ status: "server_ready", serverUrl, serverPid: serverChild.pid, serverLogPath });

  const session = await api(serverUrl, password, "POST", "/session", {
    title: `${task.id} — ${task.title}`,
  });
  sessionId = session.id;
  if (!sessionId) throw new Error(`O OpenCode não retornou session.id: ${JSON.stringify(session)}`);
  await writeState({ status: "session_created", sessionId });

  const contextText = buildContext(task, phase.relativeDirectory, branch, values.base, contextFiles);
  await api(serverUrl, password, "POST", `/session/${encodeURIComponent(sessionId)}/message`, {
    noReply: true,
    parts: [{ type: "text", text: contextText }],
  }, 10 * 60_000);

  const initialPrompt = buildExecutionPrompt(task, phase.relativeDirectory, branch, values.base);
  const firstResponse = await sendAgentMessage(serverUrl, password, sessionId, initialPrompt);
  await appendTranscript(runId, "initial", firstResponse);
  await writeState({ status: "implementation_response_received" });

  if (responseDeclaresBlocked(firstResponse)) {
    await writeState({ status: "blocked", blockedAt: new Date().toISOString(), response: extractResponseText(firstResponse) });
    console.log(JSON.stringify({ status: "blocked", task: task.id, branch, sessionClosed: !values["keep-session"] }, null, 2));
    await cleanup();
    return;
  }

  let pr = findPullRequest(worktreePath, branch);
  let repairAttempt = 0;
  while (!pr && repairAttempt < maxFixes) {
    repairAttempt += 1;
    const response = await sendAgentMessage(
      serverUrl,
      password,
      sessionId,
      `Nenhum PR foi encontrado para a branch ${branch}. Conclua somente a task ${task.id}: revise o diff, execute os testes aplicáveis, atualize PROGRESS.md e a evidência da fase, faça commit, push e abra um único PR contra ${values.base}. Não faça merge.`,
    );
    await appendTranscript(runId, `pr-repair-${repairAttempt}`, response);
    pr = findPullRequest(worktreePath, branch);
  }
  if (!pr) throw new Error(`A sessão terminou sem criar PR para ${branch}.`);
  await writeState({ status: "pr_open", pr });

  let fixAttempt = 0;
  while (true) {
    const documentationGaps = verifyDeliveryArtifacts(worktreePath, values.base, worktreePhase.relativeDirectory);
    if (documentationGaps.length > 0) {
      if (fixAttempt >= maxFixes) {
        throw new Error(`Entrega sem artefatos obrigatórios: ${documentationGaps.join("; ")}`);
      }
      fixAttempt += 1;
      const response = await sendAgentMessage(
        serverUrl,
        password,
        sessionId,
        buildCorrectionPrompt(task, branch, pr, fixAttempt, {
          kind: "delivery_contract",
          details: documentationGaps.join("\n"),
        }),
      );
      await appendTranscript(runId, `contract-fix-${fixAttempt}`, response);
      pr = findPullRequest(worktreePath, branch) ?? pr;
      continue;
    }

    const checks = await waitForPullRequestChecks(worktreePath, pr.number, ciTimeoutMs, ciGraceMs);
    await writeState({ status: "checks_resolved", checks });

    if (checks.status === "passed") break;

    let failure;
    if (checks.status === "no_checks") {
      failure = runFallbackValidation(worktreePath);
      if (failure.ok) {
        await writeState({ status: "fallback_validation_passed", validation: failure });
        break;
      }
    } else {
      failure = {
        ok: false,
        summary: `GitHub checks: ${checks.status}`,
        output: JSON.stringify(checks.checks, null, 2),
      };
    }

    if (fixAttempt >= maxFixes) {
      throw new Error(`Validação falhou após ${maxFixes} correções. ${failure.summary}\n${truncate(failure.output, 4000)}`);
    }

    fixAttempt += 1;
    const response = await sendAgentMessage(
      serverUrl,
      password,
      sessionId,
      buildCorrectionPrompt(task, branch, pr, fixAttempt, {
        kind: checks.status === "no_checks" ? "local_validation" : "github_checks",
        details: `${failure.summary}\n${truncate(failure.output, 12_000)}`,
      }),
    );
    await appendTranscript(runId, `validation-fix-${fixAttempt}`, response);
    pr = findPullRequest(worktreePath, branch) ?? pr;
  }

  const finalPr = findPullRequest(worktreePath, branch) ?? pr;
  delivered = true;
  await writeState({
    status: "delivered",
    deliveredAt: new Date().toISOString(),
    pr: finalPr,
    corrections: fixAttempt,
  });

  console.log(JSON.stringify({
    status: "delivered",
    task: task.id,
    branch,
    pr: finalPr.url,
    sessionClosed: !values["keep-session"],
    worktreeRemoved: !values["keep-worktree"],
  }, null, 2));

  await cleanup();
}

async function interrupt(signal) {
  console.error(`\nRecebido ${signal}; encerrando sessão e servidor.`);
  await writeState({ status: "interrupted", signal, interruptedAt: new Date().toISOString() }).catch(() => undefined);
  await cleanup();
  process.exit(130);
}

async function cleanup() {
  if (cleaningUp) return;
  cleaningUp = true;

  if (sessionId && !values["keep-session"] && runStatePath) {
    try {
      const state = JSON.parse(await fs.readFile(runStatePath, "utf8"));
      if (state.serverUrl) {
        await api(state.serverUrl, process.env.OPENCODE_SERVER_PASSWORD, "DELETE", `/session/${encodeURIComponent(sessionId)}`, undefined, 30_000);
      }
    } catch (error) {
      console.error(`Falha ao apagar sessão ${sessionId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (serverChild) await stopChild(serverChild);
  if (serverLogHandle) await serverLogHandle.close().catch(() => undefined);

  if (worktreePath && repositoryRoot && delivered && worktreeCreated && !values["keep-worktree"]) {
    try {
      git(["worktree", "remove", "--force", worktreePath], repositoryRoot, { stdio: "inherit" });
    } catch (error) {
      console.error(`Falha ao remover worktree: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

async function resolvePhase(root, phaseInput) {
  if (!phaseInput) throw new Error("Informe --phase docs/phases/<fase> ou o caminho de TASKS.md.");
  const absolute = path.resolve(root, phaseInput);
  const stat = await fs.stat(absolute).catch(() => null);
  if (!stat) throw new Error(`Fase não encontrada: ${absolute}`);
  const directory = stat.isDirectory() ? absolute : path.dirname(absolute);
  const tasksFile = stat.isDirectory() ? path.join(directory, "TASKS.md") : absolute;
  await fs.access(tasksFile);
  return {
    directory,
    tasksFile,
    relativeDirectory: normalizeSlashes(path.relative(root, directory)),
  };
}

async function parseTaskCatalog(tasksFile) {
  const text = await fs.readFile(tasksFile, "utf8");
  const lines = text.split(/\r?\n/);
  const tasks = [];
  let headers;

  for (const line of lines) {
    if (!line.trim().startsWith("|")) {
      headers = undefined;
      continue;
    }
    const cells = markdownCells(line);
    if (cells.length === 0 || cells.every((cell) => /^:?-+:?$/.test(cell))) continue;
    const normalized = cells.map(normalizeHeader);
    if (normalized.includes("id") && (normalized.includes("estado") || normalized.includes("status"))) {
      headers = normalized;
      continue;
    }
    if (!headers || cells.length < headers.length) continue;
    const row = Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
    if (!row.id || row.id === "—") continue;
    tasks.push({
      id: row.id,
      title: row.titulo ?? row.title ?? "",
      dependency: row.dependencia ?? row.dependencies ?? "",
      state: row.estado ?? row.status ?? "",
      pr: row.pr ?? "",
    });
  }
  if (tasks.length === 0) throw new Error(`Nenhuma task foi encontrada em ${tasksFile}.`);
  return tasks;
}

function selectTask(tasks, requestedId, useNext) {
  if (requestedId) {
    const task = tasks.find((item) => item.id.toLowerCase() === requestedId.toLowerCase());
    if (!task) throw new Error(`Task ${requestedId} não encontrada no catálogo especificado.`);
    return task;
  }
  if (useNext) {
    const task = tasks.find((item) => normalizeState(item.state) === "ready");
    if (!task) throw new Error("Nenhuma task ready foi encontrada no documento especificado.");
    return task;
  }
  throw new Error("Informe --task <ID> ou --next.");
}

async function preflight(root) {
  command("git", ["--version"], root);
  command("gh", ["--version"], root);
  command("gh", ["auth", "status"], root, { stdio: "inherit" });
  command(opencodeCommand(), ["--version"], root);
  const remote = git(["remote", "get-url", "origin"], root).trim();
  if (!remote) throw new Error("Remote origin não configurado.");
}

function createWorktree(root, target, branch, base, resume) {
  const attached = findAttachedWorktree(root, branch);
  if (attached) {
    if (!resume) throw new Error(`A branch ${branch} já está aberta em ${attached}. Use --resume para continuar.`);
    return { path: attached, created: false };
  }

  const localExists = gitOk(["show-ref", "--verify", `refs/heads/${branch}`], root);
  const remoteExists = gitOk(["show-ref", "--verify", `refs/remotes/origin/${branch}`], root);
  if ((localExists || remoteExists) && !resume) {
    throw new Error(`A branch ${branch} já existe. Use --resume para continuar a mesma task.`);
  }
  if (localExists) {
    git(["worktree", "add", target, branch], root, { stdio: "inherit" });
  } else if (remoteExists) {
    git(["worktree", "add", "-b", branch, target, `origin/${branch}`], root, { stdio: "inherit" });
  } else {
    git(["worktree", "add", "-b", branch, target, `origin/${base}`], root, { stdio: "inherit" });
  }
  return { path: target, created: true };
}

function findAttachedWorktree(root, branch) {
  const output = git(["worktree", "list", "--porcelain"], root);
  let currentPath = null;
  for (const line of output.split(/\r?\n/)) {
    if (line.startsWith("worktree ")) currentPath = line.slice("worktree ".length);
    if (line === `branch refs/heads/${branch}`) return currentPath;
    if (!line.trim()) currentPath = null;
  }
  return null;
}

async function loadContextFiles(root, phase) {
  const required = [
    "AGENTS.md",
    "docs/current/STATUS.md",
    "docs/current/ROADMAP.md",
    "docs/agents/OPERATING_MODEL.md",
    "docs/agents/TASK_CONTRACT.md",
    "docs/agents/EVIDENCE_CONTRACT.md",
    normalizeSlashes(path.relative(root, path.join(phase.directory, "README.md"))),
    normalizeSlashes(path.relative(root, phase.tasksFile)),
    normalizeSlashes(path.relative(root, path.join(phase.directory, "PROGRESS.md"))),
  ];
  const loaded = [];
  for (const relative of required) {
    const absolute = path.resolve(root, relative);
    const content = await fs.readFile(absolute, "utf8").catch(() => null);
    if (content === null) throw new Error(`Contexto obrigatório ausente: ${relative}`);
    loaded.push({ path: relative, content });
  }
  return loaded;
}

function buildContext(task, phaseDirectory, branch, base, files) {
  const joined = files.map((file) => `\n\n===== ${file.path} =====\n${file.content}`).join("");
  return [
    "CONTEXTO DURÁVEL DA TASK. Trate todo o conteúdo abaixo como obrigatório.",
    `Task: ${task.id} — ${task.title}`,
    `Estado autorizado: ${task.state}`,
    `Dependência declarada: ${task.dependency || "—"}`,
    `Fase: ${phaseDirectory}`,
    `Branch já preparada: ${branch}`,
    `Base do PR: ${base}`,
    "Não selecione outra task e não amplie o escopo.",
    joined,
  ].join("\n");
}

function buildExecutionPrompt(task, phaseDirectory, branch, base) {
  return `Execute somente ${task.id} — ${task.title}.

Fluxo obrigatório:
1. Confirme que está na branch ${branch}; não troque de branch, não faça merge e não faça rebase.
2. Leia os arquivos de contexto já carregados e, quando necessário, os arquivos do código diretamente relacionados à task.
3. Implemente o menor diff que cumpra os critérios da fase e da task.
4. Execute os testes específicos e os gates aplicáveis. Não alegue testes que não executou.
5. Atualize ${phaseDirectory}/PROGRESS.md e crie ou atualize uma evidência consolidada em ${phaseDirectory}/evidence/.
6. Revise o escopo com git diff, faça commit, push e abra um único PR contra ${base} usando gh.
7. Não aprove, não feche e não faça merge do PR.
8. Se houver bloqueio real, não invente resultado: registre o bloqueio na evidência e responda BLOCKED.

Ao finalizar, responda com:
OPENCODE_TASK_RESULT
status: PR_READY ou BLOCKED
branch: ${branch}
pr: URL ou NONE
head_sha: SHA ou NONE
tests: resumo factual
summary: resumo curto`;
}

function buildCorrectionPrompt(task, branch, pr, attempt, failure) {
  return `Correção ${attempt} da mesma task ${task.id}. O PR é ${pr.url} e a branch é ${branch}.

Tipo de falha: ${failure.kind}
Detalhes:
${failure.details}

Regras:
- corrija somente a task original;
- use a mesma branch e o mesmo PR;
- inspecione logs completos quando necessário;
- execute novamente os testes afetados;
- atualize a evidência e PROGRESS.md com a correção;
- faça commit e push;
- não crie outro PR e não faça merge.

Responda com OPENCODE_TASK_RESULT e o estado atualizado.`;
}

async function sendAgentMessage(serverUrl, password, id, text) {
  const body = {
    agent: values.agent,
    parts: [{ type: "text", text }],
  };
  if (values.model) {
    const separator = values.model.indexOf("/");
    if (separator < 1) throw new Error("--model deve usar provider/model-id.");
    body.model = {
      providerID: values.model.slice(0, separator),
      modelID: values.model.slice(separator + 1),
    };
  }
  return api(serverUrl, password, "POST", `/session/${encodeURIComponent(id)}/message`, body, 2 * 60 * 60_000);
}

function extractResponseText(response) {
  if (typeof response === "string") return response;
  const parts = response?.parts ?? response?.message?.parts ?? [];
  const texts = Array.isArray(parts) ? parts.filter((part) => part?.type === "text").map((part) => part.text) : [];
  return texts.length > 0 ? texts.join("\n") : JSON.stringify(response);
}

function responseDeclaresBlocked(response) {
  const text = extractResponseText(response);
  return /OPENCODE_TASK_RESULT[\s\S]*status:\s*BLOCKED/i.test(text);
}

function findPullRequest(cwd, branch) {
  const result = spawnSync("gh", ["pr", "view", branch, "--json", "number,url,state,headRefName,headRefOid,baseRefName,isDraft"], {
    cwd,
    encoding: "utf8",
    windowsHide: true,
  });
  if (result.status !== 0) return null;
  try {
    const pr = JSON.parse(result.stdout);
    if (pr.state !== "OPEN") throw new Error(`PR ${pr.url} não está aberto.`);
    return pr;
  } catch {
    return null;
  }
}

function verifyDeliveryArtifacts(cwd, base, phaseDirectory) {
  const changed = git(["diff", "--name-only", `origin/${base}...HEAD`], cwd).split(/\r?\n/).filter(Boolean).map(normalizeSlashes);
  const gaps = [];
  const progress = `${phaseDirectory}/PROGRESS.md`;
  const evidencePrefix = `${phaseDirectory}/evidence/`;
  if (!changed.includes(progress)) gaps.push(`PROGRESS.md não foi atualizado: ${progress}`);
  if (!changed.some((file) => file.startsWith(evidencePrefix))) gaps.push(`Nenhuma evidência consolidada foi adicionada em ${evidencePrefix}`);
  return gaps;
}

async function waitForPullRequestChecks(cwd, prNumber, timeoutMs, graceMs) {
  const start = Date.now();
  let lastChecks = [];
  while (Date.now() - start < timeoutMs) {
    const result = spawnSync("gh", ["pr", "checks", String(prNumber), "--json", "name,state,bucket,link,workflow"], {
      cwd,
      encoding: "utf8",
      windowsHide: true,
    });
    if (result.status === 0 || result.stdout.trim()) {
      try {
        lastChecks = JSON.parse(result.stdout || "[]");
      } catch {
        lastChecks = [];
      }
    }
    const substantive = lastChecks.filter((check) => !["skipping", "skipped"].includes(String(check.bucket).toLowerCase()));
    if (substantive.length === 0) {
      if (Date.now() - start >= graceMs) return { status: "no_checks", checks: lastChecks };
    } else if (substantive.some(isFailedCheck)) {
      return { status: "failed", checks: lastChecks };
    } else if (substantive.every(isPassedCheck)) {
      return { status: "passed", checks: lastChecks };
    }
    await delay(15_000);
  }
  return { status: "timeout", checks: lastChecks };
}

function runFallbackValidation(cwd) {
  const packageJson = JSON.parse(readFileSync(path.join(cwd, "package.json"), "utf8"));
  const scripts = packageJson.scripts ?? {};
  const names = scripts["validate:all"]
    ? ["validate:all"]
    : ["lint", "typecheck", "test:unit", "build"].filter((name) => scripts[name]);
  if (names.length === 0) return { ok: false, summary: "Nenhum gate local configurado", output: "package.json não possui scripts de validação reconhecidos." };
  const outputs = [];
  for (const name of names) {
    const result = spawnSync(npmCommand(), ["run", name], {
      cwd,
      encoding: "utf8",
      windowsHide: true,
      timeout: 30 * 60_000,
      maxBuffer: 20 * 1024 * 1024,
    });
    outputs.push(`$ npm run ${name}\n${result.stdout ?? ""}\n${result.stderr ?? ""}`);
    if (result.status !== 0) {
      return { ok: false, summary: `Falhou: npm run ${name}`, output: outputs.join("\n\n") };
    }
  }
  return { ok: true, summary: `Passaram: ${names.join(", ")}`, output: outputs.join("\n\n") };
}

function startOpenCodeServer(cwd, port, logFd) {
  const child = spawn(opencodeCommand(), ["serve", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd,
    env: process.env,
    detached: false,
    windowsHide: true,
    stdio: ["ignore", logFd, logFd],
  });
  child.once("error", (error) => console.error(`Falha no processo OpenCode: ${error.message}`));
  return child;
}

async function waitForHealth(serverUrl, timeoutMs, password) {
  const start = Date.now();
  let lastError;
  while (Date.now() - start < timeoutMs) {
    try {
      const health = await api(serverUrl, password, "GET", "/global/health", undefined, 5_000);
      if (health?.healthy) return health;
    } catch (error) {
      lastError = error;
    }
    if (serverChild?.exitCode !== null) throw new Error(`OpenCode encerrou com código ${serverChild.exitCode}.`);
    await delay(1_000);
  }
  throw new Error(`Servidor OpenCode não ficou saudável: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}

async function api(baseUrl, password, method, pathname, body, timeoutMs = 60_000) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (password) {
    const username = process.env.OPENCODE_SERVER_USERNAME ?? "opencode";
    headers.Authorization = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
  }
  const response = await fetch(`${baseUrl}${pathname}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`${method} ${pathname}: HTTP ${response.status} ${truncate(text, 2000)}`);
  if (!text) return true;
  try { return JSON.parse(text); } catch { return text; }
}

async function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 4096;
      server.close(() => resolve(port));
    });
  });
}

async function stopChild(child) {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  const exited = await Promise.race([
    new Promise((resolve) => child.once("exit", () => resolve(true))),
    delay(5_000).then(() => false),
  ]);
  if (!exited && process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { stdio: "ignore", windowsHide: true });
  } else if (!exited) {
    child.kill("SIGKILL");
  }
}

async function appendTranscript(runId, stage, response) {
  if (!repositoryRoot) return;
  const file = path.join(repositoryRoot, ".opencode", "task-runs", `${runId}.transcript.jsonl`);
  const record = { at: new Date().toISOString(), stage, response };
  await fs.appendFile(file, `${JSON.stringify(record)}\n`, "utf8");
}

async function writeState(patch) {
  if (!runStatePath) return;
  let state = {};
  try { state = JSON.parse(await fs.readFile(runStatePath, "utf8")); } catch {}
  await fs.writeFile(runStatePath, `${JSON.stringify({ ...state, ...patch }, null, 2)}\n`, "utf8");
}

function command(executable, args, cwd, options = {}) {
  const result = spawnSync(executable, args, {
    cwd,
    encoding: options.stdio === "inherit" ? undefined : "utf8",
    stdio: options.stdio ?? "pipe",
    windowsHide: true,
    maxBuffer: 20 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0 && !options.allowFailure) {
    throw new Error(`${executable} ${args.join(" ")} falhou (${result.status}).\n${result.stderr ?? ""}`);
  }
  return options.stdio === "inherit" ? "" : result.stdout ?? "";
}

function git(args, cwd, options = {}) { return command("git", args, cwd, options); }
function gitOk(args, cwd) { return spawnSync("git", args, { cwd, stdio: "ignore", windowsHide: true }).status === 0; }
function npmCommand() { return process.platform === "win32" ? "npm.cmd" : "npm"; }
function opencodeCommand() { return process.platform === "win32" ? "opencode.cmd" : "opencode"; }
function positiveInt(value, label) { const parsed = Number.parseInt(value, 10); if (!Number.isFinite(parsed) || parsed <= 0) throw new Error(`${label} inválido: ${value}`); return parsed; }
function markdownCells(line) { return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim()); }
function normalizeHeader(value) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""); }
function normalizeState(value) { return value.trim().toLowerCase().replace(/`/g, ""); }
function normalizeSlashes(value) { return value.split(path.sep).join("/"); }
function slug(value) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "task"; }
function safeName(value) { return value.replace(/[^a-zA-Z0-9._-]+/g, "-"); }
function phaseIdFromDirectory(value) { return value.match(/^(UX-NAV-\d+|ST-S\d+|F\d+)/)?.[1] ?? slug(value).toUpperCase(); }
function delay(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
function truncate(value, max) { const text = String(value ?? ""); return text.length > max ? `${text.slice(0, max)}\n...[truncated]` : text; }
function isFailedCheck(check) { const value = `${check.bucket ?? ""} ${check.state ?? ""}`.toLowerCase(); return /(fail|cancel|error|timed_out|action_required)/.test(value); }
function isPassedCheck(check) { const value = `${check.bucket ?? ""} ${check.state ?? ""}`.toLowerCase(); return /(pass|success|neutral|skipping|skipped)/.test(value); }
