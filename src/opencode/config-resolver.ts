export type ModelTier = "simple" | "standard" | "advanced";

export interface AgentRuntimeConfig {
  tier: ModelTier;
  provider: string;
  model: string;
  apiKeySet: boolean;
  fallbackIndex: number;
}

const FALLBACK_MODELS: Record<ModelTier, string[]> = {
  simple: [
    "opencode/deepseek-v4-flash-free",
    "opencode/ling-3.0-flash-free",
    "opencode/nemotron-3-ultra-free",
    "opencode/mimo-v2.5-free",
    "opencode/north-mini-code-free",
    "opencode/laguna-s-2.1-free",
    "opencode/deepseek-v4-flash",
    "opencode/gemini-3.5-flash-lite",
    "opencode/gpt-5.4-nano",
  ],
  standard: [
    "opencode/qwen3.6-plus",
    "opencode/qwen3.5-plus",
    "opencode/minimax-m2.5",
    "opencode/minimax-m2.7",
    "opencode/kimi-k2.6",
    "opencode/kimi-k2.5",
    "opencode/deepseek-v4-pro",
    "opencode/gpt-5.4-mini",
    "opencode/gpt-5.3-codex-spark",
    "opencode/claude-haiku-4-5",
    "opencode/gemini-3.1-pro",
    "opencode/gemini-3-flash",
  ],
  advanced: [
    "opencode/claude-sonnet-4",
    "opencode/claude-sonnet-4-5",
    "opencode/claude-sonnet-4-6",
    "opencode/claude-sonnet-5",
    "opencode/claude-opus-4-1",
    "opencode/claude-opus-4-5",
    "opencode/claude-opus-4-6",
    "opencode/claude-opus-4-7",
    "opencode/claude-opus-4-8",
    "opencode/claude-opus-5",
    "opencode/claude-fable-5",
    "opencode/gpt-5.5",
    "opencode/gpt-5.5-pro",
    "opencode/gpt-5.6-sol",
    "opencode/gpt-5.6-terra",
    "opencode/gpt-5.6-luna",
    "opencode/grok-4.5",
    "opencode/kimi-k3",
    "opencode/kimi-k2.7-code",
    "opencode/minimax-m3",
    "opencode/glm-5.2",
    "opencode/glm-5.1",
    "opencode/glm-5",
  ],
};

export function getFallbackModels(tier: ModelTier): readonly string[] {
  return FALLBACK_MODELS[tier];
}

export class MissingEnvironmentVariableError extends Error {
  constructor(variable: string, provider: string) {
    super(
      `${variable} is not configured for the provider "${provider}".`,
    );
    this.name = "MissingEnvironmentVariableError";
  }
}

export class MissingModelConfigurationError extends Error {
  constructor(tier: string) {
    super(
      `No model was configured for tier "${tier}".\nConfigure the corresponding OPENCODE_MODEL_* variable.`,
    );
    this.name = "MissingModelConfigurationError";
  }
}

export class UnsupportedModelTierError extends Error {
  constructor(tier: string) {
    super(
      `Invalid model tier: "${tier}".\nAccepted values: simple, standard, advanced.`,
    );
    this.name = "UnsupportedModelTierError";
  }
}

export class ProviderAuthenticationError extends Error {
  constructor(provider: string, secretName: string) {
    super(
      `The provider "${provider}" rejected authentication. Verify the secret ${secretName}.`,
    );
    this.name = "ProviderAuthenticationError";
  }
}

export class ModelNotFoundError extends Error {
  constructor(model: string, provider: string) {
    super(
      `The requested model was not found or is not available on the provider.\nModel: ${model}\nProvider: ${provider}`,
    );
    this.name = "ModelNotFoundError";
  }
}

const VALID_TIERS: ModelTier[] = ["simple", "standard", "advanced"];

const TIER_TO_ENV_VAR: Record<ModelTier, string> = {
  simple: "OPENCODE_MODEL_SIMPLE",
  standard: "OPENCODE_MODEL_STANDARD",
  advanced: "OPENCODE_MODEL_ADVANCED",
};

const DEFAULT_TIER: ModelTier = "simple";

function normalizeTier(raw: string | undefined): ModelTier {
  if (!raw) return DEFAULT_TIER;
  const trimmed = raw.trim().toLowerCase();
  if (trimmed === "complex") return "advanced";
  if (!VALID_TIERS.includes(trimmed as ModelTier)) {
    throw new UnsupportedModelTierError(raw);
  }
  return trimmed as ModelTier;
}

function resolveProvider(model: string): string {
  if (model.startsWith("opencode/")) return "opencode";
  if (model.includes("/")) {
    const candidate = model.split("/")[0]!.toLowerCase();
    if (["openai", "anthropic", "google", "deepseek", "minimax", "kimi", "qwen", "ling", "glm"].includes(candidate)) {
      return "openrouter";
    }
  }
  if (model.startsWith("gpt-") || model.startsWith("o")) return "openai";
  if (model.startsWith("claude-")) return "anthropic";
  if (model.startsWith("gemini-")) return "google";
  return "opencode";
}

function resolveApiKeyEnvVar(provider: string): string {
  switch (provider) {
    case "opencode":
      return "OPEN_CODE_API";
    case "openai":
      return "OPENAI_API_KEY";
    case "anthropic":
      return "ANTHROPIC_API_KEY";
    case "google":
      return "GOOGLE_API_KEY";
    case "openrouter":
      return "OPENROUTER_API_KEY";
    default:
      return "OPEN_CODE_API";
  }
}

export function resolveAgentRuntimeConfig(
  tier?: string,
  env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): AgentRuntimeConfig {
  const resolvedTier = normalizeTier(tier);
  const envVarName = TIER_TO_ENV_VAR[resolvedTier];
  const model = env[envVarName]?.trim();

  if (!model) {
    throw new MissingModelConfigurationError(resolvedTier);
  }

  const provider = resolveProvider(model);
  const apiKeyEnvVar = resolveApiKeyEnvVar(provider);
  const apiKeySet = Boolean(env[apiKeyEnvVar]);

  return {
    tier: resolvedTier,
    provider,
    model,
    apiKeySet,
    fallbackIndex: 0,
  };
}

export function resolveWithFallback(
  tier?: string,
  env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): AgentRuntimeConfig {
  const resolvedTier = normalizeTier(tier);
  const envVarName = TIER_TO_ENV_VAR[resolvedTier];
  const configuredModel = env[envVarName]?.trim();
  const fallbacks = FALLBACK_MODELS[resolvedTier];

  let model = configuredModel;
  let fallbackIndex = 0;

  if (model) {
    return {
      tier: resolvedTier,
      provider: resolveProvider(model),
      model,
      apiKeySet: Boolean(env[resolveApiKeyEnvVar(resolveProvider(model))]),
      fallbackIndex: -1,
    };
  }

  for (let i = 0; i < fallbacks.length; i++) {
    const candidate = fallbacks[i];
    if (candidate) {
      model = candidate;
      fallbackIndex = i;
      break;
    }
  }

  if (!model) {
    throw new MissingModelConfigurationError(resolvedTier);
  }

  const provider = resolveProvider(model);
  const apiKeyEnvVar = resolveApiKeyEnvVar(provider);

  return {
    tier: resolvedTier,
    provider,
    model,
    apiKeySet: Boolean(env[apiKeyEnvVar]),
    fallbackIndex,
  };
}

export function maskSecret(value: string): string {
  if (!value) return "(empty)";
  if (value.length <= 4) return "****";
  return `${"*".repeat(value.length - 4)}${value.slice(-4)}`;
}

export function diagnosticReport(
  env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): string {
  const lines: string[] = [];
  const tiers: ModelTier[] = ["simple", "standard", "advanced"];

  for (const tier of tiers) {
    const envVar = TIER_TO_ENV_VAR[tier];
    const model = env[envVar];
    lines.push(`[${tier}] ${envVar}: ${model ? "configured" : "NOT SET"}`);
  }

  const providers = [
    { name: "openrouter", envVar: "OPENROUTER_API_KEY" },
    { name: "openai", envVar: "OPENAI_API_KEY" },
    { name: "anthropic", envVar: "ANTHROPIC_API_KEY" },
    { name: "google", envVar: "GOOGLE_API_KEY" },
  ];

  for (const { name, envVar } of providers) {
    const key = env[envVar];
    if (key) {
      lines.push(`[provider] ${name}: configured (${maskSecret(key)})`);
    }
  }

  return lines.join("\n");
}
