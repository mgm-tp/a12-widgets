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
import { render } from "test-utils";
import { describe, expect, test } from "vitest";
import { page } from "vitest/browser";

import { DragAndDropUtils } from "../../common/main/drag-and-drop-utils.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { TextOutput } from "../../text-output/index.js";

import { TreeTable } from "../main/tree-table.view.js";
import type { BaseTreeTableColumnType, BaseTreeTableNode } from "../main/tree-table.api.js";

interface DnDNodeData {
	type: string;
	name: string;
}

type DnDNode = BaseTreeTableNode<DnDNodeData>;

function DnDTreeTableExample({ tree }: { tree: DnDNode }): ReactNode {
	const [root, setRoot] = useState<DnDNode>(tree);

	const dnd = useMemo(
		() => ({
			canDrag: (): boolean => true,
			canDrop: (): boolean => true,
			onDrop({ dragItem, dropResult }: { dragItem: { row: DnDNode }; dropResult: { row: DnDNode } }): void {
				setRoot((currentRoot) => {
					function update(node: DnDNode): DnDNode {
						let newChildren = node.children?.filter(({ id }) => dragItem.row.id !== id);

						if (node.id === dropResult.row.id) {
							const newNode: DnDNode = dragItem.row;
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

	const COLUMNS: BaseTreeTableColumnType<DnDNode>[] = [
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
			<TreeTable<DnDNode> root={root} columns={COLUMNS} dragDropOptions={dnd} id="dnd-tree-table" />
		</DndProvider>
	);
}

const TREE: DnDNode = {
	id: 1,
	data: {
		type: "computer",
		name: "My Computer"
	},
	children: [
		{
			id: 2,
			data: {
				type: "drive",
				name: "C:"
			},
			children: [
				{
					id: 3,
					data: {
						type: "folder",
						name: "Programs"
					}
				},
				{
					id: 4,
					data: {
						type: "folder",
						name: "Temp"
					}
				}
			]
		},
		{
			id: 5,
			data: { type: "drive", name: "D:" },
			children: [
				{
					id: 6,
					data: {
						type: "folder",
						name: "A"
					}
				},
				{
					id: 7,
					data: {
						type: "folder",
						name: "B"
					}
				}
			]
		}
	]
};

describe("Tree table drag and drop tests", () => {
	test("should drag and drop a tree node", async () => {
		const { container } = render(<DnDTreeTableExample tree={TREE} />);
		const tree = container.querySelector("#dnd-tree-table") as HTMLElement;

		expect(tree).toBeVisible();

		const treeNodes = Array.from(tree.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Tree.Node}"]`));
		const treeNodeNames = tree.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Tree.Node.Name}"]`);

		const parentNodeEl = Array.from(treeNodeNames).find((el) => el.textContent?.includes("C:"));
		const parentNodeText = parentNodeEl?.textContent;

		const dropTargetEl = treeNodes.find((el) => el.textContent?.includes("Programs"))!;
		const draggableEl = treeNodes.find((el) => el.textContent?.includes("Temp"))!;

		expect(draggableEl).toBeVisible();
		expect(dropTargetEl).toBeVisible();

		const dropNodeName = dropTargetEl.querySelector<HTMLElement>(
			`[data-role="${DataRoles.Tree.Node.Name}"]`
		)!.textContent;
		const dragText = draggableEl.textContent;

		expect(dragText).not.toContain(dropNodeName);
		expect(dragText).toContain(parentNodeText);

		const draggableLocator = page.elementLocator(draggableEl);
		const dropTargetLocator = page.elementLocator(dropTargetEl);

		await draggableLocator.dropTo(dropTargetLocator);

		const draggedNodeText = draggableEl.textContent;

		expect(draggedNodeText).toContain(dropNodeName);
		expect(draggedNodeText).not.toContain(parentNodeText);
	});

	test("cannot drag a tree node when dragging an interactive element", async () => {
		const { container } = render(<DnDTreeTableExample tree={TREE} />);
		const tree = container.querySelector("#dnd-tree-table") as HTMLElement;

		expect(tree).toBeVisible();

		const treeNodes = Array.from(tree.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Tree.Node}"]`));
		const treeNodeNames = tree.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Tree.Node.Name}"]`);

		const parentNodeEl = Array.from(treeNodeNames).find((el) => el.textContent?.includes("My Computer"));
		const parentNodeText = parentNodeEl?.textContent;

		const dropTargetEl = treeNodes.find((el) => el.textContent?.includes("Programs"))!;
		const draggableEl = treeNodes.filter((el) => el.textContent?.includes("D:"))[0];
		const interactiveEl = draggableEl.querySelector("button")!;

		expect(interactiveEl).toBeVisible();

		const dragText = draggableEl.textContent;
		const dropNodeName = dropTargetEl.querySelector<HTMLElement>(
			`[data-role="${DataRoles.Tree.Node.Name}"]`
		)!.textContent;

		expect(dragText).not.toContain(dropNodeName);
		expect(dragText).toContain(parentNodeText);
		expect(dropTargetEl).toBeVisible();

		const interactiveLocator = page.elementLocator(interactiveEl);
		const dropTargetLocator = page.elementLocator(dropTargetEl);

		await interactiveLocator.dropTo(dropTargetLocator);

		expect(dragText).not.toContain(dropNodeName);
		expect(dragText).toContain(parentNodeText);
	});
});
