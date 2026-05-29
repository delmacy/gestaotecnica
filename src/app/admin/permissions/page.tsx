import Link from "next/link";
import {
  ensureBasePermissions,
  toggleRolePermission,
} from "@/modules/admin/actions";
import { getPermissionMatrix } from "@/modules/admin/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminPermissionsPage() {
  const { grants, permissions, roles } = await getPermissionMatrix();
  const grantKeys = new Set(
    grants
      .filter((grant: any) => grant.isAllowed)
      .map((grant: any) => `${grant.roleId}:${grant.permissionId}`),
  );

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <section className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <Button asChild variant="outline">
            <Link href="/admin">Voltar</Link>
          </Button>
          <form action={ensureBasePermissions}>
            <Button type="submit">Criar permissoes base</Button>
          </form>
        </div>
        <h1 className="mt-6 text-3xl font-semibold">Permissoes</h1>
        <div className="mt-4 space-y-4">
          {roles.map((role: any) => (
            <Card key={role.id}>
              <CardContent className="p-4">
                <h2 className="font-semibold">{role.label}</h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {permissions.map((permission: any) => (
                    <form action={toggleRolePermission} key={permission.id}>
                      <input name="roleId" type="hidden" value={role.id} />
                      <input
                        name="permissionId"
                        type="hidden"
                        value={permission.id}
                      />
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          defaultChecked={grantKeys.has(
                            `${role.id}:${permission.id}`,
                          )}
                          name="isAllowed"
                          type="checkbox"
                        />
                        {permission.label}
                      </label>
                      <Button className="mt-2" size="sm" type="submit" variant="outline">
                        Salvar
                      </Button>
                    </form>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
