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

export * from "./main/index.js";
export {
	type BaseColumnType,
	type BaseRowsGroup,
	type BaseTableProps,
	type BaseTableRowsGroupColumnType,
	type CellStyleGetter,
	type CellStyles,
	type Column,
	type ColumnResizeEventHandler,
	type ColumnResizingOptions,
	type DataGetter,
	DefaultFilterHeadComponentRenderers,
	DefaultTableComponentRenderers,
	DefaultTableRowsGroupComponentRenderers,
	DnDTable,
	type FlatGroupHead,
	type IdenticalRow,
	type IdenticalRowsGroup,
	type InfiniteScrollOptions,
	type InfiniteScrollTableProps,
	type RowEventHandlerGetter,
	type RowEventHandlers,
	type RowKeyGetter,
	type RowLoadingStatus,
	type RowSegments,
	type RowStyleGetter,
	type RowStyles,
	type RowsGroup,
	type RowsGroupHead,
	type SortOptions,
	type SortOrder,
	type SortState,
	StyledTableBodyCellGroup,
	StyledTableDnDBody,
	StyledTableDnDBodyHint,
	StyledTableDnDDragPreview,
	StyledTableVirtualizedBody,
	Table,
	type TableComponentRenderers,
	TableContextProvider,
	type TableContextType,
	type TableDragDropOptions,
	type TableProps,
	type TableRenderPropsType,
	TableRowsGroup,
	type TableRowsGroupProps,
	type TableRowsGroupRowType,
	type VirtualScrollOptions,
	type TableScrollToNodeHandler,
	countActionColumns,
	flattenAllColumns,
	flattenRowsGroup,
	getDataByKey,
	getNextSorting,
	getRowKey,
	getRowSegments,
	hasColumnGroup,
	identifyRowsGroup,
	isColumnGroup,
	isGroupHead,
	isIdenticalRow,
	isRowGroup,
	useTableContext
} from "./new-api/index.js";
