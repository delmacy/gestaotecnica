import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

describe('Builder to Runtime Handoff Frontend', () => {
  it('creates the required test page for manual contract validation', () => {
    const pagePath = path.resolve('src/app/(builder)/builder/ui-contracts/handoff-test/page.tsx');
    assert.ok(fs.existsSync(pagePath), 'Handoff test page should exist');

    const content = fs.readFileSync(pagePath, 'utf8');
    assert.match(content, /HandoffTest/, 'Should import and use HandoffTest component');
  });

  it('creates the component to render handoff distinct states', () => {
    const componentPath = path.resolve('src/components/builder/ui-contracts/HandoffTest.tsx');
    assert.ok(fs.existsSync(componentPath), 'HandoffTest component should exist');

    const content = fs.readFileSync(componentPath, 'utf8');

    // Check for state cases defined in contract
    assert.match(content, /id:\s*'live-app'/, 'Should include live app state');
    assert.match(content, /id:\s*'empty-app'/, 'Should include empty state');
    assert.match(content, /id:\s*'blocked-app'/, 'Should include blocked state');
    assert.match(content, /id:\s*'demo-app'/, 'Should include demo state');
    assert.match(content, /id:\s*'synth-app'/, 'Should include synthetic state');

    // Check for API integration
    assert.match(content, /\/api\/builder\/handoff/, 'Should call the backend contract endpoint');

    // Check for routing behavior (view in runtime)
    assert.match(content, /useRouter/, 'Should use Next.js router');
    assert.match(content, /router\.push/, 'Should handle routing to runtime');
  });
});
