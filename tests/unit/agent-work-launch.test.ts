import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateReviewBudget, routeSpecializedReviews } from '../../src/agent-work/services/scoped-review.js';

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

    it('should include security review if security gate is present', () => {
      const pkg = { securityGate: 'required' };
      const reviews = routeSpecializedReviews(pkg);
      assert.ok(reviews.includes('security'));
    });
  });
});
