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

import { useEffect, useRef } from "react";

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/** @internal */
export function cmp(x: any, y: any, d: number, path: string[] = [], prefix?: string): void {
	if (!x || !y) {
		return;
	}

	if (d === 0) {
		return;
	}

	if (x === y) {
		console.log("Deep equal");

		return;
	}

	// Remove keys
	const removes = Object.keys(x).filter((k) => !Object.prototype.hasOwnProperty.call(y, k));
	const add = Object.keys(y).filter((k) => !Object.prototype.hasOwnProperty.call(y, k));
	const changes = Object.keys(x).filter((k) => !removes.includes(k) && x[k] !== y[k]);
	console.group(" Depth: " + d, [prefix ?? "", ...path].join("/"));

	if (removes.length + add.length + changes.length === 0) {
		console.log("Value equal");
	} else {
		if (removes.length) {
			console.log({ removes });
		}

		if (add.length) {
			console.log({ add });
		}

		if (changes.length) {
			console.log({ changes });
			changes.forEach((k) => cmp(x[k], y[k], d - 1, [...path, k], prefix));
		}
	}

	console.groupEnd();
}

/** @internal */
export function useTraceUpdate(param: any, prefix?: string, depth = 3): void {
	const prev = useRef(param);

	useEffect(() => {
		console.group(prefix);
		cmp(prev.current, param, depth, []);
		console.groupEnd();

		prev.current = param;
	});
}
