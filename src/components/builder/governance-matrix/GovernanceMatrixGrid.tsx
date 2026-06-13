"use client";

import React, { useMemo } from 'react';
import { GovernanceMatrix, GovernanceResource, GovernanceRole, GovernanceAction, GovernancePermission } from './governance-matrix-types';
import { GovernancePermissionCell } from './GovernancePermissionCell';

interface GovernanceMatrixGridProps {
  matrix: GovernanceMatrix;
  selectedPermissionId: string | null;
  onSelectPermission: (permissionId: string) => void;
  filterRoleIds?: string[];
  filterResourceIds?: string[];
}

export function GovernanceMatrixGrid({
  matrix,
  selectedPermissionId,
  onSelectPermission,
  filterRoleIds = [],
  filterResourceIds = []
}: GovernanceMatrixGridProps) {

  const displayRoles = useMemo(() => {
    if (filterRoleIds.length === 0) return matrix.roles;
    return matrix.roles.filter(r => filterRoleIds.includes(r.id));
  }, [matrix.roles, filterRoleIds]);

  const displayResources = useMemo(() => {
    if (filterResourceIds.length === 0) return matrix.resources;
    return matrix.resources.filter(r => filterResourceIds.includes(r.id));
  }, [matrix.resources, filterResourceIds]);

  // agrupar actions por resource para criar as linhas
  const rows = useMemo(() => {
    const r: { resource: GovernanceResource, action: GovernanceAction }[] = [];
    displayResources.forEach(res => {
      matrix.actions.forEach(act => {
        r.push({ resource: res, action: act });
      });
    });
    return r;
  }, [displayResources, matrix.actions]);

  const getPermission = (roleId: string, resourceId: string, action: GovernanceAction): GovernancePermission | undefined => {
    return matrix.permissions.find(p => p.roleId === roleId && p.resourceId === resourceId && p.action === action);
  };

  return (
    <div className="overflow-x-auto border rounded-md bg-white">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-700 bg-slate-50 border-b">
          <tr>
            <th className="px-4 py-3 font-medium min-w-[200px] border-r">Resource</th>
            <th className="px-4 py-3 font-medium min-w-[120px] border-r">Action</th>
            {displayRoles.map(role => (
              <th key={role.id} className="px-4 py-3 font-medium text-center min-w-[120px]">
                {role.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            // Zebrar por resource
            const resourceIdx = displayResources.findIndex(res => res.id === row.resource.id);
            const isEven = resourceIdx % 2 === 0;

            return (
              <tr key={`${row.resource.id}-${row.action}`} className={`border-b ${isEven ? 'bg-white' : 'bg-slate-50/50'}`}>
                {idx % matrix.actions.length === 0 ? (
                  <td className="px-4 py-2 border-r font-medium text-slate-800" rowSpan={matrix.actions.length}>
                    {row.resource.name}
                    <div className="text-[10px] text-slate-400 font-normal uppercase mt-1">{row.resource.resource_type}</div>
                  </td>
                ) : null}
                <td className="px-4 py-2 border-r text-slate-600 font-mono text-xs">
                  {row.action}
                </td>
                {displayRoles.map(role => {
                  const perm = getPermission(role.id, row.resource.id, row.action);
                  return (
                    <td key={`${role.id}-${row.resource.id}-${row.action}`} className="px-2 py-1 text-center">
                      <GovernancePermissionCell
                        permission={perm}
                        isSelected={perm ? perm.id === selectedPermissionId : false}
                        onClick={() => perm && onSelectPermission(perm.id)}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
