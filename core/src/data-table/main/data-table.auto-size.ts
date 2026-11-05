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
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useTheme } from "styled-components";

import { ACTION_COLUMN_AUTOSIZE_PADDING, FIXED_WIDTH_BASE_PX, isAutoSizeActionColumn } from "./data-table.utils.js";
import type { BaseColumnType } from "./foundation/column.api.js";

/**
 * Measure the natural (unconstrained) width of a column from its live cells, using
 * the off-layout DOM-clone technique (the approach ag-grid uses): clone the rendered
 * cells, strip their width constraints, stack them vertically inside a `position: fixed`
 * dummy and read its `offsetWidth` — which ends up as wide as the widest clone.
 *
 * `gridBody` must be an element the cells visually inherit from (font / padding) so the
 * clones lay out with the same metrics as the live cells. Returns the measured px plus
 * `extraPadding`, or `-1` when nothing is rendered (caller skips — never sets a
 * padding-only width).
 *
 * The technique is column-agnostic: it takes the cells to measure, not a column.
 *
 * @internal
 */
export function measureColumnContentWidth(opts: {
	gridBody: HTMLElement;
	cells: readonly HTMLElement[];
	headerCell?: HTMLElement | null;
	extraPadding?: number;
}): number {
	const { gridBody, cells, headerCell, extraPadding = 0 } = opts;
	const targets = headerCell ? [...cells, headerCell] : [...cells];

	if (targets.length === 0) {
		// Nothing rendered → caller skips (no padding-only width).
		return -1;
	}

	/**
	 * A copy of `cell` stripped of everything that would constrain or displace it, so it
	 * lays out at its natural content width once re-parented outside the table.
	 */
	const toMeasurableClone = (cell: HTMLElement): HTMLElement => {
		const clone = cell.cloneNode(true) as HTMLElement;

		// Drop the fixed column width so the clone sizes to its content.
		clone.style.width = "";
		clone.style.minWidth = "";
		clone.style.maxWidth = "";
		// A pinned/sticky cell carries `position`/`left`; strip them so the clone lays
		// out in normal flow (measurement is unaffected by the live cell's stickiness).
		clone.style.position = "static";
		clone.style.left = "";
		// A `<td>` outside a `<table>` won't lay out as a cell — force a block box.
		clone.style.display = "block";
		// Natural, unwrapped width.
		clone.style.whiteSpace = "nowrap";

		return clone;
	};

	// Off-layout scratch container: `fixed` keeps it out of the table's own flow, so
	// measuring cannot disturb what it is measuring.
	const scratch = document.createElement("span");
	scratch.style.cssText = "position:fixed;visibility:hidden;pointer-events:none;top:0;left:0;";
	gridBody.appendChild(scratch);

	for (const cell of targets) {
		// One block-level row per clone, so the container ends up as wide as the widest
		// clone rather than the sum of them all.
		const row = document.createElement("div");
		row.style.display = "block";
		row.appendChild(toMeasurableClone(cell));
		scratch.appendChild(row);
	}

	const width = scratch.offsetWidth;
	scratch.remove();

	return width + extraPadding;
}

/**
 * Auto-size width-less `actionColumn`s to fit their content (buttons + header + footer) by
 * writing the fitted px into `--a12-col-N-width` on the `<table>` root — the same
 * channel column-resize uses, so no new `<col>` plumbing is needed.
 *
 * Restores the legacy `Table` `ColumnWidthSync` behavior on the new
 * `table-layout: fixed` architecture, scoped to action columns. Strictly batches a
 * read pass (clone + measure) then a write pass to avoid layout thrash, skips any
 * leaf index the user manually resized this session (`pinnedByResize` — a drag must
 * not be clobbered by a re-measure), and re-measures when data changes, the theme
 * switches, or once web fonts settle.
 *
 * @internal
 */
export function useAutoSizeActionColumns<RowType>(opts: {
	/** The underlying `<table>`; receives the `--a12-col-N-width` writes. */
	tableRef: RefObject<HTMLTableElement | null>;

	/** The scroll/body container the cells inherit CSS from (font/padding). */
	scrollRef: RefObject<HTMLElement | null>;
	leafColumns: readonly BaseColumnType<RowType>[];
	autoSizeEnabled: boolean;

	/** Re-measure when the rendered data changes (a row gains/loses a button). */
	rows: readonly unknown[];

	/** Leaf indices the user manually resized — auto-size leaves these alone. */
	pinnedByResize: RefObject<ReadonlySet<number>>;

	/**
	 * Bumped by resize's Escape reset (`resetAllColumnWidths`), which clears every
	 * `--a12-col-N-width` — including the fitted widths written here. Depending on it
	 * re-triggers the measure so action columns re-fit after a reset instead of
	 * stranding on the `getColumnWidths` fallback.
	 */
	remeasureSignal: number;
}): void {
	const { tableRef, scrollRef, leafColumns, autoSizeEnabled, rows, pinnedByResize, remeasureSignal } = opts;

	// Re-measure when the theme switches (default ↔ compact ↔ flat): the variant
	// changes `table.actionCell.padding` and the button dimensions, so the fitted
	// width drifts. `createTheme` yields a fresh object on each switch, and the layout
	// effect runs after the new styles are committed, so it measures the live metrics.
	const theme = useTheme();

	const indices = useMemo(
		() =>
			leafColumns
				.map((column, index) => (isAutoSizeActionColumn(column, autoSizeEnabled) ? index : -1))
				.filter((index) => index >= 0),
		[leafColumns, autoSizeEnabled]
	);

	// Bumped once web fonts settle so the layout effect re-runs with final metrics.
	const [fontVersion, setFontVersion] = useState(0);

	useLayoutEffect(() => {
		const table = tableRef.current;
		const body = scrollRef.current;

		if (!table || !body || indices.length === 0) {
			return;
		}

		// READ pass: clone + measure every auto-size column before writing anything.
		const widths = indices.map((index) => {
			// Manual resize wins — skip indices the user dragged this session.
			if (pinnedByResize.current?.has(index)) {
				return null;
			}

			const allCells = Array.from(table.querySelectorAll<HTMLElement>(`[data-auto-size-col="${index}"]`));
			const cells = allCells.filter((cell) => cell.closest("table") === table);
			const header = table.querySelector<HTMLElement>(`thead [data-auto-size-col="${index}"]`);
			const bodyCells = cells.filter((cell) => cell !== header);
			const px = measureColumnContentWidth({
				gridBody: body,
				cells: bodyCells,
				headerCell: header,
				extraPadding: ACTION_COLUMN_AUTOSIZE_PADDING
			});

			if (px < 0) {
				return null;
			}

			// Clamp to the resize floor (`minResizeWidth × 150`, default `0.1 × 150`); no
			// upper clamp.
			const min = (leafColumns[index].minResizeWidth ?? 0.1) * FIXED_WIDTH_BASE_PX;

			return { index, px: Math.max(px, min) };
		});

		// WRITE pass.
		for (const width of widths) {
			if (width) {
				table.style.setProperty(`--a12-col-${width.index}-width`, `${width.px}px`);
			}
		}
	}, [indices, rows, fontVersion, theme, tableRef, scrollRef, leafColumns, pinnedByResize, remeasureSignal]);

	// Web fonts can load after first paint, drifting the measured widths. Re-measure
	// once `document.fonts.ready` resolves by bumping the version the layout effect
	// depends on.
	useEffect(() => {
		if (indices.length === 0 || !document.fonts?.ready) {
			return;
		}

		let cancelled = false;

		void document.fonts.ready.then(() => {
			if (!cancelled) {
				setFontVersion((version) => version + 1);
			}
		});

		return (): void => {
			cancelled = true;
		};
	}, [indices.length]);
}
