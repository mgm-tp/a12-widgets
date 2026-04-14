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

import type { FC } from "react";
import { useState, useCallback } from "react";

import { LayoutGrid, joinClassNames, provider } from "@com.mgmtp.a12.widgets/widgets-core";

import { DragAndDrop } from "./main/showcase-drag-and-drop.api.js";
import type { DragAndDropTreeProps } from "./main/tree.js";
import { DragAndDropTree, isTreeDragItem, isTreeDropTarget } from "./main/tree.js";
import { updateTreeNode, useTreeNodeData } from "./shared/tree.js";

const isPhone = provider.isPhone();

export const BetweenTwoTrees: FC = () => {
	const [data, setData] = useState(DATA);

	const dataGetter = useCallback<DragAndDropTreeProps["dataGetter"]>((node) => node.data[0], []);

	const findParent = useCallback(
		(id: DragAndDrop.NodeID): DragAndDrop.TreeNode | undefined => {
			let result: DragAndDrop.TreeNode | undefined;
			Object.keys(data).forEach((nodeId) => {
				const node = data[Number(nodeId)];

				if (DragAndDrop.isTreeNode(node) && node.children?.find((childId) => childId === id)) {
					result = node;
				}
			});

			return result;
		},
		[data]
	);

	const canDrop = useCallback<DragAndDropTreeProps["canDrop"]>(
		(dropTarget, dragSource) => {
			if (!isTreeDragItem(dragSource)) {
				return false;
			}

			if (dragSource.node.id === dropTarget.node.id) {
				return false;
			}

			if (dragSource.parentNode?.id === dropTarget.node.id) {
				return false;
			}

			let parent = findParent(dropTarget.node.id);

			while (parent) {
				if (parent.id === dragSource.node.id) {
					return false;
				}

				parent = findParent(parent.id);
			}

			return true;
		},
		[findParent]
	);

	const onDragDrop = useCallback<DragAndDropTreeProps["onDragDrop"]>((dragItem, dropTarget) => {
		if (!isTreeDragItem(dragItem) || !isTreeDropTarget(dropTarget)) {
			return;
		}

		setData((currentData) => {
			let nextData = { ...currentData };

			if (dragItem.parentNode?.id) {
				nextData = updateTreeNode(nextData, dragItem.parentNode.id, (parentNode) => ({
					...parentNode,
					children: parentNode.children?.filter((id) => id !== dragItem.node.id)
				}));
			}

			const droppedNode = nextData[dropTarget.node.id];
			const dragNode = nextData[dragItem.node.id];

			if (DragAndDrop.isTreeNode(droppedNode) && DragAndDrop.isTreeNode(dragNode)) {
				let nextDroppedNodeChildren = droppedNode.children || [];
				nextDroppedNodeChildren = nextDroppedNodeChildren.filter((id) => id !== dragItem.node.id);
				nextData = updateTreeNode(nextData, dropTarget.node.id, () => ({
					...droppedNode,
					children: [...nextDroppedNodeChildren, dragItem.node.id]
				}));
				nextData = updateTreeNode(nextData, dragItem.node.id, () => ({
					...dragNode,
					position: droppedNode.position
				}));
				const recursivelyUpdate = (node: DragAndDrop.TreeNode, position: DragAndDrop.Position) => {
					node.children?.forEach((id) => {
						const nodeData = nextData[id];

						if (DragAndDrop.isTreeNode(nodeData)) {
							nextData = { ...nextData, [id]: { ...nodeData, position } };
							recursivelyUpdate(nodeData, position);
						}
					});
				};

				recursivelyUpdate(dragNode, droppedNode.position);
			}

			return nextData;
		});
	}, []);

	const leftTree = useTreeNodeData(data, LEFT_TREE_ROOT_ID, { component: "tree", side: "left" });
	const rightTree = useTreeNodeData(data, RIGHT_TREE_ROOT_ID, { component: "tree", side: "right" });
	const { Grid, Row, Column } = LayoutGrid;

	return (
		<Grid fitToParent={isPhone}>
			<Row className={isPhone ? "-u-margin-xs" : "-u-margin-sm"}>
				<Column size={{ sm: 12, md: 6, lg: 6 }} className="-u-background-white">
					<DragAndDropTree
						root={leftTree}
						onDragDrop={onDragDrop}
						canDrop={canDrop}
						dataGetter={dataGetter}
						acceptType={DragAndDrop.UniqueDnDType}
					/>
				</Column>
				<Column
					size={{ sm: 12, md: 6, lg: 6 }}
					className={joinClassNames("-u-background-white", { ["-u-margin-t-xs"]: isPhone })}
				>
					<DragAndDropTree
						root={rightTree}
						onDragDrop={onDragDrop}
						canDrop={canDrop}
						dataGetter={dataGetter}
						acceptType={DragAndDrop.UniqueDnDType}
					/>
				</Column>
			</Row>
		</Grid>
	);
};

const LEFT_TREE_ROOT_ID = 1;
const RIGHT_TREE_ROOT_ID = 9;
const DATA: DragAndDrop.UiData = {
	1: {
		id: 1,
		data: ["1. Submission"],
		position: { component: "tree", side: "left" },
		children: [2]
	},
	2: {
		id: 2,
		data: ["1. Partner"],
		position: { component: "tree", side: "left" },
		children: [3, 4, 5, 6, 7, 8]
	},
	3: {
		id: 3,
		data: ["1. Client"],
		position: { component: "tree", side: "left" }
	},
	4: {
		id: 4,
		data: ["1. More Data"],
		position: { component: "tree", side: "left" }
	},
	5: {
		id: 5,
		data: ["1. Document"],
		position: { component: "tree", side: "left" }
	},
	6: {
		id: 6,
		data: ["1. Center"],
		position: { component: "tree", side: "left" }
	},
	7: {
		id: 7,
		data: ["1. Insurance Company"],
		position: { component: "tree", side: "left" }
	},
	8: {
		id: 8,
		data: ["1. Sub agent"],
		position: { component: "tree", side: "left" }
	},
	9: {
		id: 9,
		data: ["2. Submission"],
		position: { component: "tree", side: "right" },
		children: [10]
	},
	10: {
		id: 10,
		data: ["2. General Data"],
		position: { component: "tree", side: "right" },
		children: [11, 12, 13]
	},
	11: {
		id: 11,
		data: ["2. Client"],
		position: { component: "tree", side: "right" }
	},
	12: {
		id: 12,
		data: ["2. More Data"],
		position: { component: "tree", side: "right" }
	},
	13: {
		id: 13,
		data: ["2. Costs"],
		position: { component: "tree", side: "right" }
	}
};
