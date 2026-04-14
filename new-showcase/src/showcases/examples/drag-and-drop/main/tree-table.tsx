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

import type {
	BaseTreeTableColumnType,
	BaseTreeTableNode,
	FlattenTreeTableNode,
	TreeTableDragDropOptions,
	TreeTableRenderPropsType,
	TreeTableRowEventHandlers,
	TreeTableRowStyling
} from "@com.mgmtp.a12.widgets/widgets-core";
import { TreeTable } from "@com.mgmtp.a12.widgets/widgets-core";

import type { DragAndDrop, TreeDragItem, TreeDropTarget } from "./showcase-drag-and-drop.api.js";

export interface TreeTableNode extends BaseTreeTableNode<DragAndDrop.Data> {
	position: DragAndDrop.Position;
}

export type TreeTableDragItem = TreeTableRenderPropsType.DragObject<TreeTableNode>;
export function isTreeTableDragItem(o: any): o is TreeTableDragItem {
	return o["rowIndex"] !== undefined && o["row"]?.["position"]?.["component"] === "tree-table";
}

export type TreeTableDropResult = TreeTableRenderPropsType.DropResult<FlattenTreeTableNode<TreeTableNode>>;
export function isTreeTableDropResult(o: any): o is TreeTableDropResult {
	return o["rowIndex"] !== undefined && o["row"]?.["position"]?.["component"] === "tree-table";
}

export type TreeTableHoveredObject = TreeTableRenderPropsType.HoveredObject<FlattenTreeTableNode<TreeTableNode>>;
export function isTreeTableHoveredObject(o: any): o is TreeTableHoveredObject {
	return o["rowIndex"] !== undefined && o["row"]?.["position"]?.["component"] === "tree-table";
}

type TreeTableDndOptions = TreeTableDragDropOptions<
	TreeTableNode,
	TreeDragItem | TreeTableDragItem,
	TreeDropTarget | TreeTableDropResult,
	TreeDropTarget | TreeTableHoveredObject
>;
export interface DragAndDropTableProps {
	data: DragAndDrop.TableRow[];
	onDrop: NonNullable<TreeTableDndOptions["onDrop"]>;
	canDrop: NonNullable<TreeTableDndOptions["canDrop"]>;
	acceptType?: string;
}

type TreeTableNodeColumn = BaseTreeTableColumnType<TreeTableNode>;
const COLUMNS: TreeTableNodeColumn[] = [
	{ label: "Name", hierarchical: true, pinning: "left", width: 1.5 },
	{ label: "Workplace" },
	{ label: "Phone Number" },
	{ label: "Description" }
];

export interface DragAndDropTreeTableProps {
	root: TreeTableNode;
	onDrop: NonNullable<DragAndDropTableProps["onDrop"]>;
	canDrop: NonNullable<DragAndDropTableProps["canDrop"]>;
	acceptType?: string;
}

export function DragAndDropTreeTable(props: DragAndDropTreeTableProps): ReactElement<DragAndDropTreeTableProps> {
	const [selectedNode, setSelectedNode] = useState<number | undefined>();
	const [collapsedNodes, setCollapsedNodes] = useState<{ [key: number]: boolean }>({});
	const rowEventHandlers: TreeTableRowEventHandlers = useCallback(({ row }) => {
		return {
			onArrowClick() {
				setCollapsedNodes((currentCollapsedNodes) => ({
					...currentCollapsedNodes,
					[row.id]: !currentCollapsedNodes[row.id]
				}));
			},
			onClick() {
				setSelectedNode(row.id);
			}
		};
	}, []);

	const rowStyling: TreeTableRowStyling = useCallback(
		({ row }) => {
			return {
				collapsed: collapsedNodes[row.id],
				selected: row.id === selectedNode
			};
		},
		[collapsedNodes, selectedNode]
	);

	const canDrag: Required<TreeTableDndOptions>["canDrag"] = useCallback(
		({ dragItem }) => {
			return isTreeTableDragItem(dragItem) && dragItem.row.id !== props.root.id;
		},
		[props.root]
	);

	return (
		<TreeTable
			root={props.root}
			columns={COLUMNS}
			rowEventHandlers={rowEventHandlers}
			rowStyling={rowStyling}
			dragDropOptions={{ acceptType: props.acceptType, onDrop: props.onDrop, canDrop: props.canDrop, canDrag }}
		/>
	);
}
