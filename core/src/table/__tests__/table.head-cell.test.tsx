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

import { fireEvent, getByDataRole, render } from "test-utils";
import { Key } from "ts-key-enum";
import { describe, vi, expect, test } from "vitest";

import { noop } from "../../common/main/utils.js";
import { Button } from "../../button/main/button.view.js";
import { Icon } from "../../icon/main/icon.view.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { Switch } from "../../input/switch/main/switch.view.js";
import { Status } from "../../status/main/status.view.js";
import { Tag } from "../../tag/main/tag/tag.view.js";

import type { BaseColumnType, Column } from "../new-api/column.api.js";
import { DefaultTableComponentRenderers, TableContextProvider } from "../new-api/table.view.js";
import { TableInternalUtils } from "../new-api/table.utils.js";
import { HeadCell } from "../new-api/table.head-cell.view.js";

describe("com.mgmtp.a12.widgets.table.head-cell", () => {
	type ColumnType = BaseColumnType;

	test("properties", () => {
		const headContentRendererFn = vi.fn();
		const column: ColumnType = { label: "", width: 1.5, subInfo: true, fixedWidth: true, title: "title test" };

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: { ...DefaultTableComponentRenderers, headContentRenderer: headContentRendererFn },
					columns: []
				}}
			>
				<HeadCell column={column} role="grid" style={{ color: "red" }} />
			</TableContextProvider>
		);

		expect(headContentRendererFn).toHaveBeenCalledWith({ column });
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
				<HeadCell column={column} />
			</TableContextProvider>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("sortable", () => {
		const column: ColumnType = { label: "label test", sortable: true, dataKey: "sort" };
		const onSortFn = vi.fn();

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: [],
					sortOptions: {
						sortState: { column, order: "desc" },
						onSort: onSortFn
					}
				}}
			>
				<HeadCell column={column} />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();

		const headerCell = getByDataRole(container, "table-header-cell");
		fireEvent.click(headerCell);
		expect(onSortFn).toHaveBeenCalledTimes(1);
		onSortFn.mockReset();

		fireEvent.keyUp(headerCell, { key: Key.Enter });
		expect(onSortFn).toHaveBeenCalledTimes(1);
		onSortFn.mockReset();
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
				<HeadCell column={column} />
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
					<HeadCell
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
						<HeadCell column={{ ...column, actionColumn: true }} />
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
							<HeadCell column={{ ...column, actionColumn: false }} />
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
						<HeadCell column={{ ...column, fixedWidth: true }} />
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
						<HeadCell column={{ ...column, actionColumn: true }} />
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
						<HeadCell column={{ ...column, actionColumn: false, pinning: "left" }} />
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
						<HeadCell column={{ ...column, actionColumn: false, pinning: undefined, fixedWidth: false }} />
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
				<HeadCell column={column} />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	describe("htmlAttributes", () => {
		test("should add the className and id for the head cell", () => {
			const column: ColumnType = {
				label: "htmlAttributes test",
				htmlAttributes: {
					className: "test",
					id: "id-test"
				}
			};

			const { container } = render(
				<TableContextProvider
					value={{
						componentRenderers: DefaultTableComponentRenderers,
						columns: []
					}}
				>
					<HeadCell column={{ ...column, fixedWidth: true }} />
				</TableContextProvider>
			);

			const tableHeadCell = getByDataRole(container, "table-header-cell");

			expect(tableHeadCell).toBeTruthy();
			expect(tableHeadCell?.className.includes("test")).toBe(true);
			expect(tableHeadCell?.id).toEqual("id-test");
		});

		test("should call onClick after clicking to the head cell", () => {
			const mockOnClick = vi.fn();
			const column: ColumnType = {
				label: "htmlAttributes test",
				htmlAttributes: {
					onClick: mockOnClick
				}
			};

			const { container } = render(
				<TableContextProvider
					value={{
						componentRenderers: DefaultTableComponentRenderers,
						columns: []
					}}
				>
					<HeadCell column={{ ...column, fixedWidth: true }} />
				</TableContextProvider>
			);

			const tableHeadCell = getByDataRole(container, "table-header-cell");

			expect(tableHeadCell).toBeTruthy();

			fireEvent.click(tableHeadCell);

			expect(mockOnClick).toHaveBeenCalled();
		});
	});

	test("head cell with button icons", () => {
		const column: ColumnType = {
			label: "selection",
			dataKey: "",
			actionColumn: true,
			pinning: "left"
		};

		const headContentRenderer = (props: any) => {
			if (props.column.label === "selection") {
				return <Button destructive primary icon={<Icon>delete</Icon>} title="Primary destructive icon button" />;
			}

			return DefaultTableComponentRenderers.headContentRenderer(props);
		};

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: { ...DefaultTableComponentRenderers, headContentRenderer },
					columns: []
				}}
			>
				<HeadCell column={column} />
			</TableContextProvider>
		);

		const button = getByDataRole(container, DataRoles.Button);
		expect(button).toMatchSnapshot();
	});

	test("head cell with switch", () => {
		const column: ColumnType = {
			label: "settings",
			dataKey: "",
			actionColumn: true,
			pinning: "left"
		};

		const headContentRenderer = (props: any) => {
			if (props.column.label === "settings") {
				return <Switch label="Enable feature" hideLabel checked={false} onChange={vi.fn()} />;
			}

			return DefaultTableComponentRenderers.headContentRenderer(props);
		};

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: { ...DefaultTableComponentRenderers, headContentRenderer },
					columns: []
				}}
			>
				<HeadCell column={column} />
			</TableContextProvider>
		);

		const switchElement = getByDataRole(container, DataRoles.Switch);
		expect(switchElement).toMatchSnapshot();
	});

	test("head cell with status", () => {
		const column: ColumnType = {
			label: "status",
			dataKey: "status",
			width: 1,
			horizontalAlignment: "center"
		};

		const headContentRenderer = (props: any) => {
			if (props.column.label === "status") {
				return (
					<Status icon={<Icon>delete</Icon>} variant="success">
						Active
					</Status>
				);
			}

			return DefaultTableComponentRenderers.headContentRenderer(props);
		};

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: { ...DefaultTableComponentRenderers, headContentRenderer },
					columns: []
				}}
			>
				<HeadCell column={column} />
			</TableContextProvider>
		);

		const statusElement = getByDataRole(container, DataRoles.Status);
		const statusIcon = getByDataRole(statusElement, DataRoles.Status.Icon);
		const iconWrapper = getByDataRole(statusIcon, DataRoles.Icon);

		expect(iconWrapper).toMatchSnapshot();
	});

	test("head cell with removable tag", () => {
		const column: ColumnType = {
			label: "tags",
			dataKey: "tags",
			width: 1.5,
			actionColumn: true,
			pinning: "left"
		};

		const headContentRenderer = (props: any) => {
			if (props.column.label === "tags") {
				return (
					<Tag
						removable
						id="filter-tag"
						color="#2f9d2f"
						onRemove={vi.fn()}
						icon={<Icon iconTheme="outlined">laptop</Icon>}
					>
						Filter Applied
					</Tag>
				);
			}

			return DefaultTableComponentRenderers.headContentRenderer(props);
		};

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: { ...DefaultTableComponentRenderers, headContentRenderer },
					columns: []
				}}
			>
				<HeadCell column={column} />
			</TableContextProvider>
		);

		const icon = getByDataRole(getByDataRole(container, DataRoles.Tag.Icon), DataRoles.Icon);

		expect(icon).toMatchSnapshot();
	});
});
