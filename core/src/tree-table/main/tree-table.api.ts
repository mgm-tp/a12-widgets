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

import type {
	RowEventHandlers,
	RowStyles,
	TableDragDropOptions,
	TableContextType,
	VirtualScrollOptions,
	BaseTableProps
} from "../../table/main/table.api.js";
import type { TableComponentRenderers, TableRenderPropsType } from "../../table/main/table-renderer.api.js";
import type { BaseColumnType } from "../../table/main/column.api.js";

export interface BaseTreeTableNode<NodeData = unknown> {
	/** The identifier for a tree table node */
	id: any;

	/** Optional symbol of the tree table node. Normally should be an Icon. */
	icon?: ReactNode;

	/** Tree table node's cell. */
	data: NodeData;

	/** Tree table node's children. */
	children?: BaseTreeTableNode<NodeData>[];
}

export type FlattenTreeTableNode<NodeType extends BaseTreeTableNode = BaseTreeTableNode> = NodeType & {
	label?: string;
	level: number;
	parent?: FlattenTreeTableNode<NodeType>;
	children?: FlattenTreeTableNode<NodeType>[];
};

export interface BaseTreeTableColumnType<NodeType extends BaseTreeTableNode = BaseTreeTableNode> extends Omit<
	BaseColumnType<FlattenTreeTableNode<NodeType>>,
	"verticalHeader"
> {
	hierarchical?: boolean;
}

type OmittedProps = "componentRenderers" | "dragDropOptions" | "cellHighlighting" | "scrollToNode";
export interface TreeTableProps<
	NodeType extends BaseTreeTableNode = BaseTreeTableNode,
	ColumnType extends BaseTreeTableColumnType<NodeType> = BaseTreeTableColumnType<NodeType>,
	DragDropOptions = TreeTableDragDropOptions<NodeType>
> extends Omit<BaseTableProps<FlattenTreeTableNode<NodeType>, ColumnType>, OmittedProps> {
	/**
	 * Root of the Tree Table.
	 */
	root?: NodeType;

	/**
	 * Custom components to render.
	 */
	componentRenderers?: Partial<TreeTableComponentRenderers<NodeType, ColumnType>>;

	/**
	 * To define variants for a row.
	 */
	rowStyling?: TreeTableRowStyling<NodeType>;

	/**
	 * To define event handlers for a row.
	 */
	rowEventHandlers?: TreeTableRowEventHandlers<NodeType>;

	/**
	 * Whether the top-level node should be hidden or not.
	 */
	hideRoot?: boolean;

	/**
	 * To define configuration for the drag and drop behavior.
	 */
	dragDropOptions?: DragDropOptions;

	/**
	 * To define configuration for the virtual scrolling behavior.
	 */
	virtualScrollOptions?: TreeTableVirtualScrollOptions;

	/**
	 * A handler to scroll to a specific node.
	 */
	scrollToNode?(handler: TreeTableScrollToNodeHandler): void;

	/**
	 * Whether the given rows are equal.
	 */
	areRowsEqual?(row1: FlattenTreeTableNode<NodeType>, row2: FlattenTreeTableNode<NodeType>): boolean;
}

/**
 * A handler function that scrolls to a specific node in the tree table.
 * @param nodeId - The unique identifier of the node to scroll to
 * @param options - Optional configuration object
 * @param options.autoFocus - If true, automatically focuses the node after scrolling
 */
export type TreeTableScrollToNodeHandler = (nodeId: string | number, options?: { autoFocus?: boolean }) => void;

export interface TreeTableVirtualScrollOptions extends VirtualScrollOptions {
	/**
	 * Specify the height of a row.
	 */
	rowHeight: number;
}

export interface TreeTableRowStyles extends RowStyles {
	/**
	 * Whether the tree node is collapsed.
	 */
	collapsed?: boolean;
}

export interface TreeTableRowStyling<NodeType extends BaseTreeTableNode = BaseTreeTableNode> {
	(params: { row: FlattenTreeTableNode<NodeType>; rowIndex: number }): TreeTableRowStyles;
}

export interface TreeRowEventHandlers extends RowEventHandlers {
	/**
	 * A callback will be triggered when the arrow button of a tree node is clicked.
	 */
	onArrowClick?(): void;
}

export interface TreeTableRowEventHandlers<NodeType extends BaseTreeTableNode = BaseTreeTableNode> {
	(params: { row: FlattenTreeTableNode<NodeType>; rowIndex: number }): TreeRowEventHandlers;
}

/**
 * Options for DnD handling in table
 */
export interface TreeTableDragDropOptions<
	NodeType extends BaseTreeTableNode = BaseTreeTableNode,
	DragObject = TreeTableRenderPropsType.DragObject<NodeType>,
	DropResult = TreeTableRenderPropsType.DropResult<NodeType>,
	HoveredObject = TreeTableRenderPropsType.HoveredObject<NodeType>
> extends TableDragDropOptions<FlattenTreeTableNode<NodeType>, DragObject, DropResult, HoveredObject> {
	/**
	 * A handler for the hover event.
	 */
	onHover?(params: { dragItem: DragObject; hoveredItem?: HoveredObject }): void;
}

/**
 * Hold common prop values that is shared through all tree table components
 */
export interface TreeTableContextType<
	NodeType extends BaseTreeTableNode = BaseTreeTableNode,
	ColumnType extends BaseTreeTableColumnType<NodeType> = BaseTreeTableColumnType<NodeType>,
	DragDropOptions = TreeTableDragDropOptions<NodeType>
> extends Omit<TableContextType<FlattenTreeTableNode<NodeType>, ColumnType>, OmittedProps> {
	readonly data?: FlattenTreeTableNode<NodeType>[];
	readonly root?: NodeType;
	readonly hideRoot?: boolean;
	readonly componentRenderers: TreeTableComponentRenderers<NodeType, ColumnType>;
	readonly rowStyling?: TreeTableRowStyling<NodeType>;
	readonly rowEventHandlers?: TreeTableRowEventHandlers<NodeType>;
	readonly dragDropOptions?: DragDropOptions;
	readonly areRowsEqual?: (row1: FlattenTreeTableNode<NodeType>, row2: FlattenTreeTableNode<NodeType>) => boolean;
}

export interface TreeTableComponentRenderers<
	NodeType extends BaseTreeTableNode = BaseTreeTableNode,
	ColumnType extends BaseTreeTableColumnType<NodeType> = BaseTreeTableColumnType<NodeType>
> extends Omit<
	TableComponentRenderers<FlattenTreeTableNode<NodeType>, ColumnType>,
	"dropTargetRenderer" | "virtualizedBodyRenderer"
> {
	/**
	 * Custom drop target element.
	 */
	dropTargetRenderer: (props: TreeTableRenderPropsType.DropTargetProps<FlattenTreeTableNode<NodeType>>) => ReactNode;

	/**
	 * Custom body element for the Tree.
	 */
	hierarchicalBodyContentRenderer: (
		props: TreeTableRenderPropsType.HierarchicalBodyContentProps<NodeType, ColumnType>
	) => ReactNode;

	/**
	 * Custom body element for the Tree Table.
	 */
	bodyRenderer: (props: TreeTableRenderPropsType.BodyProps<NodeType>) => ReactNode;

	/**
	 * Custom body element for the Virtualized Tree Table.
	 */
	virtualizedBodyRenderer: (props: TreeTableRenderPropsType.VirtualizedBodyProps<NodeType>) => ReactNode;
}

export namespace TreeTableRenderPropsType {
	export interface HierarchicalBodyContentProps<
		NodeType extends BaseTreeTableNode = BaseTreeTableNode,
		ColumnType extends BaseTreeTableColumnType<NodeType> = BaseTreeTableColumnType<NodeType>
	> extends TableRenderPropsType.BodyContentProps<FlattenTreeTableNode<NodeType>, ColumnType> {
		children?: ReactNode;
		icon?: ReactNode;
		collapsed?: boolean;
		onArrowClick?(): void;
	}

	export interface BodyProps<NodeType extends BaseTreeTableNode = BaseTreeTableNode> extends Omit<
		TableRenderPropsType.BodyProps<FlattenTreeTableNode<NodeType>>,
		"scrollToNode"
	> {
		scrollToNode?(handler: TreeTableScrollToNodeHandler): void;
	}

	export interface VirtualizedBodyProps<
		NodeType extends BaseTreeTableNode = BaseTreeTableNode
	> extends BodyProps<NodeType> {
		virtualScrollOptions: TreeTableVirtualScrollOptions;
	}

	export type DragObject<NodeType extends BaseTreeTableNode = BaseTreeTableNode> = TableRenderPropsType.DragObject<
		FlattenTreeTableNode<NodeType>
	>;

	export interface DropResult<
		NodeType extends BaseTreeTableNode = BaseTreeTableNode
	> extends TableRenderPropsType.DropResult<FlattenTreeTableNode<NodeType>> {
		position: TreeTableNodeDropPosition;
	}

	export interface HoveredObject<
		NodeType extends BaseTreeTableNode = BaseTreeTableNode
	> extends TableRenderPropsType.HoveredObject<FlattenTreeTableNode<NodeType>> {
		position: TreeTableNodeDropPosition;
	}

	export interface DropTargetProps<
		NodeType extends BaseTreeTableNode = BaseTreeTableNode
	> extends TableRenderPropsType.DropTargetProps<FlattenTreeTableNode<NodeType>> {
		position: TreeTableNodeDropPosition.TOP | TreeTableNodeDropPosition.BOTTOM;
	}
}

export enum TreeTableNodeDropPosition {
	TOP = "top",
	BOTTOM = "bottom",
	AS_CHILD = "as_child"
}
