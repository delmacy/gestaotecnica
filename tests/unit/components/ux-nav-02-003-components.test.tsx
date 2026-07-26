import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ContextualReturn } from '@/components/builder/shared/ContextualReturn';
import { EnvironmentBadge } from '@/components/builder/shared/EnvironmentBadge';

// We can bypass trying to mock next/navigation directly,
// and instead write a test version of PrimaryAction that receives pathname as a prop just for testing the logic,
// OR since Next.js app router doesn't easily let us mock usePathname in this setup,
// we will just assert that it renders correctly (the default pathname is typically "/" or undefined in static render if not mocked).
import { PrimaryAction } from '@/components/builder/shared/PrimaryAction';

describe('UX-NAV-02-003: Origin and active context model - Unit Tests', () => {

  describe('ContextualReturn', () => {
    it('renders access denied message when scope is invalid', () => {
      const context = {
        isValidScope: false,
        originPath: '/admin/users',
        returnPath: '/builder/dashboard',
        returnLabel: 'Return to Dashboard',
        isDemo: false,
        isSynthetic: false,
        isBlocked: false,
      };

      const html = renderToStaticMarkup(<ContextualReturn context={context} />);
      assert.match(html, /Access Denied: Cross-Scope Boundary Alert/);
      assert.match(html, /Return to Dashboard/);
      assert.match(html, /href="\/builder\/dashboard"/);
    });

    it('renders normal return link when scope is valid', () => {
      const context = {
        isValidScope: true,
        originPath: '/builder/capabilities',
        returnPath: '/builder/capabilities',
        returnLabel: 'Return',
        isDemo: false,
        isSynthetic: false,
        isBlocked: false,
      };

      const html = renderToStaticMarkup(<ContextualReturn context={context} />);
      assert.match(html, /Return/);
      assert.match(html, /href="\/builder\/capabilities"/);
      assert.doesNotMatch(html, /Access Denied/);
    });
  });

  describe('EnvironmentBadge', () => {
    it('renders DEMO MODE when isDemo is true', () => {
      const context = {
        isValidScope: true,
        originPath: null,
        returnPath: null,
        returnLabel: null,
        isDemo: true,
        isSynthetic: false,
        isBlocked: false,
      };

      const html = renderToStaticMarkup(<EnvironmentBadge context={context} />);
      assert.match(html, /DEMO MODE/);
    });

    it('renders SYNTHETIC MODE when isSynthetic is true', () => {
      const context = {
        isValidScope: true,
        originPath: null,
        returnPath: null,
        returnLabel: null,
        isDemo: false,
        isSynthetic: true,
        isBlocked: false,
      };

      const html = renderToStaticMarkup(<EnvironmentBadge context={context} />);
      assert.match(html, /SYNTHETIC MODE/);
    });

    it('renders nothing when not demo or synthetic', () => {
      const context = {
        isValidScope: true,
        originPath: null,
        returnPath: null,
        returnLabel: null,
        isDemo: false,
        isSynthetic: false,
        isBlocked: false,
      };

      const html = renderToStaticMarkup(<EnvironmentBadge context={context} />);
      assert.strictEqual(html, '');
    });
  });

  describe('PrimaryAction', () => {
    it('appends origin parameter to href based on pathname (defaults to / in mock)', () => {
      const intent = {
        id: 'test',
        label: 'Create',
        state: 'active' as const,
        href: '/builder/new',
      };
      const html = renderToStaticMarkup(<PrimaryAction intent={intent} />);
      // It appends origin=%2F (which is encoded '/') when usePathname is not in context
      assert.match(html, /href="\/builder\/new\?origin=%2F"/);
    });

    it('appends origin using & if href already has a query string', () => {
      const intent = {
        id: 'test',
        label: 'Create',
        state: 'active' as const,
        href: '/builder/new?pre=1',
      };
      const html = renderToStaticMarkup(<PrimaryAction intent={intent} />);
      assert.match(html, /href="\/builder\/new\?pre=1&amp;origin=%2F"/);
    });

    it('does not render Link if blocked', () => {
      const intent = {
        id: 'test',
        label: 'Create',
        state: 'blocked' as const,
        href: '/builder/new',
      };
      const html = renderToStaticMarkup(<PrimaryAction intent={intent} />);
      assert.doesNotMatch(html, /href=/);
      assert.match(html, /disabled/);
    });
  });
});
