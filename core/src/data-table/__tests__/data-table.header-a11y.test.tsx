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

import { getAllByDataRole, render } from "test-utils";
import { afterEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../common/main/data-roles.js";
import type { DataTableColumn } from "../main/columns.js";
import { scrollHeaderTargetIntoView } from "../main/data-table.header-focus-scroll.js";
import { DataTable } from "../main/data-table.view.js";
import type { BaseColumnType } from "../main/foundation/column.api.js";
import type { ColumnResizeEventHandler } from "../main/foundation/table.api.js";

interface RowType {
	a: string;
	b: string;
	c: string;
	d: string;
}

const data: RowType[] = [
	{ a: "a1", b: "b1", c: "c1", d: "d1" },
	{ a: "a2", b: "b2", c: "c2", d: "d2" }
];

const HEADER_CELL = `[data-role="${DataRoles.Table.Header.Cell}"]`;

// ---------------------------------------------------------------------------
// scrollHeaderTargetIntoView — pinned-aware horizontal scroll (item 1)
// ---------------------------------------------------------------------------

describe("scrollHeaderTargetIntoView", () => {
	const cleanups: Array<() => void> = [];

	afterEach(() => {
		cleanups.forEach((fn) => fn());
		cleanups.length = 0;
	});

	/** Builds a real, laid-out scrolling viewport wide enough to overflow. */
	function buildViewport(options: { pinLeft?: boolean } = {}): {
		viewport: HTMLDivElement;
		cells: HTMLTableCellElement[];
	} {
		const viewport = document.createElement("div");
		viewport.style.width = "300px";
		viewport.style.overflowX = "auto";

		const table = document.createElement("table");
		table.style.borderCollapse = "separate";
		table.style.width = "900px";
		table.style.tableLayout = "fixed";

		const thead = document.createElement("thead");
		const tr = document.createElement("tr");
		const cells: HTMLTableCellElement[] = [];

		for (let i = 0; i < 6; i++) {
			const th = document.createElement("th");
			th.setAttribute("data-role", DataRoles.Table.Header.Cell);
			th.style.minWidth = "150px";
			th.style.width = "150px";
			th.style.boxSizing = "border-box";
			th.textContent = `col ${i}`;

			if (options.pinLeft && i === 0) {
				th.setAttribute("data-pinned", "left");
				th.style.position = "sticky";
				th.style.left = "0";
				th.style.zIndex = "1";
				th.style.background = "white";
			}

			tr.appendChild(th);
			cells.push(th);
		}

		thead.appendChild(tr);
		table.appendChild(thead);
		viewport.appendChild(table);
		document.body.appendChild(viewport);
		cleanups.push(() => viewport.remove());

		return { viewport, cells };
	}

	test("scrolls a far-right target into view", () => {
		const { viewport, cells } = buildViewport();
		expect(viewport.scrollLeft).toBe(0);

		const lastCell = cells[cells.length - 1];
		scrollHeaderTargetIntoView(viewport, lastCell);

		expect(viewport.scrollLeft).toBeGreaterThan(0);

		// The target is now inside the viewport's visible band.
		const viewportRect = viewport.getBoundingClientRect();
		const targetRect = lastCell.getBoundingClientRect();
		expect(targetRect.right).toBeLessThanOrEqual(Math.ceil(viewportRect.right));
		expect(targetRect.left).toBeGreaterThanOrEqual(Math.floor(viewportRect.left));
	});

	test("does not scroll a target already fully visible", () => {
		const { viewport, cells } = buildViewport();
		scrollHeaderTargetIntoView(viewport, cells[0]);
		expect(viewport.scrollLeft).toBe(0);
	});

	test("keeps the target clear of a sticky left-pinned column", () => {
		const { viewport, cells } = buildViewport({ pinLeft: true });

		// Scroll right so the first scrolling column would sit behind the pinned one.
		viewport.scrollLeft = 120;
		const pinnedRight = cells[0].getBoundingClientRect().right;

		// Focus a middle column that is partially hidden behind the pinned edge.
		scrollHeaderTargetIntoView(viewport, cells[1]);

		const targetLeft = cells[1].getBoundingClientRect().left;
		expect(targetLeft).toBeGreaterThanOrEqual(Math.floor(pinnedRight));
	});
});

// ---------------------------------------------------------------------------
// Header focus scroll wired through DataTable (item 1)
// ---------------------------------------------------------------------------

describe("DataTable header focus scroll", () => {
	const resizableColumns: BaseColumnType<RowType>[] = [
		{ label: "Col A", dataKey: "a", width: 1 },
		{ label: "Col B", dataKey: "b", width: 1 },
		{ label: "Col C", dataKey: "c", width: 1 },
		{ label: "Col D", dataKey: "d", width: 1 }
	];

	const resizingOptions: { onEndResize: ColumnResizeEventHandler<BaseColumnType<RowType>> } = {
		onEndResize: () => undefined
	};

	test("scrolls a focused resize separator into view when the header overflows", async () => {
		const { container } = render(
			<div style={{ width: 320 }}>
				<DataTable data={data} columns={resizableColumns} columnResizingOptions={resizingOptions} />
			</div>
		);

		const viewport = container.querySelector<HTMLDivElement>(`[data-role="${DataRoles.Table.Viewport}"]`);
		expect(viewport).not.toBeNull();

		// Sanity: the table overflows its 320px wrapper (4 × 150 min = 600).
		expect(viewport!.scrollWidth).toBeGreaterThan(viewport!.clientWidth);

		const handles = container.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Table.Column.ResizeHandler}"]`);
		const lastHandle = handles[handles.length - 1];
		expect(lastHandle).toBeDefined();

		lastHandle.focus();

		expect(document.activeElement).toBe(lastHandle);
		expect(viewport!.scrollLeft).toBeGreaterThan(0);
	});

	test("does not scroll when the focus comes from a pointer, so the click still lands", async () => {
		const onHeaderButton = vi.fn();
		const columns: BaseColumnType<RowType>[] = resizableColumns.map((column, index) =>
			index === 3
				? {
						...column,
						renderHeader: () => (
							<button type="button" data-role="header-menu" onClick={onHeaderButton}>
								Menu
							</button>
						)
					}
				: column
		);

		const { container } = render(
			<div style={{ width: 320 }}>
				<DataTable data={data} columns={columns} />
			</div>
		);

		const viewport = container.querySelector<HTMLDivElement>(`[data-role="${DataRoles.Table.Viewport}"]`)!;
		const button = container.querySelector<HTMLButtonElement>(`[data-role="header-menu"]`)!;

		// Scroll so the last header is cut off at the right edge with its button just visible.
		const viewportRight = viewport.getBoundingClientRect().right;
		const buttonRect = button.getBoundingClientRect();
		viewport.scrollLeft = buttonRect.right - viewportRight + 4;
		const scrollLeftBefore = viewport.scrollLeft;
		expect(scrollLeftBefore).toBeGreaterThan(0);

		await userEvent.click(button);

		expect(onHeaderButton).toHaveBeenCalledTimes(1);
		expect(document.activeElement).toBe(button);
		expect(viewport.scrollLeft).toBe(scrollLeftBefore);
	});

	test("still scrolls a keyboard-focused header cell into view", () => {
		const sortableColumns = resizableColumns.map((column) => ({ ...column, sortable: true }));
		const { container } = render(
			<div style={{ width: 320 }}>
				<DataTable data={data} columns={sortableColumns} sortOptions={{ onSort: () => undefined }} />
			</div>
		);

		const viewport = container.querySelector<HTMLDivElement>(`[data-role="${DataRoles.Table.Viewport}"]`)!;
		const cells = getAllByDataRole(container, DataRoles.Table.Header.Cell);

		cells[0].focus();
		expect(viewport.scrollLeft).toBe(0);

		// Focus that does not come from a pressed pointer (keyboard, script) scrolls.
		cells[3].focus();

		expect(document.activeElement).toBe(cells[3]);
		expect(viewport.scrollLeft).toBeGreaterThan(0);
		expect(cells[3].getBoundingClientRect().right).toBeLessThanOrEqual(viewport.getBoundingClientRect().right + 1);
	});
});

// ---------------------------------------------------------------------------
// Header cell accessible name
// ---------------------------------------------------------------------------

describe("DataTable header accessible name", () => {
	const resizing: { onEndResize: ColumnResizeEventHandler<BaseColumnType<RowType>> } = {
		onEndResize: () => undefined
	};

	test("names a resizable header from its label only, not from the resize separator", () => {
		const columns: BaseColumnType<RowType>[] = [
			{ label: "Col A", dataKey: "a", width: 1 },
			{ label: "Col B", dataKey: "b", width: 1 }
		];

		const { container } = render(<DataTable data={data} columns={columns} columnResizingOptions={resizing} />);
		const cells = getAllByDataRole(container, DataRoles.Table.Header.Cell);

		expect(cells[0]).toHaveAccessibleName("Col A");
		expect(cells[1]).toHaveAccessibleName("Col B");
		// The separator keeps a name of its own.
		const handles = getAllByDataRole(container, DataRoles.Table.Column.ResizeHandler);
		expect(handles[0]).toHaveAccessibleName("Resize Col A");
	});

	test("names a sortable, resizable header from its label", () => {
		const columns: BaseColumnType<RowType>[] = [
			{ label: "Col A", dataKey: "a", width: 1, sortable: true },
			{ label: "Col B", dataKey: "b", width: 1, sortable: true }
		];

		const { container } = render(
			<DataTable
				data={data}
				columns={columns}
				columnResizingOptions={resizing}
				sortOptions={{ sortState: [{ columnId: "a", order: "asc" }], onSort: () => undefined }}
			/>
		);
		const cells = getAllByDataRole(container, DataRoles.Table.Header.Cell);

		expect(cells[0]).toHaveAccessibleName("Col A");
		expect(cells[0]).toHaveAttribute("aria-sort", "ascending");
	});

	test("includes the hidden text and lets an explicit aria-label win", () => {
		const columns: BaseColumnType<RowType>[] = [
			{ label: "", dataKey: "a", hiddenText: "Actions", actionColumn: true, width: 1 },
			{ label: "Col B", dataKey: "b", width: 1, htmlAttributes: { "aria-label": "Second" } }
		];

		const { container } = render(<DataTable data={data} columns={columns} columnResizingOptions={resizing} />);
		const cells = getAllByDataRole(container, DataRoles.Table.Header.Cell);

		expect(cells[0]).toHaveAccessibleName("Actions");
		expect(cells[1]).toHaveAccessibleName("Second");
	});
});

// ---------------------------------------------------------------------------
// Leaf-column header dividers (item 3)
// ---------------------------------------------------------------------------

/**
 * Width in px of the column divider a head cell paints on its right edge, `0` when it paints none.
 *
 * The divider is an inset `box-shadow`, not a `border-right`: a border would shrink the cell's
 * padding box, which is the containing block of the resize handle it hosts, pushing the handle
 * inside the column boundary. The shadow's x offset carries the width, e.g.
 * `rgb(228, 230, 235) -1px 0px 0px 0px inset`.
 */
function dividerWidthOf(el: Element): number {
	const shadow = getComputedStyle(el).boxShadow;

	if (!shadow || !shadow.includes("inset")) {
		return 0;
	}

	const offset = /(-?[\d.]+)px/.exec(shadow.replace(/rgba?\([^)]*\)/g, ""));

	return offset ? Math.abs(parseFloat(offset[1])) : 0;
}

describe("DataTable header column dividers", () => {
	test("draws a right divider on every leaf header cell except the last", () => {
		const columns: BaseColumnType<RowType>[] = [
			{ label: "A", dataKey: "a", width: 1 },
			{ label: "B", dataKey: "b", width: 1 },
			{ label: "C", dataKey: "c", width: 1 }
		];

		const { container } = render(<DataTable data={data} columns={columns} />);
		const cells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
		expect(cells.length).toBe(3);

		expect(dividerWidthOf(cells[0])).toBeGreaterThan(0);
		expect(dividerWidthOf(cells[1])).toBeGreaterThan(0);
		// Last leaf: its right edge is the table edge, so no divider.
		expect(dividerWidthOf(cells[2])).toBe(0);
	});

	test("uses the heavier group divider at a column group's right boundary", () => {
		const columns: DataTableColumn<RowType>[] = [
			{ label: "A", dataKey: "a", width: 1 },
			{
				label: "Group",
				subColumns: [
					{ label: "B", dataKey: "b", width: 1 },
					{ label: "C", dataKey: "c", width: 1 }
				]
			},
			{ label: "D", dataKey: "d", width: 1 }
		];

		const { container } = render(<DataTable data={data} columns={columns} />);
		// A | (B C) | D → leaf indices 0..3. Group parent (scope="colgroup") shares
		// leafTo=2 with leaf C, so select leaves by their own scope + leaf index
		// rather than DOM order (row 1 renders A, group, D before row 2's B, C).
		const leaf = (index: number): Element => {
			const el = container.querySelector(`${HEADER_CELL}[scope="col"][data-leaf-to="${index}"]`);
			expect(el, `leaf ${index}`).not.toBeNull();

			return el!;
		};

		// A is a plain leaf before the group → thin "single" divider.
		expect(dividerWidthOf(leaf(0))).toBeGreaterThan(0);
		// B is an internal group leaf → thin "single" divider.
		expect(dividerWidthOf(leaf(1))).toBeGreaterThan(0);
		// C sits at the group's right boundary → heavier "group" divider.
		expect(dividerWidthOf(leaf(2))).toBeGreaterThanOrEqual(dividerWidthOf(leaf(1)));
		// D is the last leaf → no divider.
		expect(dividerWidthOf(leaf(3))).toBe(0);
	});

	test("keeps group and leaf dividers when column resizing is enabled", () => {
		const columns: DataTableColumn<RowType>[] = [
			{ label: "A", dataKey: "a", width: 1 },
			{
				label: "Group",
				subColumns: [
					{ label: "B", dataKey: "b", width: 1 },
					{ label: "C", dataKey: "c", width: 1 }
				]
			},
			{ label: "D", dataKey: "d", width: 1 }
		];

		const { container } = render(
			<DataTable data={data} columns={columns} columnResizingOptions={{ onEndResize: () => undefined }} />
		);

		// The group-header row keeps a divider even though its resize handle lives on
		// the leaf row below (regression: the handle used to suppress this divider,
		// leaving the group headers undivided when resizing was on).
		const groupCell = container.querySelector(`[data-role="${DataRoles.Table.Header.Cell}"][scope="colgroup"]`);
		expect(groupCell).not.toBeNull();
		expect(dividerWidthOf(groupCell!)).toBeGreaterThan(0);

		const leaf = (index: number): Element => {
			const el = container.querySelector(`${HEADER_CELL}[scope="col"][data-leaf-to="${index}"]`);
			expect(el, `leaf ${index}`).not.toBeNull();

			return el!;
		};

		// Leaf dividers survive too, at their proper weights (not the uniform handle bar).
		expect(dividerWidthOf(leaf(1))).toBeGreaterThan(0); // internal group leaf → single
		expect(dividerWidthOf(leaf(2))).toBeGreaterThanOrEqual(dividerWidthOf(leaf(1))); // group boundary → group
	});
});
