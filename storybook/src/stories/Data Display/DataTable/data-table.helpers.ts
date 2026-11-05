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

import { useCallback, useMemo, useState } from "react";

import type { RowEventHandlerGetter } from "@com.mgmtp.a12.widgets/widgets-core";
import type {
	DataTableColumn,
	DataTableColumnResizeEventHandler,
	DataTableDragDropOptions,
	DataTableRowLoadingStatus,
	DataTableRowStyleGetter,
	DataTableSortOptions,
	DataTableSortState
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";

/**
 * Shared wiring for the DataTable stories. Each hook packages one recurring consumer
 * pattern so a story shows only the prop it is about.
 */

/**
 * Single-row toggle selection: `rowEventHandlers` captures the click, `rowStyling` marks the
 * selected row. Pass `multi` to select any number of rows.
 */
export function useRowSelection<Row>(
	getKey: (row: Row) => string | number,
	options?: { multi?: boolean; initial?: Array<string | number> }
): {
	selected: Set<string | number>;
	rowEventHandlers: RowEventHandlerGetter<Row>;
	rowStyling: DataTableRowStyleGetter<Row>;
} {
	const multi = options?.multi ?? false;
	const [selected, setSelected] = useState<Set<string | number>>(() => new Set(options?.initial ?? []));

	const rowEventHandlers: RowEventHandlerGetter<Row> = useCallback(
		({ row }) => ({
			onClick: () =>
				setSelected((prev) => {
					const key = getKey(row);
					const next = new Set(multi ? prev : []);

					if (prev.has(key)) {
						next.delete(key);
					} else {
						next.add(key);
					}

					return next;
				})
		}),
		[getKey, multi]
	);

	const rowStyling: DataTableRowStyleGetter<Row> = useCallback(
		({ row }) => {
			const isSelected = selected.has(getKey(row));

			return { selected: isSelected, title: isSelected ? "Selected" : "Select row" };
		},
		[selected, getKey]
	);

	return { selected, rowEventHandlers, rowStyling };
}

/** Sort `data` by the first entry of a controlled `DataTableSortState` (column id = row key). */
export function sortRows<Row>(data: Row[], sortState: DataTableSortState): Row[] {
	const active = sortState[0];

	if (!active?.order) {
		return data;
	}

	const key = active.columnId as keyof Row;
	const direction = active.order === "asc" ? 1 : -1;

	return [...data].sort((a, b) => (a[key] < b[key] ? -direction : a[key] > b[key] ? direction : 0));
}

/** Controlled sorting: returns the sorted rows plus the `sortOptions` prop to pass through. */
export function useSortedRows<Row>(data: Row[]): { rows: Row[]; sortOptions: DataTableSortOptions } {
	const [sortState, setSortState] = useState<DataTableSortState>([]);
	const rows = useMemo(() => sortRows(data, sortState), [data, sortState]);
	const sortOptions = useMemo<DataTableSortOptions>(
		() => ({ sortState, onSort: (next) => setSortState(next) }),
		[sortState]
	);

	return { rows, sortOptions };
}

/** Persist widths reported by `columnResizingOptions.onEndResize` back into the column definitions. */
export function useResizableColumns<Row>(initial: DataTableColumn<Row>[]): {
	columns: DataTableColumn<Row>[];
	onEndResize: DataTableColumnResizeEventHandler<DataTableColumn<Row>>;
} {
	const [columns, setColumns] = useState(initial);

	const onEndResize: DataTableColumnResizeEventHandler<DataTableColumn<Row>> = useCallback(
		({ resizedWidthsGetter }) => {
			if (!resizedWidthsGetter) {
				return;
			}

			setColumns((prev) => prev.map((column) => updateColumnWidths(column, resizedWidthsGetter)));
		},
		[]
	);

	return { columns, onEndResize };
}

function updateColumnWidths<Row>(
	column: DataTableColumn<Row>,
	resizedWidthsGetter: (column: DataTableColumn<Row>) => number | undefined
): DataTableColumn<Row> {
	const newWidth = resizedWidthsGetter(column);

	if (newWidth !== undefined) {
		return { ...column, width: newWidth };
	}

	if (column.subColumns) {
		return {
			...column,
			subColumns: column.subColumns.map((subColumn) => updateColumnWidths(subColumn, resizedWidthsGetter))
		};
	}

	return column;
}

/** Simulated batched fetch for `infiniteScrollOptions`: rows resolve after `latencyMs`. */
export function useInfiniteScrollData<Row>(
	allRows: Row[],
	latencyMs: number
): {
	data: Row[];
	rowLoadingStatus: (index: number) => DataTableRowLoadingStatus | undefined;
	loadData: (range: { startIndex: number; stopIndex: number }) => Promise<void>;
} {
	const [data, setData] = useState<(Row | undefined)[]>(() => new Array(allRows.length).fill(undefined));
	const [statusMap, setStatusMap] = useState<Record<number, DataTableRowLoadingStatus>>({});

	const setRange = useCallback((start: number, stop: number, status: DataTableRowLoadingStatus) => {
		setStatusMap((prev) => {
			const next = { ...prev };

			for (let i = start; i <= stop; i++) {
				next[i] = status;
			}

			return next;
		});
	}, []);

	const loadData = useCallback(
		({ startIndex, stopIndex }: { startIndex: number; stopIndex: number }) => {
			const stop = Math.min(stopIndex, allRows.length - 1);

			setRange(startIndex, stop, "loading");

			return new Promise<void>((resolve) =>
				setTimeout(() => {
					setData((prev) => {
						const next = [...prev];

						for (let i = startIndex; i <= stop; i++) {
							next[i] = allRows[i];
						}

						return next;
					});
					setRange(startIndex, stop, "loaded");
					resolve();
				}, latencyMs)
			);
		},
		[allRows, latencyMs, setRange]
	);

	const rowLoadingStatus = useCallback((index: number) => statusMap[index], [statusMap]);

	return { data: data as Row[], rowLoadingStatus, loadData };
}

/** Reorderable rows: the `onDrop` handler for `dragDropOptions` moves the dragged row in state. */
export function useReorderableRows<Row>(initial: Row[]): {
	data: Row[];
	onDrop: NonNullable<DataTableDragDropOptions<Row>["onDrop"]>;
} {
	const [data, setData] = useState(initial);

	const onDrop: NonNullable<DataTableDragDropOptions<Row>["onDrop"]> = useCallback(({ dragItem, dropResult }) => {
		setData((prev) => {
			const next = [...prev];
			const [moved] = next.splice(dragItem.rowIndex, 1);
			const targetIndex = dragItem.rowIndex < dropResult.rowIndex ? dropResult.rowIndex - 1 : dropResult.rowIndex;

			next.splice(targetIndex, 0, moved);

			return next;
		});
	}, []);

	return { data, onDrop };
}

// oxlint applies the Storybook rule set to every file in storybook/; this keeps `storybook/default-exports` quiet.
export default {};
