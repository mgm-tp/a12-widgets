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

import { updateTreeNode } from "./tree.js";

export function useTableData(
	data: DragAndDrop.UiData,
	rootNodeId: number,
	position: DragAndDrop.Position
): DragAndDrop.TableRow[] {
	function buildTableRow(nodeId: number): DragAndDrop.TableRow | undefined {
		const node = data[nodeId];

		if (!node || !DragAndDrop.isTableRow(node)) {
			return undefined;
		}

		if (node.position.component !== position.component || node.position.side !== position.side) {
			return undefined;
		}

		return node;
	}

	const rootNode = data[rootNodeId];

	if (!DragAndDrop.isTreeNode(rootNode) || !rootNode.children) {
		throw new Error(`Cannot build table rows with root ID ${rootNodeId}`);
	}

	return rootNode.children.map(buildTableRow).filter((row): row is DragAndDrop.TableRow => !!row);
}

export function updateTableRow(
	data: DragAndDrop.UiData,
	nodeId: number,
	updater: (currentNode: DragAndDrop.TableRow) => DragAndDrop.TableRow
): DragAndDrop.UiData {
	const node = data[nodeId];

	if (!DragAndDrop.isTableRow(node)) {
		throw new Error(`Invalid table row ${nodeId}`);
	}

	return { ...data, [nodeId]: updater(node) };
}

export function addTableRowReference(
	data: DragAndDrop.UiData,
	tableRootId: number,
	rowId: number,
	rowIndex: number
): DragAndDrop.UiData {
	return updateTreeNode(data, tableRootId, (tableRoot) => {
		const children = tableRoot.children ?? [];

		return {
			...tableRoot,
			children: [...children.slice(0, rowIndex), rowId, ...children.slice(rowIndex)]
		};
	});
}

export function removeTableRowReference(
	data: DragAndDrop.UiData,
	tableRootId: number,
	rowId: number,
	rowIndex: number
): DragAndDrop.UiData {
	if (!DragAndDrop.isTableRow(data[rowId])) {
		throw new Error(`The row with ID ${rowId} is not exist`);
	}

	const nextData = updateTreeNode(data, tableRootId, (tableRoot) => {
		const children = tableRoot.children ?? [];

		return {
			...tableRoot,
			children: [...children.slice(0, rowIndex), ...children.slice(rowIndex + 1)]
		};
	});

	return { ...nextData };
}
