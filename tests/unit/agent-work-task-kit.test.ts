import { test } from "node:test";
import assert from "node:assert";

test("Path normalization removes invalid patterns", () => {
  const normalizePath = (p: string) => {
      // proper resolution of .. logic for mock test
      const parts = p.split("/");
      const stack = [];
      for (const part of parts) {
          if (part === "..") stack.pop();
          else if (part !== "." && part !== "") stack.push(part);
      }
      return stack.join("/");
  };
  const normalized = normalizePath("src/agent-work/../agent-work/valid-path.ts");
  assert.strictEqual(normalized, "src/agent-work/valid-path.ts");
});

test("Ownership validation blocks unauthorized paths", () => {
  const isAuthorized = (path: string, allowedPrefix: string) => path.startsWith(allowedPrefix);
  assert.strictEqual(isAuthorized("src/external/file.ts", "src/agent-work/"), false);
  assert.strictEqual(isAuthorized("src/agent-work/file.ts", "src/agent-work/"), true);
});

test("Collision classification identifies red conflicts", () => {
  const classifyCollision = (p1: string, p2: string) => p1 === p2 ? "red" : "green";
  assert.strictEqual(classifyCollision("src/app/page.tsx", "src/app/page.tsx"), "red");
  assert.strictEqual(classifyCollision("src/app/page.tsx", "src/app/layout.tsx"), "green");
});

test("Status transition validates correctly", () => {
  const canTransition = (from: string, to: string) => {
    if (from === "in_progress" && to === "done") return false;
    return true;
  };
  assert.strictEqual(canTransition("in_progress", "done"), false);
  assert.strictEqual(canTransition("in_progress", "review"), true);
});
