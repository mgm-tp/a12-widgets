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

/*
 * Deliberate fork of `core/src/table/main/table.api.ts` — see `./README.md`.
 * Subset + additions: the value-level row/cell/DnD contracts only. Every legacy
 * component-prop type is dropped (DataTable declares its own in
 * `../data-table.api.ts`); the two `ColumnResize*` types are new here.
 */

import type { Key, MouseEvent, TouchEvent } from "react";

import type { Styleable } from "../../../common/main/base-props.js";

import type { BaseColumnType, Column } from "./column.api.js";
import type { TableRenderPropsType } from "./table-renderer.api.js";

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

	/**
	 * Whether Space picks the focused row up for `DataTable`'s keyboard row reordering. Defaults to
	 * `"Space"`; `false` frees Space for the consumer's own row shortcut, at the cost of the keyboard path
	 * to reordering. Ignored by the legacy `Table`, which has no keyboard reordering.
	 */
	keyboardGrabKey?: "Space" | false;
}

/**
 * If specified, the function will be called for each row and the returned value overrides key for the particular row.
 *
 * `rowIndex` is supplied by orchestrators that track row position (e.g. `DataTable`); the legacy `Table`
 * does not pass it, so consumers reading the field must treat it as optional.
 */
export type RowKeyGetter<RowType> = (params: { row: RowType; rowIndex?: number }) => Key;

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
	highlightVariant?: "success" | "info";

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
 * Event that initiated a column-resize step: a pointer gesture (`PointerEvent`,
 * a `MouseEvent` subtype) or a keyboard step (`KeyboardEvent`). Structurally
 * matches react-draggable's `DraggableEvent`, so handlers written against the
 * production Table's resize callbacks remain assignable — without depending on
 * the react-draggable types.
 */
export type ColumnResizeDragEvent =
	| MouseEvent<HTMLElement | SVGElement>
	| TouchEvent<HTMLElement | SVGElement>
	| globalThis.MouseEvent
	| globalThis.TouchEvent;

/**
 * Pointer-position snapshot for a column-resize step. `x`/`y` are the cursor's
 * client coordinates, `lastX`/`lastY` the previous callback's, `deltaX`/`deltaY`
 * the difference, `node` the resize-handle element. Keyboard steps report the
 * step delta in `deltaX` with the coordinates zeroed. Structurally matches
 * react-draggable's `DraggableData`.
 */
export interface ColumnResizeDragData {
	node: HTMLElement;
	x: number;
	y: number;
	deltaX: number;
	deltaY: number;
	lastX: number;
	lastY: number;
}

export type ColumnResizeEventHandler<ColumnType> = (params: {
	resizedColumn: ColumnType;
	resizedWidthsGetter?: (column: ColumnType) => Column.Width | undefined;
	event: ColumnResizeDragEvent;
	data: ColumnResizeDragData;
}) => void;
