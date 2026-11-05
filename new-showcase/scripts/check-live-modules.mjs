/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * See the repository LICENSE files for the full dual-license text.
 */

/*
 * Parity check for the playground module registry.
 *
 * Every showcase example file that is shown as code (imported with `?raw`) can be opened in the
 * playground, where its imports are resolved against the registry in `src/helpers/live-runner-modules.ts`.
 * If an example imports a package that is not registered, the playground breaks at runtime with
 * "Module ... is not available in live mode" — but the static example keeps working, so the drift is
 * easy to miss. This script fails the build when an example imports an unregistered package.
 *
 * Type-only imports (`import type ...`) are ignored: sucrase strips them, so they never hit `require`.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = resolve(SCRIPT_DIR, "../src");
// The playground sandbox resolves example imports against this single registry.
const REGISTRY_SOURCES = [{ file: resolve(SRC_DIR, "helpers/live-runner-modules.ts"), variable: "registry" }];

/** Recursively collect every .ts/.tsx file under a directory. */
function collectSourceFiles(dir) {
	const files = [];

	for (const entry of readdirSync(dir)) {
		const full = resolve(dir, entry);

		if (statSync(full).isDirectory()) {
			files.push(...collectSourceFiles(full));
		} else if (/\.tsx?$/.test(full)) {
			files.push(full);
		}
	}

	return files;
}

/** Extracts the set of module specifiers registered across the live-runner registry objects. */
function readRegisteredSpecifiers() {
	const specifiers = new Set();

	for (const { file, variable } of REGISTRY_SOURCES) {
		const source = readFileSync(file, "utf8");
		const block = source.match(new RegExp(`${variable}[^{]*\\{([\\s\\S]*?)\\n};`));

		if (!block) {
			throw new Error(`Could not locate the \`${variable}\` object in ${file}`);
		}

		// Top-level entries are indented by exactly one tab: `\t"@scope/pkg":` or `\treact:`.
		const keyPattern = /^\t(?:"([^"]+)"|([A-Za-z0-9@_-]+)):/gm;
		let match;

		while ((match = keyPattern.exec(block[1])) !== null) {
			specifiers.add(match[1] ?? match[2]);
		}
	}

	return specifiers;
}

/** Finds the example source files (those imported elsewhere via `?raw`). */
function collectExampleFiles(allFiles) {
	const rawImport = /from\s+["']!?([^"']+?\.tsx?)\?raw["']/g;
	const examples = new Set();

	for (const file of allFiles) {
		const source = readFileSync(file, "utf8");
		let match;

		while ((match = rawImport.exec(source)) !== null) {
			examples.add(resolve(dirname(file), match[1]));
		}
	}

	return [...examples];
}

/** Extracts the runtime (non-type) bare import specifiers from a source file. */
function extractBareImports(source) {
	const specifiers = new Set();
	const lines = source.split(/\r?\n/);

	for (const line of lines) {
		if (/^\s*import\s+type\b/.test(line)) {
			continue; // type-only import — stripped by sucrase, never required at runtime
		}

		const fromMatch = line.match(/(?:from|import)\s+["']([^"'?]+)["']/);

		if (!fromMatch) {
			continue;
		}

		const specifier = fromMatch[1];

		// Relative imports are resolved separately (helpers); CSS side-effect imports are no-ops in
		// live mode (see resolveFromRegistry). Skip both.
		if (!specifier.startsWith(".") && !specifier.startsWith("/") && !specifier.endsWith(".css")) {
			specifiers.add(specifier);
		}
	}

	return specifiers;
}

function main() {
	const registered = readRegisteredSpecifiers();
	const allFiles = collectSourceFiles(SRC_DIR);
	const exampleFiles = collectExampleFiles(allFiles);
	const missing = [];

	for (const file of exampleFiles) {
		let source;

		try {
			source = readFileSync(file, "utf8");
		} catch {
			continue; // referenced ?raw file no longer exists — not this check's concern
		}

		for (const specifier of extractBareImports(source)) {
			if (!registered.has(specifier)) {
				missing.push({ file: relative(SRC_DIR, file), specifier });
			}
		}
	}

	console.log(
		`live-runner parity: scanned ${exampleFiles.length} example files against ${registered.size} registered modules.`
	);

	if (missing.length > 0) {
		console.error(`\n✖ ${missing.length} import(s) used by live-toggleable examples are NOT registered:\n`);

		for (const { file, specifier } of missing) {
			console.error(`  ${file}  →  "${specifier}"`);
		}

		console.error(`\nRegister them in src/helpers/live-runner-modules.ts (or they will break in live mode).`);
		process.exit(1);
	}

	console.log("✓ all example imports are available in live mode.");
}

main();
