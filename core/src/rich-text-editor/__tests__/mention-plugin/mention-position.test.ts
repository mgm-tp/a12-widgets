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

import { describe, expect, test } from "vitest";

import type { SelectionRectLike } from "../../main/plugins/mentions-plugin/mention-position.internal.js";
import { anchorRectOfSelection } from "../../main/plugins/mentions-plugin/mention-position.internal.js";

const rect = (left: number, top: number, width: number, height: number): SelectionRectLike => ({
	left,
	top,
	width,
	height,
	right: left + width,
	bottom: top + height
});

describe("com.mgmtp.a12.widgets.rich-text-editor.mention-plugin anchor rect", () => {
	test("uses the only rect when the selection produces exactly one", () => {
		const caret = rect(120, 100, 2, 20);

		expect(anchorRectOfSelection([caret])).toEqual(caret);
	});

	test("ignores a leading zero-area rect", () => {
		const empty = rect(120, 100, 0, 0);
		const caret = rect(120, 100, 2, 20);

		expect(anchorRectOfSelection([empty, caret])).toEqual(caret);
	});

	test("prefers the text rect over WebKit's spurious block-wide rect", () => {
		// WebKit emits a rect spanning the whole block alongside the real one.
		// Indexing into getClientRects() directly would anchor the mention menu
		// to the left edge of the block rather than to the caret.
		const blockWide = rect(0, 100, 500, 20);
		const caret = rect(120, 100, 2, 20);

		expect(anchorRectOfSelection([blockWide, caret])).toEqual(caret);
	});

	test("keeps the caret rect of a collapsed selection", () => {
		// Typing a mention leaves the selection collapsed, and a caret's only
		// rect is zero-area. Discarding it would leave the menu unpositioned.
		const caret = rect(120, 100, 0, 20);

		expect(anchorRectOfSelection([caret])).toEqual(caret);
	});

	test("keeps a fully empty caret rect rather than returning nothing", () => {
		const caret = rect(120, 100, 0, 0);

		expect(anchorRectOfSelection([caret])).toEqual(caret);
	});

	test("returns undefined when the selection has no rects", () => {
		expect(anchorRectOfSelection([])).toBeUndefined();
	});
});
