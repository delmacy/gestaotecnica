export const reportTemplates = [
  {
    key: "service_order_summary",
    label: "Resumo de Ordem de Servico",
    target: "service_order",
  },
  {
    key: "shift_log_summary",
    label: "Resumo do Livro de Turno",
    target: "shift_log",
  },
  {
    key: "monthly_operational_summary",
    label: "Resumo Operacional Mensal",
    target: "period",
  },
  {
    key: "asset_history_summary",
    label: "Historico de Ativo",
    target: "asset",
  },
] as const;
