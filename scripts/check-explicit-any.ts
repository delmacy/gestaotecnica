import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

type Finding = {
  file: string;
  line: number;
  column: number;
  rule: string;
  text: string;
};

const repoRoot = process.cwd();
const scanAll = process.argv.includes("--all");
const fixMode = process.argv.includes("--fix");
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

  const files = new Set<string>();
  const base = getDiffBase();
  if (base) {
    git(["diff", "--name-only", "--diff-filter=ACMR", `${base}...HEAD`])
      .split(/\r?\n/)
      .filter(Boolean)
      .forEach((filePath) => files.add(filePath));
  } else {
    git(["ls-files"])
      .split(/\r?\n/)
      .filter(Boolean)
      .forEach((filePath) => files.add(filePath));
  }

  git(["diff", "--name-only", "--diff-filter=ACMR"])
    .split(/\r?\n/)
    .filter(Boolean)
    .forEach((filePath) => files.add(filePath));

  git(["diff", "--cached", "--name-only", "--diff-filter=ACMR"])
    .split(/\r?\n/)
    .filter(Boolean)
    .forEach((filePath) => files.add(filePath));

  git(["ls-files", "--others", "--exclude-standard"])
    .split(/\r?\n/)
    .filter(Boolean)
    .forEach((filePath) => files.add(filePath));

  return [...files];
}

function normalizeForAnnotation(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

function lineTextAt(lines: string[], line: number): string {
  return lines[line - 1] ?? "";
}

function isAllowedLine(lines: string[], line: number): boolean {
  return lineTextAt(lines, line).includes(allowedMarker);
}

function lineAndColumn(sourceFile: ts.SourceFile, position: number): { line: number; column: number } {
  const location = sourceFile.getLineAndCharacterOfPosition(position);
  return { line: location.line + 1, column: location.character + 1 };
}

function classifyAnyNode(node: ts.Node): string {
  const parent = node.parent;

  if (parent && ts.isAsExpression(parent)) {
    return "as any cast";
  }
  if (parent && ts.isTypeAssertionExpression(parent)) {
    return "<any> cast";
  }
  if (parent && ts.isArrayTypeNode(parent)) {
    return "any[] array type";
  }
  if (parent && ts.isTypeReferenceNode(parent)) {
    return "generic any type argument";
  }
  if (parent && ts.isParameter(parent)) {
    return "parameter any annotation";
  }
  if (parent && (ts.isPropertySignature(parent) || ts.isPropertyDeclaration(parent))) {
    return "property any annotation";
  }
  if (parent && ts.isTypeAliasDeclaration(parent)) {
    return "type alias to any";
  }
  if (parent && ts.isFunctionLike(parent)) {
    return "return any annotation";
  }
  if (parent && ts.isVariableDeclaration(parent)) {
    return "variable any annotation";
  }
  if (parent && ts.isSatisfiesExpression(parent)) {
    return "satisfies any";
  }

  return "explicit any type";
}

function scanSourceFile(filePath: string, text: string): Finding[] {
  const sourceFile = ts.createSourceFile(
    filePath,
    text,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const lines = text.split(/\r?\n/);
  const findings: Finding[] = [];

  function addFinding(line: number, column: number, rule: string): void {
    if (isAllowedLine(lines, line)) {
      return;
    }
    findings.push({
      file: filePath,
      line,
      column,
      rule,
      text: lineTextAt(lines, line).trim(),
    });
  }

  function visit(node: ts.Node): void {
    if (node.kind === ts.SyntaxKind.AnyKeyword) {
      const position = lineAndColumn(sourceFile, node.getStart(sourceFile));
      addFinding(position.line, position.column, classifyAnyNode(node));
    }

    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.expression.getText(sourceFile) === "z" &&
      node.expression.name.text === "any"
    ) {
      const position = lineAndColumn(sourceFile, node.expression.name.getStart(sourceFile));
      addFinding(position.line, position.column, "z.any() schema escape hatch");
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  lines.forEach((lineText, index) => {
    if (lineText.includes(allowedMarker)) {
      return;
    }
    if (/eslint-disable(?:-next-line|-line)?\s+@typescript-eslint\/no-explicit-any/.test(lineText)) {
      addFinding(index + 1, Math.max(1, lineText.indexOf("eslint-disable") + 1), "eslint no-explicit-any disable");
    }
    if (/@(?:type|param|returns?)\s*\{[^}\n]*\bany\b[^}\n]*\}/.test(lineText)) {
      addFinding(index + 1, Math.max(1, lineText.indexOf("@") + 1), "JSDoc any annotation");
    }
  });

  return findings;
}

function scanFile(filePath: string): Finding[] {
  const absolutePath = path.join(repoRoot, filePath);
  if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
    return [];
  }

  return scanSourceFile(filePath, readFileSync(absolutePath, "utf8"));
}

function applyMechanicalFix(filePath: string, findingsForFile: Finding[]): void {
  const absolutePath = path.join(repoRoot, filePath);
  const original = readFileSync(absolutePath, "utf8");
  const fixableLines = new Set(
    findingsForFile
      .filter((finding) => finding.rule !== "eslint no-explicit-any disable")
      .map((finding) => finding.line),
  );
  const fixed = original
    .split(/\r?\n/)
    .map((line, index) => {
      if (!fixableLines.has(index + 1) || line.includes(allowedMarker)) {
        return line;
      }

      return line
        .replace(/\bz\.any\s*\(/g, "z.unknown(")
        .replace(/\bas\s+any(\s*\[\s*\])?/g, (_match, arraySuffix: string | undefined) =>
          arraySuffix ? "as unknown[]" : "as unknown",
        )
        .replace(/<\s*any\s*>/g, "<unknown>")
        .replace(/\bany\s*\[\s*\]/g, "unknown[]")
        .replace(/\bany\b/g, "unknown");
    })
    .join("\n");

  if (fixed !== original) {
    writeFileSync(absolutePath, fixed);
  }
}

const files = listChangedFiles()
  .filter((filePath) => isSourceFile(filePath))
  .filter((filePath) => !pathIsIgnored(filePath));

const initialFindings = files.flatMap(scanFile);

if (fixMode) {
  const findingsByFile = new Map<string, Finding[]>();
  for (const finding of initialFindings) {
    const fileFindings = findingsByFile.get(finding.file) ?? [];
    fileFindings.push(finding);
    findingsByFile.set(finding.file, fileFindings);
  }

  for (const [filePath, fileFindings] of findingsByFile) {
    applyMechanicalFix(filePath, fileFindings);
  }
  console.log(
    `Applied mechanical explicit-any replacements in ${findingsByFile.size} changed TypeScript file(s). Run npm run check:no-explicit-any and npx tsc --noEmit next.`,
  );
}

const findings = files.flatMap(scanFile);

if (findings.length > 0) {
  console.error("Explicit any usage is not allowed in changed TypeScript files.");
  console.error(`Allowed exception: add ${allowedMarker} on the same line only for scanner fixtures or documented boundary shims.`);
  console.error("Preferred replacements: domain DTOs, schema-inferred types, generics, Record<string, unknown>, unknown, or z.unknown().");
  console.error("For mechanical first-pass cleanup, run: npm run check:no-explicit-any:fix");
  for (const finding of findings) {
    const message = `${finding.rule}: replace explicit any with unknown or a specific type. Found: ${finding.text}`;
    console.error(
      `::error file=${normalizeForAnnotation(finding.file)},line=${finding.line},col=${finding.column}::${message}`,
    );
  }
  process.exit(1);
}

console.log(`No explicit any usage found in ${files.length} changed TypeScript file(s).`);
