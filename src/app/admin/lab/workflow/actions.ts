"use server";

import { WorkflowEngineService } from "@/platform/workflow-engine/services/workflow-engine.service";
import { NotificationService } from "@/platform/notifications/application/notification.service";
import { DocumentService } from "@/platform/documents/application/document.service";
import { MinioStorageService } from "@/platform/storage/services/minio-storage.service";
import { revalidatePath } from "next/cache";

export async function createLabInstance(workspaceId: string, versionId: string) {
  const engine = new WorkflowEngineService();
  await engine.createInstance({
    workspaceId,
    processVersionId: versionId,
  });
  revalidatePath("/admin/lab/workflow");
}

export async function executeLabAction(workspaceId: string, instanceId: string, actionKey: string, payload: unknown) {
  const engine = new WorkflowEngineService();
  const result = await engine.executeAction({
    workspaceId,
    instanceId,
    actionKey,
    inputPayload: payload as Record<string, unknown>,
  });
  revalidatePath("/admin/lab/workflow");
  return result;
}

export async function sendLabNotification(workspaceId: string, instanceId: string) {
  const service = new NotificationService();
  await service.sendNotification({
    workspaceId,
    processInstanceId: instanceId,
    title: "Teste do Lab",
    message: "Esta é uma notificação gerada pelo Laboratório de Testes.",
  });
  revalidatePath("/admin/lab/workflow");
}

export async function attachLabEvidence(workspaceId: string, instanceId: string, fileName: string) {
  const storage = new MinioStorageService();
  const docService = new DocumentService();

  // Simulate a file upload
  const buffer = Buffer.from("Conteúdo simulado de evidência técnica.");
  const stored = await storage.uploadObject({
    workspaceId,
    fileName,
    mimeType: "text/plain",
    buffer,
  });

  await docService.createDocument({
    workspaceId,
    title: `Evidência: ${fileName}`,
    documentType: "evidência_lab",
    storageObjectId: stored.id,
    checksumSha256: stored.checksumSha256,
    linkedEntityType: "process_instance",
    linkedEntityId: instanceId,
  });

  revalidatePath("/admin/lab/workflow");
}
