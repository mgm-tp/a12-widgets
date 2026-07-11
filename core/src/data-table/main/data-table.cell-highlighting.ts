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
import { useEffect } from "react";

import { DataRoles } from "../../common/main/data-roles.js";

export interface UseCellHighlightingParams {
	tableRef: RefObject<HTMLTableElement | null>;
	cellHighlighting: boolean | undefined;
	disabled: boolean | undefined;
	cardView: boolean | undefined;
}

/**
 * Cross-highlights the column (and nearest enclosing header group) of the
 * hovered/focused body cell by toggling `data-highlighted` on the matching
 * header cells and writing `data-highlight-col-leaf`/`data-highlight-col-group`
 * datasets on the table root for the CSS to read.
 *
 * Purely imperative DOM work driven by delegated mouse/focus listeners on the
 * table element — no React state, so it lives outside the orchestrator render.
 */
export function useCellHighlighting(params: UseCellHighlightingParams): void {
	const { tableRef, cellHighlighting, disabled, cardView } = params;

	useEffect(() => {
		const tableEl = tableRef.current;

		if (!tableEl) {
			return;
		}

		// Leaf index of the currently applied highlight. `mouseover` bubbles from every
		// descendant of a cell, so pointer movement within one cell re-fires the handler;
		// this lets applyHighlight bail out without re-scanning the header. The group
		// highlight is derived purely from the leaf index, so it alone identifies the
		// full applied state.
		let appliedLeafIndex: number | null = null;

		const clearHighlight = (): void => {
			appliedLeafIndex = null;
			delete tableEl.dataset.highlightColLeaf;
			delete tableEl.dataset.highlightColGroup;
			tableEl.querySelectorAll<HTMLTableCellElement>('thead th[data-highlighted="true"]').forEach((th) => {
				th.removeAttribute("data-highlighted");
			});
		};

		if (!cellHighlighting || disabled || cardView) {
			clearHighlight();

			return;
		}

		const bodyCellSelector = `[data-role="${DataRoles.Table.Body.Cell}"]`;

		const applyHighlight = (target: EventTarget | null): void => {
			if (!(target instanceof Element)) {
				return;
			}

			const cell = target.closest<HTMLTableCellElement>(bodyCellSelector);

			if (!cell || !tableEl.contains(cell)) {
				return;
			}

			// The leaf column index is normally the cell's native position within its
			// row — each body row is a single flat <tr> whose cells are emitted in
			// leaf-column order with no leading non-data cells (selection/drag/etc.).
			// That equivalence breaks once a row contains a `colSpan` cell: every cell
			// after the span shifts left by (colSpan - 1). For those rows the cell
			// renderer emits an explicit `data-col-index` carrying the true leaf
			// index, so prefer it and fall back to `cellIndex` otherwise.
			const colIndexAttr = cell.getAttribute("data-col-index");
			const leafIndex = colIndexAttr != null ? Number(colIndexAttr) : cell.cellIndex;

			if (!Number.isFinite(leafIndex) || leafIndex < 0) {
				return;
			}

			if (leafIndex === appliedLeafIndex) {
				return;
			}

			appliedLeafIndex = leafIndex;
			tableEl.dataset.highlightColLeaf = String(leafIndex);

			let nearestGroup: { from: number; to: number } | undefined;

			tableEl.querySelectorAll<HTMLTableCellElement>("thead th[data-leaf-from]").forEach((th) => {
				const fromAttr = th.getAttribute("data-leaf-from");
				const toAttr = th.getAttribute("data-leaf-to");

				if (fromAttr == null || toAttr == null) {
					return;
				}

				const from = Number(fromAttr);
				const to = Number(toAttr);

				if (!Number.isFinite(from) || !Number.isFinite(to)) {
					return;
				}

				if (from <= leafIndex && leafIndex <= to) {
					th.setAttribute("data-highlighted", "true");

					if (from !== to && (!nearestGroup || to - from < nearestGroup.to - nearestGroup.from)) {
						nearestGroup = { from, to };
					}
				} else {
					th.removeAttribute("data-highlighted");
				}
			});

			if (nearestGroup) {
				tableEl.dataset.highlightColGroup = `${nearestGroup.from}-${nearestGroup.to}`;
			} else {
				delete tableEl.dataset.highlightColGroup;
			}
		};

		const handleEnter = (event: Event): void => {
			applyHighlight(event.target);
		};

		const handleLeave = (event: Event): void => {
			const related = (event as { relatedTarget?: EventTarget | null }).relatedTarget ?? null;

			if (related instanceof Element && related.closest(bodyCellSelector)) {
				return;
			}

			clearHighlight();
		};

		tableEl.addEventListener("mouseover", handleEnter);
		tableEl.addEventListener("mouseout", handleLeave);
		tableEl.addEventListener("focusin", handleEnter);
		tableEl.addEventListener("focusout", handleLeave);

		return (): void => {
			tableEl.removeEventListener("mouseover", handleEnter);
			tableEl.removeEventListener("mouseout", handleLeave);
			tableEl.removeEventListener("focusin", handleEnter);
			tableEl.removeEventListener("focusout", handleLeave);
			clearHighlight();
		};
	}, [tableRef, cellHighlighting, disabled, cardView]);
}
