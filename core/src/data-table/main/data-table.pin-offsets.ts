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
import { useLayoutEffect, useMemo, useState } from "react";

import type { BaseColumnType } from "./foundation/column.api.js";

export interface LeafPinOffsets {
	left: number[];
	right: number[];
}

export interface UseLeafPinOffsetsParams<RowType> {
	tableRef: RefObject<HTMLTableElement | null>;
	leafColumns: BaseColumnType<RowType>[];
	leafPinning: (("left" | "right") | undefined)[];
}

/**
 * Measures the cumulative width of pinned leaf columns and returns the sticky
 * `left`/`right` pixel offset each pinned column needs, so stacked pinned columns
 * sit flush instead of overlapping.
 *
 * Runs in a layout effect against the rendered header cells and re-runs via a
 * `ResizeObserver` on the `<thead>`. Unchanged offsets skip the state update;
 * measuring is deferred while a column-resize drag is active.
 */
export function useLeafPinOffsets<RowType>(params: UseLeafPinOffsetsParams<RowType>): LeafPinOffsets {
	const { tableRef, leafColumns, leafPinning } = params;

	const [leafPinOffsets, setLeafPinOffsets] = useState<LeafPinOffsets>(() => ({
		left: new Array(leafColumns.length).fill(0),
		right: new Array(leafColumns.length).fill(0)
	}));

	const hasPinning = useMemo(() => leafPinning.some((p) => p !== undefined), [leafPinning]);

	useLayoutEffect(() => {
		const tableEl = tableRef.current;

		if (!tableEl || !hasPinning) {
			return;
		}

		const leafCount = leafColumns.length;

		// Re-queried on every measure (not captured once): re-renders may recreate the
		// header cells, and stale element references would silently stop tracking them.
		const queryHeadCells = (): HTMLTableCellElement[] =>
			Array.from(tableEl.querySelectorAll<HTMLTableCellElement>('thead th[scope="col"]')).sort((a, b) => {
				const ai = Number(a.getAttribute("data-col-index") ?? 0);
				const bi = Number(b.getAttribute("data-col-index") ?? 0);

				return ai - bi;
			});

		const measure = (): void => {
			const headCells = queryHeadCells();
			const widths = new Array<number>(leafCount).fill(0);

			for (let i = 0; i < leafCount && i < headCells.length; i += 1) {
				widths[i] = headCells[i]?.getBoundingClientRect().width ?? 0;
			}

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

			setLeafPinOffsets((prev) => {
				const sameLeft = prev.left.length === leafCount && prev.left.every((v, i) => v === left[i]);
				const sameRight = prev.right.length === leafCount && prev.right.every((v, i) => v === right[i]);

				return sameLeft && sameRight ? prev : { left, right };
			});
		};

		measure();

		// During a column-resize drag (`data-resizing`, see data-table.resize.ts) the
		// observer fires every frame; measuring then would re-introduce the per-frame
		// React state updates the CSS-variable resize design avoids. Instead, a rAF
		// poll waits for the flag to clear and measures once. Polling (rather than
		// relying on a final observer tick after pointerup) is needed because the
		// pointerup width flush may be a no-op when the last drag frame already
		// applied it, producing no further resize notification.
		let rafId = 0;

		const measureAfterResize = (): void => {
			rafId = 0;

			if (tableEl.dataset.resizing === "true") {
				rafId = requestAnimationFrame(measureAfterResize);

				return;
			}

			measure();
		};

		const handleResizeTick = (): void => {
			if (tableEl.dataset.resizing === "true") {
				if (rafId === 0) {
					rafId = requestAnimationFrame(measureAfterResize);
				}

				return;
			}

			measure();
		};

		// Observe the stable <thead> element rather than the individual <th> cells:
		// re-renders can recreate the cells without re-running this effect, which
		// would leave the observer bound to detached nodes.
		const observer = new ResizeObserver(handleResizeTick);
		const theadEl = tableEl.querySelector("thead");

		if (theadEl) {
			observer.observe(theadEl);
		}

		return (): void => {
			observer.disconnect();

			if (rafId !== 0) {
				cancelAnimationFrame(rafId);
			}
		};
	}, [tableRef, hasPinning, leafColumns, leafPinning]);

	return leafPinOffsets;
}
