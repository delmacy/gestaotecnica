import { test, expect } from '@playwright/test';

test.describe('Builder Navigation API Endpoint', () => {
  test('should return the navigation inventory with correct environment mode', async ({ request }) => {
    const response = await request.get('/api/builder/navigation');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();

    // Check structure based on the contract
    expect(data).toHaveProperty('activeModules');
    expect(Array.isArray(data.activeModules)).toBeTruthy();

    expect(data).toHaveProperty('futureModules');
    expect(Array.isArray(data.futureModules)).toBeTruthy();

    expect(data).toHaveProperty('environmentMode');
    expect(['real', 'synthetic', 'demo']).toContain(data.environmentMode);

    // Verify Dashboard is always present in active modules
    const dashboard = data.activeModules.find((m: { href: string; label?: string; status?: string }) => m.href === '/builder');
    expect(dashboard).toBeDefined();
    expect(dashboard.label).toBe('Dashboard / Home');

    // Verify some future modules
    const workflowBuilder = data.futureModules.find((m: { href: string; label?: string; status?: string }) => m.href === '/builder/workflow-builder');
    expect(workflowBuilder).toBeDefined();
    expect(['blocked', 'coming_soon']).toContain(workflowBuilder.status);
  });
});
