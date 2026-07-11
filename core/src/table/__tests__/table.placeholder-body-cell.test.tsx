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

import type { BaseColumnType } from "../main/column.api.js";
import { DefaultTableComponentRenderers, TableContextProvider } from "../main/table.view.js";
import { PlaceHolderBodyCell } from "../main/table.place-holder-body-cell.view.js";

describe("com.mgmtp.a12.widgets.table.placeholder-body-cell", () => {
	test("default", () => {
		const column: BaseColumnType = {
			label: "",
			width: 1.5,
			fixedWidth: true
		};
		const placeHolderBodyContentRendererFn = vi.fn();

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: {
						...DefaultTableComponentRenderers,
						placeHolderBodyCellRenderer: placeHolderBodyContentRendererFn
					},
					columns: []
				}}
			>
				<PlaceHolderBodyCell rowIndex={1} column={column} />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
		// expect(placeHolderBodyContentRendererFn).toHaveBeenCalledTimes(1);
	});

	test("action column", () => {
		const column: BaseColumnType = {
			label: "",
			actionColumn: true,
			width: 1.5
		};

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: []
				}}
			>
				<PlaceHolderBodyCell rowIndex={1} column={column} />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("with resizing columns", () => {
		const column: BaseColumnType = { label: "" };

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: [],
					resizable: true
				}}
			>
				<PlaceHolderBodyCell rowIndex={1} column={column} />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("column group", () => {
		const column: BaseColumnType = {
			label: "group test",
			subColumns: [{ label: "sub1 test" }, { label: "sub2 test" }]
		};
		const placeHolderBodyCellRendererFn = vi.fn();

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: {
						...DefaultTableComponentRenderers,
						placeHolderBodyCellRenderer: placeHolderBodyCellRendererFn
					},
					columns: []
				}}
			>
				<PlaceHolderBodyCell rowIndex={1} column={column} />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
		expect(placeHolderBodyCellRendererFn).toHaveBeenCalledTimes(column.subColumns?.length ?? 0);
	});
});
