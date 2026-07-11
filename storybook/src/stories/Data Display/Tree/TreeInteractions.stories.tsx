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

import { useRef, useState, useCallback, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type { MapTreeNode, SelectableTreeNodeModel, TreeNodeModel } from "@com.mgmtp.a12.widgets/widgets-core";
import { Button, Icon, findById, walkTreeNode } from "@com.mgmtp.a12.widgets/widgets-core";

import type { FileNode } from "./tree.data.js";
import { FILE_SYSTEM, InteractiveTree, collectExpandedIds } from "./tree.data.js";

function TreeWithActionsDemo() {
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

	const tplTreeNode: MapTreeNode = (n, chained) => ({
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

	return (
		<InteractiveTree
			id="tree-with-actions"
			root={FILE_SYSTEM}
			tplTreeNode={tplTreeNode}
			onToggleSelection={updateSelectedNode}
		/>
	);
}

function HideRootTreeDemo() {
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
			id="hide-root-tree"
			root={FILE_SYSTEM}
			tplTreeNode={tplTreeNode}
			onToggleSelection={updateSelectedNode}
			hideRoot
		/>
	);
}

const meta: Meta = {
	title: "Data Display/Tree/Interactions",
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <TreeWithActionsDemo />
};

export const WithActionButtons: Story = {
	name: "With Action Buttons",
	render: () => <TreeWithActionsDemo />,
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
	render: () => <HideRootTreeDemo />,
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
