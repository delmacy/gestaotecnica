import { eq, and } from "drizzle-orm";
import { getRuntimeDb } from "@/db";
import {
  organizations,
  workspaces,
  entityDefinitions,
  fieldDefinitions,
  dynamicRecords,
  workspaceMembers,
} from "@/db/runtime/schema/workspace";
import { usersTable } from "@/db/runtime/schema/identity";
import { workspaceModuleConfigs } from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  stringProperty,
  uuidProperty,
  booleanProperty,
} from "@/platform/actions/schema-presets";

type CreateOrganizationInput = {
  key: string;
  name: string;
};

type UpdateOrganizationInput = {
  id: string;
  name: string;
};

export const createOrganizationKernelAction: ActionDefinition<CreateOrganizationInput, { id: string; key: string }> = {
  key: "organizations.create",
  moduleKey: "workspace",
  description: "Cria um novo tenant organizacional.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      key: stringProperty("Chave única da organização."),
      name: stringProperty("Nome amigável da organização."),
    },
    ["key", "name"],
  ),
  async handler(input) {
    const db = getRuntimeDb();
    const [org] = await db
      .insert(organizations)
      .values({
        key: input.key,
        name: input.name,
      })
      .returning({
        id: organizations.id,
        key: organizations.key,
      });

    return {
      success: true,
      data: org,
    };
  },
};

type InviteUserInput = {
  workspaceId: string;
  email: string;
  name?: string;
};

export const inviteUserKernelAction: ActionDefinition<InviteUserInput, { userId: string; workspaceId: string }> = {
  key: "workspaces.invite_user",
  moduleKey: "workspace",
  description: "Convida (ou cria via admin) um usuário para o workspace.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      workspaceId: uuidProperty("ID do workspace."),
      email: stringProperty("E-mail do usuário."),
      name: stringProperty("Nome opcional do usuário."),
    },
    ["workspaceId", "email"]
  ),
  async handler(input, context) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      return {
        success: false,
        error: { code: "INVALID_EMAIL", message: "O e-mail fornecido não é válido." },
      };
    }

    const db = getRuntimeDb();
    const normalizedEmail = input.email.toLowerCase().trim();

    // Upsert the user using onConflictDoUpdate
    const [user] = await db
      .insert(usersTable)
      .values({
        email: normalizedEmail,
        name: input.name ?? null,
      })
      .onConflictDoUpdate({
        target: usersTable.email,
        set: {
          ...(input.name ? { name: input.name } : {}),
          updatedAt: new Date(),
        },
      })
      .returning({ id: usersTable.id });

    // Ensure they are a member of the workspace
    await db
      .insert(workspaceMembers)
      .values({
        workspaceId: input.workspaceId,
        userId: user.id,
      })
      .onConflictDoNothing();

    return {
      success: true,
      data: {
        userId: user.id,
        workspaceId: input.workspaceId,
      },
    };
  },
};

export const updateOrganizationKernelAction: ActionDefinition<UpdateOrganizationInput, { id: string; name: string }> = {
  key: "organizations.update",
  moduleKey: "workspace",
  description: "Atualiza os metadados editáveis de uma organização.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      id: uuidProperty("ID da organização."),
      name: stringProperty("Nome amigável da organização."),
    },
    ["id", "name"],
  ),
  async handler(input) {
    const db = getRuntimeDb();
    const [org] = await db
      .update(organizations)
      .set({
        name: input.name,
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, input.id))
      .returning({
        id: organizations.id,
        name: organizations.name,
      });

    return {
      success: true,
      data: org,
    };
  },
};

type CreateWorkspaceInput = {
  organizationId: string;
  key: string;
  name: string;
};

type UpdateWorkspaceInput = {
  id: string;
  name: string;
  adaptationKey?: string;
};

export const createWorkspaceKernelAction: ActionDefinition<CreateWorkspaceInput, { id: string; key: string }> = {
  key: "workspaces.create",
  moduleKey: "workspace",
  description: "Cria um novo ambiente operacional (workspace) dentro de uma organização.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      organizationId: uuidProperty("ID da organização pai."),
      key: stringProperty("Chave única do workspace."),
      name: stringProperty("Nome do ambiente."),
    },
    ["organizationId", "key", "name"],
  ),
  async handler(input) {
    const db = getRuntimeDb();
    const [workspace] = await db
      .insert(workspaces)
      .values({
        organizationId: input.organizationId,
        key: input.key,
        name: input.name,
        adaptationKey: "secao-tecnica", // Default
      })
      .returning({
        id: workspaces.id,
        key: workspaces.key,
      });

    return {
      success: true,
      data: workspace,
    };
  },
};

export const updateWorkspaceKernelAction: ActionDefinition<UpdateWorkspaceInput, { id: string; name: string; adaptationKey: string | null }> = {
  key: "workspaces.update",
  moduleKey: "workspace",
  description: "Atualiza os metadados editáveis de um workspace.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      id: uuidProperty("ID do workspace."),
      name: stringProperty("Nome do ambiente."),
      adaptationKey: stringProperty("Chave de adaptação."),
    },
    ["id", "name"],
  ),
  async handler(input) {
    const db = getRuntimeDb();
    const [workspace] = await db
      .update(workspaces)
      .set({
        name: input.name,
        adaptationKey: input.adaptationKey || null,
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, input.id))
      .returning({
        id: workspaces.id,
        name: workspaces.name,
        adaptationKey: workspaces.adaptationKey,
      });

    return {
      success: true,
      data: workspace,
    };
  },
};

type InstallCapabilityInput = {
  workspaceId: string;
  capabilityKey: string;
  name: string;
};

export const installCapabilityKernelAction: ActionDefinition<InstallCapabilityInput, unknown> = {
  key: "workspaces.install_capability",
  moduleKey: "workspace",
  description: "Instala uma capacidade do Registry em um workspace específico.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      workspaceId: uuidProperty("Workspace destino."),
      capabilityKey: stringProperty("Chave da capacidade no Registry."),
      name: stringProperty("Nome da capacidade."),
    },
    ["workspaceId", "capabilityKey", "name"],
  ),
  async handler(input) {
    const db = getRuntimeDb();

    const [installed] = await db
      .insert(workspaceModuleConfigs)
      .values({
        workspaceId: input.workspaceId,
        moduleKey: input.capabilityKey,
        name: input.name,
        isEnabled: true,
      })
      .onConflictDoUpdate({
        target: [workspaceModuleConfigs.workspaceId, workspaceModuleConfigs.moduleKey],
        set: { isEnabled: true, updatedAt: new Date() }
      })
      .returning();

    return {
      success: true,
      data: installed,
    };
  },
};

type PublishWorkspaceInput = {
  workspaceId: string;
};

export const publishWorkspaceKernelAction: ActionDefinition<PublishWorkspaceInput, unknown> = {
  key: "workspaces.publish",
  moduleKey: "workspace",
  description: "Publica e finaliza a configuração de um workspace para uso em produção.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
       workspaceId: uuidProperty("ID do workspace.")
    },
    ["workspaceId"]
  ),
  async handler(input) {
    const db = getRuntimeDb();
    const [updated] = await db
      .update(workspaces)
      .set({ status: "active", updatedAt: new Date() })
      .where(eq(workspaces.id, input.workspaceId))
      .returning();

    return {
      success: true,
      data: updated,
    };
  },
};

type CreateEntityInput = {
  workspaceId: string;
  key: string;
  name: string;
  fields: Array<{ key: string; name: string; type: string }>;
};

export const createEntityKernelAction: ActionDefinition<CreateEntityInput, unknown> = {
  key: "entities.create",
  moduleKey: "workspace",
  description: "Define uma nova entidade de dados dinâmica no workspace.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      workspaceId: uuidProperty("Workspace."),
      key: stringProperty("Chave da entidade."),
      name: stringProperty("Nome da entidade."),
      fields: { type: "array", description: "Campos da entidade." },
    },
    ["workspaceId", "key", "name", "fields"],
  ),
  async handler(input) {
    const db = getRuntimeDb();

    const [entity] = await db
      .insert(entityDefinitions)
      .values({
        workspaceId: input.workspaceId,
        key: input.key,
        name: input.name,
      })
      .returning();

    for (const field of input.fields) {
      await db.insert(fieldDefinitions).values({
        entityId: entity.id,
        key: field.key,
        name: field.name,
        type: field.type,
      });
    }

    return {
      success: true,
      data: entity,
    };
  },
};

type SaveRecordInput = {
  workspaceId: string;
  entityKey: string;
  data: unknown;
};

export const saveDynamicRecordKernelAction: ActionDefinition<SaveRecordInput, unknown> = {
  key: "records.save",
  moduleKey: "workspace",
  description: "Salva um registro de uma entidade dinâmica.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      workspaceId: uuidProperty("Workspace."),
      entityKey: stringProperty("Chave da entidade."),
      data: { type: "object", description: "Dados do registro." },
    },
    ["workspaceId", "entityKey", "data"],
  ),
  async handler(input) {
    const db = getRuntimeDb();

    const [record] = await db
      .insert(dynamicRecords)
      .values({
        workspaceId: input.workspaceId,
        entityKey: input.entityKey,
        data: input.data,
      })
      .returning();

    return {
      success: true,
      data: record,
    };
  },
};
