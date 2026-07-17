// RBAC Roles and Access Checks

export type Role = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  roles: Role[];
}

export type Action = 'create' | 'read' | 'update' | 'delete' | 'manage';

export const RolePermissions: Record<Role, Action[]> = {
  admin: ['create', 'read', 'update', 'delete', 'manage'],
  editor: ['create', 'read', 'update'],
  viewer: ['read']
};

export function hasPermission(user: User, action: Action): boolean {
  if (!user || !user.roles) return false;
  return user.roles.some(role => {
    const permissions = RolePermissions[role];
    return permissions && permissions.includes(action);
  });
}

export function hasRole(user: User, role: Role): boolean {
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
}
