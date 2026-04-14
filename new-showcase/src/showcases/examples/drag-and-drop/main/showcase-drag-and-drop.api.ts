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
	CollapsibleTreeNodeModel,
	DragItem,
	DropItem,
	SelectableTreeNodeModel,
	TreeNodeModel
} from "@com.mgmtp.a12.widgets/widgets-core";

export namespace DragAndDrop {
	export type NodeID = any;

	export type Data = ReactNode[];

	export interface UiData {
		[key: number]: TreeNode | TableRow | TreeTableNode | undefined;
	}

	export interface TreeNode {
		id?: NodeID;
		type: "tree";
		data: Data;
		children?: NodeID[];
		position: Position;
	}
	export function isTreeNode(o: TreeNode | TableRow | TreeTableNode | undefined): o is TreeNode {
		return o?.position.component === "tree";
	}

	export interface Position {
		component: "tree" | "table" | "tree-table";
		side: "left" | "right";
	}

	export interface TreeTableNode {
		id: NodeID;
		data: Data;
		position: Position;
		children?: NodeID[];
	}
	export function isTreeTableNode(o: TreeNode | TableRow | TreeTableNode | undefined): o is TreeTableNode {
		return o?.position.component === "tree-table";
	}

	export interface TableRow {
		id?: NodeID;
		position: Position;
		data: Data;
	}

	export function isTableRow(o: TreeNode | TableRow | TreeTableNode | undefined): o is TableRow {
		return o?.position.component === "table";
	}

	export const UniqueDnDType = "TreeAndTable";
}

export interface TreeNode extends TreeNodeModel, CollapsibleTreeNodeModel, SelectableTreeNodeModel {
	data: DragAndDrop.Data;
	children?: TreeNode[];
}

export interface TreeDragItem extends DragItem {
	node: TreeNode;
	parentNode?: TreeNode & {
		children: TreeNode[];
	};
}
export interface TreeDropTarget extends DropItem {
	node: TreeNode;
	parentNode?: TreeNode & {
		children: TreeNode[];
	};
}
