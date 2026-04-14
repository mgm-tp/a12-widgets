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

import type { BaseTreeTableNode } from "../../src/tree-table/index.js";

import { expect, test } from "../fixtures/playwright.config.js";

import { DnDTreeTableExample } from "./tree-table.stories.js";

test.describe("Tree table tests", () => {
	const TREE: BaseTreeTableNode = {
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

	test("should drag and drop a tree node", async ({ mount }) => {
		const component = await mount(<DnDTreeTableExample tree={TREE} />);
		const tree = component.locator("#dnd-tree-table");

		await expect(tree).toBeVisible();

		const parentNodeText = await tree.locator("#tree-node-2").locator("#tree-node-name-2").textContent();

		const dropTarget = tree.locator("#tree-node-3");
		const draggableNode = tree.locator("#tree-node-4");
		const dragText = await draggableNode.textContent();
		const dropNodeName = await dropTarget.locator("#tree-node-name-3").textContent();

		await expect(draggableNode).toBeVisible();

		expect(dragText).not.toContain(dropNodeName);
		expect(dragText).toContain(parentNodeText);

		await expect(dropTarget).toBeVisible();

		// Perform the drag and drop action
		await draggableNode.dragTo(dropTarget);

		const draggedNodeText = await draggableNode.textContent();

		expect(draggedNodeText).toContain(dropNodeName);
		expect(draggedNodeText).not.toContain(parentNodeText); // Check the node is dragged to another file.
	});

	test("cannot drag a tree node when dragging an interactive element", async ({ mount }) => {
		const component = await mount(<DnDTreeTableExample tree={TREE} />);
		const tree = component.locator("#dnd-tree-table");
		await expect(tree).toBeVisible();

		const parentNodeText = await tree.locator("#tree-node-1").locator("#tree-node-name-1").textContent();
		const dropTarget = tree.locator("#tree-node-3");
		const draggableNode = tree.locator("#tree-node-5");
		const interactiveNode = draggableNode.locator("button");
		const dragText = await draggableNode.textContent();
		const dropNodeName = await dropTarget.locator("#tree-node-name-3").textContent();

		await expect(interactiveNode).toBeVisible();
		expect(dragText).not.toContain(dropNodeName);
		expect(dragText).toContain(parentNodeText);
		await expect(dropTarget).toBeVisible();

		await interactiveNode.dragTo(dropTarget);

		expect(dragText).not.toContain(dropNodeName);
		expect(dragText).toContain(parentNodeText);
	});

	test.describe("desktop touch devices", () => {
		test.use({
			viewport: { width: 1366, height: 768 },
			hasTouch: true,
			isMobile: false,
			deviceScaleFactor: 1
		});

		test("should drag and drop a tree node", async ({ mount }) => {
			const component = await mount(<DnDTreeTableExample tree={TREE} />);
			const tree = component.locator("#dnd-tree-table");

			await expect(tree).toBeVisible();

			const parentNodeText = await tree.locator("#tree-node-2").locator("#tree-node-name-2").textContent();
			const dropTarget = tree.locator("#tree-node-3");
			const draggableNode = tree.locator("#tree-node-4");
			const dragText = await draggableNode.textContent();
			const dropNodeName = await dropTarget.locator("#tree-node-name-3").textContent();

			await expect(draggableNode).toBeVisible();

			expect(dragText).not.toContain(dropNodeName);
			expect(dragText).toContain(parentNodeText);

			await expect(dropTarget).toBeVisible();

			// Perform the drag and drop action
			await draggableNode.dragTo(dropTarget);

			const draggedNodeText = await draggableNode.textContent();

			expect(draggedNodeText).toContain(dropNodeName);
			expect(draggedNodeText).not.toContain(parentNodeText); // Check the node is dragged to another file.
		});
	});
});
