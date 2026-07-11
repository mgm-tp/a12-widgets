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

import { memo, useMemo } from "react";
import { useTheme } from "styled-components";

import { TableTemplate } from "../main/template/index.js";
import { StyledTableHeadGridCellWrapper } from "../main/template/table-head-grid/table.head-grid-cell-wrapper.tpl.view.js";
import type { TableTemplateProps } from "../main/template/table.tpl.api.js";

import type { TableRenderPropsType } from "./table-renderer.api.js";
import { useTableContext } from "./table.context.js";
import { calculateHeadGridLayout } from "./template/table-head-grid/table-head-grid.utils.js";
import type { HeaderCellWithPos, RowSegments } from "./template/table-head-grid/table-head-grid.utils.js";

/** @internal */
export const HeadGridRow = memo(function HeadGridRow(_props: TableRenderPropsType.HeadRowProps) {
	const columns = useTableContext((context) => context.columns);
	const headCellRenderer = useTableContext((context) => context.componentRenderers.headCellRenderer);
	const { components } = useTheme();

	const layout = useMemo(() => calculateHeadGridLayout(columns, components.table), [columns, components.table]);

	const { totalColumns, totalRows, columnWidths, cumulativeWidths, rows: layoutRows } = layout;

	return (
		<TableTemplate.HeadGrid columnWidths={columnWidths} totalRows={totalRows}>
			{layoutRows.map((rowSegments: RowSegments, rowIndex: number) => {
				const renderSegment = (type: TableTemplateProps.RowSegmentType) => {
					const segment = rowSegments[type];

					if (!segment) {
						return null;
					}

					const {
						wrapperGrid: { gridColumn, gridColumnSpan, gridRow, gridRowSpan, isHidden },
						cellsWithRelativePositions
					} = segment;

					// Calculate leftOffset based on cumulative widths of columns before this segment
					const leftOffset = type === "left" && gridColumn > 0 ? cumulativeWidths[gridColumn] : undefined;

					// Calculate rightOffset based on cumulative widths of columns after this segment
					const columnEndIndex = gridColumn + gridColumnSpan;
					const rightOffset =
						type === "right" && columnEndIndex < totalColumns
							? cumulativeWidths[totalColumns] - cumulativeWidths[columnEndIndex]
							: undefined;

					return (
						<TableTemplate.HeadRowSegment
							type={type}
							key={type}
							gridRowData={{
								gridRow: gridRow + 1,
								gridColumn: gridColumn + 1,
								gridRowSpan: gridRowSpan,
								gridColumnSpan: gridColumnSpan,
								isHidden: isHidden,
								leftOffset,
								rightOffset
							}}
						>
							{cellsWithRelativePositions.map((cell: HeaderCellWithPos, cellIndex: number) => (
								<StyledTableHeadGridCellWrapper
									key={`${type}-${cellIndex}`}
									$gridRow={(cell.relativeGridRow ?? 0) + 1}
									$gridColumn={(cell.relativeGridColumn ?? 0) + 1}
									$gridRowSpan={cell.gridRowSpan}
									$gridColumnSpan={cell.gridColumnSpan}
									$isHidden={cell.isHidden}
									$isSubColumn={rowIndex > 0}
									$isLastInGroup={cell.isLastInGroup}
								>
									{headCellRenderer({
										column: cell.column,
										ariaRowSpan: cell.gridRowSpan > 1 ? cell.gridRowSpan : undefined,
										ariaColSpan: cell.gridColumnSpan > 1 ? cell.gridColumnSpan : undefined,
										ariaColIndex: cell.column.gridColumn + 1,
										scope: cell.gridColumnSpan > 1 ? "colgroup" : undefined,
										ariaHidden: cell.column.ariaHidden
									})}
								</StyledTableHeadGridCellWrapper>
							))}
						</TableTemplate.HeadRowSegment>
					);
				};

				return (
					<TableTemplate.HeadGridRow key={rowIndex} ariaRowIndex={rowIndex + 1}>
						{renderSegment("left")}
						{renderSegment("scroll")}
						{renderSegment("right")}
					</TableTemplate.HeadGridRow>
				);
			})}
		</TableTemplate.HeadGrid>
	);
});

HeadGridRow.displayName = "HeadGridRow";
