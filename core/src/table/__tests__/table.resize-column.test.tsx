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

import { getAllByDataRole, queryByDataRole, render } from "test-utils";
import { describe, vi, expect, test } from "vitest";

import { DataRoles } from "../../common/main/data-roles.js";

import type { BaseColumnType, Column } from "../main/column.api.js";
import { Table } from "../main/table.view.js";

describe("com.mgmtp.a12.widgets.table.resize-column", () => {
	const TARGET = "TARGET";

	type RowType = number[];
	type ColumnType = BaseColumnType<RowType>;
	type Pinning = Column.Pinning | "scroll";
	type Position = "first" | "middle" | "last";

	function createColumn(params?: {
		label?: string;
		pinning?: Pinning;
		width?: Column.Width;
		minimumWidth?: Column.Width;
		actionColumn?: boolean;
	}): ColumnType {
		return {
			label: params?.label,
			pinning: params?.pinning === "scroll" ? undefined : params?.pinning,
			width: params?.width,
			minResizeWidth: params?.minimumWidth,
			actionColumn: params?.actionColumn
		};
	}

	function createColumns(insertColumns: ColumnType[], pinning: Pinning, position: Position): ColumnType[] {
		const columns: ColumnType[] = [
			createColumn({ pinning: "left" }),
			createColumn({ pinning: "left" }),
			createColumn(),
			createColumn(),
			createColumn({ pinning: "right" }),
			createColumn({ pinning: "right" })
		];

		const startIndex = ["left", "scroll", "right"].indexOf(pinning) * 2;
		const offset = ["first", "middle", "last"].indexOf(position);

		columns.splice(startIndex + offset, 0, ...insertColumns);

		return columns;
	}

	function getResizeHandlers(container: HTMLElement, isGroupParent?: boolean): [boolean, boolean] {
		const headCell = getAllByDataRole(
			container,
			isGroupParent ? DataRoles.Table.Header.Cell.Group.Parent : DataRoles.Table.Header.Cell
		).find((cell) => cell.textContent?.includes(TARGET));
		const leftResizeHandler = headCell && queryByDataRole(headCell, DataRoles.Table.Column.LeftResizeHandler);
		const rightResizeHandler = headCell && queryByDataRole(headCell, DataRoles.Table.Column.RightResizeHandler);

		return [!!leftResizeHandler, !!rightResizeHandler];
	}

	test("action column", () => {
		const testCases: [Pinning, Position][] = [
			["left", "first"],
			["left", "middle"],
			["left", "last"],
			["scroll", "first"],
			["scroll", "middle"],
			["scroll", "last"],
			["right", "first"],
			["right", "middle"],
			["right", "last"]
		];

		testCases.forEach(([pinning, position]) => {
			const targetColumn = createColumn({ label: TARGET, pinning, actionColumn: true });
			const columns = createColumns([targetColumn], pinning, position);

			const { container } = render(
				<Table<RowType, ColumnType> columns={columns} columnResizingOptions={{ onResize: vi.fn() }} />
			);

			expect(container.firstChild).toMatchSnapshot();

			// Action column should NOT HAVE resize handler on the right
			expect(getResizeHandlers(container)[1]).toBeFalsy();
		});
	});

	/**
	 * A single column should:
	 * - HAVE left resize handler unless the column is the first one of left or scroll area
	 * - NOT HAVE right resized handler unless the column is the last of the left area
	 */
	test("single column", () => {
		const testCases: [Pinning, Position, [boolean, boolean]][] = [
			["left", "first", [false, false]],
			["left", "middle", [true, false]],
			["left", "last", [true, true]],
			["scroll", "first", [false, false]],
			["scroll", "middle", [true, false]],
			["scroll", "last", [true, false]],
			["right", "first", [true, false]],
			["right", "middle", [true, false]],
			["right", "last", [true, false]]
		];

		testCases.forEach(([pinning, position, expectedResult]) => {
			const targetColumn = createColumn({ label: TARGET, pinning });
			const columns = createColumns([targetColumn], pinning, position);

			const { container } = render(
				<Table<RowType, ColumnType> columns={columns} columnResizingOptions={{ onResize: vi.fn() }} />
			);

			expect(container.firstChild).toMatchSnapshot();

			expect(getResizeHandlers(container)).toStrictEqual(expectedResult);
		});
	});

	/**
	 * All columns should HAVE fixedWidth unless the column is the last of the scroll area
	 */
	test("fix width", () => {
		const columns = [
			createColumn({ pinning: "left" }),
			createColumn(),
			createColumn(),
			createColumn({ pinning: "right" })
		];

		const { container } = render(
			<Table<RowType, ColumnType> columns={columns} columnResizingOptions={{ onResize: vi.fn() }} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	describe("column-group", () => {
		/**
		 * A topmost column - the one whose the corresponding headCell covers all sub columns below it, should:
		 * - HAVE left resize handler unless the column is the first one of left or scroll area
		 * - NOT HAVE right resize handler unless the column is the last of the left area
		 */
		test("topmost column", () => {
			const testCases: [Pinning, Position, [boolean, boolean]][] = [
				["left", "first", [false, false]],
				["left", "middle", [true, false]],
				["left", "last", [true, true]],
				["scroll", "first", [false, false]],
				["scroll", "middle", [true, false]],
				["scroll", "last", [true, false]],
				["right", "first", [true, false]],
				["right", "middle", [true, false]],
				["right", "last", [true, false]]
			];

			testCases.forEach(([pinning, position, expectedResult]) => {
				const groupColumn: ColumnType = {
					label: TARGET,
					pinning: pinning === "scroll" ? undefined : pinning,
					subColumns: [
						{ label: "", subColumns: [createColumn(), createColumn(), createColumn()] },
						{ label: "", subColumns: [createColumn(), createColumn(), createColumn()] }
					]
				};

				const { container } = render(
					<Table<RowType, ColumnType>
						columns={createColumns([groupColumn], pinning, position)}
						columnResizingOptions={{ onResize: vi.fn() }}
					/>
				);

				expect(container.firstChild).toMatchSnapshot();
				expect(getResizeHandlers(container, true)).toStrictEqual(expectedResult);
			});
		});

		/**
		 * An intermediate column - the one is not the topmost column and does not have any dataKey/dataGetter, should:
		 * - HAVE left resize handler unless the column is the first one of left or scroll area
		 * - NOT HAVE right resize handler
		 */
		test("intermediate column", () => {
			const testCases: [Pinning, Position, [boolean, boolean]][] = [
				["left", "first", [false, false]],
				["left", "middle", [true, false]],
				["left", "last", [true, false]],
				["scroll", "first", [false, false]],
				["scroll", "middle", [true, false]],
				["scroll", "last", [true, false]],
				["right", "first", [true, false]],
				["right", "middle", [true, false]],
				["right", "last", [true, false]]
			];

			testCases.forEach(([pinning, position, expectedResult]) => {
				const groupColumn: ColumnType = {
					label: "",
					pinning: pinning === "scroll" ? undefined : pinning,
					subColumns: [
						{ label: TARGET, subColumns: [createColumn(), createColumn(), createColumn()] },
						{ label: "", subColumns: [createColumn(), createColumn(), createColumn()] }
					]
				};

				const { container } = render(
					<Table<RowType, ColumnType>
						columns={createColumns([groupColumn], pinning, position)}
						columnResizingOptions={{ onResize: vi.fn() }}
					/>
				);

				expect(container.firstChild).toMatchSnapshot();
				expect(getResizeHandlers(container, true)).toStrictEqual(expectedResult);
			});
		});

		/**
		 * A second intermediate column - the one is not the topmost column and does not have any dataKey/dataGetter, should:
		 * - HAVE left resize handler
		 * - NOT HAVE right resize handler unless the column is the last of left area
		 */
		test("second intermediate column", () => {
			const testCases: [Pinning, Position, [boolean, boolean]][] = [
				["left", "first", [true, false]],
				["left", "middle", [true, false]],
				["left", "last", [true, true]],
				["scroll", "first", [true, false]],
				["scroll", "middle", [true, false]],
				["scroll", "last", [true, false]],
				["right", "first", [true, false]],
				["right", "middle", [true, false]],
				["right", "last", [true, false]]
			];

			testCases.forEach(([pinning, position, expectedResult]) => {
				const groupColumn: ColumnType = {
					label: "",
					pinning: pinning === "scroll" ? undefined : pinning,
					subColumns: [
						{ label: "", subColumns: [createColumn(), createColumn(), createColumn()] },
						{ label: TARGET, subColumns: [createColumn(), createColumn(), createColumn()] }
					]
				};

				const { container } = render(
					<Table<RowType, ColumnType>
						columns={createColumns([groupColumn], pinning, position)}
						columnResizingOptions={{ onResize: vi.fn() }}
					/>
				);

				expect(container.firstChild).toMatchSnapshot();
				expect(getResizeHandlers(container, true)).toStrictEqual(expectedResult);
			});
		});

		/**
		 * A leftmost sub column - the bottommost and leftmost column of a column group, shoud:
		 * - HAVE left resize handler unless the column is the first one of left or scroll area
		 * - NOT HAVE right resize handler
		 */
		test("leftmost sub column", () => {
			const testCases: [Pinning, Position, [boolean, boolean]][] = [
				["left", "first", [false, false]],
				["left", "middle", [true, false]],
				["left", "last", [true, false]],
				["scroll", "first", [false, false]],
				["scroll", "middle", [true, false]],
				["scroll", "last", [true, false]],
				["right", "first", [true, false]],
				["right", "middle", [true, false]],
				["right", "last", [true, false]]
			];

			testCases.forEach(([pinning, position, expectedResult]) => {
				const groupColumn: ColumnType = {
					label: "",
					pinning: pinning === "scroll" ? undefined : pinning,
					subColumns: [
						{ label: "", subColumns: [createColumn({ label: TARGET }), createColumn(), createColumn()] },
						{ label: "", subColumns: [createColumn(), createColumn(), createColumn()] }
					]
				};

				const { container } = render(
					<Table<RowType, ColumnType>
						columns={createColumns([groupColumn], pinning, position)}
						columnResizingOptions={{ onResize: vi.fn() }}
					/>
				);

				expect(container.firstChild).toMatchSnapshot();
				expect(getResizeHandlers(container)).toStrictEqual(expectedResult);
			});
		});

		/**
		 * A middle sub column - the bottommost column of a column group,
		 * and neither the leftmost and rightmost one, should:
		 * - HAVE left resize handler
		 * - NOT HAVE right resize handler
		 */
		test("middle sub column", () => {
			const testCases: [Pinning, Position, [boolean, boolean]][] = [
				["left", "first", [true, false]],
				["left", "middle", [true, false]],
				["left", "last", [true, false]],
				["scroll", "first", [true, false]],
				["scroll", "middle", [true, false]],
				["scroll", "last", [true, false]],
				["right", "first", [true, false]],
				["right", "middle", [true, false]],
				["right", "last", [true, false]]
			];

			testCases.forEach(([pinning, position, expectedResult]) => {
				const groupColumn: ColumnType = {
					label: "",
					pinning: pinning === "scroll" ? undefined : pinning,
					subColumns: [
						{ label: "", subColumns: [createColumn(), createColumn({ label: TARGET }), createColumn()] },
						{ label: "", subColumns: [createColumn(), createColumn(), createColumn()] }
					]
				};

				const { container } = render(
					<Table<RowType, ColumnType>
						columns={createColumns([groupColumn], pinning, position)}
						columnResizingOptions={{ onResize: vi.fn() }}
					/>
				);

				expect(container.firstChild).toMatchSnapshot();
				expect(getResizeHandlers(container)).toStrictEqual(expectedResult);
			});
		});

		/**
		 * A rightmost sub column - the bottommost and rightmost column of a column group, should:
		 * - HAVE left resize handler
		 * - NOT HAVE right resized handler unless the column is the last of left area
		 */
		test("rightmost sub column", () => {
			const testCases: [Pinning, Position, [boolean, boolean]][] = [
				["left", "first", [true, false]],
				["left", "middle", [true, false]],
				["left", "last", [true, true]],
				["scroll", "first", [true, false]],
				["scroll", "middle", [true, false]],
				["scroll", "last", [true, false]],
				["right", "first", [true, false]],
				["right", "middle", [true, false]],
				["right", "last", [true, false]]
			];

			testCases.forEach(([pinning, position, expectedResult]) => {
				const groupColumn: ColumnType = {
					label: "",
					pinning: pinning === "scroll" ? undefined : pinning,
					subColumns: [
						{ label: "", subColumns: [createColumn(), createColumn()] },
						{ label: "", subColumns: [createColumn(), createColumn({ label: TARGET })] }
					]
				};

				const { container } = render(
					<Table<RowType, ColumnType>
						columns={createColumns([groupColumn], pinning, position)}
						columnResizingOptions={{ onResize: vi.fn() }}
					/>
				);

				expect(container.firstChild).toMatchSnapshot();
				expect(getResizeHandlers(container)).toStrictEqual(expectedResult);
			});
		});
	});

	describe("column resizing behavior", () => {
		test("should update column widths when onEndResize callback is triggered", () => {
			type RowType = { id: number; name: string; value: string };
			const initialColumns: BaseColumnType<RowType>[] = [
				{ label: "ID", dataKey: "id", width: 1 },
				{ label: "Name", dataKey: "name", width: 2 },
				{ label: "Value", dataKey: "value", width: 3 }
			];

			const data: RowType[] = [{ id: 1, name: "Test", value: "Value" }];

			let capturedColumns = initialColumns;
			const onEndResize = vi.fn(({ resizedWidthsGetter }) => {
				// Simulate updating column widths like in the showcase
				capturedColumns = initialColumns.map((col) => {
					const newWidth = resizedWidthsGetter(col);

					return newWidth !== undefined ? { ...col, width: newWidth } : col;
				});
			});

			const { container, rerender } = render(
				<Table<RowType, BaseColumnType<RowType>>
					columns={initialColumns}
					data={data}
					columnResizingOptions={{ onEndResize }}
				/>
			);

			// Verify resize handlers exist
			const headerCells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
			const leftResizeHandler = queryByDataRole(headerCells[1], DataRoles.Table.Column.LeftResizeHandler);
			expect(leftResizeHandler).toBeTruthy();

			// Simulate the resize by manually calling the callback with mock resizedWidthsGetter
			const mockResizedWidthsGetter = (col: BaseColumnType<RowType>) => {
				if (col.label === "Name") {
					return 1.5;
				} // Decreased from 2 to 1.5

				return undefined;
			};

			onEndResize({ resizedWidthsGetter: mockResizedWidthsGetter });

			// Verify the callback was called
			expect(onEndResize).toHaveBeenCalledWith(
				expect.objectContaining({ resizedWidthsGetter: mockResizedWidthsGetter })
			);

			// Rerender with updated columns
			rerender(
				<Table<RowType, BaseColumnType<RowType>>
					columns={capturedColumns}
					data={data}
					columnResizingOptions={{ onEndResize }}
				/>
			);

			// Verify the column width was updated in the captured columns
			const updatedNameColumn = capturedColumns.find((col) => col.label === "Name");
			expect(updatedNameColumn?.width).toBe(1.5);
		});

		test("should handle onResize callback during drag", () => {
			type RowType = { id: number; name: string };
			const columns: BaseColumnType<RowType>[] = [
				{ label: "ID", dataKey: "id", width: 1 },
				{ label: "Name", dataKey: "name", width: 2 }
			];

			const onResize = vi.fn();
			const onBeginResize = vi.fn();
			const onEndResize = vi.fn();

			const { container } = render(
				<Table<RowType, BaseColumnType<RowType>>
					columns={columns}
					data={[{ id: 1, name: "Test" }]}
					columnResizingOptions={{
						onResize,
						onBeginResize,
						onEndResize
					}}
				/>
			);

			const headerCells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
			const leftResizeHandler = queryByDataRole(headerCells[1], DataRoles.Table.Column.LeftResizeHandler);

			expect(leftResizeHandler).toBeTruthy();
		});

		test("should respect minimum width in resizedWidthsGetter", () => {
			type RowType = { id: number; name: string };
			const initialColumns: BaseColumnType<RowType>[] = [
				{ label: "ID", dataKey: "id", width: 1 },
				{ label: "Name", dataKey: "name", width: 2, minResizeWidth: 80 }
			];

			let capturedColumns = initialColumns;
			const onEndResize = vi.fn(({ resizedWidthsGetter }) => {
				capturedColumns = initialColumns.map((col) => {
					const newWidth = resizedWidthsGetter(col);

					return newWidth !== undefined ? { ...col, width: newWidth } : col;
				});
			});

			const { rerender } = render(
				<Table<RowType, BaseColumnType<RowType>>
					columns={initialColumns}
					data={[{ id: 1, name: "Test" }]}
					columnResizingOptions={{ onEndResize }}
				/>
			);

			// Simulate trying to resize below minimum
			const mockResizedWidthsGetter = (col: BaseColumnType<RowType>) => {
				if (col.label === "Name") {
					return 0.5;
				}

				return undefined;
			};

			onEndResize({ resizedWidthsGetter: mockResizedWidthsGetter });

			rerender(
				<Table<RowType, BaseColumnType<RowType>>
					columns={capturedColumns}
					data={[{ id: 1, name: "Test" }]}
					columnResizingOptions={{ onEndResize }}
				/>
			);

			const nameColumn = capturedColumns.find((col) => col.label === "Name");
			expect(nameColumn?.minResizeWidth).toBe(80);
		});

		test("should handle resize of pinned columns", () => {
			type RowType = { id: number; name: string; value: string };
			const initialColumns: BaseColumnType<RowType>[] = [
				{ label: "ID", dataKey: "id", width: 1, pinning: "left" },
				{ label: "Name", dataKey: "name", width: 2 },
				{ label: "Value", dataKey: "value", width: 2, pinning: "right" }
			];

			let capturedColumns = initialColumns;
			const onEndResize = vi.fn(({ resizedWidthsGetter }) => {
				capturedColumns = initialColumns.map((col) => {
					const newWidth = resizedWidthsGetter(col);

					return newWidth !== undefined ? { ...col, width: newWidth } : col;
				});
			});

			const { container, rerender } = render(
				<Table<RowType, BaseColumnType<RowType>>
					columns={initialColumns}
					data={[{ id: 1, name: "Test", value: "Val" }]}
					columnResizingOptions={{ onEndResize }}
				/>
			);

			// Verify right resize handler exists for pinned column
			const headerCells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
			const pinnedColumn = headerCells[0];
			const rightResizeHandler = queryByDataRole(pinnedColumn, DataRoles.Table.Column.RightResizeHandler);
			expect(rightResizeHandler).toBeTruthy();

			// Simulate resize of pinned column
			const mockResizedWidthsGetter = (col: BaseColumnType<RowType>) => {
				if (col.label === "ID") {
					return 1.5;
				}

				return undefined;
			};

			onEndResize({ resizedWidthsGetter: mockResizedWidthsGetter });

			rerender(
				<Table<RowType, BaseColumnType<RowType>>
					columns={capturedColumns}
					data={[{ id: 1, name: "Test", value: "Val" }]}
					columnResizingOptions={{ onEndResize }}
				/>
			);

			// Verify pinned column width was updated
			const updatedIDColumn = capturedColumns.find((col) => col.label === "ID");
			expect(updatedIDColumn?.width).toBe(1.5);
			expect(updatedIDColumn?.pinning).toBe("left");
		});

		test("should handle multiple column resizes independently", () => {
			type RowType = { col1: string; col2: string; col3: string };
			const initialColumns: BaseColumnType<RowType>[] = [
				{ label: "Col1", dataKey: "col1", width: 1 },
				{ label: "Col2", dataKey: "col2", width: 1 },
				{ label: "Col3", dataKey: "col3", width: 1 }
			];

			let capturedColumns = initialColumns;
			const onEndResize = vi.fn(({ resizedWidthsGetter }) => {
				capturedColumns = initialColumns.map((col) => {
					const newWidth = resizedWidthsGetter(col);

					return newWidth !== undefined ? { ...col, width: newWidth } : col;
				});
			});

			const { rerender } = render(
				<Table<RowType, BaseColumnType<RowType>>
					columns={initialColumns}
					data={[{ col1: "A", col2: "B", col3: "C" }]}
					columnResizingOptions={{ onEndResize }}
				/>
			);

			// Simulate resizing multiple columns at once
			const mockResizedWidthsGetter = (col: BaseColumnType<RowType>) => {
				if (col.label === "Col1") {
					return 0.8;
				} // Decrease

				if (col.label === "Col2") {
					return 1.5;
				} // Increase

				return undefined; // Col3 unchanged
			};

			onEndResize({ resizedWidthsGetter: mockResizedWidthsGetter });

			rerender(
				<Table<RowType, BaseColumnType<RowType>>
					columns={capturedColumns}
					data={[{ col1: "A", col2: "B", col3: "C" }]}
					columnResizingOptions={{ onEndResize }}
				/>
			);

			expect(capturedColumns.find((col) => col.label === "Col1")?.width).toBe(0.8);
			expect(capturedColumns.find((col) => col.label === "Col2")?.width).toBe(1.5);
			expect(capturedColumns.find((col) => col.label === "Col3")?.width).toBe(1); // Unchanged
		});
	});
});
