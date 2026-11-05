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

import type { Key, RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";

import { DataRoles } from "../../common/main/data-roles.js";

import type { RowTabStopFallbackKeys } from "./data-table.row-tab-stop.js";
import type { RowReorderApi } from "./dnd/index.js";

export interface UseRowArrowNavigationParams {
	tableRef: RefObject<HTMLTableElement | null>;
	disabled: boolean;
	rowCount: number;

	/** Stable key of the row at `rowIndex`. */
	rowKeyForIndex: (rowIndex: number) => Key;

	/** Index of the row carrying `key`, or `-1` when no visible row does. */
	indexForRowKey: (key: Key) => number;

	/** The row's element, or `null` when it is not currently rendered. */
	getRowElement: (rowIndex: number) => HTMLElement | null;

	/** See {@link RowTabStopFallbackKeys}. Absent for a plain `DataTable`. */
	rowFallbackKeys?: RowTabStopFallbackKeys;

	/**
	 * Keyboard "grab-and-move" reordering. When a row is grabbed, `ArrowUp` / `ArrowDown` move the row
	 * (via {@link RowReorderApi.move}) instead of moving focus; `Space` toggles the grab and `Escape`
	 * cancels it. Absent / `enabled: false` leaves navigation unchanged.
	 */
	reorder?: RowReorderApi;
}

/**
 * The row owning the roving tab stop. Anchored by {@link key}, because expanding a tree node,
 * sorting or filtering renumbers rows and the index alone would then point at a different row.
 */
interface FocusedRow {
	/** Data index of the tracked row — what `isFocused` reports. */
	index: number;

	/** Identity {@link index} stands for, or `null` before focus has ever landed. */
	key: Key | null;

	/** Replacement keys, nearest first, for when {@link key} leaves the data. */
	fallbackKeys: Key[];
}

/**
 * Re-anchor the tab stop after the tracked row left the data: onto the nearest fallback row still
 * present, else back to the first-row default.
 */
function retargetTabStop(fallbackKeys: Key[], indexForRowKey: (key: Key) => number): FocusedRow {
	for (let position = 0; position < fallbackKeys.length; position++) {
		const key = fallbackKeys[position];
		const index = key === undefined ? -1 : indexForRowKey(key);

		if (key !== undefined && index >= 0) {
			// Only the keys above the adopted row survive, so a further collapse carries on upwards.
			return { index, key, fallbackKeys: fallbackKeys.slice(position + 1) };
		}
	}

	return { index: 0, key: null, fallbackKeys: [] };
}

export interface RowArrowNavigationApi {
	isFocused: (rowIndex: number) => boolean;
	handleRowFocus: (rowIndex: number, row?: HTMLElement) => void;

	/**
	 * Guarantee that some rendered body row carries the roving tab stop — the tracked row may have
	 * scrolled out of a windowed body, or been re-anchored onto a row that skipped re-rendering.
	 * Called by the hook when the rows change, and by the windowed bodies after each commit.
	 */
	ensureTabStop: () => void;
}

// Matched on the `data-role` alone, with no element prefix: a body row is a `<tr>` in
// the table layout and a card `<div>` in card view, and only body rows carry this role
// in either. The queries below then work unchanged for both.
const BODY_ROW_SELECTOR = `[data-role="${DataRoles.Table.Body.Row}"]`;

/**
 * Row-level keyboard navigation, mirroring the legacy `Table`: `ArrowUp` /
 * `ArrowDown` move focus between body rows (the `<tr>` itself receives focus via
 * a roving tabindex), clamped at the first / last row (no wrap). `ArrowLeft` /
 * `ArrowRight` are intentionally inert — they neither move focus nor
 * `preventDefault`, so native horizontal scrolling of the viewport still works.
 */
export function useRowArrowNavigation(params: UseRowArrowNavigationParams): RowArrowNavigationApi {
	const { tableRef, disabled, rowCount, rowKeyForIndex, indexForRowKey, getRowElement, rowFallbackKeys, reorder } =
		params;

	// The keydown listener is bound once; read the latest reorder API through a ref so a new
	// `dragDropOptions` / grabbed state is always seen without re-binding.
	const reorderRef = useRef<RowReorderApi | undefined>(reorder);
	reorderRef.current = reorder;

	// Read through refs so `handleRowFocus` / `ensureTabStop` keep a stable identity — both are
	// table-context dependencies, so a new one would re-render every body row.
	const rowKeyForIndexRef = useRef(rowKeyForIndex);
	const rowFallbackKeysRef = useRef(rowFallbackKeys);
	const getRowElementRef = useRef(getRowElement);

	rowKeyForIndexRef.current = rowKeyForIndex;
	rowFallbackKeysRef.current = rowFallbackKeys;
	getRowElementRef.current = getRowElement;

	// The focused row lives in a ref, not state: moving the roving tabindex
	// must not re-render the whole table to flip two tabIndex values.
	// `handleRowFocus` mutates the DOM tabindex imperatively and updates the ref,
	// so `isFocused`-derived render output stays in sync with the DOM.
	const focusedRef = useRef<FocusedRow>({ index: 0, key: null, fallbackKeys: [] });

	// Clamp and re-anchor in the render pass, not an effect, so the position `isFocused` reports
	// describes this render's rows. Both are idempotent under StrictMode's double render.
	focusedRef.current.index = Math.min(focusedRef.current.index, Math.max(0, rowCount - 1));

	const focused = focusedRef.current;

	// The index no longer resolves to the tracked row: it moved (expand / collapse / sort / filter)
	// or it is gone. O(1) unless it actually moved.
	if (focused.key !== null && rowKeyForIndex(focused.index) !== focused.key) {
		const index = indexForRowKey(focused.key);

		focusedRef.current = index >= 0 ? { ...focused, index } : retargetTabStop(focused.fallbackKeys, indexForRowKey);
	}

	const isFocused = useCallback((rowIndex: number): boolean => focusedRef.current.index === rowIndex, []);

	const handleRowFocus = useCallback(
		(rowIndex: number, row?: HTMLElement): void => {
			focusedRef.current = {
				index: rowIndex,
				key: rowKeyForIndexRef.current(rowIndex),
				// Captured now, while the ancestors are still visible — a collapsed row leaves no record.
				fallbackKeys: rowFallbackKeysRef.current?.(rowIndex) ?? []
			};

			// Move the roving tabindex imperatively: demote the previous tab stop,
			// promote the newly focused row. Subsequent React renders reconcile to
			// the same values via `isFocused`, so DOM and virtual DOM stay in sync.
			// Always run the demote pass, even when `rowIndex` is unchanged — a
			// windowed fallback promotion (see `ensureTabStop`) can have left an
			// extra tab stop on a different row.
			const table = tableRef.current;

			if (!table) {
				return;
			}

			table.querySelectorAll<HTMLElement>(`${BODY_ROW_SELECTOR}[tabindex="0"]`).forEach((el) => {
				if (el !== row) {
					el.tabIndex = -1;
				}
			});

			if (row) {
				row.tabIndex = 0;
			}
		},
		[tableRef]
	);

	// Set by `ensureTabStop` when it promotes a row that React rendered with
	// `tabIndex=-1`; tracked so the promotion can be retired the moment the real
	// focused row re-enters the rendered window (two tab stops otherwise).
	const fallbackRowRef = useRef<HTMLElement | null>(null);

	const ensureTabStop = useCallback((): void => {
		const table = tableRef.current;

		if (disabled || !table) {
			return;
		}

		const stops = table.querySelectorAll<HTMLElement>(`${BODY_ROW_SELECTOR}[tabindex="0"]`);
		const fallback = fallbackRowRef.current;

		// A tab stop other than our fallback exists (React rendered the focused
		// row, or focus moved): retire the fallback promotion.
		let declared: HTMLElement | null = null;

		stops.forEach((el) => {
			if (el !== fallback) {
				declared = el;
			}
		});

		if (declared) {
			if (fallback && fallback.isConnected && fallback !== declared) {
				fallback.tabIndex = -1;
			}

			fallbackRowRef.current = null;

			return;
		}

		// Nothing holds the tab stop but the tracked row is on screen: it skipped re-rendering (rows
		// are memoized on their own state, which excludes this) and kept its old `tabIndex`.
		const tracked = getRowElementRef.current(focusedRef.current.index);

		if (tracked?.isConnected) {
			if (fallback && fallback.isConnected && fallback !== tracked) {
				fallback.tabIndex = -1;
			}

			tracked.tabIndex = 0;
			// The tracked row itself, not a stand-in — nothing to retire later.
			fallbackRowRef.current = null;

			return;
		}

		// The fallback is still the only stop and still rendered: keep it.
		if (fallback && fallback.isConnected && fallback.tabIndex === 0) {
			return;
		}

		fallbackRowRef.current = null;

		// No rendered body row carries the tab stop — the focused row scrolled out
		// of the rendered window and unmounted. Promote the first navigable rendered
		// row so the body stays reachable via Tab (per-row-disabled rows render no
		// `tabindex` attribute and are skipped).
		const first = table.querySelector<HTMLElement>(`${BODY_ROW_SELECTOR}[tabindex="-1"]`);

		if (first) {
			first.tabIndex = 0;
			fallbackRowRef.current = first;
		}
	}, [tableRef, disabled]);

	// Push the re-anchored position onto the DOM: the row that just gained the tab stop may have
	// skipped re-rendering, leaving the body with no tab stop at all. Keyed on `indexForRowKey`,
	// whose identity tracks `data` — the row set changing is the only thing that can move the stop.
	useEffect(() => {
		ensureTabStop();
	}, [ensureTabStop, indexForRowKey]);

	useEffect(() => {
		const table = tableRef.current;

		if (disabled || !table) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent): void => {
			const target = event.target;

			if (!(target instanceof Element)) {
				return;
			}

			// Only act when the row element itself is the event target — typing in an input or pressing
			// keys on a button inside a cell must not move / reorder the row (mirrors the legacy table's
			// `currentRow` guard).
			const rowEl = target.closest<HTMLElement>(BODY_ROW_SELECTOR);

			if (!rowEl || rowEl !== target || !table.contains(rowEl)) {
				return;
			}

			const reorderApi = reorderRef.current;

			// Space toggles the grab (pick up / drop); Escape cancels an active grab. Both are keyboard
			// drag-and-drop, so they only apply when reordering is enabled / a grab is in progress.
			if ((event.key === " " || event.key === "Spacebar") && reorderApi?.enabled) {
				event.preventDefault();
				reorderApi.toggleGrab(focusedRef.current.index);

				return;
			}

			if (event.key === "Escape" && reorderApi?.isGrabbed()) {
				event.preventDefault();
				reorderApi.cancelGrab();

				return;
			}

			// `ArrowLeft` / `ArrowRight` are no-ops in row mode: return before `preventDefault` so the
			// browser's native horizontal scroll still works.
			if (event.key !== "ArrowUp" && event.key !== "ArrowDown") {
				return;
			}

			// While grabbed, arrows reorder the row instead of moving focus (the moved row keeps focus).
			if (reorderApi?.isGrabbed()) {
				event.preventDefault();
				reorderApi.move(focusedRef.current.index, event.key === "ArrowDown" ? "down" : "up");

				return;
			}

			// Scope to the `<tbody>` in the table layout, falling back to the root for card
			// view — whose root is a `<div>` holding a `role="list"` of cards, so `tBodies`
			// is `undefined` there rather than empty (hence the optional chain). Both scopes
			// see the same rows: only body rows carry `BODY_ROW_SELECTOR`, so widening to the
			// root pulls in no footer or header row.
			const rowsContainer: Element = table.tBodies?.[0] ?? table;

			// Navigate the focusable body-row list, not the container's `children`: it
			// can interleave non-data rows (DnD hints, expanded content, virtualization
			// spacers, loading placeholders) that are not navigation targets. The
			// `[tabindex]` filter also skips per-row-disabled rows (no tab stop). In
			// windowed modes the list is just the rendered window.
			const rows = rowsContainer.querySelectorAll<HTMLElement>(`${BODY_ROW_SELECTOR}[tabindex]`);
			const row = Array.prototype.indexOf.call(rows, rowEl);

			if (row < 0) {
				return;
			}

			const lastRow = rows.length - 1;
			const nextRow = event.key === "ArrowDown" ? Math.min(lastRow, row + 1) : Math.max(0, row - 1);

			event.preventDefault();

			if (nextRow === row) {
				return;
			}

			const nextRowEl = rows[nextRow];

			if (!nextRowEl) {
				return;
			}

			// Focusing routes through the row's `onFocus`, which reports the row's
			// own data index to `handleRowFocus` — correct in every mode, including
			// windowed bodies where DOM order ≠ data index.
			nextRowEl.focus();
		};

		table.addEventListener("keydown", handleKeyDown);

		return (): void => {
			table.removeEventListener("keydown", handleKeyDown);
		};
	}, [tableRef, disabled]);

	return { isFocused, handleRowFocus, ensureTabStop };
}
