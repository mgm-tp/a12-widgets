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

import type {
	HTMLProps,
	RefCallback,
	MouseEventHandler,
	KeyboardEventHandler,
	ReactNode,
	FocusEventHandler,
	FocusEvent
} from "react";

import type {
	Container,
	DataRole,
	DOMProps,
	HTMLAttributes,
	Identifiable,
	Ref,
	Styleable
} from "../../../common/main/base-props.js";
import type { BaseColumnType, Column, SortOrder } from "../../new-api/column.api.js";

export namespace TableTemplateProps {
	export interface TableDataAttribute extends DataRole {
		/**
		 * aria-label attribute.
		 */
		ariaLabel?: string;

		/**
		 * aria-hidden attribute.
		 */
		ariaHidden?: boolean;

		/**
		 * aria-labelledby attribute.
		 */
		ariaLabelledby?: string;
	}

	export type TableHighlightVariant = "success" | "info";

	export interface BaseProps extends Styleable, Identifiable, Container, TableDataAttribute, DOMProps {
		/**
		 * Aria-role of element.
		 *
		 * - Set to a string value, use passed value.
		 * - Set to false, not set role attribute for the element.
		 * - Set to true/undefined, use default value.
		 *
		 * @default value of each element:
		 * - RowGroup/Head/Body/Foot: "rowgroup"
		 * - RowGroupHeader/HeadRow/BodyRow/PlaceHolderBodyRow/FootRow: "row"
		 * - HeadCell: "columnheader"
		 * - BodyCell/FootCell: "cell"
		 * - ExpandableBodyRowWrapper: "form"
		 */
		role?: boolean | string;
	}

	export interface TableElementProps
		extends Omit<HTMLProps<HTMLDivElement>, "role">, TableDataAttribute, Ref<HTMLDivElement> {
		/**
		 * Display table as cards.
		 * @default false
		 */
		cardView?: boolean;

		/**
		 * Aria-role of Table.
		 *
		 * - Set to a string value, use passed value.
		 * - Set to false, not set role attribute for the element.
		 * - Set to true/undefined, use default value.
		 *
		 * @default is "table"
		 * If {@link cardView} is set to true, role is "list".
		 */
		role?: boolean | string;

		interactive?: boolean;

		columns?: BaseColumnType<any>[];

		/**
		 * If columns in Table are resizable or not
		 */
		resizable?: boolean;

		/**
		 * @internal
		 */
		noAriaLabel?: boolean;

		/**
		 * Table container wrapper ref
		 */
		containerWrapper?: RefCallback<HTMLElement>;

		/**
		 * If true, the arrow navigation keyboard handlers are suppressed.
		 */
		disableArrowNavigation?: boolean;

		/**
		 * @internal
		 */
		virtualScroll?: boolean;
	}

	export interface CellProps extends BaseProps {
		/**
		 * The 1-based column index used for aria-colindex to support correct screen reader column announcements.
		 * Required when the table layout splits columns into separate DOM segments (left/scroll/right pinned areas).
		 */
		ariaColIndex?: number;

		/**
		 * The width scale of the column.
		 * @default 1.0
		 */
		relativeWidth?: Column.Width;

		/**
		 * Common horizontal alignment of the column. For column group, this prop has no effect on its sub-columns but only itself.
		 * @default center for Group Column
		 * @default left for the others
		 */
		horizontalAlignment?: Column.HorizontalAlignment;

		/**
		 * Common vertical alignment of the whole column. For column group, this prop has no effect on its sub-columns but only itself.
		 * @default middle for Header
		 * @default top for Body
		 *
		 * *Note:* This configuration does not affect the filter row or the {@link actionCell}, which are always aligned to 'top' and 'center', respectively.
		 */
		verticalAlignment?: Column.VerticalAlignment;

		/**
		 * If true, the column width will be calculated as {@link relativeWidth} * 150.
		 */
		fixedWidth?: boolean;

		/**
		 * A sub-info column will have different background containing not so important information.
		 */
		subInfo?: boolean;

		/**
		 * Indicates that a column is holding action buttons.
		 * If this is set to true, the width will be automatically calculated unless a {@link relativeWidth} is defined.
		 */
		actionCell?: boolean;

		onClick?: MouseEventHandler<HTMLElement>;
		onKeyDown?: KeyboardEventHandler<HTMLElement>;
		onMouseOver?: MouseEventHandler<HTMLElement>;
		onMouseLeave?: MouseEventHandler<HTMLElement>;
	}

	export type RowSegmentType = "left" | "scroll" | "right";

	export interface RowSegmentProps extends BaseProps {
		type: RowSegmentType;
	}

	export interface RowGroupHeaderProps extends BaseProps, Ref<HTMLDivElement> {}

	export interface CollapsingWrapperProps extends BaseProps, Ref<HTMLDivElement> {
		role?: string;
		tabIndex?: number;
		rowSegmentType?: RowSegmentType;
	}

	export interface ExpandableBodyRowWrapperProps extends BaseProps, Ref<HTMLDivElement> {}

	export interface ExpandableRowBodyProps extends BaseProps, Ref<HTMLDivElement> {}

	export interface ExpandableRowFooterProps extends BaseProps, Ref<HTMLDivElement> {}

	export type HeadProps = BaseProps;

	export type HeadRowProps = BaseProps;

	export interface HeadCellProps extends CellProps, Ref<HTMLDivElement>, HTMLAttributes {
		sortable?: boolean;
		sorting?: SortingDirection;

		/**
		 * @internal Use for style purpose
		 */
		isHovering?: boolean;

		/**
		 * The hidden text will be placed at the header cell.
		 *
		 * - If set an empty string, no hidden text.
		 * - If set a specific value, use passed value.
		 * - If not set anything, use default value.
		 *
		 * @default
		 * - Normal column: no hidden text
		 * - Action column:
		 *    + English: "Action"
		 *    + German: "Aktion"
		 */
		hiddenText?: string;

		/**
		 * Aria-role of the head cell content wrapper to support Accessibility in a better way.
		 * In sortable table, default role is "button" so that screen readers can recognize it as an interactive element.
		 *
		 * Usage:
		 * - Set to "false", no role for the element: e.g.: For avoidance syntax error in case of having another
		 *   interactive element within the cell of sortable table. To make sure Accessibility still works fine,
		 *   you can add role "button" to the child element instead.
		 * - Set to "true"/undefined, use default value.
		 * - Set to a string value, use passed value.
		 *
		 * @default If {@link sortable} is set to true, it is "button". Otherwise, no role is set.
		 */
		contentWrapperRole?: string | boolean;

		/**
		 * @internal
		 * resizeHandler will be placed at the right of the head cell
		 */
		rightResizeHandler?: ReactNode;

		/**
		 * @internal
		 * resizeHandler will be placed at the left of the head cell
		 */
		leftResizeHandler?: ReactNode;

		onKeyUp?: KeyboardEventHandler<HTMLElement>;

		onContextMenu?: MouseEventHandler<HTMLElement>;
	}

	export interface HeadCellGroupProps extends HeadCellProps {
		/**
		 * Displays the parent of a column group
		 */
		parent?: ReactNode;
	}

	export interface BodyProps extends BaseProps, Ref<HTMLDivElement> {
		bodyRef?: RefCallback<HTMLDivElement>;
		tabIndex?: number | false;
	}

	export interface BodyRowProps extends BaseProps, Ref<HTMLDivElement>, HTMLAttributes {
		selected?: boolean;
		highlighted?: boolean;
		interactive?: boolean;

		/**
		 * Notice that the property {@link TableElementProps.disabled} has higher priority.
		 */
		disabled?: boolean;

		tabIndex?: number;
		title?: string;
		highlightVariant?: TableHighlightVariant;
		onClick?: MouseEventHandler<HTMLElement>;
		onMouseOver?: MouseEventHandler<HTMLElement>;
		onFocus?: FocusEventHandler<HTMLElement>;
		onBlur?: FocusEventHandler<HTMLElement>;
		onKeyDown?: KeyboardEventHandler<HTMLElement>;
		ariaSelected?: boolean;
		ariaLevel?: number;
		onRendered?(): void;
		onContextMenu?: MouseEventHandler<HTMLElement>;
	}

	export type PlaceHolderBodyRowProps = BaseProps;

	export interface BodyCellProps extends CellProps, Ref<HTMLDivElement> {
		label?: ReactNode;
		useHighlightTitle?: TableHighlightVariant;
		useSecondaryColor?: boolean;
		useSelectedTitle?: boolean;
		firstCell?: boolean;

		/**
		 * The hidden text will be placed at the secondary cell.
		 *
		 * @default placed at the first secondary cell of the row with content:
		 * - English: "Withdrawn"
		 * - German: "Löschen (wiederherstellbar)"
		 */
		secondaryCellTitle?: string;

		onContextMenu?: MouseEventHandler<HTMLDivElement>;

		/**
		 * @internal Use for style purpose
		 */
		verticalHeader?: boolean;
	}

	export type FootProps = BaseProps;

	export interface FootRowProps extends BaseProps {
		useHighlightColor?: boolean;
	}

	export type FootCellProps = CellProps & {
		/**
		 * @internal
		 */
		isRowScroller?: boolean;
	};

	export type SortingDirection = SortOrder;

	export type HorizontalScrollPosition = null | "right" | "left" | "middle";

	export type ContextMenuPosition = {
		top: number;
		left: number;
	};

	export interface ExpandableRowProps extends BaseProps {
		/**
		 * Set invisible focus on the expandable row when it has finished rendering.
		 */
		focusOnMount?: boolean;

		onBlur?(event: FocusEvent<HTMLElement>): void;
		onFocus?(event: FocusEvent<HTMLElement>): void;
	}
	export interface ContextMenuBaseProps {
		renderer?: (props: any) => ReactNode;

		closeHandler: () => void;

		/**
		 * @internal
		 */
		position?: ContextMenuPosition;
	}
	export interface ContextMenuProps<RowType = unknown> extends ContextMenuBaseProps {
		row: RowType;

		rowIndex: number;
	}

	export interface HeadContextMenuProps extends ContextMenuBaseProps {
		column?: BaseColumnType;
	}
}
