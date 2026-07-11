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

import { describe, test, expect } from "vitest";

import { getFlatCompactTheme } from "../../flat-compact/flat-compact-theme.js";

import { getBaseTheme } from "../base-theme.js";

/**
 * Structural parity guard: every token *key path* present in the deprecated
 * `flat-compact` theme must also exist in `getBaseTheme()`, so a widget reading
 * `theme.components.x.y` does not silently get `undefined` after the migration.
 *
 * This checks token *presence* (shape), NOT values — base-theme intentionally
 * restructures and re-skins many tokens, so a value diff would be all noise.
 * Visual equivalence is covered separately by `visual-parity.test.tsx`.
 *
 * If a legacy change was made *after* base-theme was branched and has not yet
 * been ported, allowlist its key path here (with the ticket) so this test stays
 * green while documenting the debt. When you port one, REMOVE it — the test
 * fails if an allowlisted path is no longer missing, forcing cleanup.
 */
const KNOWN_MISSING_PATHS: Readonly<Record<string, string>> = {};

type AnyRecord = Record<string, unknown>;

const isPlainObject = (value: unknown): value is AnyRecord =>
	typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Returns the highest-level key paths in `reference` that are absent in
 * `candidate`. Stops descending at the first missing ancestor so the report
 * stays at the smallest meaningful granularity (e.g. `components.filter.prefix`
 * rather than every leaf beneath it).
 */
const findMissingPaths = (reference: unknown, candidate: unknown, path = ""): string[] => {
	if (isPlainObject(reference)) {
		if (!isPlainObject(candidate)) {
			return [path];
		}

		return Object.keys(reference).flatMap((key) =>
			findMissingPaths(reference[key], candidate[key], path ? `${path}.${key}` : key)
		);
	}

	// Leaf (primitive or function): missing only when the candidate has nothing there.
	return candidate === undefined ? [path] : [];
};

describe("base-theme structural parity vs flat-compact", () => {
	test("contains every token key path the legacy flat-compact theme exposes", () => {
		const legacy = getFlatCompactTheme() as unknown;
		const base = getBaseTheme() as unknown;

		const missing = findMissingPaths(legacy, base).sort();
		const allowlisted = Object.keys(KNOWN_MISSING_PATHS).sort();

		// Any gap that isn't documented is a regression — surface it.
		const unexpected = missing.filter((p) => !(p in KNOWN_MISSING_PATHS));
		expect(unexpected, "Undocumented token paths missing from base-theme").toEqual([]);

		// Any allowlisted gap that is now present means the port happened — remove it.
		const stale = allowlisted.filter((p) => !missing.includes(p));
		expect(stale, "Allowlisted paths now present in base-theme — remove them from KNOWN_MISSING_PATHS").toEqual([]);
	});
});
