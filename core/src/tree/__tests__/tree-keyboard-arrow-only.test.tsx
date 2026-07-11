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

import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, getAllByDataRole, queryAllByDataRole } from "test-utils";
import { userEvent } from "vitest/browser";

import { KeyboardNavigationConfigProvider } from "../../keyboard-navigation/main/keyboard-navigation-context.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { Tree } from "../main/tpl/tree.tpl.view.js";
import { TreeContainer, TreeNode } from "../main/tpl/tree-elements.tpl.js";
import type { TreeNodeTemplateModel } from "../main/tpl/tree.tpl.api.js";
import { InsertableTree } from "../main/insertable/insertable-tree.view.js";
import type { InsertableTreeProps } from "../main/insertable/insertable-tree.api.js";

describe("com.mgmtp.a12.widgets.tree", () => {
	describe("arrow-only mode", () => {
		const onArrowClick = vi.fn();

		beforeEach(() => {
			onArrowClick.mockReset();
		});

		const treeData: TreeNodeTemplateModel = {
			id: "root",
			label: "Root",
			children: [
				{
					id: "parent",
					label: "Parent",
					onArrowClick
				},
				{ id: "leaf", label: "Leaf" }
			]
		};

		test("in arrow-only mode, expand buttons have tabIndex=-1", () => {
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<Tree root={treeData} hideRoot />
				</KeyboardNavigationConfigProvider>
			);
			const expanderButtons = getAllByDataRole(container, DataRoles.Tree.Node.Expander).map(
				(el) => el.querySelector<HTMLElement>("button")!
			);
			expanderButtons.forEach((btn) => {
				expect(btn.tabIndex).toBe(-1);
			});
		});

		test("only the first row has tabIndex=0, others have tabIndex=-1", () => {
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1" },
					{ id: "n2", label: "Node 2" },
					{ id: "n3", label: "Node 3" }
				]
			};
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<Tree root={treeData} hideRoot />
				</KeyboardNavigationConfigProvider>
			);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			expect(nodeContents[0].tabIndex).toBe(0);
			expect(nodeContents[1].tabIndex).toBe(-1);
			expect(nodeContents[2].tabIndex).toBe(-1);
		});

		test("ArrowDown moves tabIndex=0 from old row to new row", async () => {
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1" },
					{ id: "n2", label: "Node 2" },
					{ id: "n3", label: "Node 3" }
				]
			};
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<Tree root={treeData} hideRoot />
				</KeyboardNavigationConfigProvider>
			);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			nodeContents[0].focus();
			await userEvent.keyboard("{ArrowDown}");
			expect(nodeContents[0].tabIndex).toBe(-1);
			expect(nodeContents[1].tabIndex).toBe(0);
			expect(nodeContents[2].tabIndex).toBe(-1);
		});

		test("ArrowUp moves tabIndex=0 from old row to new row", async () => {
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1" },
					{ id: "n2", label: "Node 2" },
					{ id: "n3", label: "Node 3" }
				]
			};
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<Tree root={treeData} hideRoot />
				</KeyboardNavigationConfigProvider>
			);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			nodeContents[0].focus();
			await userEvent.keyboard("{ArrowDown}");
			await userEvent.keyboard("{ArrowDown}");
			// Now on row 3
			expect(nodeContents[2].tabIndex).toBe(0);
			await userEvent.keyboard("{ArrowUp}");
			expect(nodeContents[0].tabIndex).toBe(-1);
			expect(nodeContents[1].tabIndex).toBe(0);
			expect(nodeContents[2].tabIndex).toBe(-1);
		});

		test("after multiple ArrowDown presses, only last row has tabIndex=0", async () => {
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1" },
					{ id: "n2", label: "Node 2" },
					{ id: "n3", label: "Node 3" }
				]
			};
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<Tree root={treeData} hideRoot />
				</KeyboardNavigationConfigProvider>
			);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			nodeContents[0].focus();
			await userEvent.keyboard("{ArrowDown}");
			await userEvent.keyboard("{ArrowDown}");
			expect(nodeContents[0].tabIndex).toBe(-1);
			expect(nodeContents[1].tabIndex).toBe(-1);
			expect(nodeContents[2].tabIndex).toBe(0);
		});

		test("Tab from nodeContent with action button goes to that row's action button", async () => {
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1", actionButtons: <button id="action-n1">Action 1</button> },
					{ id: "n2", label: "Node 2" }
				]
			};
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<Tree root={treeData} hideRoot />
				</KeyboardNavigationConfigProvider>
			);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			nodeContents[0].focus(); // focus row 1 (has action button)
			await userEvent.tab();
			expect(document.getElementById("action-n1")).toHaveFocus();
		});

		test("Tab from nodeContent without action button exits tree", async () => {
			// Row 1 has action-n1, focus is on row 2 (no action).
			// arrow-only: Tab on a row with no action button must exit the tree.
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1", actionButtons: <button id="action-n1">Action 1</button> },
					{ id: "n2", label: "Node 2" }
				]
			};
			const afterTreeBtnId = "after-tree-btn";
			const { container } = render(
				<>
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<Tree root={treeData} hideRoot />
					</KeyboardNavigationConfigProvider>
					<button id={afterTreeBtnId}>After Tree</button>
				</>
			);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			nodeContents[1].focus(); // focus row 2 (no action)
			await userEvent.tab();
			expect(document.getElementById(afterTreeBtnId)).toHaveFocus();
		});

		test("Tab from nodeContent exits tree when no action buttons exist", async () => {
			const treeNoActions: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1" },
					{ id: "n2", label: "Node 2" }
				]
			};
			const afterTreeBtnId = "after-tree-btn";
			const { container } = render(
				<>
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<Tree root={treeNoActions} hideRoot />
					</KeyboardNavigationConfigProvider>
					<button id={afterTreeBtnId}>After Tree</button>
				</>
			);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			nodeContents[0].focus();
			await userEvent.tab();
			// No action buttons in tree — Tab flows naturally to the next focusable element
			expect(document.getElementById(afterTreeBtnId)).toHaveFocus();
		});

		test("Tab from initially focused first row exits tree when first row has no action button", async () => {
			// Spec: in arrow-only mode Tab goes to "the first row action button (if available)".
			// "Available" means the FOCUSED row has one — other rows' action buttons are irrelevant.
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1" }, // first row: no action button
					{ id: "n2", label: "Node 2", actionButtons: <button id="action-n2">Action</button> } // second row: has action button
				]
			};
			const afterTreeBtnId = "after-tree-btn";
			const { container } = render(
				<>
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<Tree root={treeData} hideRoot />
					</KeyboardNavigationConfigProvider>
					<button id={afterTreeBtnId}>After Tree</button>
				</>
			);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			nodeContents[0].focus(); // first row focused initially — no arrow keys used
			await userEvent.tab();
			// First row has no action button → exit tree entirely, do NOT jump to n2's action button
			expect(document.getElementById(afterTreeBtnId)).toHaveFocus();
		});

		test("Tab from last action button exits tree", async () => {
			const treeWithActions: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1", actionButtons: <button id="btn1">Action 1</button> },
					{ id: "n2", label: "Node 2" }
				]
			};
			const afterTreeBtnId = "after-tree-btn";
			render(
				<>
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<Tree root={treeWithActions} hideRoot />
					</KeyboardNavigationConfigProvider>
					<button id={afterTreeBtnId}>After Tree</button>
				</>
			);
			const btn1 = document.getElementById("btn1")!;
			btn1.focus();
			await userEvent.tab();
			// No more action buttons after row 1 — Tab exits tree
			expect(document.getElementById(afterTreeBtnId)).toHaveFocus();
		});

		test("ArrowDown then Tab chains through action buttons across rows", async () => {
			// MUI-like: navigate to row 2 with ArrowDown, Tab to row 2's action,
			// then Tab chains to row 3's action button, then exits tree.
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1", actionButtons: <button id="action-n1">Action 1</button> },
					{ id: "n2", label: "Node 2", actionButtons: <button id="action-n2">Action 2</button> },
					{ id: "n3", label: "Node 3", actionButtons: <button id="action-n3">Action 3</button> }
				]
			};
			const afterTreeBtnId = "after-tree-btn";
			const { container } = render(
				<>
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<Tree root={treeData} hideRoot />
					</KeyboardNavigationConfigProvider>
					<button id={afterTreeBtnId}>After Tree</button>
				</>
			);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			nodeContents[0].focus();
			// Navigate to row 2 with arrow keys
			await userEvent.keyboard("{ArrowDown}");
			expect(nodeContents[1]).toHaveFocus();
			// Tab → row 2's action button
			await userEvent.tab();
			expect(document.getElementById("action-n2")).toHaveFocus();
			// Tab → row 3's action button (chaining)
			await userEvent.tab();
			expect(document.getElementById("action-n3")).toHaveFocus();
			// Tab → exit tree (no more action buttons)
			await userEvent.tab();
			expect(document.getElementById(afterTreeBtnId)).toHaveFocus();
		});

		test("Tab from action button skips rows without action buttons", async () => {
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1", actionButtons: <button id="action-n1">Action 1</button> },
					{ id: "n2", label: "Node 2" }, // no action button
					{ id: "n3", label: "Node 3", actionButtons: <button id="action-n3">Action 3</button> }
				]
			};
			render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<Tree root={treeData} hideRoot />
				</KeyboardNavigationConfigProvider>
			);
			const actionN1 = document.getElementById("action-n1")!;
			actionN1.focus();
			// Tab should skip row 2 (no action) and go to row 3's action button
			await userEvent.tab();
			expect(document.getElementById("action-n3")).toHaveFocus();
		});

		test("in arrow-only mode, ArrowDown from action button moves focus to next row", async () => {
			const treeWithActions: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1", actionButtons: <button id="action-n1">Action</button> },
					{ id: "n2", label: "Node 2" }
				]
			};
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<Tree root={treeWithActions} hideRoot />
				</KeyboardNavigationConfigProvider>
			);
			const actionBtn = document.getElementById("action-n1")!;
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			actionBtn.focus();
			await userEvent.keyboard("{ArrowDown}");
			expect(nodeContents[1]).toHaveFocus();
		});

		test("in arrow-only mode, ArrowUp from action button moves focus to previous row", async () => {
			const treeWithActions: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1" },
					{ id: "n2", label: "Node 2", actionButtons: <button id="action-n2">Action</button> }
				]
			};
			const { container } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<Tree root={treeWithActions} hideRoot />
				</KeyboardNavigationConfigProvider>
			);
			const actionBtn = document.getElementById("action-n2")!;
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			actionBtn.focus();
			await userEvent.keyboard("{ArrowUp}");
			expect(nodeContents[0]).toHaveFocus();
		});

		test("Tab to action button then ArrowDown then Shift+Tab returns focus to previous row's action button", async () => {
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1", actionButtons: <button id="action-n1">Action 1</button> },
					{ id: "n2", label: "Node 2" }
				]
			};
			const beforeTreeBtnId = "before-tree-btn";
			const { container } = render(
				<>
					<button id={beforeTreeBtnId}>Before Tree</button>
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<Tree root={treeData} hideRoot />
					</KeyboardNavigationConfigProvider>
				</>
			);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			// Step 1: Focus first row's nodeContent (simulates Tab into tree)
			nodeContents[0].focus();
			// Step 2: Tab → row 0's action button
			await userEvent.tab();
			expect(document.getElementById("action-n1")).toHaveFocus();
			// Step 3: ArrowDown from action button → row 1's nodeContent
			await userEvent.keyboard("{ArrowDown}");
			expect(nodeContents[1]).toHaveFocus();
			// Step 4: Shift+Tab → must return to row 0's action button, NOT exit tree
			await userEvent.tab({ shift: true });
			expect(document.getElementById("action-n1")).toHaveFocus();
		});

		test("Shift+Tab from nodeContent exits tree backwards", async () => {
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1" },
					{ id: "n2", label: "Node 2" }
				]
			};
			const beforeTreeBtnId = "before-tree-btn";
			const { container } = render(
				<>
					<button id={beforeTreeBtnId}>Before Tree</button>
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<Tree root={treeData} hideRoot />
					</KeyboardNavigationConfigProvider>
				</>
			);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			nodeContents[0].focus();
			await userEvent.tab({ shift: true });
			expect(document.getElementById(beforeTreeBtnId)).toHaveFocus();
		});

		test("Shift+Tab from action button goes to previous row's action button", async () => {
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1", actionButtons: <button id="action-n1">Action 1</button> },
					{ id: "n2", label: "Node 2", actionButtons: <button id="action-n2">Action 2</button> }
				]
			};
			render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<Tree root={treeData} hideRoot />
				</KeyboardNavigationConfigProvider>
			);
			const actionBtn2 = document.getElementById("action-n2")!;
			actionBtn2.focus();
			await userEvent.tab({ shift: true });
			expect(document.getElementById("action-n1")).toHaveFocus();
		});

		test("Shift+Tab from action button skips rows without action buttons", async () => {
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1", actionButtons: <button id="action-n1">Action 1</button> },
					{ id: "n2", label: "Node 2" }, // no action button
					{ id: "n3", label: "Node 3", actionButtons: <button id="action-n3">Action 3</button> }
				]
			};
			render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<Tree root={treeData} hideRoot />
				</KeyboardNavigationConfigProvider>
			);
			const actionBtn3 = document.getElementById("action-n3")!;
			actionBtn3.focus();
			// Shift+Tab should skip row 2 (no action) and go to row 1's action button
			await userEvent.tab({ shift: true });
			expect(document.getElementById("action-n1")).toHaveFocus();
		});

		test("Shift+Tab from first action button focuses current row's node content", async () => {
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1", actionButtons: <button id="action-n1">Action 1</button> },
					{ id: "n2", label: "Node 2" }
				]
			};
			const beforeTreeBtnId = "before-tree-btn";
			const { container } = render(
				<>
					<button id={beforeTreeBtnId}>Before Tree</button>
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<Tree root={treeData} hideRoot />
					</KeyboardNavigationConfigProvider>
				</>
			);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			const actionBtn = document.getElementById("action-n1")!;
			actionBtn.focus();
			// No previous row has an action button → focus current row's node content, not exit tree
			await userEvent.tab({ shift: true });
			expect(nodeContents[0]).toHaveFocus();
		});

		test("in arrow-only mode, Shift+Tab from first row action button focuses that row's node content", async () => {
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1", actionButtons: <button id="action-n1">Action 1</button> },
					{ id: "n2", label: "Node 2" }
				]
			};
			const beforeTreeBtnId = "before-tree-btn";
			const { container } = render(
				<>
					<button id={beforeTreeBtnId}>Before Tree</button>
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<Tree root={treeData} hideRoot />
					</KeyboardNavigationConfigProvider>
				</>
			);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			// Tab into tree → Tab to first row's action button
			nodeContents[0].focus();
			await userEvent.tab();
			expect(document.getElementById("action-n1")).toHaveFocus();
			// Shift+Tab: no previous action button → should focus current row's node content, not exit tree
			await userEvent.tab({ shift: true });
			expect(nodeContents[0]).toHaveFocus();
			expect(document.getElementById(beforeTreeBtnId)).not.toHaveFocus();
		});

		test("Tab forward then Shift+Tab backward chains consistently through action buttons", async () => {
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1", actionButtons: <button id="action-n1">Action 1</button> },
					{ id: "n2", label: "Node 2", actionButtons: <button id="action-n2">Action 2</button> },
					{ id: "n3", label: "Node 3", actionButtons: <button id="action-n3">Action 3</button> }
				]
			};
			const beforeTreeBtnId = "before-tree-btn";
			const afterTreeBtnId = "after-tree-btn";
			const { container } = render(
				<>
					<button id={beforeTreeBtnId}>Before Tree</button>
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<Tree root={treeData} hideRoot />
					</KeyboardNavigationConfigProvider>
					<button id={afterTreeBtnId}>After Tree</button>
				</>
			);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			// Tab forward through all action buttons
			nodeContents[0].focus();
			await userEvent.tab();
			expect(document.getElementById("action-n1")).toHaveFocus();
			await userEvent.tab();
			expect(document.getElementById("action-n2")).toHaveFocus();
			await userEvent.tab();
			expect(document.getElementById("action-n3")).toHaveFocus();
			// Tab exits tree forward
			await userEvent.tab();
			expect(document.getElementById(afterTreeBtnId)).toHaveFocus();
			// Shift+Tab back into the tree — lands on last action button (last focusable in tree DOM)
			await userEvent.tab({ shift: true });
			expect(document.getElementById("action-n3")).toHaveFocus();
			// Shift+Tab backward through action buttons
			await userEvent.tab({ shift: true });
			expect(document.getElementById("action-n2")).toHaveFocus();
			await userEvent.tab({ shift: true });
			expect(document.getElementById("action-n1")).toHaveFocus();
			// Shift+Tab from first action button: no previous action → focus current row's node content
			await userEvent.tab({ shift: true });
			expect(nodeContents[0]).toHaveFocus();
		});

		test("Tab and Shift+Tab skip rows without action buttons symmetrically", async () => {
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1", actionButtons: <button id="action-n1">Action 1</button> },
					{ id: "n2", label: "Node 2" }, // no action button
					{ id: "n3", label: "Node 3", actionButtons: <button id="action-n3">Action 3</button> }
				]
			};
			const beforeTreeBtnId = "before-tree-btn";
			const { container } = render(
				<>
					<button id={beforeTreeBtnId}>Before Tree</button>
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<Tree root={treeData} hideRoot />
					</KeyboardNavigationConfigProvider>
				</>
			);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			// Tab forward: nodeContent → action-n1, skip n2, → action-n3
			nodeContents[0].focus();
			await userEvent.tab();
			expect(document.getElementById("action-n1")).toHaveFocus();
			await userEvent.tab();
			expect(document.getElementById("action-n3")).toHaveFocus();
			// Shift+Tab backward: action-n3 → action-n1 (skip n2), → focus current row's node content
			await userEvent.tab({ shift: true });
			expect(document.getElementById("action-n1")).toHaveFocus();
			await userEvent.tab({ shift: true });
			expect(nodeContents[0]).toHaveFocus();
		});

		test("Tab out and Shift+Tab back focuses the last arrow-navigated row", async () => {
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1" },
					{ id: "n2", label: "Node 2" },
					{ id: "n3", label: "Node 3" }
				]
			};
			const afterTreeBtnId = "after-tree-btn";
			const { container } = render(
				<>
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<Tree root={treeData} hideRoot />
					</KeyboardNavigationConfigProvider>
					<button id={afterTreeBtnId}>After Tree</button>
				</>
			);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			// Navigate to row 3
			nodeContents[0].focus();
			await userEvent.keyboard("{ArrowDown}");
			await userEvent.keyboard("{ArrowDown}");
			expect(nodeContents[2]).toHaveFocus();
			// Tab out of tree
			await userEvent.tab();
			expect(document.getElementById(afterTreeBtnId)).toHaveFocus();
			// Shift+Tab back into tree — row 3 should have tabIndex=0
			await userEvent.tab({ shift: true });
			expect(nodeContents[2]).toHaveFocus();
		});

		describe("Tab behavior", () => {
			test("Tab cycles through all action buttons in a row before moving to the next row", async () => {
				const treeData: TreeNodeTemplateModel = {
					id: "root",
					label: "Root",
					children: [
						{
							id: "n1",
							label: "Node 1",
							actionButtons: (
								<>
									<button id="btn1">Btn 1</button>
									<button id="btn2">Btn 2</button>
									<button id="btn3">Btn 3</button>
								</>
							)
						},
						{
							id: "n2",
							label: "Node 2",
							actionButtons: <button id="btn4">Btn 4</button>
						}
					]
				};
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<Tree root={treeData} hideRoot />
					</KeyboardNavigationConfigProvider>
				);
				const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
				// Tab from nodeContents[0] → first button of row 1
				nodeContents[0].focus();
				await userEvent.tab();
				expect(document.getElementById("btn1")).toHaveFocus();
				// Tab → second button of row 1 (same action area)
				await userEvent.tab();
				expect(document.getElementById("btn2")).toHaveFocus();
				// Tab → third button of row 1 (same action area)
				await userEvent.tab();
				expect(document.getElementById("btn3")).toHaveFocus();
				// Tab → first button of row 2 (next row)
				await userEvent.tab();
				expect(document.getElementById("btn4")).toHaveFocus();
			});

			test("Tab from last button of a row goes to first button of next row", async () => {
				const treeData: TreeNodeTemplateModel = {
					id: "root",
					label: "Root",
					children: [
						{
							id: "n1",
							label: "Node 1",
							actionButtons: (
								<>
									<button id="btn1a">Btn 1a</button>
									<button id="btn1b">Btn 1b</button>
								</>
							)
						},
						{
							id: "n2",
							label: "Node 2",
							actionButtons: (
								<>
									<button id="btn2a">Btn 2a</button>
									<button id="btn2b">Btn 2b</button>
								</>
							)
						}
					]
				};
				render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<Tree root={treeData} hideRoot />
					</KeyboardNavigationConfigProvider>
				);
				const btn1b = document.getElementById("btn1b")!;
				btn1b.focus();
				// Tab from last button of row 1 → first button of row 2
				await userEvent.tab();
				expect(document.getElementById("btn2a")).toHaveFocus();
			});
		}); // Tab behavior

		describe("Shift+Tab behavior", () => {
			test("Shift+Tab cycles backward through buttons in the same action area", async () => {
				const treeData: TreeNodeTemplateModel = {
					id: "root",
					label: "Root",
					children: [
						{
							id: "n1",
							label: "Node 1",
							actionButtons: (
								<>
									<button id="btn1">Btn 1</button>
									<button id="btn2">Btn 2</button>
									<button id="btn3">Btn 3</button>
								</>
							)
						}
					]
				};
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<Tree root={treeData} hideRoot />
					</KeyboardNavigationConfigProvider>
				);
				const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
				const btn3 = document.getElementById("btn3")!;
				btn3.focus();
				// Shift+Tab → btn2 (same action area)
				await userEvent.tab({ shift: true });
				expect(document.getElementById("btn2")).toHaveFocus();
				// Shift+Tab → btn1 (same action area)
				await userEvent.tab({ shift: true });
				expect(document.getElementById("btn1")).toHaveFocus();
				// Shift+Tab from first button → current row's node content
				await userEvent.tab({ shift: true });
				expect(nodeContents[0]).toHaveFocus();
			});

			test("Shift+Tab from first button of a row goes to last button of previous row", async () => {
				const treeData: TreeNodeTemplateModel = {
					id: "root",
					label: "Root",
					children: [
						{
							id: "n1",
							label: "Node 1",
							actionButtons: (
								<>
									<button id="btn1a">Btn 1a</button>
									<button id="btn1b">Btn 1b</button>
									<button id="btn1c">Btn 1c</button>
								</>
							)
						},
						{
							id: "n2",
							label: "Node 2",
							actionButtons: <button id="btn2">Btn 2</button>
						}
					]
				};
				render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<Tree root={treeData} hideRoot />
					</KeyboardNavigationConfigProvider>
				);
				const btn2 = document.getElementById("btn2")!;
				btn2.focus();
				// Shift+Tab from the single button of row 2 → last button of row 1 (btn1c)
				await userEvent.tab({ shift: true });
				expect(document.getElementById("btn1c")).toHaveFocus();
			});
		}); // Shift+Tab behavior

		describe("insertable tree - Tab/Shift+Tab behavior", () => {
			// Helper to get buttons inside an action area (Tree.Node.Actions or ButtonGroup) by index
			function getInsertButtonsInArea(container: HTMLElement, index: number): HTMLButtonElement[] {
				const actionAreas = [
					...queryAllByDataRole(container, DataRoles.Tree.Node.Actions),
					...queryAllByDataRole(container, DataRoles.ButtonGroup)
				];
				const area = actionAreas[index];

				return area ? Array.from(area.querySelectorAll<HTMLButtonElement>("button")) : [];
			}

			test("Tab from node content goes to first insert button of that row", async () => {
				// A single-row insertable tree (root hidden, one child at level 0) always has the asChild button
				const root: InsertableTreeProps.TreeNodeModel = {
					id: "root",
					label: "Root",
					children: [{ id: "n1", label: "Node 1" }]
				};
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<InsertableTree root={root} hideRoot />
					</KeyboardNavigationConfigProvider>
				);
				const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
				nodeContents[0].focus();
				await userEvent.tab();
				// Should focus the first insert button in the action area of this row
				const firstInsertBtn = getInsertButtonsInArea(container, 0)[0];
				expect(firstInsertBtn).toBeTruthy();
				expect(firstInsertBtn).toHaveFocus();
			});

			test("Tab from last row insert button exits tree forward", async () => {
				const root: InsertableTreeProps.TreeNodeModel = {
					id: "root",
					label: "Root",
					children: [{ id: "n1", label: "Node 1" }]
				};
				const afterTreeBtnId = "after-tree-btn";
				const { container } = render(
					<>
						<KeyboardNavigationConfigProvider mode="arrow-only">
							<InsertableTree root={root} hideRoot />
						</KeyboardNavigationConfigProvider>
						<button id={afterTreeBtnId}>After Tree</button>
					</>
				);
				// Focus the insert button and Tab — no more rows after it, should exit tree
				const firstInsertBtn = getInsertButtonsInArea(container, 0)[0];
				firstInsertBtn.focus();
				await userEvent.tab();
				expect(document.getElementById(afterTreeBtnId)).toHaveFocus();
			});

			test("Tab from one row insert button chains to next row insert button", async () => {
				const root: InsertableTreeProps.TreeNodeModel = {
					id: "root",
					label: "Root",
					children: [
						{ id: "n1", label: "Node 1" },
						{ id: "n2", label: "Node 2" }
					]
				};
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<InsertableTree root={root} hideRoot />
					</KeyboardNavigationConfigProvider>
				);
				// Tab from node content of row 1 → first insert button of row 1
				const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
				nodeContents[0].focus();
				await userEvent.tab();
				const row1InsertBtn = getInsertButtonsInArea(container, 0)[0];
				expect(row1InsertBtn).toHaveFocus();
				// Tab again → first insert button of row 2
				await userEvent.tab();
				const row2InsertBtn = getInsertButtonsInArea(container, 1)[0];
				expect(row2InsertBtn).toHaveFocus();
			});

			test("Shift+Tab from second row insert button goes to first row insert button", async () => {
				const root: InsertableTreeProps.TreeNodeModel = {
					id: "root",
					label: "Root",
					children: [
						{ id: "n1", label: "Node 1" },
						{ id: "n2", label: "Node 2" }
					]
				};
				const { container } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<InsertableTree root={root} hideRoot />
					</KeyboardNavigationConfigProvider>
				);
				const row2InsertBtn = getInsertButtonsInArea(container, 1)[0];
				row2InsertBtn.focus();
				await userEvent.tab({ shift: true });
				const row1InsertBtn = getInsertButtonsInArea(container, 0)[0];
				expect(row1InsertBtn).toHaveFocus();
			});

			test("Shift+Tab from first row insert button focuses that row node content (not exit tree)", async () => {
				const root: InsertableTreeProps.TreeNodeModel = {
					id: "root",
					label: "Root",
					children: [{ id: "n1", label: "Node 1" }]
				};
				const beforeTreeBtnId = "before-tree-btn";
				const { container } = render(
					<>
						<button id={beforeTreeBtnId}>Before Tree</button>
						<KeyboardNavigationConfigProvider mode="arrow-only">
							<InsertableTree root={root} hideRoot />
						</KeyboardNavigationConfigProvider>
					</>
				);
				const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
				const row1InsertBtn = getInsertButtonsInArea(container, 0)[0];
				row1InsertBtn.focus();
				await userEvent.tab({ shift: true });
				// No previous row action area — should focus the current row's nodeContent, NOT exit tree
				expect(nodeContents[0]).toHaveFocus();
				expect(document.getElementById(beforeTreeBtnId)).not.toHaveFocus();
			});

			test("Shift+Tab from node content exits tree backward", async () => {
				const root: InsertableTreeProps.TreeNodeModel = {
					id: "root",
					label: "Root",
					children: [{ id: "n1", label: "Node 1" }]
				};
				const beforeTreeBtnId = "before-tree-btn";
				const { container } = render(
					<>
						<button id={beforeTreeBtnId}>Before Tree</button>
						<KeyboardNavigationConfigProvider mode="arrow-only">
							<InsertableTree root={root} hideRoot />
						</KeyboardNavigationConfigProvider>
					</>
				);
				const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
				nodeContents[0].focus();
				await userEvent.tab({ shift: true });
				expect(document.getElementById(beforeTreeBtnId)).toHaveFocus();
			});
		}); // insertable tree - Tab/Shift+Tab behavior

		test("Tab back into tree after Shift+Tab navigation focuses first row, not action button", async () => {
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1", actionButtons: <button id="action-n1">Action 1</button> },
					{ id: "n2", label: "Node 2" }
				]
			};
			const beforeTreeBtnId = "before-tree-btn";
			const { container } = render(
				<>
					<button id={beforeTreeBtnId}>Before Tree</button>
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<Tree root={treeData} hideRoot />
					</KeyboardNavigationConfigProvider>
				</>
			);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			// Step 1: Tab into tree → first row
			nodeContents[0].focus();
			// Step 2: Tab → action button of row 0
			await userEvent.tab();
			expect(document.getElementById("action-n1")).toHaveFocus();
			// Step 3: ArrowDown → row 1's nodeContent
			await userEvent.keyboard("{ArrowDown}");
			expect(nodeContents[1]).toHaveFocus();
			// Step 4: Shift+Tab → row 0's action button
			await userEvent.tab({ shift: true });
			expect(document.getElementById("action-n1")).toHaveFocus();
			// Step 5: Shift+Tab → row 0's nodeContent
			await userEvent.tab({ shift: true });
			expect(nodeContents[0]).toHaveFocus();
			// Step 6: Shift+Tab → exits tree
			await userEvent.tab({ shift: true });
			expect(document.getElementById(beforeTreeBtnId)).toHaveFocus();
			// Step 7: Tab back into tree → MUST focus first row, not action button
			await userEvent.tab();
			expect(nodeContents[0]).toHaveFocus();
			expect(document.getElementById("action-n1")).not.toHaveFocus();
		});

		test("Shift+Tab from first action button of a selected row exits tree, not focuses selected row", async () => {
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1", selected: true, actionButtons: <button id="action-n1">Action 1</button> }
				]
			};
			const beforeTreeBtnId = "before-tree-btn";
			render(
				<>
					<button id={beforeTreeBtnId}>Before Tree</button>
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<Tree root={treeData} hideRoot />
					</KeyboardNavigationConfigProvider>
				</>
			);
			const actionBtn = document.getElementById("action-n1")!;
			actionBtn.focus();
			// Row n1 is selected — Shift+Tab from its action button must NOT focus the selected row content.
			// It should exit the tree backward.
			await userEvent.tab({ shift: true });
			expect(document.getElementById(beforeTreeBtnId)).toHaveFocus();
		});
	});

	describe("mode switching", () => {
		const onTitleClick = vi.fn();

		beforeEach(() => {
			onTitleClick.mockReset();
		});

		test("restores original tabIndex on rows when switching from arrow-only back to default mode", async () => {
			const makeTree = (mode: "default" | "arrow-only") => (
				<KeyboardNavigationConfigProvider mode={mode}>
					<TreeContainer>
						<TreeNode id="n1" label="Node 1" level={0} onTitleClick={onTitleClick} />
						<TreeNode id="n2" label="Node 2" level={0} onTitleClick={onTitleClick} />
						<TreeNode id="n3" label="Node 3" level={0} onTitleClick={onTitleClick} />
					</TreeContainer>
				</KeyboardNavigationConfigProvider>
			);

			const { container, rerender } = render(makeTree("default"));

			// Enter arrow-only mode — roving tabIndex sets only first row to 0
			rerender(makeTree("arrow-only"));

			let nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			expect(nodeContents[0].tabIndex).toBe(0);
			expect(nodeContents[1].tabIndex).toBe(-1);
			expect(nodeContents[2].tabIndex).toBe(-1);

			// Switch back to default — original tabIndex=0 must be restored for interactive rows
			rerender(makeTree("default"));

			nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			expect(nodeContents[0].tabIndex).toBe(0);
			expect(nodeContents[1].tabIndex).toBe(0);
			expect(nodeContents[2].tabIndex).toBe(0);
		});

		test("Tab navigates interactive rows correctly after switching from arrow-only back to default mode", async () => {
			const makeTree = (mode: "default" | "arrow-only") => (
				<KeyboardNavigationConfigProvider mode={mode}>
					<TreeContainer>
						<TreeNode id="n1" label="Node 1" level={0} onTitleClick={onTitleClick} />
						<TreeNode id="n2" label="Node 2" level={0} onTitleClick={onTitleClick} />
						<TreeNode id="n3" label="Node 3" level={0} onTitleClick={onTitleClick} />
					</TreeContainer>
				</KeyboardNavigationConfigProvider>
			);

			const { container, rerender } = render(makeTree("default"));

			rerender(makeTree("arrow-only"));
			rerender(makeTree("default"));

			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content).filter(
				(el) => el.tabIndex === 0
			) as HTMLElement[];
			expect(nodeContents).toHaveLength(3);

			nodeContents[0].focus();
			await userEvent.tab();
			expect(nodeContents[1]).toHaveFocus();

			await userEvent.tab();
			expect(nodeContents[2]).toHaveFocus();
		});
	}); // mode switching
});
