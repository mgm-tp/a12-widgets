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

import { Range } from "../../common/main/utils.js";

import type { BaseColumnType, Column } from "../main/column.api.js";
import { DefaultTableComponentRenderers, TableContextProvider } from "../main/table.view.js";
import { BodyCell } from "../main/table.body-cell.view.js";

describe("com.mgmtp.a12.widgets.table.body-cell", () => {
	const COLUMN_COUNT = 4;
	type ColumnType = BaseColumnType;

	const data: number[] = Array.from(new Range(COLUMN_COUNT)).map(() => Math.random() * 100);

	test("properties", () => {
		const bodyContentRendererFn = vi.fn();
		const column: ColumnType = { label: "", width: 1.5, subInfo: true, fixedWidth: true };

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: { ...DefaultTableComponentRenderers, bodyContentRenderer: bodyContentRendererFn },
					columns: [],
					cellStyling: () => ({ useSecondaryColor: true, secondaryCellTitle: "title test" })
				}}
			>
				<BodyCell rowIndex={1} row={data} column={column} />
			</TableContextProvider>
		);

		expect(bodyContentRendererFn).toHaveBeenCalledWith({ column, row: data, rowIndex: 1 });
		expect(container.firstChild).toMatchSnapshot();
	});

	test("action column", () => {
		const column: ColumnType = { label: "", width: 1.5, actionColumn: true };

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: []
				}}
			>
				<BodyCell rowIndex={1} row={data} column={column} />
			</TableContextProvider>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("cardView", () => {
		const column: ColumnType = { label: "label test" };

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: [],
					cardView: true
				}}
			>
				<BodyCell rowIndex={1} row={data} column={column} />
			</TableContextProvider>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("alignment", () => {
		const column: ColumnType = { label: "label test" };
		const testCases: [Column.HorizontalAlignment, Column.VerticalAlignment][] = [
			["left", "top"],
			["left", "middle"],
			["left", "bottom"],
			["center", "top"],
			["center", "middle"],
			["center", "bottom"],
			["right", "top"],
			["right", "middle"],
			["right", "bottom"]
		];

		testCases.forEach(([horizontalAlignment, verticalAlignment]) => {
			const { container } = render(
				<TableContextProvider
					value={{
						componentRenderers: DefaultTableComponentRenderers,
						columns: []
					}}
				>
					<BodyCell
						rowIndex={1}
						row={data}
						column={{
							...column,
							horizontalAlignment,
							verticalAlignment,
							specificHorizontalAlignment: { body: horizontalAlignment },
							specificVerticalAlignment: { body: verticalAlignment }
						}}
					/>
				</TableContextProvider>
			);

			expect(container.firstChild).toMatchSnapshot();
		});
	});

	test("column group", () => {
		const column: ColumnType = {
			label: "group test",
			subColumns: [{ label: "sub1 test" }, { label: "sub2 test" }]
		};
		const bodyCellRendererFn = vi.fn();

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: { ...DefaultTableComponentRenderers, bodyCellRenderer: bodyCellRendererFn },
					columns: []
				}}
			>
				<BodyCell rowIndex={1} row={data} column={column} />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
		expect(bodyCellRendererFn).toHaveBeenCalledTimes(column.subColumns?.length ?? 0);
	});
});
