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

import type { CodeModule } from "@com.mgmtp.a12.widgets/widgets-utils";

import { findPlaygroundSourcePathByHash } from "./playground-source-files.js";

// FNV-1a 32-bit hash + length suffix. Fast and enough for matching the bounded set of showcase files.
function hashContent(s: string): string {
	let h = 0x811c9dc5;

	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 0x01000193) >>> 0;
	}

	return `${h}:${s.length}`;
}

/**
 * Returns the registry key of a showcase source file (e.g. "showcases/icon/accessibility")
 * by matching its raw code content. Returns `undefined` when the content is not a known source
 * file (e.g. generated snippets or playground-edited code).
 */
export function findSourcePath(code: string | CodeModule): string | undefined {
	const raw = typeof code === "string" ? code : code.default;

	return findPlaygroundSourcePathByHash(hashContent(raw));
}
