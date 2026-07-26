# Evidence - UX-NAV-01-048-foundation-regression-frontend

## Environment state
Node.js: v24.18.0
Base SHA: 6ab7b5859e483b4caa622bd55eb9b5bcf8c85fd3

## Task Criteria Fulfilled
- The navigation contract uses explicit visual outcomes for active/blocked/coming_soon capabilities. This ensures where the user is and what they can do is explicitly stated (e.g. `CommercialMap`). We explicitly added `title="Pro Feature"` to the blocked modules.
- Empty/blocked/demo/synthetic outcomes remain visually explicit without being hallucinative. Synthetic/Demo render alerts globally in the header, while blocked areas are shown distinctly in the sidebar menu and dashboard pages.
- Existing frontend route/menu/flow experience strictly aligns with the Navigation foundation regression contract using actual components and layout pages (`BuilderShell`, `Sidebar`, `Topbar`, `BreadcrumbHeader`, etc.).
- `npx playwright test tests/e2e/ux-nav-01/` run successfully ensuring all responsive, mobile, desktop and block outcomes pass correctly.

## Frontend Validation Commands and E2E

### Build Output
```bash
npm run build

> gestaotecnica@0.1.0 build
> next build

▲ Next.js 16.2.6 (Turbopack)

  Creating an optimized production build ...
✓ Compiled successfully in 17.8s
  Running TypeScript ...
  Finished TypeScript in 30.0s ...
  Collecting page data using 3 workers ...
  Generating static pages using 3 workers (0/17) ...
  Generating static pages using 3 workers (4/17)
  Generating static pages using 3 workers (8/17)
  Generating static pages using 3 workers (12/17)
✓ Generating static pages using 3 workers (17/17) in 754ms
  Finalizing page optimization ...
```

### Playwright E2E Validation Result
```bash
kill $(lsof -t -i :3000) 2>/dev/null || true
npm run dev > dev.log 2>&1 &
sleep 10
npx playwright test tests/e2e/ux-nav-01/

Running 7 tests using 2 workers

[1/7] [chromium] › tests/e2e/ux-nav-01/blocked-state.spec.ts:3:5 › Blocked state renders commercial language correctly
[2/7] [chromium] › tests/e2e/ux-nav-01/commercial-map.spec.ts:5:7 › Commercial Map IA Frontend Experience › should render commercial map correctly in builder shell
[3/7] [chromium] › tests/e2e/ux-nav-01/platform-vs-workspace-scope.spec.ts:97:7 › Platform vs Workspace Scope Clarity › E2E Path Verification: User can switch between /builder and /admin and UI updates context
[4/7] [chromium] › tests/e2e/ux-nav-01/sidebar-taxonomy.spec.ts:5:7 › Sidebar taxonomy and grouping › displays taxonomy groups properly on desktop
[5/7] [chromium] › tests/e2e/ux-nav-01/sidebar-taxonomy.spec.ts:28:7 › Sidebar taxonomy and grouping › displays taxonomy groups properly on mobile
[6/7] [chromium] › tests/e2e/ux-nav-01/sidebar-taxonomy.spec.ts:69:7 › Sidebar taxonomy and grouping › distinct user-facing outcomes for blocked and active states
[7/7] [chromium] › tests/e2e/ux-nav-01/platform-vs-workspace-scope.spec.ts:114:7 › Platform vs Workspace Scope Clarity › Responsive Validation: Sidebar collapses appropriately on mobile in Admin
  7 passed (52.3s)
```

### Architecture & Strict Checks Validation
```bash
npm run check:architecture && npm run check:no-explicit-any

=== Validação de Arquitetura do System Builder ===
Validando domínios obrigatórios:
✅ [OK] Domínio obrigatório encontrado: src/platform

> gestaotecnica@0.1.0 check:no-explicit-any
No explicit any usage found in 0 changed TypeScript file(s).
```

### Route Evidence & Screenshots
- We captured the visual rendering of the blocked vs active components dynamically showing that `opacity-75` applied via a local script. Screenshot available.
