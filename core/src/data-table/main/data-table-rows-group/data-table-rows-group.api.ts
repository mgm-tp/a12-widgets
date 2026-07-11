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

import type { BaseColumnType } from "../foundation/column.api.js";
import type { RowsGroup } from "../foundation/table-row-group.api.js";
import type { BaseDataTableProps } from "../data-table.api.js";

/**
 * Props for the {@link DataTableRowsGroup} component.
 *
 * Extends {@link DataTableProps} with grouped data support. Instead of flat
 * `data: RowType[]`, accepts `data: RowsGroup<RowType>[]` where each group has
 * a collapsible header and a list of sub-rows.
 *
 * Collapse/expand state is controlled by the consumer via the `collapsed` flag
 * on each {@link RowsGroup}. When a group header is clicked, the
 * `onGroupHeaderClick` callback fires so the consumer can toggle the state.
 *
 * `virtualScrollOptions`, `infiniteScrollOptions` and `dragDropOptions` are
 * **not supported** and are excluded from the API.
 *
 * @experimental
 */
export interface DataTableRowsGroupProps<
	RowType = unknown,
	ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
> extends Omit<
	BaseDataTableProps<RowType, ColumnType>,
	"data" | "virtualScrollOptions" | "infiniteScrollOptions" | "dragDropOptions"
> {
	/**
	 * Grouped row data. Each entry has an optional `head` (rendered as a
	 * collapsible group-header row spanning all columns) and `subRows`
	 * (the data rows within the group).
	 */
	data: RowsGroup<RowType>[];

	/**
	 * Called when a group header row is clicked. The consumer is responsible
	 * for toggling `group.collapsed` in response and re-rendering.
	 */
	onGroupHeaderClick?: (params: { group: RowsGroup<RowType>; groupIndex: number }) => void;
}
