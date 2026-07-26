import { describe, it } from 'node:test';
import assert from 'node:assert';
import { resolveWorkspaceSwitching, resolveWorkspaceList } from '../../../../src/app/api/builder/navigation/workspace-switching-contract/resolve-workspace-switching';

describe('Workspace Switching Contract', () => {
    it('should successfully switch workspace', () => {
        const response = resolveWorkspaceSwitching({ currentWorkspaceId: 'ws-1', targetWorkspaceId: 'ws-2', userId: 'user-1' });
        assert.strictEqual(response.status, 'success');
        assert.strictEqual(response.redirectUrl, '/builder');
    });

    it('should forbid switching to unauthorized workspace', () => {
        const response = resolveWorkspaceSwitching({ currentWorkspaceId: 'ws-1', targetWorkspaceId: 'forbidden-ws', userId: 'user-1' });
        assert.strictEqual(response.status, 'forbidden');
        assert.strictEqual(response.message, 'Not authorized for this workspace.');
    });

    it('should return list of workspaces with correct badges', () => {
        const response = resolveWorkspaceList({ userId: 'user-1' });
        assert.strictEqual(response.workspaces.length, 2);
        assert.strictEqual(response.workspaces[0]?.name, 'Primary Operations');
        assert.strictEqual(response.workspaces[1]?.isSynthetic, true);
    });
});
