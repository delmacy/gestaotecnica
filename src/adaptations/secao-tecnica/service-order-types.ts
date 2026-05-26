export const serviceOrderTypes = [
  {
    key: "manutencao",
    label: "Manutencao",
    description: "Execucao formal de manutencao tecnica.",
    requiresAsset: true,
    requiresTimeEntry: true,
    requiresEvidence: false,
    requiresSupervisorApproval: true,
  },
  {
    key: "vistoria",
    label: "Vistoria",
    description: "Execucao formal de vistoria tecnica.",
    requiresAsset: false,
    requiresTimeEntry: true,
    requiresEvidence: true,
    requiresSupervisorApproval: true,
  },
  {
    key: "atividade_administrativa",
    label: "Atividade Administrativa",
    description: "Uso formal de mao de obra em atividade administrativa.",
    requiresAsset: false,
    requiresTimeEntry: true,
    requiresEvidence: false,
    requiresSupervisorApproval: false,
  },
  {
    key: "apoio_operacional",
    label: "Apoio Operacional",
    description: "Atendimento tecnico-operacional ou suporte a operacao.",
    requiresAsset: false,
    requiresTimeEntry: true,
    requiresEvidence: false,
    requiresSupervisorApproval: true,
  },
] as const;

export type ServiceOrderTypeKey = (typeof serviceOrderTypes)[number]["key"];
