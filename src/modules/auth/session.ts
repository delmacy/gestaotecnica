import { cookies } from "next/headers";
import { and, eq, gt, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { authSessions, users } from "@/db/schema";
import { AUTH_COOKIE } from "./constants";
import { hashSessionToken } from "./crypto";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) return null;

  const db = getDb();
  const [session] = await db
    .select({
      userId: authSessions.userId,
      name: users.name,
      email: users.email,
      status: users.status,
    })
    .from(authSessions)
    .innerJoin(users, eq(authSessions.userId, users.id))
    .where(
      and(
        eq(authSessions.tokenHash, hashSessionToken(token)),
        gt(authSessions.expiresAt, new Date()),
        isNull(authSessions.revokedAt),
      ),
    )
    .limit(1);

  return session ?? null;
}
