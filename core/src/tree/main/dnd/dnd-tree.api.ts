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

/**
 * Wrapper elements to add React DnD to the tree elements.
 * @module
 */

import type { Container, Identifiable, Styleable } from "../../../common/main/base-props.js";

import type { TreeTemplateProps, TreeNodeTemplateModel } from "../tpl/tree.tpl.api.js";

/** React DnD identifier of "drop" compatible elements. */
export const TreeNodeDropType = "TreeNode";

/**
 * An item which has been dropped onto another item.
 */
export interface DragSource {
	/**
	 * The model of the underlying node.
	 */
	node: TreeNodeTemplateModel;

	/**
	 * The model of the underlying parent node.
	 */
	parentNode: TreeNodeTemplateModel;

	/**
	 * The level of the underlying node.
	 */
	level: number;
}

/**
 * This interface defines type for the droppable item.
 */
export interface DropTarget {
	/**
	 * The drop target node. Given, if the drop occurred on a node.
	 */
	node?: TreeNodeTemplateModel;

	/**
	 * The parent node of the drop target. Given, if the drop target is not root.
	 */
	parentNode?: TreeNodeTemplateModel;

	/**
	 * The predecessor of the drop target where the "BOTTOM" hint preview is displayed.
	 */
	precedingNode?: TreeNodeTemplateModel;

	/**
	 * The successor of the drop target where the "TOP" hint preview is displayed.
	 */
	subsequentNode?: TreeNodeTemplateModel;
}

export interface DnDTreeProps extends TreeTemplateProps {
	/**
	 * Root of the tree.
	 */
	root: DnDTreeNode;

	/**
	 * Whether the top-level node should be hidden.
	 */
	hideRoot?: boolean;

	/**
	 * Type of the tree.
	 */
	type?: string;
}

export interface DnDTreeNode extends TreeNodeTemplateModel {
	children?: DnDTreeNode[];

	/**
	 * The given dragged item has been dropped onto the second item.
	 *
	 * @param dragSource – item that has been dropped.
	 * @param dropResult – item onto which the first item has been dropped.
	 */
	onDragDrop?(dragSource: DragSource, dropResult: {}): void;
	onBeginDrag?(dragSource: DragSource): void;
	onEndDrag?(dragSource: DragSource): void;
	canDrop?(hovering: {}, dragging: {}, isDropHint: boolean): boolean;
	canDrag?(dragSource: DragSource): boolean;

	onDragOver?(): void;
	onDragLeave?(): void;

	/**
	 * react-dnd type for the Tree.
	 */
	type?: string;

	/**
	 * Whether the droppable area is limited.
	 * - If this prop is set to `true`,
	 * 		+ dropping one node above another is allowed if the hovered node is the first node in the current level.
	 * 		+ dropping one node below another is allowed if the hovered node is collapsed or does not have children.
	 * - If this prop is set to `false`, both dropping above and below a node will be allowed.
	 *
	 * @default `true`
	 */
	strictDnD?: boolean;
}

export interface DnDTreeNodeProps extends Container, Identifiable {
	node: DnDTreeNode;
	parentNode?: TreeNodeTemplateModel;
	level: number;
	insertBeforeTarget?: boolean;
	hideRoot?: boolean;
	type?: string;
}

export interface TreeInsertTargetProps extends Identifiable, Styleable {
	top: boolean;
	parentNode: TreeNodeTemplateModel;
	precedingNode?: TreeNodeTemplateModel;
	subsequentNode?: TreeNodeTemplateModel;
	onDragDrop?(draggedItem: DragSource, droppedItem: {}): void;
	canDropOnto?(hovering: {}, dragging: {}, isDropHint: boolean): boolean;
	type?: string;

	/**
	 * @internal
	 */
	level?: number;
}

export interface DndTreeNodePreviewProps extends Identifiable, Styleable, Container {
	getWidth?(): number | string;
}
