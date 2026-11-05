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

import type { DataTableRenderPropsType } from "../data-table-renderer.api.js";
import type { TableDragDropOptions } from "../foundation/table.api.js";

import type { ClientOffset } from "./data-table.dnd.constants.js";
import { EXPANDABLE_ROW_ROLE } from "./data-table.dnd.constants.js";

/*
 * The arithmetic behind the row-shift drop-gap preview, kept free of React and of
 * any DOM *writes* so each rule can be exercised directly (see
 * `__tests__/data-table.dnd-geometry.test.ts`). The two functions that do touch
 * the DOM read only — `currentTranslateY` and `rowShiftTargets` — because the
 * geometry is defined against the live layout.
 */

/**
 * The vertical component of the element's *current* (animated) `translate`.
 * The shift preview is a transition, so at any instant the row may be anywhere
 * between its old and new offset — `getBoundingClientRect` returns that
 * interpolated position, and only subtracting the equally-interpolated computed
 * `translate` recovers the row's logical (untransformed) rect exactly. Reading
 * the target value instead (e.g. from the inline style) would misplace the
 * logical rect for the full duration of every transition.
 */
export function currentTranslateY(element: HTMLElement): number {
	const translate = getComputedStyle(element).translate;

	if (!translate || translate === "none") {
		return 0;
	}

	const parts = translate.split(" ");

	return parts.length > 1 ? parseFloat(parts[1]) || 0 : 0;
}

/**
 * The elements that move as one unit with a body row: the `<tr>` itself plus
 * any inline expansion rows rendered directly after it. Shifting (or hiding)
 * only the row would tear it from its expansion panel.
 */
export function rowShiftTargets(rowEl: HTMLElement): HTMLElement[] {
	const targets = [rowEl];
	let sibling = rowEl.nextElementSibling;

	while (sibling instanceof HTMLElement && sibling.getAttribute("data-role") === EXPANDABLE_ROW_ROLE) {
		targets.push(sibling);
		sibling = sibling.nextElementSibling;
	}

	return targets;
}

/**
 * Vertical shift (px) row `rowIndex` gets while the projected insertion gap is
 * `gapIndex`: rows between the dragged row's slot and the gap slide toward the
 * source, migrating its hole to the gap. For a cross-table drag (`sourceIndex`
 * null — the source lives in another table) every row at/after the gap moves
 * down to open room for the incoming row.
 *
 * @internal
 */
export function shiftForRow(
	rowIndex: number,
	sourceIndex: number | null,
	gapIndex: number,
	dragHeight: number
): number {
	if (sourceIndex === null) {
		return rowIndex >= gapIndex ? dragHeight : 0;
	}

	if (gapIndex > sourceIndex + 1 && rowIndex > sourceIndex && rowIndex < gapIndex) {
		return -dragHeight;
	}

	if (gapIndex < sourceIndex && rowIndex >= gapIndex && rowIndex < sourceIndex) {
		return dragHeight;
	}

	return 0;
}

/**
 * Vertical shift (px) the dragged row's OWN slot gets so its dashed drop-slot
 * placeholder rides into the gap that {@link shiftForRow} opens: the parting rows
 * migrate the source's freed slot to the projected insertion point, and this moves
 * the source to land exactly in it. `0` when the gap is the source's own slot
 * (`gapIndex === sourceIndex` / `sourceIndex + 1`, no move) or none is accepted.
 * Only meaningful for a local source (`sourceIndex` non-null).
 *
 * @internal
 */
export function slotShiftForSource(sourceIndex: number, gapIndex: number, dragHeight: number): number {
	if (gapIndex > sourceIndex + 1) {
		return (gapIndex - 1 - sourceIndex) * dragHeight;
	}

	if (gapIndex < sourceIndex) {
		return (gapIndex - sourceIndex) * dragHeight;
	}

	return 0;
}

/**
 * Which gap a drop on the hovered body row targets: the pointer in the row's top
 * half inserts **before** it (gap = its index), the bottom half **after** it (gap
 * = index + 1).
 *
 * @internal
 */
export function dropGapForRow(rect: { top: number; height: number }, pointerY: number): "before" | "after" {
	return pointerY < rect.top + rect.height / 2 ? "before" : "after";
}

/**
 * The data index the dragged row occupies **after** a drop into insertion gap
 * `gapIndex`: removing the source first shifts every later gap down by one, so a
 * downward move lands one slot before the raw gap. Mirrors the reorder arithmetic
 * consumers apply in `onDrop` — shared by the pointer drop and the keyboard move so
 * the post-move flash highlights the row's real resting slot.
 *
 * @internal
 */
export function landingIndexForGap(sourceIndex: number, gapIndex: number): number {
	return sourceIndex < gapIndex ? gapIndex - 1 : gapIndex;
}

/**
 * Default `canDrop` evaluation shared by the shift-preview gating, the pointer
 * drop resolution and the keyboard move: consumer `canDrop` when provided,
 * otherwise any row except the dragged one.
 *
 * @internal
 */
export function canDropOnTarget<RowType>(
	options: TableDragDropOptions<RowType>,
	dragItem: DataTableRenderPropsType.DragObject<RowType>,
	hoveredItem: DataTableRenderPropsType.HoveredObject<RowType>
): boolean {
	if (options.canDrop) {
		return options.canDrop({ dragItem, hoveredItem });
	}

	return dragItem.row !== hoveredItem.row;
}

/**
 * The projected insertion gap resolved from a pointer position, or `null` off any row.
 *
 * @internal
 */
export interface ResolvedGap<RowType> {
	/** Insertion index of the projected gap (`0…rowCount`). */
	gapIndex: number;

	/** Index of the hovered row whose top/bottom half determined the gap. */
	rowIndex: number;

	/** The hovered row. */
	row: RowType;
}

/**
 * Resolves the projected insertion gap under `point` against the registered
 * rows' **logical** (untransformed) rects: while rows are shifted apart to
 * preview the gap, their on-screen rects have moved — hit-testing those directly
 * would oscillate (the hovered row slides away from the pointer, flipping the
 * target back) and a release over the visually opened gap would land on no row at
 * all. The applied offset is read back from each row's computed `translate` (see
 * {@link currentTranslateY}) and subtracted, recovering the resting rect.
 *
 * The pointer in the hovered row's top half projects the gap **before** it, in the
 * bottom half **after** it (see {@link dropGapForRow}).
 *
 * @internal
 */
export function resolveProjectedGap<RowType>(
	registry: DataTableRenderPropsType.DndRowRegistry<RowType>,
	point: ClientOffset
): ResolvedGap<RowType> | null {
	for (const [rowIndex, entry] of registry) {
		const element = entry.element;

		if (!element.isConnected) {
			continue;
		}

		const shift = currentTranslateY(element);
		const rect = element.getBoundingClientRect();
		const top = rect.top - shift;
		const bottom = rect.bottom - shift;

		if (point.x >= rect.left && point.x < rect.right && point.y >= top && point.y < bottom) {
			const gap = dropGapForRow({ top, height: bottom - top }, point.y);

			return { rowIndex, row: entry.row, gapIndex: gap === "before" ? rowIndex : rowIndex + 1 };
		}
	}

	return null;
}
