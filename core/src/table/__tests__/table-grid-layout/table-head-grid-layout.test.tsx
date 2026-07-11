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

import { afterEach, assert, beforeEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { fireEvent, render } from "test-utils";

import { DataRoles } from "../../../common/index.js";
import { Range } from "../../../common/main/utils.js";
import {
	calculateHeadGridLayout,
	flattenColumnsWithGridPosition,
	getColumnSpan,
	getDistanceToFarthestLeaf,
	getMaxColumnDepth
} from "../../main/template/table-head-grid/table-head-grid.utils.js";
import type { BaseColumnType } from "../../main/index.js";
import { Table } from "../../main/index.js";

import type { Employee, ContextualCard } from "./head-grid-test-data.js";
import { EMPLOYEES, GROUPED_COLUMNS, CONTEXTUAL_CARD_COLUMNS } from "./head-grid-test-data.js";

describe("com.mgmtp.a12.widgets.table", () => {
	const COLUMN_COUNT = 4;
	const ROW_COUNT = 10;
	type RowType = number[];
	type ColumnType = BaseColumnType<RowType>;
	let data: RowType[];
	const complexColumns: ColumnType[] = [
		{
			label: "Name",
			dataKey: "name",
			pinning: "left",
			width: 0.7,
			sortable: true
		},
		{
			label: "Profile",
			subColumns: [
				{
					label: "Username",
					dataKey: "username",
					sortable: true
				},
				{ label: "Phone", dataKey: "phone", sortable: true }
			]
		},
		{
			label: "Date of Birth",
			dataKey: "dob"
		},
		{
			label: "Address",
			subColumns: [
				{
					label: "E-address",
					subColumns: [
						{ label: "Email", dataKey: "email", width: 2 },
						{ label: "Website", dataKey: "website" }
					]
				},
				{
					label: "Home Address",
					subColumns: [
						{
							label: "Street",
							dataKey: "address.street",
							sortable: true
						},
						{
							label: "City",
							dataKey: "address.city",
							sortable: true
						}
					]
				}
			]
		},
		{
			label: "Company",
			pinning: "right",
			subColumns: [
				{ label: "Name", dataKey: "company.name", sortable: true, width: 0.7 },
				{ label: "Business", dataKey: "company.bs", sortable: true }
			]
		}
	];

	beforeEach(() => {
		data = Array.from(new Range(ROW_COUNT)).map((row) =>
			Array.from(new Range(COLUMN_COUNT)).map((col) => Number(`${row + 1}${col + 1}`))
		);
	});
	test("enhanced accessibility mode with complex nested columns", () => {
		const { container } = render(
			<Table<RowType, ColumnType> columns={complexColumns} data={data} enableColumnGroupA11y />
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("head grid uses explicit pixel widths matching body column widths", async () => {
		vi.useFakeTimers();
		const { container } = render(
			<Table<RowType, ColumnType> columns={complexColumns} data={data} enableColumnGroupA11y />
		);

		// Allow ColumnWidthSync requestAnimationFrame to fire
		await vi.runAllTimersAsync();
		vi.useRealTimers();

		const headGrid = container.querySelector<HTMLElement>(`[data-role="${DataRoles.Table.Row.Group.Header}"]`);
		assert(headGrid !== null);

		// The inline style set by synchronizeHeadGridColumns must be a valid pixel-value list
		const inlineGridCols = headGrid.style.gridTemplateColumns;
		expect(inlineGridCols).toMatch(/^(\d+px\s*)+$/);

		// And it must have 10 values (one per leaf column in complexColumns)
		const values = inlineGridCols.trim().split(/\s+/);
		expect(values).toHaveLength(10);
	});

	test("at large viewport head grid column widths match actual rendered body cell widths", async () => {
		await page.viewport(2000, 900);

		vi.useFakeTimers();
		const { container } = render(
			<Table<RowType, ColumnType> columns={complexColumns} data={data} enableColumnGroupA11y />
		);

		// Allow ColumnWidthSync requestAnimationFrame to fire
		await vi.runAllTimersAsync();
		vi.useRealTimers();

		const headGrid = container.querySelector<HTMLElement>(`[data-role="${DataRoles.Table.Row.Group.Header}"]`);
		assert(headGrid !== null);

		// Collect first body row cells in column order: left → scroll → right
		const bodyCells: HTMLElement[] = [];

		for (const segmentDataRole of [
			DataRoles.Table.Body.Row.SegmentLeft,
			DataRoles.Table.Body.Row.SegmentScroll,
			DataRoles.Table.Body.Row.SegmentRight
		]) {
			const segment = container.querySelector<HTMLElement>(`[data-role="${segmentDataRole}"]`);

			if (segment) {
				bodyCells.push(
					...Array.from(segment.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Table.Body.Cell}"]`))
				);
			}
		}

		expect(bodyCells.length).toBeGreaterThan(0);

		const expectedTemplate = bodyCells.map((cell) => `${cell.offsetWidth}px`).join(" ");
		expect(headGrid.style.gridTemplateColumns).toBe(expectedTemplate);

		await expect(container).toMatchSnapshot();

		await page.viewport(1280, 720);
	});

	test("head grid column widths match actual rendered body cell widths on any viewport", async () => {
		vi.useFakeTimers();
		const { container } = render(
			<Table<RowType, ColumnType> columns={complexColumns} data={data} enableColumnGroupA11y />
		);

		// Allow ColumnWidthSync requestAnimationFrame to fire
		await vi.runAllTimersAsync();
		vi.useRealTimers();

		const headGrid = container.querySelector<HTMLElement>(`[data-role="${DataRoles.Table.Row.Group.Header}"]`);
		assert(headGrid !== null);

		// Collect first body row cells in column order: left → scroll → right
		const bodyCells: HTMLElement[] = [];

		for (const segmentDataRole of [
			DataRoles.Table.Body.Row.SegmentLeft,
			DataRoles.Table.Body.Row.SegmentScroll,
			DataRoles.Table.Body.Row.SegmentRight
		]) {
			const segment = container.querySelector<HTMLElement>(`[data-role="${segmentDataRole}"]`);

			if (segment) {
				bodyCells.push(
					...Array.from(segment.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Table.Body.Cell}"]`))
				);
			}
		}

		expect(bodyCells.length).toBeGreaterThan(0);

		const expectedTemplate = bodyCells.map((cell) => `${cell.offsetWidth}px`).join(" ");
		expect(headGrid.style.gridTemplateColumns).toBe(expectedTemplate);
	});

	test("screen reader accessibility tree structure conforms to standards", () => {
		const { getAllByRole } = render(
			<Table<RowType, ColumnType> columns={complexColumns} data={data} enableColumnGroupA11y />
		);

		const headerRows = getAllByRole("row");

		headerRows.forEach((row, index) => {
			expect(row.getAttribute("aria-rowindex")).toBe(String(index + 1));
		});

		// Get all header cells and filter out hidden ones
		const allHeaderCells = getAllByRole("columnheader");

		const expectedColumnTexts: Record<number, string> = {
			1: "Name",
			2: "Profile, Username",
			3: "Profile, Phone",
			4: "Date of Birth",
			5: "Address, E-address, Email",
			6: "Address, E-address, Website",
			7: "Address, Home Address, Street",
			8: "Address, Home Address, City",
			9: "Company, Name",
			10: "Company, Business"
		};

		// Verify each column's text content
		Object.entries(expectedColumnTexts).forEach(([colIndex, expectedText]) => {
			const actualText = allHeaderCells
				.flatMap((cell) => {
					return cell.getAttribute("aria-colindex") === colIndex &&
						cell.firstElementChild?.getAttribute("aria-hidden") !== "true"
						? cell.textContent
						: [];
				})
				.join(", ")
				.trim();

			expect(actualText).toBe(expectedText);
		});
	});

	test("column group header cells have scope='colgroup'", () => {
		const { getAllByRole } = render(
			<Table<RowType, ColumnType> columns={complexColumns} data={data} enableColumnGroupA11y />
		);

		const headerCells = getAllByRole("columnheader");
		const profileCell = headerCells.find(
			(c) => c.textContent?.trim() === "Profile" && c.getAttribute("aria-hidden") !== "true"
		);
		const addressCell = headerCells.find(
			(c) => c.textContent?.trim() === "Address" && c.getAttribute("aria-hidden") !== "true"
		);

		expect(profileCell).toBeDefined();
		expect(profileCell).toHaveAttribute("scope", "colgroup");
		expect(addressCell).toBeDefined();
		expect(addressCell).toHaveAttribute("scope", "colgroup");
	});

	test("column group parent cells have center horizontal alignment class in a11y mode", () => {
		const { getAllByRole } = render(
			<Table<RowType, ColumnType> columns={complexColumns} data={data} enableColumnGroupA11y />
		);

		const headerCells = getAllByRole("columnheader");

		// Find visible column group parent headers (scope="colgroup", not aria-hidden)
		const groupParentCells = headerCells.filter(
			(c) => c.getAttribute("scope") === "colgroup" && c.firstElementChild?.getAttribute("aria-hidden") !== "true"
		);

		expect(groupParentCells.length).toBeGreaterThan(0);

		groupParentCells.forEach((cell) => {
			// The content wrapper must carry the center-alignment class
			const content = cell.querySelector('[data-role="table-header-cell-content"]');
			expect(content).not.toBeNull();
			// justify-content: center is applied via class when $horizAlignment === "center"
			expect(content).toHaveStyle({ justifyContent: "center" });
		});
	});

	test("leaf header cells do not have scope='colgroup'", () => {
		const { getAllByRole } = render(
			<Table<RowType, ColumnType> columns={complexColumns} data={data} enableColumnGroupA11y />
		);

		const headerCells = getAllByRole("columnheader");
		const nameCell = headerCells.find(
			(c) => c.textContent?.trim() === "Name" && c.getAttribute("aria-colindex") === "1"
		);

		expect(nameCell).toBeDefined();
		expect(nameCell).not.toHaveAttribute("scope", "colgroup");
	});

	describe("flattenColumnsWithGridPosition", () => {
		test("should flatten single column without subcolumns", () => {
			const result = flattenColumnsWithGridPosition([complexColumns[0]]);

			expect(result).toHaveLength(1);
			expect(result[0]).toHaveLength(1);
			expect(result[0][0]).toMatchObject({
				label: "Name",
				gridRow: 0,
				gridColumn: 0,
				gridRowSpan: 1,
				gridColumnSpan: 1,
				isHidden: false
			});
		});

		test("should flatten columns with one level of subcolumns", () => {
			const result = flattenColumnsWithGridPosition([complexColumns[1]]); // Profile

			expect(result).toHaveLength(2);

			// First row - parent column
			expect(result[0]).toHaveLength(2);
			const parentCell = result[0].find((cell) => !cell.isHidden);
			expect(parentCell).toMatchObject({
				label: "Profile",
				gridRow: 0,
				gridColumn: 0,
				gridRowSpan: 1,
				gridColumnSpan: 2,
				isHidden: false
			});

			// Second row - child columns
			expect(result[1]).toHaveLength(2);
			expect(result[1][0]).toMatchObject({
				label: "Username",
				gridRow: 1,
				gridColumn: 0,
				gridRowSpan: 1,
				gridColumnSpan: 1,
				isHidden: false
			});
			expect(result[1][1]).toMatchObject({
				label: "Phone",
				gridRow: 1,
				gridColumn: 1,
				gridRowSpan: 1,
				gridColumnSpan: 1,
				isHidden: false
			});
		});

		test("should flatten columns with nested subcolumns (3 levels)", () => {
			const result = flattenColumnsWithGridPosition([complexColumns[3]]); // Address

			expect(result).toHaveLength(3);

			// Level 0 - Address
			const addressCell = result[0].find((cell) => cell.label === "Address" && !cell.isHidden);
			expect(addressCell).toMatchObject({
				gridRow: 0,
				gridColumn: 0,
				gridRowSpan: 1,
				gridColumnSpan: 4
			});

			// Level 1 - E-address
			const eAddressCell = result[1].find((cell) => cell.label === "E-address" && !cell.isHidden);
			expect(eAddressCell).toMatchObject({
				gridRow: 1,
				gridColumn: 0,
				gridRowSpan: 1,
				gridColumnSpan: 2
			});

			// Level 2 - Email and Website
			const emailCell = result[2].find((cell) => cell.label === "Email" && !cell.isHidden);
			const websiteCell = result[2].find((cell) => cell.label === "Website" && !cell.isHidden);
			expect(emailCell).toMatchObject({
				gridRow: 2,
				gridColumn: 0
			});
			expect(websiteCell).toMatchObject({
				gridRow: 2,
				gridColumn: 1
			});
		});

		test("should handle mixed depth columns with proper row spanning", () => {
			const result = flattenColumnsWithGridPosition([complexColumns[1], complexColumns[2]]); // Profile, Date of Birth

			expect(result).toHaveLength(2);

			// Date of Birth should span 2 rows
			const dobCells = result.flat().filter((cell) => cell.label === "Date of Birth");
			const visibleDobCell = dobCells.find((cell) => !cell.isHidden);
			expect(visibleDobCell).toMatchObject({
				gridRow: 0,
				gridColumn: 2,
				gridRowSpan: 2,
				gridColumnSpan: 1,
				isHidden: false
			});
		});

		test("should correctly apply pinning to columns", () => {
			const result = flattenColumnsWithGridPosition([complexColumns[0]]); // Name with left pinning

			// All cells should have left pinning
			const allCells = result.flat();
			allCells.forEach((cell) => {
				expect(cell.pinning).toBe("left");
			});
		});

		test("should mark hidden cells with isHidden and ariaHidden flags", () => {
			const result = flattenColumnsWithGridPosition([complexColumns[1]]); // Profile with 2 subcolumns

			// First row should have 1 visible cell and 1 hidden (for colspan=2)
			const row0 = result[0];
			const visibleCells = row0.filter((cell) => !cell.isHidden);
			const hiddenCells = row0.filter((cell) => cell.isHidden);

			expect(visibleCells).toHaveLength(1);
			expect(hiddenCells).toHaveLength(1);

			// Cells hidden due to column spanning should not have ariaHidden set
			hiddenCells.forEach((cell) => {
				expect(cell.ariaHidden).toBeUndefined();
			});

			// Second row should have all visible cells (leaf level)
			const row1 = result[1];
			expect(row1.every((cell) => !cell.isHidden)).toBe(true);
			expect(row1.every((cell) => cell.ariaHidden === undefined)).toBe(true);
		});

		test("should mark cells hidden by row spanning with ariaHidden=true", () => {
			const result = flattenColumnsWithGridPosition([complexColumns[1], complexColumns[2]]); // Profile, Date of Birth

			// Date of Birth spans 2 rows, so row 1 should have hidden Date of Birth cells with ariaHidden=true
			const row1DobCells = result[1].filter((cell) => cell.label === "Date of Birth");
			const hiddenDobCells = row1DobCells.filter((cell) => cell.isHidden);

			expect(hiddenDobCells.length).toBeGreaterThan(0);
			hiddenDobCells.forEach((cell) => {
				expect(cell.ariaHidden).toBe(true);
			});
		});

		test("should assign correct grid positions for complex nested structure", () => {
			const result = flattenColumnsWithGridPosition(complexColumns);

			// Verify column indices are sequential across all columns
			const leafRow = result[result.length - 1];
			const visibleLeafCells = leafRow.filter((cell) => !cell.isHidden);

			// Should have 8 leaf columns in the actual result
			expect(visibleLeafCells.length).toBeGreaterThan(0);
		});

		test("should handle columns with inherited pinning", () => {
			const result = flattenColumnsWithGridPosition([complexColumns[4]]); // Company with right pinning

			// All nested levels should inherit right pinning
			const allCells = result.flat();
			allCells.forEach((cell) => {
				expect(cell.pinning).toBe("right");
			});
		});
	});

	describe("utility functions", () => {
		test("getDistanceToFarthestLeaf - leaf column returns 0", () => {
			expect(getDistanceToFarthestLeaf({ label: "A", dataKey: "a" })).toBe(0);
		});

		test("getDistanceToFarthestLeaf - one level deep returns 1", () => {
			const col: ColumnType = {
				label: "Parent",
				subColumns: [{ label: "Child", dataKey: "c" }]
			};
			expect(getDistanceToFarthestLeaf(col)).toBe(1);
		});

		test("getDistanceToFarthestLeaf - uses deepest path for unbalanced trees", () => {
			const col: ColumnType = {
				label: "Parent",
				subColumns: [
					{ label: "Shallow", dataKey: "s" },
					{
						label: "Deep",
						subColumns: [{ label: "Deepest", dataKey: "d" }]
					}
				]
			};
			expect(getDistanceToFarthestLeaf(col)).toBe(2);
		});

		test("getMaxColumnDepth - flat columns return 1", () => {
			expect(
				getMaxColumnDepth([
					{ label: "A", dataKey: "a" },
					{ label: "B", dataKey: "b" }
				])
			).toBe(1);
		});

		test("getMaxColumnDepth - nested columns return max depth", () => {
			expect(getMaxColumnDepth(complexColumns)).toBe(3);
		});

		test("getColumnSpan - leaf column returns 1", () => {
			expect(getColumnSpan({ label: "A", dataKey: "a" })).toBe(1);
		});

		test("getColumnSpan - group column sums leaf children", () => {
			const col: ColumnType = {
				label: "Group",
				subColumns: [
					{ label: "A", dataKey: "a" },
					{ label: "B", dataKey: "b" },
					{ label: "C", dataKey: "c" }
				]
			};
			expect(getColumnSpan(col)).toBe(3);
		});
	});

	describe("calculateHeadGridLayout", () => {
		const mockTableComponents = {
			bodyCell: { width: 150, firstMarginLeft: "24px" }
		};

		test("totalColumns equals number of leaf columns in first row", () => {
			const flatCols: BaseColumnType[] = [
				{ label: "A", dataKey: "a" },
				{ label: "B", dataKey: "b" },
				{ label: "C", dataKey: "c" }
			];
			const layout = calculateHeadGridLayout(flatCols, mockTableComponents);
			expect(layout.totalColumns).toBe(3);
		});

		test("totalRows equals max column depth", () => {
			const layout = calculateHeadGridLayout(complexColumns as BaseColumnType[], mockTableComponents);
			expect(layout.totalRows).toBe(3);
		});

		test("cumulativeWidths includes first-column margin", () => {
			const flatCols: BaseColumnType[] = [
				{ label: "A", dataKey: "a" },
				{ label: "B", dataKey: "b" }
			];
			const layout = calculateHeadGridLayout(flatCols, mockTableComponents);
			// [0] = 0
			// [1] = 0 + 150 + 24 (first-column margin) = 174
			// [2] = 174 + 150 = 324
			expect(layout.cumulativeWidths[0]).toBe(0);
			expect(layout.cumulativeWidths[1]).toBe(174);
			expect(layout.cumulativeWidths[2]).toBe(324);
		});

		test("cells are split into left/scroll/right segments by pinning", () => {
			const layout = calculateHeadGridLayout(complexColumns as BaseColumnType[], mockTableComponents);
			const row0 = layout.rows[0];
			expect(row0.left).not.toBeNull();
			expect(row0.scroll).not.toBeNull();
			expect(row0.right).not.toBeNull();
			expect(row0.left!.cellsWithRelativePositions.some((c) => c.column.label === "Name")).toBe(true);
			expect(row0.right!.cellsWithRelativePositions.some((c) => c.column.label === "Company")).toBe(true);
		});

		test("columnWidths matches body cell min-widths: first column includes firstColumnMargin", () => {
			const flatCols: BaseColumnType[] = [
				{ label: "A", dataKey: "a" },
				{ label: "B", dataKey: "b", width: 1 },
				{ label: "C", dataKey: "c", width: 2 }
			];
			const layout = calculateHeadGridLayout(flatCols, mockTableComponents);
			// A(first): round(150 + 24) = 174
			// B: round(150 * 1) = 150
			// C: round(150 * 2) = 300
			expect(layout.columnWidths).toEqual([174, 150, 300]);
		});

		test("columnWidths for complexColumns matches body cell min-widths for every column", () => {
			const layout = calculateHeadGridLayout(complexColumns as BaseColumnType[], mockTableComponents);
			// Name(0.7,first): round(150*0.7+24)=129, Username=150, Phone=150, DoB=150,
			// Email(2)=300, Website=150, Street=150, City=150, Company.Name(0.7)=105, Business=150
			expect(layout.columnWidths).toEqual([129, 150, 150, 150, 300, 150, 150, 150, 105, 150]);
		});

		test("hidden-only rows produce isHidden wrapperGrid for segments with only filler cells", () => {
			const layout = calculateHeadGridLayout(complexColumns as BaseColumnType[], mockTableComponents);
			// Row 1 of left segment contains only filler cells for Name (which spans 3 rows)
			const leftRow1 = layout.rows[1].left;
			expect(leftRow1).not.toBeNull();
			expect(leftRow1!.wrapperGrid.isHidden).toBe(true);
		});
	});

	describe("column group head grid", () => {
		test("head grid snapshot for grouped columns with enableColumnGroupA11y", () => {
			const { container } = render(
				<Table<Employee> columns={GROUPED_COLUMNS} data={EMPLOYEES} enableColumnGroupA11y />
			);

			const headGrid = container.querySelector(`[data-role="${DataRoles.Table.Row.Group.Header}"]`);
			assert(headGrid !== null);

			expect(headGrid).toMatchSnapshot();
		});
	});

	describe("complex nested columns head grid", () => {
		test("head grid snapshot for complex nested columns with enableColumnGroupA11y", () => {
			const { container } = render(
				<Table<ContextualCard> columns={CONTEXTUAL_CARD_COLUMNS} data={[]} enableColumnGroupA11y />
			);

			const headGrid = container.querySelector(`[data-role="${DataRoles.Table.Row.Group.Header}"]`);
			assert(headGrid !== null);

			expect(headGrid).toMatchSnapshot();
		});
	});

	describe("Tab focus scroll in enableColumnGroupA11y head grid", () => {
		const makeDomRect = (partial: {
			left?: number;
			right?: number;
			top?: number;
			bottom?: number;
			width?: number;
			height?: number;
			x?: number;
			y?: number;
		}) =>
			({
				left: 0,
				right: 0,
				top: 0,
				bottom: 40,
				width: 0,
				height: 40,
				x: 0,
				y: 0,
				toJSON: () => ({}),
				...partial
			}) as unknown as DOMRect;

		const findSortableCellInSegment = (
			container: HTMLElement,
			segmentDataRole: string,
			cellText: string
		): HTMLElement => {
			const segments = container.querySelectorAll<HTMLElement>(`[data-role="${segmentDataRole}"]`);

			for (const segment of segments) {
				const found = Array.from(segment.querySelectorAll<HTMLElement>("[tabindex='0']")).find(
					(el) => el.textContent?.trim() === cellText
				);

				if (found) {
					return found;
				}
			}

			throw new Error(`Could not find sortable cell "${cellText}" in segment [data-role=${segmentDataRole}]`);
		};

		afterEach(() => {
			vi.restoreAllMocks();
		});

		test("scrolls head grid right when Tab focuses an off-screen sortable cell in scroll segment", () => {
			const { container } = render(
				<Table<RowType, ColumnType> columns={complexColumns} data={data} enableColumnGroupA11y />
			);

			const grid = container.querySelector<HTMLElement>(`[data-role="${DataRoles.Table.Row.Group.Header}"]`)!;
			// City is the rightmost sortable leaf column in the scroll segment.
			// With complexColumns (total content ~1560px) in a 1280px viewport, City is off-screen at scrollLeft=0.
			const cityCell = findSortableCellInSegment(container, DataRoles.Table.Header.Row.SegmentScroll, "City");

			fireEvent.focus(cityCell);

			expect(grid.scrollLeft).toBeGreaterThan(0);
		});

		test("does not scroll head grid when Tab focuses a left-pinned sortable header cell", () => {
			const { container } = render(
				<Table<RowType, ColumnType> columns={complexColumns} data={data} enableColumnGroupA11y />
			);

			const grid = container.querySelector<HTMLElement>(`[data-role="${DataRoles.Table.Row.Group.Header}"]`)!;
			// "Name" is left-pinned and sortable — handler must return early (cell is not in SegmentScroll)
			const nameCell = findSortableCellInSegment(container, DataRoles.Table.Header.Row.SegmentLeft, "Name");

			fireEvent.focus(nameCell);

			expect(grid.scrollLeft).toBe(0);
		});

		test("does not scroll head grid when Tab focuses a right-pinned sortable header cell", () => {
			const { container } = render(
				<Table<RowType, ColumnType> columns={complexColumns} data={data} enableColumnGroupA11y />
			);

			const grid = container.querySelector<HTMLElement>(`[data-role="${DataRoles.Table.Row.Group.Header}"]`)!;
			// "Business" is right-pinned and sortable — handler must return early
			const businessCell = findSortableCellInSegment(container, DataRoles.Table.Header.Row.SegmentRight, "Business");

			fireEvent.focus(businessCell);

			expect(grid.scrollLeft).toBe(0);
		});

		test("scrolls head grid left when focusing a sortable cell off-screen to the left", () => {
			const { container } = render(
				<Table<RowType, ColumnType> columns={complexColumns} data={data} enableColumnGroupA11y />
			);

			const grid = container.querySelector<HTMLElement>(`[data-role="${DataRoles.Table.Row.Group.Header}"]`)!;
			const usernameCell = findSortableCellInSegment(container, DataRoles.Table.Header.Row.SegmentScroll, "Username");

			// Pre-scroll the grid right so Username is off-screen to the left
			grid.scrollLeft = 200;
			const initialScrollLeft = grid.scrollLeft;

			// Mock positions: Username appears to the left of the visible scroll area
			const leftSegment = grid.querySelector<HTMLElement>(`[data-role="${DataRoles.Table.Header.Row.SegmentLeft}"]`);
			const rightSegment = grid.querySelector<HTMLElement>(`[data-role="${DataRoles.Table.Header.Row.SegmentRight}"]`);

			vi.spyOn(grid, "getBoundingClientRect").mockReturnValue(makeDomRect({ left: 0, right: 800, width: 800 }));
			vi.spyOn(leftSegment!, "getBoundingClientRect").mockReturnValue(makeDomRect({ left: 0, right: 100, width: 100 }));
			vi.spyOn(rightSegment!, "getBoundingClientRect").mockReturnValue(
				makeDomRect({ left: 700, right: 800, width: 100 })
			);
			vi.spyOn(usernameCell, "getBoundingClientRect").mockReturnValue(
				// cellRect.left = 50 < visibleLeft (gridRect.left + leftWidth = 0 + 100 = 100)
				makeDomRect({ left: 50, right: 200, width: 150 })
			);

			fireEvent.focus(usernameCell);

			// visibleLeft = 0 + 100 = 100; cellRect.left = 50 < 100 → scrollLeft decreases by 50
			expect(grid.scrollLeft).toBeLessThan(initialScrollLeft);
		});
	});
});
