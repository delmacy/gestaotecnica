import type { ModuleManifest } from "@/platform/modules";

export const legacyManifest: ModuleManifest = {
  key: "legacy",
  name: "Legacy Records",
  description: "Ponte controlada com sistemas externos sem confundir legado com fonte operacional.",
  operational: {
    capability: "Interoperabilidade com sistemas existentes",
    process: "Registrar protocolo, status externo e sincronizacao manual ou automatizada.",
    result: "Referencia rastreavel entre uma instancia interna e o registro externo correspondente.",
    tracking: "Eventos e payloads de integracao com idempotencia, correlacao e status de sincronizacao.",
    evolution: "Pode evoluir de manual-first para API, RPA ou mensageria mantendo auditoria.",
    integrations: ["integrations", "events", "documents", "service-orders", "work-items"],
  },
  actions: ["legacy_records.create"],
  events: ["legacy_record.created"],
  views: ["legacy.list"],
};
