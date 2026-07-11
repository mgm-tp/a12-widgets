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

import { fireEvent, getAllByDataRole, render } from "test-utils";
import { describe, expect, test } from "vitest";

import { Range } from "../../common/main/utils.js";

import type { BaseColumnType } from "../main/column.api.js";
import { Table } from "../main/table.view.js";

describe("com.mgmtp.a12.widgets.table.context-menu", () => {
	const COLUMN_COUNT = 4;
	const ROW_COUNT = 1;
	type RowType = number[];
	type ColumnType = BaseColumnType<RowType>;
	const data: RowType[] = Array.from(new Range(ROW_COUNT)).map((row) =>
		Array.from(new Range(COLUMN_COUNT)).map((col) => Number(`${row + 1}${col + 1}`))
	);
	const columns: ColumnType[] = [
		{ label: "Column 1" },
		{ label: "Column 2" },
		{ label: "Column 3" },
		{ label: "Column 4" }
	];

	const crossTablulationColumns: ColumnType[] = [
		{ label: "Column 1", verticalHeader: true, pinning: "left" },
		{ label: "Column 2" },
		{ label: "Column 3" },
		{ label: "Column 4" }
	];

	const columnGroup: ColumnType[] = [
		{ label: "Column 1", verticalHeader: true, pinning: "left" },
		{
			label: "Column 2",
			subColumns: [{ label: "Column 2.1" }, { label: "Column 2.2" }]
		},
		{
			label: "Column 3",
			subColumns: [
				{ label: "Column 3.1", subColumns: [{ label: "Column 3.1.1" }, { label: "Column 3.1.2" }] },
				{ label: "Column 3.2" }
			]
		},
		{ label: "Column 3" }
	];

	test("cell-highlighting", async () => {
		const { container } = render(<Table<RowType, ColumnType> columns={columns} data={data} cellHighlighting />);
		const bodyCells = getAllByDataRole(container, "table-body-cell");
		const headerCells = getAllByDataRole(container, "table-header-cell");
		fireEvent.mouseOver(bodyCells[2]);
		expect(container.firstChild).toMatchSnapshot();
		expect(headerCells[2]).toHaveStyle({ backgroundColor: "#e3e5e9" });
		expect(headerCells[2]).toMatchSnapshot();
		expect(bodyCells[2]).toMatchSnapshot();
	});

	test("cell-highlighting-in-cross-tabulation", async () => {
		const { container } = render(
			<Table<RowType, ColumnType> columns={crossTablulationColumns} cellHighlighting data={data} />
		);
		const tableBodyRowSegmentLeft = getAllByDataRole(container, `table-body-row--left`);
		const tableBodyRowSegmentScroll = getAllByDataRole(container, `table-body-row--scroll`);
		const headerCells = getAllByDataRole(container, "table-header-cell");

		const hoveredBodyCell = getAllByDataRole(tableBodyRowSegmentScroll[0], `table-body-cell`);
		expect(tableBodyRowSegmentLeft).toMatchSnapshot();
		expect(headerCells[2]).toMatchSnapshot();
		expect(hoveredBodyCell).toMatchSnapshot();

		fireEvent.mouseOver(hoveredBodyCell[1]);
		expect(tableBodyRowSegmentLeft).toMatchSnapshot();
		expect(headerCells[2]).toMatchSnapshot();
		expect(hoveredBodyCell).toMatchSnapshot();
	});

	test("cell-highlighting-in-column-group-cross-tabulation", async () => {
		const { container } = render(<Table<RowType, ColumnType> columns={columnGroup} cellHighlighting data={data} />);
		const tableBodyRowSegmentLeft = getAllByDataRole(container, `table-body-row--left`);
		const tableBodyRowSegmentScroll = getAllByDataRole(container, `table-body-row--scroll`);

		const hoveredBodyCell = getAllByDataRole(tableBodyRowSegmentScroll[0], `table-body-cell`);

		fireEvent.mouseOver(hoveredBodyCell[1]);
		expect(tableBodyRowSegmentLeft).toMatchSnapshot();
	});
});
