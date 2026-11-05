/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * See the repository LICENSE files for the full dual-license text.
 */

/*
 * Builds a tiny virtual source registry for the playground sandbox.
 *
 * The editor keeps the original source code, including relative imports.
 * The sandbox uses this manifest to run those relative imports without loading many JS chunks.
 *
 * Build steps:
 * 1. Scan source folders and remember every file that a relative import may reach.
 * 2. Find the single-file examples that show the "Open in Playground" button.
 * 3. Follow their relative imports recursively and keep only the files they need.
 * 4. Compile those files to compact CommonJS and write them into one JSON manifest.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, parse, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { experiments } from "@rspack/core";
import ts from "typescript";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = resolve(SCRIPT_DIR, "../src");
const OUTPUT = resolve(SRC_DIR, "generated/playground-sources.json");

// These roots contain files that may be referenced by playground examples.
const SOURCE_ROOTS = ["showcases", "experimental", "helpers", "themes", "playground"];

// Only these roots contain examples that can show the "Open in Playground" button.
const PLAYGROUND_ENTRY_ROOTS = ["showcases", "experimental"];

const sourceFilePattern = /\.(jsx?|tsx?)$/;

// Create a stable, compact key for matching the code shown in the toolbar to its source file.
// The length is included to reduce the chance that two different snippets have the same key.
function hashContent(value) {
	let hash = 0x811c9dc5;

	for (let i = 0; i < value.length; i++) {
		hash ^= value.charCodeAt(i);
		hash = Math.imul(hash, 0x01000193) >>> 0;
	}

	return `${hash}:${value.length}`;
}

// Read all source files under a folder, including nested folders.
function collectSourceFiles(dir) {
	const files = [];

	for (const entry of readdirSync(dir)) {
		const full = resolve(dir, entry);

		if (statSync(full).isDirectory()) {
			files.push(...collectSourceFiles(full));
		} else if (sourceFilePattern.test(full)) {
			files.push(full);
		}
	}

	return files;
}

// Convert an absolute file path to the manifest path used at runtime.
function toSourcePath(file) {
	return relative(SRC_DIR, file).split(sep).join("/").replace(sourceFilePattern, "");
}

// Tell TypeScript how to parse and compile each source file.
function getScriptKind(file) {
	if (file.endsWith(".tsx")) {
		return ts.ScriptKind.TSX;
	}

	if (file.endsWith(".jsx")) {
		return ts.ScriptKind.JSX;
	}

	if (file.endsWith(".ts")) {
		return ts.ScriptKind.TS;
	}

	return ts.ScriptKind.JS;
}

// Compile the stored file with TypeScript so the sandbox can execute plain CommonJS.
// React is added because the JSX output calls React.createElement even when the source only uses named React imports.
function compileRuntimeCode(file, source) {
	return ts.transpileModule(`var React = require("react");\n${source}`, {
		fileName: file,
		compilerOptions: {
			target: ts.ScriptTarget.ES2020,
			module: ts.ModuleKind.CommonJS,
			jsx: ts.JsxEmit.React,
			removeComments: true
		}
	}).outputText;
}

// Remove whitespace and comments from compiled JS without changing names or expressions.
// Disabling compression and mangling keeps this build step predictable and avoids changing runtime behavior.
function minifyRuntimeCode(code) {
	const result = experiments.swc.minifySync(code, {
		compress: false,
		mangle: false,
		format: {
			comments: false
		}
	});

	return result.code.trim();
}

// Pull runtime module specifiers from source code. Using the TypeScript syntax tree avoids matching text inside
// comments or strings, and lets us skip type-only imports that the sandbox never executes.
function extractRuntimeSpecifiers(code, file = "playground.tsx") {
	const sourceFile = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, getScriptKind(file));
	const specifiers = new Set();

	// Walk the syntax tree and collect static imports, re-exports, and require calls.
	function visit(node) {
		if (ts.isImportDeclaration(node) && !node.importClause?.isTypeOnly && ts.isStringLiteral(node.moduleSpecifier)) {
			specifiers.add(node.moduleSpecifier.text);
		}

		if (ts.isExportDeclaration(node) && !node.isTypeOnly && ts.isStringLiteral(node.moduleSpecifier)) {
			specifiers.add(node.moduleSpecifier.text);
		}

		if (
			ts.isCallExpression(node) &&
			ts.isIdentifier(node.expression) &&
			node.expression.text === "require" &&
			node.arguments.length === 1
		) {
			const specifier = getStringLiteral(node.arguments[0]);

			if (specifier !== undefined) {
				specifiers.add(specifier);
			}
		}

		ts.forEachChild(node, visit);
	}

	visit(sourceFile);

	return [...specifiers];
}

// Resolve "./foo.js" from "showcases/button/basic" to a manifest key like "showcases/button/foo".
// Extensionless directory imports also try the directory's index file, just like the application build does.
function resolveSourcePath(specifier, sourceName, availableFiles) {
	if (!sourceName || !specifier.startsWith(".")) {
		return undefined;
	}

	const parts = sourceName.split("/");
	parts.pop();

	for (const part of specifier
		.replace(/\?.*$/, "")
		.replace(/\.(jsx?|tsx?)$/, "")
		.split("/")) {
		if (part === "" || part === ".") {
			continue;
		}

		if (part === "..") {
			parts.pop();
			continue;
		}

		parts.push(part);
	}

	const sourcePath = parts.join("/");

	if (availableFiles.has(sourcePath)) {
		return sourcePath;
	}

	const indexPath = `${sourcePath}/index`;

	return availableFiles.has(indexPath) ? indexPath : undefined;
}

// Find one property on a TypeScript object literal.
function getProperty(object, name) {
	return object.properties.find((property) => {
		if (!ts.isPropertyAssignment(property)) {
			return false;
		}

		return (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) && property.name.text === name;
	});
}

// Read plain string values from AST nodes.
function getStringLiteral(expression) {
	if (!expression) {
		return undefined;
	}

	if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
		return expression.text;
	}

	return undefined;
}

// Showcase index files import raw snippets with paths like "!./basic.tsx?raw".
// Runtime imports use ".js" extensions, so we also try the matching source file extensions.
function resolveRawImport(fromFile, specifier) {
	const sourceSpecifier = specifier.replace(/^!+/, "").replace(/\?.*$/, "");

	if (!sourceSpecifier.startsWith(".")) {
		return undefined;
	}

	const file = resolve(dirname(fromFile), sourceSpecifier);
	const parsed = parse(file);
	const fileWithoutExtension = resolve(parsed.dir, parsed.name);
	const candidates = [file];

	if (parsed.ext === ".js" || parsed.ext === ".jsx") {
		candidates.push(
			`${fileWithoutExtension}.tsx`,
			`${fileWithoutExtension}.ts`,
			`${fileWithoutExtension}.jsx`,
			`${fileWithoutExtension}.js`
		);
	} else if (!extname(file)) {
		candidates.push(
			`${file}.tsx`,
			`${file}.ts`,
			`${file}.jsx`,
			`${file}.js`,
			join(file, "index.tsx"),
			join(file, "index.ts"),
			join(file, "index.jsx"),
			join(file, "index.js")
		);
	}

	return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
}

// Collect values that can become section.code.code. Most are raw imports, while a few showcase files use
// local string constants. Resolving them here lets the scanner inspect the same code the toolbar receives.
function collectResolvableValues(file, sourceFile) {
	const values = new Map();

	// Walk imports and constants from the showcase index file.
	function visit(node) {
		if (ts.isImportDeclaration(node) && node.importClause?.name && ts.isStringLiteral(node.moduleSpecifier)) {
			const rawFile = resolveRawImport(file, node.moduleSpecifier.text);

			if (rawFile) {
				values.set(node.importClause.name.text, readFileSync(rawFile, "utf8"));
			}
		}

		if (ts.isVariableStatement(node)) {
			for (const declaration of node.declarationList.declarations) {
				if (ts.isIdentifier(declaration.name)) {
					const value = getStringLiteral(declaration.initializer);

					if (value !== undefined) {
						values.set(declaration.name.text, value);
					}
				}
			}
		}

		ts.forEachChild(node, visit);
	}

	visit(sourceFile);

	return values;
}

// Resolve the value assigned to `code` inside a SourceCode object.
function getCodeValue(expression, resolvableValues) {
	if (!expression) {
		return undefined;
	}

	if (ts.isIdentifier(expression)) {
		return resolvableValues.get(expression.text);
	}

	return getStringLiteral(expression);
}

// Check whether this section hides the playground button.
function isHiddenPlaygroundSection(object) {
	const hidePlaygroundButton = getProperty(object, "hidePlaygroundButton");

	return hidePlaygroundButton?.initializer.kind === ts.SyntaxKind.TrueKeyword;
}

// This mirrors the UI rule: only a single SourceCode object gets an "Open in Playground" button.
// Multi-file snippets and sections with hidePlaygroundButton are ignored because users cannot open them.
function findOpenPlaygroundSources(file, source) {
	const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, getScriptKind(file));
	const resolvableValues = collectResolvableValues(file, sourceFile);
	const sources = [];

	// Walk the showcase object tree and collect runnable single-file snippets.
	function visit(node) {
		if (ts.isObjectLiteralExpression(node)) {
			const codeProperty = getProperty(node, "code");

			if (codeProperty && ts.isObjectLiteralExpression(codeProperty.initializer) && !isHiddenPlaygroundSection(node)) {
				const nestedCodeProperty = getProperty(codeProperty.initializer, "code");
				const code = getCodeValue(nestedCodeProperty?.initializer, resolvableValues);

				if (typeof code === "string") {
					sources.push(code);
				}
			}
		}

		ts.forEachChild(node, visit);
	}

	visit(sourceFile);

	return sources;
}

// The toolbar removes the license header before opening the playground. Apply the same cleanup here so its hash
// matches the code sent at runtime.
function extractDisplayCode(source) {
	return source.replace(/^\/\*[\s\S]*?\*\/\s*/, "").trimStart();
}

// Written to the manifest so the toolbar can map displayed code back to its source path.
const sourcePathsByHash = {};

// Complete source index used only while generating and resolving the recursive dependency graph.
const sourceFilesByPath = new Map();
const allSourcePathsByHash = new Map();

// Showcase index files are scanned for sections that expose the playground button.
const playgroundEntryFiles = [];

// Keep each source file once and index its raw content for the entry-point lookup.
function addSourceFile(file) {
	const source = readFileSync(file, "utf8");
	const sourcePath = toSourcePath(file);

	sourceFilesByPath.set(sourcePath, { file, source });
	allSourcePathsByHash.set(hashContent(source), sourcePath);
}

for (const root of SOURCE_ROOTS) {
	const rootDir = resolve(SRC_DIR, root);

	if (!existsSync(rootDir)) {
		continue;
	}

	for (const file of collectSourceFiles(rootDir)) {
		addSourceFile(file);

		if (PLAYGROUND_ENTRY_ROOTS.includes(root)) {
			playgroundEntryFiles.push(file);
		}
	}
}

// This becomes the small runtime file set written to the manifest. The Set also stops dependency cycles.
const neededSourcePaths = new Set();

// Walk relative imports recursively from each runnable example.
// The sandbox receives the top-level code from the URL, so the manifest only needs imported files.
function collectRelativeDependencies(code, sourcePath, file) {
	if (!code) {
		return;
	}

	for (const specifier of extractRuntimeSpecifiers(code, file)) {
		if (!specifier.startsWith(".") || specifier.endsWith(".css")) {
			continue;
		}

		const dependencySourcePath = resolveSourcePath(specifier, sourcePath, sourceFilesByPath);

		if (!dependencySourcePath) {
			throw new Error(`Could not resolve "${specifier}" from "${sourcePath ?? "unknown source"}".`);
		}

		if (neededSourcePaths.has(dependencySourcePath)) {
			continue;
		}

		neededSourcePaths.add(dependencySourcePath);

		const dependency = sourceFilesByPath.get(dependencySourcePath);
		collectRelativeDependencies(dependency.source, dependencySourcePath, dependency.file);
	}
}

// Match each runnable snippet to its original file, then collect the full relative-import closure.
for (const file of playgroundEntryFiles) {
	const entry = sourceFilesByPath.get(toSourcePath(file));

	for (const code of findOpenPlaygroundSources(file, entry.source)) {
		const hash = hashContent(code);
		const sourcePath = allSourcePathsByHash.get(hash);

		if (sourcePath) {
			sourcePathsByHash[hash] = sourcePath;
		}

		// A literal snippet has no source file match. Its containing showcase file is still useful for parse errors,
		// while unresolved relative imports will fail below with a clear source name.
		const sourceFile = sourcePath ? sourceFilesByPath.get(sourcePath).file : file;
		collectRelativeDependencies(extractDisplayCode(code), sourcePath, sourceFile);
	}
}

const files = {};

// Compile only the files reached by runnable examples, then put them in the manifest.
for (const sourcePath of neededSourcePaths) {
	const sourceFile = sourceFilesByPath.get(sourcePath);

	files[sourcePath] = minifyRuntimeCode(compileRuntimeCode(sourceFile.file, sourceFile.source));
}

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, JSON.stringify({ files, sourcePathsByHash }));

console.log(
	`Wrote playground source manifest (${Object.keys(files).length} runtime files, ${Object.keys(sourcePathsByHash).length} source hashes) to ${OUTPUT}`
);
