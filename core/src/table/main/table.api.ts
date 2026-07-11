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

import type { FocusEvent, Key, MouseEvent, RefCallback, SetStateAction, Dispatch } from "react";
import type { DraggableData, DraggableEvent } from "react-draggable";
import type { ListProps as ReactVirtualizedProps, List as ReactVirtualizedList } from "react-virtualized";

import type { Styleable, Ref } from "../../common/main/base-props.js";

import type { TableTemplateProps } from "./template/table.tpl.api.js";
import type { BaseColumnType, Column, SortOrder } from "./column.api.js";
import type { TableRenderPropsType, TableComponentRenderers, TableScrollToNodeHandler } from "./table-renderer.api.js";
import type { InfiniteScrollOptions } from "./infinite-scroll.api.js";

export type TableProps<RowType = unknown, ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>> =
	| BaseTableProps<RowType, ColumnType>
	| InfiniteScrollTableProps<RowType, ColumnType>;

export interface InfiniteScrollTableProps<
	RowType = unknown,
	ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
> extends Omit<BaseTableProps<RowType, ColumnType>, "data" | "virtualScrollOptions"> {
	/**
	 * Data to display.
	 */
	data?: (RowType | undefined)[];

	/**
	 * Use this props to enable infinite scroll feature. See {@link InfiniteScrollOptions} for details.
	 */
	infiniteScrollOptions: InfiniteScrollOptions;
}

export interface BaseTableProps<RowType = unknown, ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>>
	extends TableTemplateProps.BaseProps, Ref<HTMLDivElement> {
	/**
	 * Define columns of table.
	 */
	columns: ColumnType[];

	/**
	 * Data to display. By default, if no dataKey or dataGetter is defined in {@link BaseColumnType}, then data will be parsed using index order from columns definition.
	 */
	data?: RowType[];

	/**
	 * Display table as cards.
	 * @default false
	 */
	cardView?: boolean;

	/**
	 * If true, all event handler are suppressed, as well as making table looks disabled.
	 */
	disabled?: boolean;

	/**
	 * Either a string or number pointing to the field in the {@link RowType} object, or a function returning the key of the row.
	 * See {@link RowKeyGetter}.
	 */
	rowKey?: string | number | RowKeyGetter<RowType>;

	/**
	 * Define sort order and event handler for column click.
	 *
	 * *Note:* If columns are resizable, the column in {@link SortOptions.sortState} should be updated after resizing to avoid an incorrect state of the sortable header cell.
	 */
	sortOptions?: SortOptions<ColumnType>;

	/**
	 * Enable or supply an option object to override default virtualized behavior, or use additional props that is supported by react-virtualized.
	 */
	virtualScrollOptions?: true | VirtualScrollOptions;

	/**
	 * A handler to scroll to a specific node (row).
	 */
	scrollToNode?(handler: TableScrollToNodeHandler): void;

	/**
	 * Event handlers for DnD behavior.
	 */
	dragDropOptions?: TableDragDropOptions<RowType>;

	/**
	 * Event handlers for resizing columns behavior.
	 */
	columnResizingOptions?: ColumnResizingOptions<ColumnType>;

	/**
	 * Use this prop to override rendering of table. See {@link TableComponentRenderers} for details.
	 */
	componentRenderers?: Partial<TableComponentRenderers<RowType, ColumnType>>;

	/**
	 * Used to specify whether aria-attributes (such as aria-label) will be added to the table footer.
	 */
	hasFootContent?: boolean;

	/**
	 * When enabled, restructures the table header from nested column groups into separate rows using CSS Grid layout.
	 * This improves screen reader accessibility while maintaining the same visual appearance.
	 * Each header level becomes a separate row, with cells spanning appropriately based on aria-colspan and aria-rowspan values.
	 * @default false
	 */
	enableColumnGroupA11y?: boolean;

	/**
	 * Define event handlers for rows. It receives a RowType object as argument, and return a list of handler functions.
	 * See {@link RowEventHandlerGetter}.
	 *
	 * *Note:* The event handlers returned by rowEventHandlers can be overridden by the same event handlers in {@link TableRenderPropsType.BodyRowProps}.
	 */
	rowEventHandlers?: RowEventHandlerGetter<RowType>;

	/**
	 * Define styling for row. It's a function receiving RowType object and its index as argument, and return a {@link RowStyles} object.
	 *
	 * *Note:* The properties returned by rowStyling can be overridden by the same properties in {@link TableRenderPropsType.BodyRowProps}.
	 */
	rowStyling?: RowStyleGetter<RowType>;

	/**
	 * Similar to {@link rowStyling}, but return style of cell as key, and return an {@link CellStyles} object.
	 *
	 * *Note:* The properties returned by cellStyling can be overridden by the same properties in {@link TableRenderPropsType.BodyCellProps}.
	 */
	cellStyling?: CellStyleGetter<RowType, ColumnType>;

	/**
	 * Whether the body cell and corresponding header cell(s) will be highlighted when mousing over on body cell.
	 */
	cellHighlighting?: boolean;

	/**
	 * If true, the arrow navigation keyboard handlers are suppressed.
	 */
	disableArrowNavigation?: boolean;

	/**
	 * This is useful for validation of Table's data when leaving the table.
	 * @param event – the FocusEvent, useful to check if the newly focused element (e.g. relatedTarget) is inside Table or not.
	 */
	onBlur?(event: FocusEvent<HTMLDivElement>): void;
}

/**
 * Options for DnD handling in table
 */
export interface TableDragDropOptions<
	RowType = unknown,
	DragItem = TableRenderPropsType.DragObject<RowType>,
	DropResult = TableRenderPropsType.DropResult<RowType>,
	HoveredItem = TableRenderPropsType.HoveredObject<RowType>
> {
	/**
	 * Whether the row can be dragged or not.
	 */
	canDrag?(params: { dragItem: DragItem }): boolean;

	/**
	 * Handler when the row is being dropped.
	 */
	onDrop?(params: { dragItem: DragItem; dropResult: DropResult }): void;

	/**
	 * Whether the target can be dropped or not.
	 */
	canDrop?(params: { dragItem: DragItem; hoveredItem: HoveredItem }): boolean;

	/**
	 * Handler when the dragging begins.
	 */
	onBeginDrag?(params: { dragItem: DragItem }): void;

	/**
	 * Handler when the dragging ends.
	 */
	onEndDrag?(params: { dragItem: DragItem; dropResult: DropResult | null }): void;

	/**
	 * Defines the kinds of dragItems this dropTarget accepts.
	 */
	acceptType?: string;
}

/**
 * If specified, the function will be called for each row and the returned value overrides key for the particular row.
 */
export type RowKeyGetter<RowType> = (params: { row: RowType }) => Key;

/**
 * Collections of callback function available on the row.
 */
export type RowEventHandlers = {
	/**
	 * A callback that will be triggered when the row is clicked.
	 */
	onClick?(event?: MouseEvent<HTMLElement>): void;
};

/**
 * If specified, it will be called for each row, and the returned functions will be called accordingly when event is
 * triggered on the row.
 */
export type RowEventHandlerGetter<RowType> = (params: { row: RowType; rowIndex: number }) => RowEventHandlers;

/**
 * Specify sort options: which column is active, sort order, and callback function for handling of sort event
 */
export interface SortOptions<ColumnType> {
	/**
	 * Values relevant to the current sorting state including: the column being sorted and the order/direction its sorted in.
	 */
	sortState?: SortState<ColumnType>;

	/**
	 * Handler function for sort event.
	 */
	onSort?(params: { column: ColumnType; order: SortOrder }): void;
}

/**
 * This interface is to couple a column with its sort order
 */
export interface SortState<ColumnType> {
	/**
	 * The column being sorted.
	 */
	column?: ColumnType;

	/**
	 * The direction the column is being sorted in.
	 */
	order?: SortOrder;
}

/**
 * This interface is to override default react-virtualized props/behaviors
 */
export interface VirtualScrollOptions extends Partial<ReactVirtualizedProps> {
	/**
	 * The reference of the react-virtualized list instance.
	 */
	listRef?: RefCallback<ReactVirtualizedList>;
}

/**
 * The Table display its columns in three parts: left, middle-scrollable, and right area.
 * However, columns definition is just an array, and therefore we gather columns in each area by identifying
 * its pinning property and group them into those parts for easier rendering
 */
export interface RowSegments<ColumnType> {
	/**
	 * Left segment's column array of Table.
	 */
	left: ColumnType[];

	/**
	 * Middle-scrollable segment's column array of Table.
	 */
	scroll: ColumnType[];

	/**
	 * Right segment's column array of Table.
	 */
	right: ColumnType[];
}

/**
 * Collections of style values for the row
 */
export interface RowStyles extends Styleable {
	/**
	 * Title attribute for the row.
	 */
	title?: string;

	/**
	 * Whether the row is selected.
	 */
	selected?: boolean;

	/**
	 * Whether the row is interactive.
	 */
	interactive?: boolean;

	/**
	 * Whether the row is disabled.
	 */
	disabled?: boolean;

	/**
	 * Highlight row bases on different variables.
	 */
	highlightVariant?: TableTemplateProps.TableHighlightVariant;

	/**
	 * Whether the row is highlighted.
	 */
	highlighted?: boolean;

	/**
	 * Whether the context menu is disabled from some specific Rows.
	 */
	disabledRightClickContextMenu?: boolean;
}

/**
 * If specified, this function will be called for each row and return row style overriding default style.
 */
export type RowStyleGetter<RowType> = (params: { row: RowType; rowIndex: number }) => RowStyles;

/**
 * Same as {@link RowStyles}, but for cell.
 */
export interface CellStyles extends Styleable {
	/**
	 * Whether the body cell is secondary info.
	 */
	useSecondaryColor?: boolean;

	/**
	 * The hidden text will be placed at the secondary cell.
	 *
	 * @default placed at the first secondary cell of the row with content:
	 * - English: "Withdrawn"
	 * - German: "Löschen (wiederherstellbar)"
	 */
	secondaryCellTitle?: string;
}

/**
 * If specified, this function will be called for each cell and return cell style overriding default style.
 */
export type CellStyleGetter<RowType, ColumnType extends BaseColumnType<RowType>> = (params: {
	row: RowType;
	rowIndex: number;
	column: ColumnType;
}) => CellStyles;

/**
 * Hold common static prop values that are shared through all table components.
 */
export interface TableContextType<
	RowType = unknown,
	ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
> {
	rowKey?: string | number | RowKeyGetter<RowType>;
	columns: ColumnType[];
	flattenColumns?: ColumnType[];
	sortOptions?: SortOptions<ColumnType>;
	disabled?: boolean;
	cardView?: boolean;
	hasFootContent?: boolean;
	dragDropOptions?: TableDragDropOptions<RowType>;
	virtualScrollOptions?: true | Partial<ReactVirtualizedProps>;
	infiniteScrollOptions?: InfiniteScrollOptions;
	columnResizingOptions?: ColumnResizingOptions<ColumnType>;
	rowStyling?: RowStyleGetter<RowType>;
	cellStyling?: CellStyleGetter<RowType, ColumnType>;
	rowEventHandlers?: RowEventHandlerGetter<RowType>;
	componentRenderers: TableComponentRenderers<RowType, ColumnType>;
	resizable?: boolean;
	hasColumnGroup?: boolean;
	enableColumnGroupA11y?: boolean;
	crossTabulation?: boolean;
	cellHighlighting?: boolean;
	isInteractiveTable?: boolean;
	setIsInteractiveTable?: Dispatch<SetStateAction<boolean>>;
	isDragging?: boolean;
	setIsDragging?: Dispatch<SetStateAction<boolean>>;
	hasScrollToNode?: boolean;
}

export type ColumnResizeEventHandler<ColumnType> = (params: {
	resizedColumn: ColumnType;
	resizedWidthsGetter?: (column: ColumnType) => Column.Width | undefined;
	event: DraggableEvent;
	data: DraggableData;
}) => void;

export interface ColumnResizingOptions<ColumnType> {
	/**
	 * Handle event when the user starts to resize a column.
	 */
	onBeginResize?: ColumnResizeEventHandler<ColumnType>;

	/**
	 * Handle event when a column is being resized.
	 */
	onResize?: ColumnResizeEventHandler<ColumnType>;

	/**
	 * Handle event when the user has finished resizing a column.
	 */
	onEndResize?: ColumnResizeEventHandler<ColumnType>;
}
