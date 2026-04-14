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

import { render } from "test-utils";
import { describe, expect, test } from "vitest";

import { Range } from "../../common/main/utils.js";

import type { BaseColumnType } from "../new-api/column.api.js";
import { DefaultTableComponentRenderers, Table, TableContextProvider } from "../new-api/table.view.js";

describe("com.mgmtp.a12.widgets.table.cross-tabulation", () => {
	const COLUMN_COUNT = 4;
	const ROW_COUNT = 10;
	type RowType = number[];
	type ColumnType = BaseColumnType<RowType>;
	const data: RowType[] = Array.from(new Range(ROW_COUNT)).map((row) =>
		Array.from(new Range(COLUMN_COUNT)).map((col) => Number(`${row + 1}${col + 1}`))
	);

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

	const columns: ColumnType[] = [
		{ label: "Column 1", verticalHeader: true, pinning: "left" },
		{ label: "Column 2" },
		{ label: "Column 3" },
		{ label: "Column 4" }
	];

	test("Cross Tabulation with normal column", () => {
		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: [],
					crossTabulation: true
				}}
			>
				<Table<RowType, ColumnType> columns={columns} data={data} />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("Cross Tabulation with column group", () => {
		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: [],
					crossTabulation: true
				}}
			>
				<Table<RowType, ColumnType> columns={columnGroup} data={data} />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
	});
});
