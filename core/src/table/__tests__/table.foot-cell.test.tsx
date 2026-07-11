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

import type { BaseColumnType, Column } from "../main/column.api.js";
import { DefaultTableComponentRenderers, TableContextProvider } from "../main/table.view.js";
import { FootCell } from "../main/table.foot-cell.view.js";

describe("com.mgmtp.a12.widgets.table.foot-cell", () => {
	type ColumnType = BaseColumnType;

	test("properties", () => {
		const footContentRendererFn = vi.fn();
		const footCellRendererFn = vi.fn();
		const column: ColumnType = { label: "", width: 1.5, subInfo: true, fixedWidth: true };

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: {
						...DefaultTableComponentRenderers,
						footContentRenderer: footContentRendererFn,
						footCellRenderer: footCellRendererFn
					},
					columns: [],
					hasFootContent: true
				}}
			>
				<FootCell column={column} role="grid" />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
		expect(footContentRendererFn).toHaveBeenCalledWith({ column });
		expect(footCellRendererFn).toHaveBeenCalledTimes(0);
	});

	test("cardViewProperties", () => {
		const footContentRendererFn = vi.fn();
		const footCellRendererFn = vi.fn();
		const column: ColumnType = { label: "", width: 1.5, subInfo: true, fixedWidth: true };

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: {
						...DefaultTableComponentRenderers,
						footContentRenderer: footContentRendererFn,
						footCellRenderer: footCellRendererFn
					},
					columns: [],
					cardView: true,
					hasFootContent: true
				}}
			>
				<FootCell column={column} role="grid" />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
		expect(footContentRendererFn).toHaveBeenCalledWith({ column });
		expect(footCellRendererFn).toHaveBeenCalledTimes(0);
	});

	test("action column and custom role", () => {
		const column: ColumnType = { label: "", width: 1.5, actionColumn: true };

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: [],
					hasFootContent: true
				}}
			>
				<FootCell column={column} role="grid" />
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
				<FootCell column={column} />
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
					<FootCell
						column={{
							...column,
							horizontalAlignment,
							verticalAlignment,
							specificHorizontalAlignment: { foot: horizontalAlignment },
							specificVerticalAlignment: { foot: verticalAlignment }
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
		const footCellRendererFn = vi.fn();

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: { ...DefaultTableComponentRenderers, footCellRenderer: footCellRendererFn },
					columns: []
				}}
			>
				<FootCell column={column} />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
		expect(footCellRendererFn).toHaveBeenCalledTimes(column.subColumns?.length ?? 0);
	});
});
