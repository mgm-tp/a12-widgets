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

import type { ComponentType } from "react";
import { transform } from "sucrase";

import type { ModuleExports } from "./live-runner-modules.js";
import { preloadCodeDependencies, resolveFromRegistry } from "./live-runner-modules.js";
import { getPlaygroundSourceCode, resolvePlaygroundSourcePath } from "./playground-source-files.js";

export { preloadCodeDependencies };

type ModuleResolver = (specifier: string) => ModuleExports;

// Generated source files do not change while the sandbox is running, so evaluate each one only once.
// A separate cache per resolver keeps custom resolvers isolated from the default package registry.
const sourceModuleCaches = new WeakMap<ModuleResolver, Map<string, ModuleExports>>();

function compileCode(code: string): string {
	// Prepend React so JSX transform (React.createElement) always has it available,
	// even if the source code only has `import { useState } from "react"`.
	const withPreamble = `var React = require("react");\n${code}`;

	return transform(withPreamble, {
		transforms: ["jsx", "typescript", "imports"],
		production: true
	}).code;
}

function createSourceResolver(sourceName: string | undefined, resolver: ModuleResolver): ModuleResolver {
	const cachedModules = sourceModuleCaches.get(resolver);
	const moduleCache = cachedModules ?? new Map<string, ModuleExports>();

	if (!cachedModules) {
		sourceModuleCaches.set(resolver, moduleCache);
	}

	function resolveImport(specifier: string, importerSourceName = sourceName): ModuleExports {
		const sourcePath = resolvePlaygroundSourcePath(specifier, importerSourceName);

		return sourcePath ? evaluateSourceFile(sourcePath) : resolver(specifier);
	}

	function evaluateSourceFile(sourcePath: string): ModuleExports {
		const cached = moduleCache.get(sourcePath);

		if (cached) {
			return cached;
		}

		const code = getPlaygroundSourceCode(sourcePath);

		if (!code) {
			throw new Error(`Source file "${sourcePath}" is not available in the playground source manifest.`);
		}

		const exports: ModuleExports = {};
		moduleCache.set(sourcePath, exports);

		// Files from playground-sources.json are already compiled by gen-playground-sources.mjs.
		const fn = new Function("require", "exports", code);

		try {
			fn((specifier: string) => resolveImport(specifier, sourcePath), exports);
		} catch (error) {
			moduleCache.delete(sourcePath);
			throw error;
		}

		return exports;
	}

	return resolveImport;
}

/**
 * Picks which export to render. The static showcase renders a specific named component, so we try to
 * mirror it rather than blindly rendering whatever comes first (which could be a helper or constant):
 *   1. the caller's preferred name (the component the static example renders),
 *   2. the default export (the convention used by playground/freeform snippets),
 *   3. the first PascalCase function/class export (a component, not a helper),
 *   4. the first function export, then null.
 */
function selectComponent(exports: { [name: string]: ComponentType }, preferredName?: string): ComponentType | null {
	if (preferredName && typeof exports[preferredName] === "function") {
		return exports[preferredName];
	}

	if (typeof exports.default === "function") {
		return exports.default;
	}

	const componentExport = Object.keys(exports).find((key) => /^[A-Z]/.test(key) && typeof exports[key] === "function");

	if (componentExport) {
		return exports[componentExport];
	}

	for (const key in exports) {
		if (typeof exports[key] === "function") {
			return exports[key];
		}
	}

	return null;
}

export function evaluateCode(
	code: string,
	sourceName?: string,
	preferredName?: string,
	resolver: ModuleResolver = resolveFromRegistry
): { element: ComponentType | null; error: string | null } {
	const boundResolver = createSourceResolver(sourceName, resolver);

	try {
		const exports: { [name: string]: ComponentType } = {};
		const fn = new Function("require", "exports", compileCode(code));
		fn(boundResolver, exports);

		return { element: selectComponent(exports, preferredName), error: null };
	} catch (err) {
		return { element: null, error: err instanceof Error ? err.message : String(err) };
	}
}
