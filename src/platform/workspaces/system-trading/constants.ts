export const SYSTEM_TRADING = {
  organization: {
    key: "system-trading",
    name: "System Trading",
  },
  workspace: {
    key: "system-trading",
    name: "System Trading",
    adaptationKey: "system-trading",
    repository: {
      owner: "delmacy" as string,
      name: "gestaotecnica" as string,
      url: "https://github.com/delmacy/gestaotecnica" as string,
      branch: "main" as string,
    },
    environment: {
      stage: "production" as string,
      label: "Produção" as string,
      runtime: "system-builder" as string,
      database: "tec_db" as string,
    },
  },
  tradingLab: {
    moduleKey: "trading-lab",
    name: "Trading Lab",
    description:
      "Operação de trading executada sobre o System Builder: ordens, posições, execuções e resultados auditáveis.",
    layer: "module",
    status: "implemented",
    sortOrder: 0,
  },
} as const;

export type SystemTradingRepositoryMetadata =
  typeof SYSTEM_TRADING.workspace.repository;

export type SystemTradingEnvironmentMetadata =
  typeof SYSTEM_TRADING.workspace.environment;

export const SYSTEM_TRADING_WORKSPACE_KEY = SYSTEM_TRADING.workspace.key;

export const SYSTEM_TRADING_TRADING_LAB_MODULE_KEY =
  SYSTEM_TRADING.tradingLab.moduleKey;

export const SYSTEM_TRADING_REGISTRATION_EVENT = "workspace.registered";

export const SYSTEM_TRADING_REGISTRATION_IDEMPOTENCY_KEY =
  "system-trading-workspace-registration";
