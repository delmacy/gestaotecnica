import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateReviewBudget, routeSpecializedReviews, validateDecisionInput } from '../../src/agent-work/services/scoped-review.js';
import { evaluatePathOwnership } from '../../src/agent-work/services/ownership-service.js';

describe('Agent Work Launch Unit Tests', () => {
  describe('Review Budget', () => {
    it('should fail when lines exceed limit', () => {
      const stats = { changed_lines_excluding_generated: 2000 };
      const res = calculateReviewBudget(stats);
      assert.strictEqual(res.exceeded, true);
      assert.ok(res.reasons.includes('Changed lines exceeded'));
    });

    it('should pass when within limits', () => {
      const stats = { changed_lines_excluding_generated: 1000, production_files: 5 };
      const res = calculateReviewBudget(stats);
      assert.strictEqual(res.exceeded, false);
    });
  });

  describe('Review Routing', () => {
    it('should always include module review', () => {
      const pkg = {};
      const reviews = routeSpecializedReviews(pkg);
      assert.ok(reviews.includes('module'));
    });

    it('should include contract review if contracts are produced', () => {
      const pkg = { contractsProduced: ['c1'] };
      const reviews = routeSpecializedReviews(pkg);
      assert.ok(reviews.includes('contract'));
    });
  });

  describe('Review Decision Input', () => {
    const reviewPkg = { changedFiles: ['src/a.ts', 'tests/a.test.ts'] };
    const completeInput = {
      filesReviewed: ['src/a.ts', 'tests/a.test.ts'],
      filesIntentionallyNotReviewed: [],
      contractsReviewed: [],
      dependenciesReviewed: [],
      testsVerified: ['npm run test:unit'],
      findings: [],
      requiredChanges: [],
      residualRisks: [],
    };

    it('accepts a complete approval input', () => {
      assert.strictEqual(validateDecisionInput(reviewPkg, 'approved', completeInput), null);
    });

    it('rejects approval without verified tests', () => {
      assert.match(validateDecisionInput(reviewPkg, 'approved', { ...completeInput, testsVerified: [] }) || '', /testsVerified/);
    });

    it('rejects approval with required changes', () => {
      assert.match(validateDecisionInput(reviewPkg, 'approved', { ...completeInput, requiredChanges: ['fix'] }) || '', /requiredChanges/);
    });

    it('rejects decisions that omit changed files', () => {
      assert.match(validateDecisionInput(reviewPkg, 'approved', { ...completeInput, filesReviewed: ['src/a.ts'] }) || '', /not accounted/);
    });
  });

  describe('Ownership Enforcement', () => {
    const pkg = {
      ownedPaths: ['src/platform/contracts/**'],
      readOnlyPaths: ['docs/ARCHITECTURE.md'],
      forbiddenPaths: ['src/secret/**']
    };

    it('should accept owned files', () => {
      const res = evaluatePathOwnership(pkg, ['src/platform/contracts/index.ts']);
      assert.strictEqual(res.valid, true);
      assert.strictEqual(res.ownedFiles.length, 1);
    });

    it('should reject read-only files', () => {
      const res = evaluatePathOwnership(pkg, ['docs/ARCHITECTURE.md']);
      assert.strictEqual(res.valid, false);
      assert.strictEqual(res.readOnlyViolations.length, 1);
    });

    it('should reject forbidden files', () => {
      const res = evaluatePathOwnership(pkg, ['src/secret/key.txt']);
      assert.strictEqual(res.valid, false);
      assert.strictEqual(res.forbiddenViolations.length, 1);
    });

    it('should reject files outside ownership', () => {
      const res = evaluatePathOwnership(pkg, ['src/other/file.ts']);
      assert.strictEqual(res.valid, false);
      assert.strictEqual(res.outsideOwnership.length, 1);
    });
  });
});
