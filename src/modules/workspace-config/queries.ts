import { activeAdaptation } from "@/adaptations/active";
import type { WorkspaceModuleConfig } from "@/platform/workspaces/types";

const ecosystemModules: WorkspaceModuleConfig[] = [
  {
    key: "events",
    name: "Eventos",
    description: "Memoria operacional, auditoria, timeline e historico por entidade.",
    layer: "platform",
    status: "implemented",
  },
  {
    key: "workflow",
    name: "Workflow",
    description: "Estados, transicoes e governanca de execucao dos fluxos.",
    layer: "platform",
    status: "planned",
  },
  {
    key: "documents",
    name: "Documentos",
    description: "Templates, evidencias, relatorios tecnicos e aprovacao documental.",
    layer: "module",
    status: "implemented",
  },
  {
    key: "work-items",
    name: "Demandas",
    description: "Envelope universal de entrada, triagem e priorizacao.",
    layer: "module",
    status: "adjusted",
  },
  {
    key: "service-orders",
    name: "Ordens de Servico",
    description: "Execucao autorizada de mao de obra, tempo, evidencias e aprovacao.",
    layer: "module",
    status: "implemented",
  },
  {
    key: "assets",
    name: "Ativos",
    description: "Equipamentos, infraestrutura, sistemas e historico operacional.",
    layer: "module",
    status: "implemented",
  },
  {
    key: "workforce",
    name: "Mao de Obra",
    description: "Equipes, perfis tecnicos, papeis e disponibilidade.",
    layer: "module",
    status: "adjusted",
  },
  {
    key: "scheduling",
    name: "Escalas",
    description: "Expediente, plantao, sobreaviso, ausencias e capacidade planejada.",
    layer: "module",
    status: "adjusted",
  },
  {
    key: "shift-logs",
    name: "Livro de Turno",
    description: "Passagem de servico, pendencias e ocorrencias do turno.",
    layer: "module",
    status: "implemented",
  },
  {
    key: "legacy-records",
    name: "Legado",
    description: "Protocolos, status externo e ponte manual-primeiro com sistema oficial.",
    layer: "module",
    status: "implemented",
  },
  {
    key: "secao-tecnica",
    name: "Adaptacao Secao Tecnica",
    description: "Vocabulario, tipos, filas, papeis, workflows e templates do cliente.",
    layer: "adaptation",
    status: "implemented",
  },
];

export async function getWorkspaceConfigOverview() {
  return {
    adaptation: activeAdaptation,
    modules: ecosystemModules,
    totals: {
      demandTypes: activeAdaptation.demandTypes.length,
      serviceOrderTypes: activeAdaptation.serviceOrderTypes.length,
      assetTypes: activeAdaptation.assetTypes.length,
      shiftTypes: activeAdaptation.shiftTypes.length,
      businessRoles: activeAdaptation.businessRoles.length,
      queues: activeAdaptation.queues.length,
      workflows: activeAdaptation.workflows.length,
      reportTemplates: activeAdaptation.reportTemplates.length,
      documentTemplates: activeAdaptation.documentTemplates.length,
    },
  };
}
