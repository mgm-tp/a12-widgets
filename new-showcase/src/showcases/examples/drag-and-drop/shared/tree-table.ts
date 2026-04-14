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

import { DragAndDrop } from "../main/showcase-drag-and-drop.api.js";
import type { TreeTableNode } from "../main/tree-table.js";

export function useTreeTableData(
	data: DragAndDrop.UiData,
	rootNodeId: number,
	position: DragAndDrop.Position
): TreeTableNode {
	function buildTreeTable(nodeId: number): TreeTableNode | undefined {
		const node = data[nodeId];

		if (!node || !DragAndDrop.isTreeTableNode(node)) {
			return undefined;
		}

		if (node.position.component === position.component && node.position.side === position.side) {
			return {
				...node,
				children: node.children?.map(buildTreeTable).filter((node): node is TreeTableNode => !!node)
			};
		}

		return undefined;
	}

	const treeTable = buildTreeTable(rootNodeId);

	if (!treeTable) {
		throw new Error(`Cannot build tree table from ID ${rootNodeId}`);
	}

	return treeTable;
}

export function updateTreeTableNode(
	data: DragAndDrop.UiData,
	nodeId: number,
	updater: (currentNode: DragAndDrop.TreeTableNode) => DragAndDrop.TreeTableNode
): DragAndDrop.UiData {
	const node = data[nodeId];

	if (!DragAndDrop.isTreeTableNode(node)) {
		throw new Error(`Invalid tree node ${nodeId}`);
	}

	return { ...data, [nodeId]: updater(node) };
}
