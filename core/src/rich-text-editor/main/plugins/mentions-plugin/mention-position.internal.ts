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

import { dedupeSelectionRects } from "@lexical/utils";

/** The structural subset of `DOMRect` needed to place the mention menu. */
export type SelectionRectLike = Pick<DOMRect, "left" | "top" | "right" | "bottom" | "width" | "height">;

/**
 * Picks the rect the mention menu should be anchored to.
 *
 * `Range.getClientRects()` is not safe to index into directly: it can lead with
 * a zero-area rect, and WebKit additionally emits a spurious block-wide rect
 * next to the real text rect. Taking `rects[0]` therefore anchors the menu to
 * the left edge of the block instead of the caret. `dedupeSelectionRects` drops
 * zero-area rects and prefers the smaller, text-hugging rect when one contains
 * another, which is exactly the raw-`getClientRects()` path it was written for.
 *
 * The caret itself is a zero-area rect though, and while typing a mention the
 * selection is collapsed — so when dedupe discards everything, fall back to the
 * first raw rect rather than losing the caret position altogether.
 *
 * @param rects - The client rects of the current selection range
 * @returns The rect to anchor to, or `undefined` when the selection has none
 */
export const anchorRectOfSelection = <Rect extends SelectionRectLike>(rects: Iterable<Rect>): Rect | undefined => {
	const candidates = [...rects];

	return dedupeSelectionRects(candidates)[0] ?? candidates[0];
};
