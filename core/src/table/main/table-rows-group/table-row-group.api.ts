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

import type { Identifiable, Styleable } from "../../../common/main/base-props.js";

import type { TableTemplateProps } from "../template/table.tpl.api.js";
import type { BaseColumnType } from "../column.api.js";
import type { BaseTableProps } from "../table.api.js";

export interface BaseRowsGroup extends Styleable, Identifiable, TableTemplateProps.TableDataAttribute {
	/**
	 * Aria-role of element.
	 *
	 * - If set a string value, use passed value.
	 * - If set false, no role attribute.
	 * - If set true/undefined, use default value.
	 *
	 * @default value of each element:
	 * - RowGroup: "rowgroup"
	 * - RowGroupHeader: "row"
	 */
	role?: boolean | string;
}

export interface TableRowsGroupProps<
	RowType = unknown,
	ColumnType extends BaseColumnType<TableRowsGroupRowType<RowType>> = BaseColumnType<TableRowsGroupRowType<RowType>>
> extends Omit<BaseTableProps<TableRowsGroupRowType<RowType>, ColumnType>, "data"> {
	/**
	 * This data will be transferred to {@link IdenticalRowsGroup} that would be used for all handlers and component renderers.
	 */
	data?: RowsGroup<RowType>[];
}

export interface RowsGroup<RowType = unknown> extends BaseRowsGroup {
	/**
	 * The header of Row Group.
	 */
	head?: RowsGroupHead;

	/**
	 * 	Array of rows that should be grouped.
	 */
	subRows: RowType[];

	/**
	 * Specifies whether the sub rows are displayed.
	 */
	collapsed?: boolean;
}

/**
 * Rows Group Head after being flattened would be a normal row.
 */
export interface FlatGroupHead {
	head: RowsGroupHead;
}

export interface RowsGroupHead extends BaseRowsGroup {
	title: ReactNode;
}

/**
 * Like {@link RowsGroup} but with identical group that {@link subRows} belongs to.
 */
export interface IdenticalRowsGroup<RowType = unknown> extends BaseRowsGroup {
	head?: RowsGroupHead;

	subRows: IdenticalRow<RowType>[];

	collapsed?: boolean;
}

export interface IdenticalRow<RowType = unknown> {
	parent?: RowsGroupHead;
	data: RowType;
}

/**
 * A row could be something that is defined by users, a rows group, or just a group head.
 */
export type TableRowsGroupRowType<RowType = unknown> =
	| IdenticalRow<RowType>
	| FlatGroupHead
	| IdenticalRowsGroup<RowType>;

export type BaseTableRowsGroupColumnType<RowType = unknown> = BaseColumnType<TableRowsGroupRowType<RowType>>;
