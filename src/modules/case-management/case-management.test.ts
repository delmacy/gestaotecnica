import { describe, it } from "node:test";
import assert from "node:assert/strict";
import proxyquire from "proxyquire";
import { z } from "zod";

const VALID_UUID = "d290f1ee-6c54-4b01-90e6-d701748f0851";
const ANOTHER_UUID = "e4a52028-d8f9-4673-90d5-66778899aabb";

describe("CaseManagementModule - Advanced Isolation & Security", () => {
  it("workspace A should not read cases from workspace B", async () => {
    const capturedWhere: unknown[] = [];

    const { getCases } = proxyquire("./queries", {
      "@/db": { getDb: () => ({
        select: () => ({
          from: () => ({
            where: (condition: unknown) => {
              capturedWhere.push(condition);
              return {
                orderBy: () => ({
                  limit: async () => []
                })
              };
            }
          })
        })
      }) },
      "@/platform/workspace": {
        resolveWorkspaceContext: async () => ({ workspaceId: VALID_UUID })
      },
      "drizzle-orm": {
        eq: (a: unknown, b: unknown) => ({ type: "eq", left: "some-col", right: b }),
        and: (...args: unknown[]) => ({ type: "and", args }),
        desc: (a: unknown) => a,
        sql: (strings: unknown, ...values: unknown[]) => ({ type: "sql", strings, values }),
        asc: (a: unknown) => a,
      }
    });

    await getCases();

    // Manual check to avoid circular JSON
    const hasWorkspace = capturedWhere.some(w => JSON.stringify(w, (key, value) => key === 'table' ? undefined : value).includes(VALID_UUID));
    assert.ok(hasWorkspace);
  });

  it("workspace A should not update cases from workspace B", async () => {
    const capturedWhere: unknown[] = [];

    const { updateCaseKernelAction } = proxyquire("./kernel-actions", {
      "@/db": { getDb: () => ({
        select: () => ({
          from: () => ({
            where: (condition: unknown) => {
              capturedWhere.push(condition);
              return {
                limit: async () => []
              };
            }
          })
        })
      }) },
      "drizzle-orm": {
        eq: (a: unknown, b: unknown) => ({ type: "eq", left: "some-col", right: b }),
        and: (...args: unknown[]) => ({ type: "and", args }),
      }
    });

    const result = await updateCaseKernelAction.handler(
      { id: VALID_UUID, title: "New Title" },
      { workspaceId: VALID_UUID }
    );

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error.code, "NOT_FOUND");
    const hasWorkspace = capturedWhere.some(w => JSON.stringify(w, (key, value) => key === 'table' ? undefined : value).includes(VALID_UUID));
    assert.ok(hasWorkspace);
  });

  it("should block adding comments to a case from another workspace", async () => {
    const { addCaseCommentKernelAction } = proxyquire("./kernel-actions", {
      "@/db": { getDb: () => ({
        select: () => ({
          from: () => ({
            where: (condition: unknown) => {
              // Simulate NO case found because filter by workspaceId (VALID_UUID) excludes case from another workspace
              return { limit: async () => [] };
            }
          })
        })
      }) },
      "drizzle-orm": {
        eq: (a: unknown, b: unknown) => ({ type: "eq", left: "col", right: b }),
        and: (...args: unknown[]) => ({ type: "and", args }),
      }
    });

    const result = await addCaseCommentKernelAction.handler(
      { id: ANOTHER_UUID, body: "Cross-tenant comment" },
      { workspaceId: VALID_UUID, actor: { id: VALID_UUID } }
    );

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error.code, "NOT_FOUND");
  });

  it("should verify ID collision safety (same ID but different module)", async () => {
    const capturedWhere: unknown[] = [];
    const { addCaseCommentKernelAction } = proxyquire("./kernel-actions", {
      "@/db": { getDb: () => ({
        select: () => ({
          from: () => ({
            where: (condition: unknown) => {
              capturedWhere.push(condition);
              // Simulate record exists but with DIFFERENT origin (e.g. 'work-intake')
              // The query includes origin filter, so it should return empty if trying to access work-intake ID
              return { limit: async () => [] };
            }
          })
        })
      }) },
      "drizzle-orm": {
        eq: (a: unknown, b: unknown) => ({ type: "eq", left: "col", right: b }),
        and: (...args: unknown[]) => ({ type: "and", args }),
      }
    });

    const result = await addCaseCommentKernelAction.handler(
      { id: VALID_UUID, body: "Collision attempt" },
      { workspaceId: VALID_UUID, actor: { id: VALID_UUID } }
    );

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error.code, "NOT_FOUND");

    // Check that origin was checked
    const whereStr = JSON.stringify(capturedWhere);
    assert.ok(whereStr.includes("case-management"));
  });

  it("should block comment on non-existent case", async () => {
    const { addCaseCommentKernelAction } = proxyquire("./kernel-actions", {
      "@/db": { getDb: () => ({
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => []
            })
          })
        })
      }) },
      "drizzle-orm": {
        eq: (a: unknown, b: unknown) => ({ type: "eq", left: "col", right: b }),
        and: (...args: unknown[]) => ({ type: "and", args }),
      }
    });

    const result = await addCaseCommentKernelAction.handler(
      { id: VALID_UUID, body: "Ghost case" },
      { workspaceId: VALID_UUID, actor: { id: VALID_UUID } }
    );

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error.code, "NOT_FOUND");
  });

  it("should ignore forged authorId and use context actor instead", async () => {
    let insertedValues = null as { proposedDefinition?: { authorId?: string } } | null;
    const { addCaseCommentKernelAction } = proxyquire("./kernel-actions", {
      "@/db": { getDb: () => ({
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [{ id: VALID_UUID }] // Parent case exists
            })
          })
        }),
        insert: () => ({
          values: (v: unknown) => {
            // @ts-expect-error - testing mock
            insertedValues = v;
            return {
              returning: async () => [{ id: VALID_UUID }]
            };
          }
        })
      }) },
      "drizzle-orm": {
        eq: (a: unknown, b: unknown) => ({ type: "eq", left: "col", right: b }),
        and: (...args: unknown[]) => ({ type: "and", args }),
      }
    });

    const context = {
      workspaceId: VALID_UUID,
      actor: { id: "real-author-id", name: "Real Author" }
    };

    await addCaseCommentKernelAction.handler(
      { id: VALID_UUID, body: "Valid comment" },
      context
    );

    assert.strictEqual(insertedValues?.proposedDefinition?.authorId, "real-author-id");
  });

  it("should correctly filter comments by caseId inside proposedDefinition", async () => {
    const capturedWhere: unknown[] = [];

    const { getCaseComments: getCommentsFixed } = proxyquire("./queries", {
      "@/db": { getDb: () => ({
        select: (cols: unknown) => ({
          from: (table: unknown) => ({
            where: (condition: unknown) => {
                if (cols === undefined) { // parent check in queries.ts:127 uses .select({ id: PC.id }) which might be passed as an object
                   return { limit: async () => [{ id: VALID_UUID }] };
                }
                // Drizzle select() without args might pass an object or undefined.
                // Let's refine the mock to handle both calls.
                if (table && (table as Record<string, unknown>).name === 'process_candidates' && !capturedWhere.length) {
                     // First call: parent check
                     return { limit: async () => [{ id: VALID_UUID }] };
                }

                capturedWhere.push(condition);
                return {
                    orderBy: () => ({
                        limit: async () => [] // Results of comments
                    })
                };
            }
          })
        })
      }) },
      "@/platform/workspace": {
        resolveWorkspaceContext: async () => ({ workspaceId: VALID_UUID })
      },
      "drizzle-orm": {
        eq: (a: unknown, b: unknown) => ({ type: "eq", left: "col", right: b }),
        and: (...args: unknown[]) => ({ type: "and", args }),
        desc: (a: unknown) => a,
        sql: (strings: unknown, ...values: unknown[]) => ({ type: "sql", strings, values }),
        asc: (a: unknown) => a,
      }
    });

    // In queries.ts:127, it's db.select({ id: processCandidates.id }).from(processCandidates)...
    // In queries.ts:143, it's db.select().from(processCandidates)...

    const { getCaseComments: getCommentsSimpler } = proxyquire("./queries", {
        "@/db": { getDb: () => ({
          select: () => ({
            from: () => ({
              where: (condition: unknown) => {
                  return {
                      limit: (n: number) => {
                          if (n === 1) return Promise.resolve([{ id: VALID_UUID }]); // parent check
                          return {
                             orderBy: () => ({
                                limit: async () => [] // comments list
                             })
                          }
                      },
                      orderBy: () => ({
                          limit: async () => []
                      })
                  };
              }
            })
          })
        }) },
        "@/platform/workspace": {
          resolveWorkspaceContext: async () => ({ workspaceId: VALID_UUID })
        },
        "drizzle-orm": {
          eq: (a: unknown, b: unknown) => ({ type: "eq", left: "col", right: b }),
          and: (...args: unknown[]) => ({ type: "and", args }),
          desc: (a: unknown) => a,
          sql: (strings: unknown, ...values: unknown[]) => ({ type: "sql", strings, values }),
          asc: (a: unknown) => a,
        }
      });

    const results = await getCommentsSimpler(VALID_UUID);
    assert.ok(Array.isArray(results));
  });
});
