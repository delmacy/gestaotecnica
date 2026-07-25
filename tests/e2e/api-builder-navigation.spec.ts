import { test, expect } from '@playwright/test';

test.describe('Builder Navigation API Endpoint', () => {
  test('should return the navigation inventory with correct environment mode (default real)', async ({ request }) => {
    const response = await request.get('/api/builder/navigation');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();

    // Check structure based on the contract
    expect(data).toHaveProperty('activeModules');
    expect(Array.isArray(data.activeModules)).toBeTruthy();
    expect(data.activeModules.length).toBe(9); // All GROUP_A_ROUTES should be present

    expect(data).toHaveProperty('futureModules');
    expect(Array.isArray(data.futureModules)).toBeTruthy();

    expect(data).toHaveProperty('environmentMode');
    expect(data.environmentMode).toBe('real');

    // Verify Dashboard is always present in active modules
    const dashboard = data.activeModules.find((m: { href: string; label?: string; status?: string }) => m.href === '/builder');
    expect(dashboard).toBeDefined();
    expect(dashboard.label).toBe('Dashboard / Home');
    expect(dashboard.status).toBe('active');

    // Verify some future modules
    const workflowBuilder = data.futureModules.find((m: { href: string; label?: string; status?: string }) => m.href === '/builder/workflow-builder');
    expect(workflowBuilder).toBeDefined();
    expect(['blocked', 'coming_soon']).toContain(workflowBuilder.status);
  });

  test('should reflect synthetic environment mode via cookie', async ({ request }) => {
    const response = await request.get('/api/builder/navigation', {
      headers: {
        Cookie: 'x-environment-mode=synthetic'
      }
    });
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.environmentMode).toBe('synthetic');
  });

  test('should reflect demo environment mode via cookie', async ({ request }) => {
    const response = await request.get('/api/builder/navigation', {
      headers: {
        Cookie: 'x-environment-mode=demo'
      }
    });
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.environmentMode).toBe('demo');
  });
});
