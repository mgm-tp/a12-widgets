/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * See the repository LICENSE files for the full dual-license text.
 */

/*
 * Generates the widgets-core type declaration rollup that feeds Monaco's IntelliSense in the live
 * code runner / playground (see src/helpers/lazy-editor.tsx -> addExtraLib).
 *
 * api-extractor flattens widgets-core's ~1300 per-file .d.ts into a single rollup we can hand to the
 * Monaco TypeScript worker as a virtual node_modules entry. It reads core's built `lib/index.d.ts`,
 * so core must be compiled first. In `pnpm -r compile` this is guaranteed — the showcase depends on
 * widgets-core, so pnpm builds core before it runs this script.
 *
 * This runs as part of `prepare:showcase-assets` (build pipeline), so it must NEVER break the build:
 * if core isn't built or api-extractor fails (e.g. a showcase-only build), we fall back to a small
 * stub. With the stub the editor still works — it just won't offer widgets-core autocomplete until a
 * full `pnpm compile` (or a manual run of this script) regenerates the rollup.
 *
 * Usage: pnpm -F @com.mgmtp.a12.widgets/widgets-showcase-redesign gen:widgets-core-types
 */

import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const CORE_DIR = resolve(SCRIPT_DIR, "../../core");
const CORE_ENTRY = resolve(CORE_DIR, "lib/index.d.ts");
const ROLLUP_SOURCE = resolve(CORE_DIR, "temp/widgets-core.rollup.d.ts");
const OUTPUT = resolve(SCRIPT_DIR, "../src/generated/widgets-core.d.ts.txt");

/** Writes the "not generated" stub so the build never breaks and the editor still loads. */
function writeStub(reason) {
	mkdirSync(dirname(OUTPUT), { recursive: true });
	writeFileSync(
		OUTPUT,
		"// widgets-core type rollup not generated.\n" +
			"// Run `pnpm gen:widgets-core-types` (after `pnpm -F widgets-core compile`) for widgets API autocomplete.\n"
	);
	console.warn(
		`widgets-core type rollup skipped (${reason}) — wrote a stub. Editor loads without widgets-core autocomplete.`
	);
}

// A stub is only acceptable as a fallback, never a downgrade: if a real rollup already exists (e.g. a
// developer generated it), keep it rather than clobbering it when core happens to be unbuilt.
if (!existsSync(CORE_ENTRY)) {
	if (existsSync(OUTPUT)) {
		console.log("widgets-core not built; keeping the existing rollup.");
		process.exit(0);
	}
	writeStub("core not built — missing lib/index.d.ts");
	process.exit(0);
}

try {
	console.log("Running api-extractor to roll up widgets-core declarations…");
	execFileSync("pnpm", ["exec", "api-extractor", "run", "--local", "-c", "api-extractor.dts-rollup.json"], {
		cwd: CORE_DIR,
		stdio: "inherit",
		shell: process.platform === "win32"
	});

	mkdirSync(dirname(OUTPUT), { recursive: true });
	copyFileSync(ROLLUP_SOURCE, OUTPUT);

	console.log(`Wrote widgets-core type rollup to ${OUTPUT}`);
} catch (error) {
	if (existsSync(OUTPUT)) {
		console.warn(`api-extractor failed (${error?.message ?? error}); keeping the existing rollup.`);
		process.exit(0);
	}
	writeStub(`api-extractor failed: ${error?.message ?? error}`);
}
