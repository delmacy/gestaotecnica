"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  authAccounts,
  permissionDefinitions,
  rolePermissionGrants,
  users,
  workspaceModuleConfigs,
  workflowTemplates,
} from "@/db/schema";
import { hashPassword } from "@/modules/auth/crypto";

function readRequiredText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) throw new Error(`Campo obrigatorio ausente: ${field}`);
  return value;
}

function readOptionalText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value.length > 0 ? value : undefined;
}

export async function createAdminUser(formData: FormData) {
  const name = readRequiredText(formData, "name");
  const email = readRequiredText(formData, "email").toLowerCase();
  const password = readOptionalText(formData, "password");
  const db = getDb();

  const [user] = await db
    .insert(users)
    .values({ name, email, status: "active" })
    .onConflictDoUpdate({
      target: users.email,
      set: { name, status: "active", updatedAt: new Date() },
    })
    .returning({ id: users.id });

  if (password) {
    const passwordData = hashPassword(password);
    await db
      .insert(authAccounts)
      .values({
        userId: user.id,
        passwordHash: passwordData.hash,
        passwordSalt: passwordData.salt,
      })
      .onConflictDoUpdate({
        target: authAccounts.userId,
        set: {
          passwordHash: passwordData.hash,
          passwordSalt: passwordData.salt,
          isActive: true,
          updatedAt: new Date(),
        },
      });
  }

  revalidatePath("/admin/users");
}

export async function toggleWorkspaceModule(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const isEnabled = formData.get("isEnabled") === "on";

  await getDb()
    .update(workspaceModuleConfigs)
    .set({ isEnabled, updatedAt: new Date() })
    .where(eq(workspaceModuleConfigs.id, id));

  revalidatePath("/admin/workspaces");
}

export async function updateWorkflowTemplate(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const label = readRequiredText(formData, "label");
  const states = readRequiredText(formData, "states")
    .split(",")
    .map((state) => state.trim())
    .filter(Boolean);

  await getDb()
    .update(workflowTemplates)
    .set({ label, states, updatedAt: new Date() })
    .where(eq(workflowTemplates.id, id));

  revalidatePath("/admin/workflows");
}

export async function ensureBasePermissions() {
  const db = getDb();
  const permissions = [
    ["admin.manage", "admin", "manage", "Gerenciar administracao"],
    ["workspace.configure", "workspace", "configure", "Configurar workspace"],
    ["work-items.manage", "work-items", "manage", "Gerenciar demandas"],
    ["service-orders.manage", "service-orders", "manage", "Gerenciar execucao"],
    ["reports.read", "reports", "read", "Ler relatorios"],
  ] as const;

  for (const [key, moduleKey, action, label] of permissions) {
    await db
      .insert(permissionDefinitions)
      .values({ key, moduleKey, action, label })
      .onConflictDoUpdate({
        target: permissionDefinitions.key,
        set: { moduleKey, action, label },
      });
  }

  revalidatePath("/admin/permissions");
}

export async function toggleRolePermission(formData: FormData) {
  const roleId = readRequiredText(formData, "roleId");
  const permissionId = readRequiredText(formData, "permissionId");
  const isAllowed = formData.get("isAllowed") === "on";

  await getDb()
    .insert(rolePermissionGrants)
    .values({ roleId, permissionId, isAllowed })
    .onConflictDoUpdate({
      target: [rolePermissionGrants.roleId, rolePermissionGrants.permissionId],
      set: { isAllowed },
    });

  revalidatePath("/admin/permissions");
}
