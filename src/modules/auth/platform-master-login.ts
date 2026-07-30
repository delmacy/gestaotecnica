import { getDb } from "@/db";
import { authAccounts, users } from "@/db/legacy/schema";
import { hashPassword } from "./crypto";

export async function ensurePlatformMasterAccount(email: string, password: string) {
  const db = getDb();
  const name = process.env.PLATFORM_ADMIN_NAME?.trim() || "Platform Admin";
  const passwordData = hashPassword(password);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = await db.transaction(async (tx: any) => { // explicit-any-ok
    const [user] = await tx
      .insert(users)
      .values({
        name,
        email,
        status: "active",
        accessProfile: "builder",
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          name,
          status: "active",
          accessProfile: "builder",
          updatedAt: new Date(),
        },
      })
      .returning({ id: users.id });

    await tx
      .insert(authAccounts)
      .values({
        userId: user.id,
        passwordHash: passwordData.hash,
        passwordSalt: passwordData.salt,
        isActive: true,
      })
      .onConflictDoUpdate({
        target: authAccounts.userId,
        set: {
          passwordHash: passwordData.hash,
          passwordSalt: passwordData.salt,
          isActive: true,
          updatedAt: new Date(),
        },
      });

    return user.id as string;
  });

  console.warn("[auth] Platform master login normalized the builder account.", {
    userId,
    occurredAt: new Date().toISOString(),
  });
}
