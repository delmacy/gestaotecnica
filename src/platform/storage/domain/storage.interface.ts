export interface StoredObject {
  id: string;
  workspaceId: string;
  bucket: string;
  objectKey: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  checksumSha256: string;
  uploadedById?: string | null;
  createdAt: Date;
}

export interface UploadObjectInput {
  workspaceId: string;
  bucket?: string;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
  uploadedById?: string;
}

export interface GetSignedUrlInput {
  workspaceId: string;
  objectKey: string;
  expiresInSeconds?: number;
}

export interface ObjectStorageService {
  uploadObject(input: UploadObjectInput): Promise<StoredObject>;
  getSignedUrl(input: GetSignedUrlInput): Promise<string>;
  deleteObject(workspaceId: string, objectKey: string): Promise<void>;
}
