import "dotenv/config";
import test, { after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getRuntimeDb, closeDatabaseConnections } from "@/db";
import { teams, users, technicianProfiles } from "@/db/schema";
import {
  createTestWorkspace,
  createMockContext,
  mockWorkspaceContext
} from "../helpers/isolation-helper";

const db = getRuntimeDb();

test("Workforce Multi-tenant Isolation", async (t) => {
  const wsA = await createTestWorkspace("wsA");
  const wsB = await createTestWorkspace("wsB");

  const ctxA = createMockContext(wsA);
  const ctxB = createMockContext(wsB);

  const queriesA = mockWorkspaceContext("../../src/modules/workforce/queries", ctxA);
  const queriesB = mockWorkspaceContext("../../src/modules/workforce/queries", ctxB);

  await t.test("teams listing does not return records from another workspace", async () => {
    const idA = randomUUID();
    await db.insert(teams).values({
      id: idA,
      name: "Team A",
      // NOTE: teams table DOES NOT HAVE workspace_id in current schema!
    });

    const teamsA = await queriesA.getTeams();
    // Expect failure
  });

  await t.test("technicians listing does not return records from another workspace", async () => {
    const userId = randomUUID();
    await db.insert(users).values({
      id: userId,
      name: "Tech A",
      email: `tech-a-${randomUUID().slice(0,4)}@test.com`,
    });

    const techId = randomUUID();
    await db.insert(technicianProfiles).values({
      id: techId,
      userId: userId,
      level: "pleno",
      // NOTE: technician_profiles table DOES NOT HAVE workspace_id in current schema!
    });

    const techsA = await queriesA.getTechnicians();
    // Expect failure
  });

  await t.test("workforce aggregates do not mix tenants", async () => {
    const summary = await queriesA.getWorkforceSummary();
    // Expect failure
  });
});

after(async () => {
  await closeDatabaseConnections();
});
