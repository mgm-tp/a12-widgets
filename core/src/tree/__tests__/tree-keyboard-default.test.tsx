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
import { render, getAllByDataRole } from "test-utils";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../common/main/data-roles.js";

import { Tree } from "../main/tpl/tree.tpl.view.js";
import { TreeContainer, TreeNode } from "../main/tpl/tree-elements.tpl.js";
import type { TreeNodeTemplateModel } from "../main/tpl/tree.tpl.api.js";

describe("com.mgmtp.a12.widgets.tree", () => {
	describe("default mode", () => {
		const onArrowClick = vi.fn();
		const onTitleClick = vi.fn();

		beforeEach(() => {
			onArrowClick.mockReset();
			onTitleClick.mockReset();
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

		const expandedTreeData: TreeNodeTemplateModel = {
			id: "root",
			label: "Root",
			children: [
				{
					id: "parent",
					label: "Parent",
					onArrowClick,
					expanded: true,
					children: [{ id: "child1", label: "Child 1" }]
				} as TreeNodeTemplateModel & { expanded: boolean },
				{ id: "leaf", label: "Leaf" }
			]
		};

		test("expands a collapsed node with ArrowRight", async () => {
			const { container } = render(<Tree root={treeData} hideRoot />);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			const parentNodeContent = nodeContents[0]; // "Parent"
			parentNodeContent.focus();
			await userEvent.keyboard("{ArrowRight}");
			expect(onArrowClick).toHaveBeenCalledOnce();
		});

		test("collapses an expanded node with ArrowLeft", async () => {
			const { container } = render(<Tree root={expandedTreeData} hideRoot />);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			const parentNodeContent = nodeContents[0]; // "Parent" (expanded)
			parentNodeContent.focus();
			await userEvent.keyboard("{ArrowLeft}");
			expect(onArrowClick).toHaveBeenCalledOnce();
		});

		test("does not call onArrowClick on ArrowRight for a leaf node", async () => {
			const { container } = render(<Tree root={treeData} hideRoot />);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			const leafContent = nodeContents[1]; // "Leaf" (no children)
			leafContent.focus();
			await userEvent.keyboard("{ArrowRight}");
			expect(onArrowClick).not.toHaveBeenCalled();
		});

		test("Tab from nodeContent goes to action button after arrow navigation", async () => {
			const actionButtonId = "action-btn";
			const treeWithActions: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{
						id: "n1",
						label: "Node 1"
					},
					{
						id: "n2",
						label: "Node 2",
						actionButtons: <button id={actionButtonId}>Edit</button>
					}
				]
			};
			const { container } = render(<Tree root={treeWithActions} hideRoot />);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			nodeContents[0].focus();
			await userEvent.keyboard("{ArrowDown}"); // activate arrow-navigation mode
			expect(nodeContents[1]).toHaveFocus(); // now on row with action button
			await userEvent.tab();
			expect(document.getElementById(actionButtonId)).toHaveFocus();
		});

		test("ArrowDown from expander button navigates to next row", async () => {
			const { container } = render(<Tree root={treeData} hideRoot />);
			const expanderButton = getAllByDataRole(container, DataRoles.Tree.Node.Expander)[0].querySelector<HTMLElement>(
				"button"
			)!;
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			expanderButton.focus();
			await userEvent.keyboard("{ArrowDown}");
			// Focus should move to the next row's nodeContent
			expect(nodeContents[1]).toHaveFocus();
		});

		test("ArrowUp from expander button navigates to previous row", async () => {
			const { container } = render(<Tree root={treeData} hideRoot />);
			const expanderButton = getAllByDataRole(container, DataRoles.Tree.Node.Expander)[0].querySelector<HTMLElement>(
				"button"
			)!;
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			// Focus the second row's nodeContent, then arrow up to expander of row 1, then arrow up from there
			nodeContents[1].focus();
			await userEvent.keyboard("{ArrowUp}"); // moves to nodeContents[0]
			expanderButton.focus(); // re-focus the expander directly
			await userEvent.keyboard("{ArrowUp}"); // already at top — stays on nodeContents[0]
			expect(nodeContents[0]).toHaveFocus();
		});

		test("ArrowRight from expander button expands a collapsed node", async () => {
			const { container } = render(<Tree root={treeData} hideRoot />);
			const expanderButton = getAllByDataRole(container, DataRoles.Tree.Node.Expander)[0].querySelector<HTMLElement>(
				"button"
			)!;
			expanderButton.focus();
			await userEvent.keyboard("{ArrowRight}");
			expect(onArrowClick).toHaveBeenCalledOnce();
		});

		test("ArrowLeft from expander button collapses an expanded node", async () => {
			const { container } = render(<Tree root={expandedTreeData} hideRoot />);
			const expanderButton = getAllByDataRole(container, DataRoles.Tree.Node.Expander)[0].querySelector<HTMLElement>(
				"button"
			)!;
			expanderButton.focus();
			await userEvent.keyboard("{ArrowLeft}");
			expect(onArrowClick).toHaveBeenCalledOnce();
		});

		const flatTree: TreeNodeTemplateModel = {
			id: "root",
			label: "Root",
			children: [
				{ id: "n1", label: "Node 1" },
				{ id: "n2", label: "Node 2" }
			]
		};

		test("ArrowDown moves focus to next row", async () => {
			const { container } = render(<Tree root={flatTree} hideRoot />);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			nodeContents[0].focus();
			await userEvent.keyboard("{ArrowDown}");
			expect(nodeContents[1]).toHaveFocus();
		});

		test("ArrowUp moves focus to previous row", async () => {
			const { container } = render(<Tree root={flatTree} hideRoot />);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			nodeContents[1].focus();
			await userEvent.keyboard("{ArrowUp}");
			expect(nodeContents[0]).toHaveFocus();
		});

		test("ArrowDown on last row stays on last row (boundary)", async () => {
			const { container } = render(<Tree root={flatTree} hideRoot />);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			nodeContents[1].focus(); // last row
			await userEvent.keyboard("{ArrowDown}");
			expect(nodeContents[1]).toHaveFocus();
		});

		test("ArrowUp on first row stays on first row (boundary)", async () => {
			const { container } = render(<Tree root={flatTree} hideRoot />);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			nodeContents[0].focus(); // first row
			await userEvent.keyboard("{ArrowUp}");
			expect(nodeContents[0]).toHaveFocus();
		});

		test("Tab from action button chains to next row's action button", async () => {
			const treeWithTwoActions: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1", actionButtons: <button id="btn1">Action 1</button> },
					{ id: "n2", label: "Node 2", actionButtons: <button id="btn2">Action 2</button> }
				]
			};
			render(<Tree root={treeWithTwoActions} hideRoot />);
			const btn1 = document.getElementById("btn1")!;
			btn1.focus();
			await userEvent.tab();
			expect(document.getElementById("btn2")).toHaveFocus();
		});

		test("ArrowDown then Tab focuses action button of navigated row", async () => {
			const treeForNav: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1" },
					{ id: "n2", label: "Node 2", actionButtons: <button id="action-n2">Action</button> }
				]
			};
			const { container } = render(<Tree root={treeForNav} hideRoot />);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			nodeContents[0].focus();
			await userEvent.keyboard("{ArrowDown}"); // move to row 2
			await userEvent.tab(); // Tab should go to row 2's action button
			expect(document.getElementById("action-n2")).toHaveFocus();
		});

		test("Tab from initially focused first row exits tree when no action button", async () => {
			// Mirrors master-branch behaviour: in default mode Tab is never intercepted
			// when there is no action button on the focused row, so the browser moves
			// focus to the next tabbable element after the tree.
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
					<Tree root={treeNoActions} hideRoot />
					<button id={afterTreeBtnId}>After Tree</button>
				</>
			);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			nodeContents[0].focus();
			await userEvent.tab();
			expect(document.getElementById(afterTreeBtnId)).toHaveFocus();
		});

		test("Tab without prior arrow nav stays in natural Tab order even with action buttons", async () => {
			// Default mode without prior arrow navigation: Tab should NOT intercept to action button,
			// it follows natural browser Tab order. Since nodeContents are non-interactive (tabIndex=-1),
			// the next tabbable element in DOM order is the action button inside the same row.
			const treeWithActions: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1", actionButtons: <button id="action-n1">Action 1</button> },
					{ id: "n2", label: "Node 2" }
				]
			};
			const { container } = render(<Tree root={treeWithActions} hideRoot />);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			nodeContents[0].focus();
			// Tab from non-interactive nodeContent: natural Tab order goes to the action button
			await userEvent.tab();
			expect(document.getElementById("action-n1")).toHaveFocus();
		});

		test("Tab navigates forward through interactive nodes", async () => {
			const { container } = render(
				<TreeContainer>
					<TreeNode id="n1" label="Node 1" level={0} onTitleClick={onTitleClick} />
					<TreeNode id="n2" label="Node 2" level={0} onTitleClick={onTitleClick} />
					<TreeNode id="n3" label="Node 3" level={0} onTitleClick={onTitleClick} />
				</TreeContainer>
			);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content).filter(
				(el) => el.tabIndex === 0
			) as HTMLElement[];
			nodeContents[0].focus();
			await userEvent.tab();
			expect(nodeContents[1]).toHaveFocus();
			await userEvent.tab();
			expect(nodeContents[2]).toHaveFocus();
		});

		test("Shift+Tab navigates backward through interactive nodes", async () => {
			const { container } = render(
				<TreeContainer>
					<TreeNode id="n1" label="Node 1" level={0} onTitleClick={onTitleClick} />
					<TreeNode id="n2" label="Node 2" level={0} onTitleClick={onTitleClick} />
					<TreeNode id="n3" label="Node 3" level={0} onTitleClick={onTitleClick} />
				</TreeContainer>
			);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content).filter(
				(el) => el.tabIndex === 0
			) as HTMLElement[];
			nodeContents[2].focus();
			await userEvent.tab({ shift: true });
			expect(nodeContents[1]).toHaveFocus();
		});

		test("non-interactive nodes (tabIndex=-1) are skipped by Tab", async () => {
			const { container } = render(
				<TreeContainer>
					<TreeNode id="n1" label="Node 1" level={0} onTitleClick={onTitleClick} />
					<TreeNode id="n2" label="Node 2" level={0} /> {/* non-interactive: tabIndex=-1 */}
					<TreeNode id="n3" label="Node 3" level={0} onTitleClick={onTitleClick} />
				</TreeContainer>
			);
			// Only interactive nodes have tabIndex="0"
			const tabbableContents = getAllByDataRole(container, DataRoles.Tree.Node.Content).filter(
				(el) => el.tabIndex === 0
			) as HTMLElement[];
			expect(tabbableContents).toHaveLength(2); // n1 and n3 only
			tabbableContents[0].focus();
			await userEvent.tab();
			// n2 has tabIndex=-1, so Tab skips it and lands on n3
			expect(tabbableContents[1]).toHaveFocus();
		});

		test("disabled nodes are excluded from the Tab order", async () => {
			const { container } = render(
				<TreeContainer>
					<TreeNode id="n1" label="Node 1" level={0} onTitleClick={onTitleClick} />
					<TreeNode id="n2" label="Node 2" level={0} onTitleClick={onTitleClick} disabled />
					<TreeNode id="n3" label="Node 3" level={0} onTitleClick={onTitleClick} />
				</TreeContainer>
			);
			// Disabled NodeContent receives tabIndex=undefined (no tabindex attribute)
			const tabbableContents = getAllByDataRole(container, DataRoles.Tree.Node.Content).filter(
				(el) => el.tabIndex === 0
			) as HTMLElement[];
			expect(tabbableContents).toHaveLength(2); // n1 and n3 only
			tabbableContents[0].focus();
			await userEvent.tab();
			// n2 is disabled (no tabindex), so Tab skips it and lands on n3
			expect(tabbableContents[1]).toHaveFocus();
		});

		test("focusable=false nodes are excluded from the Tab order", async () => {
			const { container } = render(
				<TreeContainer>
					<TreeNode id="n1" label="Node 1" level={0} onTitleClick={onTitleClick} />
					<TreeNode id="n2" label="Node 2" level={0} onTitleClick={onTitleClick} focusable={false} />
					<TreeNode id="n3" label="Node 3" level={0} onTitleClick={onTitleClick} />
				</TreeContainer>
			);
			// focusable=false causes tabIndex=undefined (no tabindex attribute)
			const tabbableContents = getAllByDataRole(container, DataRoles.Tree.Node.Content).filter(
				(el) => el.tabIndex === 0
			) as HTMLElement[];
			expect(tabbableContents).toHaveLength(2); // n1 and n3 only
			tabbableContents[0].focus();
			await userEvent.tab();
			// n2 has no tabindex, so Tab skips it and lands on n3
			expect(tabbableContents[1]).toHaveFocus();
		});

		test("selected (non-highlighted) nodes get tabIndex=-1 and are skipped by Tab", async () => {
			const { container } = render(
				<TreeContainer>
					<TreeNode id="n1" label="Node 1" level={0} onTitleClick={onTitleClick} />
					<TreeNode id="n2" label="Node 2" level={0} onTitleClick={onTitleClick} selected />
					<TreeNode id="n3" label="Node 3" level={0} onTitleClick={onTitleClick} />
				</TreeContainer>
			);
			// NodeContent overrides tabIndex to -1 for selected (non-highlighted) nodes
			const tabbableContents = getAllByDataRole(container, DataRoles.Tree.Node.Content).filter(
				(el) => el.tabIndex === 0
			) as HTMLElement[];
			expect(tabbableContents).toHaveLength(2); // n1 and n3 only
			tabbableContents[0].focus();
			await userEvent.tab();
			// n2 selected+not-highlighted → tabIndex=-1, Tab skips it
			expect(tabbableContents[1]).toHaveFocus();
		});

		test("default mode does not apply roving tabIndex", () => {
			const treeData: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1" },
					{ id: "n2", label: "Node 2" }
				]
			};
			const { container } = render(<Tree root={treeData} hideRoot />);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			// Both rows should keep their original tabIndex (both -1, since no onTitleClick)
			expect(nodeContents[0].tabIndex).toBe(-1);
			expect(nodeContents[1].tabIndex).toBe(-1);
		});

		test("Tab from nodeContent goes to expander button (not action button)", async () => {
			// Row has both expander and action button.
			// Tab from nodeContent must go to expander (DOM order) in default mode.
			const tree: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{
						id: "n1",
						label: "Node 1",
						onTitleClick,
						onArrowClick,
						actionButtons: <button id="action-n1">Edit</button>
					}
				]
			};
			const { container } = render(<Tree root={tree} hideRoot />);
			const nodeContent = getAllByDataRole(container, DataRoles.Tree.Node.Content).find((el) => el.tabIndex === 0)!;
			const expanderBtn = getAllByDataRole(container, DataRoles.Tree.Node.Expander)[0].querySelector<HTMLElement>(
				"button"
			)!;
			nodeContent.focus();
			await userEvent.tab();
			expect(expanderBtn).toHaveFocus();
		});

		test("Tab from expander button goes to action button", async () => {
			const tree: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{
						id: "n1",
						label: "Node 1",
						onTitleClick,
						onArrowClick,
						actionButtons: <button id="action-n1">Edit</button>
					}
				]
			};
			const { container } = render(<Tree root={tree} hideRoot />);
			const expanderBtn = getAllByDataRole(container, DataRoles.Tree.Node.Expander)[0].querySelector<HTMLElement>(
				"button"
			)!;
			const actionBtn = document.getElementById("action-n1")!;
			expanderBtn.focus();
			await userEvent.tab();
			expect(actionBtn).toHaveFocus();
		});

		test("Tab from action button goes to next row's nodeContent (not next action button)", async () => {
			// MAIN BUG: Tab from action button must not chain to the next action button.
			// It must follow natural DOM order → next row's nodeContent (tabIndex=0).
			const tree: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{
						id: "n1",
						label: "Node 1",
						onTitleClick,
						actionButtons: <button id="action-n1">Edit</button>
					},
					{
						id: "n2",
						label: "Node 2",
						onTitleClick,
						actionButtons: <button id="action-n2">Edit</button>
					}
				]
			};
			const { container } = render(<Tree root={tree} hideRoot />);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content).filter(
				(el) => el.tabIndex === 0
			) as HTMLElement[];
			const action1 = document.getElementById("action-n1")!;
			action1.focus();
			await userEvent.tab();
			// Should land on row 2's nodeContent, NOT action-n2
			expect(nodeContents[1]).toHaveFocus();
		});

		test("full Tab cycle: row → expander → action → next row → next expander → next action", async () => {
			const tree: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{
						id: "n1",
						label: "Node 1",
						onTitleClick,
						onArrowClick,
						actionButtons: <button id="action-n1">Edit</button>
					},
					{
						id: "n2",
						label: "Node 2",
						onTitleClick,
						onArrowClick,
						actionButtons: <button id="action-n2">Edit</button>
					}
				]
			};
			const { container } = render(<Tree root={tree} hideRoot />);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content).filter(
				(el) => el.tabIndex === 0
			) as HTMLElement[];
			const expanders = getAllByDataRole(container, DataRoles.Tree.Node.Expander).map(
				(el) => el.querySelector<HTMLElement>("button")!
			);

			nodeContents[0].focus();
			await userEvent.tab();
			expect(expanders[0]).toHaveFocus(); // row1 expander

			await userEvent.tab();
			expect(document.getElementById("action-n1")).toHaveFocus(); // row1 action

			await userEvent.tab();
			expect(nodeContents[1]).toHaveFocus(); // row2 nodeContent ← was broken

			await userEvent.tab();
			expect(expanders[1]).toHaveFocus(); // row2 expander

			await userEvent.tab();
			expect(document.getElementById("action-n2")).toHaveFocus(); // row2 action
		});

		test("Tab from action button goes to next row's nodeContent even after arrow navigation", async () => {
			// After using arrow keys in default mode, Tab must still follow DOM order.
			const tree: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{
						id: "n1",
						label: "Node 1",
						onTitleClick,
						actionButtons: <button id="action-n1">Edit</button>
					},
					{
						id: "n2",
						label: "Node 2",
						onTitleClick,
						actionButtons: <button id="action-n2">Edit</button>
					}
				]
			};
			const { container } = render(<Tree root={tree} hideRoot />);
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content).filter(
				(el) => el.tabIndex === 0
			) as HTMLElement[];
			nodeContents[0].focus();
			await userEvent.keyboard("{ArrowDown}"); // sets arrowNavigationUsed (old flag)
			const action1 = document.getElementById("action-n1")!;
			action1.focus();
			await userEvent.tab();
			expect(nodeContents[1]).toHaveFocus();
		});

		test("ArrowDown from action button moves focus to next row's nodeContent", async () => {
			const treeWithActions: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1", actionButtons: <button id="action-n1">Action</button> },
					{ id: "n2", label: "Node 2" },
					{ id: "n3", label: "Node 3" }
				]
			};
			const { container } = render(<Tree root={treeWithActions} hideRoot />);
			const actionBtn = document.getElementById("action-n1")!;
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			actionBtn.focus();
			await userEvent.keyboard("{ArrowDown}");
			expect(nodeContents[1]).toHaveFocus();
		});

		test("ArrowUp from action button moves focus to previous row's nodeContent", async () => {
			const treeWithActions: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1" },
					{ id: "n2", label: "Node 2", actionButtons: <button id="action-n2">Action</button> },
					{ id: "n3", label: "Node 3" }
				]
			};
			const { container } = render(<Tree root={treeWithActions} hideRoot />);
			const actionBtn = document.getElementById("action-n2")!;
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			actionBtn.focus();
			await userEvent.keyboard("{ArrowUp}");
			expect(nodeContents[0]).toHaveFocus();
		});

		test("ArrowDown from action button on last row focuses last row's nodeContent", async () => {
			const treeWithActions: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1" },
					{ id: "n2", label: "Node 2", actionButtons: <button id="action-n2">Action</button> }
				]
			};
			const { container } = render(<Tree root={treeWithActions} hideRoot />);
			const actionBtn = document.getElementById("action-n2")!;
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			actionBtn.focus();
			await userEvent.keyboard("{ArrowDown}");
			// At boundary: moveItemFocusNext with stopAtBoundary=true returns currentIndex → focuses nodeContents[1]
			expect(nodeContents[1]).toHaveFocus();
		});

		test("ArrowUp from action button on first row focuses first row's nodeContent", async () => {
			const treeWithActions: TreeNodeTemplateModel = {
				id: "root",
				label: "Root",
				children: [
					{ id: "n1", label: "Node 1", actionButtons: <button id="action-n1">Action</button> },
					{ id: "n2", label: "Node 2" }
				]
			};
			const { container } = render(<Tree root={treeWithActions} hideRoot />);
			const actionBtn = document.getElementById("action-n1")!;
			const nodeContents = getAllByDataRole(container, DataRoles.Tree.Node.Content);
			actionBtn.focus();
			await userEvent.keyboard("{ArrowUp}");
			// At boundary: moveItemFocusBack with stopAtBoundary=true returns 0 → focuses nodeContents[0]
			expect(nodeContents[0]).toHaveFocus();
		});
	});
});
