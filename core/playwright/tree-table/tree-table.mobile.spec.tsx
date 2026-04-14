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

test.describe("Tree table mobile tests", () => {
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

	test.describe("Android mobile devices", () => {
		test.use({
			viewport: { width: 375, height: 667 },
			hasTouch: true,
			isMobile: true,
			deviceScaleFactor: 2,
			userAgent:
				"Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
		});

		test("should drag and drop a tree node using touch", async ({ mount }) => {
			const component = await mount(<DnDTreeTableExample tree={TREE} />);
			const tree = component.locator("#dnd-tree-table");

			await expect(tree).toBeVisible();

			const draggableNode = tree.locator("#tree-node-4");
			const dropTarget = tree.locator("#tree-node-3");

			await expect(draggableNode).toBeVisible();
			await expect(dropTarget).toBeVisible();

			const initialParentText = await tree.locator("#tree-node-2").locator("#tree-node-name-2").textContent();
			const dropTargetName = await dropTarget.locator("#tree-node-name-3").textContent();
			const initialText = await draggableNode.textContent();

			expect(initialText).toContain(initialParentText);
			expect(initialText).not.toContain(dropTargetName);

			await draggableNode.dragTo(dropTarget);

			const finalText = await draggableNode.textContent();
			expect(finalText).toContain(dropTargetName);
			expect(finalText).not.toContain(initialParentText);
		});
	});

	test.describe("iOS mobile devices", () => {
		test.use({
			viewport: { width: 375, height: 812 },
			hasTouch: true,
			isMobile: true,
			deviceScaleFactor: 3,
			userAgent:
				"Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1"
		});

		test("should drag and drop a tree node using touch", async ({ mount }) => {
			const component = await mount(<DnDTreeTableExample tree={TREE} />);
			const tree = component.locator("#dnd-tree-table");

			await expect(tree).toBeVisible();

			const draggableNode = tree.locator("#tree-node-4");
			const dropTarget = tree.locator("#tree-node-3");

			await expect(draggableNode).toBeVisible();
			await expect(dropTarget).toBeVisible();

			const initialParentText = await tree.locator("#tree-node-2").locator("#tree-node-name-2").textContent();
			const dropTargetName = await dropTarget.locator("#tree-node-name-3").textContent();
			const initialText = await draggableNode.textContent();

			expect(initialText).toContain(initialParentText);
			expect(initialText).not.toContain(dropTargetName);

			await draggableNode.dragTo(dropTarget);

			const finalText = await draggableNode.textContent();
			expect(finalText).toContain(dropTargetName);
			expect(finalText).not.toContain(initialParentText);
		});
	});
});
