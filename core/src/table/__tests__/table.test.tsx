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

import {
	fireEvent,
	getAllByDataRole,
	queryAllByDataRole,
	queryByDataRole,
	render,
	queryAllByAttribute,
	queryByAttribute,
	screen,
	getByDataRole
} from "test-utils";
import { describe, test, expect, vi, afterAll, beforeEach, beforeAll } from "vitest";

import { Range } from "../../common/main/utils.js";
import { getA11yResource } from "../../common/main/a11y-localization/language-context.js";
import { Button } from "../../button/main/button.view.js";
import { Icon } from "../../icon/main/icon.view.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";

import type { TableTemplateProps } from "../main/template/table.tpl.api.js";
import type { BaseColumnType } from "../main/column.api.js";
import type { InfiniteScrollOptions, RowLoadingStatus } from "../main/infinite-scroll.api.js";
import { DefaultTableComponentRenderers, Table } from "../main/table.view.js";

describe("com.mgmtp.a12.widgets.table", () => {
	const languageContext = getA11yResource("en");
	const COLUMN_COUNT = 4;
	const ROW_COUNT = 10;
	type RowType = number[];
	type ColumnType = BaseColumnType<RowType>;
	let data: RowType[];
	let columnNames: ColumnType[];
	let columnGroup: ColumnType[];

	beforeEach(() => {
		data = Array.from(new Range(ROW_COUNT)).map((row) =>
			Array.from(new Range(COLUMN_COUNT)).map((col) => Number(`${row + 1}${col + 1}`))
		);
		columnNames = Array.from(new Range(COLUMN_COUNT)).map((c) => ({
			label: `Column ${c + 1}`
		}));
		columnGroup = [
			{ label: "Column 1" },
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
	});
	test("default", () => {
		const { container } = render(<Table<RowType, ColumnType> columns={columnNames} data={data} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("column group", () => {
		const { container } = render(<Table<RowType, ColumnType> columns={columnGroup} data={data} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("column pinning", () => {
		const segmentDataRole: Record<TableTemplateProps.RowSegmentType, string> = {
			left: DataRoles.Table.Body.Row.SegmentLeft,
			scroll: DataRoles.Table.Body.Row.SegmentScroll,
			right: DataRoles.Table.Body.Row.SegmentRight
		};

		function assertCellNumber(
			wrapper: HTMLElement,
			groupType: TableTemplateProps.RowSegmentType,
			expectedNumber: number
		): void {
			const segment = queryAllByDataRole(wrapper, segmentDataRole[groupType]);
			const bodyCells = segment[0] && queryAllByDataRole(segment[0], DataRoles.Table.Body.Cell);
			expect(bodyCells?.length ?? 0).toBe(expectedNumber);
		}

		const { container } = render(<Table<RowType, ColumnType> columns={columnNames} data={data} />);
		assertCellNumber(container, "left", 0);
		assertCellNumber(container, "scroll", COLUMN_COUNT);
		assertCellNumber(container, "right", 0);

		const testData1 = [...columnNames];
		testData1[0].pinning = "left";
		testData1[1].pinning = "right";
		const { container: containerCase1 } = render(<Table<RowType, ColumnType> columns={testData1} data={data} />);
		assertCellNumber(containerCase1, "left", 1);
		assertCellNumber(containerCase1, "scroll", COLUMN_COUNT - 2);
		assertCellNumber(containerCase1, "right", 1);

		const testData2 = [...columnNames];
		testData2[2].pinning = "left";
		testData2[3].pinning = "right";
		const { container: containerCase2 } = render(<Table<RowType, ColumnType> columns={testData1} data={data} />);
		assertCellNumber(containerCase2, "left", 2);
		assertCellNumber(containerCase2, "scroll", COLUMN_COUNT - 4);
		assertCellNumber(containerCase2, "right", 2);
	});

	test("click event on BodyRow", () => {
		const onClickFn = vi.fn();
		const { container } = render(
			<Table columns={columnNames} data={data} rowEventHandlers={({ row }) => ({ onClick: () => onClickFn(row) })} />
		);

		const rowToClick = queryAllByDataRole(container, DataRoles.Table.Body.Row)[5];
		fireEvent.click(rowToClick);
		expect(onClickFn).toHaveBeenCalledTimes(1);
		expect(onClickFn.mock.calls[0][0]).toBe(data[5]);
	});

	test("sorting", () => {
		const onSortFn = vi.fn();
		const sortingColumns = columnNames.map((value, index) => ({ ...value, sortable: index === 0 }));

		const { container } = render(<Table columns={sortingColumns} data={data} sortOptions={{ onSort: onSortFn }} />);

		expect(container.firstChild).toMatchSnapshot();

		const headCells = queryAllByDataRole(container, DataRoles.Table.Header.Cell);
		const sortableHeadCells = queryAllByAttribute("title", container, "sortable");
		expect(sortableHeadCells).toHaveLength(1);
		expect(sortableHeadCells[0]).toEqual(headCells[0]);
		fireEvent.click(sortableHeadCells[0]);
		expect(onSortFn).toHaveBeenCalledTimes(1);
		expect(onSortFn.mock.calls[0][0]["column"]).toBe(sortingColumns[0]);
	});

	test("update rerenders", () => {
		const { container } = render(
			<Table
				data={data}
				columns={columnNames}
				componentRenderers={{ headRenderer: () => <div id="identity">custom head</div> }}
			/>
		);

		const customHead = queryByAttribute("id", container, "identity");
		expect(customHead?.textContent).toEqual("custom head");
	});

	test("disabled table", () => {
		const handleRowActionFn = vi.fn();
		const handleColumnActionFn = vi.fn();
		const sortingColumns = columnNames.map((value, index) => ({ ...value, sortable: index === 0 }));
		const { container } = render(
			<Table
				columns={sortingColumns}
				data={data}
				disabled
				rowEventHandlers={() => ({ onClick: handleRowActionFn })}
				sortOptions={{ onSort: handleColumnActionFn }}
			/>
		);

		expect(container.firstChild).toMatchSnapshot();

		const sortableHeadCell = queryAllByDataRole(container, DataRoles.Table.Header.Cell);
		fireEvent.click(sortableHeadCell[0]);
		expect(handleColumnActionFn).toHaveBeenCalledTimes(0);

		const bodyRows = queryAllByDataRole(container, DataRoles.Table.Body.Row);
		fireEvent.click(bodyRows[0]);
		expect(handleRowActionFn).toHaveBeenCalledTimes(0);
	});

	test("table row styling", () => {
		const { container } = render(
			<Table<RowType, ColumnType>
				columns={columnNames}
				data={data}
				rowStyling={({ rowIndex }) => ({
					selected: rowIndex === 0,
					highlightVariant: rowIndex === 1 ? "success" : undefined
				})}
				cellStyling={({ rowIndex, column }) => ({
					useSecondaryColor: rowIndex === 3 && columnNames.indexOf(column) === 1
				})}
			/>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("specific alignment", () => {
		const columnsWithAlignments: ColumnType[] = columnNames.map((column) => ({
			...column,
			specificHorizontalAlignment: { head: "right", body: "center", foot: "left" },
			specificVerticalAlignment: { head: "bottom", body: "middle", foot: "top" }
		}));
		const { container } = render(<Table columns={columnsWithAlignments} data={data} />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("specific alignment combines common alignment", () => {
		const columnsWithAlignments: ColumnType[] = columnNames.map((column) => ({
			...column,
			horizontalAlignment: "left",
			specificHorizontalAlignment: { head: "right" },
			verticalAlignment: "middle",
			specificVerticalAlignment: { foot: "bottom" }
		}));
		const { container } = render(<Table columns={columnsWithAlignments} data={data} />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("table onBlur", () => {
		const onBlurFn = vi.fn();
		const { container } = render(<Table columns={columnNames} data={data} onBlur={onBlurFn} />);

		const bodyRows = queryAllByDataRole(container, DataRoles.Table.Body.Row);
		fireEvent.blur(bodyRows[0]);
		expect(onBlurFn).toHaveBeenCalledTimes(1);
	});

	test("table should NOT render footer aria-attributes", () => {
		const { container } = render(<Table columns={columnNames} data={data} hasFootContent={false} />);

		const footer = queryByDataRole(container, DataRoles.Table.Footer);
		expect(footer?.getAttribute("role")).toBeNull();
		expect(footer?.getAttribute("aria-label")).toBeNull();
	});

	test("table should render footer aria-attributes", () => {
		const { container } = render(<Table columns={columnNames} data={data} hasFootContent />);

		const footer = queryByDataRole(container, DataRoles.Table.Footer);
		expect(footer?.getAttribute("role")).toEqual("rowgroup");
		expect(footer?.getAttribute("aria-label")).toEqual(languageContext.tableTitles?.footerLabel);
	});

	describe("infinite scroll table", () => {
		const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight");
		const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");

		const rowLoadingStatusMock = (rowIndex: number): RowLoadingStatus => {
			if (rowIndex === 0) {
				return "loading";
			}

			if (rowIndex === 1) {
				return "loaded";
			}

			return undefined;
		};

		const defaultOptions: InfiniteScrollOptions = {
			rowLoadingStatus: rowLoadingStatusMock,
			rowHeight: 50,
			loadData: () => Promise.resolve(),
			rowCount: 2
		};

		beforeAll(() => {
			Object.defineProperty(HTMLElement.prototype, "offsetHeight", { configurable: true, value: 500 });
			Object.defineProperty(HTMLElement.prototype, "offsetWidth", { configurable: true, value: 500 });
		});

		afterAll(() => {
			if (originalOffsetHeight && originalOffsetWidth) {
				Object.defineProperty(HTMLElement.prototype, "offsetHeight", originalOffsetHeight);
				Object.defineProperty(HTMLElement.prototype, "offsetWidth", originalOffsetWidth);
			}
		});

		test("rowLoadingStatus", () => {
			const { container } = render(
				<Table
					columns={columnNames}
					data={data}
					infiniteScrollOptions={{
						...defaultOptions
					}}
				/>
			);

			expect(container.firstChild).toMatchSnapshot();

			const bodyRows = getAllByDataRole(container, DataRoles.Table.Body.Row);

			expect(bodyRows.length).toEqual(2);

			const contentPlaceholders = getAllByDataRole(container, DataRoles.Table.Body.Content.Placeholder);

			// Only 1 row is in loading state,
			// therefore the amount of placeholders elements should be equal with the amount of columns
			expect(contentPlaceholders.length).toEqual(columnNames.length);
			// and all placeholders should belong to the first row
			expect(getAllByDataRole(bodyRows[0], "table-body-content-placeholder").length).toEqual(
				contentPlaceholders.length
			);
		});

		test("rowHeight", () => {
			const customRowHeight = 250;
			const { container } = render(
				<Table
					columns={columnNames}
					data={data}
					infiniteScrollOptions={{
						...defaultOptions,
						rowHeight: customRowHeight
					}}
				/>
			);

			const bodyRows = getAllByDataRole(container, DataRoles.Table.Body.Row);
			expect(bodyRows[0].style.height).toEqual(customRowHeight + "px");
			expect(bodyRows[1].style.height).toEqual(customRowHeight + "px");
		});

		test("rowCount", () => {
			const { container } = render(<Table columns={columnNames} data={data} infiniteScrollOptions={defaultOptions} />);

			const bodyRows = getAllByDataRole(container, DataRoles.Table.Body.Row);
			expect(bodyRows.length).toEqual(defaultOptions.rowCount);
		});

		test("loaderRef", () => {
			const loaderRefSpy = vi.fn();
			render(
				<Table
					columns={columnNames}
					data={data}
					infiniteScrollOptions={{
						...defaultOptions,
						loaderRef: loaderRefSpy
					}}
				/>
			);

			expect(loaderRefSpy).toHaveBeenCalledTimes(1);
		});

		describe("overrideListProps", () => {
			test("listRef", () => {
				const listRefSpy = vi.fn();
				render(
					<Table
						columns={columnNames}
						data={data}
						infiniteScrollOptions={{
							...defaultOptions,
							overrideListProps: {
								listRef: listRefSpy
							}
						}}
					/>
				);

				expect(listRefSpy).toHaveBeenCalled();
			});

			test("onRowsRendered", () => {
				const onRowRenderedSpy = vi.fn();
				render(
					<Table
						columns={columnNames}
						data={data}
						infiniteScrollOptions={{
							...defaultOptions,
							overrideListProps: {
								onRowsRendered: onRowRenderedSpy
							}
						}}
					/>
				);

				expect(onRowRenderedSpy).toHaveBeenCalled();
			});
		});
	});

	test("table role remains table when action button is focused and shows interaction hint", async () => {
		const onClickFn = vi.fn();

		render(
			<InteractionHintConfigProvider enableInteractionHint>
				<Table<RowType, ColumnType>
					columns={[
						{ label: "Company", dataKey: "company.name" },
						{ label: "", actionColumn: true, pinning: "right" }
					]}
					data={data}
					componentRenderers={{
						bodyContentRenderer: (props) => {
							if (props.column.actionColumn) {
								return (
									<Button
										icon={<Icon>delete</Icon>}
										title="Delete action"
										onClick={(event) => {
											event.stopPropagation();
											onClickFn();
										}}
									/>
								);
							}

							return DefaultTableComponentRenderers.bodyContentRenderer(props);
						}
					}}
					rowEventHandlers={() => ({ onClick: onClickFn })}
				/>
			</InteractionHintConfigProvider>
		);

		const tableElement = screen.getByRole("table");

		expect(tableElement).toBeTruthy();
		expect(tableElement).toHaveAttribute("role", "table");

		const bodyRow = getAllByDataRole(tableElement, DataRoles.Table.Body.Row)[0];
		const actionButton = getByDataRole(bodyRow, DataRoles.Button);

		// Focus the action button to trigger the interaction hint
		fireEvent.focus(actionButton);

		const interactionHint = screen.queryByRole("dialog");

		expect(interactionHint).toBeTruthy();
		expect(tableElement).toHaveAttribute("role", "table");
		expect(tableElement).not.toHaveAttribute("role", "presentation");
	});
});
