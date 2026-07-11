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

import { StyledDataTableBodyCell, DataTableBodyCellTpl } from "./data-table.body-cell.tpl.view.js";
import { StyledDataTableBodyRow, DataTableBodyRowTpl } from "./data-table.body-row.tpl.view.js";
import { DataTableBodyTpl } from "./data-table.body.tpl.view.js";
import { DataTableContextMenuTpl } from "./data-table.context-menu.tpl.view.js";
import {
	StyledDataTableExpandableRowBody,
	DataTableExpandableRowBodyTpl
} from "./data-table.expandable-row-body.tpl.view.js";
import {
	StyledDataTableExpandableRowFooter,
	DataTableExpandableRowFooterTpl
} from "./data-table.expandable-row-footer.tpl.view.js";
import { StyledDataTableExpandableRow, DataTableExpandableRowTpl } from "./data-table.expandable-row.tpl.view.js";
import { StyledDataTableFootCell, DataTableFootCellTpl } from "./data-table.foot-cell.tpl.view.js";
import { StyledDataTableFootRow, DataTableFootRowTpl } from "./data-table.foot-row.tpl.view.js";
import { DataTableFootTpl } from "./data-table.foot.tpl.view.js";
import { StyledDataTableHeadCell, DataTableHeadCellTpl } from "./data-table.head-cell.tpl.view.js";
import { StyledDataTableHeadFilterCell, DataTableHeadFilterCellTpl } from "./data-table.head-filter-cell.tpl.view.js";
import { StyledDataTableHeadFilterRow, DataTableHeadFilterRowTpl } from "./data-table.head-filter-row.tpl.view.js";
import { StyledDataTableHeadGroupRow, DataTableHeadGroupRowTpl } from "./data-table.head-group-row.tpl.view.js";
import { StyledDataTableHeadRow, DataTableHeadRowTpl } from "./data-table.head-row.tpl.view.js";
import { DataTableHeadTpl } from "./data-table.head.tpl.view.js";
import { StyledDataTablePlaceholderCell, DataTablePlaceholderCellTpl } from "./data-table.placeholder-cell.tpl.view.js";
import {
	StyledDataTablePlaceholderContent,
	DataTablePlaceholderContentTpl
} from "./data-table.placeholder-content.tpl.view.js";
import { StyledDataTablePlaceholderRow, DataTablePlaceholderRowTpl } from "./data-table.placeholder-row.tpl.view.js";
import { StyledDataTableResizeHandle, DataTableResizeHandleTpl } from "./data-table.resize-handle.tpl.view.js";
import { StyledDataTable, StyledDataTableViewport, DataTableTpl } from "./data-table.tpl.view.js";
import {
	StyledDataTableVerticalHeaderCell,
	DataTableVerticalHeaderCellTpl
} from "./data-table.vertical-header-cell.tpl.view.js";

/**
 * Composable layout primitives that make up the rendered output of
 * {@link DataTable}. Mirrors the `TableTemplate` namespace so a
 * `TableTemplate.X` -> `DataTableTemplate.X` codemod is feasible for the common
 * subset.
 *
 * Templates are layout-only — cross-cutting orchestration stays in `DataTable`.
 *
 * @experimental
 */

export namespace DataTableTemplate {
	export const Table = DataTableTpl;
	export const Head = DataTableHeadTpl;
	export const HeadRow = DataTableHeadRowTpl;
	export const HeadGroupRow = DataTableHeadGroupRowTpl;
	export const HeadCell = DataTableHeadCellTpl;
	export const HeadFilterRow = DataTableHeadFilterRowTpl;
	export const HeadFilterCell = DataTableHeadFilterCellTpl;
	export const Body = DataTableBodyTpl;
	export const BodyRow = DataTableBodyRowTpl;
	export const BodyCell = DataTableBodyCellTpl;
	export const VerticalHeaderCell = DataTableVerticalHeaderCellTpl;
	export const ExpandableRow = DataTableExpandableRowTpl;
	export const ExpandableRowBody = DataTableExpandableRowBodyTpl;
	export const ExpandableRowFooter = DataTableExpandableRowFooterTpl;
	export const PlaceholderRow = DataTablePlaceholderRowTpl;
	export const PlaceholderCell = DataTablePlaceholderCellTpl;
	export const PlaceholderContent = DataTablePlaceholderContentTpl;
	export const Foot = DataTableFootTpl;
	export const FootRow = DataTableFootRowTpl;
	export const FootCell = DataTableFootCellTpl;
	export const ResizeHandle = DataTableResizeHandleTpl;
	export const ContextMenu = DataTableContextMenuTpl;
}

/**
 * Raw styled-components backing {@link DataTableTemplate}.
 *
 * @experimental
 */

export namespace StyledDataTableTemplate {
	export const StyledViewport = StyledDataTableViewport;
	export const StyledTable = StyledDataTable;
	export const StyledHeadRow = StyledDataTableHeadRow;
	export const StyledHeadGroupRow = StyledDataTableHeadGroupRow;
	export const StyledHeadCell = StyledDataTableHeadCell;
	export const StyledHeadFilterRow = StyledDataTableHeadFilterRow;
	export const StyledHeadFilterCell = StyledDataTableHeadFilterCell;
	export const StyledBodyRow = StyledDataTableBodyRow;
	export const StyledBodyCell = StyledDataTableBodyCell;
	export const StyledVerticalHeaderCell = StyledDataTableVerticalHeaderCell;
	export const StyledExpandableRow = StyledDataTableExpandableRow;
	export const StyledExpandableRowBody = StyledDataTableExpandableRowBody;
	export const StyledExpandableRowFooter = StyledDataTableExpandableRowFooter;
	export const StyledPlaceholderRow = StyledDataTablePlaceholderRow;
	export const StyledPlaceholderCell = StyledDataTablePlaceholderCell;
	export const StyledPlaceholderContent = StyledDataTablePlaceholderContent;
	export const StyledFootRow = StyledDataTableFootRow;
	export const StyledFootCell = StyledDataTableFootCell;
	export const StyledResizeHandle = StyledDataTableResizeHandle;
}

export * from "./data-table.body-cell.tpl.view.js";
export * from "./data-table.body-row.tpl.view.js";
export * from "./data-table.body.tpl.view.js";
export * from "./data-table.context-menu.tpl.view.js";
export * from "./data-table.expandable-row-body.tpl.view.js";
export * from "./data-table.expandable-row-footer.tpl.view.js";
export * from "./data-table.expandable-row.tpl.view.js";
export * from "./data-table.foot-cell.tpl.view.js";
export * from "./data-table.foot-row.tpl.view.js";
export * from "./data-table.foot.tpl.view.js";
export * from "./data-table.head-cell.tpl.view.js";
export * from "./data-table.head-filter-cell.tpl.view.js";
export * from "./data-table.head-filter-row.tpl.view.js";
export * from "./data-table.head-group-row.tpl.view.js";
export * from "./data-table.head-row.tpl.view.js";
export * from "./data-table.head.tpl.view.js";
export * from "./data-table.placeholder-cell.tpl.view.js";
export * from "./data-table.placeholder-content.tpl.view.js";
export * from "./data-table.placeholder-row.tpl.view.js";
export * from "./data-table.resize-handle.tpl.view.js";
export * from "./data-table.tpl.view.js";
export * from "./data-table.vertical-header-cell.tpl.view.js";
