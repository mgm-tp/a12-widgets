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

/**
 * Keyboard navigation model for the {@link DropDown}.
 *
 * Navigation used to be derived from the DOM: `querySelectorAll` over the rendered options,
 * rows detected by comparing bounding rectangles, and the active option tracked as a `{row, index}` pair
 * into that array. That only works while every option is mounted, and it re-read the whole list on
 * every keystroke. The model here is built from `items` instead, so a position is a flat index into
 * the item list and stays valid no matter which options are currently rendered.
 *
 * Row grouping is still needed for the `horizontal` (wrapping grid) layout, where it can only come from layout
 * — callers pass it in. A plain vertical list needs no measuring at all: one item per row.
 *
 * @module
 */

import type { DropDownItem } from "./dropdown.tpl.api.js";

/** A navigable option — section headers are not navigable and get no entry. */
export interface NavigationEntry<T = unknown> {
	item: DropDownItem<T>;

	/** Position of the item in the flattened item list, in DOM order. */
	flatIndex: number;

	disabled: boolean;

	/** Id of the section the item belongs to, for `aria-describedby`. */
	sectionId?: string;
}

/**
 * One rendered row of the list: the options a {@link NavigationEntry} exists for,
 * and the section headers between them, which are rendered but never navigated to.
 */
export type RenderRow<T = unknown> =
	| { kind: "section"; item: DropDownItem<T>; sectionId: string }
	| { kind: "option"; item: DropDownItem<T>; flatIndex: number; sectionId?: string };

export interface RenderRows<T = unknown> {
	rows: RenderRow<T>[];

	/** Flat index of an option to the row that renders it; needed to scroll a windowed list to it. */
	rowOfFlatIndex: number[];
}

export interface NavigationModel<T = unknown> {
	entries: NavigationEntry<T>[];

	/** Rows of flat indices. A vertical list has exactly one entry per row. */
	rows: number[][];

	/** Flat index to row. */
	rowOf: number[];

	/** Flat index to column within its row. */
	columnOf: number[];

	allDisabled: boolean;
}

/** Outcome of an arrow keypress. */
export type NavigationStep =
	| { type: "item"; flatIndex: number }

	/** Navigation ran past the first/last row while link options exist above the list. */
	| { type: "linkBoundary"; linkIndex: number }
	| { type: "none" };

const NO_STEP: NavigationStep = { type: "none" };

interface Position {
	row: number;
	column: number;
}

/**
 * Lays `items` out as the rows the list renders, flattening sections exactly as
 * {@link buildNavigationModel} does — so the `flatIndex` a row carries addresses the same entry the
 * model holds. A windowed list renders from here rather than from the entries, which hold no section
 * headers and would drop them from a window.
 * @param items the dropdown items, possibly containing sections with `children`
 */
export function buildRenderRows<T>(items: DropDownItem<T>[]): RenderRows<T> {
	const rows: RenderRow<T>[] = [];
	const rowOfFlatIndex: number[] = [];
	let flatIndex = 0;

	const pushOption = (item: DropDownItem<T>, sectionId?: string): void => {
		rowOfFlatIndex[flatIndex] = rows.length;
		rows.push({ kind: "option", item, flatIndex, sectionId });
		flatIndex++;
	};

	for (const [index, item] of items.entries()) {
		if (item.children) {
			const sectionId = item.id ?? `section-${index}`;

			rows.push({ kind: "section", item, sectionId });

			for (const child of item.children) {
				pushOption(child, sectionId);
			}
		} else {
			pushOption(item);
		}
	}

	return { rows, rowOfFlatIndex };
}

/**
 * Flattens `items` into navigable entries and indexes them by row.
 *
 * Flattens exactly the one level of sections the list renders: a top-level item with `children`
 * becomes a section whose children are options, and an item nested deeper is an option of its own,
 * as it is rendered. Recursing further would number entries the list has no elements for, leaving
 * every `flatIndex` past the first deeper nesting addressing a different option than the one on
 * screen.
 * @param items the dropdown items, possibly containing sections with `children`
 * @param rows row grouping of flat indices; defaults to one item per row (vertical layout)
 */
export function buildNavigationModel<T>(items: DropDownItem<T>[], rows?: number[][]): NavigationModel<T> {
	const entries: NavigationEntry<T>[] = [];

	const collect = (candidates: DropDownItem<T>[], sectionId?: string): void => {
		for (const [index, candidate] of candidates.entries()) {
			if (candidate.children && sectionId === undefined) {
				collect(candidate.children, candidate.id ?? `section-${index}`);
			} else {
				entries.push({
					item: candidate,
					flatIndex: entries.length,
					disabled: !!candidate.disabled,
					sectionId
				});
			}
		}
	};

	collect(items);

	const effectiveRows = rows ?? entries.map((entry) => [entry.flatIndex]);
	const rowOf: number[] = [];
	const columnOf: number[] = [];

	for (const [row, indices] of effectiveRows.entries()) {
		for (const [column, flatIndex] of indices.entries()) {
			rowOf[flatIndex] = row;
			columnOf[flatIndex] = column;
		}
	}

	return {
		entries,
		rows: effectiveRows,
		rowOf,
		columnOf,
		allDisabled: entries.length > 0 && entries.every((entry) => entry.disabled)
	};
}

function entryAt(model: NavigationModel, position: Position): NavigationEntry | undefined {
	const flatIndex = model.rows[position.row]?.[position.column];

	return flatIndex === undefined ? undefined : model.entries[flatIndex];
}

function positionOf(model: NavigationModel, flatIndex: number): Position | undefined {
	const row = model.rowOf[flatIndex];

	return row === undefined ? undefined : { row, column: model.columnOf[flatIndex] };
}

/**
 * Moves one row up or down, keeping the column. Wraps around at both ends and skips disabled
 * options, exactly like the previous DOM-based implementation did.
 * @param model the navigation model
 * @param from flat index of the currently active option
 * @param direction 1 to move down, -1 to move up
 * @param linkCount number of link options rendered above the list
 */
export function getNextVerticalStep(
	model: NavigationModel,
	from: number,
	direction: 1 | -1,
	linkCount = 0
): NavigationStep {
	const start = positionOf(model, from);

	if (!start) {
		return NO_STEP;
	}

	const lastRow = model.rows.length - 1;
	let position = start;

	// Bounded by the row count: a column that exists in no other row would otherwise recurse forever.
	for (let attempt = 0; attempt <= lastRow; attempt++) {
		// Arrowing down off the last row (or up off the first) hands over to the link options.
		// Checked on every hop, not just the starting row: a disabled option at the edge leaves the list on the second.
		if (linkCount > 0 && ((position.row === lastRow && direction > 0) || (position.row === 0 && direction < 0))) {
			return { type: "linkBoundary", linkIndex: direction > 0 ? 0 : linkCount - 1 };
		}

		const nextRow =
			position.row === lastRow && direction > 0
				? 0
				: position.row === 0 && direction < 0
					? lastRow
					: position.row + direction;
		position = { row: nextRow, column: start.column };

		const entry = entryAt(model, position);

		if (entry && !entry.disabled) {
			return { type: "item", flatIndex: entry.flatIndex };
		}
	}

	return NO_STEP;
}

/**
 * Moves one column left or right within the wrapping grid, spilling into the neighbouring row at the
 * edges. Only meaningful for the `horizontal` layout.
 * @param model the navigation model
 * @param from flat index of the currently active option
 * @param direction 1 to move right, -1 to move left
 */
export function getNextHorizontalStep(model: NavigationModel, from: number, direction: 1 | -1): NavigationStep {
	const start = positionOf(model, from);

	if (!start) {
		return NO_STEP;
	}

	const lastRow = model.rows.length - 1;
	let position = start;

	// Bounded by the total option count: every option can be visited at most once.
	for (let attempt = 0; attempt <= model.entries.length; attempt++) {
		const rowLength = model.rows[position.row]?.length ?? 0;

		if (direction > 0) {
			const atRowEnd = position.column === rowLength - 1;
			position = {
				row: atRowEnd ? (position.row < lastRow ? position.row + 1 : 0) : position.row,
				column: atRowEnd ? 0 : position.column + 1
			};
		} else {
			const atRowStart = position.column === 0;
			const nextRow = atRowStart ? (position.row > 0 ? position.row - 1 : lastRow) : position.row;
			position = {
				row: nextRow,
				column: atRowStart ? (model.rows[nextRow]?.length ?? 0) - 1 : position.column - 1
			};
		}

		const entry = entryAt(model, position);

		if (entry && !entry.disabled) {
			return { type: "item", flatIndex: entry.flatIndex };
		}
	}

	return NO_STEP;
}

/**
 * First/last option to activate when navigation starts without an active option.
 *
 * Disabled options are skipped, the same way stepping through the list skips them: arrowing into a
 * list whose first option happens to be disabled used to activate that option, which the selection
 * keys would then go on to select.
 */
export function getEdgeStep(model: NavigationModel, direction: 1 | -1): NavigationStep {
	const flatIndex = findEdgeIndex(model, direction);

	return flatIndex === undefined ? NO_STEP : { type: "item", flatIndex };
}

/**
 * Flat index of the first or last option that can be activated, skipping disabled ones.
 * Needs no row grouping, so callers that never measure a wrapping grid can use it too.
 * @param model the navigation model
 * @param direction 1 to search from the top, -1 from the bottom
 */
export function findEdgeIndex(model: NavigationModel, direction: 1 | -1): number | undefined {
	const { entries } = model;

	if (direction > 0) {
		return entries.find((entry) => !entry.disabled)?.flatIndex;
	}

	// Loop backwards instead of reversing a copy: this runs on every arrow key press with no active option
	// and copying the whole list just to read its last entry is too expensive for a long list.
	for (let index = entries.length - 1; index >= 0; index--) {
		const entry = entries[index];

		if (!entry.disabled) {
			return entry.flatIndex;
		}
	}

	return undefined;
}

/**
 * Flat index of the option `item` stands for, or `undefined` when the list does not hold it.
 * @param model the navigation model
 * @param item the option to look up
 * @param isSame compares two options for identity
 */
export function findItemIndex<T>(
	model: NavigationModel<T>,
	item: DropDownItem<T> | undefined,
	isSame: (one: DropDownItem<T> | undefined, other: DropDownItem<T> | undefined) => boolean
): number | undefined {
	if (!item) {
		return undefined;
	}

	return model.entries.find((entry) => isSame(entry.item, item))?.flatIndex;
}
