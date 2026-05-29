import {
  ObjectStorageService,
  UploadObjectInput,
  StoredObject,
  GetSignedUrlInput
} from "../domain/storage.interface";
import { StorageRepository } from "../infra/storage.repository";
import { createHash, randomUUID } from "crypto";

export class MinioStorageService implements ObjectStorageService {
  private repository: StorageRepository;

  constructor() {
    this.repository = new StorageRepository();
  }

  private isConfigured(): boolean {
    return !!(
      process.env.MINIO_ENDPOINT &&
      process.env.MINIO_ACCESS_KEY &&
      process.env.MINIO_SECRET_KEY
    );
  }

  async uploadObject(input: UploadObjectInput): Promise<StoredObject> {
    const checksum = createHash("sha256").update(input.buffer).digest("hex");
    const objectId = randomUUID();
    const bucket = input.bucket || process.env.MINIO_DEFAULT_BUCKET || "system-builder";
    const objectKey = `workspaces/${input.workspaceId}/objects/${objectId}`;

    if (this.isConfigured()) {
      // Implementation with real MinIO client would go here
      console.log(`[MinIO] Mock Upload: ${objectKey} to bucket ${bucket}`);
    } else {
      console.warn("[Storage] MinIO not configured. Simulation mode: metadata saved, bytes ignored.");
    }

    const stored = await this.repository.createObject({
      workspaceId: input.workspaceId,
      bucket,
      objectKey,
      fileName: input.fileName,
      mimeType: input.mimeType,
      sizeBytes: input.buffer.length,
      checksumSha256: checksum,
      uploadedById: input.uploadedById,
    });

    return stored as StoredObject;
  }

  async getSignedUrl(input: GetSignedUrlInput): Promise<string> {
    if (!this.isConfigured()) {
      return `https://simulation-storage.local/${input.objectKey}?token=mock`;
    }
    // Implementation with MinIO client would go here
    return `https://${process.env.MINIO_ENDPOINT}/${input.objectKey}?signed=true`;
  }

  async deleteObject(workspaceId: string, objectKey: string): Promise<void> {
    if (this.isConfigured()) {
       // Implementation with MinIO client would go here
       console.log(`[MinIO] Mock Delete: ${objectKey}`);
    }
  }
}
