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

import { get } from "lodash-es";
import type { ReactNode, Key, CSSProperties, MouseEvent } from "react";
import { useState, useCallback, useMemo } from "react";

import type { TableTemplateProps } from "./template/table.tpl.api.js";
import type { BaseColumnType, SortOrder } from "./column.api.js";
import type {
	FlatGroupHead,
	IdenticalRow,
	IdenticalRowsGroup,
	RowsGroup,
	TableRowsGroupRowType
} from "./table-rows-group/table-row-group.api.js";
import type { RowKeyGetter, RowSegments, SortState } from "./table.api.js";

export function getNextSorting<ColumnType extends BaseColumnType<any>>(
	triggerColumn: ColumnType,
	sortState?: SortState<ColumnType>
): SortOrder {
	const currentSortOrder = sortState?.column === triggerColumn ? sortState.order : undefined;
	const cycle: SortOrder[] = triggerColumn.sortDirections ? triggerColumn.sortDirections : [undefined, "asc", "desc"];

	const current = cycle.indexOf(currentSortOrder);

	if (current != -1) {
		const delta = 1;
		const next = (cycle.length + current + delta) % cycle.length;

		return cycle[next];
	} else {
		return cycle[0];
	}
}

export function getDataByKey<RowType>(row: RowType, key: string | number): ReactNode {
	return get(row, key);
}

export function getRowKey<RowType>(row: RowType, getter: string | number | RowKeyGetter<RowType>): Key {
	if (typeof getter !== "function") {
		return get(row, getter);
	} else {
		return getter({ row });
	}
}

export function getRowSegments<ColumnType extends BaseColumnType<any>>(columns: ColumnType[]): RowSegments<ColumnType> {
	const result: RowSegments<ColumnType> = { left: [], scroll: [], right: [] };
	columns.forEach((column) => {
		if (column.pinning === "left") {
			result.left.push(column);
		} else if (column.pinning === "right") {
			result.right.push(column);
		} else {
			result.scroll.push(column);
		}
	});

	return result;
}

/**
 * Flatten nested columns
 */
export function flattenAllColumns<
	RowType = unknown,
	ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
>(columns: ColumnType[]): ColumnType[] {
	const result: ColumnType[] = [];
	columns.forEach((col) => {
		if (!col.subColumns || col.subColumns.length === 0) {
			result.push(col);
		} else if (col.subColumns.length > 0) {
			result.push(...flattenAllColumns<RowType, ColumnType>(col.subColumns as ColumnType[]));
		}
	});

	return result;
}

/**
 * Check whether a column has sub columns.
 */
export function isColumnGroup<RowType>(column: BaseColumnType<RowType>): boolean {
	return !!(column.subColumns && column.subColumns.length > 0);
}

/**
 * Check whether a table has column group.
 */
export function hasColumnGroup<RowType>(columns: BaseColumnType<RowType>[]): boolean {
	return columns.some((column) => isColumnGroup(column));
}

/**
 * Counts the number of action columns within a given set of columns.
 * An action column is defined as a column that has the `actionColumn` property set
 * and does not have a specified width.
 */
export function countActionColumns<RowType>(columns: BaseColumnType<RowType>[]): number {
	return columns.reduce((sum, column) => {
		if (column.subColumns?.length) {
			return sum + countActionColumns(column.subColumns);
		} else if (column.actionColumn && !column.width) {
			return sum + 1;
		}

		return sum;
	}, 0);
}

export function isRowGroup<RowType>(row: RowType | RowsGroup<RowType>): row is RowsGroup<RowType> {
	return typeof row === "object" && row && "subRows" in row;
}

export function isGroupHead<RowType>(data: RowType | FlatGroupHead): data is FlatGroupHead {
	return typeof data === "object" && data && "head" in data;
}

export function isIdenticalRow<RowType>(data: RowType | IdenticalRow<RowType>): data is IdenticalRow<RowType> {
	return typeof data === "object" && data && "parent" in data;
}

export function identifyRowsGroup<RowType>(data: RowsGroup<RowType>[]): IdenticalRowsGroup<RowType>[] {
	const result: IdenticalRowsGroup<RowType>[] = [];
	data.forEach((group) => {
		const head = group.head;
		const identifiedSubRows: IdenticalRow<RowType>[] = [];
		group.subRows.forEach((row) => {
			identifiedSubRows.push({
				parent: head,
				data: row
			});
		});
		result.push({ ...group, head, subRows: identifiedSubRows });
	});

	return result;
}

/**
 * Flatten rows group for the table that flat rows only like virtualized
 */
export function flattenRowsGroup<RowType>(data: IdenticalRowsGroup<RowType>[]): TableRowsGroupRowType<RowType>[] {
	const result: TableRowsGroupRowType<RowType>[] = [];
	data.forEach((value) => {
		if (value) {
			if (value.head) {
				result.push({ head: value.head });
			}

			!value.collapsed && result.push(...value.subRows);
		}
	});

	return result;
}

/** @internal */
export namespace TableInternalUtils {
	export function getFirstSubColumn(column: BaseColumnType): BaseColumnType | undefined {
		if (!column.subColumns || column.subColumns.length === 0) {
			return undefined;
		}

		const firstSubColumn = column.subColumns[0];

		return getFirstSubColumn(firstSubColumn) || firstSubColumn;
	}

	export function getLastSubColumn(column: BaseColumnType): BaseColumnType | undefined {
		if (!column.subColumns || column.subColumns.length === 0) {
			return undefined;
		}

		const lastSubColumn = column.subColumns[column.subColumns.length - 1];

		return getLastSubColumn(lastSubColumn) || lastSubColumn;
	}

	export function getColumnIndex(column: BaseColumnType, columns: BaseColumnType[]): number {
		return columns.findIndex((col) => col === column);
	}

	export function isIntermediateColumn(column: BaseColumnType, propsColumns: BaseColumnType[]): boolean {
		return (
			isColumnGroup(column) &&
			propsColumns.findIndex((col) => col === column) < 0 &&
			flattenAllColumns(propsColumns).findIndex((col) => col === column) < 0
		);
	}

	export function isLastColumnOfArea(
		column: BaseColumnType,
		propsColumns: BaseColumnType[],
		area: TableTemplateProps.RowSegmentType
	): boolean {
		const flattenColumns = flattenAllColumns(getRowSegments(propsColumns)[area]);
		const colIndex = getColumnIndex(column, flattenColumns);

		return colIndex > -1 && colIndex === flattenColumns.length - 1;
	}

	export function isFirstColumnOfArea(
		column: BaseColumnType,
		propsColumns: BaseColumnType[],
		area: TableTemplateProps.RowSegmentType
	): boolean {
		const flattenColumns = flattenAllColumns(getRowSegments(propsColumns)[area]);
		const colIndex = getColumnIndex(column, flattenColumns);

		return colIndex === 0;
	}

	export function isRightOfActionColumn(column: BaseColumnType, propsColumns: BaseColumnType[]): boolean {
		const { left, scroll, right } = getRowSegments(propsColumns);
		const flattenColumns = flattenAllColumns([...left, ...scroll, ...right]);
		const colIndex = getColumnIndex(column, flattenColumns);

		return colIndex > 0 && !!flattenColumns[colIndex - 1].actionColumn;
	}

	export function getAllLeafColumns(column: BaseColumnType): BaseColumnType[] {
		const results: BaseColumnType[] = [];

		if (!column.subColumns) {
			results.push(column);
		} else {
			column.subColumns.forEach((col) => results.push(...getAllLeafColumns(col)));
		}

		return results;
	}

	export function calculateParentColumnFlexAttributes(
		column: BaseColumnType,
		propsColumns: BaseColumnType[],
		isResizable = false
	): CSSProperties | undefined {
		if (isResizable) {
			// If table resizable, last column of scroll area has flex: 1,
			// Other columns have fixed width.
			const checkedCol = getLastSubColumn(column) ?? column;

			return isLastColumnOfArea(checkedCol, propsColumns, "scroll") ? { flex: 1 } : { flexGrow: 0, flexShrink: 0 };
		}

		if (!isColumnGroup(column)) {
			return undefined;
		}

		// If the sum of all columns >= 10, no need to set flex-attribute
		if (flattenAllColumns(propsColumns).reduce((sum, { width }) => sum + (width ?? 1), 0) >= 10) {
			return undefined;
		}

		const subColumns = getAllLeafColumns(column);
		const flexValue = subColumns.reduce((sum, col) => (col.fixedWidth ? sum : sum + (col.width ?? 1)), 0);

		return { flexGrow: flexValue * 10, flexShrink: flexValue };
	}

	export function splitVirtualizedStyles(styles: CSSProperties): {
		virtualizedStyles: CSSProperties;
		nonVirtualizedStyles: CSSProperties;
	} {
		const VIRTUALIZED_STYLE_KEYS = ["position", "left", "top", "height", "width"];

		const virtualizedStyles: Record<string, unknown> = {};
		const nonVirtualizedStyles: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(styles)) {
			if (VIRTUALIZED_STYLE_KEYS.includes(key)) {
				virtualizedStyles[key] = value;
			} else {
				nonVirtualizedStyles[key] = value;
			}
		}

		return { virtualizedStyles, nonVirtualizedStyles };
	}

	export function useContextMenu() {
		const [contextMenuPosition, setContextMenuPosition] = useState<TableTemplateProps.ContextMenuPosition>();
		const [contextMenuOpen, setContextMenuOpen] = useState<boolean>(false);

		const onContextMenu = useCallback(
			(event: MouseEvent<HTMLElement>) => {
				if (!contextMenuOpen) {
					event.preventDefault();
					const { clientX, clientY } = event;
					setContextMenuPosition({ top: clientY, left: clientX });
					setContextMenuOpen(true);
				}
			},
			[contextMenuOpen]
		);

		const closeContextMenuPortal = useCallback(() => {
			setContextMenuOpen(false);
		}, []);

		return useMemo(() => {
			return { contextMenuPosition, contextMenuOpen, closeContextMenuPortal, onContextMenu };
		}, [closeContextMenuPortal, contextMenuOpen, contextMenuPosition, onContextMenu]);
	}

	export function crosstabulationColumnRefactor<ColumnType extends BaseColumnType<any>>(column: ColumnType) {
		return column.verticalHeader ? { ...column, pinning: "left" } : column;
	}

	export function isFixedWidthColumn(props: {
		column: BaseColumnType;
		columns: BaseColumnType[];
		resizable?: boolean;
		fixedWidthProp?: boolean;
	}): boolean {
		const { column, columns, resizable, fixedWidthProp } = props;

		if (resizable) {
			return !TableInternalUtils.isLastColumnOfArea(column, columns, "scroll") && !column.actionColumn;
		}

		return fixedWidthProp || ((column.fixedWidth || !!column.pinning) && !column.actionColumn);
	}

	export const isInteractiveElement = (event: MouseEvent<HTMLElement>): boolean => {
		const targetElement = event.target as HTMLElement;
		// Find the closest interactive element
		const interactiveElement = targetElement.closest(
			"button, [role='button'], input[type='checkbox'], [role='checkbox']"
		);

		return interactiveElement !== null && !interactiveElement.hasAttribute("disabled");
	};
}
