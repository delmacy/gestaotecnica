import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test, { after } from "node:test";
import { eq } from "drizzle-orm";
import { closeDatabaseConnections, getPlatformDb } from "../../src/db";
import { processCandidates } from "../../src/db/platform/schema/candidates";
import { usersTable } from "../../src/db/runtime/schema/identity";
import { processDefinitions, processVersions } from "../../src/db/runtime/schema/workflow";
import { workspaces } from "../../src/db/runtime/schema/workspace";
import { CandidateAlreadyPublishedError } from "../../src/features/builder/candidates/candidate.errors";
import { publishApprovedCandidateWithDrizzle } from "../../src/features/builder/candidates/candidate-publisher.repository";

const db = getPlatformDb();

after(async () => {
  await closeDatabaseConnections();
});

test("publica Candidate com rastreabilidade, transação e idempotência reais", async () => {
  const workspaceId = randomUUID();
  const publisherId = randomUUID();
  const candidateId = randomUUID();
  const suffix = randomUUID();
  let processDefinitionId: string | undefined;

  await db.insert(workspaces).values({ id: workspaceId, key: `phase25-${suffix}`, name: "Phase 25 integration workspace" });
  await db.insert(usersTable).values({ id: publisherId, email: `phase25-${suffix}@example.test`, name: "Phase 25 Publisher" });
  await db.insert(processCandidates).values({
    id: candidateId,
    workspaceId,
    name: "Candidate integration test",
    status: "approved",
    origin: "manual",
    proposedDefinition: {
      name: "Candidate integration test",
      status: "draft",
      nodes: [
        { id: "start", type: "start", label: "Inicio", position: { x: 0, y: 0 }, config: {} },
        { id: "end", type: "end", label: "Fim", position: { x: 200, y: 0 }, config: {} },
      ],
      edges: [{ id: "edge", source: "start", target: "end" }],
    },
  });

  try {
    const published = await publishApprovedCandidateWithDrizzle(db, workspaceId, candidateId, publisherId);
    processDefinitionId = published.processDefinitionId;

    const [definition] = await db.select().from(processDefinitions).where(eq(processDefinitions.id, published.processDefinitionId));
    const [candidate] = await db.select().from(processCandidates).where(eq(processCandidates.id, candidateId));
    const versions = await db.select().from(processVersions).where(eq(processVersions.processDefinitionId, published.processDefinitionId));

    assert.equal(definition.sourceCandidateId, candidateId);
    assert.equal(definition.createdById, publisherId);
    assert.equal(candidate.status, "published");
    assert.equal(versions.length, 1);

    await assert.rejects(
      () => publishApprovedCandidateWithDrizzle(db, workspaceId, candidateId, publisherId),
      CandidateAlreadyPublishedError,
    );
    const definitions = await db.select().from(processDefinitions).where(eq(processDefinitions.sourceCandidateId, candidateId));
    assert.equal(definitions.length, 1);
  } finally {
    if (processDefinitionId) {
      await db.delete(processVersions).where(eq(processVersions.processDefinitionId, processDefinitionId));
      await db.delete(processDefinitions).where(eq(processDefinitions.id, processDefinitionId));
    }
    await db.delete(processCandidates).where(eq(processCandidates.id, candidateId));
    await db.delete(usersTable).where(eq(usersTable.id, publisherId));
    await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
  }
});
