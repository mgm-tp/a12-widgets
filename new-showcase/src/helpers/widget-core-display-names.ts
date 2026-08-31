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

// In prod builds, the bundler mangles component function names, so falling back
// to `elementType.name` gives us garbage like `Xr` or `_default` in generated
// code snippets instead of `Card`. This file fixes that by mapping the minified
// component reference back to its original name via the widgets-core exports
// (whose object keys survive minification).
//
// Only leaf names (e.g. `Media`) are stored. Namespaces like `Card.Media` are
// added by the showcase via `namespaceOptions`.

import * as widgetsCore from "@com.mgmtp.a12.widgets/widgets-core";

// Only walk PascalCase keys — skip lowercase helpers on namespace objects.
const componentExportNamePattern = /^[A-Z][A-Za-z0-9_$]*$/;

function isObjectLike(value: unknown): value is Record<string, unknown> {
	return (typeof value === "object" && value !== null) || typeof value === "function";
}

function buildLeafNameLookup(): WeakMap<object, Set<string>> {
	// The map: component reference → every name it's reachable under.
	// A single reference can be exported under multiple names — e.g. the internal
	// `CloseButtonTpl` top-level export and the public `ContentBoxElements.CloseButton`
	// alias are the same object. We record all of them so the caller can pick the one
	// the showcase actually declared (via `namespaceOptions`) rather than whichever key
	// happened to be walked first.
	// WeakMap so unused exports can still be garbage-collected.
	const lookup = new WeakMap<object, Set<string>>();

	function visit(record: unknown, leafName: string): void {
		// Skip primitives.
		if (!isObjectLike(record)) {
			return;
		}

		const existingNames = lookup.get(record);

		if (existingNames) {
			// Same reference reachable under another name: add this alias, then stop.
			existingNames.add(leafName);

			return;
		}

		// Remember the name for this component/namespace.
		lookup.set(record, new Set([leafName]));

		// Walk into namespace children (e.g. Card → Media, Content).
		// Non-PascalCase keys are internal helpers, so we skip them.
		for (const key of Object.keys(record)) {
			if (componentExportNamePattern.test(key)) {
				visit(record[key], key);
			}
		}
	}

	// Start from every top-level widgets-core export.
	for (const key of Object.keys(widgetsCore)) {
		visit((widgetsCore as Record<string, unknown>)[key], key);
	}

	return lookup;
}

const displayNamesByValue = buildLeafNameLookup();

// Looks up a component in the map built above and returns every name it's exported under.
// The lookup matches by object reference: only the exact objects exported from widgets-core are keys in the map.
// Wrapping a component (memo, HOCs, styled) creates a new object,
// so the wrapper is not found in the map and an empty set is returned —
// same as for any other value that isn't a widgets-core export.
export function getWidgetCoreDisplayNames(value: unknown): ReadonlySet<string> {
	if (isObjectLike(value)) {
		return displayNamesByValue.get(value) ?? new Set();
	}

	return new Set();
}
