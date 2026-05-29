import type { ModuleManifest } from "@/platform/modules";

export const globalSearchManifest: ModuleManifest = {
  key: "global-search",
  name: "Global Search",
  description: "Localizacao transversal de entidades, processos e documentos do workspace.",
  operational: {
    capability: "Descoberta operacional",
    process: "Buscar registros relevantes sem romper fronteiras de workspace ou modulo.",
    result: "Acesso rapido ao contexto operacional necessario para compreender uma situacao.",
    tracking: "Consultas respeitam escopo e podem ser auditadas por fonte e workspace.",
    evolution: "Pode incorporar indices dedicados, ranking por capacidade e busca semantica governada.",
    integrations: ["events", "documents", "work-items", "service-orders", "assets"],
  },
  actions: ["search.everything"],
  views: ["search.results"],
};
