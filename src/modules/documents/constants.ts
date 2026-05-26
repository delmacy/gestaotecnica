export const documentStatuses = [
  { value: "draft", label: "Rascunho" },
  { value: "prepared_by_secretary", label: "Preparado pela secretaria" },
  { value: "waiting_technician_review", label: "Aguardando revisao tecnica" },
  { value: "waiting_supervisor_approval", label: "Aguardando aprovacao" },
  { value: "approved", label: "Aprovado" },
  { value: "signed", label: "Assinado" },
  { value: "exported_to_legacy", label: "Exportado ao legado" },
  { value: "archived", label: "Arquivado" },
  { value: "returned_for_correction", label: "Retornado para correcao" },
] as const;

export const documentTypes = [
  { value: "technical_report", label: "Relatorio tecnico" },
  { value: "dispatch", label: "Despacho" },
  { value: "handover", label: "Passagem de servico" },
  { value: "legacy_summary", label: "Resumo para legado" },
] as const;

export type DocumentStatusValue = (typeof documentStatuses)[number]["value"];

export function getDocumentStatusLabel(value: string) {
  return documentStatuses.find((item) => item.value === value)?.label ?? value;
}

export function getDocumentTypeLabel(value: string) {
  return documentTypes.find((item) => item.value === value)?.label ?? value;
}
