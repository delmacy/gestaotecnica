import { describe, it, after } from "node:test";
import assert from "node:assert";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";

import { closeDatabaseConnections, getRuntimeDb } from "@/db";
import { organizations, workspaces } from "@/db/runtime/schema/workspace";
import { builderWorkspaceSelections } from "@/db/runtime/schema/builder";
import { seedBuilderProbe } from "@/db/seeds/builder-seed/seed";
import { BUILDER_PROBE } from "@/db/seeds/builder-seed/constants";
import {
  resolveBuilderIdentity,
  resolveBuilderPortfolio,
  persistWorkspaceSelection,
  resolveSelectedWorkspace,
} from "@/lib/builder-persistence";

describe("UX-NAV-04-001 Builder persistence foundation", () => {
  after(async () => {
    await closeDatabaseConnections();
  });

  it("proves builder identity, organization portfolio and durable workspace selection through a fresh DB read", async () => {
    const db = getRuntimeDb();
    const handles = await seedBuilderProbe(db);

    let cleanupWorkspaceIds: string[] = [];

    try {
      // 1. Identity resolves from the persisted legacy users row (never anonymous)
      const identity = await resolveBuilderIdentity(handles.userId);
      assert.ok(identity, "builder identity must resolve from persisted users row");
      assert.strictEqual(identity.name, BUILDER_PROBE.user.name);
      assert.strictEqual(identity.email, BUILDER_PROBE.user.email);
      assert.strictEqual(identity.accessProfile, "builder");

      // 2. Portfolio is grouped by organization and exposes the three seeded workspaces
      const portfolio = await resolveBuilderPortfolio(handles.userId);
      assert.ok(portfolio, "builder portfolio must resolve for the authenticated user");
      assert.strictEqual(
        portfolio.selectedWorkspaceId,
        handles.workspaceIds.core,
        "seed defaults the durable selection to the core workspace",
      );

      const probeOrg = portfolio.organizations.find(
        (org) => org.id === handles.organizationId,
      );
      assert.ok(probeOrg, "probe organization must be present in the portfolio");
      assert.strictEqual(probeOrg.name, BUILDER_PROBE.organization.name);
      assert.strictEqual(
        probeOrg.workspaces.length,
        3,
        "probe organization must expose exactly three workspaces",
      );
      const workspaceKeys = probeOrg.workspaces.map((ws) => ws.key).sort();
      assert.deepStrictEqual(workspaceKeys, [
        "ws_builder_probe_core",
        "ws_builder_probe_field",
        "ws_builder_probe_support",
      ]);

      // 3. Selecting the third workspace persists server-side (membership enforced)
      const persisted = await persistWorkspaceSelection(
        handles.userId,
        handles.workspaceIds.field,
      );
      assert.strictEqual(persisted.ok, true);
      assert.strictEqual(
        persisted.ok === true ? persisted.selection.workspaceId : null,
        handles.workspaceIds.field,
      );

      // 4. Reload from the database in a NEW query: the selection survives
      const reloaded = await resolveSelectedWorkspace(handles.userId);
      assert.ok(reloaded, "selection must survive a fresh database read");
      assert.strictEqual(reloaded.workspaceId, handles.workspaceIds.field);

      const [row] = await db
        .select({ workspaceId: builderWorkspaceSelections.workspaceId })
        .from(builderWorkspaceSelections)
        .where(eq(builderWorkspaceSelections.userId, handles.userId));
      assert.ok(row, "workspace_selections row must exist in the builder schema");
      assert.strictEqual(row.workspaceId, handles.workspaceIds.field);

      // 5. Portfolio reflects the new selection after reload
      const portfolioAfterSelection = await resolveBuilderPortfolio(handles.userId);
      assert.ok(portfolioAfterSelection, "portfolio must re-resolve after selection");
      assert.strictEqual(
        portfolioAfterSelection.selectedWorkspaceId,
        handles.workspaceIds.field,
      );
      const fieldWorkspace = portfolioAfterSelection.organizations
        .flatMap((org) => org.workspaces)
        .find((ws) => ws.id === handles.workspaceIds.field);
      assert.ok(fieldWorkspace, "field workspace must remain in the portfolio");
      assert.strictEqual(fieldWorkspace.isSelected, true);
      const coreWorkspace = portfolioAfterSelection.organizations
        .flatMap((org) => org.workspaces)
        .find((ws) => ws.id === handles.workspaceIds.core);
      assert.ok(coreWorkspace, "core workspace must remain in the portfolio");
      assert.strictEqual(coreWorkspace.isSelected, false);

      // 6. Membership is enforced: the user cannot select a workspace they are not a member of
      const nonMemberKey = `ux-nav-04-001-nonmember-${randomUUID().slice(0, 8)}`;
      const [nonMemberWorkspace] = await db
        .insert(workspaces)
        .values({
          organizationId: handles.organizationId,
          key: nonMemberKey,
          name: "Not A Member Workspace",
          status: "active",
        })
        .returning({ id: workspaces.id });
      cleanupWorkspaceIds.push(nonMemberWorkspace.id);

      const rejected = await persistWorkspaceSelection(
        handles.userId,
        nonMemberWorkspace.id,
      );
      assert.deepStrictEqual(rejected, { ok: false, reason: "not_a_member" });
    } finally {
      // Cleanup so a re-run starts again from the seeded core default
      await db
        .delete(builderWorkspaceSelections)
        .where(eq(builderWorkspaceSelections.userId, handles.userId));
      for (const workspaceId of cleanupWorkspaceIds) {
        await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
      }
    }
  });

  it("keeps the probe organization deliberately reusable and idempotent", async () => {
    const db = getRuntimeDb();
    const first = await seedBuilderProbe(db);
    const second = await seedBuilderProbe(db);

    assert.strictEqual(first.userId, second.userId);
    assert.strictEqual(first.organizationId, second.organizationId);
    assert.deepStrictEqual(first.workspaceIds, second.workspaceIds);

    const [orgCountRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(organizations)
      .where(eq(organizations.key, BUILDER_PROBE.organization.key));
    assert.ok(orgCountRow, "probe organization count must resolve");
    assert.strictEqual(
      orgCountRow.count,
      1,
      "probe organization must exist exactly once",
    );
  });
});
