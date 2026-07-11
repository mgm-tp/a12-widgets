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
import { describe, vi, expect, test } from "vitest";

import { BASE_TABLE_CLASSNAME } from "../main/table.internal.js";
import type { BaseColumnType } from "../main/column.api.js";
import { DefaultTableComponentRenderers, TableContextProvider } from "../main/table.view.js";
import { HeadCellGroup } from "../main/table.head-cell-group.view.js";

describe("com.mgmtp.a12.widgets.table.head-cell-group", () => {
	type ColumnType = BaseColumnType;

	test("column group", () => {
		const column: ColumnType = {
			label: "group test",
			width: 2,
			subColumns: [{ label: "sub1 test" }, { label: "sub2 test" }]
		};

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: []
				}}
			>
				<HeadCellGroup column={column} />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("single column", () => {
		const column: ColumnType = { label: "", width: 1.5 };

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: []
				}}
			>
				<HeadCellGroup column={column} />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulate renderers", () => {
		const column: ColumnType = {
			label: "group test",
			width: 2,
			subColumns: [{ label: "sub1 test" }, { label: "sub2 test" }]
		};
		const headCellRendererFn = vi.fn();
		const headCellGroupRendererFn = vi.fn();

		render(
			<TableContextProvider
				value={{
					componentRenderers: {
						...DefaultTableComponentRenderers,
						headCellRenderer: headCellRendererFn,
						headCellGroupRenderer: headCellGroupRendererFn
					},
					columns: []
				}}
			>
				<HeadCellGroup column={column} />
			</TableContextProvider>
		);

		expect(headCellRendererFn).toHaveBeenCalledWith({
			column,
			className: `${BASE_TABLE_CLASSNAME}__header-group-parent`,
			fixedWidth: false,
			dataRole: "table-header-cell-group-parent"
		});
		expect(headCellGroupRendererFn).toHaveBeenCalledTimes(2);
	});
});
