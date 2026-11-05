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

import { useEffect } from "react";

import { DataRoles } from "../../common/main/data-roles.js";

import type { DataTableHorizontalScrollAlign } from "./data-table.api.js";

const HEADER_CELL_SELECTOR = `[data-role="${DataRoles.Table.Header.Cell}"]`;
const RESIZE_HANDLE_SELECTOR = `[data-role="${DataRoles.Table.Column.ResizeHandler}"]`;
// Prefer the resize handle when both match (it is a child of the header cell), so
// tabbing to a separator reveals the column boundary rather than the cell's label.
const FOCUS_TARGET_SELECTOR = `${RESIZE_HANDLE_SELECTOR}, ${HEADER_CELL_SELECTOR}`;

/**
 * Horizontally scroll `viewport` so `target` (a focused header cell or resize
 * separator) is fully visible, clearing the sticky left/right pinned columns.
 *
 * A plain `Element.scrollIntoView` is not enough here: the pinned header columns
 * are `position: sticky` and overlay the scroll area, so an element scrolled to
 * the viewport edge would sit hidden *behind* a pinned column. We derive the
 * unobscured band from the rendered pinned cells and nudge `scrollLeft` only as
 * far as needed to bring the target inside it (no vertical scroll — the header
 * is sticky).
 *
 * @internal
 */
export function scrollHeaderTargetIntoView(
	viewport: HTMLElement,
	target: HTMLElement,
	{ align = "auto", behavior }: { align?: DataTableHorizontalScrollAlign; behavior?: ScrollBehavior } = {}
): void {
	const viewportRect = viewport.getBoundingClientRect();
	const targetRect = target.getBoundingClientRect();

	const thead = target.closest("thead") ?? viewport;

	// Left band edge = far (right) edge of the outermost left-pinned cell;
	// right band edge = near (left) edge of the outermost right-pinned cell.
	// Pinned cells are sticky, so their rects already reflect their on-screen
	// position. Group parent cells share their leaves' extent, so folding them
	// into the max/min is harmless.
	let visibleLeft = viewportRect.left;

	thead.querySelectorAll<HTMLElement>(`${HEADER_CELL_SELECTOR}[data-pinned="left"]`).forEach((cell) => {
		visibleLeft = Math.max(visibleLeft, cell.getBoundingClientRect().right);
	});

	let visibleRight = viewportRect.right;

	thead.querySelectorAll<HTMLElement>(`${HEADER_CELL_SELECTOR}[data-pinned="right"]`).forEach((cell) => {
		visibleRight = Math.min(visibleRight, cell.getBoundingClientRect().left);
	});

	const overshootLeft = targetRect.left - visibleLeft;
	const overshootRight = targetRect.right - visibleRight;
	const centerOffset = (targetRect.left + targetRect.right) / 2 - (visibleLeft + visibleRight) / 2;

	const deltaByAlign: Record<DataTableHorizontalScrollAlign, number> = {
		start: overshootLeft,
		end: overshootRight,
		center: centerOffset,
		auto: overshootLeft < 0 ? overshootLeft : Math.max(overshootRight, 0)
	};
	const delta = deltaByAlign[align];

	if (delta !== 0) {
		// `scrollBy` with a signed delta: negative reveals content to the left,
		// positive to the right. Defaults to instant (not smooth) to match the row
		// `scrollToNode` behaviour and keep focus movement predictable.
		viewport.scrollBy({ left: delta, behavior });
	}
}

/**
 * Keeps the focused header cell / resize separator visible inside the
 * horizontally scrollable viewport. Both are `tabIndex: 0` tab stops, but the
 * browser does not scroll them into view on focus (and a naive scroll would
 * leave them behind the sticky pinned columns), so a keyboard user tabbing
 * across an overflowing header could not see which column was focused.
 *
 * Pointer-driven focus is left alone, as the browser leaves it alone: a
 * `mousedown` on a header (or on a button, checkbox or other control rendered
 * inside one) focuses it *before* `mouseup`, and scrolling at that moment moves
 * the target out from under the pointer, so the `click` never reaches it.
 *
 * @internal
 */
export function useHeaderFocusScroll(viewportEl: HTMLElement | null): void {
	useEffect(() => {
		if (!viewportEl) {
			return;
		}

		// Set while a pointer is pressed inside the viewport; focus that arrives in
		// between is pointer-driven and must not scroll.
		let pointerDown = false;

		const onPointerDown = (): void => {
			pointerDown = true;
		};

		const onPointerUp = (): void => {
			pointerDown = false;
		};

		const onFocusIn = (event: FocusEvent): void => {
			if (pointerDown) {
				return;
			}

			const origin = event.target as HTMLElement | null;
			const target = origin?.closest<HTMLElement>(FOCUS_TARGET_SELECTOR);

			if (!target || !viewportEl.contains(target)) {
				return;
			}

			scrollHeaderTargetIntoView(viewportEl, target);
		};

		viewportEl.addEventListener("pointerdown", onPointerDown);
		// On the window: the pointer may be released outside the viewport (a drag that
		// leaves it, or a scroll that moves the target away), and the flag must reset.
		const win = viewportEl.ownerDocument.defaultView ?? window;
		win.addEventListener("pointerup", onPointerUp);
		win.addEventListener("pointercancel", onPointerUp);
		viewportEl.addEventListener("focusin", onFocusIn);

		return (): void => {
			viewportEl.removeEventListener("pointerdown", onPointerDown);
			win.removeEventListener("pointerup", onPointerUp);
			win.removeEventListener("pointercancel", onPointerUp);
			viewportEl.removeEventListener("focusin", onFocusIn);
		};
	}, [viewportEl]);
}
