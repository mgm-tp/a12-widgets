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

import { describe, test, expect, vi } from "vitest";
import { waitFor } from "@testing-library/dom";

import { Range } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { BaseColumnType } from "../main/column.api.js";
import {
	countActionColumns,
	flattenAllColumns,
	flattenRowsGroup,
	getDataByKey,
	getNextSorting,
	getRowKey,
	getRowSegments,
	hasColumnGroup,
	identifyRowsGroup,
	isColumnGroup,
	TableInternalUtils
} from "../main/table.utils.js";
import type {
	IdenticalRowsGroup,
	RowsGroup,
	RowsGroupHead,
	TableRowsGroupRowType
} from "../main/table-rows-group/table-row-group.api.js";
import { ColumnWidthSync } from "../main/table.internal.js";

const {
	getFirstSubColumn,
	getLastSubColumn,
	getColumnIndex,
	isIntermediateColumn,
	isLastColumnOfArea,
	isFirstColumnOfArea,
	isRightOfActionColumn,
	getAllLeafColumns
} = TableInternalUtils;

describe("com.mgmtp.a12.widgets.table.utils.getNextSorting", () => {
	test("without sortDirections passed in", () => {
		const column: BaseColumnType = { label: "label test", dataKey: "data.key.test", sortable: true };

		expect(getNextSorting(column, { column, order: "asc" })).toEqual("desc");
		expect(getNextSorting(column, { column, order: "desc" })).toEqual(undefined);
	});

	test("with sortDirections passed in", () => {
		const column: BaseColumnType = {
			label: "label test",
			dataKey: "data.key.test",
			sortable: true,
			sortDirections: ["desc", "asc"]
		};

		expect(getNextSorting(column, { column: column, order: "asc" })).toEqual("desc");
		expect(getNextSorting(column, { column: column, order: "desc" })).toEqual("asc");
	});
});

describe("com.mgmtp.a12.widgets.table.utils.get-data-or-row-by-key", () => {
	test("getDataByKey", () => {
		const row = {
			address: { street: "Ortiz Bridge", describe: "describe 115" },
			email: "Arturo.Weber32@yahoo.com",
			name: "Henrietta Wunsch",
			phone: "(911) 662-4333 x77"
		};
		expect(getDataByKey(row, "address.street")).toEqual(row.address.street);
	});

	test("getRowKey", () => {
		const row = {
			address: { street: "Ortiz Bridge", describe: "describe 115" },
			email: "Arturo.Weber32@yahoo.com",
			name: "Henrietta Wunsch",
			phone: "(911) 662-4333 x77"
		};
		expect(getRowKey(row, "address.street")).toEqual(row.address.street);

		const getter = vi.fn();
		getRowKey(row, getter);
		expect(getter).toHaveBeenNthCalledWith(1, { row });
	});
});
describe("com.mgmtp.a12.widgets.table.utils.getRowSegments", () => {
	test("getRowSegments", () => {
		const left: BaseColumnType[] = [
			{ label: "label 1", pinning: "left" },
			{ label: "label 2", pinning: "left" }
		];
		const scroll: BaseColumnType[] = [{ label: "label 3" }, { label: "label 4" }];
		const right: BaseColumnType[] = [
			{ label: "label 5", pinning: "right" },
			{ label: "label 6", pinning: "right" }
		];
		expect(getRowSegments([...left, ...scroll, ...right])).toStrictEqual({ left: left, scroll: scroll, right: right });
		expect(getRowSegments([...scroll, ...right, ...left])).toStrictEqual({ left: left, scroll: scroll, right: right });
	});
});

describe("com.mgmtp.a12.widgets.table.utils.column-group", () => {
	const COLUMNS: BaseColumnType[] = [
		{ label: "label 1", pinning: "left" },
		{ label: "label 2", pinning: "left" },
		{ label: "label 3" },
		{ label: "label 4" },
		{ label: "label 5" },
		{ label: "label 6", pinning: "right" },
		{ label: "label 7", pinning: "right" }
	];

	test("flattenAllColumns", () => {
		// Columns without group
		expect(flattenAllColumns(COLUMNS)).toStrictEqual(COLUMNS);

		// Columns group
		const subColumns1 = [{ label: "sub1 test" }, { label: "sub2 test" }];
		const subColumns2 = [{ label: "sub3 test" }, { label: "sub4 test" }];

		const columnGroup: BaseColumnType[] = [
			{
				...COLUMNS[0],
				subColumns: subColumns1
			},
			{ ...COLUMNS[2], subColumns: subColumns2 }
		];
		expect(flattenAllColumns(columnGroup)).toStrictEqual([...subColumns1, ...subColumns2]);
	});

	test("isColumnGroup", () => {
		const column = {
			...COLUMNS[0],
			subColumns: [{ label: "sub1" }, { label: "sub2" }]
		};
		expect(isColumnGroup(column)).toBeTruthy();
		expect(isColumnGroup(COLUMNS[0])).toBeFalsy();
	});

	test("hasColumnGroup", () => {
		const columnGroup: BaseColumnType[] = [
			{
				...COLUMNS[0],
				subColumns: [{ label: "sub1" }, { label: "sub2" }]
			},
			COLUMNS[1]
		];
		expect(hasColumnGroup(COLUMNS)).toBeFalsy();
		expect(hasColumnGroup(columnGroup)).toBeTruthy();
	});
});

describe("com.mgmtp.a12.widgets.table.utils.columns-group", () => {
	const COLUMNS: BaseColumnType[] = [
		{ label: "label 1", pinning: "left" },
		{ label: "label 2", pinning: "left" },
		{ label: "label 3" },
		{ label: "label 4" },
		{ label: "label 5" },
		{ label: "label 6", pinning: "right" },
		{ label: "label 7", pinning: "right" }
	];

	test("column", () => {
		const actionColumns: BaseColumnType[] = [
			{ label: "action1", pinning: "left", actionColumn: true },
			...COLUMNS,
			{ label: "action2", pinning: "right", actionColumn: true }
		];
		expect(countActionColumns(actionColumns)).toEqual(2);
	});

	test("column with specified width", () => {
		const columns: BaseColumnType[] = [
			{ label: "action1", pinning: "left", actionColumn: true, width: 1 },
			...COLUMNS,
			{ label: "action2", pinning: "right", actionColumn: true }
		];
		expect(countActionColumns(columns)).toEqual(1);
	});

	test("columns group", () => {
		const actionColumns: BaseColumnType[] = [
			{ label: "", pinning: "left", actionColumn: true },
			{
				...COLUMNS[0],
				subColumns: [{ label: "sub1" }, { label: "sub2" }]
			},
			{ label: "", pinning: "right", subColumns: [{ label: "sub3" }, { label: "sub4", actionColumn: true }] }
		];
		expect(countActionColumns(actionColumns)).toEqual(2);
	});
});

describe("com.mgmtp.a12.widgets.table.utils.rows-group", () => {
	const SUB_LENGTH = 2;
	const SUB_DATA = Array.from(new Range(SUB_LENGTH)).map(() => Math.random() * 100);
	const getSubRows = (head?: RowsGroupHead) => SUB_DATA.map((subValue) => ({ parent: head, data: subValue }));

	const ROWS_GROUP_DATA: RowsGroup<number>[] = [
		{
			head: { title: "head 1" },
			subRows: SUB_DATA
		},
		{
			head: { title: "head 2" },
			subRows: SUB_DATA
		},
		{
			head: { title: "head 3" },
			subRows: SUB_DATA
		}
	];

	const IDENTICAL_ROWS_GROUP_DATA: IdenticalRowsGroup<number>[] = [
		{
			head: ROWS_GROUP_DATA[0].head,
			subRows: getSubRows(ROWS_GROUP_DATA[0].head)
		},
		{
			head: ROWS_GROUP_DATA[1].head,
			subRows: getSubRows(ROWS_GROUP_DATA[1].head)
		},
		{
			head: ROWS_GROUP_DATA[2].head,
			subRows: getSubRows(ROWS_GROUP_DATA[2].head)
		}
	];

	test("identifyRowsGroup", () => {
		expect(identifyRowsGroup(ROWS_GROUP_DATA)).toStrictEqual(IDENTICAL_ROWS_GROUP_DATA);
	});

	test("flattenRowsGroup", () => {
		const result: TableRowsGroupRowType[] = [
			{ head: ROWS_GROUP_DATA[0].head as RowsGroupHead },
			{ parent: ROWS_GROUP_DATA[0].head, data: SUB_DATA[0] },
			{ parent: ROWS_GROUP_DATA[0].head, data: SUB_DATA[1] },
			{ head: ROWS_GROUP_DATA[1].head as RowsGroupHead },
			{ parent: ROWS_GROUP_DATA[1].head, data: SUB_DATA[0] },
			{ parent: ROWS_GROUP_DATA[1].head, data: SUB_DATA[1] },
			{ head: ROWS_GROUP_DATA[2].head as RowsGroupHead },
			{ parent: ROWS_GROUP_DATA[2].head, data: SUB_DATA[0] },
			{ parent: ROWS_GROUP_DATA[2].head, data: SUB_DATA[1] }
		];

		expect(flattenRowsGroup(IDENTICAL_ROWS_GROUP_DATA)).toStrictEqual(result);
	});
});
describe("com.mgmtp.a12.widgets.table.utils.TableInternalUtils.get-column", () => {
	const COLUMN: BaseColumnType = { label: "", width: 1.7 };

	test("getFirstSubColumn", () => {
		const firstSub = { label: "first sub" };
		expect(getFirstSubColumn(COLUMN)).toEqual(undefined);

		const level2: BaseColumnType = {
			...COLUMN,
			subColumns: [firstSub, COLUMN]
		};
		expect(getFirstSubColumn(level2)).toStrictEqual(firstSub);

		const level3: BaseColumnType = {
			...COLUMN,
			subColumns: [{ ...COLUMN, subColumns: [firstSub, COLUMN] }, COLUMN]
		};
		expect(getFirstSubColumn(level3)).toStrictEqual(firstSub);
	});

	test("getLastSubColumn", () => {
		const lastSub = { label: "last sub" };
		expect(getLastSubColumn(COLUMN)).toEqual(undefined);

		const level2: BaseColumnType = {
			...COLUMN,
			subColumns: [COLUMN, lastSub]
		};
		expect(getLastSubColumn(level2)).toStrictEqual(lastSub);

		const level3: BaseColumnType = {
			...COLUMN,
			subColumns: [{ ...COLUMN, subColumns: [COLUMN, COLUMN] }, lastSub]
		};
		expect(getLastSubColumn(level3)).toStrictEqual(lastSub);
	});

	test("getColumnIndex", () => {
		const column: BaseColumnType = {
			...COLUMN,
			subColumns: [{ ...COLUMN, subColumns: [COLUMN, COLUMN] }]
		};
		const columns: BaseColumnType[] = [
			{ label: "label 1", pinning: "left" },
			{ label: "label 2", pinning: "left" },
			{ label: "label 3" },
			{ label: "label 4" },
			{ label: "label 5" },
			{ label: "label 6", pinning: "right" },
			{ label: "label 7", pinning: "right" }
		];

		const columnGroup: BaseColumnType[] = [...columns, column];
		expect(getColumnIndex(column, columnGroup)).toEqual(columnGroup.length - 1);
		expect(getColumnIndex({ ...column, label: "test" }, columnGroup)).toEqual(-1);
	});
});

describe("com.mgmtp.a12.widgets.table.utils.TableInternalUtils.is-column", () => {
	const COLUMN: BaseColumnType = { label: "", width: 1.7 };
	const COLUMNS: BaseColumnType[] = [
		{ label: "1", pinning: "left" },
		{ label: "2", pinning: "left" },
		{ label: "3" },
		{ label: "4" },
		{ label: "5" },
		{ label: "6", pinning: "right" },
		{ label: "7", pinning: "right" }
	];

	test("isIntermediateColumn", () => {
		const firstColumn = { label: "first column" };
		const lastColumn = { label: "last column" };
		const intermediateColumn = { ...COLUMN, subColumns: [firstColumn, COLUMN] };

		const columnGroup: BaseColumnType[] = [
			...COLUMNS,
			{
				...COLUMN,
				subColumns: [intermediateColumn, lastColumn]
			}
		];

		expect(isIntermediateColumn(lastColumn, columnGroup)).toBeFalsy();
		expect(isIntermediateColumn(intermediateColumn, columnGroup)).toBeTruthy();
	});

	test("isLastColumnOfArea", () => {
		const lastLeft = { label: "last left" };
		const lastRight: BaseColumnType = { label: "last right", pinning: "right" };
		const lastScroll = { label: "last scroll" };

		const columns: BaseColumnType[] = [
			{ label: "label l1", pinning: "left" },
			{ label: "label l2", pinning: "left", subColumns: [{ label: "sub l2" }, lastLeft] },
			COLUMN,
			{ label: "label s2", subColumns: [{ label: "sub s2" }, lastScroll] },
			{ label: "label r1", pinning: "right" },
			lastRight
		];

		expect(isLastColumnOfArea(lastLeft, columns, "left")).toBeTruthy();
		expect(isLastColumnOfArea(lastScroll, columns, "scroll")).toBeTruthy();
		expect(isLastColumnOfArea(lastRight, columns, "right")).toBeTruthy();
		expect(isLastColumnOfArea(COLUMN, columns, "right")).toBeFalsy();
	});

	test("isFirstColumnOfArea", () => {
		const firstLeft = { label: "first left" };
		const firstRight: BaseColumnType = { label: "first right", pinning: "right" };
		const firstScroll = { label: "first scroll" };

		const columns: BaseColumnType[] = [
			{ label: "label l1", pinning: "left", subColumns: [firstLeft, { label: "sub l2" }] },
			{ label: "label l2", pinning: "left" },
			{ label: "label s1", subColumns: [firstScroll, COLUMN] },
			{ label: "label s2" },
			firstRight,
			{ label: "label r1", pinning: "right" }
		];

		expect(isFirstColumnOfArea(firstLeft, columns, "left")).toBeTruthy();
		expect(isFirstColumnOfArea(firstScroll, columns, "scroll")).toBeTruthy();
		expect(isFirstColumnOfArea(firstRight, columns, "right")).toBeTruthy();
		expect(isFirstColumnOfArea(COLUMN, columns, "right")).toBeFalsy();
	});

	test("isRightOfActionColumn", () => {
		const rightOfActionColumn: BaseColumnType = { label: "right", pinning: "right" };
		const column = { label: "label s1" };

		const columns: BaseColumnType[] = [
			{ label: "label l1", pinning: "left" },
			{ label: "label l2", pinning: "left" },
			column,
			{ label: "label s2" },
			{ label: "label r1", pinning: "right", actionColumn: true },
			rightOfActionColumn
		];

		expect(isRightOfActionColumn(rightOfActionColumn, columns)).toBeTruthy();
		expect(isRightOfActionColumn(column, columns)).toBeFalsy();
	});
});

describe("com.mgmtp.a12.widgets.table.utils.TableInternalUtils.getAllLeafColumns", () => {
	test("getAllLeafColumns", () => {
		const leaf1 = { label: "leaf 1" };
		const leaf2 = { label: "leaf 2" };
		const leaf3 = { label: "leaf 3" };
		const column: BaseColumnType = {
			label: "label",
			subColumns: [leaf1, { label: "sub", subColumns: [leaf2, leaf3] }]
		};
		expect(getAllLeafColumns(column)).toStrictEqual([leaf1, leaf2, leaf3]);
	});
});

describe("com.mgmtp.a12.widgets.table.utils.ColumnWidthSync.synchronizeColumns", () => {
	const createMockCell = (dataRole: string, widths: number): HTMLElement => {
		const cell = document.createElement("div");
		cell.setAttribute("data-role", dataRole);
		Object.defineProperty(cell, "offsetWidth", { value: widths, configurable: true });
		vi.spyOn(cell, "getBoundingClientRect").mockReturnValue({ width: widths } as DOMRect);

		return cell;
	};

	test("synchronizes columns with 2 header rows", async () => {
		// Create mock table with 2 header rows
		const mockTable = document.createElement("div");
		mockTable.setAttribute("data-role", DataRoles.Table);

		// First header row cells
		const firstHeaderRowCells = Array.from({ length: 3 }, (_, i) =>
			createMockCell(DataRoles.Table.Header.Cell, 120 + i * 10)
		);

		// Second header row cells
		const secondHeaderRowCells = Array.from({ length: 3 }, (_, i) =>
			createMockCell(DataRoles.Table.Header.Cell, 110 + i * 15)
		);

		// Data row cells
		const dataRowCells = Array.from({ length: 3 }, (_, i) => createMockCell(DataRoles.Table.Body.Cell, 100 + i * 5));

		const allCells = [...firstHeaderRowCells, ...secondHeaderRowCells, ...dataRowCells];

		// Mock action cells (2 action columns, 3 rows total)
		const actionCells = [
			firstHeaderRowCells[0],
			firstHeaderRowCells[2],
			secondHeaderRowCells[0],
			secondHeaderRowCells[2],
			dataRowCells[0],
			dataRowCells[2]
		];

		// Mock querySelectorAll
		vi.spyOn(mockTable, "querySelectorAll").mockImplementation((selector: string) => {
			if (selector.includes('[data-role$="cell"]')) {
				return allCells as any;
			}

			if (selector.includes('[data-type="table-action-cell"]')) {
				return actionCells as any;
			}

			if (selector.includes('[data-role$="-row"]')) {
				return Array(3).fill(document.createElement("div")) as any;
			}

			return [] as any;
		});

		vi.spyOn(mockTable, "querySelector").mockReturnValue(null);

		const onDoneMock = vi.fn();

		ColumnWidthSync.synchronizeColumns(mockTable, {
			onDone: onDoneMock,
			numberActionColumns: 2
		});

		await waitFor(() => {
			expect(onDoneMock).toHaveBeenCalled();
		});

		// Verify that columns are synchronized
		// First column should use max width from header rows (120px from headerRow1Cells[0])
		expect(firstHeaderRowCells[0].style.width).toBe("120px");
		expect(secondHeaderRowCells[0].style.width).toBe("120px");
		expect(dataRowCells[0].style.width).toBe("120px");

		// Second column should use max width from header rows (140px from headerRow1Cells[2])
		expect(firstHeaderRowCells[2].style.width).toBe("140px");
		expect(secondHeaderRowCells[2].style.width).toBe("140px");
		expect(dataRowCells[2].style.width).toBe("140px");
	});
});
