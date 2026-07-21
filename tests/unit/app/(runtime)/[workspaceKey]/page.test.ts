import { test } from 'node:test';
import assert from 'node:assert';
import WorkspaceHomePage from '../../../../../src/app/(runtime)/[workspaceKey]/page';

test('WorkspaceHomePage should render the workspace home page component', async () => {
  const paramsPromise = Promise.resolve({ workspaceKey: 'test-workspace' });
  const page = await WorkspaceHomePage({ params: paramsPromise });
  assert.ok(page, 'Page component should be rendered');

  // In server components testing this way, we just verify it returns a React element
  // The type is a function when it's a imported component (WorkspaceHome)
  assert.strictEqual(typeof page.type, 'function', 'Should return a valid React element');

  // Verify the props passed to the component
  assert.strictEqual(page.props.workspaceKey, 'test-workspace', 'Should pass workspaceKey to WorkspaceHome');
});
