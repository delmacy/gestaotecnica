import type { ModuleManifest } from "@/platform/modules";

export const documentsManifest: ModuleManifest = {
  key: "documents",
  name: "Documents",
  description: "Registros formais, versoes e vinculos documentais da operacao.",
  operational: {
    capability: "Governanca documental",
    process: "Gerar, versionar, revisar, aprovar e vincular documentos a entidades operacionais.",
    result: "Documento rastreavel com status, versao corrente e vinculo ao contexto que o produziu.",
    tracking: "Eventos documentais, vinculos de entidade e metadados governados pelo banco.",
    evolution: "Pode incorporar MinIO, canhotos de rastreabilidade, assinaturas e modelos por blueprint.",
    integrations: ["storage", "workflow-engine", "events", "service-orders", "work-items"],
  },
  actions: ["documents.generate", "documents.transition"],
  events: ["document.generated", "document.status_changed"],
  views: ["documents.list"],
};
