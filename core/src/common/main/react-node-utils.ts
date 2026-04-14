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

import type { ReactElement, ReactNode } from "react";
import { isValidElement } from "react";

/** @internal */
export function isSimilarElement(a: ReactElement, b: ReactElement): boolean {
	// 1. Same component / tag
	if (a.type !== b.type) {
		return false;
	}

	// 2. Same key (important in lists)
	if (a.key !== b.key) {
		return false;
	}

	const propsA = a.props as Record<string, any>;
	const propsB = b.props as Record<string, any>;

	const keysA = Object.keys(propsA);
	const keysB = Object.keys(propsB);

	if (keysA.length !== keysB.length) {
		return false;
	}

	for (const key of keysA) {
		const valA = propsA[key];
		const valB = propsB[key];

		// 3. Ignore functions (always different reference)
		if (typeof valA === "function") {
			continue;
		}

		// 4. Handle children recursively (optional but useful)
		if (key === "children") {
			if (!isSimilarNode(valA, valB)) {
				return false;
			}

			continue;
		}

		// 5. Shallow compare other props
		if (valA !== valB) {
			return false;
		}
	}

	return true;
}

/** @internal */
export function isSimilarNode(a: ReactNode, b: ReactNode): boolean {
	// same primitive
	if (typeof a !== "object" && typeof b !== "object") {
		return a === b;
	}

	// null / undefined
	if (a == null || b == null) {
		return a === b;
	}

	// array case
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) {
			return false;
		}

		return a.every((child, i) => isSimilarNode(child, b[i]));
	}

	// ReactElement case
	if (isValidElement(a) && isValidElement(b)) {
		return isSimilarElement(a, b);
	}

	return false;
}
