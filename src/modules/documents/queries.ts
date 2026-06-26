import { count, desc, eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { documents, documentVersions } from "@/db/runtime/schema/documents";
import { getWorkspaceDocumentTemplateOptions } from "@/platform/workspaces/catalogs";
import { resolveWorkspaceContext } from "@/platform/workspace";

export async function getTechnicalDocuments() {
  const context = await resolveWorkspaceContext({ source: "ui" });
  if (!context.workspaceId) return [];

  const db = getDb();

  return db
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
}

export async function getDocumentById(id: string) {
  const context = await resolveWorkspaceContext({ source: "ui" });
  if (!context.workspaceId) return null;

  const db = getDb();
  const [doc]: any[] = await db
    .select()
    .from(documents)
    .where(and(eq(documents.id, id), eq(documents.workspaceId, context.workspaceId)))
    .limit(1);

  return doc || null;
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
  const [draft]: any[] = await db
    .select({ value: count() })
    .from(documents)
    .where(and(eq(documents.status, "draft"), eq(documents.workspaceId, context.workspaceId)));
  const [approval]: any[] = await db
    .select({ value: count() })
    .from(documents)
    .where(and(eq(documents.status, "waiting_supervisor_approval"), eq(documents.workspaceId, context.workspaceId)));
  const [approved]: any[] = await db
    .select({ value: count() })
    .from(documents)
    .where(and(eq(documents.status, "approved"), eq(documents.workspaceId, context.workspaceId)));

  return [
    { label: "Rascunhos", value: draft?.value || 0 },
    { label: "Aguardando aprovacao", value: approval?.value || 0 },
    { label: "Aprovados", value: approved?.value || 0 },
  ];
}

export async function getDocumentTypeOptions() {
  return getWorkspaceDocumentTemplateOptions();
}
