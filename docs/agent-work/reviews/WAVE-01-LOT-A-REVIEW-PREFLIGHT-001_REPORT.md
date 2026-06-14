# Wave 01 Lote A Review Preflight

Status: **LOT_A_REVIEWS_BLOCKED**

## Verified

- PR #169 head `cca86210e5c1d5c1a34662f754f59fc07a1efeea` is contained in `main`.
- PR #170 head `a56020e0ab191140f9973c92684f2bc47e750b48` is contained in `main`.
- `integration/wave-01` exists, but both PRs were merged directly into `main`.
- The requested diffs exist locally.

## Blocking Reasons

- No Activity Receipt exists for `PKG-SHARED-CONTRACTS-001` matching base/head `81ab46caee3c7296dfb48b4b19133f0fd287fe86..cca86210e5c1d5c1a34662f754f59fc07a1efeea`.
- No Activity Receipt exists for `PKG-OPERATION-DOCS-FOUNDATION-001` matching base/head `6695e5a84cfb77acf39fc73f43bd898df1265a95..a56020e0ab191140f9973c92684f2bc47e750b48`.
- Review Packages must not be created until those legitimate execution receipts exist.

No retrospective Activity Receipt was created. Runtime and Events remain blocked.

## Reviewer Infrastructure Repairs

- Parallel reviewers can claim a Review Package while its aggregate status is `in_review`.
- An approval no longer marks the Review Package approved before every required review type is approved.
- Decision JSON must account for every changed file.
- Approval requires real `testsVerified` and forbids non-empty `requiredChanges`.
- Review Kit generation requires an active matching review claim.
- Released or expired claims are not accepted as active claims.
