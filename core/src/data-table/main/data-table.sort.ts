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

/**
 * Sort direction. `undefined` denotes the unsorted position in a cycle / lookup.
 *
 * DataTable-owned copy of the legacy `SortOrder` so DataTable no longer imports sort types from
 * the (to-be-removed) production `Table`.
 *
 * @experimental
 */
export type DataTableSortOrder = "asc" | "desc" | undefined;

/**
 * One active sort. Absence from {@link DataTableSortState} means the column is unsorted, so
 * `order` is never `undefined` here.
 *
 * @experimental
 */
export interface DataTableColumnSort {
	/** The stable column id (see {@link getColumnId}). */
	columnId: string;
	order: Exclude<DataTableSortOrder, undefined>;
}

/**
 * The full sort state. The array order is the sort priority — index `0` is the primary sort,
 * index `1` the secondary, etc. (mirrors TanStack `SortingState`).
 *
 * @experimental
 */
export type DataTableSortState = DataTableColumnSort[];

/**
 * Sort configuration for `<DataTable>`. Fully controlled: the consumer owns {@link sortState} and
 * updates it from {@link onSort}.
 *
 * @experimental
 */
export interface DataTableSortOptions {
	/** Controlled sort state. */
	sortState?: DataTableSortState;

	/**
	 * Fired when a sortable header is activated. `next` is the fully-computed next state (the
	 * TanStack `onSortingChange` analog — assign it straight to your state); `toggled` reports the
	 * column the user acted on and its resulting order (`undefined` once cycled back to unsorted).
	 */
	onSort?(next: DataTableSortState, toggled: { columnId: string; order: DataTableSortOrder }): void;

	/**
	 * Allow more than one column to be sorted at once. Default `false` (single-column sort). When
	 * enabled, a {@link isMultiSortEvent} (shift-click by default) appends/updates instead of
	 * replacing.
	 */
	enableMultiSort?: boolean;

	/** Cap on simultaneously-sorted columns when {@link enableMultiSort} is on. Default: unbounded. */
	maxMultiSortColCount?: number;

	/**
	 * Decide whether an activation event should multi-sort (append) rather than replace. Only
	 * consulted when {@link enableMultiSort} is `true`. Default: `event.shiftKey`.
	 */
	isMultiSortEvent?(event: { shiftKey?: boolean }): boolean;
}

/**
 * Minimal column shape the sort engine reads. Kept local so this module imports nothing from the
 * production `Table` (supports its eventual removal). Structurally satisfied by `DataTableColumn`
 * and `BaseColumnType`.
 *
 * @internal
 */
export interface DataTableSortColumn {
	id?: string;
	dataKey?: number | string;
	label?: ReactNode;
	sortable?: boolean;
	sortDirections?: DataTableSortOrder[];
}

/**
 * Resolve a column's stable sort id, mirroring TanStack's precedence:
 * explicit `id` → `dataKey` → string `label`. Returns `undefined` when none can be derived (a
 * non-string `label` cannot serve as an id).
 *
 * @internal
 */
export function getColumnId(column: DataTableSortColumn): string | undefined {
	if (column.id !== undefined) {
		return column.id;
	}

	if (column.dataKey !== undefined) {
		return String(column.dataKey);
	}

	return typeof column.label === "string" ? column.label : undefined;
}

/**
 * Validate that every **sortable leaf** column has a resolvable, unique id. Throws (TanStack-style)
 * on a contract violation so the misconfiguration surfaces eagerly rather than as a silently dead
 * sort indicator. Non-sortable columns are ignored.
 *
 * @internal
 */
export function assertSortableColumnIds(leafColumns: DataTableSortColumn[]): void {
	const missing: string[] = [];
	const seen = new Map<string, number>();

	leafColumns.forEach((column, index) => {
		if (!column.sortable) {
			return;
		}

		const id = getColumnId(column);

		if (id === undefined) {
			const hint = typeof column.label === "string" ? `"${column.label}"` : `index ${index}`;
			missing.push(hint);

			return;
		}

		seen.set(id, (seen.get(id) ?? 0) + 1);
	});

	const errors: string[] = [];

	if (missing.length > 0) {
		errors.push(
			`sortable column(s) without a stable id (${missing.join(", ")}) — set \`id\`, \`dataKey\`, or a string \`label\``
		);
	}

	const duplicates = [...seen.entries()].filter(([, count]) => count > 1).map(([id]) => `\`${id}\``);

	if (duplicates.length > 0) {
		errors.push(`duplicate sortable column id(s): ${duplicates.join(", ")} — ids must be unique`);
	}

	if (errors.length > 0) {
		throw new Error(`DataTable sorting: ${errors.join("; ")}.`);
	}
}

/**
 * The order a given column is currently sorted in, or `undefined` if unsorted.
 *
 * @internal
 */
export function getColumnSortOrder(
	columnId: string | undefined,
	sortState: DataTableSortState | undefined
): DataTableSortOrder {
	if (columnId === undefined || !sortState) {
		return undefined;
	}

	return sortState.find((entry) => entry.columnId === columnId)?.order;
}

/**
 * The column's position in the multi-sort priority order, or `-1` if unsorted. Useful for a
 * priority badge.
 *
 * @internal
 */
export function getColumnSortIndex(columnId: string | undefined, sortState: DataTableSortState | undefined): number {
	if (columnId === undefined || !sortState) {
		return -1;
	}

	return sortState.findIndex((entry) => entry.columnId === columnId);
}

const DEFAULT_SORT_CYCLE: DataTableSortOrder[] = [undefined, "asc", "desc"];

/**
 * Compute the next {@link DataTableSortState} when `columnId` is activated. Honours the column's
 * `sortDirections` cycle (default `undefined → asc → desc`). In single mode the result replaces any
 * prior sort; in multi mode the column's entry is updated in place (or appended, respecting
 * `maxMultiSortColCount` — appends past the cap are ignored), and cycling back to unsorted removes
 * it.
 *
 * @internal
 */
export function getNextSortState(
	column: DataTableSortColumn,
	columnId: string,
	current: DataTableSortState,
	options: { isMulti?: boolean; maxMultiSortColCount?: number } = {}
): { next: DataTableSortState; order: DataTableSortOrder } {
	const cycle = column.sortDirections && column.sortDirections.length > 0 ? column.sortDirections : DEFAULT_SORT_CYCLE;
	const currentOrder = getColumnSortOrder(columnId, current);
	const cycleIndex = cycle.indexOf(currentOrder);
	const order = cycleIndex !== -1 ? cycle[(cycleIndex + 1) % cycle.length] : cycle[0];

	if (!options.isMulti) {
		return { next: order === undefined ? [] : [{ columnId, order }], order };
	}

	const isExisting = current.some((entry) => entry.columnId === columnId);

	if (order === undefined) {
		return { next: current.filter((entry) => entry.columnId !== columnId), order };
	}

	if (!isExisting && options.maxMultiSortColCount !== undefined && current.length >= options.maxMultiSortColCount) {
		// At the multi-sort cap and this is a new column — ignore the append (chosen policy).
		return { next: current, order: currentOrder };
	}

	const next = isExisting
		? current.map((entry) => (entry.columnId === columnId ? { columnId, order } : entry))
		: [...current, { columnId, order }];

	return { next, order };
}
