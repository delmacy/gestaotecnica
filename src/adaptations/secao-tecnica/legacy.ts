export const legacyConfig = {
  enabled: true,
  systemName: "Sistema Oficial",
  mode: "manual-first",
  storesProtocolNumber: true,
  storesExternalRecordId: true,
  storesExternalStatus: true,
  futureAutomation: {
    enabled: false,
    strategy: "n8n-or-rpa",
  },
} as const;
