import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { assets, serviceOrders, technicalDocuments, workItems } from "@/db/schema";
import { getWorkspaceDocumentTemplateOptions } from "@/platform/workspaces/catalogs";

export async function getTechnicalDocuments() {
  const db = getDb();

  return db
    .select({
      id: technicalDocuments.id,
      title: technicalDocuments.title,
      documentType: technicalDocuments.documentType,
      status: technicalDocuments.status,
      content: technicalDocuments.content,
      createdAt: technicalDocuments.createdAt,
      serviceOrderId: technicalDocuments.serviceOrderId,
      serviceOrderCode: serviceOrders.code,
      serviceOrderTitle: serviceOrders.title,
      workItemId: technicalDocuments.workItemId,
      workItemTitle: workItems.title,
      assetId: technicalDocuments.assetId,
      assetCode: assets.code,
      assetName: assets.name,
    })
    .from(technicalDocuments)
    .leftJoin(serviceOrders, eq(technicalDocuments.serviceOrderId, serviceOrders.id))
    .leftJoin(workItems, eq(technicalDocuments.workItemId, workItems.id))
    .leftJoin(assets, eq(technicalDocuments.assetId, assets.id))
    .orderBy(desc(technicalDocuments.createdAt))
    .limit(80);
}

export async function getDocumentSummary() {
  const db = getDb();
  const [draft] = await db
    .select({ value: count() })
    .from(technicalDocuments)
    .where(eq(technicalDocuments.status, "draft"));
  const [approval] = await db
    .select({ value: count() })
    .from(technicalDocuments)
    .where(eq(technicalDocuments.status, "waiting_supervisor_approval"));
  const [approved] = await db
    .select({ value: count() })
    .from(technicalDocuments)
    .where(eq(technicalDocuments.status, "approved"));

  return [
    { label: "Rascunhos", value: draft.value },
    { label: "Aguardando aprovacao", value: approval.value },
    { label: "Aprovados", value: approved.value },
  ];
}

export async function getDocumentTypeOptions() {
  return getWorkspaceDocumentTemplateOptions();
}
