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

import { fireEvent, render } from "test-utils";
import { describe, expect, test, vi } from "vitest";

import { DataRoles } from "../../common/main/data-roles.js";
import type { DataTableColumn } from "../main/columns.js";
import { DataTable } from "../main/data-table.view.js";

interface RowType {
	first: string;
	last: string;
	dept: string;
}

const data: RowType[] = [
	{ first: "Ada", last: "Lovelace", dept: "R&D" },
	{ first: "Alan", last: "Turing", dept: "R&D" }
];

// "Name" group with unequal leaves (1 : 3), plus a standalone leaf.
const columns: DataTableColumn<RowType>[] = [
	{
		label: "Name",
		subColumns: [
			{ label: "First", dataKey: "first", width: 1 },
			{ label: "Last", dataKey: "last", width: 3 }
		]
	},
	{ label: "Dept", dataKey: "dept", width: 2 }
];

const HEADER_CELL = `[data-role="${DataRoles.Table.Header.Cell}"]`;
const RESIZE_HANDLE = `[data-role="${DataRoles.Table.Column.ResizeHandler}"]`;

function leafWidth(container: HTMLElement, label: string): number {
	const cell = Array.from(container.querySelectorAll<HTMLElement>(`${HEADER_CELL}[scope="col"]`)).find((el) =>
		(el.textContent ?? "").trim().startsWith(label)
	);

	return cell ? cell.getBoundingClientRect().width : 0;
}

function groupHandle(container: HTMLElement, label: string): HTMLElement {
	const groupCell = Array.from(container.querySelectorAll<HTMLElement>(`${HEADER_CELL}[scope="colgroup"]`)).find((el) =>
		(el.textContent ?? "").trim().startsWith(label)
	);
	const handle = groupCell?.querySelector<HTMLElement>(RESIZE_HANDLE);
	expect(handle, `resize handle for group "${label}"`).not.toBeNull();

	return handle!;
}

describe("DataTable column-group resize", () => {
	test("group cells expose a resize handle with a group-scoped accessible name", () => {
		const { container } = render(
			<DataTable data={data} columns={columns} columnResizingOptions={{ onEndResize: () => undefined }} />
		);

		const handle = groupHandle(container, "Name");
		expect(handle.getAttribute("role")).toBe("separator");
		expect(handle.getAttribute("aria-label")).toBe("Resize Name group");
	});

	test("no group handle when resizing is disabled", () => {
		const { container } = render(<DataTable data={data} columns={columns} />);
		const groupCell = Array.from(container.querySelectorAll<HTMLElement>(`${HEADER_CELL}[scope="colgroup"]`))[0];
		expect(groupCell.querySelector(RESIZE_HANDLE)).toBeNull();
	});

	test("the group handle spans the whole header height (group row + sub-column row)", async () => {
		const { container } = render(
			<DataTable data={data} columns={columns} columnResizingOptions={{ onEndResize: () => undefined }} />
		);

		const thead = container.querySelector("thead")!;
		expect(thead.querySelectorAll("tr").length).toBe(2); // group row + leaf row
		const handle = groupHandle(container, "Name");

		// Height is stretched imperatively once the header has laid out.
		await vi.waitFor(() => {
			const headerHeight = thead.getBoundingClientRect().height;
			const handleHeight = handle.getBoundingClientRect().height;
			expect(handleHeight).toBeGreaterThan(0);
			// Spans the full header, not just its own group-header row.
			expect(handleHeight).toBeCloseTo(headerHeight, 0);
		});
	});

	test("keyboard resize grows the whole group proportionally, leaving other columns untouched", () => {
		const { container } = render(
			<DataTable data={data} columns={columns} columnResizingOptions={{ onEndResize: () => undefined }} />
		);

		const before = {
			first: leafWidth(container, "First"),
			last: leafWidth(container, "Last"),
			dept: leafWidth(container, "Dept")
		};
		// Sanity: the group's leaves start at their 1:3 ratio.
		expect(before.last / before.first).toBeCloseTo(3, 0);

		const handle = groupHandle(container, "Name");
		handle.focus();

		for (let step = 0; step < 8; step++) {
			fireEvent.keyDown(handle, { key: "ArrowRight" });
		}

		const after = {
			first: leafWidth(container, "First"),
			last: leafWidth(container, "Last"),
			dept: leafWidth(container, "Dept")
		};

		// Both leaves grew…
		expect(after.first).toBeGreaterThan(before.first);
		expect(after.last).toBeGreaterThan(before.last);
		// …by the same factor (internal 1:3 ratio preserved)…
		expect(after.last / after.first).toBeCloseTo(before.last / before.first, 1);
		// …and the group's total grew by ~8 × 10px, not each leaf by that much.
		expect(after.first + after.last - (before.first + before.last)).toBeCloseTo(80, -1);
		// …while a column outside the group is untouched.
		expect(after.dept).toBeCloseTo(before.dept, 0);
	});

	test("onEndResize reports the group column and a per-leaf width getter", () => {
		const onEndResize = vi.fn();
		const { container } = render(<DataTable data={data} columns={columns} columnResizingOptions={{ onEndResize }} />);

		const handle = groupHandle(container, "Name");
		handle.focus();
		fireEvent.keyDown(handle, { key: "ArrowRight" });

		expect(onEndResize).toHaveBeenCalledTimes(1);
		const call = onEndResize.mock.calls[0][0];

		// The reported column is the group, and the getter yields a width for each leaf
		// in the group but not for columns outside it.
		expect(call.resizedColumn).toBe(columns[0]);
		const first = columns[0].subColumns![0] as DataTableColumn<RowType>;
		const last = columns[0].subColumns![1] as DataTableColumn<RowType>;
		expect(call.resizedWidthsGetter?.(first)).toBeGreaterThan(0);
		expect(call.resizedWidthsGetter?.(last)).toBeGreaterThan(0);
		expect(call.resizedWidthsGetter?.(columns[1] as DataTableColumn<RowType>)).toBeUndefined();
	});

	test("Escape reverts the group to its default widths and reports the reset", () => {
		const onEndResize = vi.fn();
		const { container } = render(<DataTable data={data} columns={columns} columnResizingOptions={{ onEndResize }} />);

		const before = leafWidth(container, "Last");
		const handle = groupHandle(container, "Name");
		handle.focus();
		fireEvent.keyDown(handle, { key: "ArrowRight" });
		fireEvent.keyDown(handle, { key: "ArrowRight" });
		expect(leafWidth(container, "Last")).toBeGreaterThan(before);

		onEndResize.mockClear();
		fireEvent.keyDown(handle, { key: "Escape" });

		expect(leafWidth(container, "Last")).toBeCloseTo(before, 0);
		// Reset reports a getter that returns undefined for every column.
		const resetCall = onEndResize.mock.calls[0][0];
		expect(resetCall.resizedWidthsGetter?.(columns[0].subColumns![1] as DataTableColumn<RowType>)).toBeUndefined();
	});
});

describe("DataTable column-resize — column-set changes invalidate index-keyed widths", () => {
	const flatColumns: DataTableColumn<RowType>[] = [
		{ label: "First", dataKey: "first", width: 1 },
		{ label: "Last", dataKey: "last", width: 1 },
		{ label: "Dept", dataKey: "dept", width: 1 }
	];

	function leafByHeader(container: HTMLElement, label: string): HTMLElement {
		const cell = Array.from(container.querySelectorAll<HTMLElement>(`${HEADER_CELL}[scope="col"]`)).find((el) =>
			(el.textContent ?? "").trim().startsWith(label)
		);
		expect(cell, `header cell "${label}"`).toBeTruthy();

		return cell!;
	}

	test("a manual resize does not leak onto the column that inherits its index after the set changes", () => {
		const { container, rerender } = render(
			<DataTable data={data} columns={flatColumns} columnResizingOptions={{ onEndResize: () => undefined }} />
		);
		const table = container.querySelector("table") as HTMLTableElement;

		// Resize the middle column ("Last", leaf index 1).
		const handle = leafByHeader(container, "Last").querySelector<HTMLElement>(RESIZE_HANDLE)!;
		handle.focus();
		fireEvent.keyDown(handle, { key: "ArrowRight" });
		fireEvent.keyDown(handle, { key: "ArrowRight" });

		expect(table.style.getPropertyValue("--a12-col-1-width")).not.toBe("");
		expect(table.dataset.resized).toBe("true");

		// Prepend a column: "Last" is now leaf index 2, and a NEW column occupies
		// index 1. The stale index-1 override must be cleared, not re-applied.
		const shifted: DataTableColumn<RowType>[] = [{ label: "Dept2", dataKey: "dept", width: 1 }, ...flatColumns];
		rerender(<DataTable data={data} columns={shifted} columnResizingOptions={{ onEndResize: () => undefined }} />);

		expect(table.style.getPropertyValue("--a12-col-1-width")).toBe("");
		expect(table.dataset.resized).toBeUndefined();
	});
});

describe("DataTable column-resize — pinned columns keep their sticky offsets in step", () => {
	// A right-pinned group: `pinning` on the group is inherited by both leaves. The
	// group header cell sticks at the offset of its LAST leaf, each leaf at its own,
	// so resizing the last leaf has to update the earlier leaf's offset within the
	// same gesture. The `<thead>` measure that normally owns these offsets is
	// deferred while a resize is in flight, so without that in-gesture update the
	// group's edge drifts away from the column border beneath it until the drag ends.
	// Driven through the group handle — the only one on the group's right edge.
	const pinnedColumns: DataTableColumn<RowType>[] = [
		{ label: "Dept", dataKey: "dept", width: 2 },
		{
			label: "Name",
			pinning: "right",
			subColumns: [
				{ label: "First", dataKey: "first", width: 1 },
				{ label: "Last", dataKey: "last", width: 1 }
			]
		}
	];

	test("resizing the pinned group updates the preceding pinned leaf's offset during the gesture", async () => {
		const { container } = render(
			<DataTable data={data} columns={pinnedColumns} columnResizingOptions={{ onEndResize: () => undefined }} />
		);
		const table = container.querySelector("table") as HTMLTableElement;

		// "First" is leaf 1, "Last" is leaf 2 — leaf 1 sticks at leaf 2's width.
		await vi.waitFor(() => {
			expect(table.style.getPropertyValue("--a12-pin-right-1")).not.toBe("");
		});
		const initialOffset = Number.parseFloat(table.style.getPropertyValue("--a12-pin-right-1"));
		expect(initialOffset).toBeCloseTo(leafWidth(container, "Last"), 0);

		const handle = groupHandle(container, "Name");
		handle.focus();
		fireEvent.keyDown(handle, { key: "ArrowRight" });
		fireEvent.keyDown(handle, { key: "ArrowRight" });

		// Still mid-gesture (`data-resizing` holds the thead measure off), so this
		// offset can only be right if the resize itself refreshed it.
		expect(table.dataset.resizing).toBe("true");
		const offsetDuringResize = Number.parseFloat(table.style.getPropertyValue("--a12-pin-right-1"));
		expect(offsetDuringResize).toBeGreaterThan(initialOffset);
		expect(offsetDuringResize).toBeCloseTo(leafWidth(container, "Last"), 0);
		// The last pinned leaf stays flush with the edge, and the unpinned column
		// outside the group keeps no offset at all.
		expect(table.style.getPropertyValue("--a12-pin-right-2")).toBe("0px");
		expect(table.style.getPropertyValue("--a12-pin-right-0")).toBe("");
	});

	test("Escape restores the pinned offsets along with the widths", async () => {
		const { container } = render(
			<DataTable data={data} columns={pinnedColumns} columnResizingOptions={{ onEndResize: () => undefined }} />
		);
		const table = container.querySelector("table") as HTMLTableElement;

		await vi.waitFor(() => {
			expect(table.style.getPropertyValue("--a12-pin-right-1")).not.toBe("");
		});
		const initialOffset = Number.parseFloat(table.style.getPropertyValue("--a12-pin-right-1"));

		const handle = groupHandle(container, "Name");
		handle.focus();
		fireEvent.keyDown(handle, { key: "ArrowRight" });
		fireEvent.keyDown(handle, { key: "ArrowRight" });
		expect(Number.parseFloat(table.style.getPropertyValue("--a12-pin-right-1"))).toBeGreaterThan(initialOffset);

		fireEvent.keyDown(handle, { key: "Escape" });

		expect(Number.parseFloat(table.style.getPropertyValue("--a12-pin-right-1"))).toBeCloseTo(initialOffset, 0);
	});
});
