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

import { Profiler } from "react";
import {
	findAllByDataRole,
	findByText,
	fireEvent,
	getAllByDataRole,
	getByDataRole,
	getByText,
	queryByText,
	render
} from "test-utils";
import type { Mock } from "vitest";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import type { Instruction } from "@com.mgmtp.a12.widgets/pragmatic-drag-and-drop-hitbox/tree-item";

import { DataRoles } from "../../common/main/data-roles.js";
import { KeyboardNavigationConfigProvider } from "../../keyboard-navigation/main/keyboard-navigation-context.js";
import type { FlatTreeRow } from "../main/model/index.js";
import {
	computeItemMode,
	indicatorFromInstruction,
	isSameIndicator,
	mapInstructionToDropResult,
	resolveTreeKeyboardMove
} from "../main/tree-view-dnd.js";
import type { TreeViewProps, TreeViewScrollToNodeHandler } from "../main/tree-view.api.js";
import { StyledTreeViewDropBand } from "../main/tree-view.styled.js";
import { TreeView } from "../main/tree-view.view.js";

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

/** Expand/collapse control of a node, keyed by id. */
function expander(key: string): HTMLElement {
	const el = document.getElementById(`tree-node-arrow-${key}`)?.querySelector<HTMLElement>("button");

	if (!el) {
		throw new Error(`no expander for ${key}`);
	}

	return el;
}

/**
 * Treeitem of a node, keyed by id. The `treeitem` is the content element - the same element that takes
 * the focus - not the presentational wrapper around it.
 */
function treeitem(key: string): HTMLElement {
	return content(key);
}

/**
 * Presentational wrapper around a node, keyed by id. This is the element the drag and drop layer
 * registers as the draggable, so the drag tests address it rather than the `treeitem` inside it.
 */
function nodeContainer(key: string): HTMLElement {
	const el = document.getElementById(`tree-node-${key}`);

	if (!el) {
		throw new Error(`no node container for ${key}`);
	}

	return el;
}

describe("com.mgmtp.a12.widgets.tree-view", () => {
	describe("rendering & expansion", () => {
		test("renders the visible nodes for the initial expansion", () => {
			const { container } = render(
				<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} defaultExpandedKeys={["root"]} />
			);

			// Scoped to the node-name element: a parent's label also appears in each child's visually hidden
			// ", belongs to <parent>" block, so an unscoped text query matches more than one element.
			const nodeName = { selector: `[data-role="${DataRoles.Tree.Node.Name}"]` };

			expect(getByText(container, "Root", nodeName)).toBeInTheDocument();
			expect(getByText(container, "Child A", nodeName)).toBeInTheDocument();
			expect(getByText(container, "Child B", nodeName)).toBeInTheDocument();
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

			const nodeName = { selector: `[data-role="${DataRoles.Tree.Node.Name}"]` };

			expect(getByText(container, "One", nodeName)).toBeInTheDocument();
			expect(getByText(container, "Two", nodeName)).toBeInTheDocument();
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
			// `ProgressIndicator` only mounts its spinner after `setTimeout(openingDelay)` has fired, so the
			// spinner lands a macrotask *after* the click promise resolves — await it instead of reading the DOM
			// synchronously (the synchronous read races the timer and loses under load).
			expect(await findAllByDataRole(treeitem("remote"), DataRoles.ProgressIndicator.CircleSpinner)).not.toHaveLength(
				0
			);
			expect(expander).toBeDisabled();
			expect(loadChildren).toHaveBeenCalledTimes(1);

			resolveChildren([{ id: "remote-1", label: "remote-a.bin" }]);

			// Children arrive; loading indicator gone; chevron back (now expanded).
			expect(await findByText(container, "remote-a.bin")).toBeInTheDocument();
			expect(treeitem("remote").querySelector(`[data-role="${DataRoles.ProgressIndicator.CircleSpinner}"]`)).toBeNull();
			expect(treeitem("remote")).toHaveAttribute("aria-expanded", "true");
		});

		test("an unloaded parent shows a chevron and fetches its children on first expand", async () => {
			const loadChildren = vi.fn(async (): Promise<Node[]> => [{ id: "remote-1", label: "remote-a.bin" }]);
			// `undefined` children mean "not loaded yet" and earn a chevron through `loadChildren`; `isLeaf`
			// pins the nodes that can never expand. No placeholder child rows are needed for either.
			const lazyTree: Node[] = [
				{ id: "remote", label: "remote" },
				{ id: "file", label: "file" }
			];
			const { container } = render(
				<TreeView<Node>
					tree={lazyTree}
					rowKey="id"
					getChildren={(n) => n.children}
					loadChildren={loadChildren}
					isLeaf={(n) => n.id === "file"}
				/>
			);

			// A leaf treeitem carries no `aria-expanded`.
			expect(treeitem("remote")).toHaveAttribute("aria-expanded", "false");
			expect(treeitem("file")).not.toHaveAttribute("aria-expanded");

			await userEvent.click(expander("remote"));

			expect(loadChildren).toHaveBeenCalledTimes(1);
			expect(await findByText(container, "remote-a.bin")).toBeInTheDocument();
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

		// A screen reader only hands the arrow keys to the tree - and only announces a node's level,
		// position and expanded state - while the focused element is itself the `treeitem`. Splitting the
		// role onto a wrapper and the `tabindex` onto the element inside it left NVDA in browse mode, where
		// it consumes the arrow keys before the tree's keydown handler runs.
		test("puts role=treeitem on the element that takes the focus", () => {
			const { container } = render(
				<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} defaultExpandedKeys={["root"]} />
			);

			const treeitems = container.querySelectorAll<HTMLElement>('[role="treeitem"]');

			expect(treeitems).toHaveLength(3);

			for (const item of treeitems) {
				expect(item).toHaveAttribute("tabindex");
				expect(item).toHaveAttribute("data-role", DataRoles.Tree.Node.Content);
			}

			// The wrapper keeps no semantics of its own, so `role="tree"` still owns the items across it.
			expect(getAllByDataRole(container, DataRoles.Tree.Node)[0]).toHaveAttribute("role", "presentation");
		});

		test("keeps a single roving tab stop", () => {
			render(<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} defaultExpandedKeys={["root"]} />);

			expect(content("root")).toHaveAttribute("tabindex", "0");
			expect(content("a")).toHaveAttribute("tabindex", "-1");
			expect(content("b")).toHaveAttribute("tabindex", "-1");
		});

		test("names the expand/collapse control after its node and keeps it visible to assistive tech", () => {
			render(<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} defaultExpandedKeys={["root"]} />);

			// `aria-labelledby` overrides the localized "Expand subitems" title, as in the legacy `Tree`, so the
			// control announces the node instead of a string every chevron in the tree shares.
			expect(expander("root")).toHaveAttribute("aria-labelledby", "tree-node-name-root");
			expect(document.getElementById("tree-node-name-root")).toHaveTextContent("Root");

			// It is focusable, so it must not be hidden from assistive technology — that would strand the focus.
			expect(expander("root")).not.toHaveAttribute("aria-hidden");
		});

		test("the expand/collapse control is its own tab stop in the default navigation mode", () => {
			render(<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} defaultExpandedKeys={["root"]} />);

			expect(expander("root")).not.toHaveAttribute("tabindex");
		});

		test("arrow-only navigation takes the expand/collapse control out of the tab order", () => {
			render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} defaultExpandedKeys={["root"]} />
				</KeyboardNavigationConfigProvider>
			);

			// The node content stays the node's only tab stop; the arrows drive expansion instead.
			expect(expander("root")).toHaveAttribute("tabindex", "-1");
			expect(content("root")).toHaveAttribute("tabindex", "0");
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

		test("an arrow key pressed on the expand/collapse control returns focus to the node", async () => {
			render(<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} defaultExpandedKeys={["root"]} />);

			// Clicking the chevron focuses it, since a button takes focus on click in every navigation mode.
			await userEvent.click(expander("root"));
			expect(document.activeElement).toBe(expander("root"));

			// The first arrow press brings focus back to the node, as the legacy `Tree` does...
			await userEvent.keyboard("{ArrowDown}");
			expect(document.activeElement?.id).toBe("tree-node-content-root");

			// ...and the next one navigates from there. Root was collapsed by the click, so re-expand first.
			await userEvent.keyboard("{ArrowRight}");
			await userEvent.keyboard("{ArrowDown}");
			expect(document.activeElement?.id).toBe("tree-node-content-a");
		});

		test("arrow keys inside a node's own content are left to that content", async () => {
			const onExpandedChange = vi.fn();
			render(
				<TreeView<Node>
					tree={TREE}
					rowKey="id"
					getChildren={(n) => n.children}
					defaultExpandedKeys={["root"]}
					onExpandedChange={onExpandedChange}
					getLabel={(node) => (node.id === "b" ? <input aria-label="Rename" defaultValue="Child B" /> : node.label)}
				/>
			);

			const input = treeitem("b").querySelector("input") as HTMLInputElement;
			input.focus();
			input.setSelectionRange(0, 0);

			// The caret moves; the tree neither navigates away nor collapses anything.
			await userEvent.keyboard("{ArrowRight}");
			expect(document.activeElement).toBe(input);
			expect(input.selectionStart).toBe(1);
			expect(onExpandedChange).not.toHaveBeenCalled();
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
			kind: "node",
			row: { id: key, label: key },
			key,
			level,
			expandable: false,
			expanded: false,
			loading: false,
			hasMore: false,
			loadingMore: false,
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

		describe("keyboard moves (pure)", () => {
			// r0(0) > a(1), b(1), c(1)  — indices: r0=0, a=1, b=2, c=3
			const rows = [
				flat("r0", 0),
				flat("a", 1, { parentKey: "r0" }),
				flat("b", 1, { parentKey: "r0" }),
				flat("c", 1, { parentKey: "r0" })
			];

			test("up / down target the adjacent sibling with before / after", () => {
				expect(resolveTreeKeyboardMove(rows, 2, "up")).toMatchObject({ target: { key: "a" }, position: "before" });
				expect(resolveTreeKeyboardMove(rows, 2, "down")).toMatchObject({ target: { key: "c" }, position: "after" });
			});

			test("top / bottom target the first / last sibling", () => {
				expect(resolveTreeKeyboardMove(rows, 3, "top")).toMatchObject({ target: { key: "a" }, position: "before" });
				expect(resolveTreeKeyboardMove(rows, 1, "bottom")).toMatchObject({ target: { key: "c" }, position: "after" });
			});

			test("into nests under the preceding sibling", () => {
				expect(resolveTreeKeyboardMove(rows, 2, "into")).toMatchObject({ target: { key: "a" }, position: "inside" });
			});

			test("out outdents to become the parent's next sibling", () => {
				expect(resolveTreeKeyboardMove(rows, 2, "out")).toMatchObject({ target: { key: "r0" }, position: "after" });
			});

			test("moves that do not apply resolve to null", () => {
				expect(resolveTreeKeyboardMove(rows, 1, "up")).toBeNull(); // a is already first
				expect(resolveTreeKeyboardMove(rows, 3, "down")).toBeNull(); // c is already last
				expect(resolveTreeKeyboardMove(rows, 1, "into")).toBeNull(); // no preceding sibling to nest under
				expect(resolveTreeKeyboardMove(rows, 0, "out")).toBeNull(); // r0 is a root node
			});
		});

		describe("keyboard grab-and-move", () => {
			test("Space grabs a node and ArrowUp reorders it before its previous sibling", async () => {
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

				// Rows: root, a, a1, b. Grab "b" and move it up → before its sibling "a".
				content("b").focus();
				await userEvent.keyboard(" ");
				await userEvent.keyboard("{ArrowUp}");

				expect(onDrop).toHaveBeenCalledTimes(1);
				expect(onDrop.mock.calls[0]![0].position).toBe("before");
				expect(onDrop.mock.calls[0]![0].source).toBe(TREE[0]!.children![1]); // Child B
				expect(onDrop.mock.calls[0]![0].target).toBe(TREE[0]!.children![0]); // Child A
			});

			// Enabling DnD costs a selectable tree its Space-to-select, since the grab claims Space first.
			function renderSelectableDnD(dragDrop: TreeViewProps<Node>["dragDrop"]): {
				onDrop: Mock;
				onSelectionChange: Mock;
			} {
				const onDrop = vi.fn();
				const onSelectionChange = vi.fn();

				render(
					<TreeView<Node>
						tree={TREE}
						rowKey="id"
						getChildren={(n) => n.children}
						defaultExpandAll
						selectionMode="single"
						onSelectionChange={onSelectionChange}
						dragDrop={{ ...dragDrop, onDrop }}
					/>
				);

				return { onDrop, onSelectionChange };
			}

			test("by default the grab claims Space, so a selectable tree selects with Enter alone", async () => {
				const { onDrop, onSelectionChange } = renderSelectableDnD({});

				content("b").focus();
				await userEvent.keyboard(" ");
				expect(onSelectionChange).not.toHaveBeenCalled();

				await userEvent.keyboard("{ArrowUp}");
				expect(onDrop).toHaveBeenCalledTimes(1);

				// Enter drops the node still being held, then selects once nothing is held.
				await userEvent.keyboard("{Enter}");
				expect(onSelectionChange).not.toHaveBeenCalled();

				await userEvent.keyboard("{Enter}");
				expect(onSelectionChange).toHaveBeenCalledTimes(1);
			});

			test("keyboardGrabKey:false gives Space back to selection and never grabs", async () => {
				const { onDrop, onSelectionChange } = renderSelectableDnD({ keyboardGrabKey: false });

				content("b").focus();
				await userEvent.keyboard(" ");
				expect(onSelectionChange).toHaveBeenCalledTimes(1);

				// Nothing is grabbed, so the arrow navigates instead of reordering.
				await userEvent.keyboard("{ArrowUp}");
				expect(onDrop).not.toHaveBeenCalled();
			});

			test("arrows navigate (no onDrop) until a node is grabbed", async () => {
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

				content("b").focus();
				await userEvent.keyboard("{ArrowUp}");
				expect(onDrop).not.toHaveBeenCalled();
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

			test("the insertion band starts at the label offset of the level it is indented to", () => {
				const { container } = render(
					<div style={{ position: "relative" }}>
						<TreeView<Node>
							tree={TREE}
							rowKey="id"
							getChildren={(n) => n.children}
							defaultExpandAll
							dragDrop={{ onDrop: vi.fn() }}
						/>
						<StyledTreeViewDropBand $position="top" $active $level={0} data-role="band-0" />
						<StyledTreeViewDropBand $position="top" $active $level={2} data-role="band-2" />
					</div>
				);
				const bandAt = (level: number): CSSStyleDeclaration =>
					getComputedStyle(container.querySelector(`[data-role="band-${level}"]`)!);

				// Idle: the node's own bands are mounted but not painted.
				const idle = getAllByDataRole(container, DataRoles.Tree.Dropdown.HintTop);
				expect(idle.length).toBeGreaterThan(0);
				expect(idle.every((el) => getComputedStyle(el).display === "none")).toBe(true);

				// Active: the band is indented to the level's label offset, not drawn from the left edge.
				expect(bandAt(2).left).toBe(getComputedStyle(content("a1")).paddingLeft); // a1 sits at level 2
				expect(bandAt(0).left).toBe(getComputedStyle(content("root")).paddingLeft);
				expect(bandAt(2).left).not.toBe(bandAt(0).left);
			});

			test("equal indicators compare as the same placement (so a repeated dragover can bail)", () => {
				const base = { type: "reorder-top", level: 1, forbidden: false } as const;

				expect(isSameIndicator(null, null)).toBe(true);
				expect(isSameIndicator(base, { ...base })).toBe(true);
				expect(isSameIndicator(base, null)).toBe(false);
				expect(isSameIndicator(base, { ...base, level: 2 })).toBe(false);
				expect(isSameIndicator(base, { ...base, forbidden: true })).toBe(false);
				expect(isSameIndicator(base, { ...base, type: "child" })).toBe(false);
			});
		});

		describe("integration", () => {
			function nextFrame(): Promise<void> {
				return new Promise((resolve) => requestAnimationFrame(() => resolve()));
			}

			/** Waits until `read()` stops changing across two frames, then returns it. */
			async function settled(read: () => number): Promise<number> {
				let previous = -1;

				while (previous !== read()) {
					previous = read();
					await nextFrame();
					await nextFrame();
				}

				return read();
			}

			/**
			 * Repeats an identical drag event until it stops costing commits, then returns the
			 * settled count. React's eager same-state bail-out only applies once the fiber carries
			 * no lanes from the previous render, so the first stationary event after a real change
			 * still renders once — this reaches the steady state that must then be free.
			 */
			async function holdStill(read: () => number, fire: () => void): Promise<number> {
				for (let warmUp = 0; warmUp < 4; warmUp++) {
					const before = read();
					fire();
					await settled(read);

					if (read() === before) {
						break;
					}
				}

				return read();
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
				expect(nodeContainer("a").getAttribute("draggable")).toBe("true");

				const { container } = render(
					<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} defaultExpandAll />
				);
				expect(container.querySelector('[role="treeitem"]')?.getAttribute("draggable")).not.toBe("true");
				expect(withDnd).toBeTruthy();
			});

			test("holding the pointer still over a node commits nothing; moving it commits again", async () => {
				// `onDrag` is dispatched from every `dragover`, and the browser re-fires `dragover`
				// on a timer while the pointer is held still. The hovered node's indicator state
				// must therefore compare equal placements, or a motionless hover repaints it
				// several times a second.
				let commits = 0;
				render(
					<Profiler
						id="tree-view"
						onRender={(): void => {
							commits++;
						}}
					>
						<TreeView<Node>
							tree={TREE}
							rowKey="id"
							getChildren={(n) => n.children}
							defaultExpandAll
							dragDrop={{ onDrop: vi.fn(), canDrop: () => true }}
						/>
					</Profiler>
				);

				const source = nodeContainer("b");
				const target = nodeContainer("a");
				const dataTransfer = new DataTransfer();
				fireEvent.dragStart(source, { dataTransfer });

				try {
					await nextFrame();

					const rect = target.getBoundingClientRect();
					const still = { clientX: rect.left + rect.width * 0.7, clientY: rect.top + rect.height * 0.05 };
					const moved = { clientX: still.clientX, clientY: rect.top + rect.height * 0.9 };

					fireEvent.dragEnter(target, { dataTransfer, ...still });
					const beforeStill = await holdStill(
						() => commits,
						() => fireEvent.dragOver(target, { dataTransfer, ...still })
					);

					for (let repeat = 0; repeat < 5; repeat++) {
						fireEvent.dragOver(target, { dataTransfer, ...still });
						await nextFrame();
					}

					expect(commits).toBe(beforeStill);

					// A real move to the opposite edge flips the indicator, which must still commit.
					fireEvent.dragOver(target, { dataTransfer, ...moved });
					await vi.waitFor(() => expect(commits).toBeGreaterThan(beforeStill));
				} finally {
					fireEvent.dragEnd(source, { dataTransfer });
				}
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

				await dragOnto(nodeContainer("b"), nodeContainer("a"), 0.05);

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
				await dragOnto(nodeContainer("b"), nodeContainer("a1"), 0.95);

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

				await dragOnto(nodeContainer("b"), nodeContainer("a"), 0.05);
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
				await dragOnto(nodeContainer("a"), nodeContainer("a1"), 0.5);
				await nextFrame();

				expect(onDrop).not.toHaveBeenCalled();
			});

			// Root drop zone: the container's empty area below the last node (only there when the tree is
			// shorter than its bounded height) accepts a drop that moves the node to the top level.
			describe("root drop zone", () => {
				const A1 = TREE[0].children![0].children![0]; // Grandchild A1

				function renderRootDnd(dragDrop: NonNullable<Parameters<typeof TreeView<Node>>[0]["dragDrop"]>): {
					container: HTMLElement;
					root: HTMLElement;
				} {
					const { container } = render(
						<div style={{ height: 320 }}>
							<TreeView<Node>
								tree={TREE}
								rowKey="id"
								getChildren={(n) => n.children}
								defaultExpandAll
								fitToParent
								dragDrop={dragDrop}
							/>
						</div>
					);

					return { container, root: getByDataRole(container, DataRoles.Tree) };
				}

				/** Starts dragging `source` and hovers the container's empty area below the last node. */
				async function hoverBelowNodes(
					root: HTMLElement,
					source: HTMLElement
				): Promise<{ dataTransfer: DataTransfer; point: { clientX: number; clientY: number } }> {
					const dataTransfer = new DataTransfer();
					fireEvent.dragStart(source, { dataTransfer });
					await nextFrame();

					const lastNode = nodeContainer("b");
					const point = {
						clientX: root.getBoundingClientRect().left + 20,
						clientY: lastNode.getBoundingClientRect().bottom + 20
					};

					// The empty area is real: the container reaches further down than the last node.
					expect(point.clientY).toBeLessThan(root.getBoundingClientRect().bottom);

					fireEvent.dragEnter(root, { dataTransfer, ...point });
					fireEvent.dragOver(root, { dataTransfer, ...point });

					return { dataTransfer, point };
				}

				test("dropping on the empty area below the last node reports onDropToRoot, not onDrop", async () => {
					const onDrop = vi.fn();
					const onDropToRoot = vi.fn();
					const { root } = renderRootDnd({ onDrop, onDropToRoot });

					const { dataTransfer, point } = await hoverBelowNodes(root, nodeContainer("a1"));

					await vi.waitFor(() => expect(root.getAttribute("data-drop-target")).toBe("droppable"));

					fireEvent.drop(root, { dataTransfer, ...point });
					fireEvent.dragEnd(nodeContainer("a1"), { dataTransfer });

					expect(onDropToRoot).toHaveBeenCalledTimes(1);
					expect(onDropToRoot.mock.calls[0][0]).toEqual({ source: A1 });
					expect(onDrop).not.toHaveBeenCalled();
					expect(root.getAttribute("data-drop-target")).toBeNull();
				});

				test("the zone is armed only while onDropToRoot is provided", async () => {
					const onDrop = vi.fn();
					const { root } = renderRootDnd({ onDrop });

					const { dataTransfer, point } = await hoverBelowNodes(root, nodeContainer("a1"));
					await nextFrame();

					expect(root.getAttribute("data-drop-target")).toBeNull();

					fireEvent.drop(root, { dataTransfer, ...point });
					fireEvent.dragEnd(nodeContainer("a1"), { dataTransfer });

					expect(onDrop).not.toHaveBeenCalled();
				});

				test("canDropToRoot:false shows the forbidden zone and blocks the drop", async () => {
					const onDropToRoot = vi.fn();
					const { root } = renderRootDnd({ onDropToRoot, canDropToRoot: () => false });

					const { dataTransfer, point } = await hoverBelowNodes(root, nodeContainer("a1"));

					await vi.waitFor(() => expect(root.getAttribute("data-drop-target")).toBe("forbidden"));

					fireEvent.drop(root, { dataTransfer, ...point });
					fireEvent.dragEnd(nodeContainer("a1"), { dataTransfer });

					expect(onDropToRoot).not.toHaveBeenCalled();
					expect(root.getAttribute("data-drop-target")).toBeNull();
				});
			});
		});
	});
});

describe("com.mgmtp.a12.widgets.tree-view.generated-id", () => {
	test("generates an id for the root and the nodes container when none is given", () => {
		const { container } = render(<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} />);
		const root = getByDataRole(container, DataRoles.Tree);
		const nodes = getByDataRole(container, DataRoles.Tree.Nodes);

		expect(root.id).toMatch(/^tree-view-/);
		expect(nodes.id).toBe(`tree-view-root-${root.id}`);
		// No id must never leak into the derived container id.
		expect(container.querySelector("[id*='undefined']")).toBeNull();
	});

	test("keeps the generated id stable across re-renders", () => {
		const { container, rerender } = render(<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} />);
		const before = getByDataRole(container, DataRoles.Tree).id;

		rerender(<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} defaultExpandAll />);

		expect(getByDataRole(container, DataRoles.Tree).id).toBe(before);
	});

	test("gives sibling instances distinct generated ids", () => {
		const { container } = render(
			<>
				<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} />
				<TreeView<Node> tree={TREE} rowKey="id" getChildren={(n) => n.children} />
			</>
		);
		const [first, second] = container.querySelectorAll(`[data-role="${DataRoles.Tree}"]`);

		expect(first.id).not.toBe(second.id);
	});

	test("uses a given id verbatim", () => {
		const { container } = render(
			<TreeView<Node> id="my-tree" tree={TREE} rowKey="id" getChildren={(n) => n.children} />
		);

		expect(getByDataRole(container, DataRoles.Tree).id).toBe("my-tree");
		expect(getByDataRole(container, DataRoles.Tree.Nodes).id).toBe("tree-view-root-my-tree");
	});
});
