import { eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { assets, assetHistory } from "@/db/runtime/schema/assets";
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  enumProperty,
  stringProperty,
  uuidProperty,
} from "@/platform/actions/schema-presets";
import { ASSET_STATUSES, ASSET_CATEGORIES } from "./constants";

export const createAssetKernelAction: ActionDefinition<any, any> = {
  key: "assets.create",
  moduleKey: "assets",
  description: "Cria um novo ativo universal.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      code: stringProperty("Código identificador único do ativo."),
      name: stringProperty("Nome ou descrição curta do ativo."),
      category: enumProperty(
        ASSET_CATEGORIES.map((c: any) => c.value),
        "Categoria do ativo.",
      ),
      status: enumProperty(
        ASSET_STATUSES.map((s: any) => s.value),
        "Status inicial do ativo.",
      ),
      location: stringProperty("Localização física do ativo."),
      responsibleId: uuidProperty("ID do usuário responsável pelo ativo."),
    },
    ["code", "name", "category"],
  ),
  async handler(input, context) {
    const { workspaceId } = context;
    if (!workspaceId) {
      return {
        success: false,
        error: { code: "MISSING_WORKSPACE", message: "Workspace ID é obrigatório." },
      };
    }

    const db = getDb();
    const [asset] = await db
      .insert(assets)
      .values({
        workspaceId,
        code: input.code,
        name: input.name,
        category: input.category,
        status: input.status ?? "available",
        location: input.location,
        responsibleId: input.responsibleId,
      })
      .returning();

    await db.insert(assetHistory).values({
      assetId: asset.id,
      workspaceId,
      action: "create",
      newData: asset,
    });

    return {
      success: true,
      data: asset,
      events: [
        {
          eventType: "asset.created",
          entityType: "asset",
          entityId: asset.id,
          payload: asset,
        },
      ],
    };
  },
};

export const updateAssetKernelAction: ActionDefinition<any, any> = {
  key: "assets.update",
  moduleKey: "assets",
  description: "Atualiza os dados de um ativo.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      id: uuidProperty("ID do ativo."),
      name: stringProperty("Novo nome do ativo."),
      category: enumProperty(
        ASSET_CATEGORIES.map((c: any) => c.value),
        "Nova categoria.",
      ),
      location: stringProperty("Nova localização."),
      responsibleId: uuidProperty("Novo responsável."),
    },
    ["id"],
  ),
  async handler(input, context) {
    const { workspaceId } = context;
    if (!workspaceId) {
      return {
        success: false,
        error: { code: "MISSING_WORKSPACE", message: "Workspace ID é obrigatório." },
      };
    }

    const db = getDb();
    const [previous] = await db
      .select()
      .from(assets)
      .where(and(eq(assets.id, input.id), eq(assets.workspaceId, workspaceId)))
      .limit(1);

    if (!previous) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Ativo não encontrado." },
      };
    }

    const [updated] = await db
      .update(assets)
      .set({
        name: input.name ?? previous.name,
        category: input.category ?? previous.category,
        location: input.location ?? previous.location,
        responsibleId: input.responsibleId ?? previous.responsibleId,
        updatedAt: new Date(),
      })
      .where(and(eq(assets.id, input.id), eq(assets.workspaceId, workspaceId)))
      .returning();

    await db.insert(assetHistory).values({
      assetId: updated.id,
      workspaceId,
      action: "update",
      previousData: previous,
      newData: updated,
    });

    return {
      success: true,
      data: updated,
    };
  },
};

export const updateAssetStatusKernelAction: ActionDefinition<any, any> = {
  key: "assets.update_status",
  moduleKey: "assets",
  description: "Atualiza o status de um ativo.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      id: uuidProperty("ID do ativo."),
      status: enumProperty(
        ASSET_STATUSES.map((s: any) => s.value),
        "Novo status.",
      ),
      note: stringProperty("Observação sobre a mudança de status."),
    },
    ["id", "status"],
  ),
  async handler(input, context) {
    const { workspaceId } = context;
    if (!workspaceId) {
      return {
        success: false,
        error: { code: "MISSING_WORKSPACE", message: "Workspace ID é obrigatório." },
      };
    }

    const db = getDb();
    const [previous] = await db
      .select()
      .from(assets)
      .where(and(eq(assets.id, input.id), eq(assets.workspaceId, workspaceId)))
      .limit(1);

    if (!previous) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Ativo não encontrado." },
      };
    }

    const [updated] = await db
      .update(assets)
      .set({
        status: input.status,
        updatedAt: new Date(),
      })
      .where(and(eq(assets.id, input.id), eq(assets.workspaceId, workspaceId)))
      .returning();

    await db.insert(assetHistory).values({
      assetId: updated.id,
      workspaceId,
      action: "update_status",
      previousData: { status: previous.status },
      newData: { status: updated.status, note: input.note },
    });

    return {
      success: true,
      data: updated,
      events: [
        {
          eventType: "asset.status_changed",
          entityType: "asset",
          entityId: updated.id,
          payload: { from: previous.status, to: updated.status, note: input.note },
        },
      ],
    };
  },
};
