import { desc, eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { entityAttachments, entityComments, users } from "@/db/schema";

export async function getEntityComments(entityType: string, entityId: string) {
  return getDb()
    .select({
      id: entityComments.id,
      body: entityComments.body,
      createdAt: entityComments.createdAt,
      authorName: users.name,
    })
    .from(entityComments)
    .leftJoin(users, eq(entityComments.createdById, users.id))
    .where(
      and(
        eq(entityComments.entityType, entityType),
        eq(entityComments.entityId, entityId),
      ),
    )
    .orderBy(desc(entityComments.createdAt));
}

export async function getEntityAttachments(entityType: string, entityId: string) {
  return getDb()
    .select({
      id: entityAttachments.id,
      title: entityAttachments.title,
      fileUrl: entityAttachments.fileUrl,
      mimeType: entityAttachments.mimeType,
      createdAt: entityAttachments.createdAt,
      authorName: users.name,
    })
    .from(entityAttachments)
    .leftJoin(users, eq(entityAttachments.createdById, users.id))
    .where(
      and(
        eq(entityAttachments.entityType, entityType),
        eq(entityAttachments.entityId, entityId),
      ),
    )
    .orderBy(desc(entityAttachments.createdAt));
}
