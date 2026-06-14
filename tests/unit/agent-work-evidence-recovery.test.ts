import { test } from "node:test";
import * as assert from "node:assert";
import {
  validateHistoricalExecution,
  collectHistoricalDiff,
} from "../../src/agent-work/services/evidence-recovery";
import { execSync } from "child_process";

test("Evidence Recovery: validateHistoricalExecution rejects non-existent SHA", async (t) => {
  const input: any = {
    baseSha: "nonexistent-base",
    headSha: "nonexistent-head",
    mergeCommitSha: "nonexistent-merge"
  };

  await assert.rejects(async () => {
    await validateHistoricalExecution(input);
  }, /Git validation failed/);
});

test("Evidence Recovery: collectHistoricalDiff rejects empty diff", async (t) => {
  const head = execSync("git rev-parse HEAD").toString().trim();
  const input: any = {
    baseSha: head,
    headSha: head,
    expectedFiles: []
  };
  const pkg: any = {};

  assert.throws(() => {
    collectHistoricalDiff(input, pkg);
  }, /Diff base..head is empty/);
});

test("Evidence Recovery: collectHistoricalDiff rejects mismatched files", async (t) => {
  const head = execSync("git rev-parse HEAD").toString().trim();
  const parent = execSync("git rev-parse HEAD~1").toString().trim();

  const actualFiles = execSync(`git diff --name-only ${parent}..${head}`).toString().trim().split("\n");

  const input: any = {
    baseSha: parent,
    headSha: head,
    expectedFiles: ["wrong-file.txt"]
  };
  const pkg: any = {
    ownedPaths: ["**"]
  };

  assert.throws(() => {
    collectHistoricalDiff(input, pkg);
  }, /Actual changed files do not match expected files/);
});
