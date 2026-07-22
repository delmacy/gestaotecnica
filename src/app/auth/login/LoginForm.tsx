"use client";

import { useActionState } from "react";
import { login } from "@/modules/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LoginState {
  error?: string;
}

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    login as (state: LoginState, formData: FormData) => Promise<LoginState>,
    { error: "" }
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div aria-live="polite" className="rounded bg-destructive/15 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}
      <label className="block">
        <span className="text-sm font-medium">E-mail</span>
        <Input className="mt-1" name="email" required type="email" autoComplete="email" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Senha</span>
        <Input className="mt-1" name="password" required type="password" autoComplete="current-password" />
      </label>
      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
