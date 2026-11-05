/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

/**
 * Repackages @atlaskit/pragmatic-drag-and-drop* under our own scope with a
 * proper `exports` field, so Node's native ESM resolution works (SSR, Vitest).
 * Upstream tracking issue: https://github.com/atlassian/pragmatic-drag-and-drop/issues/27
 *
 * Runs in three phases: transform all packages, smoke-test the transformed
 * tarballs (every exports subpath via native `import()` and `require()`, plus
 * the named exports pinned in config.json), and only then publish. A failing
 * smoke test aborts before anything is published.
 *
 * See README.md in this directory for the full workflow.
 *
 * Usage:  node repack.mjs [--dry-run] [--force]
 *   --dry-run  transform + smoke-test + `npm publish --dry-run`; keeps the work dir
 *   --force    repack even if the target version already exists in the registry
 *
 * Registries are never hardcoded: upstream tarballs and public dependencies are
 * fetched via npm's configured default registry (in CI the managed npmrc, i.e.
 * the Artifactory npm proxy; locally your ~/.npmrc).
 *
 * Env:    REPACK_PUBLISH_REGISTRY   target registry for publish + existence check
 *                                   (set by the repackAtlaskit Gradle task from a12Publish)
 *         REPACK_UPSTREAM_REGISTRY  optional override for fetching the upstream tarballs
 *
 * Requires only Node >= 18, npm, and tar. No install step.
 */

/* oxlint-disable no-console -- console is the user-facing output of this CLI script */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(path.join(here, "config.json"), "utf8"));

const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");

const upstreamRegistry = process.env.REPACK_UPSTREAM_REGISTRY || "";
const upstreamRegistryArgs = upstreamRegistry ? ["--registry", upstreamRegistry] : [];
const publishRegistry = process.env.REPACK_PUBLISH_REGISTRY || "";
const publishRegistryArgs = publishRegistry ? ["--registry", publishRegistry] : [];

// Longest names first, so "@atlaskit/pragmatic-drag-and-drop" never matches
// the prefix of "@atlaskit/pragmatic-drag-and-drop-hitbox" during rewrite.
const renames = Object.keys(config.packages)
	.map((name) => [name, `${config.scope}/${name.split("/")[1]}`])
	.sort((a, b) => b[0].length - a[0].length);

const rescope = (text) => {
	let result = text;

	for (const [from, to] of renames) {
		result = result.replaceAll(from, to);
	}

	return result;
};

const TEXT_EXTENSIONS = new Set([".js", ".mjs", ".cjs", ".ts", ".tsx", ".json", ".md", ".map", ".flow"]);

function npm(args, opts = {}) {
	return execFileSync("npm", args, {
		encoding: "utf8",
		stdio: ["ignore", "pipe", "pipe"],
		...opts
	});
}

function isPublished(name, version) {
	try {
		// Exit 0 with empty output means the package exists but not this version.
		return npm(["view", `${name}@${version}`, "version", ...publishRegistryArgs]).trim() !== "";
	} catch (error) {
		if (String(error.stderr).includes("E404")) {
			return false;
		}

		console.error(
			`Existence check for ${name}@${version} against ${publishRegistry || "the default npm registry"} failed — ` +
				`for E401/E403 check the registry credentials (in CI: the managed npmrc).`
		);
		throw error;
	}
}

/** Recursively collect entry-point stub directories (dirs outside dist/ containing a package.json). */
function findStubDirs(root, relative = "") {
	const stubs = [];

	for (const entry of readdirSync(path.join(root, relative), {
		withFileTypes: true
	})) {
		if (!entry.isDirectory() || entry.name === "dist" || entry.name === "node_modules") {
			continue;
		}

		const child = relative ? `${relative}/${entry.name}` : entry.name;

		if (readdirSync(path.join(root, child)).includes("package.json")) {
			stubs.push(child);
		}

		stubs.push(...findStubDirs(root, child));
	}

	return stubs;
}

/**
 * Build one exports entry from a (root or stub) package.json.
 *
 * "module" (honored by webpack/Vite/rollup-node-resolve) points at the ESM
 * build, so bundler behavior is identical to pre-fork resolution via the
 * top-level "module" field. "import" deliberately points at CJS: upstream's
 * ESM output uses extensionless internal imports, which Node cannot resolve.
 * Node picks up Babel-style named exports from the CJS via cjs-module-lexer.
 */
function exportsEntry(pkg, subdir) {
	const normalize = (p) => `./${path.posix.normalize(path.posix.join(subdir, p))}`;
	const cjs = normalize(pkg.main);
	const entry = {};

	if (pkg.types) {
		entry.types = normalize(pkg.types);
	}

	if (pkg.module) {
		entry.module = normalize(pkg.module);
	}

	entry.import = cjs;
	entry.require = cjs;
	entry.default = cjs;

	return entry;
}

function walkFiles(dir) {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);

		return entry.isDirectory() ? walkFiles(full) : [full];
	});
}

function rewritePackageNames(root) {
	for (const file of walkFiles(root)) {
		if (!TEXT_EXTENSIONS.has(path.extname(file))) {
			continue;
		}

		const original = readFileSync(file, "utf8");
		const rewritten = rescope(original);

		if (rewritten !== original) {
			writeFileSync(file, rewritten);
		}
	}
}

/** Download, rescope and add the exports map. Returns null when the target version is already published. */
function transformPackage(upstreamName, version, workDir) {
	const targetName = rescope(upstreamName);
	const label = `${targetName}@${version}`;

	if (!force && isPublished(targetName, version)) {
		console.log(`✓ ${label} already published — skipping`);

		return null;
	}

	console.log(`… repacking ${upstreamName}@${version} → ${label}`);
	const dir = path.join(workDir, upstreamName.split("/")[1]);
	mkdirSync(dir, { recursive: true });

	const tarball = npm(["pack", `${upstreamName}@${version}`, "--pack-destination", dir, ...upstreamRegistryArgs], {
		cwd: dir
	})
		.trim()
		.split("\n")
		.pop();
	execFileSync("tar", ["-xzf", path.join(dir, tarball), "-C", dir]);
	const root = path.join(dir, "package");

	// Rescope every reference (package name, dependencies, dist imports, .d.ts,
	// stub package.jsons) in one pass, so the forks depend on each other and
	// never pull the unpatched originals back in transitively.
	rewritePackageNames(root);

	const pkgPath = path.join(root, "package.json");
	const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

	const exportsMap = { ".": exportsEntry(pkg, "") };

	for (const stub of findStubDirs(root).sort()) {
		const stubPkg = JSON.parse(readFileSync(path.join(root, stub, "package.json"), "utf8"));
		exportsMap[`./${stub}`] = exportsEntry(stubPkg, stub);
	}

	exportsMap["./package.json"] = "./package.json";

	pkg.exports = exportsMap;
	pkg.a12 = { repackagedFrom: `${upstreamName}@${version}` };
	writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

	const readmePath = path.join(root, "README.md");
	const banner =
		`> **Note**: repackaged \`${upstreamName}@${version}\` (Apache-2.0) with an added ` +
		`\`exports\` field for Node ESM compatibility. Only \`package.json\` metadata was modified ` +
		`and package names rescoped; see \`tools/atlaskit-repack\` in the a12-widgets repository. ` +
		`Original LICENSE retained.\n\n`;
	writeFileSync(readmePath, banner + readFileSync(readmePath, "utf8"));

	console.log(`  exports subpaths: ${Object.keys(exportsMap).join(", ")}`);

	return { targetName, version, root, exportsMap };
}

/**
 * Install the transformed packages as packed tarballs into a throwaway
 * consumer and verify every exports subpath loads under Node's native ESM
 * resolution (`import()`) and CJS (`require()`) — the exact failure mode this
 * fork exists to fix. Named exports listed in config.smokeTest must resolve
 * to functions, guarding against cjs-module-lexer named-export detection
 * silently breaking. Throws (aborting before publish) on any failure.
 */
function smokeTest(transformed, workDir) {
	const smokeDir = path.join(workDir, "smoke");
	mkdirSync(smokeDir, { recursive: true });
	writeFileSync(
		path.join(smokeDir, "package.json"),
		`${JSON.stringify({ name: "atlaskit-repack-smoke", private: true }, null, 2)}\n`
	);

	const tarballs = transformed.map((t) =>
		npm(["pack", t.root, "--pack-destination", smokeDir]).trim().split("\n").pop()
	);

	// The publish registry only hosts our private packages, so it must not be the
	// install registry (public deps like @babel/runtime would 404 there). Route
	// only our scope to it — needed when a partial re-run has to fetch an
	// already-published fork — and let everything else come from the default registry.
	const scopedRegistryArgs = publishRegistry ? [`--${config.scope}:registry=${publishRegistry}`] : [];

	npm(["install", ...tarballs.map((t) => `./${t}`), "--no-audit", "--no-fund", ...scopedRegistryArgs], {
		cwd: smokeDir,
		stdio: "inherit"
	});

	const specs = transformed.flatMap((t) =>
		Object.keys(t.exportsMap)
			.filter((subpath) => subpath !== "./package.json")
			.map((subpath) => (subpath === "." ? t.targetName : t.targetName + subpath.slice(1)))
	);
	const requiredExports = Object.fromEntries(
		Object.entries(config.smokeTest ?? {})
			.map(([spec, names]) => [rescope(spec), names])
			.filter(([spec]) => specs.includes(spec))
	);

	const testFile = path.join(smokeDir, "smoke-test.mjs");
	writeFileSync(
		testFile,
		[
			`const SPECS = ${JSON.stringify(specs, null, 2)};`,
			`const REQUIRED = ${JSON.stringify(requiredExports, null, 2)};`,
			'import { createRequire } from "node:module";',
			"const require = createRequire(import.meta.url);",
			"let failed = false;",
			"for (const spec of SPECS) {",
			"  try {",
			"    const ns = await import(spec);",
			"    for (const name of REQUIRED[spec] ?? []) {",
			'      if (typeof ns[name] !== "function") {',
			"        console.error(`FAIL ${spec}: named export ${name} is ${typeof ns[name]}`);",
			"        failed = true;",
			"      }",
			"    }",
			"  } catch (error) {",
			"    console.error(`FAIL import(${spec}): ${error.message}`);",
			"    failed = true;",
			"  }",
			"  try {",
			"    require(spec);",
			"  } catch (error) {",
			"    console.error(`FAIL require(${spec}): ${error.message}`);",
			"    failed = true;",
			"  }",
			"}",
			"if (failed) process.exit(1);",
			"console.log(`smoke test passed: ${SPECS.length} subpaths via import() and require(),`,",
			"  `${Object.values(REQUIRED).flat().length} named exports verified`);",
			""
		].join("\n")
	);
	execFileSync(process.execPath, [testFile], {
		cwd: smokeDir,
		stdio: "inherit"
	});
	console.log("✓ smoke test passed");
}

const workDir = mkdtempSync(path.join(os.tmpdir(), "atlaskit-repack-"));
console.log(`work dir: ${workDir}`);

try {
	// Config order matters: the core package must exist before its dependents.
	const transformed = Object.entries(config.packages)
		.map(([name, version]) => transformPackage(name, version, workDir))
		.filter(Boolean);

	if (transformed.length === 0) {
		console.log("nothing to do — all target versions already published");
	} else {
		smokeTest(transformed, workDir);

		for (const t of transformed) {
			npm(["publish", t.root, ...publishRegistryArgs, ...(dryRun ? ["--dry-run"] : [])], { stdio: "inherit" });
			console.log(
				`✓ ${t.targetName}@${t.version} ${dryRun ? "transformed + smoke-tested (dry run, not published)" : "published"}`
			);
		}
	}
} finally {
	if (dryRun) {
		console.log(`dry run — inspect transformed packages in ${workDir}`);
	} else {
		rmSync(workDir, { recursive: true, force: true });
	}
}
