import re

with open('src/modules/auth/actions.ts', 'r') as f:
    content = f.read()

# Add SetupState type
setup_state_type = """
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
"""

content = content.replace('export async function setupFirstAdmin(formData: FormData) {', setup_state_type + '\nexport async function setupFirstAdmin(prevState: SetupState, formData: FormData): Promise<SetupState> {')

# Replace the body of setupFirstAdmin
old_body = """  const name = readRequiredText(formData, "name");
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
  redirect(getDefaultRouteForProfile("builder"));"""

new_body = """  try {
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const passwordConfirmation = String(formData.get("passwordConfirmation") ?? "");

    const fieldErrors: SetupState["fieldErrors"] = {};
    if (!name) fieldErrors.name = ["Nome é obrigatório."];

    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
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

    const result = await db.transaction(async (tx) => {
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
    return {
      status: "error",
      message: "Erro inesperado ao criar a conta. Tente novamente mais tarde.",
    };
  }

  redirect(getDefaultRouteForProfile("builder"));"""

content = content.replace(old_body, new_body)

with open('src/modules/auth/actions.ts', 'w') as f:
    f.write(content)
