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

import type { HTMLProps, ReactElement, ReactNode } from "react";
import { useState } from "react";
import { fireEvent, getAllByDataRole, getByDataRole, queryAllByDataRole, queryByDataRole, render } from "test-utils";
import { userEvent } from "vitest/browser";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { DataRoles } from "../../common/main/data-roles.js";
import { provider } from "../../common/main/device-detector.js";

import type { BaseColumnType } from "../main/foundation/column.api.js";
import type { ColumnResizeEventHandler } from "../main/foundation/table.api.js";
import type { RowsGroup } from "../main/foundation/table-row-group.api.js";
import type { DataTableScrollToNodeHandler } from "../main/data-table-renderer.api.js";
import type { DataTableSlotProps } from "../main/data-table-slots.api.js";
import type { DataTableColumn } from "../main/columns.js";
import type { DataTableVirtualizerHandle } from "../main/data-table.api.js";
import { DataTableBodyRowTpl } from "../main/template/data-table.body-row.tpl.view.js";
import { DataTableTemplate } from "../main/template/index.js";
import { DataTable } from "../main/data-table.view.js";
import { DataTableDnDDropTarget } from "../main/data-table.dnd.js";
import { DataTableRowsGroup } from "../main/data-table-rows-group/data-table-rows-group.view.js";
import { getColumnWidths, getMinTableWidth, toAriaSort } from "../main/data-table.utils.js";

interface RowType {
	id: number;
	name: string;
}

const data: RowType[] = [
	{ id: 1, name: "Alpha" },
	{ id: 2, name: "Bravo" },
	{ id: 3, name: "Charlie" }
];

const columns: BaseColumnType<RowType>[] = [
	{ label: "ID", dataKey: "id", width: 0.5, fixedWidth: true, sortable: true },
	{ label: "Name", dataKey: "name", width: 1, sortable: true },
	{ label: "", pinning: "right", actionColumn: true, hiddenText: "Actions" }
];

describe("com.mgmtp.a12.widgets.data-table", () => {
	test("renders all rows and columns with semantic table markup", () => {
		const { container } = render(<DataTable data={data} columns={columns} ariaLabel="Test table" />);

		const table = container.querySelector("table");
		expect(table).not.toBeNull();
		expect(table?.tagName).toBe("TABLE");
		expect(container.querySelectorAll("thead tr").length).toBe(1);
		expect(container.querySelectorAll("tbody tr").length).toBe(data.length);
		// 3 columns × 3 rows = 9 body cells
		expect(getAllByDataRole(container, DataRoles.Table.Body.Cell).length).toBe(columns.length * data.length);
	});

	test("applies fixed-layout column widths via native <col> elements", () => {
		const { container } = render(<DataTable data={data} columns={columns} />);
		const table = container.querySelector("table") as HTMLTableElement;
		const cols = Array.from(table.querySelectorAll<HTMLTableColElement>("colgroup col"));
		expect(cols.length).toBe(columns.length);
		// ID: fixedWidth 0.5 → 75px absolute
		expect(cols[0].style.width).toBe("75px");
		// Name: sole flex column fills the space left after the absolute columns
		// (75px ID + 150px action fallback = 225px)
		expect(cols[1].style.width).toBe("calc(100% - 225px)");
		// Action column (no width) → 150px default fallback
		expect(cols[2].style.width).toBe("150px");
	});

	test("uses table-layout: fixed", () => {
		const { container } = render(<DataTable data={data} columns={columns} ariaLabel="Fixed table" />);
		const table = container.querySelector("table") as HTMLTableElement;
		expect(getComputedStyle(table).tableLayout).toBe("fixed");
	});

	test("aria-sort reflects sort state on sortable columns only", () => {
		const sortState = [{ columnId: "id", order: "asc" as const }];
		const { container } = render(
			<DataTable data={data} columns={columns} sortOptions={{ sortState, onSort: vi.fn() }} />
		);
		const headCells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
		expect(headCells[0].getAttribute("aria-sort")).toBe("ascending");
		expect(headCells[1].getAttribute("aria-sort")).toBe("none");
		// Action column has no `sortable`, so no aria-sort is set at all
		expect(headCells[2].hasAttribute("aria-sort")).toBe(false);
	});

	test("clicking a sortable header invokes onSort with the next order in the cycle", async () => {
		const onSort = vi.fn();
		const { container } = render(<DataTable data={data} columns={columns} sortOptions={{ sortState: [], onSort }} />);
		const headCells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
		await userEvent.click(headCells[0]);
		expect(onSort).toHaveBeenCalledTimes(1);
		expect(onSort).toHaveBeenCalledWith([{ columnId: "id", order: "asc" }], { columnId: "id", order: "asc" });
	});

	test("clicking a non-sortable action header does NOT invoke onSort", async () => {
		const onSort = vi.fn();
		const { container } = render(<DataTable data={data} columns={columns} sortOptions={{ sortState: [], onSort }} />);
		const headCells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
		await userEvent.click(headCells[2]);
		expect(onSort).not.toHaveBeenCalled();
	});

	test("disabled suppresses sort and row click handlers", async () => {
		const onSort = vi.fn();
		const onClick = vi.fn();
		const { container } = render(
			<DataTable
				data={data}
				columns={columns}
				disabled
				sortOptions={{ sortState: [], onSort }}
				rowEventHandlers={() => ({ onClick })}
			/>
		);
		const headCells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
		await userEvent.click(headCells[0]);
		expect(onSort).not.toHaveBeenCalled();
		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		// Use fireEvent because aria-disabled blocks userEvent.click's enabled-waiter, and we
		// specifically need to confirm that even an attempted click is a no-op when disabled.
		fireEvent.click(rows[0]);
		expect(onClick).not.toHaveBeenCalled();
	});

	test("rowStyling.selected sets aria-selected on the row", () => {
		const { container } = render(
			<DataTable data={data} columns={columns} rowStyling={({ rowIndex }) => ({ selected: rowIndex === 1 })} />
		);
		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		expect(rows[0].getAttribute("aria-selected")).toBeNull();
		expect(rows[1].getAttribute("aria-selected")).toBe("true");
	});

	test("renders row status badges on the first body cell", () => {
		const { container } = render(
			<DataTable
				data={data}
				columns={columns}
				rowStyling={({ rowIndex }) => {
					switch (rowIndex) {
						case 0:
							return { disabled: true };
						case 1:
							return { highlightVariant: "success" };
						default:
							return { highlightVariant: "info" };
					}
				}}
			/>
		);
		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		const expectedTitles = ["Disable", "Success", "Info"];

		rows.forEach((row, rowIndex) => {
			const bodyCells = getAllByDataRole(row, DataRoles.Table.Body.Cell);

			expect(
				bodyCells[0].querySelector(`[data-role="${DataRoles.Icon}"][title="${expectedTitles[rowIndex]}"]`)
			).not.toBeNull();
			expect(bodyCells[1].querySelector(`[data-role="${DataRoles.Icon}"]`)).toBeNull();
		});
	});

	test("DataTableBodyRowTpl computes the expected row tabIndex defaults", () => {
		const { container } = render(
			<table>
				<tbody>
					<DataTableBodyRowTpl>
						<td>Default</td>
					</DataTableBodyRowTpl>
					<DataTableBodyRowTpl interactive>
						<td>Interactive</td>
					</DataTableBodyRowTpl>
					<DataTableBodyRowTpl disabled interactive>
						<td>Disabled</td>
					</DataTableBodyRowTpl>
					<DataTableBodyRowTpl tabIndex={0}>
						<td>Explicit</td>
					</DataTableBodyRowTpl>
				</tbody>
			</table>
		);
		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		expect(rows[0].getAttribute("tabindex")).toBe("-1");
		expect(rows[1].getAttribute("tabindex")).toBe("0");
		expect(rows[2].getAttribute("tabindex")).toBeNull();
		expect(rows[3].getAttribute("tabindex")).toBe("0");
	});

	test("DataTableBodyRowTpl forwards DOM props and translates Enter into onClick", async () => {
		const onClick = vi.fn();
		const onKeyDown = vi.fn();
		const onFocus = vi.fn();
		const onBlur = vi.fn();
		const { container } = render(
			<table>
				<tbody>
					<DataTableBodyRowTpl
						id="row-1"
						interactive
						onClick={onClick}
						onKeyDown={onKeyDown}
						onFocus={onFocus}
						onBlur={onBlur}
						htmlAttributes={{ "aria-label": "Custom row", "data-testid": "data-table-body-row" }}
					>
						<td>Alpha</td>
					</DataTableBodyRowTpl>
				</tbody>
			</table>
		);
		const row = getByDataRole(container, DataRoles.Table.Body.Row);
		expect(row.id).toBe("row-1");
		expect(row.getAttribute("tabindex")).toBe("0");
		expect(row.getAttribute("aria-label")).toBe("Custom row");
		expect(row.getAttribute("data-testid")).toBe("data-table-body-row");
		fireEvent.focus(row);
		expect(onFocus).toHaveBeenCalledTimes(1);
		(row as HTMLElement).focus();
		await userEvent.keyboard("{Enter}");
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onKeyDown).toHaveBeenCalledTimes(1);
		fireEvent.blur(row);
		expect(onBlur).toHaveBeenCalledTimes(1);
	});

	test("DataTableBodyRowTpl fires htmlAttributes.onKeyDown (per-row accelerators) without a dedicated handler", async () => {
		const onKeyDown = vi.fn();
		const { container } = render(
			<table>
				<tbody>
					<DataTableBodyRowTpl interactive htmlAttributes={{ onKeyDown }}>
						<td>Alpha</td>
					</DataTableBodyRowTpl>
				</tbody>
			</table>
		);
		const row = getByDataRole(container, DataRoles.Table.Body.Row);
		(row as HTMLElement).focus();
		await userEvent.keyboard("{a}");
		expect(onKeyDown).toHaveBeenCalledTimes(1);
		expect(onKeyDown.mock.calls[0][0].key).toBe("a");
	});

	test("DataTableBodyRowTpl does not fire htmlAttributes.onKeyDown when disabled", async () => {
		const onKeyDown = vi.fn();
		const { container } = render(
			<table>
				<tbody>
					<DataTableBodyRowTpl interactive disabled tabIndex={0} htmlAttributes={{ onKeyDown }}>
						<td>Alpha</td>
					</DataTableBodyRowTpl>
				</tbody>
			</table>
		);
		const row = getByDataRole(container, DataRoles.Table.Body.Row);
		(row as HTMLElement).focus();
		await userEvent.keyboard("{a}");
		expect(onKeyDown).not.toHaveBeenCalled();
	});
});

describe("data-table.utils", () => {
	test("getColumnWidths resolves a <col> width per column type", () => {
		const widths = getColumnWidths(
			[
				{ label: "A", actionColumn: true } as BaseColumnType,
				{ label: "B", width: 2, fixedWidth: true } as BaseColumnType,
				{ label: "C", width: 1.5 } as BaseColumnType,
				{ label: "D" } as BaseColumnType
			],
			false
		);
		// A (actionColumn, no width) → 150px fallback; B (fixedWidth) → 2*150px.
		// Absolute total = 150+300 = 450px. C (width 1.5) and D (no width → default
		// width 1) flex over the rest: flex units = 1.5 + 1 = 2.5, so C reserves 0.6
		// and D reserves 0.4 of `100% - 450px`.
		expect(widths).toEqual(["150px", "300px", "calc((100% - 450px) * 0.6)", "calc((100% - 450px) * 0.4)"]);
	});

	test("width-less columns default to `width: 1` flex, matching the production Table", () => {
		// No widths anywhere → equal flex shares, no absolute reservation.
		expect(getColumnWidths([{ label: "A" }, { label: "B" }] as BaseColumnType[], false)).toEqual(["50%", "50%"]);

		// Mixed: the width-less B flexes with factor 1 alongside an explicit width.
		// flex units = 1 (B) + 3 (C) = 4 → B 25%, C 75% of the space left after the
		// fixed-width A (0.5 * 150 = 75px).
		expect(
			getColumnWidths(
				[{ label: "A", width: 0.5, fixedWidth: true }, { label: "B" }, { label: "C", width: 3 }] as BaseColumnType[],
				false
			)
		).toEqual(["75px", "calc((100% - 75px) * 0.25)", "calc((100% - 75px) * 0.75)"]);
	});

	test("getMinTableWidth sums each column's pixel floor (width * 150)", () => {
		const minWidth = getMinTableWidth([
			{ label: "A", actionColumn: true } as BaseColumnType, // no width → 150 fallback
			{ label: "B", width: 2, fixedWidth: true } as BaseColumnType, // fixed → 2*150 = 300
			{ label: "C", width: 1.5 } as BaseColumnType, // flex → 1.5*150 = 225
			{ label: "D" } as BaseColumnType // no width → default width 1 → 1*150 = 150
		]);
		// 150 + 300 + 225 + 150 = 825
		expect(minWidth).toBe(825);
	});

	test("getMinTableWidth floors a width-less column at its default `width: 1` (150px)", () => {
		// A width-less column defaults to `width: 1` flex, so its floor is 1 * 150 = 150px.
		expect(getMinTableWidth([{ label: "A" } as BaseColumnType, { label: "B", width: 1 } as BaseColumnType])).toBe(300);
	});

	test("toAriaSort maps SortOrder to aria-sort string", () => {
		expect(toAriaSort("asc")).toBe("ascending");
		expect(toAriaSort("desc")).toBe("descending");
		expect(toAriaSort(undefined)).toBe("none");
	});
});

describe("com.mgmtp.a12.widgets.data-table — Phase 1 features", () => {
	describe("footer", () => {
		test("renders <tfoot> when slots.footContent is provided", () => {
			function TotalFootContent({ column }: DataTableSlotProps.FootContent<RowType>): ReactNode {
				return column.dataKey === "id" ? <span>Total</span> : null;
			}

			const { container } = render(
				<DataTable data={data} columns={columns} slots={{ footContent: TotalFootContent }} />
			);
			expect(container.querySelector("tfoot")).not.toBeNull();
			expect(getByDataRole(container, DataRoles.Table.Footer)).not.toBeNull();
		});

		test("renders <tfoot> when hasFootContent is true even without renderers", () => {
			const { container } = render(<DataTable data={data} columns={columns} hasFootContent />);
			expect(container.querySelector("tfoot")).not.toBeNull();
		});

		test("does NOT render <tfoot> when neither hasFootContent nor any foot renderer is provided", () => {
			const { container } = render(<DataTable data={data} columns={columns} />);
			expect(container.querySelector("tfoot")).toBeNull();
			expect(queryByDataRole(container, DataRoles.Table.Footer)).toBeNull();
		});

		test("foot row uses the Table.Footer.Row data-role", () => {
			const { container } = render(<DataTable data={data} columns={columns} hasFootContent />);
			expect(getByDataRole(container, DataRoles.Table.Footer.Row)).not.toBeNull();
		});

		test("virtualized foot row aria-rowindex is the last index (completes the body numbering)", () => {
			const { container } = render(
				<DataTable
					data={data}
					columns={columns}
					hasFootContent
					maxHeight={200}
					virtualScrollOptions={{ rowHeight: 30 }}
				/>
			);
			// Header depth 1 + 3 body rows + footer ⇒ footer is row 5, equal to aria-rowcount.
			const footRow = getByDataRole(container, DataRoles.Table.Footer.Row);
			expect(footRow.getAttribute("aria-rowindex")).toBe("5");
			expect(container.querySelector("table")?.getAttribute("aria-rowcount")).toBe("5");
		});

		test("non-virtualized foot row omits aria-rowindex", () => {
			const { container } = render(<DataTable data={data} columns={columns} hasFootContent />);
			const footRow = getByDataRole(container, DataRoles.Table.Footer.Row);
			expect(footRow.getAttribute("aria-rowindex")).toBeNull();
		});
	});

	describe("slot precedence", () => {
		test("slots.headCell overrides the default head cell", () => {
			function CustomHeadCell({ column }: DataTableSlotProps.HeadCell<RowType>): ReactElement {
				return <th data-testid="custom-head">CUSTOM:{column.label}</th>;
			}

			const { container } = render(<DataTable data={data} columns={columns} slots={{ headCell: CustomHeadCell }} />);
			const customCells = container.querySelectorAll('[data-testid="custom-head"]');
			expect(customCells.length).toBe(columns.length);
			expect(customCells[0].textContent).toBe("CUSTOM:ID");
		});
	});

	describe("cellStyling", () => {
		test("applies className to body cells", () => {
			const { container } = render(
				<DataTable
					data={data}
					columns={columns}
					cellStyling={({ rowIndex, column }) =>
						rowIndex === 0 && column.dataKey === "name" ? { className: "custom-cell" } : {}
					}
				/>
			);
			expect(container.querySelectorAll(".custom-cell").length).toBe(1);
		});

		test("applies inline style to body cells", () => {
			const { container } = render(
				<DataTable
					data={data}
					columns={columns}
					cellStyling={({ rowIndex, column }) =>
						rowIndex === 0 && column.dataKey === "id" ? { style: { color: "rgb(255, 0, 0)" } } : {}
					}
				/>
			);
			const bodyCells = getAllByDataRole(container, DataRoles.Table.Body.Cell);
			expect(bodyCells[0].style.color).toBe("rgb(255, 0, 0)");
		});

		test("renders secondaryCellTitle as hidden screen-reader text", () => {
			const { container } = render(
				<DataTable
					data={data}
					columns={columns}
					cellStyling={({ rowIndex, column }) =>
						rowIndex === 0 && column.dataKey === "name"
							? { useSecondaryColor: true, secondaryCellTitle: "Withdrawn" }
							: {}
					}
				/>
			);
			expect(container.textContent).toContain("Withdrawn");
		});

		test("cellStyling is NOT invoked when disabled is true", () => {
			const cellStyling = vi.fn().mockReturnValue({ className: "should-not-apply" });
			const { container } = render(<DataTable data={data} columns={columns} disabled cellStyling={cellStyling} />);
			expect(cellStyling).not.toHaveBeenCalled();
			expect(container.querySelectorAll(".should-not-apply").length).toBe(0);
		});
	});

	describe("scrollToNode", () => {
		let scrollIntoViewSpy: ReturnType<typeof vi.spyOn>;
		let focusSpy: ReturnType<typeof vi.spyOn>;

		beforeEach(() => {
			scrollIntoViewSpy = vi.spyOn(HTMLElement.prototype, "scrollIntoView").mockImplementation(() => undefined);
			focusSpy = vi.spyOn(HTMLElement.prototype, "focus").mockImplementation(() => undefined);
		});

		afterEach(() => {
			scrollIntoViewSpy.mockRestore();
			focusSpy.mockRestore();
		});

		test("invokes scrollIntoView with { block: 'center' } on the targeted row", () => {
			let handler: DataTableScrollToNodeHandler | undefined;
			render(
				<DataTable
					data={data}
					columns={columns}
					scrollToNode={(h) => {
						handler = h;
					}}
				/>
			);
			expect(handler).toBeDefined();
			handler?.(1);
			expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);
			expect(scrollIntoViewSpy).toHaveBeenCalledWith({ block: "center" });
		});

		test("autoFocus: true also focuses the targeted row", () => {
			let handler: DataTableScrollToNodeHandler | undefined;
			render(
				<DataTable
					data={data}
					columns={columns}
					scrollToNode={(h) => {
						handler = h;
					}}
				/>
			);
			handler?.(0, { autoFocus: true });
			expect(focusSpy).toHaveBeenCalledTimes(1);
		});

		test("out-of-range nodeIndex is a no-op", () => {
			let handler: DataTableScrollToNodeHandler | undefined;
			render(
				<DataTable
					data={data}
					columns={columns}
					scrollToNode={(h) => {
						handler = h;
					}}
				/>
			);
			handler?.(99);
			expect(scrollIntoViewSpy).not.toHaveBeenCalled();
		});
	});

	describe("htmlAttributes pass-through", () => {
		test("spreads non-conflicting attrs onto head and body cells", () => {
			const columnsWithAttrs: BaseColumnType<RowType>[] = [
				{
					label: "ID",
					dataKey: "id",
					width: 0.5,
					fixedWidth: true,
					htmlAttributes: { "data-foo": "bar" } as Record<string, string>
				},
				{ label: "Name", dataKey: "name", width: 1 }
			];
			const { container } = render(<DataTable data={data} columns={columnsWithAttrs} />);
			const headCells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
			const bodyCells = getAllByDataRole(container, DataRoles.Table.Body.Cell);
			expect(headCells[0].getAttribute("data-foo")).toBe("bar");
			expect(bodyCells[0].getAttribute("data-foo")).toBe("bar");
		});

		test("does NOT allow consumer to override the framework data-role", () => {
			const columnsWithRoleOverride: BaseColumnType<RowType>[] = [
				{
					label: "ID",
					dataKey: "id",
					width: 0.5,
					fixedWidth: true,
					htmlAttributes: { "data-role": "hijacked" } as Record<string, string>
				},
				{ label: "Name", dataKey: "name", width: 1 }
			];
			const { container } = render(<DataTable data={data} columns={columnsWithRoleOverride} />);
			const bodyCells = getAllByDataRole(container, DataRoles.Table.Body.Cell);
			expect(bodyCells[0].getAttribute("data-role")).toBe(`${DataRoles.Table.Body.Cell}`);
			expect(bodyCells[0].getAttribute("data-role")).not.toBe("hijacked");
		});

		test("does NOT allow consumer to override framework-owned attribute keys", () => {
			const columnsWithReservedOverride: BaseColumnType<RowType>[] = [
				{
					label: "ID",
					dataKey: "id",
					width: 0.5,
					fixedWidth: true,
					htmlAttributes: { "data-col-index": "99" }
				},
				{ label: "Name", dataKey: "name", width: 1 }
			];
			const { container } = render(<DataTable data={data} columns={columnsWithReservedOverride} />);
			const headCells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
			expect(headCells[0].getAttribute("data-col-index")).toBe("1");
		});
	});

	describe("a11y", () => {
		test("clicking a sortable header populates the live region with the sort-direction message", async () => {
			const onSort = vi.fn();
			const { container } = render(<DataTable data={data} columns={columns} sortOptions={{ sortState: [], onSort }} />);
			const headCells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
			await userEvent.click(headCells[0]);
			const liveRegion = getByDataRole(container, DataRoles.Table.A11yLiveRegion);
			expect(liveRegion.textContent).toBe("Sorted ascending");
		});

		test("action column without label/hiddenText falls back to the localized default aria-label", () => {
			const onlyActionColumns: BaseColumnType<RowType>[] = [
				{ label: "ID", dataKey: "id", width: 0.5, fixedWidth: true },
				{ label: "", actionColumn: true, pinning: "right" }
			];
			const { container } = render(<DataTable data={data} columns={onlyActionColumns} />);
			const headCells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
			expect(headCells[1].getAttribute("aria-label")).toBe("Actions");
		});

		test("sortable headers keep interactive semantics on the <th> and enrich the title", () => {
			const columnsWithTitle: BaseColumnType<RowType>[] = [
				{
					label: "ID",
					dataKey: "id",
					width: 0.5,
					fixedWidth: true,
					sortable: true,
					htmlAttributes: { title: "Identifier" }
				}
			];
			const { container } = render(<DataTable data={data} columns={columnsWithTitle} />);
			const headCell = getByDataRole(container, DataRoles.Table.Header.Cell);
			const content = getByDataRole(container, DataRoles.Table.Header.Cell.Content);

			expect(content.tagName).toBe("SPAN");
			// The interactive semantics (tabIndex, aria-sort, key handling) live on
			// the <th> itself — the inner span must NOT duplicate them with a
			// non-focusable role="button".
			expect(content.getAttribute("role")).toBeNull();
			expect(headCell.getAttribute("tabindex")).toBe("0");
			expect(headCell.getAttribute("aria-sort")).toBe("none");
			expect(content.textContent).toBe("ID");
			expect(headCell.getAttribute("title")).toBe("Identifier, sortable");
		});

		test("sortable headers render hidden sortable text on phones", () => {
			const isPhoneSpy = vi.spyOn(provider, "isPhone").mockReturnValue(true);
			const sortableColumn: BaseColumnType<RowType>[] = [{ label: "ID", dataKey: "id", sortable: true }];
			const { container } = render(<DataTable data={data} columns={sortableColumn} />);
			const hiddenText = getByDataRole(container, DataRoles.HiddenText);

			expect(hiddenText.textContent).toBe("sortable");
			isPhoneSpy.mockRestore();
		});
	});
});

describe("com.mgmtp.a12.widgets.data-table — Phase 2: column groups", () => {
	interface PersonRow {
		id: number;
		firstName: string;
		lastName: string;
		street: string;
		city: string;
	}

	const peopleData: PersonRow[] = [
		{ id: 1, firstName: "Ada", lastName: "Lovelace", street: "Analytical Way", city: "London" },
		{ id: 2, firstName: "Alan", lastName: "Turing", street: "Bletchley Rd", city: "Cambridge" }
	];

	test("2-level groups render with correct colspan on group cells and data-col-index on leaves", () => {
		const groupedColumns: BaseColumnType<PersonRow>[] = [
			{ label: "ID", dataKey: "id", width: 0.5, fixedWidth: true },
			{
				label: "Name",
				subColumns: [
					{ label: "First", dataKey: "firstName", width: 1 },
					{ label: "Last", dataKey: "lastName", width: 1 }
				]
			},
			{ label: "City", dataKey: "city", width: 1 }
		];

		const { container } = render(<DataTable data={peopleData} columns={groupedColumns} ariaLabel="People" />);

		const headCells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
		// 1 (ID) + 1 (group "Name") + 2 (First/Last) + 1 (City) = 5
		expect(headCells.length).toBe(5);

		const groupCell = headCells.find((c) => c.getAttribute("scope") === "colgroup");
		expect(groupCell).toBeDefined();
		expect(groupCell?.getAttribute("colspan")).toBe("2");

		const leafCells = headCells.filter((c) => c.getAttribute("scope") === "col");
		const leafColIndices = leafCells.map((c) => c.getAttribute("data-col-index")).sort();
		expect(leafColIndices).toEqual(["1", "2", "3", "4"]);

		// Body still gets one cell per leaf column
		const bodyCells = getAllByDataRole(container, DataRoles.Table.Body.Cell);
		expect(bodyCells.length).toBe(4 * peopleData.length);
	});

	test("3-level groups: leaf cells get rowspan to fill remaining levels", () => {
		const threeLevelColumns: BaseColumnType<PersonRow>[] = [
			{ label: "ID", dataKey: "id", width: 0.5, fixedWidth: true },
			{
				label: "Personal Info",
				subColumns: [
					{
						label: "Name",
						subColumns: [
							{ label: "First", dataKey: "firstName", width: 1 },
							{ label: "Last", dataKey: "lastName", width: 1 }
						]
					},
					{
						label: "Address",
						subColumns: [
							{ label: "Street", dataKey: "street", width: 1 },
							{ label: "City", dataKey: "city", width: 1 }
						]
					}
				]
			}
		];

		const { container } = render(<DataTable data={peopleData} columns={threeLevelColumns} />);

		const headCells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
		// 1 (ID, leaf at depth 1) + 1 (Personal Info) + 2 (Name, Address) + 4 (First/Last/Street/City) = 8
		expect(headCells.length).toBe(8);

		// ID is a leaf at level 1 in a depth-3 header → spans rows 1-3 → rowspan="3"
		const idCell = headCells.find((c) => c.getAttribute("data-col-index") === "1");
		expect(idCell?.getAttribute("rowspan")).toBe("3");

		// "Personal Info" group spans all 4 leaves
		const personalInfo = headCells.find((c) => c.textContent === "Personal Info");
		expect(personalInfo?.getAttribute("colspan")).toBe("4");
		expect(personalInfo?.getAttribute("scope")).toBe("colgroup");
	});

	test("sort still works on a sortable leaf column inside a group", async () => {
		const onSort = vi.fn();
		const lastNameColumn: BaseColumnType<PersonRow> = {
			label: "Last",
			dataKey: "lastName",
			width: 1,
			sortable: true
		};
		const groupedColumns: BaseColumnType<PersonRow>[] = [
			{
				label: "Name",
				subColumns: [{ label: "First", dataKey: "firstName", width: 1 }, lastNameColumn]
			}
		];

		const { container } = render(
			<DataTable data={peopleData} columns={groupedColumns} sortOptions={{ sortState: [], onSort }} />
		);

		const lastHead = getAllByDataRole(container, DataRoles.Table.Header.Cell).find(
			(c) => c.textContent === "Last" && c.getAttribute("scope") === "col"
		);
		expect(lastHead).toBeDefined();
		await userEvent.click(lastHead!);
		expect(onSort).toHaveBeenCalledWith([{ columnId: "lastName", order: "asc" }], {
			columnId: "lastName",
			order: "asc"
		});
	});

	test("group cells inherit pinning from their parent", () => {
		const groupedColumns: BaseColumnType<PersonRow>[] = [
			{
				label: "Name",
				pinning: "left",
				subColumns: [
					{ label: "First", dataKey: "firstName", width: 1 },
					{ label: "Last", dataKey: "lastName", width: 1 }
				]
			},
			{ label: "City", dataKey: "city", width: 1 }
		];

		const { container } = render(<DataTable data={peopleData} columns={groupedColumns} />);

		const headCells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
		const firstLeaf = headCells.find((c) => c.textContent === "First");
		const lastLeaf = headCells.find((c) => c.textContent === "Last");
		expect(firstLeaf?.getAttribute("data-pinned")).toBe("left");
		expect(lastLeaf?.getAttribute("data-pinned")).toBe("left");

		const bodyCells = getAllByDataRole(container, DataRoles.Table.Body.Cell);
		// First two body cells of every row are the pinned leaf cells
		expect(bodyCells[0].getAttribute("data-pinned")).toBe("left");
		expect(bodyCells[1].getAttribute("data-pinned")).toBe("left");
		expect(bodyCells[2].getAttribute("data-pinned")).toBe(null);
	});

	test("stacked pinned columns cascade their inset offsets", async () => {
		const groupedColumns: BaseColumnType<PersonRow>[] = [
			{
				label: "Name",
				pinning: "left",
				subColumns: [
					{ label: "First", dataKey: "firstName", width: 100 },
					{ label: "Last", dataKey: "lastName", width: 100 }
				]
			},
			{ label: "City", dataKey: "city", width: 200 },
			{
				label: "Company",
				pinning: "right",
				subColumns: [
					{ label: "Name", dataKey: "city", width: 100 },
					{ label: "Business", dataKey: "city", width: 100 }
				]
			}
		];

		const { container } = render(<DataTable data={peopleData} columns={groupedColumns} />);

		// Wait for the ResizeObserver in the orchestrator to deliver measured widths.
		await vi.waitFor(() => {
			const headCells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
			const last = headCells.find((c) => c.textContent === "Last") as HTMLElement | undefined;
			expect(last?.style.getPropertyValue("--a12-data-table-pin-offset")).not.toBe("");
		});

		const headCells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
		const first = headCells.find((c) => c.textContent === "First") as HTMLElement;
		const last = headCells.find((c) => c.textContent === "Last") as HTMLElement;
		const companyName = headCells.find(
			(c) => c.getAttribute("data-pinned") === "right" && c.textContent === "Name"
		) as HTMLElement;
		const business = headCells.find((c) => c.textContent === "Business") as HTMLElement;

		const offsetPx = (el: HTMLElement): number =>
			Number.parseFloat(el.style.getPropertyValue("--a12-data-table-pin-offset") || "0");

		// Leftmost pinned-left leaf sits at 0; the next one is offset by the first's width.
		expect(offsetPx(first)).toBe(0);
		expect(offsetPx(last)).toBeGreaterThan(0);

		// Rightmost pinned-right leaf sits at 0; the one to its left is offset by Business's width.
		expect(offsetPx(business)).toBe(0);
		expect(offsetPx(companyName)).toBeGreaterThan(0);
	});

	test("virtualized body row aria-rowindex offsets by header depth", () => {
		const groupedColumns: BaseColumnType<PersonRow>[] = [
			{
				label: "Name",
				subColumns: [
					{ label: "First", dataKey: "firstName", width: 1 },
					{ label: "Last", dataKey: "lastName", width: 1 }
				]
			}
		];

		const { container } = render(
			<DataTable data={peopleData} columns={groupedColumns} maxHeight={200} virtualScrollOptions={{ rowHeight: 30 }} />
		);

		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		// Header depth = 2, so first body row's aria-rowindex is 2 + 1 = 3
		expect(rows[0].getAttribute("aria-rowindex")).toBe("3");
		expect(rows[1].getAttribute("aria-rowindex")).toBe("4");
	});

	test("non-virtualized table omits aria-rowindex / aria-rowcount (native semantics convey position)", () => {
		const groupedColumns: BaseColumnType<PersonRow>[] = [
			{
				label: "Name",
				subColumns: [
					{ label: "First", dataKey: "firstName", width: 1 },
					{ label: "Last", dataKey: "lastName", width: 1 }
				]
			}
		];

		const { container } = render(<DataTable data={peopleData} columns={groupedColumns} />);

		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		expect(rows[0].getAttribute("aria-rowindex")).toBeNull();
		expect(rows[1].getAttribute("aria-rowindex")).toBeNull();

		const headerRows = getAllByDataRole(container, DataRoles.Table.Header.Row);
		expect(headerRows.every((row) => row.getAttribute("aria-rowindex") === null)).toBe(true);

		expect(container.querySelector("table")?.getAttribute("aria-rowcount")).toBeNull();
	});
});

describe("com.mgmtp.a12.widgets.data-table — Phase 2: filter row", () => {
	test("filter row does NOT render when no filter slot is provided", () => {
		const { container } = render(<DataTable data={data} columns={columns} />);
		expect(queryByDataRole(container, DataRoles.Table.Filter.Row)).toBeNull();
		expect(queryByDataRole(container, DataRoles.Table.Filter.Cell)).toBeNull();
	});

	function InputFilterContent({ column }: DataTableSlotProps.FilterContent<RowType>): ReactElement {
		return <input data-testid={`filter-${String(column.dataKey ?? "")}`} />;
	}

	function EmptyFilterContent(): ReactNode {
		return null;
	}

	test("filter row renders when slots.filterContent is provided", () => {
		const { container } = render(
			<DataTable data={data} columns={columns} slots={{ filterContent: InputFilterContent }} />
		);
		expect(getByDataRole(container, DataRoles.Table.Filter.Row)).not.toBeNull();
		const filterCells = getAllByDataRole(container, DataRoles.Table.Filter.Cell);
		expect(filterCells.length).toBe(columns.length);
	});

	test("DOM order is <thead> headers → filter row → <tbody>", () => {
		const { container } = render(
			<DataTable data={data} columns={columns} slots={{ filterContent: EmptyFilterContent }} />
		);
		const thead = container.querySelector("thead") as HTMLTableSectionElement;
		const tbody = container.querySelector("tbody") as HTMLTableSectionElement;
		expect(thead).not.toBeNull();
		expect(tbody).not.toBeNull();

		const headerRows = Array.from(thead.querySelectorAll('[data-role="' + DataRoles.Table.Header.Row + '"]'));
		const filterRow = thead.querySelector('[data-role="' + DataRoles.Table.Filter.Row + '"]') as HTMLElement;
		expect(filterRow).not.toBeNull();

		const lastHeaderRow = headerRows[headerRows.length - 1];
		// Filter row is in the same <thead>, after all header rows
		expect(filterRow.parentElement).toBe(thead);
		expect(thead.compareDocumentPosition(filterRow) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
		expect(lastHeaderRow.compareDocumentPosition(filterRow) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
		// And filter row precedes <tbody>
		expect(filterRow.compareDocumentPosition(tbody) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
	});

	test("virtualized body row aria-rowindex offsets by 1 when filter row is present", () => {
		const { container } = render(
			<DataTable
				data={data}
				columns={columns}
				maxHeight={200}
				virtualScrollOptions={{ rowHeight: 30 }}
				slots={{ filterContent: EmptyFilterContent }}
			/>
		);
		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		// Header depth = 1, plus 1 for filter row = first body row at aria-rowindex 3
		expect(rows[0].getAttribute("aria-rowindex")).toBe("3");

		// The filter row sits between the header and the body at index 2.
		const filterRow = getByDataRole(container, DataRoles.Table.Filter.Row);
		expect(filterRow.getAttribute("aria-rowindex")).toBe("2");
	});
});

describe("com.mgmtp.a12.widgets.data-table — Phase 2: cross-axis highlighting", () => {
	interface PersonRow {
		id: number;
		firstName: string;
		lastName: string;
		city: string;
	}

	const peopleData: PersonRow[] = [
		{ id: 1, firstName: "Ada", lastName: "Lovelace", city: "London" },
		{ id: 2, firstName: "Alan", lastName: "Turing", city: "Cambridge" }
	];

	const groupedColumns: BaseColumnType<PersonRow>[] = [
		{ label: "ID", dataKey: "id", width: 0.5, fixedWidth: true },
		{
			label: "Name",
			subColumns: [
				{ label: "First", dataKey: "firstName", width: 1 },
				{ label: "Last", dataKey: "lastName", width: 1 }
			]
		},
		{ label: "City", dataKey: "city", width: 1 }
	];

	test("hovering a body cell sets data-highlight-col-leaf on the table and data-highlighted on the matching leaf <th>", async () => {
		const { container } = render(<DataTable data={data} columns={columns} cellHighlighting />);
		const table = container.querySelector("table") as HTMLTableElement;
		const bodyCells = getAllByDataRole(container, DataRoles.Table.Body.Cell);
		// Hover the cell at row 0, leaf column index 1 ("Name" column)
		const targetCell = bodyCells[1] as HTMLTableCellElement;
		expect(targetCell.cellIndex).toBe(1);

		await userEvent.hover(targetCell);

		expect(table.dataset.highlightColLeaf).toBe("1");

		const leafHeader = getAllByDataRole(container, DataRoles.Table.Header.Cell).find(
			(c) => c.getAttribute("data-col-index") === "2" && c.getAttribute("scope") === "col"
		);
		expect(leafHeader).toBeDefined();
		expect(leafHeader?.getAttribute("data-highlighted")).toBe("true");
	});

	test("with column groups, hovering a body cell highlights the leaf AND the enclosing group <th>", async () => {
		const { container } = render(<DataTable data={peopleData} columns={groupedColumns} cellHighlighting />);
		const table = container.querySelector("table") as HTMLTableElement;
		const bodyCells = getAllByDataRole(container, DataRoles.Table.Body.Cell);
		// Body cell layout per row: [ID, First, Last, City]
		// Hover "First" of row 0 (leaf column index 1)
		const firstCell = bodyCells[1] as HTMLTableCellElement;
		expect(firstCell.cellIndex).toBe(1);

		await userEvent.hover(firstCell);

		expect(table.dataset.highlightColLeaf).toBe("1");

		const headCells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
		const groupCell = headCells.find((c) => c.getAttribute("scope") === "colgroup" && c.textContent === "Name");
		const leafCell = headCells.find((c) => c.textContent === "First" && c.getAttribute("scope") === "col");

		expect(groupCell?.getAttribute("data-highlighted")).toBe("true");
		expect(leafCell?.getAttribute("data-highlighted")).toBe("true");
		// Sibling leaf "Last" (also under "Name") is NOT highlighted because it doesn't cover leaf 1 alone
		const lastLeaf = headCells.find((c) => c.textContent === "Last" && c.getAttribute("scope") === "col");
		expect(lastLeaf?.getAttribute("data-highlighted")).toBeNull();
		// Unrelated "City" leaf is also not highlighted
		const cityLeaf = headCells.find((c) => c.textContent === "City" && c.getAttribute("scope") === "col");
		expect(cityLeaf?.getAttribute("data-highlighted")).toBeNull();
		// Nearest enclosing group is recorded on the table root
		expect(table.dataset.highlightColGroup).toBe("1-2");
	});

	test("cellHighlighting does not activate when disabled is true", () => {
		const { container } = render(<DataTable data={data} columns={columns} cellHighlighting disabled />);
		const table = container.querySelector("table") as HTMLTableElement;
		const bodyCells = getAllByDataRole(container, DataRoles.Table.Body.Cell);
		// Disabled rows set pointer-events: none, blocking userEvent.hover. Dispatch the
		// underlying DOM event directly to confirm no listener is wired in disabled mode.
		fireEvent.mouseOver(bodyCells[0]);

		expect(table.dataset.highlightColLeaf).toBeUndefined();
		expect(table.querySelectorAll('th[data-highlighted="true"]').length).toBe(0);
	});

	test("unhovering a body cell clears highlight attributes", async () => {
		const { container } = render(<DataTable data={peopleData} columns={groupedColumns} cellHighlighting />);
		const table = container.querySelector("table") as HTMLTableElement;
		const bodyCells = getAllByDataRole(container, DataRoles.Table.Body.Cell);

		await userEvent.hover(bodyCells[1]);
		expect(table.dataset.highlightColLeaf).toBe("1");
		expect(table.querySelectorAll('th[data-highlighted="true"]').length).toBeGreaterThan(0);

		await userEvent.unhover(bodyCells[1]);
		expect(table.dataset.highlightColLeaf).toBeUndefined();
		expect(table.dataset.highlightColGroup).toBeUndefined();
		expect(table.querySelectorAll('th[data-highlighted="true"]').length).toBe(0);
	});
});

describe("com.mgmtp.a12.widgets.data-table — Phase 2: card view", () => {
	test('sets data-card-view="true" on <table> when cardView prop is set', () => {
		const { container } = render(<DataTable data={data} columns={columns} cardView />);
		const table = container.querySelector("table") as HTMLTableElement;
		expect(table.getAttribute("data-card-view")).toBe("true");
	});

	test("does not set data-card-view when cardView is false or omitted", () => {
		const { container } = render(<DataTable data={data} columns={columns} />);
		const table = container.querySelector("table") as HTMLTableElement;
		expect(table.getAttribute("data-card-view")).toBeNull();
	});

	test("every body cell renders its column's label in card view", () => {
		const { container } = render(<DataTable data={data} columns={columns} cardView />);
		const labels = getAllByDataRole(container, DataRoles.Table.Body.Cell.CardLabel);
		const firstRowLabels = labels.slice(0, columns.length);

		firstRowLabels.forEach((label, i) => {
			expect(label.textContent).toContain(String(columns[i].label));
		});
	});

	test("does not render inline cell labels when cardView is false or omitted", () => {
		const { container } = render(<DataTable data={data} columns={columns} />);
		expect(queryAllByDataRole(container, DataRoles.Table.Body.Cell.CardLabel)).toHaveLength(0);
	});

	test("renders a ReactNode column label inline in card view", () => {
		const jsxColumns = [
			{ ...columns[0], label: <span data-testid="jsx-label">First {String.fromCharCode(9733)}</span> },
			...columns.slice(1)
		];
		const { container } = render(<DataTable data={data} columns={jsxColumns} cardView />);

		expect(container.querySelectorAll('[data-testid="jsx-label"]').length).toBeGreaterThan(0);
		const firstLabel = getAllByDataRole(container, DataRoles.Table.Body.Cell.CardLabel)[0];
		expect(firstLabel.querySelector('[data-testid="jsx-label"]')).not.toBeNull();
	});

	test("cellHighlighting is force-disabled when cardView is true (no data-highlight-col-leaf set on hover)", async () => {
		const { container } = render(<DataTable data={data} columns={columns} cellHighlighting cardView />);
		const table = container.querySelector("table") as HTMLTableElement;
		const cells = getAllByDataRole(container, DataRoles.Table.Body.Cell);

		await userEvent.hover(cells[0]);

		expect(table.dataset.highlightColLeaf).toBeUndefined();
	});

	test("thead is hidden (display: none) in card mode", () => {
		const { container } = render(<DataTable data={data} columns={columns} cardView />);
		const thead = container.querySelector("thead") as HTMLElement;
		expect(getComputedStyle(thead).display).toBe("none");
	});
});

describe("com.mgmtp.a12.widgets.data-table — Phase 2: keyboard navigation", () => {
	test("first body row has tabIndex=0 and all others have tabIndex=-1 (roving tabindex)", () => {
		const { container } = render(<DataTable data={data} columns={columns} />);
		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		expect(rows[0].getAttribute("tabindex")).toBe("0");
		rows.slice(1).forEach((r) => {
			expect(r.getAttribute("tabindex")).toBe("-1");
		});
	});

	test("body cells are not focusable (no tabIndex) — focus is row-level", () => {
		const { container } = render(<DataTable data={data} columns={columns} />);
		getAllByDataRole(container, DataRoles.Table.Body.Cell).forEach((c) => {
			expect(c.getAttribute("tabindex")).toBeNull();
		});
	});

	test("ArrowDown moves focus from row 0 → row 1", async () => {
		const { container } = render(<DataTable data={data} columns={columns} />);
		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		(rows[0] as HTMLElement).focus();
		expect(document.activeElement).toBe(rows[0]);

		await userEvent.keyboard("{ArrowDown}");

		expect(document.activeElement).toBe(rows[1]);
		expect(rows[1].getAttribute("tabindex")).toBe("0");
		expect(rows[0].getAttribute("tabindex")).toBe("-1");
	});

	test("ArrowUp moves focus from row 1 → row 0", async () => {
		const { container } = render(<DataTable data={data} columns={columns} />);
		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		(rows[1] as HTMLElement).focus();

		await userEvent.keyboard("{ArrowUp}");

		expect(document.activeElement).toBe(rows[0]);
	});

	test("ArrowUp at the first row stays put (no wrap)", async () => {
		const { container } = render(<DataTable data={data} columns={columns} />);
		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		(rows[0] as HTMLElement).focus();

		await userEvent.keyboard("{ArrowUp}");

		expect(document.activeElement).toBe(rows[0]);
	});

	test("ArrowDown at the last row stays put (no wrap)", async () => {
		const { container } = render(<DataTable data={data} columns={columns} />);
		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		const last = rows[rows.length - 1];
		(last as HTMLElement).focus();

		await userEvent.keyboard("{ArrowDown}");

		expect(document.activeElement).toBe(last);
	});

	test("ArrowLeft / ArrowRight are no-ops in row mode (focus stays on the row)", async () => {
		const { container } = render(<DataTable data={data} columns={columns} />);
		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		(rows[0] as HTMLElement).focus();

		await userEvent.keyboard("{ArrowRight}");
		expect(document.activeElement).toBe(rows[0]);

		await userEvent.keyboard("{ArrowLeft}");
		expect(document.activeElement).toBe(rows[0]);
	});

	test("ArrowDown skips expanded additional-content rows", async () => {
		const { container } = render(
			<DataTable
				data={data}
				columns={columns}
				rowExpansion={{
					render: ({ row }) => (
						<DataTableTemplate.ExpandableRow>
							Details for {String((row as RowType).name)}
						</DataTableTemplate.ExpandableRow>
					)
				}}
			/>
		);
		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		(rows[0] as HTMLElement).focus();

		await userEvent.keyboard("{ArrowDown}");

		// The expanded <tr> sitting between data rows is not a body row, so it
		// must not count as a navigation target.
		expect(document.activeElement).toBe(rows[1]);
	});

	test("arrow navigation moves focus without re-rendering the table body", async () => {
		const cellContentSpy = vi.fn();

		function SpyCellContent({ defaultContent }: DataTableSlotProps.CellContent<RowType>): ReactNode {
			cellContentSpy();

			return defaultContent;
		}

		const { container } = render(<DataTable data={data} columns={columns} slots={{ cellContent: SpyCellContent }} />);
		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		(rows[0] as HTMLElement).focus();

		// Post-mount async work (viewport-ref tick, ResizeObserver initial
		// callbacks) may still schedule renders — wait until the render count is
		// stable before baselining.
		let callsAfterMount = cellContentSpy.mock.calls.length;

		for (let i = 0; i < 20; i += 1) {
			await new Promise((resolve) => setTimeout(resolve, 25));
			const current = cellContentSpy.mock.calls.length;

			if (current === callsAfterMount) {
				break;
			}

			callsAfterMount = current;
		}

		await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowUp}");
		await new Promise((resolve) => setTimeout(resolve, 50));

		expect(document.activeElement).toBe(rows[1]);
		// Moving the roving tabindex is imperative — no React re-render of the
		// body may happen per keypress.
		expect(cellContentSpy.mock.calls.length).toBe(callsAfterMount);
	});

	test("disableArrowNavigation: no row carries tabIndex=0 and Arrow keys don't move focus", async () => {
		const { container } = render(<DataTable data={data} columns={columns} disableArrowNavigation />);
		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		// Rows are still programmatically focusable (tabIndex=-1 fallback), but the
		// roving "0" tab stop is only assigned when arrow navigation is active.
		rows.forEach((r) => {
			expect(r.getAttribute("tabindex")).toBe("-1");
		});

		(rows[0] as HTMLElement).focus();
		await userEvent.keyboard("{ArrowDown}");
		expect(document.activeElement).toBe(rows[0]);
	});

	test("disabled also suppresses arrow navigation (no tabIndex on body rows)", () => {
		const { container } = render(<DataTable data={data} columns={columns} disabled />);
		getAllByDataRole(container, DataRoles.Table.Body.Row).forEach((r) => {
			expect(r.getAttribute("tabindex")).toBeNull();
		});
	});

	test("interactive row paints the focus ring on focus; non-interactive row does not", () => {
		// Interactive rows (here via an onClick handler) carry `data-interactive`
		// and paint the whole-row focus ring (box-shadow on the unpinned first cell).
		const { container, rerender } = render(
			<DataTable data={data} columns={columns} rowEventHandlers={() => ({ onClick: () => undefined })} />
		);
		let rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		expect(rows[0].getAttribute("data-interactive")).toBe("true");

		const interactiveFirstCell = rows[0].querySelector("td") as HTMLTableCellElement;
		expect(getComputedStyle(interactiveFirstCell).boxShadow).toBe("none");
		(rows[0] as HTMLElement).focus();
		expect(getComputedStyle(interactiveFirstCell).boxShadow).not.toBe("none");

		// Non-interactive rows are focusable for navigation but show no focus ring.
		rerender(<DataTable data={data} columns={columns} />);
		rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		expect(rows[0].getAttribute("data-interactive")).toBeNull();

		const plainFirstCell = rows[0].querySelector("td") as HTMLTableCellElement;
		(rows[0] as HTMLElement).focus();
		expect(getComputedStyle(plainFirstCell).boxShadow).toBe("none");
	});
});

describe("com.mgmtp.a12.widgets.data-table — Phase 2: always-on horizontal scroll", () => {
	test("StyledViewport renders with overflow-x: auto when maxHeight is omitted", () => {
		const { container } = render(<DataTable data={data} columns={columns} />);
		const viewport = getByDataRole(container, DataRoles.Table.Viewport);
		expect(getComputedStyle(viewport).overflowX).toBe("auto");
	});

	test("StyledViewport with maxHeight uses overflow-y: auto AND overflow-x: auto", () => {
		const { container } = render(<DataTable data={data} columns={columns} maxHeight={200} />);
		const viewport = getByDataRole(container, DataRoles.Table.Viewport);
		expect(getComputedStyle(viewport).overflowY).toBe("auto");
		expect(getComputedStyle(viewport).overflowX).toBe("auto");
	});

	test("StyledViewport without maxHeight defaults to max-height: 100% so it fits a bounded parent", () => {
		const { container } = render(<DataTable data={data} columns={columns} />);
		const viewport = getByDataRole(container, DataRoles.Table.Viewport);
		expect(getComputedStyle(viewport).maxHeight).toBe("100%");
		expect(getComputedStyle(viewport).overflowY).toBe("auto");
	});
});

describe("com.mgmtp.a12.widgets.data-table — Phase 2: context menus", () => {
	test("right-click on a body row mounts the context menu portal with rendered content", async () => {
		const contextMenuSpy = vi.fn();

		function BodyContextMenu(props: DataTableSlotProps.ContextMenu<RowType>): ReactElement {
			contextMenuSpy(props);

			return (
				<ul data-testid="ctx-menu">
					<li>{props.row.name}</li>
					<li>
						<button onClick={props.closeHandler}>Close</button>
					</li>
				</ul>
			);
		}

		const { container } = render(<DataTable data={data} columns={columns} slots={{ contextMenu: BodyContextMenu }} />);

		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		fireEvent.contextMenu(rows[0], { clientX: 100, clientY: 200 });

		expect(contextMenuSpy).toHaveBeenCalled();
		expect(contextMenuSpy).toHaveBeenCalledWith(
			expect.objectContaining({ row: data[0], rowIndex: 0, closeHandler: expect.any(Function) })
		);

		const portal = document.body.querySelector(`[data-role="${DataRoles.Table.ContextMenu}"]`);
		expect(portal).not.toBeNull();
		expect(portal?.textContent).toContain("Alpha");
	});

	function ClosableContextMenu({ row, closeHandler }: DataTableSlotProps.ContextMenu<RowType>): ReactElement {
		return (
			<div data-testid="ctx-body">
				{row.name}
				<button data-testid="close-btn" onClick={closeHandler}>
					Close
				</button>
			</div>
		);
	}

	test("closeHandler unmounts the context menu portal", async () => {
		const { container } = render(
			<DataTable data={data} columns={columns} slots={{ contextMenu: ClosableContextMenu }} />
		);

		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		fireEvent.contextMenu(rows[0], { clientX: 50, clientY: 50 });

		const portal = document.body.querySelector(`[data-role="${DataRoles.Table.ContextMenu}"]`);
		expect(portal).not.toBeNull();

		const closeBtn = document.body.querySelector('[data-testid="close-btn"]') as HTMLElement;
		expect(closeBtn).not.toBeNull();
		await userEvent.click(closeBtn);

		const portalAfterClose = document.body.querySelector(`[data-role="${DataRoles.Table.ContextMenu}"]`);
		expect(portalAfterClose).toBeNull();
	});

	test("disabledRightClickContextMenu in rowStyling suppresses the context menu trigger", () => {
		const contextMenuSpy = vi.fn();

		function SpyContextMenu({ row }: DataTableSlotProps.ContextMenu<RowType>): ReactElement {
			contextMenuSpy(row);

			return <div>{row.name}</div>;
		}

		const { container } = render(
			<DataTable
				data={data}
				columns={columns}
				rowStyling={({ rowIndex }) => ({ disabledRightClickContextMenu: rowIndex === 0 })}
				slots={{ contextMenu: SpyContextMenu }}
			/>
		);

		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);

		// Right-click on row 0 (disabled) — should NOT open
		fireEvent.contextMenu(rows[0], { clientX: 100, clientY: 100 });
		expect(contextMenuSpy).not.toHaveBeenCalled();
		expect(document.body.querySelector(`[data-role="${DataRoles.Table.ContextMenu}"]`)).toBeNull();

		// Right-click on row 1 (enabled) — should open
		fireEvent.contextMenu(rows[1], { clientX: 100, clientY: 150 });
		expect(contextMenuSpy).toHaveBeenCalled();
		expect(document.body.querySelector(`[data-role="${DataRoles.Table.ContextMenu}"]`)).not.toBeNull();
	});

	test("disabled prop suppresses context menu on body rows", () => {
		const contextMenuSpy = vi.fn();

		function SpyContextMenu({ row }: DataTableSlotProps.ContextMenu<RowType>): ReactElement {
			contextMenuSpy(row);

			return <div>{row.name}</div>;
		}

		const { container } = render(
			<DataTable data={data} columns={columns} disabled slots={{ contextMenu: SpyContextMenu }} />
		);

		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		fireEvent.contextMenu(rows[0], { clientX: 100, clientY: 100 });
		expect(contextMenuSpy).not.toHaveBeenCalled();
		expect(document.body.querySelector(`[data-role="${DataRoles.Table.ContextMenu}"]`)).toBeNull();
	});

	test("right-click on a header cell mounts the head context menu portal", () => {
		const headContextMenuSpy = vi.fn();

		function HeadContextMenu(props: DataTableSlotProps.HeadContextMenu<RowType>): ReactElement {
			headContextMenuSpy(props);

			return (
				<div data-testid="head-ctx-menu">
					Column: {String(props.column.label)}
					<button onClick={props.closeHandler}>Close</button>
				</div>
			);
		}

		const { container } = render(
			<DataTable data={data} columns={columns} slots={{ headContextMenu: HeadContextMenu }} />
		);

		const headCells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
		fireEvent.contextMenu(headCells[0], { clientX: 50, clientY: 30 });

		expect(headContextMenuSpy).toHaveBeenCalled();
		expect(headContextMenuSpy).toHaveBeenCalledWith(
			expect.objectContaining({ column: columns[0], columnIndex: 0, closeHandler: expect.any(Function) })
		);

		const portal = document.body.querySelector(`[data-role="${DataRoles.Table.ContextMenu}"]`);
		expect(portal).not.toBeNull();
		expect(portal?.textContent).toContain("ID");
	});
});

describe("com.mgmtp.a12.widgets.data-table — Phase 3: expandable rows", () => {
	test("expansion row renders when rowExpansion.render returns content", () => {
		const { container } = render(
			<DataTable
				data={data}
				columns={columns}
				rowExpansion={{
					render: ({ row }) => (
						<DataTableTemplate.ExpandableRow>
							Details for {String((row as RowType).name)}
						</DataTableTemplate.ExpandableRow>
					)
				}}
			/>
		);

		const expandedRows = getAllByDataRole(container, DataRoles.Table.Expandable.Row);
		expect(expandedRows).toHaveLength(3);
		expect(expandedRows[0].textContent).toContain("Details for Alpha");
		expect(expandedRows[1].textContent).toContain("Details for Bravo");
		expect(expandedRows[2].textContent).toContain("Details for Charlie");
	});

	test("expansion row does NOT render when rowExpansion.render returns null", () => {
		const { container } = render(
			<DataTable
				data={data}
				columns={columns}
				rowExpansion={{
					render: ({ rowIndex }) =>
						rowIndex === 1 ? <DataTableTemplate.ExpandableRow>Expanded</DataTableTemplate.ExpandableRow> : null
				}}
			/>
		);

		const expandedRows = getAllByDataRole(container, DataRoles.Table.Expandable.Row);
		expect(expandedRows).toHaveLength(1);
		expect(expandedRows[0].textContent).toContain("Expanded");
	});

	test("no expansion rows when rowExpansion is not provided", () => {
		const { container } = render(<DataTable data={data} columns={columns} />);

		expect(queryByDataRole(container, DataRoles.Table.Expandable.Row)).toBeNull();
	});

	test("parent row has aria-expanded reflecting whether additional content is present", () => {
		const { container } = render(
			<DataTable
				data={data}
				columns={columns}
				rowExpansion={{
					render: ({ rowIndex }) =>
						rowIndex === 0 ? <DataTableTemplate.ExpandableRow>Details</DataTableTemplate.ExpandableRow> : null
				}}
			/>
		);

		const bodyRows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		expect(bodyRows[0].getAttribute("aria-expanded")).toBe("true");
		expect(bodyRows[1].getAttribute("aria-expanded")).toBe("false");
		expect(bodyRows[2].getAttribute("aria-expanded")).toBe("false");
	});

	test("parent row does not have aria-expanded when no rowExpansion", () => {
		const { container } = render(<DataTable data={data} columns={columns} />);

		const bodyRows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		expect(bodyRows[0].hasAttribute("aria-expanded")).toBe(false);
	});

	test("expansion row spans all columns via a colSpan <td>", () => {
		const { container } = render(
			<DataTable
				data={data}
				columns={columns}
				rowExpansion={{
					render: () => <DataTableTemplate.ExpandableRow>Content</DataTableTemplate.ExpandableRow>
				}}
			/>
		);

		const expandedRows = getAllByDataRole(container, DataRoles.Table.Expandable.Row);
		const cell = expandedRows[0].querySelector("td");
		expect(cell?.getAttribute("colspan")).toBe(String(columns.length));
	});

	test("ExpandableRow forwards selected to aria-selected", () => {
		const { container } = render(
			<DataTable
				data={data}
				columns={columns}
				rowExpansion={{
					render: ({ rowIndex }) => (
						<DataTableTemplate.ExpandableRow selected={rowIndex === 0}>Details</DataTableTemplate.ExpandableRow>
					)
				}}
			/>
		);

		const expandedRows = getAllByDataRole(container, DataRoles.Table.Expandable.Row);
		expect(expandedRows[0].getAttribute("aria-selected")).toBe("true");
		expect(expandedRows[1].hasAttribute("aria-selected")).toBe(false);
	});

	test("ExpandableRow with focusOnMount sets tabIndex=-1 and focuses the row", async () => {
		const { container } = render(
			<DataTable
				data={data}
				columns={columns}
				rowExpansion={{
					render: ({ rowIndex }) =>
						rowIndex === 0 ? (
							<DataTableTemplate.ExpandableRow focusOnMount>Focused</DataTableTemplate.ExpandableRow>
						) : null
				}}
			/>
		);

		const expandedRow = getByDataRole(container, DataRoles.Table.Expandable.Row);
		expect(expandedRow.getAttribute("tabindex")).toBe("-1");
		expect(document.activeElement).toBe(expandedRow);
	});

	test("ExpandableRowBody and ExpandableRowFooter render with their data-roles", () => {
		const { container } = render(
			<DataTable
				data={data}
				columns={columns}
				rowExpansion={{
					render: ({ rowIndex }) =>
						rowIndex === 0 ? (
							<DataTableTemplate.ExpandableRow>
								<DataTableTemplate.ExpandableRowBody>body content</DataTableTemplate.ExpandableRowBody>
								<DataTableTemplate.ExpandableRowFooter>footer content</DataTableTemplate.ExpandableRowFooter>
							</DataTableTemplate.ExpandableRow>
						) : null
				}}
			/>
		);

		const body = getByDataRole(container, DataRoles.Table.Expandable.Row.Body);
		const footer = getByDataRole(container, DataRoles.Table.Expandable.Row.Footer);
		expect(body.textContent).toBe("body content");
		expect(footer.textContent).toBe("footer content");
		expect(body.nextElementSibling).toBe(footer);
	});
});

describe("DataTableRowsGroup", () => {
	const groupColumns: BaseColumnType<RowType>[] = [
		{ label: "ID", dataKey: "id", width: 0.5, fixedWidth: true },
		{ label: "Name", dataKey: "name", width: 1 }
	];

	const groups: RowsGroup<RowType>[] = [
		{
			head: { title: "Group A" },
			subRows: [
				{ id: 1, name: "Alpha" },
				{ id: 2, name: "Bravo" }
			],
			collapsed: false
		},
		{
			head: { title: "Group B" },
			subRows: [{ id: 3, name: "Charlie" }],
			collapsed: false
		}
	];

	test("renders group headers with correct titles", () => {
		const { container } = render(<DataTableRowsGroup data={groups} columns={groupColumns} ariaLabel="Grouped table" />);

		const headers = getAllByDataRole(container, DataRoles.Table.Row.Group.Header);
		expect(headers).toHaveLength(2);
		expect(headers[0].textContent).toContain("Group A");
		expect(headers[1].textContent).toContain("Group B");
	});

	test("renders sub-rows for expanded groups", () => {
		const { container } = render(<DataTableRowsGroup data={groups} columns={groupColumns} />);

		const bodyRows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		expect(bodyRows).toHaveLength(3);
	});

	test("collapsed group hides its sub-rows", () => {
		const collapsedGroups: RowsGroup<RowType>[] = [{ ...groups[0], collapsed: true }, groups[1]];

		const { container } = render(<DataTableRowsGroup data={collapsedGroups} columns={groupColumns} />);

		const bodyRows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		// Only Group B's 1 row should be visible (Group A's 2 rows are hidden)
		expect(bodyRows).toHaveLength(1);

		// Group header for Group A should still be visible
		const headers = getAllByDataRole(container, DataRoles.Table.Row.Group.Header);
		expect(headers).toHaveLength(2);
		expect(headers[0].textContent).toContain("Group A");
	});

	test("aria-expanded on the header toggle button reflects collapsed state", () => {
		const mixedGroups: RowsGroup<RowType>[] = [{ ...groups[0], collapsed: true }, groups[1]];

		const { container } = render(
			<DataTableRowsGroup data={mixedGroups} columns={groupColumns} onGroupHeaderClick={vi.fn()} />
		);

		// The collapse interaction lives on a real <button> inside the header
		// cell; the non-interactive <tr> carries no aria-expanded.
		const toggles = getAllByDataRole(container, DataRoles.Table.Row.Group.HeaderToggle);
		expect(toggles[0].tagName).toBe("BUTTON");
		expect(toggles[0].getAttribute("aria-expanded")).toBe("false");
		expect(toggles[1].getAttribute("aria-expanded")).toBe("true");

		const headers = getAllByDataRole(container, DataRoles.Table.Row.Group.Header);
		expect(headers[0].getAttribute("aria-expanded")).toBeNull();
	});

	test("group header toggle is keyboard-operable", async () => {
		const onClick = vi.fn();

		const { container } = render(
			<DataTableRowsGroup data={groups} columns={groupColumns} onGroupHeaderClick={onClick} />
		);

		const toggles = getAllByDataRole(container, DataRoles.Table.Row.Group.HeaderToggle);
		(toggles[0] as HTMLElement).focus();
		await userEvent.keyboard("{Enter}");

		expect(onClick).toHaveBeenCalledOnce();
		expect(onClick).toHaveBeenCalledWith({ group: groups[0], groupIndex: 0 });
	});

	test("renders the empty-state placeholder when there are no groups", () => {
		const { container } = render(<DataTableRowsGroup data={[]} columns={groupColumns} />);

		expect(getByDataRole(container, DataRoles.Table.Body.Content.Placeholder)).toHaveTextContent("No data");
	});

	test("group header spans all columns", () => {
		const { container } = render(<DataTableRowsGroup data={groups} columns={groupColumns} />);

		const headers = getAllByDataRole(container, DataRoles.Table.Row.Group.Header);
		const cell = headers[0].querySelector("td");
		expect(cell).not.toBeNull();
		expect(cell).toHaveAttribute("colspan", String(groupColumns.length));
	});

	test("onGroupHeaderClick fires with correct group and index", async () => {
		const onClick = vi.fn();

		const { container } = render(
			<DataTableRowsGroup data={groups} columns={groupColumns} onGroupHeaderClick={onClick} />
		);

		const headers = getAllByDataRole(container, DataRoles.Table.Row.Group.Header);
		await userEvent.click(headers[1]);

		expect(onClick).toHaveBeenCalledOnce();
		expect(onClick).toHaveBeenCalledWith({ group: groups[1], groupIndex: 1 });
	});

	test("collapse indicator shows ▶ for collapsed and ▼ for expanded", () => {
		const mixedGroups: RowsGroup<RowType>[] = [{ ...groups[0], collapsed: true }, groups[1]];

		const { container } = render(<DataTableRowsGroup data={mixedGroups} columns={groupColumns} />);

		const headers = getAllByDataRole(container, DataRoles.Table.Row.Group.Header);
		expect(headers[0].textContent).toContain("▶");
		expect(headers[1].textContent).toContain("▼");
	});
});

describe("com.mgmtp.a12.widgets.data-table — Phase 3: cross-tabulation", () => {
	interface CrossTabRow {
		product: string;
		q1: number;
		q2: number;
		q3: number;
	}

	const crossTabData: CrossTabRow[] = [
		{ product: "Widget A", q1: 100, q2: 200, q3: 150 },
		{ product: "Widget B", q1: 300, q2: 400, q3: 350 }
	];

	const crossTabColumns: BaseColumnType<CrossTabRow>[] = [
		{ label: "Product", dataKey: "product", width: 1, verticalHeader: true },
		{ label: "Q1", dataKey: "q1", width: 1 },
		{ label: "Q2", dataKey: "q2", width: 1 },
		{ label: "Q3", dataKey: "q3", width: 1 }
	];

	test("body cell with verticalHeader renders as <th> with scope='row'", () => {
		const { container } = render(
			<DataTable data={crossTabData} columns={crossTabColumns} ariaLabel="Cross-tab table" />
		);

		const bodyCells = getAllByDataRole(container, DataRoles.Table.Body.Cell);

		// First cell in each row should be a <th> with scope="row"
		const firstRowCells = bodyCells.filter((cell) => (cell as HTMLTableCellElement).cellIndex === 0);
		expect(firstRowCells.length).toBe(2);

		for (const cell of firstRowCells) {
			expect(cell.tagName).toBe("TH");
			expect(cell.getAttribute("scope")).toBe("row");
		}
	});

	test("non-verticalHeader body cells remain as <td>", () => {
		const { container } = render(
			<DataTable data={crossTabData} columns={crossTabColumns} ariaLabel="Cross-tab table" />
		);

		const bodyCells = getAllByDataRole(container, DataRoles.Table.Body.Cell);
		const dataCells = bodyCells.filter((cell) => (cell as HTMLTableCellElement).cellIndex !== 0);

		for (const cell of dataCells) {
			expect(cell.tagName).toBe("TD");
		}
	});

	test("verticalHeader columns are pinned left regardless of explicit pinning value", () => {
		const { container } = render(
			<DataTable data={crossTabData} columns={crossTabColumns} ariaLabel="Cross-tab table" />
		);

		const bodyCells = getAllByDataRole(container, DataRoles.Table.Body.Cell);
		const verticalHeaderCells = bodyCells.filter((cell) => (cell as HTMLTableCellElement).cellIndex === 0);

		for (const cell of verticalHeaderCells) {
			expect(cell.getAttribute("data-pinned")).toBe("left");
		}
	});

	test("table has data-cross-tabulation attribute when any column has verticalHeader", () => {
		const { container } = render(
			<DataTable data={crossTabData} columns={crossTabColumns} ariaLabel="Cross-tab table" />
		);

		const table = container.querySelector("table");
		expect(table?.getAttribute("data-cross-tabulation")).toBe("true");
	});

	test("table does NOT have data-cross-tabulation when no column has verticalHeader", () => {
		const { container } = render(<DataTable data={data} columns={columns} ariaLabel="Normal table" />);

		const table = container.querySelector("table");
		expect(table?.getAttribute("data-cross-tabulation")).toBeNull();
	});
});

describe("com.mgmtp.a12.widgets.data-table.column-resize", () => {
	const resizableColumns: BaseColumnType<RowType>[] = [
		{ label: "ID", dataKey: "id", width: 0.5, fixedWidth: true },
		{ label: "Name", dataKey: "name", width: 1 },
		{ label: "", pinning: "right", actionColumn: true, hiddenText: "Actions" }
	];

	test("resize handles render on every leaf header cell (incl. action columns) when columnResizingOptions is provided", () => {
		const { container } = render(
			<DataTable
				data={data}
				columns={resizableColumns}
				columnResizingOptions={{ onEndResize: vi.fn() }}
				ariaLabel="Resizable table"
			/>
		);

		const resizeHandles = getAllByDataRole(container, DataRoles.Table.Column.ResizeHandler);
		// All 3 leaf columns are resizable — ID, Name, and the action column.
		expect(resizeHandles.length).toBe(3);
	});

	test("resize handles do NOT render when columnResizingOptions is not provided", () => {
		const { container } = render(<DataTable data={data} columns={resizableColumns} ariaLabel="Non-resizable table" />);

		const resizeHandle = container.querySelector(`[data-role="${DataRoles.Table.Column.ResizeHandler}"]`);
		expect(resizeHandle).toBeNull();
	});

	test("resize handle has role=separator and aria-label", () => {
		const { container } = render(
			<DataTable
				data={data}
				columns={resizableColumns}
				columnResizingOptions={{ onEndResize: vi.fn() }}
				ariaLabel="Resizable table"
			/>
		);

		const resizeHandles = getAllByDataRole(container, DataRoles.Table.Column.ResizeHandler);
		expect(resizeHandles[0].getAttribute("role")).toBe("separator");
		expect(resizeHandles[0].getAttribute("aria-label")).toBe("Resize ID");
		expect(resizeHandles[1].getAttribute("aria-label")).toBe("Resize Name");
	});

	test("resize handle exposes a real width value at rest (no phantom default-50)", async () => {
		const { container } = render(
			<DataTable
				data={data}
				columns={resizableColumns}
				columnResizingOptions={{ onEndResize: vi.fn() }}
				ariaLabel="Resizable table"
			/>
		);

		const resizeHandles = getAllByDataRole(container, DataRoles.Table.Column.ResizeHandler);

		// A focusable role="separator" with no aria-valuenow makes the platform synthesize
		// the midpoint of its default 0–100 range — a phantom "50" screen readers announce
		// on every resizable column. Every handle must carry a real width value at rest.
		await vi.waitFor(() => {
			resizeHandles.forEach((handle) => {
				const valuenow = handle.getAttribute("aria-valuenow");
				expect(valuenow).not.toBeNull();
				expect(Number(valuenow)).toBeGreaterThanOrEqual(30);
				expect(handle.getAttribute("aria-valuetext")).toBe(`${valuenow} pixels`);
				expect(handle.getAttribute("aria-valuemin")).toBe("30");
				expect(Number(handle.getAttribute("aria-valuemax"))).toBeGreaterThanOrEqual(Number(valuenow));
			});
		});
	});

	test("resize handles are keyboard-focusable (tabIndex=0)", () => {
		const { container } = render(
			<DataTable
				data={data}
				columns={resizableColumns}
				columnResizingOptions={{ onEndResize: vi.fn() }}
				ariaLabel="Resizable table"
			/>
		);

		const resizeHandles = getAllByDataRole(container, DataRoles.Table.Column.ResizeHandler);
		expect(resizeHandles[0].getAttribute("tabindex")).toBe("0");
	});

	test("ArrowRight on resize handle fires onEndResize", async () => {
		const onEndResize = vi.fn();
		const { container } = render(
			<DataTable
				data={data}
				columns={resizableColumns}
				columnResizingOptions={{ onEndResize }}
				ariaLabel="Resizable table"
			/>
		);

		const resizeHandles = getAllByDataRole(container, DataRoles.Table.Column.ResizeHandler);
		resizeHandles[0].focus();
		await userEvent.keyboard("{ArrowRight}");
		expect(onEndResize).toHaveBeenCalledTimes(1);
		expect(onEndResize.mock.calls[0][0].resizedColumn).toBe(resizableColumns[0]);
		expect(typeof onEndResize.mock.calls[0][0].resizedWidthsGetter).toBe("function");
	});

	test("ArrowRight brackets the step with onBeginResize and onEndResize", async () => {
		const onBeginResize = vi.fn();
		const onEndResize = vi.fn();
		const { container } = render(
			<DataTable
				data={data}
				columns={resizableColumns}
				columnResizingOptions={{ onBeginResize, onEndResize }}
				ariaLabel="Resizable table"
			/>
		);

		const resizeHandles = getAllByDataRole(container, DataRoles.Table.Column.ResizeHandler);
		resizeHandles[0].focus();
		await userEvent.keyboard("{ArrowRight}");

		expect(onBeginResize).toHaveBeenCalledTimes(1);
		expect(onEndResize).toHaveBeenCalledTimes(1);
		expect(onBeginResize.mock.calls[0][0].resizedColumn).toBe(resizableColumns[0]);
	});

	test("Escape resets all column widths and notifies onEndResize with cleared widths", async () => {
		const onEndResize = vi.fn();
		const { container } = render(
			<DataTable
				data={data}
				columns={resizableColumns}
				columnResizingOptions={{ onEndResize }}
				ariaLabel="Resizable table"
			/>
		);

		const resizeHandles = getAllByDataRole(container, DataRoles.Table.Column.ResizeHandler);
		resizeHandles[0].focus();
		await userEvent.keyboard("{ArrowRight}");
		expect(onEndResize).toHaveBeenCalledTimes(1);

		await userEvent.keyboard("{Escape}");

		// Consumers persisting widths via onEndResize must learn about the reset.
		expect(onEndResize).toHaveBeenCalledTimes(2);
		const resetGetter = onEndResize.mock.calls[1][0].resizedWidthsGetter;
		expect(resetGetter(resizableColumns[0])).toBeUndefined();

		const table = container.querySelector("table") as HTMLTableElement;
		expect(table.style.getPropertyValue("--a12-col-0-width")).toBe("");
	});

	test("pointercancel ends a drag, restores document state, and removes the drag listeners", async () => {
		const onResize = vi.fn();
		const onEndResize = vi.fn();
		const { container } = render(
			<DataTable
				data={data}
				columns={resizableColumns}
				columnResizingOptions={{ onResize, onEndResize }}
				ariaLabel="Resizable table"
			/>
		);

		const handle = getAllByDataRole(container, DataRoles.Table.Column.ResizeHandler)[0];
		fireEvent.pointerDown(handle, { clientX: 100, pointerId: 1, isPrimary: true, button: 0 });
		expect(document.body.style.userSelect).toBe("none");

		fireEvent.pointerCancel(document);

		expect(document.body.style.userSelect).toBe("");
		expect(onEndResize).toHaveBeenCalledTimes(1);

		// Listeners must be gone: further pointer moves resize nothing.
		const callsAfterCancel = onResize.mock.calls.length;
		fireEvent.pointerMove(document, { clientX: 500 });
		await new Promise((resolve) => requestAnimationFrame(resolve));
		expect(onResize.mock.calls.length).toBe(callsAfterCancel);
	});

	test("ending a pointer resize does NOT trigger the host header's sort", async () => {
		const onSort = vi.fn();
		const sortableResizableColumns: BaseColumnType<RowType>[] = [
			{ label: "ID", dataKey: "id", width: 0.5, fixedWidth: true, sortable: true },
			{ label: "Name", dataKey: "name", width: 1, sortable: true }
		];
		const { container } = render(
			<DataTable
				data={data}
				columns={sortableResizableColumns}
				columnResizingOptions={{ onEndResize: vi.fn() }}
				sortOptions={{ sortState: [], onSort }}
				ariaLabel="Resizable sortable table"
			/>
		);

		const handle = getAllByDataRole(container, DataRoles.Table.Column.ResizeHandler)[0];
		const headCell = getAllByDataRole(container, DataRoles.Table.Header.Cell)[0];

		// Simulate a drag that ends over the host header cell: the browser then
		// synthesizes a `click` whose nearest common ancestor is the <th>.
		fireEvent.pointerDown(handle, { clientX: 100, pointerId: 1, isPrimary: true, button: 0 });
		fireEvent.pointerMove(document, { clientX: 160 });
		await new Promise((resolve) => requestAnimationFrame(resolve));
		fireEvent.pointerUp(document, { clientX: 160 });

		// The synthetic post-gesture click must be swallowed before reaching onSort.
		fireEvent.click(headCell);
		expect(onSort).not.toHaveBeenCalled();

		// The guard is one-shot: a genuine later click still sorts.
		await new Promise((resolve) => requestAnimationFrame(resolve));
		await userEvent.click(headCell);
		expect(onSort).toHaveBeenCalledTimes(1);
	});

	test("<col> widths use CSS custom properties when columnResizingOptions is provided", () => {
		const { container } = render(
			<DataTable
				data={data}
				columns={resizableColumns}
				columnResizingOptions={{ onEndResize: vi.fn() }}
				ariaLabel="Resizable table"
			/>
		);

		const table = container.querySelector("table") as HTMLTableElement;
		const cols = Array.from(table.querySelectorAll("colgroup > col")) as HTMLTableColElement[];
		// Every leaf column is resizable, so all are wrapped in var(--a12-col-N-width, <default>) —
		// including the width-less action column, whose 150px fallback becomes the var default.
		expect(cols[0].style.width).toContain("var(--a12-col-0-width");
		expect(cols[1].style.width).toContain("var(--a12-col-1-width");
		expect(cols[2].style.width).toContain("var(--a12-col-2-width");
	});

	test("getColumnWidths wraps every column with CSS custom properties when resizable", () => {
		const widths = getColumnWidths(resizableColumns, true);
		// ID (fixedWidth) → 75px; Actions (no width) → 150px fallback; absolute total = 225px.
		// Name (sole flex) reserves the rest. The width-less action column is wrapped too,
		// with its 150px fallback as the var default.
		expect(widths[0]).toBe("var(--a12-col-0-width, 75px)");
		expect(widths[1]).toBe("var(--a12-col-1-width, calc(100% - 225px))");
		expect(widths[2]).toBe("var(--a12-col-2-width, 150px)");
	});

	test("non-pinned head cell stacks below the pinned head cell so its resize handle cannot overlay it on scroll", () => {
		const pinnedColumns: BaseColumnType<RowType>[] = [
			{ label: "ID", dataKey: "id", width: 0.5, pinning: "left" },
			{ label: "Name", dataKey: "name", width: 1 }
		];
		const { container } = render(
			<DataTable
				data={data}
				columns={pinnedColumns}
				columnResizingOptions={{ onEndResize: vi.fn() }}
				ariaLabel="Pinned resizable table"
			/>
		);

		const table = container.querySelector("table") as HTMLTableElement;
		const pinnedHead = table.querySelector('thead th[data-col-index="1"]') as HTMLElement;
		const nonPinnedHead = table.querySelector('thead th[data-col-index="2"]') as HTMLElement;

		const nonPinnedZ = getComputedStyle(nonPinnedHead).zIndex;
		const pinnedZ = getComputedStyle(pinnedHead).zIndex;

		// The non-pinned cell must form its own stacking context (not "auto"), so the
		// resize handle it hosts (a higher z-index child) is contained within it...
		expect(nonPinnedZ).not.toBe("auto");
		// ...and that context must sit below the pinned head cell.
		expect(Number(pinnedZ)).toBeGreaterThan(Number(nonPinnedZ));
	});

	test("dragging a column's resize handle does not change the other columns' widths", () => {
		const { container } = render(
			<DataTable
				data={data}
				columns={resizableColumns}
				columnResizingOptions={{ onEndResize: vi.fn() }}
				ariaLabel="Resizable table"
			/>
		);

		const table = container.querySelector("table") as HTMLTableElement;
		// data-col-index is 1-based: ID = 1 (dragged), Name = 2 (must stay put).
		const idHead = table.querySelector('thead th[data-col-index="1"]') as HTMLElement;
		const nameHead = table.querySelector('thead th[data-col-index="2"]') as HTMLElement;

		const idWidthBefore = idHead.getBoundingClientRect().width;
		const nameWidthBefore = nameHead.getBoundingClientRect().width;

		// The first handle resizes the ID column.
		const handle = getAllByDataRole(container, DataRoles.Table.Column.ResizeHandler)[0];
		const startX = handle.getBoundingClientRect().left;
		// pointerup flushes the final width synchronously from the last clientX,
		// so no requestAnimationFrame wait is needed.
		fireEvent.pointerDown(handle, { clientX: startX, pointerId: 1 });
		fireEvent.pointerMove(document, { clientX: startX + 120, pointerId: 1 });
		fireEvent.pointerUp(document, { clientX: startX + 120, pointerId: 1 });

		expect(table.dataset.resized).toBe("true");

		const idWidthAfter = idHead.getBoundingClientRect().width;
		const nameWidthAfter = nameHead.getBoundingClientRect().width;

		// Dragged column grew; the non-dragged column is untouched (the table grew
		// instead of stealing space from it).
		expect(idWidthAfter).toBeGreaterThan(idWidthBefore);
		expect(Math.abs(nameWidthAfter - nameWidthBefore)).toBeLessThan(2);
	});

	test("dragging a width-less action column's handle resizes it live", () => {
		const { container } = render(
			<DataTable
				data={data}
				columns={resizableColumns}
				columnResizingOptions={{ onEndResize: vi.fn() }}
				ariaLabel="Resizable table"
			/>
		);

		const table = container.querySelector("table") as HTMLTableElement;
		// data-col-index is 1-based: the action column is the 3rd leaf.
		const actionHead = table.querySelector('thead th[data-col-index="3"]') as HTMLElement;
		const widthBefore = actionHead.getBoundingClientRect().width;

		// The 3rd handle resizes the (width-less) action column.
		const handle = getAllByDataRole(container, DataRoles.Table.Column.ResizeHandler)[2];
		const startX = handle.getBoundingClientRect().left;
		fireEvent.pointerDown(handle, { clientX: startX, pointerId: 1 });
		fireEvent.pointerMove(document, { clientX: startX + 80, pointerId: 1 });
		fireEvent.pointerUp(document, { clientX: startX + 80, pointerId: 1 });

		// The width-less column is now var-wrapped and frozen, so the drag pins it to px live.
		expect(table.style.getPropertyValue("--a12-col-2-width")).toMatch(/px$/);
		expect(actionHead.getBoundingClientRect().width).toBeGreaterThan(widthBefore);
	});

	test("drag resize callbacks receive the react-draggable-shaped event/data pair", async () => {
		const onBeginResize = vi.fn();
		const onResize = vi.fn();
		const onEndResize = vi.fn();
		const { container } = render(
			<DataTable
				data={data}
				columns={resizableColumns}
				columnResizingOptions={{ onBeginResize, onResize, onEndResize }}
				ariaLabel="Resizable table"
			/>
		);

		const handle = getAllByDataRole(container, DataRoles.Table.Column.ResizeHandler)[0];
		const startX = handle.getBoundingClientRect().left;
		fireEvent.pointerDown(handle, { clientX: startX, clientY: 10, pointerId: 1 });

		expect(onBeginResize).toHaveBeenCalledTimes(1);
		const beginParams = onBeginResize.mock.calls[0][0];
		expect(beginParams.event).toBeTruthy();
		expect(beginParams.data.node).toBe(handle);
		expect(beginParams.data.x).toBe(startX);
		expect(beginParams.data.deltaX).toBe(0);

		fireEvent.pointerMove(document, { clientX: startX + 50, clientY: 10, pointerId: 1 });
		// Pointer moves are rAF-coalesced before onResize fires.
		await new Promise((resolve) => requestAnimationFrame(resolve));

		expect(onResize).toHaveBeenCalled();
		const moveParams = onResize.mock.calls[0][0];
		expect(moveParams.event).toBeTruthy();
		expect(moveParams.data.x).toBe(startX + 50);
		expect(moveParams.data.deltaX).toBe(50);
		expect(moveParams.data.lastX).toBe(startX);

		fireEvent.pointerUp(document, { clientX: startX + 50, clientY: 10, pointerId: 1 });

		expect(onEndResize).toHaveBeenCalledTimes(1);
		const endParams = onEndResize.mock.calls[0][0];
		expect(endParams.event).toBeTruthy();
		expect(endParams.data.node).toBe(handle);
		expect(endParams.data.x).toBe(startX + 50);
	});

	test("keyboard resize reports the step delta in data.deltaX", async () => {
		const onEndResize = vi.fn();
		const { container } = render(
			<DataTable
				data={data}
				columns={resizableColumns}
				columnResizingOptions={{ onEndResize }}
				ariaLabel="Resizable table"
			/>
		);

		const handle = getAllByDataRole(container, DataRoles.Table.Column.ResizeHandler)[0];
		handle.focus();
		await userEvent.keyboard("{ArrowRight}");

		expect(onEndResize).toHaveBeenCalledTimes(1);
		const params = onEndResize.mock.calls[0][0];
		expect(params.event).toBeTruthy();
		expect(params.data.node).toBe(handle);
		expect(params.data.deltaX).toBe(10);
	});

	test("resize handlers written against the production Table's signature are accepted", () => {
		// Compile-time compatibility check: the production handler type requires
		// `event`/`data`; it must be directly assignable to the DataTable option.
		const legacyHandler: ColumnResizeEventHandler<BaseColumnType<RowType>> = vi.fn();
		const { container } = render(
			<DataTable
				data={data}
				columns={resizableColumns}
				columnResizingOptions={{ onEndResize: legacyHandler }}
				ariaLabel="Resizable table"
			/>
		);

		expect(getAllByDataRole(container, DataRoles.Table.Column.ResizeHandler).length).toBe(3);
	});
});

describe("com.mgmtp.a12.widgets.data-table — Phase 3: drag and drop", () => {
	const dndColumns: BaseColumnType<RowType>[] = [
		{ label: "ID", dataKey: "id", width: 0.5 },
		{ label: "Name", dataKey: "name", width: 1 }
	];

	// pragmatic-drag-and-drop ignores `dragstart` events without a `dataTransfer`,
	// and `new DragEvent(...)` defaults it to `null` — every simulated drag must
	// share one real DataTransfer across the whole event sequence.
	function startDrag(source: HTMLElement): DataTransfer {
		const dataTransfer = new DataTransfer();

		fireEvent.dragStart(source, { dataTransfer });

		return dataTransfer;
	}

	// `onDragStart` (and everything driven by it) is dispatched one animation
	// frame after the native `dragstart` — flush it before asserting.
	function nextFrame(): Promise<void> {
		return new Promise((resolve) => requestAnimationFrame(() => resolve()));
	}

	// pragmatic-drag-and-drop holds one global drag at a time and ignores new
	// `dragstart` events while one is active — every test that starts a drag must
	// also end it (`drop` or `dragend`), or it poisons the following tests.
	async function simulateDragAndDrop(source: HTMLElement, target: HTMLElement): Promise<void> {
		const dataTransfer = startDrag(source);

		await nextFrame();
		fireEvent.dragEnter(target, { dataTransfer });
		fireEvent.dragOver(target, { dataTransfer });
		fireEvent.drop(target, { dataTransfer });
		fireEvent.dragEnd(source, { dataTransfer });
	}

	test("body rows are draggable when dragDropOptions is provided", () => {
		const { container } = render(
			<DataTable data={data} columns={dndColumns} dragDropOptions={{}} ariaLabel="DnD table" />
		);

		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		expect(rows.length).toBe(data.length);

		// HTML5 drag-and-drop requires `draggable="true"` on an element with a real layout box —
		// not a `display: contents` wrapper. The drag connector must land on the `<tr>` itself.
		for (const row of rows) {
			expect(row.getAttribute("draggable")).toBe("true");
			expect(row.getBoundingClientRect().width).toBeGreaterThan(0);
		}
	});

	test("body rows are not draggable without dragDropOptions", () => {
		const { container } = render(<DataTable data={data} columns={dndColumns} ariaLabel="No DnD table" />);

		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);

		for (const row of rows) {
			expect(row.getAttribute("draggable")).not.toBe("true");
		}
	});

	test("drop hints render between rows when dragDropOptions is provided", () => {
		const { container } = render(
			<DataTable data={data} columns={dndColumns} dragDropOptions={{}} ariaLabel="DnD table" />
		);

		// Each row gets a drop target after it, plus the first row also gets one before it.
		// Total hints = data.length + 1 (one before first row + one after each row)
		const hints = getAllByDataRole(container, DataRoles.Table.DnDHint);
		expect(hints.length).toBe(data.length + 1);
	});

	test("drop hint spans the full row width via a colSpan cell", () => {
		const { container } = render(
			<DataTable data={data} columns={dndColumns} dragDropOptions={{}} ariaLabel="DnD table" />
		);

		// The hint is a zero-height <tr> wrapping a single <td colSpan={leafCount}>.
		// Spanning all columns is what gives the drop indicator (and its hit-test
		// surface) the full row width — without it the hint collapses to a single
		// column and most of each row gap stops accepting drops (regression guard).
		const hint = getAllByDataRole(container, DataRoles.Table.DnDHint)[0];
		const cell = hint.querySelector("td");
		expect(cell).not.toBeNull();
		expect(cell?.colSpan).toBe(dndColumns.length);

		const bodyRow = getAllByDataRole(container, DataRoles.Table.Body.Row)[0];
		expect(cell?.getBoundingClientRect().width).toBeCloseTo(bodyRow.getBoundingClientRect().width, 0);
	});

	test("onBeginDrag fires when dragging starts", async () => {
		const onBeginDrag = vi.fn();

		const { container } = render(
			<DataTable data={data} columns={dndColumns} dragDropOptions={{ onBeginDrag }} ariaLabel="DnD table" />
		);

		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		const dataTransfer = startDrag(rows[0]);
		await vi.waitFor(() => expect(onBeginDrag).toHaveBeenCalledTimes(1));
		expect(onBeginDrag.mock.calls[0][0].dragItem.rowIndex).toBe(0);
		expect(onBeginDrag.mock.calls[0][0].dragItem.row).toBe(data[0]);

		fireEvent.dragEnd(rows[0], { dataTransfer });
	});

	test("canDrag returning false prevents drag", async () => {
		const onBeginDrag = vi.fn();
		const canDrag = vi.fn().mockReturnValue(false);

		const { container } = render(
			<DataTable data={data} columns={dndColumns} dragDropOptions={{ onBeginDrag, canDrag }} ariaLabel="DnD table" />
		);

		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		startDrag(rows[0]);
		// `canDrag` is consulted synchronously inside the native dragstart handler.
		expect(canDrag).toHaveBeenCalled();
		// `onDragStart` is frame-deferred — flush it before asserting the negative.
		await nextFrame();
		expect(onBeginDrag).not.toHaveBeenCalled();
	});

	test("completed drag calls onDrop and onEndDrag with the drop result", async () => {
		const onDrop = vi.fn();
		const onEndDrag = vi.fn();

		const { container } = render(
			<DataTable data={data} columns={dndColumns} dragDropOptions={{ onDrop, onEndDrag }} ariaLabel="DnD table" />
		);

		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		const hints = getAllByDataRole(container, DataRoles.Table.DnDHint);

		// hints[2] sits after the second row → drop position rowIndex 2.
		await simulateDragAndDrop(rows[0], hints[2]);

		await vi.waitFor(() => expect(onDrop).toHaveBeenCalledTimes(1));
		expect(onDrop.mock.calls[0][0].dragItem.rowIndex).toBe(0);
		expect(onDrop.mock.calls[0][0].dragItem.row).toBe(data[0]);
		expect(onDrop.mock.calls[0][0].dropResult.rowIndex).toBe(2);
		expect(onDrop.mock.calls[0][0].dropResult.row).toBe(data[1]);

		expect(onEndDrag).toHaveBeenCalledTimes(1);
		expect(onEndDrag.mock.calls[0][0].dropResult.rowIndex).toBe(2);
	});

	test("cancelled drag calls onEndDrag with a null drop result and never onDrop", async () => {
		const onDrop = vi.fn();
		const onEndDrag = vi.fn();

		const { container } = render(
			<DataTable data={data} columns={dndColumns} dragDropOptions={{ onDrop, onEndDrag }} ariaLabel="DnD table" />
		);

		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		const dataTransfer = startDrag(rows[0]);

		await nextFrame();
		fireEvent.dragEnd(rows[0], { dataTransfer });

		await vi.waitFor(() => expect(onEndDrag).toHaveBeenCalledTimes(1));
		expect(onEndDrag.mock.calls[0][0].dropResult).toBeNull();
		expect(onDrop).not.toHaveBeenCalled();
	});

	test("canDrop returning false suppresses the drop", async () => {
		const onDrop = vi.fn();
		const canDrop = vi.fn().mockReturnValue(false);

		const { container } = render(
			<DataTable data={data} columns={dndColumns} dragDropOptions={{ onDrop, canDrop }} ariaLabel="DnD table" />
		);

		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		const hints = getAllByDataRole(container, DataRoles.Table.DnDHint);

		await simulateDragAndDrop(rows[0], hints[2]);

		await nextFrame();
		expect(canDrop).toHaveBeenCalled();
		expect(onDrop).not.toHaveBeenCalled();
	});

	test("drop hints open for valid targets while a drag is in progress", async () => {
		const { container } = render(
			<DataTable data={data} columns={dndColumns} dragDropOptions={{}} ariaLabel="DnD table" />
		);

		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		const hints = getAllByDataRole(container, DataRoles.Table.DnDHint);
		const dataTransfer = startDrag(rows[0]);

		// The default `canDrop` rejects the dragged row itself: the hints directly
		// around row 0 (carrying `row === data[0]`) stay closed, every other gap
		// opens. The "open" state is observable via the hint cell's hit-test
		// surface (`pointer-events`).
		await vi.waitFor(() => {
			expect(getComputedStyle(hints[2].querySelector("td") as HTMLTableCellElement).pointerEvents).toBe("auto");
		});
		expect(getComputedStyle(hints[0].querySelector("td") as HTMLTableCellElement).pointerEvents).toBe("none");
		expect(getComputedStyle(hints[1].querySelector("td") as HTMLTableCellElement).pointerEvents).toBe("none");

		// Drag end closes all hints again.
		fireEvent.dragEnd(rows[0], { dataTransfer });
		await vi.waitFor(() => {
			expect(getComputedStyle(hints[2].querySelector("td") as HTMLTableCellElement).pointerEvents).toBe("none");
		});
	});

	test("body rows and cells still render correctly when DnD is enabled", () => {
		const { container } = render(
			<DataTable data={data} columns={dndColumns} dragDropOptions={{}} ariaLabel="DnD table" />
		);

		const bodyRows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		expect(bodyRows.length).toBe(data.length);

		const bodyCells = getAllByDataRole(container, DataRoles.Table.Body.Cell);
		expect(bodyCells.length).toBe(data.length * dndColumns.length);
	});
});

describe("com.mgmtp.a12.widgets.data-table — drag-and-drop + virtualization", () => {
	interface VRow {
		id: number;
		label: string;
	}

	const vColumns: BaseColumnType<VRow>[] = [
		{ label: "ID", dataKey: "id", width: 80, fixedWidth: true },
		{ label: "Label", dataKey: "label", width: 1 }
	];
	const vData: VRow[] = Array.from({ length: 200 }, (_, i) => ({ id: i, label: `Row ${i}` }));

	function startDrag(source: HTMLElement): DataTransfer {
		const dataTransfer = new DataTransfer();
		fireEvent.dragStart(source, { dataTransfer });

		return dataTransfer;
	}

	function nextFrame(): Promise<void> {
		return new Promise((resolve) => requestAnimationFrame(() => resolve()));
	}

	test("draggable rows and drop hints render inside the virtualized tbody", () => {
		const { container } = render(
			<DataTable
				data={vData}
				columns={vColumns}
				maxHeight={200}
				virtualScrollOptions={{ rowHeight: 30 }}
				dragDropOptions={{}}
				ariaLabel="Virtualized DnD table"
			/>
		);

		const tbody = container.querySelector(`[data-role="${DataRoles.Table.Body.VirtualizedContainer}"]`) as HTMLElement;
		expect(tbody).not.toBeNull();

		// Only the visible window mounts — far fewer than the 200-row dataset — and every
		// rendered row is a real draggable `<tr>` (the DnD path is no longer gated off by
		// virtualization).
		const rows = getAllByDataRole(tbody, DataRoles.Table.Body.Row);
		expect(rows.length).toBeGreaterThan(0);
		expect(rows.length).toBeLessThan(vData.length);

		for (const row of rows) {
			expect(row.getAttribute("draggable")).toBe("true");
		}

		// Drop hints are emitted inside the windowed tbody, around the rendered rows.
		const hints = getAllByDataRole(tbody, DataRoles.Table.DnDHint);
		expect(hints.length).toBeGreaterThan(0);
	});

	test("a drop within the rendered window fires onDrop with true data indices", async () => {
		const onDrop = vi.fn();

		const { container } = render(
			<DataTable
				data={vData}
				columns={vColumns}
				maxHeight={200}
				virtualScrollOptions={{ rowHeight: 30 }}
				dragDropOptions={{ onDrop }}
				ariaLabel="Virtualized DnD table"
			/>
		);

		const tbody = container.querySelector(`[data-role="${DataRoles.Table.Body.VirtualizedContainer}"]`) as HTMLElement;
		const rows = getAllByDataRole(tbody, DataRoles.Table.Body.Row);
		const hints = getAllByDataRole(tbody, DataRoles.Table.DnDHint);

		// At scrollTop 0 the window starts at data index 0: hints[0] is the top edge of
		// row 0, hints[2] sits after row 1 → drop position rowIndex 2 (true data index).
		const dataTransfer = startDrag(rows[0]);

		await nextFrame();
		fireEvent.dragEnter(hints[2], { dataTransfer });
		fireEvent.dragOver(hints[2], { dataTransfer });
		fireEvent.drop(hints[2], { dataTransfer });
		fireEvent.dragEnd(rows[0], { dataTransfer });

		await vi.waitFor(() => expect(onDrop).toHaveBeenCalledTimes(1));
		expect(onDrop.mock.calls[0][0].dragItem.rowIndex).toBe(0);
		expect(onDrop.mock.calls[0][0].dropResult.rowIndex).toBe(2);
	});

	test("drop still fires after the source row scrolls out of the window and unmounts", async () => {
		const onDrop = vi.fn();
		const onEndDrag = vi.fn();

		const { container } = render(
			<DataTable
				data={vData}
				columns={vColumns}
				maxHeight={200}
				virtualScrollOptions={{ rowHeight: 30 }}
				dragDropOptions={{ onDrop, onEndDrag }}
				ariaLabel="Virtualized DnD table"
			/>
		);

		const viewport = getByDataRole(container, DataRoles.Table.Viewport);
		const tbody = container.querySelector(`[data-role="${DataRoles.Table.Body.VirtualizedContainer}"]`) as HTMLElement;
		const sourceRow = getAllByDataRole(tbody, DataRoles.Table.Body.Row)[0];

		// Begin dragging data row 0, then scroll far enough that it leaves the rendered
		// window and React unmounts its `<tr>` — the exact condition that, before the
		// fix, dropped the draggable's `onDrop` (drop resolution now lives on the
		// always-mounted table monitor instead).
		const dataTransfer = startDrag(sourceRow);
		await nextFrame();

		viewport.scrollTop = 1500;
		fireEvent.scroll(viewport);

		await vi.waitFor(() => expect(sourceRow.isConnected).toBe(false));

		// Drop on a hint that is now in view; the drag's identity is still data row 0.
		const hint = getAllByDataRole(tbody, DataRoles.Table.DnDHint)[1];
		fireEvent.dragEnter(hint, { dataTransfer });
		fireEvent.dragOver(hint, { dataTransfer });
		fireEvent.drop(hint, { dataTransfer });
		fireEvent.dragEnd(sourceRow, { dataTransfer });

		await vi.waitFor(() => expect(onDrop).toHaveBeenCalledTimes(1));
		expect(onDrop.mock.calls[0][0].dragItem.rowIndex).toBe(0);
		expect(onEndDrag).toHaveBeenCalledTimes(1);
	});
});

describe("com.mgmtp.a12.widgets.data-table — Phase 4: virtualization", () => {
	interface VRow {
		id: number;
		label: string;
	}

	const vColumns: BaseColumnType<VRow>[] = [
		{ label: "ID", dataKey: "id", width: 80, fixedWidth: true, pinning: "left" },
		{ label: "Label", dataKey: "label", width: 1 }
	];

	function makeRows(n: number): VRow[] {
		return Array.from({ length: n }, (_, i) => ({ id: i, label: `Row ${i}` }));
	}

	test("virtualScrollOptions renders the virtualized tbody container", () => {
		const { container } = render(
			<DataTable
				data={makeRows(500)}
				columns={vColumns}
				maxHeight={200}
				virtualScrollOptions={{ rowHeight: 30 }}
				ariaLabel="Virtualized table"
			/>
		);

		const tbody = container.querySelector(`[data-role="${DataRoles.Table.Body.VirtualizedContainer}"]`);
		expect(tbody).not.toBeNull();
		expect(tbody?.tagName).toBe("TBODY");
	});

	test("virtualized table sets data-virtualized=true on the <table>", () => {
		const { container } = render(
			<DataTable
				data={makeRows(100)}
				columns={vColumns}
				maxHeight={200}
				virtualScrollOptions={{ rowHeight: 30 }}
				ariaLabel="Virtualized table"
			/>
		);

		const table = container.querySelector("table");
		expect(table?.getAttribute("data-virtualized")).toBe("true");
	});

	test("virtualized tbody mounts fewer rows than the dataset size", () => {
		const { container } = render(
			<DataTable
				data={makeRows(1000)}
				columns={vColumns}
				maxHeight={200}
				virtualScrollOptions={{ rowHeight: 40 }}
				ariaLabel="Virtualized table"
			/>
		);

		const tbody = container.querySelector(`[data-role="${DataRoles.Table.Body.VirtualizedContainer}"]`) as HTMLElement;
		expect(tbody).not.toBeNull();
		// The virtualizer only renders the visible window (+ overscan), well under the full 1000 rows.
		const rowCount = tbody.querySelectorAll("tr").length;
		expect(rowCount).toBeGreaterThan(0);
		expect(rowCount).toBeLessThan(1000);
	});

	test("virtualized column tracks use explicit widths (no max-content for action)", () => {
		const columnsWithAction: BaseColumnType<VRow>[] = [
			{ label: "ID", dataKey: "id", width: 80, fixedWidth: true },
			{ label: "Label", dataKey: "label", width: 1 },
			{ label: "", actionColumn: true, hiddenText: "Actions" }
		];

		const { container } = render(
			<DataTable
				data={makeRows(100)}
				columns={columnsWithAction}
				maxHeight={200}
				virtualScrollOptions={{ rowHeight: 30 }}
				ariaLabel="Virtualized table"
			/>
		);

		const table = container.querySelector("table") as HTMLTableElement;
		const widths = Array.from(table.querySelectorAll<HTMLTableColElement>("colgroup col")).map((c) => c.style.width);
		expect(widths.some((w) => w.includes("max-content"))).toBe(false);
		expect(widths).toContain("150px"); // action column fallback
	});

	test("infinite scroll mode renders the same virtualized container", () => {
		const { container } = render(
			<DataTable
				data={[]}
				columns={vColumns}
				maxHeight={200}
				infiniteScrollOptions={{
					rowCount: 1000,
					rowHeight: 30,
					rowLoadingStatus: () => undefined,
					loadData: async () => {}
				}}
				ariaLabel="Infinite table"
			/>
		);

		const tbody = container.querySelector(`[data-role="${DataRoles.Table.Body.VirtualizedContainer}"]`);
		expect(tbody).not.toBeNull();
		const table = container.querySelector("table");
		expect(table?.getAttribute("data-virtualized")).toBe("true");
	});

	test("non-virtualized table does not set data-virtualized attribute", () => {
		const { container } = render(<DataTable data={makeRows(10)} columns={vColumns} ariaLabel="Plain table" />);

		const table = container.querySelector("table");
		expect(table?.getAttribute("data-virtualized")).toBeNull();
	});

	test("scrollToNode is wired in virtualized mode (regression: must not silently drop the handler)", () => {
		let handler: DataTableScrollToNodeHandler | undefined;
		render(
			<DataTable
				data={makeRows(500)}
				columns={vColumns}
				maxHeight={200}
				virtualScrollOptions={{ rowHeight: 30 }}
				scrollToNode={(h) => {
					handler = h;
				}}
				ariaLabel="Virtualized scroll-to-node"
			/>
		);

		// The handler MUST be registered in virtualized mode. The non-virtualized branch's effect
		// returns early when isVirtualizedMode is true; this guards against regressions where
		// virtualization also skips the registration.
		expect(handler).toBeDefined();
		expect(() => handler?.(250)).not.toThrow();
		expect(() => handler?.(0, { autoFocus: true })).not.toThrow();
	});

	test("overscanRowCount is honored as a migration alias for overscan", () => {
		const { container } = render(
			<DataTable
				data={makeRows(1000)}
				columns={vColumns}
				maxHeight={200}
				virtualScrollOptions={{ rowHeight: 40, overscanRowCount: 0 }}
				ariaLabel="Virtualized table"
			/>
		);

		const tbody = container.querySelector(`[data-role="${DataRoles.Table.Body.VirtualizedContainer}"]`) as HTMLElement;
		// overscan 0 (via the alias) renders only the visible window: 200px / 40px = 5
		// rows plus at most a partial row — far below the default overscan of 10.
		// Spacer rows are aria-hidden, data rows are not.
		const rowCount = tbody.querySelectorAll('tr:not([aria-hidden="true"])').length;
		expect(rowCount).toBeGreaterThan(0);
		expect(rowCount).toBeLessThan(10);
	});

	describe("dynamic row heights (rowHeight omitted)", () => {
		test("virtualizes and measures real row heights from the DOM", async () => {
			const handleRef: { current: DataTableVirtualizerHandle | null } = { current: null };
			const rowCount = 100;
			const { container } = render(
				<DataTable
					data={makeRows(rowCount)}
					columns={vColumns}
					maxHeight={200}
					rowStyling={() => ({ style: { height: 100 } })}
					virtualScrollOptions={{ estimatedRowHeight: 50, virtualizerRef: handleRef }}
					ariaLabel="Dynamic height table"
				/>
			);

			const table = container.querySelector("table");
			expect(table?.getAttribute("data-virtualized")).toBe("true");

			// Rendered rows carry `data-index`, the attribute the engine uses to
			// attribute a DOM measurement to its row.
			const tbody = container.querySelector(
				`[data-role="${DataRoles.Table.Body.VirtualizedContainer}"]`
			) as HTMLElement;
			await expect.poll(() => tbody.querySelectorAll("tr[data-index]").length).toBeGreaterThan(0);

			// Every measured row is 100px tall while the estimate is 50px, so once
			// measurements land the total size must exceed the estimate-only total.
			await expect.poll(() => handleRef.current?.getTotalSize() ?? 0).toBeGreaterThan(rowCount * 50);
		});

		test("fixed-height mode does not attach measurement attributes", () => {
			const { container } = render(
				<DataTable
					data={makeRows(100)}
					columns={vColumns}
					maxHeight={200}
					virtualScrollOptions={{ rowHeight: 30 }}
					ariaLabel="Fixed height table"
				/>
			);

			const tbody = container.querySelector(
				`[data-role="${DataRoles.Table.Body.VirtualizedContainer}"]`
			) as HTMLElement;
			expect(tbody.querySelectorAll("tr[data-index]").length).toBe(0);
		});
	});

	describe("virtualizerRef imperative handle", () => {
		test("receives a handle on mount and null on unmount", () => {
			const received: (DataTableVirtualizerHandle | null)[] = [];
			const { unmount } = render(
				<DataTable
					data={makeRows(100)}
					columns={vColumns}
					maxHeight={200}
					virtualScrollOptions={{ rowHeight: 30, virtualizerRef: (handle) => received.push(handle) }}
					ariaLabel="Handle table"
				/>
			);

			expect(received.length).toBeGreaterThan(0);
			expect(received[0]).not.toBeNull();
			unmount();
			expect(received[received.length - 1]).toBeNull();
		});

		test("scrollToIndex brings a far row into the rendered window (replaces listRef.scrollToRow)", async () => {
			const handleRef: { current: DataTableVirtualizerHandle | null } = { current: null };
			const { container } = render(
				<DataTable
					data={makeRows(500)}
					columns={vColumns}
					maxHeight={200}
					virtualScrollOptions={{ rowHeight: 30, virtualizerRef: handleRef }}
					ariaLabel="Scroll handle table"
				/>
			);

			expect(handleRef.current).not.toBeNull();
			expect(container.textContent).not.toContain("Row 250");
			handleRef.current?.scrollToIndex(250, { align: "center" });
			await expect.poll(() => container.textContent).toContain("Row 250");
		});

		test("scrollToOffset scrolls by absolute pixels (replaces listRef.scrollToPosition)", async () => {
			const handleRef: { current: DataTableVirtualizerHandle | null } = { current: null };
			const { container } = render(
				<DataTable
					data={makeRows(500)}
					columns={vColumns}
					maxHeight={200}
					virtualScrollOptions={{ rowHeight: 30, virtualizerRef: handleRef }}
					ariaLabel="Offset handle table"
				/>
			);

			handleRef.current?.scrollToOffset(400 * 30);
			await expect.poll(() => container.textContent).toContain("Row 400");
		});

		test("getVirtualIndexes and measure are exposed (replaces listRef.recomputeRowHeights)", () => {
			const handleRef: { current: DataTableVirtualizerHandle | null } = { current: null };
			render(
				<DataTable
					data={makeRows(100)}
					columns={vColumns}
					maxHeight={200}
					virtualScrollOptions={{ rowHeight: 30, virtualizerRef: handleRef }}
					ariaLabel="Introspection handle table"
				/>
			);

			const indexes = handleRef.current?.getVirtualIndexes() ?? [];
			expect(indexes).toContain(0);
			expect(indexes.length).toBeLessThan(100);
			expect(() => handleRef.current?.measure()).not.toThrow();
		});

		test("infiniteScrollOptions.virtualizerRef receives the same handle type", () => {
			const handleRef: { current: DataTableVirtualizerHandle | null } = { current: null };
			render(
				<DataTable
					data={[]}
					columns={vColumns}
					maxHeight={200}
					infiniteScrollOptions={{
						rowCount: 1000,
						rowHeight: 30,
						rowLoadingStatus: () => undefined,
						loadData: async () => {},
						virtualizerRef: handleRef
					}}
					ariaLabel="Infinite handle table"
				/>
			);

			expect(handleRef.current).not.toBeNull();
			expect(handleRef.current?.getTotalSize()).toBe(1000 * 30);
		});
	});

	test("infinite scroll accepts sparse data with undefined holes", () => {
		const sparse: (VRow | undefined)[] = [{ id: 0, label: "Row 0" }, undefined, undefined];
		const { container } = render(
			<DataTable
				data={sparse}
				columns={vColumns}
				maxHeight={200}
				infiniteScrollOptions={{
					rowCount: 3,
					rowHeight: 30,
					rowLoadingStatus: (i) => (i === 0 ? "loaded" : undefined),
					loadData: async () => {}
				}}
				ariaLabel="Sparse infinite table"
			/>
		);

		const tbody = container.querySelector(`[data-role="${DataRoles.Table.Body.VirtualizedContainer}"]`);
		expect(tbody).not.toBeNull();
		expect(tbody?.textContent).toContain("Row 0");
	});
});

describe("com.mgmtp.a12.widgets.data-table — production Table API compatibility", () => {
	test("data is optional and renders the empty state", () => {
		const { container } = render(<DataTable columns={columns} ariaLabel="No data table" />);

		expect(container.querySelector("table")).not.toBeNull();
		expect(getAllByDataRole(container, DataRoles.Table.Header.Cell).length).toBe(columns.length);
		expect(container.textContent).toContain("No data");
	});

	test("rowKey accepts a plain string variable like the production Table", () => {
		// Deliberately typed `string`, not `keyof RowType` — the old API allowed this.
		const key: string = "id";
		const { container } = render(<DataTable data={data} columns={columns} rowKey={key} ariaLabel="Keyed table" />);

		expect(getAllByDataRole(container, DataRoles.Table.Body.Row).length).toBe(data.length);
	});

	test("virtualScrollOptions: true virtualizes with dynamic row heights (production shorthand)", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		const { container } = render(
			<DataTable
				data={data}
				columns={columns}
				maxHeight={200}
				virtualScrollOptions={true}
				ariaLabel="Shorthand table"
			/>
		);

		const table = container.querySelector("table");
		expect(table?.getAttribute("data-virtualized")).toBe("true");
		expect(getAllByDataRole(container, DataRoles.Table.Body.Row).length).toBe(data.length);
		expect(warn).not.toHaveBeenCalledWith(expect.stringContaining("virtualScrollOptions"));
		warn.mockRestore();
	});

	test("enableColumnGroupA11y is accepted as a no-op", () => {
		const { container } = render(
			<DataTable data={data} columns={columns} enableColumnGroupA11y ariaLabel="A11y shim table" />
		);

		expect(getAllByDataRole(container, DataRoles.Table.Body.Row).length).toBe(data.length);
	});

	test("domProps, ariaLabelledby and ariaHidden land on the <table> element", () => {
		const { container } = render(
			<DataTable
				data={data}
				columns={columns}
				domProps={{ "data-testid": "compat-table" } as HTMLProps<HTMLTableElement>}
				ariaLabelledby="caption-id"
				ariaHidden={false}
			/>
		);

		const table = container.querySelector("table") as HTMLTableElement;
		expect(table.getAttribute("data-testid")).toBe("compat-table");
		expect(table.getAttribute("aria-labelledby")).toBe("caption-id");
		expect(table.getAttribute("aria-hidden")).toBe("false");
	});

	test("preserves a consumer-extended column type through sortOptions and renderers", async () => {
		interface MyColumn extends BaseColumnType<RowType> {
			filterKey: string;
		}

		const myColumns: MyColumn[] = [
			{ label: "ID", dataKey: "id", width: 1, sortable: true, filterKey: "id-filter" },
			{ label: "Name", dataKey: "name", width: 1, filterKey: "name-filter" }
		];

		// Compile-time check: `column` must be inferred as MyColumn (no cast needed to read
		// `filterKey`) in renderers, mirroring the production Table's generic signature. Sort state is
		// id-keyed, so the consumer maps the reported `columnId` back to its own typed column.
		const seenFilterKeys: string[] = [];
		const { container } = render(
			<DataTable<RowType, MyColumn>
				data={data}
				columns={myColumns}
				sortOptions={{
					sortState: [],
					onSort: (_next, { columnId }) => {
						const column = myColumns.find((c) => String(c.dataKey) === columnId);

						if (column) {
							seenFilterKeys.push(column.filterKey);
						}
					}
				}}
				ariaLabel="Generic table"
			/>
		);

		await userEvent.click(getAllByDataRole(container, DataRoles.Table.Header.Cell)[0]);
		expect(seenFilterKeys).toEqual(["id-filter"]);
	});
});

describe("com.mgmtp.a12.widgets.data-table — ref and onBlur", () => {
	test("ref prop forwards to the underlying <table> element", () => {
		const seen: (HTMLTableElement | null)[] = [];
		const { container } = render(
			<DataTable
				data={data}
				columns={columns}
				ref={(el): void => {
					seen.push(el);
				}}
				ariaLabel="Ref table"
			/>
		);

		const table = container.querySelector("table");
		const node = seen[seen.length - 1];
		expect(node).not.toBeNull();
		expect(node).toBe(table);
		expect(node?.tagName).toBe("TABLE");
	});

	test("callback ref is invoked with the <table> element on mount and null on unmount", () => {
		const cb = vi.fn();
		const { unmount } = render(<DataTable data={data} columns={columns} ref={cb} ariaLabel="Callback ref table" />);

		expect(cb).toHaveBeenCalled();
		const lastMountCall = cb.mock.calls[cb.mock.calls.length - 1]?.[0];
		expect(lastMountCall).toBeInstanceOf(HTMLTableElement);

		cb.mockClear();
		unmount();
		expect(cb).toHaveBeenLastCalledWith(null);
	});

	test("onBlur fires when focus leaves the table", async () => {
		const onBlur = vi.fn();
		const { container } = render(
			<div>
				<DataTable data={data} columns={columns} onBlur={onBlur} ariaLabel="OnBlur table" />
				<button type="button" data-testid="outside">
					Outside
				</button>
			</div>
		);

		const firstBodyRow = getAllByDataRole(container, DataRoles.Table.Body.Row)[0];
		const outsideButton = container.querySelector<HTMLButtonElement>('[data-testid="outside"]')!;

		// Focus the first body row (it has tabIndex=0 because the table activates arrow nav by default).
		firstBodyRow.focus();
		expect(document.activeElement).toBe(firstBodyRow);

		// Move focus outside; the <table>'s onBlur should fire because the new focus target is outside the table.
		outsideButton.focus();

		expect(onBlur).toHaveBeenCalledTimes(1);
		const event = onBlur.mock.calls[0]?.[0];
		expect(event?.relatedTarget).toBe(outsideButton);
	});

	test("onBlur fires with relatedTarget=null when focus moves to an element outside the document tree", () => {
		const onBlur = vi.fn();
		const { container } = render(
			<DataTable data={data} columns={columns} onBlur={onBlur} ariaLabel="OnBlur blur table" />
		);

		const firstBodyRow = getAllByDataRole(container, DataRoles.Table.Body.Row)[0];
		firstBodyRow.focus();
		firstBodyRow.blur();

		expect(onBlur).toHaveBeenCalledTimes(1);
		expect(onBlur.mock.calls[0]?.[0]?.relatedTarget).toBeNull();
	});
});

describe("com.mgmtp.a12.widgets.data-table — slot integrity", () => {
	function TotalFootContent({ column }: DataTableSlotProps.FootContent<RowType>): ReactNode {
		return column.dataKey === "id" ? <span>Total</span> : null;
	}

	function TemplateRow({
		row: _row,
		rowIndex: _rowIndex,
		columns: _rowColumns,
		...rowProps
	}: DataTableSlotProps.Row<RowType>): ReactElement {
		return <DataTableTemplate.BodyRow {...rowProps} />;
	}

	test("footContent slot output renders inside the default foot cell", () => {
		const { container } = render(<DataTable data={data} columns={columns} slots={{ footContent: TotalFootContent }} />);

		const foot = container.querySelector("tfoot") as HTMLTableSectionElement;
		expect(foot).toHaveTextContent("Total");
	});

	test("custom row slot receives the resolved row state (selection, click handler)", async () => {
		const onClick = vi.fn();
		const { container } = render(
			<DataTable
				data={data}
				columns={columns}
				rowEventHandlers={() => ({ onClick })}
				rowStyling={({ rowIndex }) => ({ selected: rowIndex === 0 })}
				slots={{ row: TemplateRow }}
			/>
		);

		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		expect(rows[0].getAttribute("aria-selected")).toBe("true");
		expect(rows[1].getAttribute("aria-selected")).toBeNull();

		await userEvent.click(rows[1]);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	test("custom row slot rows still work with scrollToNode autoFocus (row ref is forwarded)", () => {
		let scrollHandler: DataTableScrollToNodeHandler | undefined;
		const { container } = render(
			<div style={{ height: 120, overflow: "auto" }}>
				<DataTable
					data={data}
					columns={columns}
					maxHeight={100}
					scrollToNode={(handler) => {
						scrollHandler = handler;
					}}
					slots={{ row: TemplateRow }}
				/>
			</div>
		);

		expect(scrollHandler).toBeDefined();
		scrollHandler?.(2, { autoFocus: true });

		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		expect(document.activeElement).toBe(rows[2]);
	});

	test("DataTableDnDDropTarget renders null outside a DataTable (no dragDropOptions in context)", () => {
		const { container } = render(
			<table>
				<tbody>
					<DataTableDnDDropTarget rowIndex={0} row={{ id: 1, name: "Alpha" }} />
				</tbody>
			</table>
		);

		expect(container.querySelectorAll("tbody tr")).toHaveLength(0);
	});
});

describe("com.mgmtp.a12.widgets.data-table — slot architecture", () => {
	function HookedRow(props: DataTableSlotProps.Row<RowType>): ReactElement {
		// Hooks are legal in slot components — slots are mounted, not invoked.
		const [marker] = useState("hooked-row");

		return <DataTable.Row {...props} styles={{ ...props.styles, className: marker }} />;
	}

	function WrappingHead(props: DataTableSlotProps.Head): ReactElement {
		return <thead data-custom-head="true">{props.children}</thead>;
	}

	function EmphasizedCellContent(props: DataTableSlotProps.CellContent<RowType>): ReactElement {
		return <em>SLOT:{props.defaultContent}</em>;
	}

	test("row slot can use hooks and composes DataTable.Row without losing row behavior", async () => {
		const onClick = vi.fn();
		const { container } = render(
			<DataTable
				data={data}
				columns={columns}
				rowEventHandlers={() => ({ onClick })}
				rowStyling={({ rowIndex }) => ({ selected: rowIndex === 0 })}
				slots={{ row: HookedRow }}
			/>
		);

		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		expect(rows[0].className).toContain("hooked-row");
		expect(rows[0].getAttribute("aria-selected")).toBe("true");
		expect(rows[1].getAttribute("aria-selected")).toBeNull();

		await userEvent.click(rows[1]);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	test("head slot wrapping the pre-built children keeps sorting wired", async () => {
		const onSort = vi.fn();
		const { container } = render(
			<DataTable data={data} columns={columns} sortOptions={{ sortState: [], onSort }} slots={{ head: WrappingHead }} />
		);

		const thead = container.querySelector("thead");
		expect(thead?.getAttribute("data-custom-head")).toBe("true");

		const headCells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
		await userEvent.click(headCells[0]);
		expect(onSort).toHaveBeenCalledWith([{ columnId: "id", order: "asc" }], { columnId: "id", order: "asc" });
	});

	test("column renderCell wins over the cellContent slot; the slot wins over the default value", () => {
		const renderColumns: DataTableColumn<RowType>[] = [
			{ label: "ID", dataKey: "id", renderCell: ({ value }) => <strong>CELL:{value}</strong> },
			{ label: "Name", dataKey: "name" }
		];

		const { container } = render(
			<DataTable data={data} columns={renderColumns} slots={{ cellContent: EmphasizedCellContent }} />
		);

		const firstRowCells = getAllByDataRole(container, DataRoles.Table.Body.Row)[0].querySelectorAll("td");
		expect(firstRowCells[0]).toHaveTextContent("CELL:1");
		expect(firstRowCells[1]).toHaveTextContent("SLOT:Alpha");
	});

	test("column renderHeader replaces the header label and keeps sorting", async () => {
		const onSort = vi.fn();
		const renderColumns: DataTableColumn<RowType>[] = [
			{
				label: "ID",
				dataKey: "id",
				sortable: true,
				renderHeader: ({ label, sortOrder }) => <span>{`H:${String(label)}:${sortOrder ?? "none"}`}</span>
			},
			{ label: "Name", dataKey: "name" }
		];

		const { container } = render(
			<DataTable
				data={data}
				columns={renderColumns}
				sortOptions={{ sortState: [{ columnId: "id", order: "asc" }], onSort }}
			/>
		);

		const headCells = getAllByDataRole(container, DataRoles.Table.Header.Cell);
		expect(headCells[0]).toHaveTextContent("H:ID:asc");

		await userEvent.click(headCells[0]);
		expect(onSort).toHaveBeenCalledWith([{ columnId: "id", order: "desc" }], { columnId: "id", order: "desc" });
	});

	test("column renderFooter activates the footer and renders into the column's foot cell", () => {
		const renderColumns: DataTableColumn<RowType>[] = [
			{ label: "ID", dataKey: "id", renderFooter: () => <span>Sum: 6</span> },
			{ label: "Name", dataKey: "name" }
		];

		const { container } = render(<DataTable data={data} columns={renderColumns} />);

		const foot = container.querySelector("tfoot");
		expect(foot).not.toBeNull();
		expect(foot).toHaveTextContent("Sum: 6");
	});

	test("column renderFilter activates the filter row and renders into the column's filter cell", () => {
		const renderColumns: DataTableColumn<RowType>[] = [
			{ label: "ID", dataKey: "id", renderFilter: () => <input aria-label="Filter ID" /> },
			{ label: "Name", dataKey: "name" }
		];

		const { container } = render(<DataTable data={data} columns={renderColumns} />);

		expect(getByDataRole(container, DataRoles.Table.Filter.Row)).not.toBeNull();
		expect(container.querySelector('input[aria-label="Filter ID"]')).not.toBeNull();
	});

	test("hideHeader renders no <thead> and excludes the header from aria numbering", () => {
		const { container } = render(
			<DataTable data={data} columns={columns} hideHeader maxHeight={200} virtualScrollOptions={{ rowHeight: 30 }} />
		);

		expect(container.querySelector("thead")).toBeNull();

		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		expect(rows[0].getAttribute("aria-rowindex")).toBe("1");

		const table = container.querySelector("table");
		expect(table?.getAttribute("aria-rowcount")).toBe(String(data.length));
	});

	test("explicit undefined slot values fall back to the defaults instead of suppressing", () => {
		const { container } = render(
			<DataTable
				data={data}
				columns={columns}
				hasFootContent
				slots={{ head: undefined, foot: undefined, body: undefined }}
			/>
		);

		expect(container.querySelector("thead")).not.toBeNull();
		expect(container.querySelector("tbody")).not.toBeNull();
		expect(container.querySelector("tfoot")).not.toBeNull();
	});

	test("a slot rendering null suppresses its structural element", () => {
		function Nothing(): ReactNode {
			return null;
		}

		const { container } = render(
			<DataTable data={data} columns={columns} hasFootContent slots={{ head: Nothing, foot: Nothing }} />
		);

		expect(container.querySelector("thead")).toBeNull();
		expect(container.querySelector("tfoot")).toBeNull();
	});

	test("a stable slot component does not remount cells when data props change", () => {
		function CustomCell({ children }: DataTableSlotProps.Cell<RowType>): ReactElement {
			return <td data-custom-cell="true">{children}</td>;
		}

		const { container, rerender } = render(<DataTable data={data} columns={columns} slots={{ cell: CustomCell }} />);
		const cellBefore = container.querySelector('td[data-custom-cell="true"]');
		expect(cellBefore).not.toBeNull();

		rerender(<DataTable data={data} columns={columns} disabled={false} slots={{ cell: CustomCell }} />);
		const cellAfter = container.querySelector('td[data-custom-cell="true"]');
		expect(cellAfter).toBe(cellBefore);
	});

	test("rowExpansion renders expansion content and drives aria-expanded", () => {
		const { container } = render(
			<DataTable
				data={data}
				columns={columns}
				rowExpansion={{
					render: ({ row }) =>
						row.id === 2 ? (
							<DataTableTemplate.ExpandableRow>Expansion for {row.name}</DataTableTemplate.ExpandableRow>
						) : null,
					predicate: ({ row }) => row.id === 2
				}}
			/>
		);

		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		expect(rows[0].getAttribute("aria-expanded")).toBe("false");
		expect(rows[1].getAttribute("aria-expanded")).toBe("true");
		expect(container.querySelector("tbody")).toHaveTextContent("Expansion for Bravo");
	});
});

describe("com.mgmtp.a12.widgets.data-table — slot architecture: group head cells", () => {
	test("slots.headCell styles group cells too when no headCellGroup slot is given; a dedicated headCellGroup wins", () => {
		function SlotLeafHeadCell(props: DataTableSlotProps.HeadCell<RowType>): ReactElement {
			return (
				<th data-slot-leaf="true" colSpan={props.colSpan} rowSpan={props.rowSpan}>
					{props.defaultContent}
				</th>
			);
		}

		function SlotGroupHeadCell(props: DataTableSlotProps.HeadCell<RowType>): ReactElement {
			return (
				<th data-slot-group="true" colSpan={props.colSpan}>
					{props.defaultContent}
				</th>
			);
		}

		const groupColumns: BaseColumnType<RowType>[] = [
			{
				label: "Group",
				subColumns: [
					{ label: "ID", dataKey: "id" },
					{ label: "Name", dataKey: "name" }
				]
			}
		];

		// Leaf-only provision: the leaf slot covers group cells as fallback.
		const { container, rerender } = render(
			<DataTable data={data} columns={groupColumns} slots={{ headCell: SlotLeafHeadCell }} />
		);
		expect(container.querySelectorAll('[data-slot-leaf="true"]')).toHaveLength(3);

		// Dedicated group slot wins over the leaf fallback for group cells.
		rerender(
			<DataTable
				data={data}
				columns={groupColumns}
				slots={{ headCell: SlotLeafHeadCell, headCellGroup: SlotGroupHeadCell }}
			/>
		);
		expect(container.querySelectorAll('[data-slot-group="true"]')).toHaveLength(1);
		expect(container.querySelectorAll('[data-slot-leaf="true"]')).toHaveLength(2);
	});
});

describe("com.mgmtp.a12.widgets.data-table — Phase 5: body-cell colSpan", () => {
	interface SpanRow {
		id: number;
		a: string;
		b: string;
		c: string;
	}

	const spanData: SpanRow[] = [
		{ id: 1, a: "A1", b: "B1", c: "C1" },
		{ id: 2, a: "A2", b: "B2", c: "C2" }
	];

	const baseColumns: DataTableColumn<SpanRow>[] = [
		{ label: "A", dataKey: "a", width: 1 },
		{ label: "B", dataKey: "b", width: 1 },
		{ label: "C", dataKey: "c", width: 1 }
	];

	const rowCells = (container: HTMLElement, rowIndex: number): HTMLTableCellElement[] => {
		const row = getAllByDataRole(container, DataRoles.Table.Body.Row)[rowIndex];

		return getAllByDataRole(row, DataRoles.Table.Body.Cell) as HTMLTableCellElement[];
	};

	test("a column's cellSpan merges its cell rightward; covered columns emit no <td>", () => {
		const cols: DataTableColumn<SpanRow>[] = [
			{ ...baseColumns[0], cellSpan: () => ({ colSpan: 2 }) },
			baseColumns[1],
			baseColumns[2]
		];
		const { container } = render(<DataTable data={spanData} columns={cols} />);

		const cells = rowCells(container, 0);
		// 3 leaf columns, but the first cell spans 2 → only 2 <td> emitted.
		expect(cells).toHaveLength(2);
		expect(cells[0].colSpan).toBe(2);
		expect(cells[0].textContent).toContain("A1");
		// Second rendered cell is the un-merged "C" column.
		expect(cells[1].colSpan).toBe(1);
		expect(cells[1].textContent).toContain("C1");
	});

	test("cellSpan is resolved per row (DataTableCellRenderContext)", () => {
		const cols: DataTableColumn<SpanRow>[] = [
			{ ...baseColumns[0], cellSpan: ({ rowIndex }) => ({ colSpan: rowIndex === 0 ? 2 : 1 }) },
			baseColumns[1],
			baseColumns[2]
		];
		const { container } = render(<DataTable data={spanData} columns={cols} />);

		// Row 0 merges the first two columns; row 1 is a normal full-width row.
		expect(rowCells(container, 0)).toHaveLength(2);
		expect(rowCells(container, 0)[0].colSpan).toBe(2);
		expect(rowCells(container, 1)).toHaveLength(3);
		expect(rowCells(container, 1)[0].colSpan).toBe(1);
	});

	test("clamp (a): a span overrunning the row is capped at the remaining leaf columns", () => {
		const cols: DataTableColumn<SpanRow>[] = [
			baseColumns[0],
			baseColumns[1],
			{ ...baseColumns[2], cellSpan: () => ({ colSpan: 5 }) }
		];
		const { container } = render(<DataTable data={spanData} columns={cols} />);

		const cells = rowCells(container, 0);
		// Last column requested 5 but only 1 column remains → clamped to 1.
		expect(cells).toHaveLength(3);
		expect(cells[2].colSpan).toBe(1);
	});

	test("clamp (b): a span never crosses a pinning-side boundary", () => {
		const cols: DataTableColumn<SpanRow>[] = [
			{ ...baseColumns[0], pinning: "left", cellSpan: () => ({ colSpan: 2 }) },
			baseColumns[1],
			baseColumns[2]
		];
		const { container } = render(<DataTable data={spanData} columns={cols} />);

		const cells = rowCells(container, 0);
		// Left-pinned origin cannot merge into the unpinned "B" column → clamped to 1.
		expect(cells).toHaveLength(3);
		expect(cells[0].colSpan).toBe(1);
		expect(cells[0].getAttribute("data-pinned")).toBe("left");
	});

	test("clamp (b): a span across two columns pinned to the SAME side is allowed", () => {
		const cols: DataTableColumn<SpanRow>[] = [
			{ ...baseColumns[0], pinning: "left", cellSpan: () => ({ colSpan: 2 }) },
			{ ...baseColumns[1], pinning: "left" },
			baseColumns[2]
		];
		const { container } = render(<DataTable data={spanData} columns={cols} />);

		const cells = rowCells(container, 0);
		expect(cells).toHaveLength(2);
		expect(cells[0].colSpan).toBe(2);
	});

	test("clamp (c): invalid / non-merging spans render a normal cell with no colSpan attribute", () => {
		for (const requested of [0, 1, NaN, undefined] as const) {
			const cols: DataTableColumn<SpanRow>[] = [
				{ ...baseColumns[0], cellSpan: () => ({ colSpan: requested }) },
				baseColumns[1],
				baseColumns[2]
			];
			const { container, unmount } = render(<DataTable data={spanData} columns={cols} />);

			const cells = rowCells(container, 0);
			expect(cells).toHaveLength(3);
			// No native colSpan attribute is emitted for the single-column case.
			expect(cells[0].hasAttribute("colspan")).toBe(false);
			unmount();
		}
	});

	test("cellSpan is gated on disabled (no merging in a disabled table)", () => {
		const cols: DataTableColumn<SpanRow>[] = [
			{ ...baseColumns[0], cellSpan: () => ({ colSpan: 2 }) },
			baseColumns[1],
			baseColumns[2]
		];
		const { container } = render(<DataTable data={spanData} columns={cols} disabled />);

		expect(rowCells(container, 0)).toHaveLength(3);
	});

	test("a spanning cell still renders its renderCell content (precedence intact)", () => {
		const cols: DataTableColumn<SpanRow>[] = [
			{
				...baseColumns[0],
				cellSpan: () => ({ colSpan: 2 }),
				renderCell: ({ row }) => <span data-role="custom">custom-{row.id}</span>
			},
			baseColumns[1],
			baseColumns[2]
		];
		const { container } = render(<DataTable data={spanData} columns={cols} />);

		const cells = rowCells(container, 0);
		expect(cells[0].colSpan).toBe(2);
		expect(cells[0].querySelector('[data-role="custom"]')?.textContent).toBe("custom-1");
	});

	test("highlighting regression: a cell after a span resolves the correct leaf index via data-col-index", async () => {
		const cols: DataTableColumn<SpanRow>[] = [
			{ ...baseColumns[0], cellSpan: ({ rowIndex }) => ({ colSpan: rowIndex === 0 ? 2 : 1 }) },
			baseColumns[1],
			baseColumns[2]
		];
		const { container } = render(<DataTable data={spanData} columns={cols} cellHighlighting />);
		const table = container.querySelector("table") as HTMLTableElement;

		const cells = rowCells(container, 0);
		// Row 0 renders [A(span 2), C]; the "C" cell sits at native cellIndex 1 but its
		// true leaf index is 2 — it must carry data-col-index and highlight leaf 2.
		const cCell = cells[1];
		expect(cCell.cellIndex).toBe(1);
		expect(cCell.getAttribute("data-col-index")).toBe("2");

		await userEvent.hover(cCell);

		expect(table.dataset.highlightColLeaf).toBe("2");
	});

	test("colSpan flows through virtualized mode", () => {
		const cols: DataTableColumn<SpanRow>[] = [
			{ ...baseColumns[0], cellSpan: () => ({ colSpan: 2 }) },
			baseColumns[1],
			baseColumns[2]
		];
		const { container } = render(
			<DataTable data={spanData} columns={cols} maxHeight={200} virtualScrollOptions={{ rowHeight: 30 }} />
		);

		const spanned = (getAllByDataRole(container, DataRoles.Table.Body.Cell) as HTMLTableCellElement[]).find(
			(c) => c.colSpan === 2
		);
		expect(spanned).toBeDefined();
	});

	test("row arrow-nav is not trapped by a spanning row", async () => {
		const cols: DataTableColumn<SpanRow>[] = [
			{ ...baseColumns[0], cellSpan: ({ rowIndex }) => ({ colSpan: rowIndex === 0 ? 2 : 1 }) },
			baseColumns[1],
			baseColumns[2]
		];
		const { container } = render(<DataTable data={spanData} columns={cols} />);

		const rows = getAllByDataRole(container, DataRoles.Table.Body.Row);
		// Row 0 carries a spanning cell; ArrowDown/ArrowUp must still cross it.
		(rows[0] as HTMLElement).focus();
		await userEvent.keyboard("{ArrowDown}");
		expect(document.activeElement).toBe(rows[1]);

		await userEvent.keyboard("{ArrowUp}");
		expect(document.activeElement).toBe(rows[0]);
	});
});
