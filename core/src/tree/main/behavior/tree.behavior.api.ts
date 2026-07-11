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
 * This is the behavioral API for trees.
 *
 * Behaviors add specific functionality to a Tree.
 *
 * Behaviors can be chained.
 *
 * The first behavior in the chain must be TreeAdapter.
 *
 * Warning: Users (and behaviors) must not rely on object equality of nodes, because behaviors can wrap / replace
 * tree nodes in order to implement their functionality. Instead, the {@link TreeNodeModel} must be used.
 */ /***/
import type { RefCallback, ReactNode } from "react";

import type { Identifiable, Styleable } from "../../../common/main/base-props.js";

import type { TreeHighlightVariant, TreeNodeTemplateModel } from "../tpl/tree.tpl.api.js";

export interface MapTreeNode<TplType extends TreeNodeTemplateModel = TreeNodeTemplateModel> {
	(treeNode: TreeNodeModel, chained: TreeNodeTemplateModel): TplType;
}

/** Props of {@link TreeNodeModel} */
export interface TreeProps extends Styleable, Identifiable {
	/**
	 * Root of the tree.
	 */
	root: TreeNodeModel;

	/**
	 * Template mapping for the tree node.
	 */
	tplTreeNode: MapTreeNode;

	/**
	 * A callback to get the reference of the tree.
	 */
	getDOMRef?: RefCallback<HTMLElement>;

	/**
	 * Get a handler which helps to scroll to a node's position in the container.
	 * @param handler – scroll to a node based on its id
	 */
	scrollToNode?(handler: (nodeId: string | number) => void): void;

	/**
	 * Whether the top-level node should be hidden.
	 */
	hideRoot?: boolean;
}

/**
 * Model of a tree (node). Use it to define your hierarchy of elements in a tree structure.
 */
export interface TreeNodeModel {
	/**
	 * Identifier of a tree node, which is mainly used to distinct the node.
	 */
	id?: any;

	/**
	 * Label of the node.
	 */
	label: ReactNode;

	/**
	 * Optional symbol of the node. Normally should be an Icon.
	 */
	icon?: ReactNode;

	/**
	 * Whether the node uses the background highlight color.
	 */
	highlightVariant?: TreeHighlightVariant;

	/**
	 * Defines sub-nodes.
	 */
	children?: TreeNodeModel[];

	/**
	 * Whether the node is disabled.
	 */
	disabled?: boolean;

	/**
	 * @internal
	 */
	level?: number;
}

/** Callback for {@link walkTreeNode} */
export interface TreeVisitor<T extends TreeNodeModel = TreeNodeModel> {
	(node: T): boolean | void;
}

/** Walk the given node in DFS. */
export function walkTreeNode<T extends TreeNodeModel>(node: T, visitor: TreeVisitor<T>): void {
	const descend = visitor(node);

	if (descend !== false && node.children) {
		for (const child of node.children) {
			walkTreeNode(child as T, visitor);
		}
	}
}

/** Search the given node with the given id. Throws if the node could not be found. */
export function findById<T extends TreeNodeModel>(root: T, id: any): T {
	const result = find(root, (node) => node.id === id);

	if (result === undefined) {
		throw new Error("node not found: " + id);
	}

	return result;
}

/** Search the given tree for a node that matches the given predicate. */
export function find<T extends TreeNodeModel>(root: T, predicate: (node: T) => boolean): T | undefined {
	let result: T | undefined;
	walkTreeNode(root, (node) => {
		if (predicate(node)) {
			result = node;

			return false;
		} else {
			return true;
		}
	});

	return result;
}

/** Apply IDs to all nodes in depth-first order starting with 1. */
export function applyId<T extends TreeNodeModel>(root: T): void {
	let id = 0;
	walkTreeNode(root, (node) => {
		node.id = ++id;
	});
}

/**
 * Find an HTML DOM Node, with given Tree ID. This utility is provided to encapsulate the HTML ID.
 * @param id – from {@link TreeNodeModel}.id
 */
export function findTreeHTMLNodeById(id: string): HTMLElement | null {
	return document.getElementById(`tree-node-content-${id}`);
}

// -------------------TREE COLLAPSIBLE-----------------------------------
export type IdType = string | number;

/**
 * Props of the {@link Collapsible} behavior.
 * Currently, only defines that all nodes in the tree are of type {@link CollapsibleTreeNodeModel}.
 */
export interface CollapsibleTreeProps extends TreeProps {
	/**
	 * Root of the tree.
	 */
	root: CollapsibleTreeNodeModel;

	/**
	 * Timeout (ms) to automatically expand a node when being dragged over.
	 */
	autoExpandOnDragOverTimeout?: number;

	/**
	 * Handler for collapsing a node.
	 */
	collapseNodeHandler?(handler: (id: IdType) => void): void;

	/**
	 * Handler for expanding a node.
	 */
	expandNodeHandler?(handler: (id: IdType) => void): void;
}

export interface CollapsibleTreeNodeModel extends TreeNodeModel {
	/**
	 * Initial expansion state of the node.
	 * @default false (collapsed).
	 */
	initiallyExpanded?: boolean;

	/**
	 * Event that a change in expansion state has been requested.
	 * Only defined, if the node is collapsible (has children).
	 * This prop is populated by the component (you don't have to provide it).
	 * However, it must be wired to the respective template method in {@link TreeAdapter}.
	 */
	onToggleExpansion?(): void;
}

// -------------------TREE DRAG and DROP-----------------------------------
export interface DragItem {
	node: TreeNodeModel;
	parentNode?: TreeNodeModel;
}
export interface DropItem {
	node?: TreeNodeModel;
	precedingNode?: TreeNodeModel;
	subsequentNode?: TreeNodeTemplateModel;
	parentNode?: TreeNodeModel;
}

export interface DragAndDropTreeProps extends TreeProps {
	/**
	 * Whether the droppable area is limited.
	 * - If this prop is set to `true`,
	 * 		+ drop on top is allowed if the node is the first node at the current level.
	 * 		+ drop at bottom is allowed if the node is collapsed or does not have children.
	 * - If this prop is set to `false`, drop on top and bottom are both allowed on a node.
	 *
	 * @default `true`
	 */
	strictDnD?: boolean;

	/**
	 * Handler when the dragging begins.
	 */
	onBeginDrag?(dragSource: DragItem): void;

	/**
	 * Handler when the dropping is done.
	 */
	onDragDrop(dragSource: DragItem, dropTarget: DropItem): void;

	/**
	 * Handler when the dragging is finished.
	 */
	onEndDrag?(dragSource: DragItem): void;

	/**
	 * Whether the position can be dropped or not.
	 *
	 * @param hovering – hovering position.
	 * @param dragging – dragging position.
	 * @param isDropHint – has drop hint or not.
	 */
	canDrop?(hovering: any, dragging: any, isDropHint: boolean): boolean;

	/**
	 * Whether the source item can be dragged or not.
	 *
	 * @param dragSource – drag item
	 */
	canDrag?(dragSource: DragItem): boolean;

	/**
	 * Type of the tree node.
	 */
	type?: string;
}

// -------------------TREE SELECTABLE-----------------------------------
export interface SelectableTreeProps extends TreeProps {
	/**
	 * Root of the tree.
	 */
	root: SelectableTreeNodeModel;

	/**
	 * Whether users can scroll to the selected node.
	 */
	scrollSelectedNodeIntoView?: boolean;

	/**
	 * Callback if a change in selection has been requested.
	 */
	onToggleSelection(node: TreeNodeModel): void;
}

export interface SelectableTreeNodeModel extends TreeNodeModel {
	/**
	 * Whether the node is selected.
	 */
	selected?: boolean;

	/**
	 * Request to change selection state of the node.
	 * This prop is populated by the component (you don't have to provide it).
	 * However, it must be wired to the respective template method in {@link TreeAdapter}.
	 */
	onToggleSelection?(): void;
}
