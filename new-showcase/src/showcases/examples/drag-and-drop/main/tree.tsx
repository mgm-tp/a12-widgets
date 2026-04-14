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

import type { ReactNode, FC } from "react";
import { useState, useMemo } from "react";

import { Collapsible, DnDTree, DragDrop, Selectable, TreeAdapter } from "@com.mgmtp.a12.widgets/widgets-core";

import type { DragAndDrop, TreeDragItem, TreeDropTarget, TreeNode } from "./showcase-drag-and-drop.api.js";
import type { TableDragItem, TableDropResult } from "./table.js";
import { isTableDragItem } from "./table.js";
import type { TreeTableDragItem, TreeTableDropResult } from "./tree-table.js";
import { isTreeTableDragItem } from "./tree-table.js";

const Tree = Selectable(DragDrop(Collapsible(TreeAdapter(DnDTree))));

export function isTreeDragItem(o: any): o is TreeDragItem {
	return o["node"];
}

export function isTreeDropTarget(o: any): o is TreeDropTarget {
	return o["node"];
}

export interface DragAndDropTreeProps {
	root: DragAndDrop.TreeNode;
	nodeStyling?(node: DragAndDrop.TreeNode): { collapsed: boolean };
	dataGetter(node: DragAndDrop.TreeNode): ReactNode;
	onDragDrop(
		dragItem: TreeDragItem | TableDragItem | TreeTableDragItem,
		dropTarget: TableDropResult | TreeDropTarget | TreeTableDropResult
	): void;
	canDrop(dropTarget: TreeDropTarget, dragSource: TreeDragItem | TableDragItem | TreeTableDragItem): boolean;
	acceptType?: string;
}

export const DragAndDropTree: FC<DragAndDropTreeProps> = (props) => {
	const { dataGetter, nodeStyling } = props;
	const [selectedNode, setSelectedNode] = useState<DragAndDrop.NodeID | undefined>();

	const root = useMemo<TreeNode>(() => {
		function update(node: DragAndDrop.TreeNode): TreeNode {
			return {
				...node,
				label: dataGetter(node),
				initiallyExpanded: !nodeStyling?.(node).collapsed,
				selected: node.id === selectedNode,
				children: node.children?.map(update)
			};
		}

		return update(props.root);
	}, [props.root, dataGetter, nodeStyling, selectedNode]);

	return (
		<Tree
			root={root}
			onToggleSelection={({ id }) => setSelectedNode(id)}
			tplTreeNode={(_, chained) => chained}
			autoExpandOnDragOverTimeout={1000}
			onDragDrop={(dragSource, dropTarget) => props.onDragDrop(dragSource as never, dropTarget as never)}
			canDrop={(hovering, dragging) => {
				if (
					(isTreeDragItem(dragging) || isTableDragItem(dragging) || isTreeTableDragItem(dragging)) &&
					isTreeDropTarget(hovering)
				) {
					return props.canDrop(hovering, dragging);
				}

				return false;
			}}
			type={props.acceptType}
		/>
	);
};
