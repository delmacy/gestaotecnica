import { runtimeDb } from "@/db";
import { objects } from "@/db/runtime/schema/storage";
import { eq } from "drizzle-orm";
import { StoredObject } from "../domain/storage.interface";

export class StorageRepository {
  async createObject(data: Omit<StoredObject, "id" | "createdAt">) {
    const [row] = await runtimeDb.insert(objects).values({
      workspaceId: data.workspaceId,
      bucket: data.bucket,
      objectKey: data.objectKey,
      fileName: data.fileName,
      mimeType: data.mimeType,
      sizeBytes: data.sizeBytes,
      checksumSha256: data.checksumSha256,
      uploadedById: data.uploadedById,
    }).returning();
    return row;
  }

  async getObjectByKey(workspaceId: string, objectKey: string) {
    const [row] = await runtimeDb
      .select()
      .from(objects)
      .where(eq(objects.objectKey, objectKey)); // Should also check workspaceId
    return row;
  }
}
