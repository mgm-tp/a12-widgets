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

import { BodyCellTpl, StyledTableBodyCell } from "./table.body-cell.tpl.view.js";
import { BodyRowSegmentTpl, StyledTableBodyRowSegment } from "./table.body-row-segment.tpl.view.js";
import { BodyRowTpl, StyledTableBodyRow } from "./table.body-row.tpl.view.js";
import { BodyTpl, StyledTableBody } from "./table.body.tpl.view.js";
import {
	ExpandableBodyRowWrapperTpl,
	StyledTableExpandableWrapper
} from "./table.expandable-body-row-wrapper.tpl.view.js";
import { ExpandableRowBodyTpl, StyledTableExpandableRowBody } from "./table.expandable-row-body.tpl.view.js";
import { ExpandableRowFooterTpl } from "./table.expandable-row-footer.tpl.view.js";
import { ExpandableRowTpl } from "./table.expandable-row.tpl.view.js";
import { FootCellTpl, StyledTableFootCell } from "./table.foot-cell.tpl.view.js";
import { FootRowSegmentTpl, StyledTableFootRowSegment } from "./table.foot-row-segment.tpl.view.js";
import { FootRowTpl, StyledTableFootRow } from "./table.foot-row.tpl.view.js";
import { FootTpl, StyledTableFoot } from "./table.foot.tpl.view.js";
import { HeadCellGroupTpl, StyledTableHeadCellGroup } from "./table.head-cell-group.tpl.view.js";
import { HeadCellTpl, StyledTableHeadCell } from "./table.head-cell.tpl.view.js";
import { HeadFilterRowTpl, StyledTableHeadFilterRow } from "./table.head-filter-row.tpl.view.js";
import { HeadRowSegmentTpl, StyledTableHeadRowSegment } from "./table.head-row-segment.tpl.view.js";
import { HeadRowTpl, StyledTableHeadRow } from "./table.head-row.tpl.view.js";
import { HeadTpl, StyledTableHead } from "./table.head.tpl.view.js";
import { RowGroupHeaderTpl, StyledTableRowGroupHeader } from "./table.row-group-header.tpl.view.js";
import { RowGroupTpl, StyledTableRowGroup } from "./table.row-group.tpl.view.js";
import { ContextMenuTpl } from "./table.context-menu.tpl.view.js";
import { StyledTableTpl, TableTpl } from "./table.tpl.view.js";

export namespace TableTemplate {
	export const RowGroup = RowGroupTpl;

	export const RowGroupHeader = RowGroupHeaderTpl;

	export const Head = HeadTpl;

	export const HeadRow = HeadRowTpl;

	export const HeadFilterRow = HeadFilterRowTpl;

	export const HeadRowSegment = HeadRowSegmentTpl;

	export const HeadCell = HeadCellTpl;

	export const HeadCellGroup = HeadCellGroupTpl;

	export const BodyRowSegment = BodyRowSegmentTpl;

	export const BodyRow = BodyRowTpl;

	export const Body = BodyTpl;

	export const BodyCell = BodyCellTpl;

	export const Foot = FootTpl;

	export const FootRow = FootRowTpl;

	export const FootRowSegment = FootRowSegmentTpl;

	export const FootCell = FootCellTpl;

	export const ExpandableBodyRowWrapper = ExpandableBodyRowWrapperTpl;

	export const ExpandableRow = ExpandableRowTpl;

	export const ExpandableRowBody = ExpandableRowBodyTpl;

	export const ExpandableRowFooter = ExpandableRowFooterTpl;

	export const ContextMenu = ContextMenuTpl;

	export const Table = TableTpl;
}

export namespace StyledTableTemplate {
	export const StyledRowGroup = StyledTableRowGroup;
	export const StyledRowGroupHeader = StyledTableRowGroupHeader;

	export const StyledHead = StyledTableHead;
	export const StyledHeadRow = StyledTableHeadRow;
	export const StyledHeadFilterRow = StyledTableHeadFilterRow;
	export const StyledHeadRowSegment = StyledTableHeadRowSegment;
	export const StyledHeadCell = StyledTableHeadCell;
	export const StyledHeadCellGroup = StyledTableHeadCellGroup;

	export const StyledBody = StyledTableBody;
	export const StyledBodyCell = StyledTableBodyCell;
	export const StyledBodyRow = StyledTableBodyRow;
	export const StyledBodyRowSegment = StyledTableBodyRowSegment;

	export const StyledFoot = StyledTableFoot;
	export const StyledFootRow = StyledTableFootRow;
	export const StyledFootRowSegment = StyledTableFootRowSegment;

	export const StyledFootCell = StyledTableFootCell;

	export const StyledExpandableBodyRowWrapper = StyledTableExpandableWrapper;
	export const StyledExpandableRowBody = StyledTableExpandableRowBody;

	export const StyledTable = StyledTableTpl;
}

export * from "./table.body-cell.tpl.view.js";
export * from "./table.body-row-segment.tpl.view.js";
export * from "./table.body-row.tpl.view.js";
export * from "./table.body.tpl.view.js";
export * from "./table.collapsing-wrapper.tpl.view.js";
export * from "./table.context-menu.tpl.view.js";
export * from "./table.context.styled.js";
export * from "./table.expandable-body-row-wrapper.tpl.view.js";
export * from "./table.expandable-row-body.tpl.view.js";
export * from "./table.expandable-row-footer.tpl.view.js";
export * from "./table.expandable-row.tpl.view.js";
export * from "./table.foot-cell.tpl.view.js";
export * from "./table.foot-row-segment.tpl.view.js";
export * from "./table.foot-row.tpl.view.js";
export * from "./table.foot.tpl.view.js";
export * from "./table.head-cell-group.tpl.view.js";
export * from "./table.head-cell.tpl.view.js";
export * from "./table.head-filter-row.tpl.view.js";
export * from "./table.head-row-segment.tpl.view.js";
export * from "./table.head-row.tpl.view.js";
export * from "./table.head.tpl.view.js";
export * from "./table.row-group-header.tpl.view.js";
export * from "./table.row-group.tpl.view.js";
export * from "./table.styled.js";
export * from "./table.tpl.api.js";
export { useRowScrollManager } from "./table.tpl.utils.js";
export * from "./table.tpl.view.js";
