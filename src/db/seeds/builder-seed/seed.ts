import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import type { DbClient } from "@/db";
import { organizations, workspaces, workspaceMembers } from "@/db/runtime/schema/workspace";
import { users as legacyUsers } from "@/db/legacy/schema";
import { builderWorkspaceSelections } from "@/db/runtime/schema/builder";
import { BUILDER_PROBE, ACCESS_PROFILE_BUILDER } from "./constants";

export type BuilderProbeHandles = {
  userId: string;
  organizationId: string;
  workspaceIds: {
    core: string;
    support: string;
    field: string;
  };
};

/**
 * Idempotent seed for the UX-NAV-04 Builder persistence foundation.
 *
 * Creates ONE deliberate probe organization with EXACTLY three workspaces,
 * a probe Builder identity (legacy `users` row with access_profile='builder'),
 * membership in all three workspaces, and an initial durable workspace
 * selection. All lookups are by stable key/email so re-running is safe.
 */
export async function seedBuilderProbe(
  db: DbClient = getDb(),
): Promise<BuilderProbeHandles> {
  // 1. Organization (probe)
  const [org] = await db
    .insert(organizations)
    .values({
      key: BUILDER_PROBE.organization.key,
      name: BUILDER_PROBE.organization.name,
      status: "active",
    })
    .onConflictDoUpdate({
      target: organizations.key,
      set: {
        name: BUILDER_PROBE.organization.name,
        status: "active",
        updatedAt: new Date(),
      },
    })
    .returning({ id: organizations.id });

  // 2. Three workspaces under the probe organization
  const workspaceIds: Record<string, string> = {};
  for (const ws of BUILDER_PROBE.workspaces) {
    const [row] = await db
      .insert(workspaces)
      .values({
        organizationId: org.id,
        key: ws.key,
        name: ws.name,
        status: "active",
        adaptationKey: "secao-tecnica",
      })
      .onConflictDoUpdate({
        target: workspaces.key,
        set: {
          organizationId: org.id,
          name: ws.name,
          status: "active",
          updatedAt: new Date(),
        },
      })
      .returning({ id: workspaces.id });
    workspaceIds[ws.key] = row.id;
  }

  // 3. Builder identity (authenticated user) in the legacy `users` table
  const [user] = await db
    .insert(legacyUsers)
    .values({
      email: BUILDER_PROBE.user.email,
      name: BUILDER_PROBE.user.name,
      status: "active",
      accessProfile: ACCESS_PROFILE_BUILDER,
    })
    .onConflictDoUpdate({
      target: legacyUsers.email,
      set: {
        name: BUILDER_PROBE.user.name,
        status: "active",
        accessProfile: ACCESS_PROFILE_BUILDER,
        updatedAt: new Date(),
      },
    })
    .returning({ id: legacyUsers.id });

  // 4. Membership in all three workspaces (select-then-insert; no unique idx on workspace_members)
  for (const ws of BUILDER_PROBE.workspaces) {
    const [existing] = await db
      .select({ id: workspaceMembers.id })
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.userId, user.id),
          eq(workspaceMembers.workspaceId, workspaceIds[ws.key]!),
        ),
      )
      .limit(1);

    if (!existing) {
      await db.insert(workspaceMembers).values({
        workspaceId: workspaceIds[ws.key]!,
        userId: user.id,
        status: "active",
      });
    }
  }

  // 5. Durable workspace selection (persisted server-side). Default to core.
  await db
    .insert(builderWorkspaceSelections)
    .values({
      userId: user.id,
      workspaceId: workspaceIds[BUILDER_PROBE.defaultWorkspaceKey]!,
      organizationId: org.id,
    })
    .onConflictDoUpdate({
      target: builderWorkspaceSelections.userId,
      set: {
        workspaceId: workspaceIds[BUILDER_PROBE.defaultWorkspaceKey]!,
        organizationId: org.id,
        selectedAt: new Date(),
        updatedAt: new Date(),
      },
    });

  return {
    userId: user.id,
    organizationId: org.id,
    workspaceIds: {
      core: workspaceIds[BUILDER_PROBE.workspaces[0].key]!,
      support: workspaceIds[BUILDER_PROBE.workspaces[1].key]!,
      field: workspaceIds[BUILDER_PROBE.workspaces[2].key]!,
    },
  };
}
