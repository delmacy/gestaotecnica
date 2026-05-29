import { runtimeDb } from "@/db";
import {
  documents,
  documentVersions,
  documentLinks,
  traceReceipts
} from "@/db/runtime/schema/documents";
import { WorkflowRepository } from "@/platform/workflow-engine/infra/workflow.repository";
import { randomBytes, createHash } from "crypto";
import { eq } from "drizzle-orm";

export class DocumentService {
  private workflowRepo: WorkflowRepository;

  constructor() {
    this.workflowRepo = new WorkflowRepository();
  }

  async createDocument(params: {
    workspaceId: string;
    title: string;
    documentType: string;
    storageObjectId: string;
    checksumSha256: string;
    createdById?: string;
    linkedEntityType?: string;
    linkedEntityId?: string;
  }) {
    // 1. Create Document
    const [doc] = await runtimeDb.insert(documents).values({
      workspaceId: params.workspaceId,
      title: params.title,
      documentType: params.documentType,
      status: "active",
    }).returning();

    // 2. Create Initial Version
    const [version] = await runtimeDb.insert(documentVersions).values({
      workspaceId: params.workspaceId,
      documentId: doc.id,
      storageObjectId: params.storageObjectId,
      versionNumber: 1,
      checksumSha256: params.checksumSha256,
      createdById: params.createdById,
    }).returning();

    // 3. Update current version pointer
    await runtimeDb.update(documents)
      .set({ currentVersionId: version.id })
      .where(eq(documents.id, doc.id));

    // 4. Handle Linking
    if (params.linkedEntityType && params.linkedEntityId) {
      await runtimeDb.insert(documentLinks).values({
        workspaceId: params.workspaceId,
        documentId: doc.id,
        linkedEntityType: params.linkedEntityType,
        linkedEntityId: params.linkedEntityId,
      });

      // If linked to a process instance, append event
      if (params.linkedEntityType === "process_instance") {
        await this.workflowRepo.appendEvent({
          workspaceId: params.workspaceId,
          instanceId: params.linkedEntityId,
          eventType: "DOCUMENT_LINKED",
          actorId: params.createdById,
          payload: { documentId: doc.id, title: params.title },
        });
      }
    }

    // 5. Generate Trace Receipt
    await this.generateTraceReceipt({
      workspaceId: params.workspaceId,
      documentId: doc.id,
      versionId: version.id,
      checksumSha256: params.checksumSha256,
      processInstanceId: params.linkedEntityType === "process_instance" ? params.linkedEntityId : undefined,
      createdById: params.createdById,
    });

    return doc;
  }

  async generateTraceReceipt(params: {
    workspaceId: string;
    documentId: string;
    versionId: string;
    checksumSha256: string;
    processInstanceId?: string;
    createdById?: string;
  }) {
    const verificationCode = randomBytes(16).toString("hex");
    const baseUrl = process.env.PUBLIC_DOCUMENT_VERIFICATION_BASE_URL || "/verificar/documento";
    const verificationUrl = `${baseUrl}/${verificationCode}`;

    const [receipt] = await runtimeDb.insert(traceReceipts).values({
      workspaceId: params.workspaceId,
      documentId: params.documentId,
      documentVersionId: params.versionId,
      processInstanceId: params.processInstanceId,
      verificationCode,
      verificationUrl,
      qrPayload: verificationUrl,
      checksumSha256: params.checksumSha256,
      createdById: params.createdById,
    }).returning();

    if (params.processInstanceId) {
      await this.workflowRepo.appendEvent({
        workspaceId: params.workspaceId,
        instanceId: params.processInstanceId,
        eventType: "DOCUMENT_TRACE_RECEIPT_CREATED",
        actorId: params.createdById,
        payload: { traceReceiptId: receipt.id, verificationCode },
      });
    }

    return receipt;
  }
}
