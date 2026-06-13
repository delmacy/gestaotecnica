import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { authAccounts, users } from "@/db/legacy/schema";
import { hashPassword } from "@/modules/auth/crypto";
import { randomBytes } from "crypto";

async function ensurePlatformAdmin() {
  const name = process.env.PLATFORM_ADMIN_NAME || "Platform Admin";
  const email = process.env.PLATFORM_ADMIN_EMAIL || "admin@systembuilder.local";
  let password = process.env.PLATFORM_ADMIN_PASSWORD;
  let passwordOrigin = "ambiente";

  if (!password) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "Erro: PLATFORM_ADMIN_PASSWORD não está definida no ambiente de produção."
      );
      process.exit(1);
    } else {
      password = randomBytes(8).toString("hex");
      passwordOrigin = "gerada aleatoriamente";
    }
  }

  try {
    const db = getDb();

    console.log(`Verificando administrador plataforma: ${email}`);

    // Insert or update user
    const [user] = await db
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

    // Hash password
    const { hash, salt } = hashPassword(password);

    // Insert or update auth account
    const existingAccount = await db
      .select()
      .from(authAccounts)
      .where(eq(authAccounts.userId, user.id))
      .limit(1);

    if (existingAccount.length > 0) {
      await db
        .update(authAccounts)
        .set({
          passwordHash: hash,
          passwordSalt: salt,
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(authAccounts.id, existingAccount[0].id));
    } else {
      await db.insert(authAccounts).values({
        userId: user.id,
        passwordHash: hash,
        passwordSalt: salt,
        isActive: true,
      });
    }

    console.log("=======================================");
    console.log("Superusuário da Plataforma Configurado!");
    console.log(`E-mail: ${email}`);
    console.log(`Origem da senha: ${passwordOrigin}`);
    if (passwordOrigin === "gerada aleatoriamente") {
      console.log(`Senha: ${password}`);
    }
    console.log("Rota de login: /auth/login");
    console.log("Rota inicial (Builder): /builder");
    console.log("=======================================");

    process.exit(0);
  } catch (error) {
    console.error("Erro ao configurar superusuário da plataforma:", error);
    process.exit(1);
  }
}

ensurePlatformAdmin();
