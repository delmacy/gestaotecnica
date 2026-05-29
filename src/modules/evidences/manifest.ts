import type { ModuleManifest } from "@/platform/modules";

export const evidencesManifest: ModuleManifest = {
  key: "evidences",
  name: "Evidences",
  description: "Comprovantes vinculados a instancias, entidades e documentos operacionais.",
  operational: {
    capability: "Comprovacao operacional",
    process: "Anexar, catalogar e relacionar evidencias ao contexto que justificou sua coleta.",
    result: "Evidencia consultavel e vinculada a uma execucao, decisao ou entidade.",
    tracking: "Evento de anexo com ator, entidade vinculada e metadados do comprovante.",
    evolution: "Pode evoluir para MinIO, checksums, OCR, assinaturas e canhotos verificaveis.",
    integrations: ["storage", "documents", "service-orders", "events"],
  },
  actions: ["evidences.attach"],
  events: ["evidence.attached"],
  views: ["evidences.list"],
};
