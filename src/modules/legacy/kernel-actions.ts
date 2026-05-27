import { getDb } from "@/db";
import { legacyRecords } from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";
import { activeAdaptation } from "@/adaptations/active";
import {
  actionObjectSchema,
  objectProperty,
  stringProperty,
  uuidProperty,
} from "@/platform/actions/schema-presets";

type CreateLegacyRecordInput = {
  systemName?: string;
  protocolNumber?: string;
  externalRecordId?: string;
  externalStatus?: string;
  notes?: string;
  serviceOrderId?: string;
  workItemId?: string;
  assetId?: string;
  documentId?: string;
  payload?: Record<string, unknown>;
};

export const createLegacyRecordKernelAction: ActionDefinition<
  CreateLegacyRecordInput,
  { id: string; systemName: string; syncStatus: string }
> = {
  key: "legacy_records.create",
  moduleKey: "legacy",
  description: "Cria um registro de vínculo com sistema legado/oficial.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema({
    systemName: stringProperty("Nome do sistema legado/oficial."),
    protocolNumber: stringProperty("Número de protocolo externo."),
    externalRecordId: stringProperty("Identificador externo."),
    externalStatus: stringProperty("Status externo conhecido."),
    notes: stringProperty("Observações do vínculo."),
    serviceOrderId: uuidProperty("OS relacionada."),
    workItemId: uuidProperty("Demanda relacionada."),
    assetId: uuidProperty("Ativo relacionado."),
    documentId: uuidProperty("Documento técnico relacionado."),
    payload: objectProperty("Payload de integração."),
  }),
  outputSchema: actionObjectSchema({
    id: uuidProperty("Identificador do registro."),
    systemName: stringProperty("Sistema legado/oficial."),
    syncStatus: stringProperty("Status de sincronização."),
  }),
  emits: ["legacy_record.created"],
  async handler(input) {
    const systemName = String(input.systemName ?? activeAdaptation.legacyConfig.systemName).trim();
    const db = getDb();
    const [legacyRecord] = await db
      .insert(legacyRecords)
      .values({
        systemName,
        protocolNumber: input.protocolNumber,
        externalRecordId: input.externalRecordId,
        externalStatus: input.externalStatus,
        notes: input.notes,
        serviceOrderId: input.serviceOrderId,
        workItemId: input.workItemId,
        assetId: input.assetId,
        documentId: input.documentId,
        payload: input.payload ?? { createdByKernelAction: true },
        syncStatus: "pending",
      })
      .returning({
        id: legacyRecords.id,
        systemName: legacyRecords.systemName,
        syncStatus: legacyRecords.syncStatus,
      });

    return {
      success: true,
      data: legacyRecord,
      events: [
        {
          eventType: "legacy_record.created",
          entityType: "legacy_record",
          entityId: legacyRecord.id,
          payload: {
            systemName,
            serviceOrderId: input.serviceOrderId,
            workItemId: input.workItemId,
            assetId: input.assetId,
            documentId: input.documentId,
          },
        },
      ],
    };
  },
};

