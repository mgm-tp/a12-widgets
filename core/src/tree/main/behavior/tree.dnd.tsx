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
 * Drag & drop behavior.
 *
 * Attention: You must use the drag&drop elements as tree template.
 * @module
 */

import type { ComponentType, ReactNode } from "react";
import { PureComponent } from "react";

import type { DnDTreeNode } from "../dnd/dnd-tree.api.js";
import type { TreeNodeTemplateModel } from "../tpl/tree.tpl.api.js";

import type {
	DragAndDropTreeProps,
	DragItem,
	DropItem,
	MapTreeNode,
	TreeNodeModel,
	TreeProps
} from "./tree.behavior.api.js";

export function DragDrop<InProps extends TreeProps, OutProps extends InProps & DragAndDropTreeProps>(
	Target: ComponentType<InProps>
): ComponentType<OutProps> {
	return class DragDrop extends PureComponent<OutProps> {
		static displayName = "DragDrop";
		render(): ReactNode {
			return <Target {...this.props} root={this.props.root} tplTreeNode={this.tplTreeNode} />;
		}
		private tplTreeNode: MapTreeNode = (n, chained) => {
			return this.props.tplTreeNode(
				n,
				tplTreeNode(
					n,
					this.props.onDragDrop,
					chained,
					this.props.canDrop,
					this.props.type,
					this.props.onBeginDrag,
					this.props.onEndDrag,
					this.props.canDrag,
					this.props.strictDnD
				)
			);
		};
	};
}

function tplTreeNode(
	node: TreeNodeModel,
	onDragDrop: (dragSource: DragItem, dropTarget: DropItem) => void,
	chained: TreeNodeTemplateModel,
	canDrop?: (hovering: any, dragging: any, isDropHint: boolean) => boolean,
	type?: string,
	onBeginDrag?: (dragSource: DragItem) => void,
	onEndDrag?: (dragSource: DragItem) => void,
	canDrag?: (dragSource: DragItem) => boolean,
	strictDnD = true
): DnDTreeNode {
	return {
		...chained,
		onDragDrop,
		canDrop,
		canDrag,
		type,
		onBeginDrag,
		onEndDrag,
		strictDnD,
		children: node.children
			? node.children.map((child) => tplTreeNode(child, onDragDrop, chained, canDrop, type, onBeginDrag, onEndDrag))
			: undefined
	};
}

export const TreeValidator: {
	(tree: TreeNodeModel, dragSource: DragItem, dropTarget: DropItem): boolean;
} = (tree, dragSource, dropTarget) => {
	// Root node can't be dragged
	if (tree === dragSource.node) {
		return false;
	}

	if (dropTarget.node === undefined) {
		// Can't drag a node into its own position
		if (dropTarget.precedingNode !== undefined && dragSource.node === dropTarget.precedingNode) {
			return false;
		}

		if (dropTarget.subsequentNode !== undefined && dragSource.node === dropTarget.subsequentNode) {
			return false;
		}

		// Can't drag a node and drop it inside itself
		if (dragSource.node === dropTarget.parentNode || checkDescendantNode(dragSource.node, dropTarget.parentNode!)) {
			return false;
		}

		return true;
	} else {
		// A node can't be child of its descendant node
		if (checkDescendantNode(dragSource.node, dropTarget.node!)) {
			return false;
		}

		// A node can not be dragged into its parent node
		if (dropTarget.node === dragSource.parentNode) {
			return false;
		}

		// can be checked by enclosing component
		if (dropTarget.node !== undefined) {
			return true;
		}

		return false;
	}
};

export function checkDescendantNode(fatherNode: TreeNodeModel, checkedNode: TreeNodeModel | undefined): boolean {
	if (fatherNode.children) {
		for (const node of fatherNode.children) {
			if (node === checkedNode || node.id === checkedNode?.id) {
				return true;
			}

			const result = checkDescendantNode(node, checkedNode);

			if (result) {
				return true;
			}
		}
	}

	return false;
}
