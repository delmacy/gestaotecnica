import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

type Finding = {
  file: string;
  line: number;
  rule: string;
  text: string;
};

const repoRoot = process.cwd();
const scanAll = process.argv.includes("--all");
const allowedMarker = "explicit-any-ok";
const sourceExtensions = new Set([".ts", ".tsx"]);
const ignoredSegments = new Set([
  ".git",
  ".next",
  "build",
  "coverage",
  "dist",
  "node_modules",
]);

const rules: Array<{ name: string; pattern: RegExp }> = [
  { name: "as any", pattern: /\bas\s+any\b/ }, // explicit-any-ok
  { name: "type annotation any", pattern: /[:=,(<]\s*any\b/ },
  { name: "generic any", pattern: /<[^>\n]*\bany\b[^>\n]*>/ },
  { name: "z.any()", pattern: /\bz\.any\s*\(/ }, // explicit-any-ok
];

function git(args: string[]): string {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function pathIsIgnored(filePath: string): boolean {
  const parts = filePath.split(/[\\/]+/);
  return parts.some((part) => ignoredSegments.has(part));
}

function isSourceFile(filePath: string): boolean {
  return sourceExtensions.has(path.extname(filePath)) && !filePath.endsWith(".d.ts");
}

function getDiffBase(): string | null {
  const explicitBase = process.env.EXPLICIT_ANY_BASE_REF;
  if (explicitBase) {
    return explicitBase;
  }

  const githubBaseRef = process.env.GITHUB_BASE_REF;
  if (githubBaseRef) {
    try {
      return git(["merge-base", "HEAD", `origin/${githubBaseRef}`]);
    } catch {
      return null;
    }
  }

  try {
    return git(["rev-parse", "HEAD~1"]);
  } catch {
    return null;
  }
}

function listChangedFiles(): string[] {
  if (scanAll) {
    return git(["ls-files"]).split(/\r?\n/).filter(Boolean);
  }

  const base = getDiffBase();
  if (!base) {
    return git(["ls-files"]).split(/\r?\n/).filter(Boolean);
  }

  return git(["diff", "--name-only", "--diff-filter=ACMR", `${base}...HEAD`])
    .split(/\r?\n/)
    .filter(Boolean);
}

function normalizeForAnnotation(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

function scanFile(filePath: string): Finding[] {
  const absolutePath = path.join(repoRoot, filePath);
  if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
    return [];
  }

  const lines = readFileSync(absolutePath, "utf8").split(/\r?\n/);
  const findings: Finding[] = [];

  lines.forEach((lineText, index) => {
    if (lineText.includes(allowedMarker)) {
      return;
    }

    for (const rule of rules) {
      if (rule.pattern.test(lineText)) {
        findings.push({
          file: filePath,
          line: index + 1,
          rule: rule.name,
          text: lineText.trim(),
        });
        return;
      }
    }
  });

  return findings;
}

const files = listChangedFiles()
  .filter((filePath) => isSourceFile(filePath))
  .filter((filePath) => !pathIsIgnored(filePath));

const findings = files.flatMap(scanFile);

if (findings.length > 0) {
  console.error("Explicit any usage is not allowed in changed TypeScript files.");
  for (const finding of findings) {
    const message = `${finding.rule}: replace explicit any with unknown or a specific type. Found: ${finding.text}`;
    console.error(
      `::error file=${normalizeForAnnotation(finding.file)},line=${finding.line}::${message}`,
    );
  }
  process.exit(1);
}

console.log(`No explicit any usage found in ${files.length} changed TypeScript file(s).`);
