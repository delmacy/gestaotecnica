import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  resolveAgentRuntimeConfig,
  resolveWithFallback,
  getFallbackModels,
  maskSecret,
  diagnosticReport,
  MissingModelConfigurationError,
  UnsupportedModelTierError,
} from "../../../src/opencode/config-resolver";

const FAKE_KEY = "test-openrouter-key";

const baseEnv = {
  OPENCODE_MODEL_SIMPLE: "opencode/deepseek-v4-flash-free",
  OPENCODE_MODEL_STANDARD: "opencode/qwen3.6-plus",
  OPENCODE_MODEL_ADVANCED: "opencode/claude-sonnet-4",
  OPEN_CODE_API: FAKE_KEY,
  OPENROUTER_API_KEY: undefined,
  OPENAI_API_KEY: undefined,
  ANTHROPIC_API_KEY: undefined,
  GOOGLE_API_KEY: undefined,
};

const emptyEnv = {
  OPENCODE_MODEL_SIMPLE: undefined,
  OPENCODE_MODEL_STANDARD: undefined,
  OPENCODE_MODEL_ADVANCED: undefined,
  OPENROUTER_API_KEY: FAKE_KEY,
  OPENAI_API_KEY: undefined,
  ANTHROPIC_API_KEY: undefined,
  GOOGLE_API_KEY: undefined,
};

describe("resolveAgentRuntimeConfig", () => {
  it("selects OPENCODE_MODEL_SIMPLE for simple tier", () => {
    const config = resolveAgentRuntimeConfig("simple", baseEnv);
    assert.strictEqual(config.tier, "simple");
    assert.strictEqual(config.model, "deepseek/deepseek-chat-v3-0324");
    assert.strictEqual(config.provider, "openrouter");
    assert.strictEqual(config.apiKeySet, true);
    assert.strictEqual(config.fallbackIndex, 0);
  });

  it("selects OPENCODE_MODEL_STANDARD for standard tier", () => {
    const config = resolveAgentRuntimeConfig("standard", baseEnv);
    assert.strictEqual(config.tier, "standard");
    assert.strictEqual(config.model, "anthropic/claude-sonnet-4-20250514");
    assert.strictEqual(config.provider, "openrouter");
    assert.strictEqual(config.apiKeySet, true);
  });

  it("selects OPENCODE_MODEL_ADVANCED for advanced tier", () => {
    const config = resolveAgentRuntimeConfig("advanced", baseEnv);
    assert.strictEqual(config.tier, "advanced");
    assert.strictEqual(config.model, "anthropic/claude-opus-4-1-20250414");
    assert.strictEqual(config.provider, "openrouter");
    assert.strictEqual(config.apiKeySet, true);
  });

  it("rejects invalid tier", () => {
    assert.throws(
      () => resolveAgentRuntimeConfig("fast", baseEnv),
      UnsupportedModelTierError,
    );
  });

  it("rejects missing model for tier", () => {
    const envWithoutSimple = { ...baseEnv, OPENCODE_MODEL_SIMPLE: undefined };
    assert.throws(
      () => resolveAgentRuntimeConfig("simple", envWithoutSimple),
      MissingModelConfigurationError,
    );
  });

  it("rejects missing API key", () => {
    const envWithoutKey = { ...baseEnv, OPENROUTER_API_KEY: undefined };
    const config = resolveAgentRuntimeConfig("simple", envWithoutKey);
    assert.strictEqual(config.apiKeySet, false);
  });

  it("does not override process env with passed env", () => {
    const ciEnv = {
      OPENCODE_MODEL_SIMPLE: "ci-injected-model",
      OPENROUTER_API_KEY: "ci-key",
    };
    const config = resolveAgentRuntimeConfig("simple", ciEnv);
    assert.strictEqual(config.model, "ci-injected-model");
    assert.strictEqual(config.apiKeySet, true);
  });

  it("resolves openai provider and key", () => {
    const env = {
      OPENCODE_MODEL_SIMPLE: "gpt-4o",
      OPENAI_API_KEY: "sk-test",
      OPENROUTER_API_KEY: undefined,
    };
    const config = resolveAgentRuntimeConfig("simple", env);
    assert.strictEqual(config.provider, "openai");
    assert.strictEqual(config.apiKeySet, true);
  });

  it("resolves anthropic provider and key", () => {
    const env = {
      OPENCODE_MODEL_SIMPLE: "claude-sonnet-4-20250514",
      ANTHROPIC_API_KEY: "sk-ant-test",
    };
    const config = resolveAgentRuntimeConfig("simple", env);
    assert.strictEqual(config.provider, "anthropic");
    assert.strictEqual(config.apiKeySet, true);
  });

  it("defaults to simple tier when not provided", () => {
    const config = resolveAgentRuntimeConfig(undefined, baseEnv);
    assert.strictEqual(config.tier, "simple");
    assert.strictEqual(config.model, "deepseek/deepseek-chat-v3-0324");
  });

  it("normalizes 'complex' tier to 'advanced'", () => {
    const config = resolveAgentRuntimeConfig("complex", baseEnv);
    assert.strictEqual(config.tier, "advanced");
    assert.strictEqual(config.model, "anthropic/claude-opus-4-1-20250414");
  });
});

describe("resolveWithFallback", () => {
  it("uses configured model when available (fallbackIndex -1)", () => {
    const config = resolveWithFallback("simple", baseEnv);
    assert.strictEqual(config.model, "deepseek/deepseek-chat-v3-0324");
    assert.strictEqual(config.fallbackIndex, -1);
  });

  it("falls back to first free model when tier env is missing", () => {
    const config = resolveWithFallback("simple", emptyEnv);
    assert.strictEqual(config.model, "deepseek-v4-flash-free");
    assert.strictEqual(config.fallbackIndex, 0);
  });

  it("falls back to standard free model when standard env is missing", () => {
    const config = resolveWithFallback("standard", emptyEnv);
    assert.strictEqual(config.model, "qwen3.6-plus");
    assert.strictEqual(config.fallbackIndex, 0);
  });

  it("falls back to advanced model when advanced env is missing", () => {
    const config = resolveWithFallback("advanced", emptyEnv);
    assert.strictEqual(config.model, "claude-sonnet-4");
    assert.strictEqual(config.fallbackIndex, 0);
  });

  it("always has fallback models for simple tier", () => {
    const config = resolveWithFallback("simple", {
      OPENCODE_MODEL_SIMPLE: undefined,
      OPENROUTER_API_KEY: FAKE_KEY,
    });
    assert.ok(config.model.length > 0);
    assert.ok(config.fallbackIndex >= 0);
  });
});

describe("getFallbackModels", () => {
  it("returns free-first list for simple tier", () => {
    const fallbacks = getFallbackModels("simple");
    assert.ok(fallbacks[0]?.includes("free"));
  });

  it("returns medium-cost models for standard tier", () => {
    const fallbacks = getFallbackModels("standard");
    assert.ok(fallbacks.includes("qwen3.6-plus"));
    assert.ok(fallbacks.includes("minimax-m2.5"));
  });

  it("returns premium models for advanced tier", () => {
    const fallbacks = getFallbackModels("advanced");
    assert.ok(fallbacks.includes("claude-sonnet-4"));
    assert.ok(fallbacks.includes("claude-opus-4-1"));
  });
});

describe("maskSecret", () => {
  it("masks long secrets showing last 4 chars", () => {
    assert.strictEqual(maskSecret("abcdefghijklmnop"), "************mnop");
  });

  it("masks short secrets completely", () => {
    assert.strictEqual(maskSecret("abc"), "****");
  });

  it("handles empty string", () => {
    assert.strictEqual(maskSecret(""), "(empty)");
  });

  it("handles exactly 4 chars", () => {
    assert.strictEqual(maskSecret("abcd"), "****");
  });
});

describe("diagnosticReport", () => {
  it("shows configured and missing values", () => {
    const report = diagnosticReport(baseEnv);
    assert.ok(report.includes("OPENCODE_MODEL_SIMPLE: configured"));
    assert.ok(report.includes("openrouter: configured"));
  });

  it("does not expose secret values", () => {
    const report = diagnosticReport(baseEnv);
    assert.ok(!report.includes(FAKE_KEY));
  });
});
