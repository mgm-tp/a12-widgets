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

import type { Key, ReactElement } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Icon } from "@com.mgmtp.a12.widgets/widgets-core";
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

const iconOf = (node: FileNode): ReactElement => <Icon>{node.kind === "folder" ? "folder" : "insert_drive_file"}</Icon>;

function BasicDemo(): ReactElement {
	return (
		<TreeView<FileNode>
			tree={TREE}
			rowKey="id"
			getChildren={(n) => n.children}
			getLabel={(n) => n.label}
			getIcon={iconOf}
			defaultExpandedKeys={["src", "components"]}
		/>
	);
}

function SelectionDemo(): ReactElement {
	const [selected, setSelected] = useState<ReadonlySet<Key>>(new Set(["button"]));

	return (
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
		/>
	);
}

function ControlledDemo(): ReactElement {
	const [expanded, setExpanded] = useState<ReadonlySet<Key>>(new Set(["src"]));

	return (
		<TreeView<FileNode>
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

function DragAndDropDemo(): ReactElement {
	const [tree, setTree] = useState<FileNode[]>(TREE);

	return (
		<TreeView<FileNode>
			tree={tree}
			rowKey="id"
			getChildren={(n) => n.children}
			getLabel={(n) => n.label}
			getIcon={iconOf}
			defaultExpandAll
			dragDrop={{
				onDrop: ({ source, target, position }) => {
					// Demo only: log the resolved move. A real consumer mutates `tree` here.
					// eslint-disable-next-line no-console
					console.log("drop", source.id, position, target.id);
					setTree((current) => current);
				}
			}}
		/>
	);
}

/** Lazily loads a folder's children on first expand, simulating a network round-trip. */
function LazyDemo(): ReactElement {
	// Children are left undefined (not []) so the model treats these folders as unloaded and
	// lazy-loadable — an empty array would mean "known to have zero children" (no chevron).
	const roots: FileNode[] = [
		{ id: "remote", label: "remote", kind: "folder" },
		{ id: "cache", label: "cache", kind: "folder" }
	];

	const loadChildren = (node: FileNode): Promise<FileNode[]> =>
		new Promise((resolve) =>
			setTimeout(
				() => resolve([file(`${node.id}-a`, `${node.label}-a.bin`), file(`${node.id}-b`, `${node.label}-b.bin`)]),
				800
			)
		);

	return (
		<TreeView<FileNode>
			tree={roots}
			rowKey="id"
			getChildren={(n) => n.children}
			getLabel={(n) => n.label}
			getIcon={iconOf}
			loadChildren={loadChildren}
			isLeaf={(n) => n.kind === "file"}
		/>
	);
}

const meta: Meta<typeof BasicDemo> = {
	title: "Data Display/Tree/TreeView",
	component: BasicDemo,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	name: "Basic",
	render: () => <BasicDemo />,
	parameters: {
		docs: {
			description: {
				story:
					'`TreeView` is the modern, headless-model-driven replacement for the legacy `Tree`. Pass your own row type plus a nested `tree` (+ `getChildren`) or a flat `data` (+ `getParentId`) and a stable `rowKey`; presentation comes from `getLabel` / `getIcon`. Expansion is **uncontrolled** here, seeded with `defaultExpandedKeys`.\n\n**Accessibility:** `role="tree"` with `role="treeitem"` + `aria-level` / `aria-setsize` / `aria-posinset` / `aria-expanded` per node, and a single roving tab stop for keyboard navigation (Up/Down, Right/Left, Home/End).'
			}
		}
	}
};

export const Selection: Story = {
	name: "Selection",
	render: () => <SelectionDemo />,
	parameters: {
		docs: {
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
		docs: {
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
		docs: {
			description: {
				story:
					"Pass `dragDrop` to make nodes draggable — powered by `@atlaskit/pragmatic-drag-and-drop` and its tree-item hitbox. Drop near a node's **top/bottom edge** to reorder (`before`/`after`), or over the **middle of a folder** to reparent (`inside`). The self/descendant cycle guard is built in; `onDrop` reports `{ source, target, position }`."
			}
		}
	}
};

export const LazyLoading: Story = {
	name: "Lazy Loading",
	render: () => <LazyDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"With `loadChildren`, a folder's children are fetched the first time it expands and held internally. Click a folder to expand it: the chevron is replaced by the `ArrowButton`'s built-in loading indicator (~800 ms here) until the children arrive, then they are cached for later expands. `isLeaf` tells the tree which nodes can never expand, so files show no chevron. (Roots start with `undefined` children — an empty array would mean \"no children\" and show no chevron.)"
			}
		}
	}
};
