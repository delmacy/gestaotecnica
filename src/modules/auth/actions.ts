"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { authAccounts, authSessions, users } from "@/db/schema";
import {
  createSessionToken,
  hashPassword,
  hashSessionToken,
  verifyPassword,
} from "./crypto";
import { AUTH_COOKIE } from "./constants";
import { AccessProfile, getDefaultRouteForProfile, canAccessRoute } from "./access-profiles";

function readRequiredText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();

  if (!value) throw new Error(`Campo obrigatorio ausente: ${field}`);

  return value;
}

async function createSession(userId: string) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  const db = getDb();

  await db.insert(authSessions).values({
    userId,
    tokenHash: hashSessionToken(token),
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    expires: expiresAt,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function setupFirstAdmin(formData: FormData) {
  const name = readRequiredText(formData, "name");
  const email = readRequiredText(formData, "email").toLowerCase();
  const password = readRequiredText(formData, "password");
  const db = getDb();
  const existingAccounts = await db.select({ id: authAccounts.id }).from(authAccounts);

  if (existingAccounts.length > 0) {
    throw new Error("Setup inicial ja foi concluido.");
  }

  const [user] = await db
    .insert(users)
    .values({ name, email, status: "active", accessProfile: "builder" })
    .onConflictDoUpdate({
      target: users.email,
      set: { name, status: "active", accessProfile: "builder", updatedAt: new Date() },
    })
    .returning({ id: users.id });

  const passwordData = hashPassword(password);
  await db.insert(authAccounts).values({
    userId: user.id,
    passwordHash: passwordData.hash,
    passwordSalt: passwordData.salt,
  });

  await createSession(user.id);
  redirect(getDefaultRouteForProfile("builder"));
}

export async function login(prevState: any, formData: FormData) {
  try {
    const email = readRequiredText(formData, "email").toLowerCase();
    const password = readRequiredText(formData, "password");
    const db = getDb();

  const [account] = await db
    .select({
      userId: authAccounts.userId,
      hash: authAccounts.passwordHash,
      salt: authAccounts.passwordSalt,
      isActive: authAccounts.isActive,
      userStatus: users.status,
      accessProfile: users.accessProfile,
    })
    .from(authAccounts)
    .innerJoin(users, eq(authAccounts.userId, users.id))
    .where(eq(users.email, email))
    .limit(1);

    if (
      !account ||
      !account.isActive ||
      account.userStatus !== "active" ||
      !verifyPassword(password, account.salt, account.hash)
    ) {
      return { error: "Credenciais inválidas." };
    }

    await createSession(account.userId);

    const next = formData.get("next") as string;
    const accessProfile = account.accessProfile as AccessProfile;

    if (next && canAccessRoute(accessProfile, next)) {
      redirect(next);
    }

    redirect(getDefaultRouteForProfile(accessProfile));
  } catch (err: unknown) {
    if ((err as Error).message === "NEXT_REDIRECT") {
      throw err;
    }
    return { error: "Erro ao realizar login." };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (token) {
    await getDb()
      .update(authSessions)
      .set({ revokedAt: new Date() })
      .where(eq(authSessions.tokenHash, hashSessionToken(token)));
  }

  cookieStore.delete(AUTH_COOKIE);
  redirect("/auth/login");
}
