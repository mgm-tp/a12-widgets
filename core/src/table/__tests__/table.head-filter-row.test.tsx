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
import { describe, expect, test, vi } from "vitest";

import { DefaultTableComponentRenderers, HeadFilterRow, Table, TableContextProvider } from "../main/table.view.js";
import type { BaseColumnType } from "../main/index.js";
import { getDataByKey } from "../main/index.js";

describe("com.mgmtp.a12.widgets.table.head-filter-row", () => {
	test("default", () => {
		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: []
				}}
			>
				<HeadFilterRow />
			</TableContextProvider>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("Should the action column align with the widest header cell after an empty header filter cell is added.", async () => {
		type DataType = {
			name: string;
			calories: number;
			fat: number;
		};

		const createColumn = (params: {
			label: string;
			dataKey: string;
			width?: number;
			actionColumn?: boolean;
			pinning?: "left" | "right";
		}): BaseColumnType<DataType> => ({
			label: params.label,
			dataKey: params.dataKey,
			width: params.width,
			actionColumn: params.actionColumn,
			pinning: params.pinning
		});

		const createData = (params: { name: string; calories: number; fat: number }): DataType => ({
			name: params.name,
			calories: params.calories,
			fat: params.fat
		});
		const columns: BaseColumnType<DataType>[] = [
			createColumn({ label: "", dataKey: "leftAction", actionColumn: true, pinning: "left" }),
			createColumn({ label: "Dessert (100g)", dataKey: "name" }),
			createColumn({ label: "Calories", dataKey: "calories" }),
			createColumn({ label: "Fat (g)", dataKey: "fat" }),
			createColumn({ label: "", dataKey: "rightAction", actionColumn: true, pinning: "right" })
		];

		const rows: DataType[] = [
			createData({ name: "Frozen yoghurt", calories: 159, fat: 6.0 }),
			createData({ name: "Ice cream sandwich", calories: 237, fat: 9.0 }),
			createData({ name: "Eclair", calories: 262, fat: 16.0 })
		];

		vi.useFakeTimers();

		const { container, rerender } = render(
			<Table<DataType>
				columns={columns}
				data={rows}
				componentRenderers={{
					headContentRenderer: (props) => {
						if (props.column.dataKey === "leftAction") {
							return <div>Left Action</div>;
						}

						if (props.column.dataKey === "rightAction") {
							return <div>Right Action</div>;
						}

						return DefaultTableComponentRenderers.headContentRenderer(props);
					},
					bodyContentRenderer: ({ column, row }) => {
						if (column.actionColumn) {
							return null;
						}

						return getDataByKey(row, column.dataKey ?? columns.indexOf(column)) as string;
					}
				}}
			/>
		);

		// Wait for the width to be calculated
		vi.advanceTimersByTime(1000);

		const actionCells = Array.from(container.querySelectorAll('[data-type="table-action-cell"]')) as HTMLElement[];
		const firstActionCellsColumnWidth = actionCells[0].style.width;
		const secondActionCellsColumnWidth = actionCells[1].style.width;

		// Re-render with an empty filter row with no content (the table now has two header rows) to check whether the action column widths still match the first header row’s cell width.
		rerender(
			<Table<DataType>
				columns={columns}
				data={rows}
				componentRenderers={{
					headContentRenderer: (props) => {
						if (props.column.dataKey === "leftAction") {
							return <div>Left Action</div>;
						}

						if (props.column.dataKey === "rightAction") {
							return <div>Right Action</div>;
						}

						return DefaultTableComponentRenderers.headContentRenderer(props);
					},
					headFilterContentRenderer: () => null, // Each cell has a null value, so the header filter cell reaches the minimum width.
					bodyContentRenderer: ({ column, row }) => {
						if (column.actionColumn) {
							return null;
						}

						return getDataByKey(row, column.dataKey ?? columns.indexOf(column)) as string;
					}
				}}
			/>
		);

		// Wait for the width to be calculated
		vi.advanceTimersByTime(1000);

		const firstActionCellsColumnWidthAfterRerender = actionCells[0].style.width;
		const secondActionCellsColumnWidthAfterRerender = actionCells[1].style.width;

		expect(firstActionCellsColumnWidthAfterRerender).toBeTruthy();
		expect(firstActionCellsColumnWidthAfterRerender).toBe(firstActionCellsColumnWidth);
		expect(secondActionCellsColumnWidthAfterRerender).toBeTruthy();
		expect(secondActionCellsColumnWidthAfterRerender).toBe(secondActionCellsColumnWidth);

		vi.useRealTimers();
	});
});
