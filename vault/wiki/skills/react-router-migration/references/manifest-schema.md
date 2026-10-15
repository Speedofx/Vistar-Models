# Migration manifest schema

Load this file before you read
`vault/wiki/skills/react-router-migration/references/migration-manifest.json`.

The file is generated JSON with two top-level objects: `web` and `api`.

## Path remapping

The backend wrote this file before cutover. Remap every path you read:

| Manifest prefix | Live path after cutover |
| --------------- | ----------------------- |
| `apps/web/` | `.migration/web-old/` |
| `apps/web-new/` | `apps/web/` |
| `apps/api/` | `.migration/api-old/` |

Example: `web.files[].sourcePath` `apps/web/src/pages/Home.jsx` is now
`.migration/web-old/src/pages/Home.jsx`.
`web.files[].targetPath` `apps/web-new/src/components/Home.jsx` is now
`apps/web/src/components/Home.jsx`.

`web.routes[].sourceComponent`, `importClosure`, and warning `sourcePath`
values use the same remapping.

## Header fields

Both `web` and `api` carry the same header.

| Field | Use |
| ----- | --- |
| `schemaVersion` | Ignore unless it is missing. |
| `sourceTemplate`, `sourceTemplateVersion` | Template the archived app was built from. |
| `targetTemplate`, `targetTemplateVersion` | Template now in `apps/web/`. |

## `web`

| Field | Use |
| ----- | --- |
| `files[]` | Copy map: `sourcePath`, `targetPath`, `disposition`, `reason`. `targetPath` is omitted when the file stays in the archive. |
| `files[].disposition` | `stage-source` — staged for you to port. `copy-asset` — copied as is. `replace-with-target` — the target template ships its own version; do not port it. `skip-generated` — build output. `needs-review` — unreadable, symlinked, or colliding; read the archive. |
| `files[].imports` | Every import specifier in the file, local and package. Rewrite the local ones after flatten. May be empty — grep imports in the staged file. |
| `files[].ssrRisks[]` | Browser APIs that break SSR: `category`, `name`, `line`, `column`, `context` (`module-scope`, `render`, `hook-initializer`, `effect`, `event-handler`, `method`, `unknown`), `severity`, `evidence`, and `heuristic` when the match is a guess. Fix each `high` and `medium` risk. May be empty — grep `window`, `document`, and `localStorage` under `src/`. |
| `routes[]` | Public pages to assemble. `path`, `index`, `sourceComponent`, `importClosure`, `confidence`, `findings`. May be empty — derive from `.migration/web-old/src/App.jsx`. |
| `dependencies` | See [Dependency plan](#dependency-plan). Do not re-add `react-router-dom`. |
| `warnings[]` | Review items. Resolve or record why you skipped them. See [Warning codes](#warning-codes). |

Route `confidence`:

- `static` — assemble the page from `sourceComponent` and `importClosure`.
- `partial` — assemble what you can. Read the archive for the rest.
- `unsupported` — inspect the archive. Do not skip a visible page.

## `api`

| Field | Use |
| ----- | --- |
| `files[]` | Express modules and shared libs: `sourcePath`, `targetPath`, `disposition`, `reason`. |
| `files[].disposition` | `convert` — staged for you to port. `covered-by-target` — the target template already provides it; do not port it. `skip-generated` — build output. `needs-review` — read the archive. |
| `files[].targetPath` | Where a `convert` file was staged: routes and modified shipped files under `apps/web/src/migration-source/`, server modules under `apps/web/src/lib/*.server.*`, constants under `apps/web/src/constants/`, static JSON under `apps/web/src/data/`. |
| `endpoints[]` | `method` (`USE` for a mount that could not be followed), `path`, `sourcePath`, `middleware`, `targetUrlPath`, `suggestedTargetFile`, `coveredByTarget`, `confidence`, `findings`. Recreate each endpoint where `coveredByTarget` is `false` as a resource route. `targetUrlPath` and `suggestedTargetFile` are omitted for pattern paths. |
| `env.carryOver` | Keys already appended to `apps/web/.env`. Values are never in the manifest. |
| `env.dropped` | Keys that no longer apply once the API runs in-process (`PORT`, `CORS_ORIGIN`, …). |
| `env.referencedInConvertedCode` | `process.env` keys the files you convert read. |
| `dependencies` | See [Dependency plan](#dependency-plan). The API packages in `preserve` are already in `apps/web/package.json`. |
| `warnings[]` | Review items for auth, middleware, and unmatched files. See [Warning codes](#warning-codes). |

Filter on `files[].disposition`, not on `reason` — `reason` is free text.

## Dependency plan

`web.dependencies` and `api.dependencies` have the same shape. Cutover already
merged `apps/web/package.json`; nothing has to be moved by hand.

| Field | Meaning |
| ----- | ------- |
| `preserve` | Kept. Already in `apps/web/package.json`, at the template's version when the template declares it too. |
| `replace` | Replaced by the framework (`react-router-dom`, `react-helmet`). Rewrite their imports. |
| `managedByTarget` | The target template pins its own version. Do not change it. |
| `remove` | Dropped. Delete any import that still uses it. |
| `unresolved` | Import specifiers that matched neither a source file nor a declared package. Check each one before you rewrite it. |

## Warning codes

| Code | Action |
| ---- | ------ |
| `routes-not-extracted`, `unsupported-route` | Derive the page from the archived `App.jsx`. |
| `endpoints-not-extracted`, `missing-routes-index`, `unreadable-router`, `unresolved-router-mount`, `unsupported-endpoint`, `duplicate-router-mount` | The endpoint inventory is incomplete for that module. Read it in `.migration/api-old/`. |
| `modified-shipped-file` | Port the user's change onto the target template's equivalent. |
| `removed-dependency-import` | Rewrite the import; the package is gone. |
| `sse-streaming`, `websocket-usage`, `scheduled-job`, `static-file-serving` | Needs a design decision; resource routes do not cover it one to one. |
| `parse-error`, `analysis-skipped`, `unreadable-file`, `symlink`, `unresolved-import`, `invalid-package-json` | The file was not analysed. Read it directly. |
| `template-version-mismatch` | Shipped-file comparisons may be off. Diff with care. |

## Missing files

If a remapped path is absent, look in this order:

1. `apps/web/src/migration-source/`
2. `.migration/web-old/`
3. `.migration/api-old/`
