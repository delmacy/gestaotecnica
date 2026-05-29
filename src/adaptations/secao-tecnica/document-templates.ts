export const documentTemplates = [
  {
    key: "technical_report",
    label: "Relatorio Tecnico",
    target: "service_order",
  },
  {
    key: "dispatch_draft",
    label: "Minuta de Despacho",
    target: "work_item",
  },
  {
    key: "legacy_submission_note",
    label: "Registro para Sistema Oficial",
    target: "legacy_record",
  },
  {
    key: "shift_handover",
    label: "Passagem de Turno",
    target: "shift_log",
  },
] as const;
