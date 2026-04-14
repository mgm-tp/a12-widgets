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

import { noop } from "../../common/main/utils.js";

import type { BaseColumnType, Column } from "../new-api/column.api.js";
import { TableInternalUtils } from "../new-api/table.utils.js";
import { DefaultTableComponentRenderers, HeadFilterCell, TableContextProvider } from "../new-api/table.view.js";

describe("com.mgmtp.a12.widgets.table.head-filter-cell", () => {
	type ColumnType = BaseColumnType;

	test("default", () => {
		const column: ColumnType = { label: "", width: 1.5, subInfo: true, fixedWidth: true, title: "title test" };
		const headFilterContentRendererFn = vi.fn();

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: {
						...DefaultTableComponentRenderers,
						headFilterContentRenderer: headFilterContentRendererFn
					},
					columns: []
				}}
			>
				<HeadFilterCell column={column} />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
		expect(headFilterContentRendererFn).toHaveBeenCalledWith({ column });
	});

	test("card view", () => {
		const column: ColumnType = { label: "label test" };

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: [],
					cardView: true
				}}
			>
				<HeadFilterCell column={column} />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("action column", () => {
		const column: ColumnType = { label: "", width: 1.5, actionColumn: true };

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: [],
					cardView: true
				}}
			>
				<HeadFilterCell column={column} />
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
					<HeadFilterCell
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

	describe("fixedWidth", () => {
		const column: ColumnType = { label: "label test" };

		describe("with resizing columns", () => {
			test("should not for action column", () => {
				const { container } = render(
					<TableContextProvider
						value={{
							componentRenderers: DefaultTableComponentRenderers,
							columns: [],
							resizable: true
						}}
					>
						<HeadFilterCell column={{ ...column, actionColumn: true }} />
					</TableContextProvider>
				);

				expect(container.firstChild).toMatchSnapshot();
			});

			test("should depend on whether the normal column is rightmost scroll or not", () => {
				const spy = vi.spyOn(TableInternalUtils, "isLastColumnOfArea");

				[false, true].forEach((isLastScrollColumn) => {
					spy.mockImplementation(() => isLastScrollColumn);
					const { container } = render(
						<TableContextProvider
							value={{
								componentRenderers: DefaultTableComponentRenderers,
								columns: [],
								resizable: true
							}}
						>
							<HeadFilterCell column={{ ...column, actionColumn: false }} />
						</TableContextProvider>
					);

					expect(container.firstChild).toMatchSnapshot();
				});

				spy.mockRestore();
			});
		});

		describe("without resizing columns", () => {
			test("should be if props.fixedWidth = true", () => {
				const { container } = render(
					<TableContextProvider
						value={{
							componentRenderers: DefaultTableComponentRenderers,
							columns: []
						}}
					>
						<HeadFilterCell column={{ ...column, fixedWidth: true }} />
					</TableContextProvider>
				);

				expect(container.firstChild).toMatchSnapshot();
			});

			test("should not for action column", () => {
				const { container } = render(
					<TableContextProvider
						value={{
							componentRenderers: DefaultTableComponentRenderers,
							columns: []
						}}
					>
						<HeadFilterCell column={{ ...column, actionColumn: true }} />
					</TableContextProvider>
				);

				expect(container.firstChild).toMatchSnapshot();
			});

			test("should be if the column is not action column but pinned", () => {
				const { container } = render(
					<TableContextProvider
						value={{
							componentRenderers: DefaultTableComponentRenderers,
							columns: []
						}}
					>
						<HeadFilterCell column={{ ...column, actionColumn: false, pinning: "left" }} />
					</TableContextProvider>
				);

				expect(container.firstChild).toMatchSnapshot();
			});

			test("should not be for normal column", () => {
				const { container } = render(
					<TableContextProvider
						value={{
							componentRenderers: DefaultTableComponentRenderers,
							columns: []
						}}
					>
						<HeadFilterCell column={{ ...column, actionColumn: false, pinning: undefined, fixedWidth: false }} />
					</TableContextProvider>
				);

				expect(container.firstChild).toMatchSnapshot();
			});
		});
	});

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
					columns: [],
					sortOptions: { sortState: { column, order: "desc" }, onSort: noop }
				}}
			>
				<HeadFilterCell column={column} />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
	});
});
