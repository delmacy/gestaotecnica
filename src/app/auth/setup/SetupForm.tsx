"use client";

import Link from "next/link";
import { useActionState } from "react";
import { setupFirstAdmin } from "@/modules/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function SetupForm() {
  const [state, formAction, isPending] = useActionState(setupFirstAdmin, { status: "idle" });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Criar administrador <span className="ml-2 text-xs font-normal text-muted-foreground">(Real Environment)</span></CardTitle>
      </CardHeader>
      <CardContent>
        {state?.status === "error" && state.message && (
          <div aria-live="polite" className="mb-4 rounded bg-destructive/15 p-3 text-sm text-destructive">
            {state.message}
          </div>
        )}
        {state?.status === "success" && state.message && (
          <div aria-live="polite" className="mb-4 rounded bg-green-500/15 p-3 text-sm text-green-600">
            {state.message}
          </div>
        )}
        <form action={formAction} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Nome</span>
            <Input
              className="mt-1"
              name="name"
              required
              type="text"
              autoComplete="name"
            />
            {state?.fieldErrors?.name && (
              <span className="text-xs text-destructive">{state.fieldErrors.name[0]}</span>
            )}
          </label>
          <label className="block">
            <span className="text-sm font-medium">E-mail</span>
            <Input
              className="mt-1"
              name="email"
              required
              type="email"
              autoComplete="email"
            />
            {state?.fieldErrors?.email && (
              <span className="text-xs text-destructive">{state.fieldErrors.email[0]}</span>
            )}
          </label>
          <label className="block">
            <span className="text-sm font-medium">Senha</span>
            <Input
              className="mt-1"
              name="password"
              required
              type="password"
              autoComplete="new-password"
            />
            {state?.fieldErrors?.password && (
              <span className="text-xs text-destructive">{state.fieldErrors.password[0]}</span>
            )}
          </label>
          <label className="block">
            <span className="text-sm font-medium">Confirmar senha</span>
            <Input
              className="mt-1"
              name="passwordConfirmation"
              required
              type="password"
              autoComplete="new-password"
            />
            {state?.fieldErrors?.passwordConfirmation && (
              <span className="text-xs text-destructive">{state.fieldErrors.passwordConfirmation[0]}</span>
            )}
          </label>
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? "Criando..." : "Criar administrador"}
          </Button>
        </form>
        <Button asChild className="mt-3 w-full" variant="outline">
          <Link href="/auth/login">Voltar para Login</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
