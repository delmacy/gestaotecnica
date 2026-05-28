import { getDb } from "@/db";
import { complianceAudits } from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  enumProperty,
  stringProperty,
  uuidProperty,
} from "@/platform/actions/schema-presets";

type CreateAuditInput = {
  title?: string;
  area?: string;
  assetId?: string;
  priority?: "low" | "medium" | "high" | "critical";
};

export const createAuditKernelAction: ActionDefinition<
  CreateAuditInput,
  { id: string; title: string }
> = {
  key: "compliance.create_audit",
  moduleKey: "compliance",
  description: "Cria uma nova auditoria de conformidade.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      title: stringProperty("Título da auditoria."),
      area: stringProperty("Área auditada."),
      assetId: uuidProperty("Ativo relacionado."),
      priority: enumProperty(["low", "medium", "high", "critical"], "Prioridade."),
    },
    ["title"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("ID da auditoria."),
    title: stringProperty("Título da auditoria."),
  }),
  emits: ["compliance.audit_created"],
  async handler(input) {
    const title = String(input.title ?? "").trim();
    if (!title) return { success: false, error: { code: "VALIDATION_ERROR", message: "title é obrigatório." } };

    const db = getDb();
    const [audit] = await db
      .insert(complianceAudits)
      .values({
        title,
        area: input.area,
        assetId: input.assetId,
        priority: input.priority ?? "medium",
        status: "planned",
      })
      .returning({ id: complianceAudits.id, title: complianceAudits.title });

    return {
      success: true,
      data: audit,
      events: [
        {
          eventType: "compliance.audit_created",
          entityType: "compliance_audit",
          entityId: audit.id,
          payload: { title: audit.title, area: input.area },
        },
      ],
    };
  },
};
