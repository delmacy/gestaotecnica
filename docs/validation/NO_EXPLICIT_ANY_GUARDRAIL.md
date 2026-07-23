# No Explicit Any Guardrail

The repository blocks new explicit TypeScript `any` in changed `.ts` and `.tsx` files.

## Commands

- `npm run check:no-explicit-any`: fail on changed TypeScript files that introduce explicit `any`.
- `npm run check:no-explicit-any:fix`: mechanical first-pass replacement on offending lines only, then rerun `npm run check:no-explicit-any` and `npx tsc --noEmit`.

## Blocked Patterns

The scanner uses the TypeScript AST where possible and also blocks common escape hatches:

- `as any`
- `<any>value`
- `: any`
- `?: any`
- `any[]`
- `readonly any[]`
- `Array<any>`
- `ReadonlyArray<any>`
- `Promise<any>`
- `Record<string, any>`
- `Map<string, any>`
- generic constraints/defaults using `any`
- type aliases to `any`
- return types using `any`
- property and parameter annotations using `any`
- `satisfies any`
- `z.any()`
- `eslint-disable @typescript-eslint/no-explicit-any`
- JSDoc `@type {any}`, `@param {any}`, or `@returns {any}`

## Preferred Replacements

Use the narrowest safe type:

1. Domain DTO or existing interface.
2. Schema-inferred type, for example `z.infer<typeof Schema>`.
3. Generic type parameter.
4. Discriminated union.
5. `Record<string, unknown>` for object bags.
6. `unknown` for truly unknown input.
7. `z.unknown()` for schema boundaries that intentionally accept unknown payloads.

Do not replace `any` with `unknown` and then bypass the compiler. Narrow first with runtime checks, schema parsing, or local type guards.

## Exception

`explicit-any-ok` may be placed on the same line only for:

- Scanner test fixtures that intentionally contain forbidden examples.
- A documented boundary shim where the upstream library exposes `any` and the line immediately narrows or validates the value.

Every exception must be rare, local, and justified in the PR body. Jules must stop with a blocker instead of adding a broad exception or an ESLint disable.
