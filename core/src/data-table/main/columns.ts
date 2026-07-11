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

import type { ReactNode } from "react";

import type { BaseColumnType } from "./foundation/column.api.js";
import { flattenAllColumns, isColumnGroup, getMaxColumnDepth } from "./foundation/utils.js";
import type { DataTableSortOrder } from "./data-table.sort.js";

/**
 * Context passed to a column's {@link DataTableColumn.renderCell}.
 *
 * @experimental
 */
export interface DataTableCellRenderContext<RowType = unknown> {
	row: RowType;
	rowIndex: number;
	column: DataTableColumn<RowType>;
	columnIndex: number;

	/** The cell value resolved from the column's `dataGetter`/`dataKey`. */
	value: ReactNode;
}

/**
 * Context passed to a column's {@link DataTableColumn.renderHeader}.
 *
 * @experimental
 */
export interface DataTableHeaderRenderContext<RowType = unknown> {
	column: DataTableColumn<RowType>;
	columnIndex: number;
	sortOrder: DataTableSortOrder;

	/** The column's `label`. */
	label: ReactNode;
}

/**
 * Context passed to a column's {@link DataTableColumn.renderFooter} /
 * {@link DataTableColumn.renderFilter}.
 *
 * @experimental
 */
export interface DataTableColumnRenderContext<RowType = unknown> {
	column: DataTableColumn<RowType>;
	columnIndex: number;
}

/**
 * DataTable column definition: {@link BaseColumnType} extended with
 * column-level presentation hooks. The column stays the natural unit for cell
 * customization — `dataKey`/`dataGetter` resolve the *data*, the `render*`
 * hooks own the *presentation*:
 *
 *  - cell content precedence: `renderCell` → `slots.cellContent` → resolved value,
 *  - header content precedence: `renderHeader` → `slots.headContent` → `label`,
 *  - providing `renderFooter` on any column activates the footer,
 *  - providing `renderFilter` on any column activates the header filter row.
 *
 * @experimental
 */
export interface DataTableColumn<RowType = unknown> extends BaseColumnType<RowType> {
	/**
	 * Stable identifier for this column, used to key sort state (and any future column-keyed state).
	 * When omitted it is derived from `dataKey`, then a string `label`. A `sortable` column must
	 * resolve to a unique id or DataTable throws — see `getColumnId`.
	 */
	id?: string;

	/** Renders the content of this column's body cells. */
	renderCell?: (context: DataTableCellRenderContext<RowType>) => ReactNode;

	/**
	 * Returns the horizontal span for this column's body cell in a given row.
	 * A `colSpan` greater than 1 merges this cell rightward over the following
	 * leaf columns — the covered columns emit no `<td>`. The span is clamped to
	 * the remaining leaf columns and to a single pinning side, so a cell never
	 * merges across a pinned/unpinned boundary. The object return shape is
	 * forward-compatible; `rowSpan` is intentionally out of scope.
	 */
	cellSpan?: (context: DataTableCellRenderContext<RowType>) => { colSpan?: number };

	/** Renders the content of this column's header cell. */
	renderHeader?: (context: DataTableHeaderRenderContext<RowType>) => ReactNode;

	/** Renders the content of this column's footer cell. Activates the footer. */
	renderFooter?: (context: DataTableColumnRenderContext<RowType>) => ReactNode;

	/** Renders the content of this column's filter cell. Activates the filter row. */
	renderFilter?: (context: DataTableColumnRenderContext<RowType>) => ReactNode;
}

type DataTableColumnRenderKey = "renderCell" | "renderHeader" | "renderFooter" | "renderFilter";

/**
 * Read a column-level render hook off a (possibly plain {@link BaseColumnType})
 * column. Returns `undefined` unless the hook is a function, so malformed
 * configs degrade to the default rendering.
 *
 * @internal
 */
export function getColumnRender<RowType, K extends DataTableColumnRenderKey>(
	column: BaseColumnType<RowType>,
	key: K
): NonNullable<DataTableColumn<RowType>[K]> | undefined {
	const candidate = (column as DataTableColumn<RowType>)[key];

	return typeof candidate === "function" ? (candidate as NonNullable<DataTableColumn<RowType>[K]>) : undefined;
}

/**
 * Read the {@link DataTableColumn.cellSpan} hook off a (possibly plain
 * {@link BaseColumnType}) column. Returns `undefined` unless the hook is a
 * function, so malformed configs degrade to plain 1-wide cells. Kept separate
 * from {@link getColumnRender} because `cellSpan` returns a span descriptor
 * rather than a `ReactNode`.
 *
 * @internal
 */
export function getColumnCellSpan<RowType>(
	column: BaseColumnType<RowType>
): NonNullable<DataTableColumn<RowType>["cellSpan"]> | undefined {
	const candidate = (column as DataTableColumn<RowType>).cellSpan;

	return typeof candidate === "function" ? candidate : undefined;
}

/**
 * One cell in the multi-row header grid.
 *
 * Coordinates are 1-based; cell templates convert them into native `colSpan` /
 * `rowSpan` on the rendered `<th>`. `headerRowStart`/`End` are `<thead>` row
 * indices (row 1 at the top); horizontal span comes from `leafFrom`/`leafTo`.
 *
 * @internal
 */
export interface DataTableHeaderCell<RowType> {
	column: BaseColumnType<RowType>;
	headerRowStart: number;
	headerRowEnd: number;
	leafFrom: number;
	leafTo: number;
	isLeaf: boolean;
	pinning?: "left" | "right";
}

/**
 * Build the multi-row header layout from a (possibly nested) column tree.
 *
 * Returns `{ maxDepth, leafColumns, cells }`, where `cells` has one entry per
 * visible header cell (group + leaf). Each cell carries 1-based grid coordinates
 * that the templates turn into native `colSpan` / `rowSpan`, plus the leaf-index
 * range it spans (for cross-axis cell highlighting and aria attributes).
 *
 * - Leaf cells span from their level down to the maximum depth (so they
 *   visually fill remaining levels) — equivalent to ARIA `rowspan`.
 * - Group cells span their leaf range horizontally — equivalent to ARIA `colspan`.
 *
 * @internal
 */
export function buildHeaderGrid<RowType>(columns: BaseColumnType<RowType>[]): {
	maxDepth: number;
	leafColumns: BaseColumnType<RowType>[];
	cells: DataTableHeaderCell<RowType>[];
} {
	const leafColumns = flattenAllColumns<RowType>(columns);
	const maxDepth = getMaxColumnDepth(columns);
	const cells: DataTableHeaderCell<RowType>[] = [];

	let leafCursor = 0;

	function visit(
		column: BaseColumnType<RowType>,
		level: number,
		inheritedPinning: "left" | "right" | undefined
	): { from: number; to: number } {
		const pinning = (column.pinning ?? inheritedPinning) as "left" | "right" | undefined;

		if (!isColumnGroup(column)) {
			const leafIndex = leafCursor;
			leafCursor += 1;
			cells.push({
				column,
				headerRowStart: level + 1,
				headerRowEnd: maxDepth + 1,
				leafFrom: leafIndex,
				leafTo: leafIndex,
				isLeaf: true,
				pinning
			});

			return { from: leafIndex, to: leafIndex };
		}

		let from = Number.POSITIVE_INFINITY;
		let to = Number.NEGATIVE_INFINITY;

		for (const child of column.subColumns) {
			const range = visit(child, level + 1, pinning);
			from = Math.min(from, range.from);
			to = Math.max(to, range.to);
		}

		cells.push({
			column,
			headerRowStart: level + 1,
			headerRowEnd: level + 2,
			leafFrom: from,
			leafTo: to,
			isLeaf: false,
			pinning
		});

		return { from, to };
	}

	for (const column of columns) {
		visit(column, 0, undefined);
	}

	return { maxDepth, leafColumns, cells };
}
