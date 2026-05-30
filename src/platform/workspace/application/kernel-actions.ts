import { eq, and } from "drizzle-orm";
import { getRuntimeDb } from "@/db";
import { organizations, workspaces } from "@/db/runtime/schema/workspace";
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

type CreateWorkspaceInput = {
  organizationId: string;
  key: string;
  name: string;
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

type InstallCapabilityInput = {
  workspaceId: string;
  capabilityKey: string;
  name: string;
};

export const installCapabilityKernelAction: ActionDefinition<InstallCapabilityInput, any> = {
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
