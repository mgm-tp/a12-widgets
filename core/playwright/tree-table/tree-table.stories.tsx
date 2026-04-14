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
import { useMemo, useState } from "react";
import { DndProvider } from "react-dnd";

import type { BaseTreeTableColumnType, BaseTreeTableNode } from "../../src/tree-table/index.js";
import type { FileNode } from "../../src/tree-table/__tests__/data.js";
import { DragAndDropUtils } from "../../src/common/main/drag-and-drop-utils.js";
import { TreeTable } from "../../src/tree-table/index.js";
import { TextOutput } from "../../src/text-output/index.js";

interface DnDTreeTableExampleProps {
	tree: BaseTreeTableNode<any>;
}

export const DnDTreeTableExample = ({ tree }: DnDTreeTableExampleProps): ReactNode => {
	const [root, setRoot] = useState(tree);

	const dnd = useMemo(
		() => ({
			canDrag: () => true, // Allow all nodes to be draggable
			canDrop: () => true, // Allow dropping anywhere
			onDrop({ dragItem, dropResult }: any): void {
				setRoot((currentRoot) => {
					function update(node: FileNode): FileNode {
						let newChildren = node.children?.filter(({ id }) => dragItem.row.id !== id);

						if (node.id === dropResult.row.id) {
							const newNode: FileNode = dragItem.row;
							newChildren = newChildren ? [...newChildren, newNode] : [newNode];
						}

						return {
							...node,
							children: newChildren?.map(update) ?? newChildren
						};
					}

					return update(currentRoot);
				});
			}
		}),
		[]
	);

	const COLUMNS: BaseTreeTableColumnType<FileNode>[] = [
		{
			label: "Folder",
			horizontalAlignment: "left",
			hierarchical: true,
			width: 2,
			dataGetter: ({ row }): ReactNode => <TextOutput>{row.data.name}</TextOutput>
		},
		{ label: "Type", dataGetter: (): ReactNode => "file" }
	];

	return (
		<DndProvider backend={DragAndDropUtils.DefaultDndBackend} options={DragAndDropUtils.DefaultDndBackendOptions}>
			<TreeTable<FileNode> root={root} columns={COLUMNS} dragDropOptions={dnd} id="dnd-tree-table" />
		</DndProvider>
	);
};
