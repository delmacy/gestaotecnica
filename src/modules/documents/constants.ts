import { activeAdaptation } from "@/adaptations/active";

export const documentStatuses = [
  { value: "draft", label: "Rascunho" },
  { value: "prepared_by_secretary", label: "Preparado pela secretaria" },
  { value: "waiting_technician_review", label: "Aguardando revisao operacional" },
  { value: "waiting_supervisor_approval", label: "Aguardando aprovacao" },
  { value: "approved", label: "Aprovado" },
  { value: "signed", label: "Assinado" },
  { value: "exported_to_legacy", label: "Exportado ao legado" },
  { value: "archived", label: "Arquivado" },
  { value: "returned_for_correction", label: "Retornado para correcao" },
] as const;

export const documentTypes = activeAdaptation.documentTemplates.map((template) => ({
  value: template.key,
  label: template.label,
}));

export type DocumentStatusValue = (typeof documentStatuses)[number]["value"];

export function getDocumentStatusLabel(value: string) {
  return documentStatuses.find((item) => item.value === value)?.label ?? value;
}

export function getDocumentTypeLabel(value: string) {
  return documentTypes.find((item) => item.value === value)?.label ?? value;
}
