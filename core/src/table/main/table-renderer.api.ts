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

import type { ReactNode, Key, RefCallback } from "react";
import type { ConnectDragPreview } from "react-dnd";
import type { ListProps as ReactVirtualizedProps, List as ReactVirtualizedList } from "react-virtualized";

import type { Container, Identifiable, Ref, Styleable } from "../../common/main/base-props.js";

import type { TableTemplateProps } from "./template/table.tpl.api.js";
import type { BaseColumnType } from "./column.api.js";
import type { InfiniteScrollOptions } from "./infinite-scroll.api.js";

/**
 * A handler function that scrolls to a specific node (row) in the table.
 * @param nodeIndex - The index of the node (row) to scroll to
 * @param options - Optional configuration object
 * @param options.autoFocus - If true, automatically focuses the node after scrolling
 */
export type TableScrollToNodeHandler = (nodeIndex: number, options?: { autoFocus?: boolean }) => void;

export interface TableComponentRenderers<
	RowType = unknown,
	ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
> {
	/**
	 * Custom header element.
	 */
	headRenderer: (props?: TableRenderPropsType.HeadProps) => ReactNode;

	/**
	 * Custom header row element.
	 */
	headRowRenderer: (props?: TableRenderPropsType.HeadRowProps) => ReactNode;

	/**
	 * Custom header cell element.
	 */
	headCellRenderer: (props: TableRenderPropsType.HeadCellProps<ColumnType>) => ReactNode;

	/**
	 * Custom header cell group element.
	 */
	headCellGroupRenderer: (props: TableRenderPropsType.HeadCellProps<ColumnType>) => ReactNode;

	/**
	 * Custom header content element.
	 */
	headContentRenderer: (props: TableRenderPropsType.HeadContentProps<ColumnType>) => ReactNode;

	/**
	 * Custom filter row element for the header.
	 */
	headFilterRowRenderer?: (props?: TableRenderPropsType.BaseProps) => ReactNode;

	/**
	 * Custom filter cell element for the header.
	 */
	headFilterCellRenderer?: (props: TableRenderPropsType.HeadCellProps<ColumnType>) => ReactNode;

	/**
	 * Custom filter content element for the header.
	 */
	headFilterContentRenderer?: (props: TableRenderPropsType.HeadContentProps<ColumnType>) => ReactNode;

	/**
	 * Custom body element.
	 */
	bodyRenderer: (props: TableRenderPropsType.BodyProps<RowType>) => ReactNode;

	/**
	 * Custom body element when enabling infinite scroll.
	 */
	infiniteScrollBodyRenderer: (props: TableRenderPropsType.InfiniteScrollBodyProps<RowType>) => ReactNode;

	/**
	 * Custom body element for the Virtualized Tree Table.
	 */
	virtualizedBodyRenderer: (props: TableRenderPropsType.VirtualizedBodyProps<RowType>) => ReactNode;

	/**
	 * Custom body row element.
	 */
	bodyRowRenderer: (props: TableRenderPropsType.BodyRowProps<RowType>) => ReactNode;

	/**
	 * Custom additional content element when expanding a row.
	 */
	additionalContentRenderer?: (props: TableRenderPropsType.BodyRowProps<RowType>) => ReactNode;

	/**
	 * Custom body cell element.
	 */
	bodyCellRenderer: (props: TableRenderPropsType.BodyCellProps<RowType, ColumnType>) => ReactNode;

	/**
	 * Custom body content element.
	 */
	bodyContentRenderer: (props: TableRenderPropsType.BodyContentProps<RowType, ColumnType>) => ReactNode;

	/**
	 * Custom placeholder element for body row.
	 */
	placeHolderBodyRowRenderer: (props: TableRenderPropsType.PlaceHolderBodyRowProps) => ReactNode;

	/**
	 * Custom placeholder element for body cell.
	 */
	placeHolderBodyCellRenderer?: (props: TableRenderPropsType.PlaceHolderBodyCellProps) => ReactNode;

	/**
	 * Custom placeholder element for body content.
	 */
	placeHolderBodyContentRenderer?: (props: TableRenderPropsType.PlaceHolderBodyContentProps) => ReactNode;

	/**
	 * Custom foot element.
	 */
	footRenderer: (props?: TableRenderPropsType.FootProps) => ReactNode;

	/**
	 * Custom foot row element.
	 */
	footRowRenderer: (props?: TableRenderPropsType.FootRowProps) => ReactNode;

	/**
	 * Custom foot cell element.
	 */
	footCellRenderer: (props: TableRenderPropsType.FootCellProps<ColumnType>) => ReactNode;

	/**
	 * Custom foot content element.
	 */
	footContentRenderer: (props: TableRenderPropsType.FootContentProps<ColumnType>) => ReactNode;

	/**
	 * Custom body row when enabling drag and drop.
	 */
	dndBodyRowRenderer: (props: TableRenderPropsType.DndBodyRowProps<RowType>) => ReactNode;

	/**
	 * Custom drag source element.
	 */
	dragSourceRenderer: (props: TableRenderPropsType.DragSourceProps<RowType>) => ReactNode;

	/**
	 * Custom drop target element.
	 */
	dropTargetRenderer: (props: TableRenderPropsType.DropTargetProps<RowType>) => ReactNode;

	/**
	 * Custom drag preview element.
	 */
	dragPreviewRenderer: (props: TableRenderPropsType.DragPreviewProps) => ReactNode;

	/**
	 * Custom context menu for the body.
	 */
	contextMenuRenderer?: (props: TableRenderPropsType.ContextMenuProps<RowType>) => ReactNode;

	/**
	 * Custom context menu for the header.
	 */
	headContextMenuRenderer?: (props: TableRenderPropsType.HeadContextMenuProps<ColumnType>) => ReactNode;

	/**
	 * Custom row group header.
	 */
	rowGroupHeaderRenderer?: (props: TableRenderPropsType.RowGroupHeaderProps<RowType>) => ReactNode;
}

export namespace TableRenderPropsType {
	export interface ContextMenuBaseProps {
		closeHandler: () => void;
	}

	export interface ContextMenuProps<RowType = unknown> extends ContextMenuBaseProps {
		row: RowType;

		rowIndex: number;
	}

	export interface HeadContextMenuProps<ColumnType = unknown> extends ContextMenuBaseProps {
		column?: ColumnType;
	}

	export interface BaseProps extends Identifiable, Styleable, Ref<HTMLDivElement> {
		key?: Key;
	}

	export type HeadProps = Partial<TableTemplateProps.HeadRowProps>;

	export interface HeadRowProps extends BaseProps, Partial<TableTemplateProps.HeadRowProps> {}

	export interface RowGroupHeaderProps<RowType = unknown> extends Partial<TableTemplateProps.RowGroupHeaderProps> {
		row: RowType;
		rowIndex: number;
	}

	export interface HeadCellProps<ColumnType> extends BaseProps, Partial<TableTemplateProps.HeadCellProps> {
		column: ColumnType;
		resizableColumn?: ColumnType;
	}

	export interface HeadContentProps<ColumnType> extends BaseProps, Partial<TableTemplateProps.HeadCellProps> {
		column: ColumnType;
	}

	export interface BodyProps<RowType = unknown> extends Partial<TableTemplateProps.BodyProps> {
		data: RowType[];
		scrollToNode?(handler: TableScrollToNodeHandler): void;
	}

	export interface InfiniteScrollBodyProps<RowType = unknown> extends Omit<BodyProps<RowType>, "data"> {
		data: (RowType | undefined)[];

		infiniteScrollOptions: InfiniteScrollOptions;
	}

	export interface VirtualizedBodyProps<RowType = unknown> extends BodyProps<RowType> {
		virtualScrollOptions?: Partial<ReactVirtualizedProps> & {
			listRef?: RefCallback<ReactVirtualizedList>;
		};
		scrollToNode?(handler: TableScrollToNodeHandler): void;
	}

	export interface BodyRowProps<RowType = unknown> extends BaseProps, Partial<TableTemplateProps.BodyRowProps> {
		row: RowType;
		rowIndex: number;
		onRendered?: () => void;

		/**
		 * Useful in case of virtual scrolling to trigger a re-calculation of row height when content changes.
		 */
		measureRowHeight?: () => void;
		loading?: boolean;
	}

	export interface BodyCellProps<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	>
		extends BaseProps, Partial<TableTemplateProps.BodyCellProps> {
		row: RowType;
		rowIndex: number;
		column: ColumnType;
	}

	export interface BodyContentProps<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> extends BaseProps {
		row: RowType;
		rowIndex: number;
		column: ColumnType;
	}

	export interface PlaceHolderBodyRowProps extends BaseProps {
		rowIndex: number;
		role?: string;
	}

	export interface PlaceHolderBodyCellProps<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> extends BaseProps {
		rowIndex: number;
		column: ColumnType;
	}

	export interface PlaceHolderBodyContentProps<
		RowType = unknown,
		ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
	> extends BaseProps {
		rowIndex: number;
		column: ColumnType;
	}

	export interface FootProps extends BaseProps, Partial<TableTemplateProps.FootProps> {}

	export interface FootRowProps extends BaseProps, Partial<TableTemplateProps.FootRowProps> {}

	export interface FootCellProps<ColumnType> extends BaseProps, Partial<TableTemplateProps.FootCellProps> {
		column: ColumnType;
	}

	export interface FootContentProps<ColumnType> extends BaseProps {
		column: ColumnType;
	}

	export interface DragObject<RowType = unknown> {
		rowIndex: number;
		row: RowType;
	}

	export interface HoveredObject<RowType = unknown> {
		rowIndex: number;
		row: RowType;
	}

	export interface DropResult<RowType = unknown> {
		rowIndex: number;
		row: RowType;
	}

	export interface DndBodyRowProps<RowType = unknown> extends BodyRowProps<RowType> {
		/**
		 * @deprecated since 36.2.0 because drag and drop to the top area is now always allowed.
		 */
		shouldRenderTopDropTarget?: boolean;
		canDrag?: boolean;
	}

	export interface DragSourceProps<RowType = unknown> extends Container, Styleable, Identifiable {
		rowIndex: number;
		row: RowType;
		canDrag?: boolean;
		dragPreview?: ReactNode;

		/** Get the preview function from DragSourceLayer, useful for customizing the default DragLayer  */
		connectDragPreview?: (preview: ConnectDragPreview) => void;
	}

	export interface DropTargetProps<RowType = unknown> extends Container, Styleable, Identifiable {
		rowIndex: number;
		row: RowType;
	}

	export interface DragPreviewProps extends Container, Identifiable, Styleable {}

	export interface ColumnResizeHandlerProps extends Styleable {
		isRightResizeHandler?: boolean;
		isFirstColumnOfRightPin?: boolean;
		column: BaseColumnType;
	}
}
