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

import type { HTMLAttributes } from "../../common/main/base-props.js";

export namespace Column {
	/**
	 * Type of pinning.
	 */
	export type Pinning = "left" | "right";

	/**
	 * The width. Any positive number up to 01 decimal place.
	 */
	export type Width = number;

	/**
	 * Available alignments.
	 */
	export type HorizontalAlignment = "left" | "center" | "right";
	export type VerticalAlignment = "top" | "bottom" | "middle";
}

export type SortOrder = "asc" | "desc" | undefined;

/**
 * If specified, this function will be called for each cell, returning value to be rendered at that cell
 */
export type DataGetter<RowType> = (params: { rowIndex: number; row: RowType }) => ReactNode;

/**
 * Base definition of a Table column.
 */
export interface BaseColumnType<RowType = unknown> extends HTMLAttributes {
	/**
	 * Label displayed in the table head.
	 */
	label: ReactNode;

	/**
	 * Whether the column is sortable.
	 *
	 * *Note:* This prop has no effect on the column group which contains {@link subColumns}.
	 */
	sortable?: boolean;

	/**
	 * Whether the column is in the left, center, or right area of the table.
	 * Typically, the left and right area is pinned.
	 */
	pinning?: Column.Pinning;

	/**
	 * Common horizontal alignment of the column. For column group, this prop has no effect on its sub-columns but only itself.
	 * @default center for Group Column
	 * @default left for the others
	 */
	horizontalAlignment?: Column.HorizontalAlignment;

	/**
	 * Override common `horizontalAlignment`. If specified, each part of the table can receive different alignment setting.
	 *
	 * *Note:*
	 * - For column group: only {@link specificHorizontalAlignment.head} will be applied, the others will be ignored.
	 * - For single column: all properties below will be applied.
	 */
	specificHorizontalAlignment?: {
		head?: Column.HorizontalAlignment;
		body?: Column.HorizontalAlignment;
		foot?: Column.HorizontalAlignment;
	};

	/**
	 * Common vertical alignment of the whole column. For column group, this prop has no effect on its sub-columns but only itself.
	 * @default middle for Header
	 * @default top for Body
	 */
	verticalAlignment?: Column.VerticalAlignment;

	/**
	 * Override common `verticalAlignment`. If specified, each part of the table can receive different alignment setting.
	 *
	 * *Note:*
	 * - For column group: only {@link specificVerticalAlignment.head} will be applied, the others will be ignored.
	 * - For single column: all properties below will be applied.
	 */
	specificVerticalAlignment?: {
		head?: Column.VerticalAlignment;
		body?: Column.VerticalAlignment;
		foot?: Column.VerticalAlignment;
	};

	/**
	 * The width scale of the column.
	 * @default 1.0
	 *
	 * *Note:* This prop has no effect when the column contains {@link subColumns}.
	 */
	width?: Column.Width;

	/**
	 * Set if column has fixed width.
	 *
	 * - If set to true, column width will be calculated by {@link width}*150.
	 * - Otherwise, the column will have relative width with the width of table.
	 *
	 * @default depends on specific cases
	 * - `false` for normal column
	 * - `true` if {@link pinning} is set.
	 * - fixedWidth has no effect on column's width if {@link actionColumn} is set to true.
	 */
	fixedWidth?: boolean;

	/**
	 * Indicates that a column is holding action buttons.
	 * If this is set to true, the width will be automatically calculated unless a {@link width} is defined.
	 */
	actionColumn?: boolean;

	/**
	 * A sub-info column will have different background containing not so important information.
	 */
	subInfo?: boolean;

	/**
	 * A string or index number pointing to where the data is in the Row object.
	 * For example, you can specify "firstName", and table will read "firstName" field value from row object instead of using index as default behavior.
	 * The field value is result of `lodash.get` function, see {@link https://lodash.com/docs/4.17.15#get}
	 */
	dataKey?: number | string;

	/**
	 * See {@link DataGetter}.
	 */
	dataGetter?: DataGetter<RowType>;

	/**
	 * If specified, this sort order will override default sort order. Use this to customize sort circle to your need.
	 *
	 * *Note:* This prop has no effect on the column group which contains {@link subColumns}.
	 */
	sortDirections?: SortOrder[];

	/**
	 * Specifies the sub-columns of the current column.
	 * Columns that have this property specified will become a ColumnGroup.
	 */
	subColumns?: Omit<BaseColumnType<RowType>, "pinning">[];

	/**
	 * @deprecated since 33.1.0, use {@link hiddenText} instead.
	 * The hidden text will be placed at the header cell.
	 *
	 * - If set an empty string, no hidden text.
	 * - If set a specific value, use passed value.
	 * - If not set anything, use default value.
	 *
	 * @default depends on the type of column
	 * - Normal column: no hidden text
	 * - Action column:
	 *    + English: "Action"
	 *    + German: "Aktion"
	 */
	title?: string;

	/**
	 * The hidden text will be placed at the header cell.
	 *
	 * - If set an empty string, no hidden text.
	 * - If set a specific value, use passed value.
	 * - If not set anything, use default value.
	 *
	 * @default depends on the type of column
	 * - Normal column: no hidden text
	 * - Action column:
	 *    + English: "Action"
	 *    + German: "Aktion"
	 */
	hiddenText?: string;

	/**
	 * The smallest width of the column.
	 * @default 0.1
	 */
	minResizeWidth?: Column.Width;

	/**
	 * Whether the column is a vertical header in a Cross Tabulation. It's pinned left by default.
	 * Once this prop is set, the other pinning left columns would be considered as a vertical header as well.
	 */
	verticalHeader?: boolean;
}
