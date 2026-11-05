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
import { useRef, useState, useCallback, useEffect } from "react";

import type {
	MapTreeNode,
	SelectableTreeNodeModel,
	TreeNodeModel,
	TreeNodeTemplateModel
} from "@com.mgmtp.a12.widgets/widgets-core";
import { Button, ButtonGroup, Icon, find, findById, walkTreeNode } from "@com.mgmtp.a12.widgets/widgets-core";

import type { FileNode } from "./tree.data.js";
import { FILE_SYSTEM, HIGHLIGHTED_FILE_SYSTEM, InteractiveTree, collectExpandedIds } from "./tree.data.js";

/**
 * Wires expansion tracking into the shared FILE_SYSTEM data and returns a selection
 * handler that keeps the `selected` flags of the node models in sync.
 */
function useFileSystemSelection() {
	const expandedNodeIds = useRef<Set<string>>(collectExpandedIds(FILE_SYSTEM));
	const [selectedNode, setSelectedNode] = useState<string | undefined>(undefined);

	useEffect(() => {
		walkTreeNode(FILE_SYSTEM, (node) => {
			const fileNode = node as FileNode;

			if (fileNode.children) {
				fileNode.onToggleExpansion = () => {
					if (expandedNodeIds.current.has(String(fileNode.id))) {
						expandedNodeIds.current.delete(String(fileNode.id));
					} else {
						expandedNodeIds.current.add(String(fileNode.id));
					}
				};
			}
		});
	}, []);

	return useCallback(
		(node: TreeNodeModel): void => {
			if (selectedNode && selectedNode !== node.id) {
				(findById(FILE_SYSTEM, selectedNode) as SelectableTreeNodeModel).selected = false;
			}

			(findById(FILE_SYSTEM, node.id) as SelectableTreeNodeModel).selected = true;
			setSelectedNode(node.id);
		},
		[selectedNode]
	);
}

function BasicTreeDemo() {
	const expandedNodeIds = useRef<Set<string>>(collectExpandedIds(FILE_SYSTEM));
	const [selectedNode, setSelectedNode] = useState<string | undefined>(
		find(FILE_SYSTEM, (n) => !!(n as SelectableTreeNodeModel).selected)?.id
	);

	const onNodeToggleExpansion = useCallback((nodeId: string): void => {
		if (expandedNodeIds.current.has(nodeId)) {
			expandedNodeIds.current.delete(nodeId);
		} else {
			expandedNodeIds.current.add(nodeId);
		}
	}, []);

	useEffect(() => {
		walkTreeNode(FILE_SYSTEM, (node) => {
			const fileNode = node as FileNode;

			if (fileNode.children) {
				fileNode.onToggleExpansion = () => onNodeToggleExpansion(String(fileNode.id));
			}
		});
	}, [onNodeToggleExpansion]);

	const updateSelectedNode = useCallback(
		(node: TreeNodeModel): void => {
			if (selectedNode && selectedNode !== node.id) {
				(findById(FILE_SYSTEM, selectedNode) as SelectableTreeNodeModel).selected = false;
			}

			(findById(FILE_SYSTEM, node.id) as SelectableTreeNodeModel).selected = true;
			setSelectedNode(node.id);
		},
		[selectedNode]
	);

	const tplTreeNode: MapTreeNode = (n, chained) => {
		void n;

		return { ...chained };
	};

	return (
		<InteractiveTree
			id="basic-tree"
			root={FILE_SYSTEM}
			tplTreeNode={tplTreeNode}
			onToggleSelection={updateSelectedNode}
		/>
	);
}

function NodeHighlightingDemo() {
	const [selectedNode, setSelectedNode] = useState<string | undefined>();

	const updateSelectedNode = useCallback(
		(node: TreeNodeModel): void => {
			if (selectedNode) {
				(findById(HIGHLIGHTED_FILE_SYSTEM, selectedNode) as SelectableTreeNodeModel).selected = false;
			}

			(findById(HIGHLIGHTED_FILE_SYSTEM, node.id) as SelectableTreeNodeModel).selected = true;
			setSelectedNode(node.id);
		},
		[selectedNode]
	);

	const tplTreeNode: MapTreeNode = (n: TreeNodeModel, chained: TreeNodeTemplateModel) => {
		void n;

		return { ...chained };
	};

	return (
		<InteractiveTree
			id="node-highlighting-tree"
			root={HIGHLIGHTED_FILE_SYSTEM}
			tplTreeNode={tplTreeNode}
			onToggleSelection={updateSelectedNode}
		/>
	);
}

const actionButtonsTpl: MapTreeNode = (n, chained) => ({
	...chained,
	actionButtons: (
		<Button
			icon={<Icon>edit</Icon>}
			title={`Edit ${typeof n.label === "string" ? n.label : "node"}`}
			disabled={n.disabled}
			onClick={(e) => {
				e.stopPropagation();
				alert(`Editing: ${n.label}`);
			}}
		/>
	)
});

const SCROLL_TREE_ROOT = {
	id: "1",
	label: "Root",
	children: [
		{ id: "2", label: "Node 2" },
		{ id: "3", label: "Node 3" },
		{ id: "4", label: "Node 4" },
		{ id: "5", label: "Node 5" },
		{ id: "6", label: "Node 6" },
		{ id: "7", label: "Node 7" },
		{ id: "8", label: "Node 8" },
		{ id: "9", label: "Node 9" },
		{ id: "10", label: "Node 10" },
		{ id: "11", label: "Node 11" },
		{ id: "12", label: "Node 12" },
		{ id: "13", label: "Node 13" },
		{ id: "14", label: "Node 14" },
		{ id: "15", label: "Node 15" }
	]
};

const meta: Meta<typeof InteractiveTree> = {
	title: "Data Display/Tree",
	component: InteractiveTree,
	parameters: { layout: "padded" },
	argTypes: {
		root: {
			control: false,
			description: "Root `TreeNodeModel` of the tree — defines the hierarchy of nodes"
		},
		tplTreeNode: {
			control: false,
			description: "Template mapping for each tree node, e.g. to add `actionButtons` or custom content"
		},
		onToggleSelection: {
			control: false,
			description: "Callback if a change in selection has been requested"
		},
		hideRoot: {
			control: "boolean",
			description: "Whether the top-level node should be hidden"
		},
		scrollSelectedNodeIntoView: {
			control: "boolean",
			description: "Whether the tree scrolls the selected node into view"
		},
		scrollToNode: {
			control: false,
			description: "Get a handler which scrolls the tree to a node's position by its id"
		},
		id: {
			control: "text",
			description: "Id of the tree element"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		id: "playground-tree",
		root: FILE_SYSTEM,
		tplTreeNode: (_n, chained) => ({ ...chained }),
		onToggleSelection: () => {},
		hideRoot: false,
		scrollSelectedNodeIntoView: false
	},
	render: function PlaygroundExample(args) {
		const updateSelectedNode = useFileSystemSelection();

		return <InteractiveTree {...args} onToggleSelection={updateSelectedNode} />;
	}
};

export const Default: Story = {
	name: "Basic Tree",
	render: () => <BasicTreeDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"A file-system tree built with the `TreeAdapter + Collapsible + Selectable` behavior chain. " +
					"Click a node to select it; click the arrow to expand or collapse a branch. Disabled nodes cannot be selected."
			}
		}
	}
};

export const NodeHighlighting: Story = {
	name: "Node Highlighting",
	render: () => <NodeHighlightingDemo />,
	parameters: {
		docs: {
			description: {
				story:
					'Set `highlightVariant: "success"` on any `TreeNodeModel` to apply the success highlight color to that node row.'
			}
		}
	}
};

export const WithActionButtons: Story = {
	name: "With Action Buttons",
	render: function WithActionButtonsExample() {
		const updateSelectedNode = useFileSystemSelection();

		return (
			<InteractiveTree
				id="tree-with-actions"
				root={FILE_SYSTEM}
				tplTreeNode={actionButtonsTpl}
				onToggleSelection={updateSelectedNode}
			/>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Each node exposes an Edit action button via `tplTreeNode`. " +
					"The button calls `e.stopPropagation()` so clicks do not also trigger node selection."
			}
		}
	}
};

export const HideRoot: Story = {
	name: "Hide Root Node",
	render: function HideRootExample() {
		const updateSelectedNode = useFileSystemSelection();

		return (
			<InteractiveTree
				id="hide-root-tree"
				root={FILE_SYSTEM}
				tplTreeNode={(_n, chained) => ({ ...chained })}
				onToggleSelection={updateSelectedNode}
				hideRoot
			/>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Setting `hideRoot` omits the top-level 'My Computer' node from the visual tree, " +
					"so drives are rendered at the top level."
			}
		}
	}
};

export const ScrollToNode: Story = {
	name: "Scroll to Node",
	render: function ScrollToNodeExample() {
		const scrollHandlerRef = useRef<((nodeId: string | number) => void) | undefined>(undefined);

		return (
			<div style={{ display: "flex", flexDirection: "column", gap: 12, width: 300 }}>
				<ButtonGroup>
					<Button onClick={() => scrollHandlerRef.current?.("2")}>Scroll to Node 2</Button>
					<Button onClick={() => scrollHandlerRef.current?.("8")}>Scroll to Node 8</Button>
					<Button onClick={() => scrollHandlerRef.current?.("15")}>Scroll to Node 15</Button>
				</ButtonGroup>

				<div style={{ height: 200, overflow: "auto", border: "1px solid #ccc" }}>
					<InteractiveTree
						id="scroll-to-node-tree"
						root={SCROLL_TREE_ROOT}
						tplTreeNode={(_n, chained) => ({ ...chained })}
						onToggleSelection={() => {}}
						scrollToNode={(handler) => {
							scrollHandlerRef.current = handler;
						}}
					/>
				</div>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "Demonstrates the `scrollToNode` API for programmatically scrolling the tree to a specific node."
			}
		}
	}
};
