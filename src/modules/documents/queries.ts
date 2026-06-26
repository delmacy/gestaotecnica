import { count, desc, eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { documents, documentVersions, documentLinks } from "@/db/runtime/schema/documents";
import { assets, serviceOrders, workItems } from "@/db/schema";
import { getWorkspaceDocumentTemplateOptions } from "@/platform/workspaces/catalogs";
import { resolveWorkspaceContext } from "@/platform/workspace";

export async function getTechnicalDocuments() {
  const context = await resolveWorkspaceContext({ source: "ui" });
  if (!context.workspaceId) return [];

  const db = getDb();

  const baseDocuments = await db
    .select({
      id: documents.id,
      title: documents.title,
      documentType: documents.documentType,
      status: documents.status,
      createdAt: documents.createdAt,
    })
    .from(documents)
    .where(eq(documents.workspaceId, context.workspaceId))
    .orderBy(desc(documents.createdAt))
    .limit(80);

  // Hydrate with links
  const results = await Promise.all(baseDocuments.map(async (doc) => {
    const links = await db
      .select()
      .from(documentLinks)
      .where(eq(documentLinks.documentId, doc.id));

    const serviceOrderLink = links.find(l => l.linkedEntityType === "service_order");
    const workItemLink = links.find(l => l.linkedEntityType === "work_item");
    const assetLink = links.find(l => l.linkedEntityType === "asset");

    let serviceOrder = null;
    if (serviceOrderLink) {
      [serviceOrder] = await db.select().from(serviceOrders).where(eq(serviceOrders.id, serviceOrderLink.linkedEntityId)).limit(1);
    }

    let workItem = null;
    if (workItemLink) {
      [workItem] = await db.select().from(workItems).where(eq(workItems.id, workItemLink.linkedEntityId)).limit(1);
    }

    let asset = null;
    if (assetLink) {
      [asset] = await db.select().from(assets).where(eq(assets.id, assetLink.linkedEntityId)).limit(1);
    }

    return {
      ...doc,
      serviceOrderId: serviceOrder?.id || null,
      serviceOrderCode: serviceOrder?.code || null,
      serviceOrderTitle: serviceOrder?.title || null,
      workItemId: workItem?.id || null,
      workItemTitle: workItem?.title || null,
      assetId: asset?.id || null,
      assetCode: asset?.code || null,
      assetName: asset?.name || null,
    };
  }));

  return results;
}

export async function getDocumentById(id: string) {
  const context = await resolveWorkspaceContext({ source: "ui" });
  if (!context.workspaceId) return null;

  const db = getDb();
  const [doc] = await db
    .select()
    .from(documents)
    .where(and(eq(documents.id, id), eq(documents.workspaceId, context.workspaceId)))
    .limit(1);

  if (!doc) return null;

  const links = await db
    .select()
    .from(documentLinks)
    .where(eq(documentLinks.documentId, doc.id));

  return { ...doc, links };
}

export async function getDocumentHistory(documentId: string) {
  const context = await resolveWorkspaceContext({ source: "ui" });
  if (!context.workspaceId) return [];

  const db = getDb();
  return db
    .select()
    .from(documentVersions)
    .where(and(eq(documentVersions.documentId, documentId), eq(documentVersions.workspaceId, context.workspaceId)))
    .orderBy(desc(documentVersions.createdAt));
}

export async function getDocumentSummary() {
  const context = await resolveWorkspaceContext({ source: "ui" });
  if (!context.workspaceId) return [];

  const db = getDb();
  const [draft] = await db
    .select({ value: count() })
    .from(documents)
    .where(and(eq(documents.status, "draft"), eq(documents.workspaceId, context.workspaceId)));
  const [approval] = await db
    .select({ value: count() })
    .from(documents)
    .where(and(eq(documents.status, "waiting_supervisor_approval"), eq(documents.workspaceId, context.workspaceId)));
  const [approved] = await db
    .select({ value: count() })
    .from(documents)
    .where(and(eq(documents.status, "approved"), eq(documents.workspaceId, context.workspaceId)));

  return [
    { label: "Rascunhos", value: draft.value },
    { label: "Aguardando aprovacao", value: approval.value },
    { label: "Aprovados", value: approved.value },
  ];
}

export async function getDocumentTypeOptions() {
  return getWorkspaceDocumentTemplateOptions();
}
