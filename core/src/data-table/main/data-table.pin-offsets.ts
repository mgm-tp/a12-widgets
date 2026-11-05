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
import { useMemo } from "react";

import { useTheadMeasure } from "./data-table.thead-measure.js";
import type { BaseColumnType } from "./foundation/column.api.js";

/**
 * CSS custom property carrying leaf `i`'s cumulative left-pin offset (px), written
 * on the `<table>` root. Pinned body/head/foot cells reference it through the
 * shared `--a12-data-table-pin-offset` channel (see `useCellPinning`).
 */
export const pinLeftVar = (leafIndex: number): string => `--a12-pin-left-${leafIndex}`;

/** As {@link pinLeftVar}, for the right-pin edge. */
export const pinRightVar = (leafIndex: number): string => `--a12-pin-right-${leafIndex}`;

/**
 * Write each pinned leaf's sticky `left`/`right` pixel offset to its
 * `--a12-pin-left-N` / `--a12-pin-right-N` custom property on the `<table>` root,
 * from the per-leaf `widths` given. A left-pinned leaf's offset is the cumulative
 * width of the left-pinned leaves before it; a right-pinned leaf's is the
 * cumulative width of the right-pinned leaves after it. Vars for unpinned leaves
 * are removed, so a formerly pinned column leaves no stale offset behind.
 *
 * Written imperatively (not via React state) so an update never re-renders the
 * pinned cells; they read the value through the shared
 * `--a12-data-table-pin-offset` channel (see `useCellPinning`).
 *
 * Shared by the two owners of these vars: the `<thead>` measure in
 * {@link useLeafPinOffsetCssVars} (steady state) and the column-resize handler
 * (during a drag, where the measure is deferred — see `useColumnResize`).
 *
 * @internal
 */
export function writeLeafPinOffsets(
	tableEl: HTMLTableElement,
	widths: readonly number[],
	leafPinning: readonly (("left" | "right") | undefined)[]
): void {
	const leafCount = widths.length;
	const left = new Array<number>(leafCount).fill(0);
	let cumulativeLeft = 0;

	for (let i = 0; i < leafCount; i += 1) {
		if (leafPinning[i] === "left") {
			left[i] = cumulativeLeft;
			cumulativeLeft += widths[i];
		}
	}

	const right = new Array<number>(leafCount).fill(0);
	let cumulativeRight = 0;

	for (let i = leafCount - 1; i >= 0; i -= 1) {
		if (leafPinning[i] === "right") {
			right[i] = cumulativeRight;
			cumulativeRight += widths[i];
		}
	}

	for (let i = 0; i < leafCount; i += 1) {
		if (leafPinning[i] === "left") {
			tableEl.style.setProperty(pinLeftVar(i), `${left[i]}px`);
		} else {
			tableEl.style.removeProperty(pinLeftVar(i));
		}

		if (leafPinning[i] === "right") {
			tableEl.style.setProperty(pinRightVar(i), `${right[i]}px`);
		} else {
			tableEl.style.removeProperty(pinRightVar(i));
		}
	}
}

export interface UseLeafPinOffsetsParams<RowType> {
	tableRef: RefObject<HTMLTableElement | null>;
	leafColumns: BaseColumnType<RowType>[];
	leafPinning: (("left" | "right") | undefined)[];
}

/**
 * Measures the cumulative width of pinned leaf columns and writes each pinned
 * column's sticky `left`/`right` pixel offset to a `--a12-pin-left-N` /
 * `--a12-pin-right-N` custom property on the `<table>` root, so stacked pinned
 * columns sit flush instead of overlapping. Cells read their offset through the
 * `--a12-data-table-pin-offset` channel (see `useCellPinning`) — the same
 * imperative-CSS-variable design column resize uses (`--a12-col-N-width`),
 * avoiding the per-measure React re-render a state round-trip would cause.
 *
 * Runs in a layout effect against the rendered header cells and re-runs via a
 * `ResizeObserver` on the `<thead>` (see {@link useTheadMeasure}); measuring is
 * deferred while a column-resize drag is active, since the resize handler already
 * owns the column-width vars every frame and re-measuring pin offsets then is
 * redundant layout thrash.
 */
export function useLeafPinOffsetCssVars<RowType>(params: UseLeafPinOffsetsParams<RowType>): void {
	const { tableRef, leafColumns, leafPinning } = params;

	const hasPinning = useMemo(() => leafPinning.some((p) => p !== undefined), [leafPinning]);
	const leafCount = leafColumns.length;

	useTheadMeasure({
		tableRef,
		enabled: hasPinning,
		deferDuringResize: true,
		// Pinned columns must sit flush even with `hideHeader` (no `<thead>` to
		// measure) — fall back to the first body row's cells below.
		fallbackToBody: true,
		measure: (tableEl): void => {
			// Re-queried on every measure (not captured once): re-renders may recreate the
			// header cells, and stale element references would silently stop tracking them.
			const headCells = Array.from(tableEl.querySelectorAll<HTMLTableCellElement>('thead th[scope="col"]')).sort(
				(a, b) => {
					const ai = Number(a.getAttribute("data-col-index") ?? 0);
					const bi = Number(b.getAttribute("data-col-index") ?? 0);

					return ai - bi;
				}
			);

			const widths = new Array<number>(leafCount).fill(0);

			if (headCells.length > 0) {
				for (let i = 0; i < leafCount && i < headCells.length; i += 1) {
					widths[i] = headCells[i]?.getBoundingClientRect().width ?? 0;
				}
			} else {
				// `hideHeader`: no header cells to measure. The first body row's `<td>`s
				// carry the same per-column widths under `table-layout: fixed`; read them
				// in DOM order (leaf order when the row has no column-spanning cell — the
				// edge case where a pinned column is also spanned is not supported here).
				const firstRow = tableEl.querySelector<HTMLTableRowElement>("tbody tr");
				const bodyCells = firstRow ? Array.from(firstRow.cells) : [];

				for (let i = 0; i < leafCount && i < bodyCells.length; i += 1) {
					widths[i] = bodyCells[i]?.getBoundingClientRect().width ?? 0;
				}
			}

			writeLeafPinOffsets(tableEl, widths, leafPinning);
		},
		onCleanup: (tableEl): void => {
			// Clear the written vars so a later unpinned/re-columned layout doesn't
			// keep stale sticky offsets (the effect early-returns when `!hasPinning`).
			for (let i = 0; i < leafCount; i += 1) {
				tableEl.style.removeProperty(pinLeftVar(i));
				tableEl.style.removeProperty(pinRightVar(i));
			}
		},
		deps: [tableRef, hasPinning, leafColumns, leafPinning]
	});
}
