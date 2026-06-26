import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  stringProperty,
  uuidProperty,
  enumProperty,
} from "@/platform/actions/schema-presets";
import {
  CreateIntakeInputSchema,
} from "./contracts/intake.schema";

export const captureIntakeKernelAction: ActionDefinition<any, any> = {
  key: "work_intake.capture",
  moduleKey: "work-intake",
  description: "Captura uma nova solicitação de entrada.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      title: stringProperty("Título da solicitação."),
      description: stringProperty("Descrição detalhada."),
      category: stringProperty("Categoria da solicitação."),
      priority: enumProperty(["low", "medium", "high", "critical"], "Prioridade."),
      source: enumProperty(["manual", "email", "api", "integration", "automation"], "Origem."),
      requester: actionObjectSchema({
        name: stringProperty("Nome do solicitante."),
        contact: stringProperty("Contato."),
        department: stringProperty("Departamento."),
      }, ["name"]),
      metadata: actionObjectSchema({}, []),
    },
    ["title", "category", "requester"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("ID da solicitação capturada."),
  }),
  emits: ["work_intake.captured"],
  async handler(input, context) {
    const db = getDb();

    // Validate using the strict schema
    const validated = CreateIntakeInputSchema.parse({
      ...input,
      workspaceId: context.workspaceId,
    });

    const [inserted] = await db
      .insert(processCandidates)
      .values({
        workspaceId: validated.workspaceId,
        name: validated.title,
        description: validated.description,
        status: "new", // Mapped to 'draft' in process_candidates but we use 'new' logically
        origin: validated.source,
        proposedDefinition: {
          category: validated.category,
          priority: validated.priority,
          requester: validated.requester,
          metadata: validated.metadata,
        },
        evidence: {}, // Optional
      })
      .returning({ id: processCandidates.id });

    return {
      success: true,
      data: { id: inserted.id },
      events: [
        {
          eventType: "work_intake.captured",
          entityType: "process_candidate",
          entityId: inserted.id,
          payload: validated,
        },
      ],
    };
  },
};

export const transitionIntakeKernelAction: ActionDefinition<any, any> = {
  key: "work_intake.transition",
  moduleKey: "work-intake",
  description: "Transiciona o estado de uma solicitação de entrada.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      id: uuidProperty("ID da solicitação."),
      status: enumProperty(["new", "triage", "qualified", "converted", "closed"], "Novo estado."),
      reason: stringProperty("Motivo da transição."),
    },
    ["id", "status"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("ID da solicitação."),
    status: stringProperty("Estado final."),
  }),
  emits: ["work_intake.transitioned"],
  async handler(input, context) {
    const db = getDb();

    const [current] = await db
      .select()
      .from(processCandidates)
      .where(eq(processCandidates.id, input.id))
      .limit(1);

    if (!current) {
      return { success: false, error: { code: "NOT_FOUND", message: "Solicitação não encontrada." } };
    }

    // Permission check: ensure same workspace
    if (current.workspaceId !== context.workspaceId) {
       return { success: false, error: { code: "FORBIDDEN", message: "Acesso negado." } };
    }

    await db
      .update(processCandidates)
      .set({
        status: input.status,
        updatedAt: new Date(),
      })
      .where(eq(processCandidates.id, input.id));

    return {
      success: true,
      data: { id: current.id, status: input.status },
      events: [
        {
          eventType: "work_intake.transitioned",
          entityType: "process_candidate",
          entityId: current.id,
          payload: { from: current.status, to: input.status, reason: input.reason },
        },
      ],
    };
  },
};
