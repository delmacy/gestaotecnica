"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { authAccounts, authSessions, users } from "@/db/legacy/schema";
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


export function parseDatabaseError(err: unknown): string | null {
  const message = err instanceof Error ? err.message : String(err);
  const code = (err as { code?: unknown })?.code;

  if (message.includes("is required")) {
    return "BLOCKER: DATABASE_URL is missing. Please check your environment variables.";
  } else if (code === "42P01") {
    return "BLOCKER: Database schema is missing required tables. Please run database migrations.";
  } else if (code === "42501" || message.includes("permission denied")) {
    return "BLOCKER: Insufficient privileges. Ensure the connection uses a least-privilege role (not a superuser).";
  } else if (code === "ECONNREFUSED" || message.includes("ECONNREFUSED")) {
    return "BLOCKER: Could not connect to the database. Ensure the database server is running.";
  } else if (message.includes("does not exist") || message.includes("no password supplied")) {
    return "BLOCKER: Invalid database credentials or database does not exist.";
  } else if (message.includes("failed to connect") || message.includes("timeout")) {
    return "BLOCKER: Database connection failed. Contact support.";
  }

  return null;
}

export type SetupState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    passwordConfirmation?: string[];
  };
};

export async function setupFirstAdmin(prevState: SetupState, formData: FormData): Promise<SetupState> {
  try {
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const passwordConfirmation = String(formData.get("passwordConfirmation") ?? "");

    const fieldErrors: SetupState["fieldErrors"] = {};
    if (!name) fieldErrors.name = ["Nome é obrigatório."];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) fieldErrors.email = ["E-mail é obrigatório."];
    else if (!emailRegex.test(email)) fieldErrors.email = ["E-mail inválido."];

    if (!password) fieldErrors.password = ["Senha é obrigatória."];
    else if (password.length < 8) fieldErrors.password = ["A senha deve ter pelo menos 8 caracteres."];

    if (!passwordConfirmation) fieldErrors.passwordConfirmation = ["Confirmação de senha é obrigatória."];
    else if (password !== passwordConfirmation) {
      fieldErrors.passwordConfirmation = ["As senhas não coincidem."];
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { status: "error", message: "Verifique os campos preenchidos.", fieldErrors };
    }

    const db = getDb();
    const existingAccounts = await db.select({ id: authAccounts.id }).from(authAccounts);

    if (existingAccounts.length > 0) {
      return {
        status: "error",
        message: "O primeiro administrador já foi configurado. Entre pela página de login. Para recuperar o acesso, utilize o procedimento administrativo documentado.",
      };
    }

    const existingUser = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return {
        status: "error",
        message: "O e-mail informado já está em uso por outro usuário.",
      };
    }

    const result = await db.transaction(async (tx: any) => {
      const [user] = await tx
        .insert(users)
        .values({ name, email, status: "active", accessProfile: "builder" })
        .returning({ id: users.id });

      const passwordData = hashPassword(password);
      await tx.insert(authAccounts).values({
        userId: user.id,
        passwordHash: passwordData.hash,
        passwordSalt: passwordData.salt,
      });

      return user;
    });

    try {
      await createSession(result.id);
    } catch (sessionError) {
      console.error("Session creation failed", sessionError);
      return {
        status: "success",
        message: "Conta criada com sucesso, mas ocorreu um erro ao iniciar a sessão. Por favor, faça login.",
      };
    }

  } catch (error) {
    console.error("Setup error", error);

    const dbBlocker = parseDatabaseError(error);
    if (dbBlocker) {
      return {
        status: "error",
        message: dbBlocker,
      };
    }

    return {
      status: "error",
      message: "Erro inesperado ao criar a conta. Tente novamente mais tarde.",
    };
  }

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

    const dbBlocker = parseDatabaseError(err);
    if (dbBlocker) {
      return { error: dbBlocker };
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
