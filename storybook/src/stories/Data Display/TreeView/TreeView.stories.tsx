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

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Key, ReactElement } from "react";
import { useRef, useState } from "react";

import { Button, ButtonGroup, Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import type { TreeViewProps, TreeViewScrollToNodeHandler } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { TreeView } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

interface FileNode {
	id: string;
	label: string;
	kind: "folder" | "file";
	children?: FileNode[];
}

const folder = (id: string, label: string, children: FileNode[]): FileNode => ({ id, label, kind: "folder", children });
const file = (id: string, label: string): FileNode => ({ id, label, kind: "file" });

const TREE: FileNode[] = [
	folder("src", "src", [
		folder("components", "components", [file("button", "button.tsx"), file("input", "input.tsx")]),
		folder("hooks", "hooks", [file("use-tree", "use-tree.ts")]),
		file("index", "index.ts")
	]),
	folder("docs", "docs", [file("readme", "README.md")]),
	file("package", "package.json")
];

const iconOf = (node: { kind: "folder" | "file" }): ReactElement => (
	<Icon>{node.kind === "folder" ? "folder" : "insert_drive_file"}</Icon>
);

function SelectionDemo(): ReactElement {
	const [selected, setSelected] = useState<ReadonlySet<Key>>(new Set(["button"]));

	return (
		<TreeView<FileNode>
			id="selection-tree-view"
			tree={TREE}
			rowKey="id"
			getChildren={(n) => n.children}
			getLabel={(n) => n.label}
			getIcon={iconOf}
			defaultExpandedKeys={["src", "components"]}
			selectionMode="single"
			selectedKeys={selected}
			onSelectionChange={setSelected}
		/>
	);
}

function ControlledDemo(): ReactElement {
	const [expanded, setExpanded] = useState<ReadonlySet<Key>>(new Set(["src"]));

	return (
		<TreeView<FileNode>
			id="controlled-tree-view"
			tree={TREE}
			rowKey="id"
			getChildren={(n) => n.children}
			getLabel={(n) => n.label}
			getIcon={iconOf}
			expandedKeys={expanded}
			onExpandedChange={setExpanded}
		/>
	);
}

/** Removes `sourceId` from the forest and re-inserts it relative to `targetId` per the drop `position`. */
function moveNode(
	nodes: FileNode[],
	sourceId: string,
	targetId: string,
	position: "before" | "after" | "inside"
): FileNode[] {
	let removed: FileNode | null = null;

	const remove = (list: FileNode[]): FileNode[] =>
		list.flatMap((node) => {
			if (node.id === sourceId) {
				removed = node;

				return [];
			}

			return [node.children ? { ...node, children: remove(node.children) } : node];
		});

	const insert = (list: FileNode[], node: FileNode): FileNode[] =>
		list.flatMap((current) => {
			if (current.id === targetId) {
				if (position === "before") {
					return [node, current];
				}

				if (position === "after") {
					return [current, node];
				}

				return [{ ...current, children: [...(current.children ?? []), node] }];
			}

			return [current.children ? { ...current, children: insert(current.children, node) } : current];
		});

	const rest = remove(nodes);

	return removed ? insert(rest, removed) : nodes;
}

/** Removes `sourceId` from the forest and appends it as the last top-level node (a root drop). */
function moveToRoot(nodes: FileNode[], sourceId: string): FileNode[] {
	let removed: FileNode | null = null;

	const remove = (list: FileNode[]): FileNode[] =>
		list.flatMap((node) => {
			if (node.id === sourceId) {
				removed = node;

				return [];
			}

			return [node.children ? { ...node, children: remove(node.children) } : node];
		});

	const rest = remove(nodes);

	return removed ? [...rest, removed] : nodes;
}

function DragAndDropDemo(): ReactElement {
	const [tree, setTree] = useState<FileNode[]>(TREE);

	return (
		// A fixed host height leaves empty space under the last node: the root drop zone.
		<div style={{ height: 520 }}>
			<TreeView<FileNode>
				id="drag-and-drop-tree-view"
				tree={tree}
				rowKey="id"
				getChildren={(n) => n.children}
				getLabel={(n) => n.label}
				getIcon={iconOf}
				defaultExpandAll
				fitToParent
				dragDrop={{
					onDrop: ({ source, target, position }) =>
						setTree((current) => moveNode(current, source.id, target.id, position)),
					// Dropped on the empty area below the last node: append the node to the top level.
					onDropToRoot: ({ source }) => setTree((current) => moveToRoot(current, source.id))
				}}
			/>
		</div>
	);
}

/**
 * Lazy-loading fixture. Children are left undefined (not []) so the model treats these folders
 * as unloaded and lazy-loadable — an empty array would mean "known to have zero children"
 * (no chevron).
 */
const LAZY_ROOTS: FileNode[] = [
	{ id: "remote", label: "remote", kind: "folder" },
	{ id: "cache", label: "cache", kind: "folder" }
];

/** Simulates a network round-trip: resolves two files per folder after ~800 ms. */
const loadChildren = (node: FileNode): Promise<FileNode[]> =>
	new Promise((resolve) =>
		setTimeout(
			() => resolve([file(`${node.id}-a`, `${node.label}-a.bin`), file(`${node.id}-b`, `${node.label}-b.bin`)]),
			800
		)
	);

/** The same hierarchy as an adjacency list: each node names its parent instead of holding a `children` array. */
interface FlatFileNode {
	id: string;
	parentId?: string;
	label: string;
	kind: "folder" | "file";
}

const FLAT_DATA: FlatFileNode[] = [
	{ id: "src", label: "src", kind: "folder" },
	{ id: "components", parentId: "src", label: "components", kind: "folder" },
	{ id: "button", parentId: "components", label: "button.tsx", kind: "file" },
	{ id: "input", parentId: "components", label: "input.tsx", kind: "file" },
	{ id: "index", parentId: "src", label: "index.ts", kind: "file" },
	{ id: "docs", label: "docs", kind: "folder" },
	{ id: "readme", parentId: "docs", label: "README.md", kind: "file" },
	{ id: "package", label: "package.json", kind: "file" }
];

/** Per-node action buttons via `getActions`, plus one node greyed out via `isDisabled`. */
function NodeActionsDemo(): ReactElement {
	const [lastAction, setLastAction] = useState("Nothing clicked yet");

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
			<TreeView<FileNode>
				id="node-actions-tree-view"
				tree={TREE}
				rowKey="id"
				getChildren={(n) => n.children}
				getLabel={(n) => n.label}
				getIcon={iconOf}
				defaultExpandAll
				selectionMode="single"
				isDisabled={(n) => n.id === "docs"}
				getActions={(n) =>
					n.kind === "file" ? (
						<Button
							icon={<Icon>edit</Icon>}
							title={`Edit ${n.label}`}
							onClick={(event): void => {
								// Keep the click from also selecting the node.
								event.stopPropagation();
								setLastAction(`Edit ${n.label}`);
							}}
						/>
					) : undefined
				}
			/>
			<output>Last action: {lastAction}</output>
		</div>
	);
}

/** Eight folders of five files each — enough to overflow the 240px host below. */
const DEEP_TREE: FileNode[] = Array.from({ length: 8 }, (_unused, group): FileNode =>
	folder(
		`group-${group}`,
		`batch-${group}`,
		Array.from({ length: 5 }, (_u, index): FileNode => file(`group-${group}-run-${index}`, `run-${group}${index}.log`))
	)
);

/** `fitToParent` makes the tree fill and scroll within its host; `scrollToNode` brings a key into view. */
function ScrollToNodeDemo(): ReactElement {
	const scrollRef = useRef<TreeViewScrollToNodeHandler>(null);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
			<ButtonGroup>
				<Button onClick={() => scrollRef.current?.("group-0-run-0", { autoFocus: true })}>Scroll to first</Button>
				<Button onClick={() => scrollRef.current?.("group-4-run-2", { autoFocus: true })}>Scroll to run-42</Button>
				<Button onClick={() => scrollRef.current?.("group-7-run-4", { autoFocus: true })}>Scroll to last</Button>
			</ButtonGroup>
			<div style={{ height: 240 }}>
				<TreeView<FileNode>
					id="scroll-to-node-tree-view"
					tree={DEEP_TREE}
					rowKey="id"
					getChildren={(n) => n.children}
					getLabel={(n) => n.label}
					getIcon={iconOf}
					defaultExpandAll
					fitToParent
					scrollToNode={(handler) => {
						scrollRef.current = handler;
					}}
				/>
			</div>
		</div>
	);
}

const meta: Meta<typeof TreeView<FileNode>> = {
	title: "Data Display/TreeView",
	component: TreeView,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Stories that are plain props are written as `args`, so "Show code" is generated from the
 * rendered `TreeView` element. Stories that need React state keep a demo component and ship a
 * hand-written `docs.source.code` snippet instead — otherwise the snippet would only read
 * `<SomeDemo />`. Controls are switched off for those, since the demo ignores args.
 */
const BASE_ARGS: TreeViewProps<FileNode> = {
	tree: TREE,
	rowKey: "id",
	getChildren: (n) => n.children,
	getLabel: (n) => n.label,
	getIcon: iconOf
};

const STATEFUL_DEMO = { controls: { disable: true } };

export const Basic: Story = {
	name: "Basic",
	args: {
		...BASE_ARGS,
		id: "basic-tree-view",
		defaultExpandedKeys: ["src", "components"]
	},
	parameters: {
		docs: {
			description: {
				story:
					'`TreeView` is the modern, headless-model-driven replacement for the legacy `Tree`. Pass your own row type plus a nested `tree` (+ `getChildren`) or a flat `data` (+ `getParentId`) and a stable `rowKey`; presentation comes from `getLabel` / `getIcon`. Expansion is **uncontrolled** here, seeded with `defaultExpandedKeys`.\n\n**Accessibility:** `role="tree"` with `role="treeitem"` + `aria-level` / `aria-setsize` / `aria-posinset` / `aria-expanded` per node, and a single roving tab stop for keyboard navigation (Up/Down, Right/Left, Home/End).'
			}
		}
	}
};

export const FlatData: StoryObj<typeof TreeView<FlatFileNode>> = {
	name: "Flat Data",
	args: {
		id: "flat-data-tree-view",
		data: FLAT_DATA,
		getParentId: (n) => n.parentId,
		rowKey: "id",
		getLabel: (n) => n.label,
		getIcon: iconOf,
		defaultExpandAll: true
	},
	parameters: {
		docs: {
			description: {
				story:
					"Instead of a nested `tree`, hand the tree a flat `data` array plus `getParentId` and it rebuilds the hierarchy itself — convenient when the data arrives normalized (a database table, a flat store). Roots simply return `undefined` from `getParentId`; a node whose parent key is unknown becomes a root as well."
			}
		}
	}
};

export const Selection: Story = {
	name: "Selection",
	render: () => <SelectionDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `const [selected, setSelected] = useState<ReadonlySet<Key>>(new Set(["button"]));

<TreeView<FileNode>
	tree={TREE}
	rowKey="id"
	getChildren={(n) => n.children}
	getLabel={(n) => n.label}
	getIcon={iconOf}
	defaultExpandedKeys={["src", "components"]}
	selectionMode="single"
	selectedKeys={selected}
	onSelectionChange={setSelected}
/>`
			},
			description: {
				story:
					"Set `selectionMode` (`single` / `multiple`) and drive selection with `selectedKeys` + `onSelectionChange` (or uncontrolled `defaultSelectedKeys`). Click a node or focus it and press Enter/Space."
			}
		}
	}
};

export const ControlledExpansion: Story = {
	name: "Controlled Expansion",
	render: () => <ControlledDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `const [expanded, setExpanded] = useState<ReadonlySet<Key>>(new Set(["src"]));

<TreeView<FileNode>
	tree={TREE}
	rowKey="id"
	getChildren={(n) => n.children}
	getLabel={(n) => n.label}
	getIcon={iconOf}
	expandedKeys={expanded}
	onExpandedChange={setExpanded}
/>`
			},
			description: {
				story:
					"Own expansion yourself with `expandedKeys` + `onExpandedChange` — useful for persistence or expand/collapse-all."
			}
		}
	}
};

export const DragAndDrop: Story = {
	name: "Drag & Drop (reparenting)",
	render: () => <DragAndDropDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `const [tree, setTree] = useState<FileNode[]>(TREE);

// moveNode removes \`source\` from the forest and re-inserts it before/after \`target\`,
// or as its last child for position "inside". A fixed host height leaves empty space
// under the last node — that space is the root drop zone.
<div style={{ height: 520 }}>
	<TreeView<FileNode>
		tree={tree}
		rowKey="id"
		getChildren={(n) => n.children}
		getLabel={(n) => n.label}
		getIcon={iconOf}
		defaultExpandAll
		fitToParent
		dragDrop={{
			onDrop: ({ source, target, position }) =>
				setTree((current) => moveNode(current, source.id, target.id, position)),
			// Dropped on the empty area below the last node: append the node to the top level.
			onDropToRoot: ({ source }) => setTree((current) => moveToRoot(current, source.id))
		}}
	/>
</div>`
			},
			description: {
				story:
					"Pass `dragDrop` to make nodes draggable — powered by `@com.mgmtp.a12.widgets/pragmatic-drag-and-drop` and its tree-item hitbox. Drop near a node's **top/bottom edge** to reorder (`before`/`after`), or over the **middle of a folder** to reparent (`inside`). The self/descendant cycle guard is built in; `onDrop` reports `{ source, target, position }`.\n\n**Root drop zone:** with `onDropToRoot` provided, the **empty area below the last node** (here the tree fills a 520 px host) accepts a drop that moves the node to the top level. The zone is framed while hovered; `canDropToRoot` can forbid it per node.\n\n**Keyboard:** focus a node and press **Space** to pick it up. **Up/Down** move it before the previous / after the next sibling, **Home/End** to the first / last position among its siblings, **Right** nests it under the sibling above it and **Left** moves it out to sit right after its parent (from a first-level node, that is the top level). **Space** or **Enter** drops, **Escape** cancels, and every step is announced to screen readers. `canDrop` gates keyboard moves exactly as it gates pointer drops; `onDrop` receives the same payload."
			}
		}
	}
};

export const LazyLoading: Story = {
	name: "Lazy Loading",
	args: {
		...BASE_ARGS,
		id: "lazy-tree-view",
		tree: LAZY_ROOTS,
		loadChildren,
		isLeaf: (n) => n.kind === "file"
	},
	parameters: {
		docs: {
			description: {
				story:
					"With `loadChildren`, a folder's children are fetched the first time it expands and held internally. Click a folder to expand it: the chevron is replaced by the `ArrowButton`'s built-in loading indicator (~800 ms here) until the children arrive, then they are cached for later expands. `isLeaf` tells the tree which nodes can never expand, so files show no chevron. Roots start with `undefined` children — an empty array would mean \"no children\" and show no chevron, so map an unloaded parent to `undefined` rather than `[]`."
			}
		}
	}
};

export const NodeActions: Story = {
	name: "Node Actions & Disabled Nodes",
	render: () => <NodeActionsDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `const [lastAction, setLastAction] = useState("Nothing clicked yet");

<TreeView<FileNode>
	tree={TREE}
	rowKey="id"
	getChildren={(n) => n.children}
	getLabel={(n) => n.label}
	getIcon={iconOf}
	defaultExpandAll
	selectionMode="single"
	isDisabled={(n) => n.id === "docs"}
	getActions={(n) =>
		n.kind === "file" ? (
			<Button
				icon={<Icon>edit</Icon>}
				title={\`Edit \${n.label}\`}
				onClick={(event) => {
					// Keep the click from also selecting the node.
					event.stopPropagation();
					setLastAction(\`Edit \${n.label}\`);
				}}
			/>
		) : undefined
	}
/>
<output>Last action: {lastAction}</output>`
			},
			description: {
				story:
					"`getActions` renders trailing controls at the end of a node — here an edit button per file. Stop the click from propagating so it does not also select the node, and give each button an accessible name that includes the node (see the showcase's Accessibility example for the `aria-labelledby` variants). `isDisabled` greys a node out and makes it non-interactive; here the `docs` folder."
			}
		}
	}
};

export const ScrollToNode: Story = {
	name: "Scroll to Node",
	render: () => <ScrollToNodeDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `const scrollRef = useRef<TreeViewScrollToNodeHandler>(null);

<Button onClick={() => scrollRef.current?.("group-4-run-2", { autoFocus: true })}>Scroll to run-42</Button>

<div style={{ height: 240 }}>
	<TreeView<FileNode>
		tree={DEEP_TREE}
		rowKey="id"
		getChildren={(n) => n.children}
		getLabel={(n) => n.label}
		getIcon={iconOf}
		defaultExpandAll
		fitToParent
		scrollToNode={(handler) => {
			scrollRef.current = handler;
		}}
	/>
</div>`
			},
			description: {
				story:
					"Capture the handle from `scrollToNode={(handler) => …}` and call it with a `rowKey` (and optional `{ autoFocus }`) to scroll that node into view and focus it. A node hidden inside a collapsed ancestor is not rendered, so the call is a no-op. `fitToParent` makes the tree fill its host's height and scroll inside it — without it the tree grows to its content and the page scrolls instead."
			}
		}
	}
};
