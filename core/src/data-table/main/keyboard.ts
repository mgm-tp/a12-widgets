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

import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";

import { DataRoles } from "../../common/main/data-roles.js";

export interface UseRowArrowNavigationParams {
	tableRef: RefObject<HTMLTableElement | null>;
	disabled: boolean;
	rowCount: number;
}

export interface RowArrowNavigationApi {
	isFocused: (rowIndex: number) => boolean;
	handleRowFocus: (rowIndex: number, row?: HTMLTableRowElement) => void;
}

const BODY_ROW_SELECTOR = `tr[data-role="${DataRoles.Table.Body.Row}"]`;

/**
 * Row-level keyboard navigation, mirroring the legacy `Table`: `ArrowUp` /
 * `ArrowDown` move focus between body rows (the `<tr>` itself receives focus via
 * a roving tabindex), clamped at the first / last row (no wrap). `ArrowLeft` /
 * `ArrowRight` are intentionally inert — they neither move focus nor
 * `preventDefault`, so native horizontal scrolling of the viewport still works.
 */
export function useRowArrowNavigation(params: UseRowArrowNavigationParams): RowArrowNavigationApi {
	const { tableRef, disabled, rowCount } = params;

	// The focused row index lives in a ref, not state: moving the roving tabindex
	// must not re-render the whole table to flip two tabIndex values.
	// `handleRowFocus` mutates the DOM tabindex imperatively and updates the ref,
	// so `isFocused`-derived render output stays in sync with the DOM.
	const focusedRef = useRef<number>(0);

	// Row count, synced after each render so the stable callbacks below can clamp
	// against the current data size without changing identity.
	const rowCountRef = useRef(rowCount);

	useEffect(() => {
		rowCountRef.current = rowCount;
	});

	const isFocused = useCallback((rowIndex: number): boolean => {
		// Clamp the stored position to the current row bounds (data may shrink between renders).
		const row = Math.min(focusedRef.current, Math.max(0, rowCountRef.current - 1));

		return row === rowIndex;
	}, []);

	const handleRowFocus = useCallback(
		(rowIndex: number, row?: HTMLTableRowElement): void => {
			if (focusedRef.current === rowIndex) {
				return;
			}

			focusedRef.current = rowIndex;

			// Move the roving tabindex imperatively: demote the previous tab stop,
			// promote the newly focused row. Subsequent React renders reconcile to
			// the same values via `isFocused`, so DOM and virtual DOM stay in sync.
			const table = tableRef.current;

			if (!table) {
				return;
			}

			table.querySelectorAll<HTMLTableRowElement>(`${BODY_ROW_SELECTOR}[tabindex="0"]`).forEach((el) => {
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

	useEffect(() => {
		const table = tableRef.current;

		if (disabled || !table) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent): void => {
			// `ArrowLeft` / `ArrowRight` are no-ops in row mode: return before
			// `preventDefault` so the browser's native horizontal scroll still works.
			if (event.key !== "ArrowUp" && event.key !== "ArrowDown") {
				return;
			}

			const target = event.target;

			if (!(target instanceof Element)) {
				return;
			}

			// Only navigate when the row element itself is the event target — typing
			// in an input or pressing arrows on a button inside a cell must not move
			// the row focus (mirrors the legacy table's `currentRow` guard).
			const rowEl = target.closest<HTMLTableRowElement>(BODY_ROW_SELECTOR);

			if (!rowEl || rowEl !== target || !table.contains(rowEl)) {
				return;
			}

			const tbody = table.tBodies[0];

			if (!tbody) {
				return;
			}

			// Navigate the focusable body-row list, not `tbody.children`: the tbody
			// can interleave non-data rows (DnD hints, expanded content, virtualization
			// spacers, loading placeholders) that are not navigation targets. The
			// `[tabindex]` filter also skips per-row-disabled rows (no tab stop). In
			// windowed modes the list is just the rendered window.
			const rows = tbody.querySelectorAll<HTMLTableRowElement>(`${BODY_ROW_SELECTOR}[tabindex]`);
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

	return { isFocused, handleRowFocus };
}
