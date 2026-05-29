import type { ModuleManifest } from "@/platform/modules";

export const assetsManifest: ModuleManifest = {
  key: "assets",
  name: "Assets",
  description: "Entidades fisicas, digitais ou estruturais que a organizacao precisa rastrear.",
  operational: {
    capability: "Gestao de entidades rastreaveis",
    process: "Cadastrar, classificar, localizar e acompanhar historico operacional de ativos.",
    result: "Ativo conhecido pela organizacao e conectavel a demandas, ordens, documentos e eventos.",
    tracking: "Eventos de criacao e mudanca de status, alem de vinculos com execucoes e evidencias.",
    evolution: "Pode receber taxonomias, atributos dinamicos, manutencao preventiva e historico por blueprint.",
    integrations: ["service-orders", "maintenance-plans", "documents", "events"],
  },
  actions: ["assets.create", "assets.update_status"],
  events: ["asset.created", "asset.status_changed"],
  views: ["assets.list", "assets.detail"],
};
