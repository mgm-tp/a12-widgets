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

import type { HTMLAttributes as ReactHTMLAttributes, Key, ReactNode } from "react";

import type { BaseColumnType } from "./foundation/column.api.js";
import type { RowKeyGetter } from "./foundation/table.api.js";
import { getDataByKey } from "./foundation/utils.js";
import type { DataTableSortOrder } from "./data-table.sort.js";

/**
 * Multiplier applied to `column.width` for fixed-width columns to convert it to pixels.
 *
 * @internal
 */
export const FIXED_WIDTH_BASE_PX = 150;

/**
 * Pixel fallback for a width-less column that cannot flex: an `actionColumn` (holds
 * buttons, so no flex intent), or a `fixedWidth` column declared without a `width`.
 */
const FALLBACK_COLUMN_WIDTH_PX = 150;

/**
 * Whether a column carries a usable positive `width`. These are the columns
 * {@link getColumnWidths} wraps in `var(--a12-col-N-width, …)` when resizing is
 * enabled, and the ones the resize hook can freeze to px.
 */
export function hasUsableWidth<RowType>(column: BaseColumnType<RowType>): boolean {
	return typeof column.width === "number" && column.width > 0;
}

/**
 * Whether a width-less column should be treated as flexible with the documented
 * `width: 1` default ({@link BaseColumnType#width} is `@default 1.0`): a `150px` floor
 * that grows to share surplus space, rather than being pinned to an absolute px width.
 *
 * `actionColumn` and `fixedWidth` columns are never flex fallbacks — action columns
 * keep their px fallback and `fixedWidth` columns are absolute.
 */
function isFlexFallback<RowType>(column: BaseColumnType<RowType>): boolean {
	return !hasUsableWidth(column) && !column.fixedWidth && !column.actionColumn;
}

/**
 * Render a flexible column's proportional share as a `<col>` width. With absolute
 * columns present the share is `calc((100% - <fixedPx>px) * ratio)` (collapsing to
 * `calc(100% - <fixedPx>px)` for a sole flex column); otherwise a plain percentage.
 */
function flexShare(ratio: number, totalFixedPx: number): string {
	if (totalFixedPx > 0) {
		// Omit the `* 1` factor for a sole flex column — browsers normalize
		// `calc((100% - Npx) * 1)` to `calc(100% - Npx)` anyway.
		return ratio === 1 ? `calc(100% - ${totalFixedPx}px)` : `calc((100% - ${totalFixedPx}px) * ${ratio})`;
	}

	return `${ratio * 100}%`;
}

/**
 * Sum the flex units of every flexible column. A non-`fixedWidth` column with a
 * usable `width` contributes that width; a width-less flex-fallback column
 * (see {@link isFlexFallback}) contributes the default `1`. Used to normalize
 * flexible columns into proportional shares of the leftover space.
 */
function sumFlexUnits<RowType>(columns: readonly BaseColumnType<RowType>[]): number {
	let total = 0;

	for (const column of columns) {
		if (!column.fixedWidth && hasUsableWidth(column)) {
			total += column.width as number;
		} else if (isFlexFallback(column)) {
			total += 1;
		}
	}

	return total;
}

/**
 * Total the pixel width of every absolute-width column: `fixedWidth` columns
 * (`width * 150`) plus width-less columns that take a px fallback rather than
 * flexing — `actionColumn`s. Flex-fallback columns ({@link isFlexFallback}) are
 * excluded; they reserve a proportional share instead. Flexible columns reserve
 * `100% - this` and split it by ratio, so absolute and proportional columns coexist
 * without the percentages over-constraining the table (which collapses the last
 * column to 0).
 */
function sumFixedPx<RowType>(columns: readonly BaseColumnType<RowType>[]): number {
	let total = 0;

	for (const column of columns) {
		if (!hasUsableWidth(column)) {
			if (!isFlexFallback(column)) {
				total += FALLBACK_COLUMN_WIDTH_PX;
			}
		} else if (column.fixedWidth) {
			total += (column.width as number) * FIXED_WIDTH_BASE_PX;
		}
	}

	return total;
}

/**
 * Resolve a single column to a `<col>` width value for the native
 * `table-layout: fixed` algorithm.
 *
 * - `fixedWidth`, `width:N` → `${N * 150}px` (absolute)
 * - flexible `width:N`      → proportional share of the space left after the absolute
 *   columns: `calc((100% - <totalFixedPx>px) * ratio)` (or plain `${ratio * 100}%` when
 *   there are no absolute columns). Preserves the former `fr` ratio intent without the
 *   percentages summing past 100% and starving the last column.
 * - width-less flex-fallback column ({@link isFlexFallback}) → the same proportional
 *   share with the documented default `width: 1`.
 * - other width-less columns (`actionColumn`, or a `fixedWidth` column without a
 *   `width`) → a `150px` fallback. Under `fixed` layout there is no `max-content`
 *   auto-size for such a column mixed with proportional columns.
 */
export function getColumnWidth<RowType>(
	column: BaseColumnType<RowType>,
	totalFlexUnits: number,
	totalFixedPx: number
): string {
	if (!hasUsableWidth(column)) {
		if (isFlexFallback(column)) {
			const ratio = totalFlexUnits > 0 ? 1 / totalFlexUnits : 1;

			return flexShare(ratio, totalFixedPx);
		}

		return `${FALLBACK_COLUMN_WIDTH_PX}px`;
	}

	const width = column.width as number;

	if (column.fixedWidth) {
		return `${width * FIXED_WIDTH_BASE_PX}px`;
	}

	const ratio = totalFlexUnits > 0 ? width / totalFlexUnits : 1;

	return flexShare(ratio, totalFixedPx);
}

/**
 * Compose the `<col>` width for every leaf column, in column order.
 *
 * When `resizable` is set, every column's width is wrapped in
 * `var(--a12-col-N-width, <computed>)` so the resize drag can override it live by
 * writing the `--a12-col-N-width` custom property on the `<table>` root (px). With
 * `table-layout: fixed`, the px override is honored over the computed default; with
 * no override the `<col>` resolves to the computed width as before. Width-less
 * columns (flex-fallback, `actionColumn`) are wrapped too — every leaf column is
 * resizable — so their computed fallback acts as the var default and a drag can
 * still pin them to px.
 */
export function getColumnWidths<RowType>(columns: readonly BaseColumnType<RowType>[], resizable: boolean): string[] {
	const totalFlexUnits = sumFlexUnits(columns);
	const totalFixedPx = sumFixedPx(columns);

	return columns.map((column, index) => {
		const computed = getColumnWidth(column, totalFlexUnits, totalFixedPx);

		if (resizable) {
			return `var(--a12-col-${index}-width, ${computed})`;
		}

		return computed;
	});
}

/**
 * Minimum table width, in pixels — the sum of every column's pixel floor, applied as
 * `min-width` on the `<table>`. `width` (×150) acts as a per-column minimum: columns
 * grow to fill surplus space but never shrink below their floor, so once the floors
 * sum past the viewport the table overflows and a horizontal scrollbar appears (which
 * is what makes pinned columns meaningful).
 *
 * The `<col>` widths from {@link getColumnWidths} are proportional, so on their own the
 * table can never exceed `width: 100%` and never scrolls; this `min-width` reintroduces
 * the floor. At exactly this width each proportional column resolves to its own floor,
 * so the two models agree.
 *
 * A computed px value (not `min-width: max-content`) is used deliberately —
 * `max-content` with the percentage `<col>` widths degenerates the table width (it
 * balloons to ~500000px).
 *
 * Floors by category (mirrors {@link getColumnWidth}): `fixedWidth` and width-less
 * px-fallback columns contribute their absolute px ({@link sumFixedPx}); flexible
 * columns — including flex-fallback columns at their default `width: 1` — contribute
 * `width × 150` ({@link sumFlexUnits} × base).
 */
export function getMinTableWidth<RowType>(columns: readonly BaseColumnType<RowType>[]): number {
	return sumFixedPx(columns) + sumFlexUnits(columns) * FIXED_WIDTH_BASE_PX;
}

/**
 * Map a {@link DataTableSortOrder} to its `aria-sort` attribute value.
 */
export function toAriaSort(order: DataTableSortOrder): "ascending" | "descending" | "none" {
	if (order === "asc") {
		return "ascending";
	}

	if (order === "desc") {
		return "descending";
	}

	return "none";
}

/**
 * Default text alignment for header cells when a column specifies none.
 */
export const DEFAULT_HEAD_ALIGNMENT = { horizontal: "left" as const, vertical: "middle" as const };

/**
 * Default text alignment for body cells when a column specifies none.
 */
export const DEFAULT_BODY_ALIGNMENT = { horizontal: "left" as const, vertical: "top" as const };

/**
 * Keys that the framework owns and the consumer must not override via `column.htmlAttributes`.
 *
 * Only framework-owned attributes are denied — the orchestrator computes these from
 * sort/selection/column-position state (and internal hooks query `data-col-index`), so
 * consumer values would be overwritten or conflict. Other `aria-*` keys (e.g.
 * `aria-describedby`, `aria-haspopup`) are legitimate and pass through.
 */
export const RESERVED_HTML_ATTRIBUTE_KEYS = new Set([
	"data-role",
	"role",
	"scope",
	"aria-sort",
	"data-col-index",
	"aria-rowindex",
	"aria-selected",
	"aria-disabled",
	"aria-expanded"
]);

/**
 * Resolve a cell's content from its column's `dataGetter`/`dataKey`.
 */
export function getCellContent<RowType>(column: BaseColumnType<RowType>, row: RowType, rowIndex: number): ReactNode {
	if (column.dataGetter) {
		return column.dataGetter({ rowIndex, row });
	}

	if (column.dataKey !== undefined) {
		return getDataByKey(row, column.dataKey);
	}

	return "";
}

/**
 * Resolve the stable React key for a row from the `rowKey` prop, falling back to
 * the row index when no usable key can be derived.
 */
export function rowKeyFor<RowType>(
	row: RowType,
	rowIndex: number,
	rowKey: keyof RowType | (string & {}) | number | RowKeyGetter<RowType> | undefined
): Key {
	if (typeof rowKey === "function") {
		return rowKey({ row, rowIndex });
	}

	if (typeof rowKey === "string" || typeof rowKey === "number") {
		const value = (row as Record<string | number, unknown>)[rowKey as string | number];

		if (typeof value === "string" || typeof value === "number" || typeof value === "bigint") {
			return value;
		}
	}

	return rowIndex;
}

/**
 * Strip framework-owned attribute keys from `column.htmlAttributes` before spreading
 * onto a `<th>`/`<td>`. Only the keys in {@link RESERVED_HTML_ATTRIBUTE_KEYS} (including
 * the framework-owned `aria-*` attributes) are dropped silently; other `aria-*` keys such
 * as `aria-describedby` or `aria-haspopup` pass through.
 */
export function safeHtmlAttributes<T extends HTMLElement>(
	htmlAttributes: ReactHTMLAttributes<T> | undefined
): ReactHTMLAttributes<T> {
	if (!htmlAttributes) {
		return {};
	}

	const safe: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(htmlAttributes)) {
		if (RESERVED_HTML_ATTRIBUTE_KEYS.has(key)) {
			continue;
		}

		safe[key] = value;
	}

	return safe as ReactHTMLAttributes<T>;
}
