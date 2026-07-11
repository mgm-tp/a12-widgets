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

import { mapValues, times } from "lodash-es";

import type { BaseColumnType, Column } from "../../column.api.js";

import type { TableTemplateProps } from "../table.tpl.api.js";

export type HeaderCellWithPos<T = unknown> = {
	column: GridCell<T>;
	ariaHidden?: boolean;
	isFirstColumnCell?: boolean;
	isLastInGroup?: boolean;
	relativeGridRow?: number;
	relativeGridColumn?: number;
} & TableTemplateProps.GridRowDataProps;

export type Segment = {
	wrapperGrid: TableTemplateProps.GridRowDataProps;
	cellsWithRelativePositions: HeaderCellWithPos[];
} | null;

export type RowSegments = { left: Segment; scroll: Segment; right: Segment };
export type HeadGridLayout = {
	totalColumns: number;
	totalRows: number;
	columnWidths: number[];
	cumulativeWidths: number[];
	rows: RowSegments[];
};

const hasSubColumns = <T>(
	column: BaseColumnType<T> | undefined
): column is BaseColumnType<T> & { subColumns: NonNullable<BaseColumnType<T>["subColumns"]> } =>
	!!column?.subColumns?.length;

/** @internal */
export const getDistanceToFarthestLeaf = <T>(column: BaseColumnType<T>): number =>
	hasSubColumns(column) ? 1 + Math.max(...column.subColumns.map(getDistanceToFarthestLeaf)) : 0;

/** @internal */
export const getMaxColumnDepth = <T>(columns: BaseColumnType<T>[]) =>
	columns?.length ? Math.max(...columns.map((column) => 1 + getDistanceToFarthestLeaf(column))) : 1;

/** @internal */
export const getColumnSpan = <T>(column: BaseColumnType<T>): number =>
	column.subColumns && column.subColumns.length > 0
		? column.subColumns.reduce((sum, child) => sum + getColumnSpan(child), 0)
		: 1;

/** @internal */
export interface GridCell<T = unknown> extends BaseColumnType<T>, TableTemplateProps.GridRowDataProps {
	ariaHidden?: boolean;
}

type GridCellPosition = { row: number; column: number };

/** @internal */
export function flattenColumnsWithGridPosition<T>(columns: BaseColumnType<T>[]): GridCell<T>[][] {
	const maxDepth = getMaxColumnDepth(columns);
	const result: GridCell<T>[][] = times(maxDepth, () => []);
	let position: GridCellPosition = { row: 0, column: 0 };

	const processColumn = (params: {
		column: BaseColumnType<T>;
		position: GridCellPosition;
		inheritedPinning?: Column.Pinning;
	}): GridCellPosition => {
		const { column, position, inheritedPinning } = params;
		const pinning = column.pinning || inheritedPinning;

		const columnSpan = getColumnSpan(column);
		const rowSpan = hasSubColumns(column)
			? maxDepth - position.row - Math.max(...column.subColumns.map(getDistanceToFarthestLeaf)) - 1
			: maxDepth - position.row;

		for (let rowOffset = 0; rowOffset < rowSpan; rowOffset++) {
			for (let colOffset = 0; colOffset < columnSpan; colOffset++) {
				const isPrimaryCell = rowOffset === 0 && colOffset === 0;

				result[position.row + rowOffset].push({
					...column,
					pinning,
					gridRow: position.row + rowOffset,
					gridRowSpan: rowOffset > 0 ? 1 : rowSpan,
					gridColumn: position.column + colOffset,
					gridColumnSpan: isPrimaryCell ? columnSpan : 1,
					isHidden: !isPrimaryCell,
					ariaHidden: rowOffset > 0 ? true : undefined
				});
			}
		}

		const nextRowPosition = position.row + rowSpan;

		if (hasSubColumns(column)) {
			let nextPosition: GridCellPosition = { row: nextRowPosition, column: position.column };

			for (const childColumn of column.subColumns) {
				nextPosition = processColumn({
					column: childColumn,
					position: { row: nextRowPosition, column: nextPosition.column },
					inheritedPinning: pinning
				});
			}
		}

		return { row: nextRowPosition, column: position.column + columnSpan };
	};

	for (const column of columns) {
		position = processColumn({ column, position: { column: position.column, row: 0 } });
	}

	return result;
}

interface TableComponentsConfig {
	bodyCell: {
		width: number;
		firstMarginLeft: string;
	};
}

/** @internal */
export function calculateHeadGridLayout(
	columns: BaseColumnType[],
	tableComponents: TableComponentsConfig
): HeadGridLayout {
	const gridCells = flattenColumnsWithGridPosition(columns);
	const totalColumns = gridCells[0].length;

	const { width: defaultWidth, firstMarginLeft } = tableComponents.bodyCell;
	const firstColumnMargin = parseFloat(firstMarginLeft) || 0;

	const columnWidths = gridCells[gridCells.length - 1].map((column) => defaultWidth * (column.width ?? 1));

	const explicitColumnWidths = columnWidths.map((width, index) =>
		Math.round(index === 0 ? width + firstColumnMargin : width)
	);

	const cumulativeColumnWidths = [0];

	for (let columnIndex = 1; columnIndex <= totalColumns; columnIndex++) {
		const previousColumnIndex = columnIndex - 1;

		cumulativeColumnWidths[columnIndex] =
			cumulativeColumnWidths[previousColumnIndex] +
			(columnWidths[previousColumnIndex] || defaultWidth) +
			(previousColumnIndex === 0 ? firstColumnMargin : 0);
	}

	// Pre-compute the set of grid-column end positions that correspond to top-level column group
	// boundaries. A cell whose right edge aligns with one of these positions is the last cell in
	// its group and should receive a visual separator.
	const groupBoundaryEnds = new Set<number>();
	let groupOffset = 0;

	for (const col of columns) {
		groupOffset += getColumnSpan(col);
		groupBoundaryEnds.add(groupOffset);
	}

	const cellsByRow = gridCells.map((cells) => {
		return cells.map((column, columnIndex) => {
			const isHidden = !!(column.isHidden || column.ariaHidden);
			const cellEnd = column.gridColumn + column.gridColumnSpan;

			return {
				...column,
				column,
				isHidden,
				isFirstColumnCell: columnIndex === 0 && !isHidden,
				isLastInGroup: !isHidden && groupBoundaryEnds.has(cellEnd)
			};
		});
	});

	type Cell = GridCell & {
		column: GridCell;
		isHidden: boolean;
		isFirstColumnCell: boolean;
		isLastInGroup: boolean;
	};

	const createSegment = (segmentCells: Cell[]) => {
		if (!segmentCells.length) {
			return null;
		}

		const visibleCells = segmentCells.filter((cell) => !cell.isHidden);
		const boundsSource = visibleCells.length ? visibleCells : segmentCells;
		const [minRow, maxRow, minColumn, maxColumn] = [
			Math.min(...boundsSource.map((cell) => cell.gridRow)),
			Math.max(...boundsSource.map((cell) => cell.gridRow + cell.gridRowSpan - 1)),
			Math.min(...boundsSource.map((cell) => cell.gridColumn)),
			Math.max(...boundsSource.map((cell) => cell.gridColumn + cell.gridColumnSpan - 1))
		];

		return {
			wrapperGrid: {
				gridRow: minRow,
				gridColumn: minColumn,
				gridRowSpan: maxRow - minRow + 1,
				gridColumnSpan: maxColumn - minColumn + 1,
				isHidden: !visibleCells.length
			},
			cellsWithRelativePositions: segmentCells.map((cell) => ({
				...cell,
				relativeGridRow: cell.gridRow - minRow,
				relativeGridColumn: cell.gridColumn - minColumn
			}))
		};
	};

	const rows = cellsByRow.map((row) => {
		const cells: Record<TableTemplateProps.RowSegmentType, Cell[]> = { left: [], right: [], scroll: [] };

		for (const cell of row) {
			cells[cell.column.pinning || "scroll"].push(cell);
		}

		return mapValues(cells, createSegment);
	});

	return {
		totalColumns,
		totalRows: gridCells.length,
		columnWidths: explicitColumnWidths,
		cumulativeWidths: cumulativeColumnWidths,
		rows
	};
}
