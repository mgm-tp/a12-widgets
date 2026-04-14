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

import type { ReactElement } from "react";
import { useState, useCallback } from "react";
import { produce } from "immer";

import type {
	CollapsibleTreeNodeModel,
	DragItem,
	DropItem,
	MapTreeNode,
	SelectableTreeNodeModel
} from "@com.mgmtp.a12.widgets/widgets-core";
import {
	checkDescendantNode,
	Collapsible,
	DnDTree,
	DragDrop,
	find,
	findById,
	Selectable,
	TreeAdapter,
	Counter,
	Tooltip,
	Icon
} from "@com.mgmtp.a12.widgets/widgets-core";

import { Icons } from "./common.js";

const InteractiveTree = Selectable(DragDrop(Collapsible(TreeAdapter(DnDTree))));

interface FileNode extends CollapsibleTreeNodeModel, SelectableTreeNodeModel {
	type: "computer" | "drive" | "folder" | "file";
	children?: FileNode[];
	locked?: boolean;
}

const tplTreeNode: MapTreeNode = (n, chained) => {
	return {
		...chained,
		fileNode: n
	};
};

export function DragAndDropNode(): ReactElement {
	const [tree, setTree] = useState<FileNode>(TREE);

	const canDrag = useCallback((_dragSource: any): boolean => {
		return !_dragSource.node.fileNode.locked;
	}, []);

	const canDrop = useCallback(
		(hovering: any, dragging: any, isDropHint: boolean): boolean => {
			const dragItemNode = findById(tree, dragging.node.fileNode.id);

			if (!isDropHint) {
				const hoverItemNode = hovering.node.fileNode;

				if (
					hoverItemNode.id === dragItemNode.id ||
					dragItemNode.type === "drive" ||
					dragging.parentNode?.fileNode?.id === hoverItemNode.id ||
					dragItemNode.id === hovering.parentNode?.fileNode?.id ||
					checkDescendantNode(dragItemNode, hovering.node) ||
					hoverItemNode.type === "computer" ||
					hoverItemNode.type === "file" ||
					hoverItemNode.locked
				) {
					return false;
				}
			} else {
				// A node can't be dropped before itself
				if (hovering.subsequentNode && hovering.subsequentNode.fileNode.id === dragItemNode.id) {
					return false;
				}

				// A node can't be dropped after itself
				if (hovering.precedingNode && hovering.precedingNode.fileNode.id === dragItemNode.id) {
					return false;
				}

				// A node can't be dropped into its child
				if (checkDescendantNode(dragItemNode, hovering.subsequentNode || hovering.precedingNode)) {
					return false;
				}

				if (hovering.parentNode) {
					return dragItemNode.type === "drive"
						? hovering.parentNode.fileNode.type === "computer"
						: hovering.parentNode.fileNode.type !== "computer";
				}
			}

			return true;
		},
		[tree]
	);

	const onDragDrop = useCallback((_dragSource: DragItem, _dropTarget: DropItem): void => {
		if (!_dragSource || !_dropTarget || !(_dropTarget.node || _dropTarget.parentNode)) {
			return;
		}

		setTree((prevState) => {
			return produce(prevState, (draft) => {
				// first, convert back to original nodes
				const dragSource = {
					node: findById(draft, _dragSource.node.id),
					parentNode: _dragSource.parentNode ? findById(draft, _dragSource.parentNode?.id) : undefined
				};

				const dropTarget = {
					node: _dropTarget.node ? findById(draft, _dropTarget.node?.id) : undefined,
					parentNode: _dropTarget.parentNode ? findById(draft, _dropTarget.parentNode?.id) : undefined,
					precedingNode: _dropTarget.precedingNode ? findById(draft, _dropTarget.precedingNode?.id) : undefined,
					subsequentNode: _dropTarget.subsequentNode ? findById(draft, _dropTarget.subsequentNode?.id) : undefined
				};

				// determine new location in files
				let newParent: FileNode | undefined;
				let newIndex: number;
				const dragParent = dragSource.parentNode;
				const dropParent = dropTarget.parentNode;

				// drop before a node
				if (dropTarget.subsequentNode) {
					const dropTargetIndex = dropParent?.children?.indexOf(dropTarget.subsequentNode);
					const dragSourceIndex = dropParent?.children?.indexOf(dragSource.node);

					if (dropTargetIndex === undefined || dragSourceIndex === undefined) {
						return;
					}

					newParent = dropTarget.parentNode;

					if (dragSourceIndex === -1) {
						// if the drag source does not exist in the same folder, the new index will be where the drop target is
						newIndex = dropTargetIndex;
					} else {
						// --- drag source already exists in the same folder ---

						// if the drag source is before the drop target
						if (dragSourceIndex < dropTargetIndex) {
							// - if it is next to the drop target, keep the current index
							// - if there is at least 1 node between the drag source and drop target, the new index will be right before the drop target
							newIndex = dropTargetIndex === dragSourceIndex + 1 ? dragSourceIndex : dropTargetIndex - 1;
						} else {
							// if the drag source is after the drop target, the new index will be where the drop target is
							newIndex = dropTargetIndex;
						}
					}
				} else if (dropTarget.precedingNode) {
					// drop after a node
					const dropTargetIndex = dropParent?.children?.indexOf(dropTarget.precedingNode);
					const dragSourceIndex = dropParent?.children?.indexOf(dragSource.node);

					if (dropTargetIndex === undefined || dragSourceIndex === undefined) {
						return;
					}

					newParent = dropTarget.parentNode;

					if (dragSourceIndex === -1) {
						// if the drag source does not exist in the same folder, the new index will be next after to the drop target
						newIndex = dropTargetIndex + 1;
					} else {
						// --- drag source already exists in the same folder ---

						// if the drag source is after the drop target
						if (dragSourceIndex > dropTargetIndex) {
							// - if it is next to the drop target, keep the current index
							// - if there is at least 1 node between the drag source and drop target, the new index will be right after the drop target
							newIndex = dropTargetIndex === dragSourceIndex - 1 ? dragSourceIndex : dropTargetIndex + 1;
						} else {
							// if the drag source is before the drop target, the new index will be where the drop target is
							newIndex = dropTargetIndex;
						}
					}
				} else {
					// drop into a folder
					newParent = dropTarget.node;
					newIndex = 0;
				}

				// conduct operation
				if (dragSource.node && newParent) {
					const oldSourceIndex = dragParent?.children?.indexOf(dragSource.node);

					// remove the source node after dragging finished
					if (oldSourceIndex !== undefined) {
						dragParent?.children?.splice(oldSourceIndex, 1);
					}

					if (newParent.children === undefined) {
						newParent.children = [];
					}

					// insert the source node into the new parent after dragging finished
					newParent.children.splice(newIndex, 0, dragSource.node);
					newParent.initiallyExpanded = true;
				}
			});
		});
	}, []);

	const onToggleSelection = useCallback((node: SelectableTreeNodeModel): void => {
		if (node.id) {
			setTree(
				produce((draft) => {
					const toggledNode = findById(draft, node.id);
					const previouslySelectedNode = find(draft, (n) => n.selected === true);

					if (previouslySelectedNode) {
						if (previouslySelectedNode === toggledNode) {
							toggledNode.selected = !toggledNode.selected;
						} else {
							previouslySelectedNode.selected = false;
							toggledNode.selected = true;
						}
					} else {
						toggledNode.selected = true;
					}
				})
			);
		} else {
			throw new Error("node has no id");
		}
	}, []);

	return (
		<InteractiveTree
			id="combined-behaviour"
			root={tree}
			tplTreeNode={tplTreeNode}
			autoExpandOnDragOverTimeout={500}
			strictDnD={false}
			canDrag={canDrag}
			canDrop={canDrop}
			onDragDrop={onDragDrop}
			onToggleSelection={onToggleSelection}
		/>
	);
}

export const TREE: FileNode = {
	id: "drag-and-drop-1",
	label: "My Computer",
	icon: Icons.COMPUTER,
	type: "computer",
	initiallyExpanded: true,
	locked: true,
	children: [
		{
			id: "drag-and-drop-2",
			label: "C:",
			icon: <Counter value={10} type="constructive" />,
			type: "drive",
			initiallyExpanded: true,
			children: [
				{
					id: "drag-and-drop-3",
					label: "Programs",
					type: "folder",
					icon: Icons.FOLDER
				},
				{
					id: "drag-and-drop-4",
					label: "Temp",
					type: "folder",
					icon: <Counter value={10} overflowCount={9} />
				},
				{
					id: "drag-and-drop-5",
					label: "ZANS and quiet a long text, that it has to display multiline",
					type: "folder",
					icon: <img alt="" src="images/dnd_image.png" />,
					initiallyExpanded: true,
					children: [
						{
							id: "drag-and-drop-6",
							label: "System32",
							type: "folder",
							icon: Icons.FOLDER,
							initiallyExpanded: true,
							children: [
								{
									id: "drag-and-drop-7",
									label: "sasser.dll",
									type: "file",
									icon: Icons.FILE
								}
							]
						}
					]
				},
				{
					id: "drag-and-drop-8",
					label: "swap.sys",
					type: "file",
					icon: (
						<Tooltip text="Counter with tooltip">
							<Counter value={3} addonAfter={<Icon>done</Icon>} type="destructive" />
						</Tooltip>
					)
				},
				{
					id: "drag-and-drop-9",
					label: "Locked",
					type: "folder",
					icon: Icons.FOLDER,
					locked: true
				}
			]
		},
		{
			id: "drag-and-drop-10",
			label: "D:",
			type: "drive",
			icon: Icons.DRIVE,
			selected: true
		},
		{
			id: "drag-and-drop-11",
			label: "E:",
			type: "drive",
			icon: Icons.DRIVE,
			children: [
				{
					id: "drag-and-drop-12",
					label: "autostart.bat",
					type: "file",
					icon: Icons.FILE
				}
			]
		}
	]
};
