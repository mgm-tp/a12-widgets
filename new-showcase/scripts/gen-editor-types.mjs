/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * See the repository LICENSE files for the full dual-license text.
 */

/*
 * Bundles the .d.ts of the packages the playground exposes (react + csstype + styled-components) into
 * a single manifest fed to Monaco's TypeScript worker (see src/helpers/lazy-editor.tsx). Together with
 * the widgets-core rollup this lets the editor offer real autocomplete and type-checking for the
 * imports available in live mode.
 *
 * Only node_modules is required (always present after install), so this runs as part of
 * `prepare:showcase-assets`. Leaf externals that the bundled types merely reference (stylis, the
 * @emotion helpers, react-dom/server) are shimmed as `any` so the graph resolves without pulling them.
 *
 * Output: src/generated/editor-types.json — [{ path, content }] (gitignored, regenerated on prepare).
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SHOWCASE_DIR = resolve(SCRIPT_DIR, "..");
const OUTPUT = resolve(SHOWCASE_DIR, "src/generated/editor-types.json");
const require = createRequire(join(SHOWCASE_DIR, "noop.js"));

/** @type {{ path: string; content: string }[]} */
const entries = [];

function addFile(virtualPath, content) {
	entries.push({ path: virtualPath, content });
}

/** Recursively add every .d.ts under `pkgDir`, mapped to file:///node_modules/<virtualBase>/<rel>. */
function addDtsTree(pkgDir, virtualBase) {
	const walk = (dir) => {
		for (const name of readdirSync(dir)) {
			const full = join(dir, name);

			if (statSync(full).isDirectory()) {
				walk(full);
			} else if (name.endsWith(".d.ts")) {
				const rel = relative(pkgDir, full).split(sep).join("/");
				addFile(`file:///node_modules/${virtualBase}/${rel}`, readFileSync(full, "utf8"));
			}
		}
	};

	walk(pkgDir);
}

/** Resolve a package directory, tolerating both the flat node_modules and the pnpm store layout. */
function resolvePkgDir(spec, fromDir = SHOWCASE_DIR) {
	try {
		const req = createRequire(join(fromDir, "noop.js"));

		return dirname(req.resolve(`${spec}/package.json`));
	} catch {
		// pnpm keeps transitive deps only in the store; scan it as a fallback.
		return resolveFromPnpmStore(spec);
	}
}

/** Find a package inside `<root>/node_modules/.pnpm/<name>@<version>/node_modules/<name>`. */
function resolveFromPnpmStore(spec) {
	const prefix = `${spec.replace("/", "+")}@`;

	for (const root of [SHOWCASE_DIR, resolve(SHOWCASE_DIR, "..")]) {
		const store = join(root, "node_modules/.pnpm");

		if (!existsSync(store)) {
			continue;
		}

		const match = readdirSync(store).find((name) => name.startsWith(prefix));

		if (match) {
			const dir = join(store, match, "node_modules", spec);

			if (existsSync(join(dir, "package.json"))) {
				return dir;
			}
		}
	}

	throw new Error(`Cannot locate package "${spec}" in node_modules or the pnpm store`);
}

try {
	// react — resolved from @types/react so its exact `csstype` dependency comes along.
	const typesReactDir = resolve(SHOWCASE_DIR, "node_modules/@types/react");

	if (!existsSync(typesReactDir)) {
		throw new Error("@types/react not found");
	}

	addDtsTree(typesReactDir, "@types/react");

	// csstype — referenced by @types/react (and styled-components); resolve from @types/react's context.
	addDtsTree(resolvePkgDir("csstype", typesReactDir), "csstype");

	// styled-components ships its own types (dist/**), with package.json#types pointing the resolver at them.
	const styledDir = resolvePkgDir("styled-components");

	addFile("file:///node_modules/styled-components/package.json", readFileSync(join(styledDir, "package.json"), "utf8"));
	addDtsTree(join(styledDir, "dist"), "styled-components/dist");

	// Leaf externals the bundled types reference but users never author against — shim as `any` so the
	// type graph resolves cleanly instead of surfacing "cannot find module" errors.
	addFile(
		"file:///node_modules/@playground/external-shims.d.ts",
		[
			'declare module "stylis";',
			'declare module "@emotion/is-prop-valid";',
			'declare module "@emotion/memoize";',
			'declare module "react-dom/server";'
		].join("\n")
	);

	mkdirSync(dirname(OUTPUT), { recursive: true });
	writeFileSync(OUTPUT, JSON.stringify(entries));

	console.log(`Wrote editor type bundle (${entries.length} files) to ${OUTPUT}`);
} catch (error) {
	// Never break the build over editor niceties: fall back to an empty bundle (the editor still works,
	// it just won't offer react/styled-components autocomplete until this succeeds).
	mkdirSync(dirname(OUTPUT), { recursive: true });
	writeFileSync(OUTPUT, "[]");
	console.warn(`Editor type bundle skipped (${error instanceof Error ? error.message : error}); wrote empty bundle.`);
}
