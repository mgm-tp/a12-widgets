# atlaskit-repack

Republishes the `@atlaskit/pragmatic-drag-and-drop*` packages under our own scope
(`@com.mgmtp.a12.widgets/pragmatic-drag-and-drop*`) with a proper `exports` field added,
because the upstream packages break under Node's native ESM resolution (SSR,
Vitest in node mode). Upstream has known about it since April 2024 and not fixed it:
<https://github.com/atlassian/pragmatic-drag-and-drop/issues/27>.

## What it does — and deliberately does not do

This is **not a source fork**. The script downloads the published upstream tarballs and:

1. Rescopes the package names (`@atlaskit/…` → `@com.mgmtp.a12.widgets/…`) everywhere,
   including inter-package dependencies and import specifiers inside `dist/`, so the
   forks depend on each other and never pull the unpatched originals back in.
2. Generates an `exports` map mechanically from the entry-point stub folders that
   upstream already ships (e.g. `element/adapter/package.json`) — nothing is hand-maintained.
3. Adds a provenance marker (`"a12": { "repackagedFrom": … }`) and a README banner.
   The Apache-2.0 `LICENSE` file is retained unchanged (required for redistribution).

No source code is modified. Fork versions mirror upstream versions exactly.

### Built-in smoke test

Publishing is gated on a smoke test that runs automatically between transform and
publish (also on `--dry-run`): the transformed packages are packed and installed into a
throwaway consumer, then **every** exports subpath is loaded via native `import()` and
`require()`. The named exports widgets actually uses (pinned under `smokeTest` in
[config.json](config.json)) must additionally resolve to functions — extend that list when
new pragmatic-dnd imports are added to `core/src`. If anything fails, nothing is published.

### Resolution behavior after repack

| Consumer                        | Resolves via              | Result                                           |
| ------------------------------- | ------------------------- | ------------------------------------------------ |
| Bundlers (Vite/webpack/Rollup)  | `module` export condition | ESM build — identical to today                   |
| Node native ESM (SSR, Vitest)   | `import` condition        | CJS build — **fixed** (was ERR_MODULE_NOT_FOUND) |
| Node `require()`                | `require` condition       | CJS build — identical to today                   |
| TypeScript (`bundler`/`node16`) | `types` condition         | identical to today                               |

`import` intentionally points at CJS: upstream's ESM output uses extensionless internal
imports that Node cannot resolve. Named imports still work via Node's cjs-module-lexer.

## Updating to a new upstream version

1. Bump the versions in [config.json](config.json).
2. Verify locally (no credentials needed): `node repack.mjs --dry-run`
   — inspect the printed exports subpaths and the transformed packages in the work dir.
   If upstream restructured entry points, the generated map follows automatically;
   review the diff of subpaths in the dry-run output.
3. Merge, then trigger the **repack-atlaskit** Jenkins job (see below).
4. In a follow-up PR, bump the three `@com.mgmtp.a12.widgets/pragmatic-drag-and-drop*`
   dependencies in `core/package.json`.

## Registry handling

Gradle is the leading tool: the `repackAtlaskit` task in the root `build.gradle` supplies
the publish registry via `REPACK_PUBLISH_REGISTRY`, computed by the `a12Publish` plugin
(`ArtifactRepo.NPM` + `ArtifactType.COMMUNITY`, release-line aware) — the same registry
`publishNpmPackages` uses, so the forks land next to our other packages.

No registry URL is hardcoded anywhere: the publish registry arrives via
`REPACK_PUBLISH_REGISTRY`, while upstream tarballs and public dependencies are fetched
through npm's configured default registry — in CI the managed `npmrc` (Artifactory npm
proxy), locally your `~/.npmrc`. `REPACK_UPSTREAM_REGISTRY` exists as an optional
override for the upstream fetch.

Local dry runs don't need any of that: `node repack.mjs --dry-run` works without Gradle,
credentials, or registry access (the existence check then runs against your default
registry, where our scope's forks don't exist — every package is simply treated as
unpublished).

## Jenkins job

The pipeline is defined in [`JenkinsfileAtlaskitRepack`](../../JenkinsfileAtlaskitRepack)
at the repository root — a separate, manually triggered job, not part of the regular
build pipeline. It runs `gradle repackAtlaskit` with the same wiring as the release job:
artifactory credentials (internal plugin resolution), the `gradle-settings` init script,
and the managed `npmrc` (npm publish auth). No `pnpm install` — the script itself uses
only Node ≥ 18, `npm`, and `tar`.

**One-time setup** (CI owner): create a new pipeline job pointing at this repository,
branch `master`, script path `JenkinsfileAtlaskitRepack`.

**Parameters**:

- `dryRun` (default **on**): transform + smoke test + `npm publish --dry-run`, nothing
  is uploaded. Run once with it on to validate, then re-run with it off to publish.
- `force`: repack even if the target versions already exist in the registry.

The script is idempotent: already-published versions are skipped (`npm view` check),
so re-running the job is always safe. Publish order is handled (core package first,
then `-hitbox` / `-auto-scroll`), and a failing smoke test aborts before anything
is published.

Registry prerequisite: the `npmrc` credential must be allowed to publish the new package
names `@com.mgmtp.a12.widgets/pragmatic-drag-and-drop*` (check Artifactory package-name
restrictions).

## Retiring the fork

When upstream ships an `exports` field (watch issue #27), switch `core/package.json`
back to `@atlaskit/*`, delete this directory, and note the change in `core/CHANGELOG.md`.
