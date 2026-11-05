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

import * as React from "react";
import * as StyledComponents from "styled-components";

import * as WidgetsCore from "@com.mgmtp.a12.widgets/widgets-core";

import { getPlaygroundSourceCode, resolvePlaygroundSourcePath } from "./playground-source-files.js";

export type ModuleExports = Record<string, unknown>;
type ModuleLoader = () => Promise<ModuleExports>;

/** Wraps a namespace import as a module entry with both named and default exports. */
function mod(ns: ModuleExports): ModuleExports {
	return { ...ns, default: ns };
}

async function loadModule(loader: ModuleLoader): Promise<ModuleExports> {
	return mod(await loader());
}

/** Some packages only have a default export, so add the common name examples import, like DOMPurify. */
async function loadDefaultInteropModule(loader: ModuleLoader, namedDefaultExport: string): Promise<ModuleExports> {
	const ns = await loader();
	const defaultExport = ns.default;

	return { ...ns, default: defaultExport, [namedDefaultExport]: defaultExport, __esModule: true };
}

/**
 * Registry of packages available for live code evaluation.
 * Each entry maps a module specifier to its exports object.
 * The `default` property is used for default imports (`import X from "y"`).
 *
 * NOTE: keep this list in sync with the packages showcase examples import — `pnpm check:live-modules`
 * verifies that every bare import in an example source is registered here.
 *
 * The default playground example only needs React, styled-components and widgets-core. Keep those hot
 * and leave every other registered module unloaded until `preloadCodeDependencies` sees it in code.
 */
export const registry: Record<string, ModuleExports | undefined> = {
	react: mod(React),
	"react-dom": undefined,
	"react-router": undefined,
	"react-transition-group": undefined,
	"styled-components": mod(StyledComponents),
	fflate: undefined,
	"lorem-ipsum": undefined,
	immer: undefined,
	"date-fns": undefined,
	"date-fns/locale": undefined,
	"date-fns/locale/de": undefined,
	"date-fns/parse": undefined,
	"date-fns/isValid": undefined,
	"@date-fns/tz": undefined,
	"lodash-es": undefined,
	recharts: undefined,
	polished: undefined,
	dompurify: undefined,
	deepmerge: undefined,
	"mobile-detect": undefined,
	"react-element-to-jsx-string": undefined,
	"ts-key-enum": undefined,
	"react-dnd": undefined,
	"react-dnd-html5-backend": undefined,
	"@faker-js/faker/locale/en": undefined,
	lexical: undefined,
	"@lexical/link": undefined,
	"@lexical/mdast": undefined,
	"@lexical/utils": undefined,
	"@lexical/react/LexicalContentEditable": undefined,
	"@lexical/react/LexicalComposerContext": undefined,
	"@lexical/react/LexicalErrorBoundary": undefined,
	"@lexical/react/LexicalNestedComposer": undefined,
	"@lexical/react/LexicalPlainTextPlugin": undefined,
	"@lexical/react/useExtensionComponent": undefined,
	"@com.mgmtp.a12.widgets/widgets-core": mod(WidgetsCore),
	"@com.mgmtp.a12.widgets/widgets-core/experimental": undefined,
	"@com.mgmtp.a12.widgets/widgets-utils": undefined
};

const registryLoaders = new Map<string, ModuleLoader>([
	["react-dom", () => loadModule(() => import("react-dom"))],
	["react-router", () => loadModule(() => import("react-router"))],
	["react-transition-group", () => loadModule(() => import("react-transition-group"))],
	["fflate", () => loadModule(() => import("fflate"))],
	["lorem-ipsum", () => loadModule(() => import("lorem-ipsum"))],
	["immer", () => loadModule(() => import("immer"))],
	["date-fns", () => loadModule(() => import("date-fns"))],
	["date-fns/locale", () => loadModule(() => import("date-fns/locale"))],
	["date-fns/locale/de", () => loadModule(() => import("date-fns/locale/de"))],
	["date-fns/parse", () => loadModule(() => import("date-fns/parse"))],
	["date-fns/isValid", () => loadModule(() => import("date-fns/isValid"))],
	["@date-fns/tz", () => loadModule(() => import("@date-fns/tz"))],
	["lodash-es", () => loadModule(() => import("lodash-es"))],
	["recharts", () => loadModule(() => import("recharts"))],
	["polished", () => loadModule(() => import("polished"))],
	["dompurify", () => loadDefaultInteropModule(() => import("dompurify"), "DOMPurify")],
	["deepmerge", () => loadDefaultInteropModule(() => import("deepmerge"), "deepmerge")],
	["mobile-detect", () => loadDefaultInteropModule(() => import("mobile-detect"), "MobileDetect")],
	[
		"react-element-to-jsx-string",
		() => loadDefaultInteropModule(() => import("react-element-to-jsx-string"), "reactElementToJSXString")
	],
	["ts-key-enum", () => loadModule(() => import("ts-key-enum"))],
	["react-dnd", () => loadModule(() => import("react-dnd"))],
	["react-dnd-html5-backend", () => loadModule(() => import("react-dnd-html5-backend"))],
	["@faker-js/faker/locale/en", () => loadModule(() => import("@faker-js/faker/locale/en"))],
	["lexical", () => loadModule(() => import("lexical"))],
	["@lexical/link", () => loadModule(() => import("@lexical/link"))],
	["@lexical/mdast", () => loadModule(() => import("@lexical/mdast"))],
	["@lexical/utils", () => loadModule(() => import("@lexical/utils"))],
	["@lexical/react/LexicalContentEditable", () => loadModule(() => import("@lexical/react/LexicalContentEditable"))],
	["@lexical/react/LexicalComposerContext", () => loadModule(() => import("@lexical/react/LexicalComposerContext"))],
	["@lexical/react/LexicalErrorBoundary", () => loadModule(() => import("@lexical/react/LexicalErrorBoundary"))],
	["@lexical/react/LexicalNestedComposer", () => loadModule(() => import("@lexical/react/LexicalNestedComposer"))],
	["@lexical/react/LexicalPlainTextPlugin", () => loadModule(() => import("@lexical/react/LexicalPlainTextPlugin"))],
	["@lexical/react/useExtensionComponent", () => loadModule(() => import("@lexical/react/useExtensionComponent"))],
	[
		"@com.mgmtp.a12.widgets/widgets-core/experimental",
		() => loadModule(() => import("@com.mgmtp.a12.widgets/widgets-core/experimental"))
	],
	["@com.mgmtp.a12.widgets/widgets-utils", () => loadModule(() => import("@com.mgmtp.a12.widgets/widgets-utils"))]
]);

const loadingRegistryModules = new Map<string, Promise<ModuleExports>>();

/** Loads a package once and shares its in-flight request when several imports need it at the same time. */
async function preloadRegistryModule(specifier: string): Promise<void> {
	if (registry[specifier]) {
		return;
	}

	const loader = registryLoaders.get(specifier);

	if (!loader) {
		return;
	}

	let loading = loadingRegistryModules.get(specifier);

	if (!loading) {
		loading = loader().catch((error: unknown) => {
			loadingRegistryModules.delete(specifier);
			throw error;
		});
		loadingRegistryModules.set(specifier, loading);
	}

	registry[specifier] = await loading;
}

/**
 * Walks imports inside a generated source file, including nested relative imports.
 * Example: if `../master-detail/master-detail.js` imports `./master-detail-template.js`, scan that next.
 */
async function preloadSourceFileDependencies(sourcePath: string, visitedSourceFiles: Set<string>): Promise<void> {
	// Stop if this file was already scanned, for example when two files import each other.
	if (visitedSourceFiles.has(sourcePath)) {
		return;
	}

	// Mark it before scanning so circular imports cannot loop forever.
	visitedSourceFiles.add(sourcePath);

	// Load the generated source code from playground-sources.json.
	const code = getPlaygroundSourceCode(sourcePath);

	if (code) {
		// Scan this file's imports using this file as the new base for relative paths like "./foo.js".
		await preloadCodeDependenciesInternal(code, sourcePath, visitedSourceFiles);
	}
}

/**
 * Finds the imports before we run the code, so the sandbox can load them first.
 * For example, `import { useState } from "react"` returns "react",
 * and `import { MasterDetailExample } from "../master-detail/master-detail.js"` returns the relative path.
 */
function extractRuntimeSpecifiers(code: string): string[] {
	const specifiers = new Set<string>();
	const patterns = [
		/\bimport\s+(?!type\b)["']([^"']+)["']/g,
		/\bimport\s+(?!type\b)[\s\S]*?\bfrom\s*["']([^"']+)["']/g,
		/\bexport\s+(?!type\b)[\s\S]*?\bfrom\s*["']([^"']+)["']/g,
		/\brequire\(\s*["']([^"']+)["']\s*\)/g
	];

	for (const pattern of patterns) {
		let match: RegExpExecArray | null;

		while ((match = pattern.exec(code)) !== null) {
			specifiers.add(match[1]);
		}
	}

	return [...specifiers];
}

/** Preloads bare packages directly and follows relative imports through the generated source manifest. */
async function preloadCodeDependenciesInternal(
	code: string,
	sourceName: string | undefined,
	visitedSourceFiles: Set<string>
): Promise<void> {
	await Promise.all(
		extractRuntimeSpecifiers(code)
			.filter((specifier) => !specifier.endsWith(".css"))
			.map((specifier) => {
				if (!specifier.startsWith(".")) {
					return preloadRegistryModule(specifier);
				}

				const sourcePath = resolvePlaygroundSourcePath(specifier, sourceName);

				return sourcePath ? preloadSourceFileDependencies(sourcePath, visitedSourceFiles) : undefined;
			})
	);
}

export function preloadCodeDependencies(code: string, sourceName?: string): Promise<void> {
	// Each scan needs its own cycle guard. Successfully loaded packages stay cached in `registry`.
	return preloadCodeDependenciesInternal(code, sourceName, new Set());
}

/**
 * Resolves a module specifier against the package registry. Used by the sandboxed playground to run
 * showcase examples opened via "Open in playground".
 */
export function resolveFromRegistry(specifier: string): ModuleExports {
	const found = registry[specifier];

	if (found) {
		return found;
	}

	// Side-effect CSS imports (e.g. component stylesheets) are no-ops in live mode — the styles are
	// already loaded by the host document; we just must not fail to "require" them.
	if (specifier.endsWith(".css")) {
		return {};
	}

	throw new Error(
		`Module "${specifier}" is not available in live mode. Register it in live-runner-modules.ts to use it.`
	);
}
