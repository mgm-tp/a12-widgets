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

import type { Instruction } from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item";
import { findByText, fireEvent, getByDataRole, getByText, queryByText, render } from "test-utils";
import { userEvent } from "vitest/browser";
import { describe, expect, test, vi } from "vitest";

import { DataRoles } from "../../common/main/data-roles.js";

import type { FlatTreeRow } from "../main/model/index.js";
import { TreeView } from "../main/tree-view.view.js";
import type { TreeViewScrollToNodeHandler } from "../main/tree-view.api.js";
import { computeItemMode, indicatorFromInstruction, mapInstructionToDropResult } from "../main/tree-view-dnd.js";

interface Node {
	id: string;
	label: string;
	children?: Node[];
}

const TREE: Node[] = [
	{
		id: "root",
		label: "Root",
		children: [
			{ id: "a", label: "Child A", children: [{ id: "a1", label: "Grandchild A1" }] },
			{ id: "b", label: "Child B" }
		]
	}
];

/** Content element of a node, keyed by id. */
function content(key: string): HTMLElement {
	const el = document.getElementById(`tree-node-content-${key}`);

	if (!el) {
		throw new Error(`no node content for ${key}`);
	}

	return el;
}

/** Treeitem container of a node, keyed by id. */
function treeitem(key: string): HTMLElement {
	const el = document.getElementById(`tree-node-${key}`);

	if (!el) {
		throw new Error(`no treeitem for ${key}`);
	}

	return el;
}

describe("com.mgmtp.a12.widgets.tree-view", () => {
	describe("rendering & expansion", () => {
		test("renders the visible nodes for the initial expansion", () => {
			const { container } = render(
				<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} defaultExpandedKeys={["root"]} />
			);

			expect(getByText(container, "Root")).toBeInTheDocument();
			expect(getByText(container, "Child A")).toBeInTheDocument();
			expect(getByText(container, "Child B")).toBeInTheDocument();
			expect(queryByText(container, "Grandchild A1")).not.toBeInTheDocument();

			expect(getByDataRole(container, DataRoles.Tree.Nodes)).toHaveAttribute("role", "tree");
		});

		test("expands a node when its chevron is clicked (uncontrolled)", async () => {
			const { container } = render(
				<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} defaultExpandedKeys={["root"]} />
			);

			expect(queryByText(container, "Grandchild A1")).not.toBeInTheDocument();

			const expander = treeitem("a").querySelector(`[data-role="${DataRoles.Tree.Node.Expander}"] button`);
			await userEvent.click(expander as HTMLElement);

			expect(getByText(container, "Grandchild A1")).toBeInTheDocument();
		});

		test("drives expansion from controlled expandedKeys + onExpandedChange", async () => {
			const onExpandedChange = vi.fn();
			const { container } = render(
				<TreeView<Node>
					tree={TREE}
					rowKey="id"
					getChildren={(n) => n.children}
					expandedKeys={new Set(["root"])}
					onExpandedChange={onExpandedChange}
				/>
			);

			const expander = treeitem("a").querySelector(`[data-role="${DataRoles.Tree.Node.Expander}"] button`);
			await userEvent.click(expander as HTMLElement);

			expect(queryByText(container, "Grandchild A1")).not.toBeInTheDocument();
			expect(onExpandedChange).toHaveBeenCalledTimes(1);
			const [nextKeys, meta] = onExpandedChange.mock.calls[0];
			expect(nextKeys.has("a")).toBe(true);
			expect(meta).toMatchObject({ key: "a", expanded: true });
		});

		test("accepts flat data with getParentId", () => {
			interface FlatNode {
				id: string;
				parentId?: string;
				label: string;
			}

			const data: FlatNode[] = [
				{ id: "1", label: "One" },
				{ id: "2", parentId: "1", label: "Two" }
			];

			const { container } = render(
				<TreeView<FlatNode> data={data} rowKey="id" getParentId={(n) => n.parentId} defaultExpandAll />
			);

			expect(getByText(container, "One")).toBeInTheDocument();
			expect(getByText(container, "Two")).toBeInTheDocument();
		});
	});

	describe("lazy loading", () => {
		test("shows the arrow button's loading indicator while children load, then restores the chevron", async () => {
			let resolveChildren!: (children: Node[]) => void;

			const loadChildren = vi.fn(
				() =>
					new Promise<Node[]>((resolve) => {
						resolveChildren = resolve;
					})
			);

			const lazyTree: Node[] = [{ id: "remote", label: "remote" }];
			const { container } = render(
				<TreeView<Node>
					tree={lazyTree}
					rowKey="id"
					getChildren={(n) => n.children}
					loadChildren={loadChildren}
					isLeaf={() => false}
				/>
			);

			// Unloaded lazy node shows the expand chevron, no loading indicator yet.
			const expander = treeitem("remote").querySelector(`[data-role="${DataRoles.Tree.Node.Expander}"] button`);
			expect(expander).toBeInTheDocument();
			expect(treeitem("remote").querySelector(`[data-role="${DataRoles.ProgressIndicator.CircleSpinner}"]`)).toBeNull();

			await userEvent.click(expander as HTMLElement);

			// While loading: the arrow button renders its progress indicator and is non-interactive.
			expect(
				treeitem("remote").querySelector(`[data-role="${DataRoles.ProgressIndicator.CircleSpinner}"]`)
			).not.toBeNull();
			expect(expander).toBeDisabled();
			expect(loadChildren).toHaveBeenCalledTimes(1);

			resolveChildren([{ id: "remote-1", label: "remote-a.bin" }]);

			// Children arrive; loading indicator gone; chevron back (now expanded).
			expect(await findByText(container, "remote-a.bin")).toBeInTheDocument();
			expect(treeitem("remote").querySelector(`[data-role="${DataRoles.ProgressIndicator.CircleSpinner}"]`)).toBeNull();
			expect(treeitem("remote")).toHaveAttribute("aria-expanded", "true");
		});
	});

	describe("accessibility", () => {
		test("applies treegrid/treeitem ARIA from the model", () => {
			render(
				<TreeView<Node>
					tree={TREE}
					rowKey="id"
					getChildren={(n) => n.children}
					selectionMode="single"
					defaultExpandedKeys={["root"]}
				/>
			);

			const root = treeitem("root");
			expect(root).toHaveAttribute("role", "treeitem");
			expect(root).toHaveAttribute("aria-level", "1");
			expect(root).toHaveAttribute("aria-expanded", "true");
			expect(root).toHaveAttribute("aria-setsize", "1");
			expect(root).toHaveAttribute("aria-posinset", "1");

			// Child A: expandable but collapsed; second of two children.
			const childA = treeitem("a");
			expect(childA).toHaveAttribute("aria-level", "2");
			expect(childA).toHaveAttribute("aria-expanded", "false");
			expect(childA).toHaveAttribute("aria-setsize", "2");
			expect(childA).toHaveAttribute("aria-posinset", "1");

			// Child B: a leaf — no aria-expanded.
			expect(treeitem("b")).not.toHaveAttribute("aria-expanded");
		});

		test("keeps a single roving tab stop", () => {
			render(<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} defaultExpandedKeys={["root"]} />);

			expect(content("root")).toHaveAttribute("tabindex", "0");
			expect(content("a")).toHaveAttribute("tabindex", "-1");
			expect(content("b")).toHaveAttribute("tabindex", "-1");
		});
	});

	describe("selection", () => {
		test("selects a node on click (single, uncontrolled)", async () => {
			const onSelectionChange = vi.fn();
			render(
				<TreeView<Node>
					tree={TREE}
					rowKey="id"
					getChildren={(n) => n.children}
					selectionMode="single"
					defaultExpandedKeys={["root"]}
					onSelectionChange={onSelectionChange}
				/>
			);

			await userEvent.click(content("b"));

			expect(treeitem("b")).toHaveAttribute("aria-selected", "true");
			expect(treeitem("a")).toHaveAttribute("aria-selected", "false");
			expect(onSelectionChange).toHaveBeenCalledTimes(1);
			expect(onSelectionChange.mock.calls[0][1]).toMatchObject({ key: "b", selected: true });
		});

		test("single selection replaces the previous one", async () => {
			render(
				<TreeView<Node>
					tree={TREE}
					rowKey="id"
					getChildren={(n) => n.children}
					selectionMode="single"
					defaultExpandedKeys={["root"]}
				/>
			);

			await userEvent.click(content("a"));
			await userEvent.click(content("b"));

			expect(treeitem("a")).toHaveAttribute("aria-selected", "false");
			expect(treeitem("b")).toHaveAttribute("aria-selected", "true");
		});

		test("multiple selection toggles membership", async () => {
			render(
				<TreeView<Node>
					tree={TREE}
					rowKey="id"
					getChildren={(n) => n.children}
					selectionMode="multiple"
					defaultExpandedKeys={["root"]}
				/>
			);

			await userEvent.click(content("a"));
			await userEvent.click(content("b"));
			expect(treeitem("a")).toHaveAttribute("aria-selected", "true");
			expect(treeitem("b")).toHaveAttribute("aria-selected", "true");

			await userEvent.click(content("b"));
			expect(treeitem("b")).toHaveAttribute("aria-selected", "false");
		});

		test("controlled selection does not self-mutate but reports the request", async () => {
			const onSelectionChange = vi.fn();
			render(
				<TreeView<Node>
					tree={TREE}
					rowKey="id"
					getChildren={(n) => n.children}
					selectionMode="single"
					selectedKeys={new Set(["a"])}
					defaultExpandedKeys={["root"]}
					onSelectionChange={onSelectionChange}
				/>
			);

			await userEvent.click(content("b"));

			expect(treeitem("a")).toHaveAttribute("aria-selected", "true");
			expect(treeitem("b")).toHaveAttribute("aria-selected", "false");
			expect(onSelectionChange).toHaveBeenCalledTimes(1);
		});
	});

	describe("keyboard navigation", () => {
		test("Arrow Down / Up move the roving focus between visible nodes", async () => {
			render(<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} defaultExpandedKeys={["root"]} />);

			content("root").focus();
			await userEvent.keyboard("{ArrowDown}");
			expect(document.activeElement?.id).toBe("tree-node-content-a");

			await userEvent.keyboard("{ArrowDown}");
			expect(document.activeElement?.id).toBe("tree-node-content-b");

			await userEvent.keyboard("{ArrowUp}");
			expect(document.activeElement?.id).toBe("tree-node-content-a");
		});

		test("Arrow Right expands, then steps into the first child; Arrow Left collapses / steps to parent", async () => {
			const { container } = render(
				<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} defaultExpandedKeys={["root"]} />
			);

			content("a").focus();

			// Collapsed + expandable → expands.
			await userEvent.keyboard("{ArrowRight}");
			expect(getByText(container, "Grandchild A1")).toBeInTheDocument();

			// Expanded → steps into first child.
			await userEvent.keyboard("{ArrowRight}");
			expect(document.activeElement?.id).toBe("tree-node-content-a1");

			// Leaf with a parent → steps to parent.
			await userEvent.keyboard("{ArrowLeft}");
			expect(document.activeElement?.id).toBe("tree-node-content-a");

			// Expanded → collapses.
			await userEvent.keyboard("{ArrowLeft}");
			expect(queryByText(container, "Grandchild A1")).not.toBeInTheDocument();
		});

		test("Home / End jump to the first / last visible node", async () => {
			render(<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} defaultExpandedKeys={["root"]} />);

			content("a").focus();

			await userEvent.keyboard("{End}");
			expect(document.activeElement?.id).toBe("tree-node-content-b");

			await userEvent.keyboard("{Home}");
			expect(document.activeElement?.id).toBe("tree-node-content-root");
		});

		test("Enter selects the focused node", async () => {
			const onSelectionChange = vi.fn();
			render(
				<TreeView<Node>
					tree={TREE}
					rowKey="id"
					getChildren={(n) => n.children}
					selectionMode="single"
					defaultExpandedKeys={["root"]}
					onSelectionChange={onSelectionChange}
				/>
			);

			content("b").focus();
			await userEvent.keyboard("{Enter}");

			expect(treeitem("b")).toHaveAttribute("aria-selected", "true");
			expect(onSelectionChange).toHaveBeenCalledTimes(1);
		});
	});

	describe("imperative scrollToNode", () => {
		test("scrolls a node into view and optionally focuses it", async () => {
			let handler: TreeViewScrollToNodeHandler | undefined;
			const scrollIntoView = vi.fn();
			Element.prototype.scrollIntoView = scrollIntoView;

			render(
				<TreeView<Node>
					tree={TREE}
					rowKey="id"
					getChildren={(n) => n.children}
					defaultExpandedKeys={["root"]}
					scrollToNode={(h) => {
						handler = h;
					}}
				/>
			);

			expect(handler).toBeTypeOf("function");

			handler?.("b", { autoFocus: true });

			expect(scrollIntoView).toHaveBeenCalled();
			expect(document.activeElement?.id).toBe("tree-node-content-b");
		});
	});

	describe("drag and drop", () => {
		const flat = (key: string, level: number, extra?: Partial<FlatTreeRow<Node>>): FlatTreeRow<Node> => ({
			row: { id: key, label: key },
			key,
			level,
			expandable: false,
			expanded: false,
			loading: false,
			posinset: 1,
			setsize: 1,
			...extra
		});

		describe("position mapping (pure)", () => {
			test("maps reorder/make-child instructions to before/after/inside", () => {
				const rows = [flat("r0", 0), flat("r1", 1), flat("r2", 1)];
				const above: Instruction = { type: "reorder-above", currentLevel: 1, indentPerLevel: 16 };
				const below: Instruction = { type: "reorder-below", currentLevel: 1, indentPerLevel: 16 };
				const child: Instruction = { type: "make-child", currentLevel: 1, indentPerLevel: 16 };

				expect(mapInstructionToDropResult(above, 1, rows)?.position).toBe("before");
				expect(mapInstructionToDropResult(below, 1, rows)?.position).toBe("after");
				expect(mapInstructionToDropResult(child, 1, rows)?.position).toBe("inside");
			});

			test("reparent resolves to 'after' the nearest ancestor at the desired level", () => {
				const rows = [flat("r0", 0), flat("r1", 1), flat("r2", 1)];
				const reparent: Instruction = { type: "reparent", currentLevel: 1, indentPerLevel: 16, desiredLevel: 0 };

				const result = mapInstructionToDropResult(reparent, 2, rows);
				expect(result?.position).toBe("after");
				expect(result?.target.key).toBe("r0");
			});

			test("null / blocked instructions resolve to no drop", () => {
				const rows = [flat("r0", 0), flat("r1", 1)];
				const blocked: Instruction = {
					type: "instruction-blocked",
					desired: { type: "reorder-above", currentLevel: 1, indentPerLevel: 16 }
				};

				expect(mapInstructionToDropResult(null, 1, rows)).toBeNull();
				expect(mapInstructionToDropResult(blocked, 1, rows)).toBeNull();
			});
		});

		describe("hitbox item mode", () => {
			test("classifies rows by their following sibling/child", () => {
				// folderA(0) > a1(1), a2(1); b(0)
				const rows = [flat("a", 0), flat("a1", 1), flat("a2", 1), flat("b", 0)];

				expect(computeItemMode(rows, 0)).toBe("expanded"); // folderA shows children
				expect(computeItemMode(rows, 1)).toBe("standard"); // a1 has a following sibling a2
				expect(computeItemMode(rows, 2)).toBe("last-in-group"); // a2 is the last child of a
				expect(computeItemMode(rows, 3)).toBe("last-in-group"); // b is the last row
			});
		});

		describe("indicator placement", () => {
			test("maps instructions to the indicator band", () => {
				expect(indicatorFromInstruction({ type: "reorder-above", currentLevel: 1, indentPerLevel: 16 }, false)).toEqual(
					{ type: "reorder-top", level: 1, forbidden: false }
				);
				expect(indicatorFromInstruction({ type: "make-child", currentLevel: 1, indentPerLevel: 16 }, false)).toEqual({
					type: "child",
					level: 1,
					forbidden: false
				});
				expect(
					indicatorFromInstruction({ type: "reparent", currentLevel: 1, indentPerLevel: 16, desiredLevel: 0 }, true)
				).toEqual({ type: "reorder-bottom", level: 0, forbidden: true });
				expect(indicatorFromInstruction(null, false)).toBeNull();
			});
		});

		describe("integration", () => {
			function nextFrame(): Promise<void> {
				return new Promise((resolve) => requestAnimationFrame(() => resolve()));
			}

			async function dragOnto(source: HTMLElement, target: HTMLElement, fraction: number): Promise<void> {
				const dataTransfer = new DataTransfer();
				fireEvent.dragStart(source, { dataTransfer });
				await nextFrame();

				const rect = target.getBoundingClientRect();
				const clientX = rect.left + rect.width * 0.7;
				const clientY = rect.top + rect.height * fraction;

				fireEvent.dragEnter(target, { dataTransfer, clientX, clientY });
				fireEvent.dragOver(target, { dataTransfer, clientX, clientY });
				fireEvent.drop(target, { dataTransfer, clientX, clientY });
				fireEvent.dragEnd(source, { dataTransfer });
			}

			test("nodes are draggable only when dragDrop is provided", () => {
				const withDnd = render(
					<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} defaultExpandAll dragDrop={{}} />
				);
				expect(treeitem("a").getAttribute("draggable")).toBe("true");

				const { container } = render(
					<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} defaultExpandAll />
				);
				expect(container.querySelector('[role="treeitem"]')?.getAttribute("draggable")).not.toBe("true");
				expect(withDnd).toBeTruthy();
			});

			test("dropping near the top edge reports position 'before'", async () => {
				const onDrop = vi.fn();
				render(
					<TreeView<Node>
						tree={TREE}
						rowKey="id"
						getChildren={(n) => n.children}
						defaultExpandAll
						dragDrop={{ onDrop, canDrop: () => true }}
					/>
				);

				await dragOnto(treeitem("b"), treeitem("a"), 0.05);

				await vi.waitFor(() => expect(onDrop).toHaveBeenCalledTimes(1));
				expect(onDrop.mock.calls[0][0].position).toBe("before");
				expect(onDrop.mock.calls[0][0].source).toBe(TREE[0]!.children![1]); // Child B
			});

			test("dropping near the bottom edge reports position 'after'", async () => {
				const onDrop = vi.fn();
				render(
					<TreeView<Node>
						tree={TREE}
						rowKey="id"
						getChildren={(n) => n.children}
						defaultExpandAll
						dragDrop={{ onDrop, canDrop: () => true }}
					/>
				);

				// Target a leaf (a1) so the bottom region resolves to a sibling insert, not make-child.
				await dragOnto(treeitem("b"), treeitem("a1"), 0.95);

				await vi.waitFor(() => expect(onDrop).toHaveBeenCalledTimes(1));
				expect(onDrop.mock.calls[0][0].position).toBe("after");
			});

			test("canDrop:false blocks the drop", async () => {
				const onDrop = vi.fn();
				render(
					<TreeView<Node>
						tree={TREE}
						rowKey="id"
						getChildren={(n) => n.children}
						defaultExpandAll
						dragDrop={{ onDrop, canDrop: () => false }}
					/>
				);

				await dragOnto(treeitem("b"), treeitem("a"), 0.05);
				await nextFrame();

				expect(onDrop).not.toHaveBeenCalled();
			});

			test("the default cycle guard forbids dropping a node into its own subtree", async () => {
				const onDrop = vi.fn();
				render(
					<TreeView<Node>
						tree={TREE}
						rowKey="id"
						getChildren={(n) => n.children}
						defaultExpandAll
						dragDrop={{ onDrop }}
					/>
				);

				// Drag "a" onto its own child "a1" — must be rejected by the cycle guard.
				await dragOnto(treeitem("a"), treeitem("a1"), 0.5);
				await nextFrame();

				expect(onDrop).not.toHaveBeenCalled();
			});
		});
	});
});
