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
import { useState, useMemo } from "react";

import type {
	BaseTreeTableNode,
	FlattenTreeTableNode,
	TreeTableDragDropOptions
} from "@com.mgmtp.a12.widgets/widgets-core";
import { TreeTableNodeDropPosition } from "@com.mgmtp.a12.widgets/widgets-core";

export interface FileNodeData {
	type: "computer" | "drive" | "folder" | "file";
	name: ReactNode;
	otherCells: ReactNode[];
	locked?: boolean;
}

export type FileNode = BaseTreeTableNode<FileNodeData>;

export function useDndTreeTable(
	initialRoot: FileNode
): [FileNode, TreeTableDragDropOptions<FlattenTreeTableNode<FileNode>>] {
	const [root, setRoot] = useState(initialRoot);
	const dnd: TreeTableDragDropOptions<FlattenTreeTableNode<FileNode>> = useMemo(
		() => ({
			canDrag: ({ dragItem }): boolean => {
				if (dragItem.row.data.locked) {
					return false;
				}

				return dragItem.row.data.type !== "computer";
			},
			canDrop({ hoveredItem, dragItem }): boolean {
				if (
					hoveredItem.row.data.locked ||
					hoveredItem.row.data.type === "computer" ||
					dragItem.row.id === hoveredItem.row.id ||
					(hoveredItem.position === TreeTableNodeDropPosition.AS_CHILD &&
						dragItem.row.parent?.id === hoveredItem.row.id)
				) {
					return false;
				}

				let parent = hoveredItem.row.parent;

				while (parent) {
					if (parent.id === dragItem.row.id) {
						return false;
					}

					parent = parent.parent;
				}

				switch (dragItem.row.data.type) {
					case "computer":
						return false;
					case "drive": {
						if (
							hoveredItem.position === TreeTableNodeDropPosition.TOP ||
							hoveredItem.position === TreeTableNodeDropPosition.BOTTOM
						) {
							return hoveredItem.row.data.type === "drive";
						}

						return false;
					}

					case "folder":
						if (
							hoveredItem.position === TreeTableNodeDropPosition.TOP ||
							hoveredItem.position === TreeTableNodeDropPosition.BOTTOM
						) {
							return hoveredItem.row.data.type === "folder" || hoveredItem.row.data.type === "file";
						}

						return hoveredItem.row.data.type === "drive" || hoveredItem.row.data.type === "folder";
					case "file": {
						if (
							hoveredItem.position === TreeTableNodeDropPosition.TOP ||
							hoveredItem.position === TreeTableNodeDropPosition.BOTTOM
						) {
							return hoveredItem.row.data.type === "folder" || hoveredItem.row.data.type === "file";
						}

						return hoveredItem.row.data.type === "drive" || hoveredItem.row.data.type === "folder";
					}

					default:
						return false;
				}
			},
			onDrop({ dragItem, dropResult }): void {
				setRoot((currentRoot) => {
					function update(node: FileNode): FileNode {
						let newChildren = node.children?.filter(({ id }) => dragItem.row.id !== id);

						if (dropResult.position === TreeTableNodeDropPosition.AS_CHILD && node.id === dropResult.row.id) {
							const newNode: FileNode = dragItem.row;
							newChildren = newChildren ? [...newChildren, newNode] : [newNode];
						}

						if (
							dropResult.position === TreeTableNodeDropPosition.TOP ||
							dropResult.position === TreeTableNodeDropPosition.BOTTOM
						) {
							const childIndex = newChildren?.findIndex(({ id }) => id === dropResult.row.id) ?? -1;

							if (newChildren && childIndex >= 0) {
								const newNode: FileNode = dragItem.row;
								const isDroppedOnTop = dropResult.position === TreeTableNodeDropPosition.TOP;
								const slicedIndex = isDroppedOnTop ? childIndex : childIndex + 1;
								newChildren = [...newChildren.slice(0, slicedIndex), newNode, ...newChildren.slice(slicedIndex)];
							}
						}

						newChildren = newChildren && newChildren.length > 0 ? newChildren.map(update) : undefined;
						const { id, data, icon } = node;

						return { id, data, icon, children: newChildren };
					}

					return update(currentRoot);
				});
			}
		}),
		[]
	);

	return [root, dnd];
}
