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
import {
	Button,
	Icon,
	Typography,
	KeyboardNavigationConfigProvider,
	findById,
	walkTreeNode
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { FileNode } from "./tree.data.js";
import { FILE_SYSTEM, InteractiveTree, collectExpandedIds } from "./tree.data.js";

const meta: Meta = {
	title: "Data Display/Tree/KeyboardNavigation",
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

const NavContext = ({ children }: { children: React.ReactNode }) => (
	<div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px" }}>
		<Typography.Body>
			Use <strong>Tab</strong> to navigate between focusable areas on this page.
		</Typography.Body>
		{children}
	</div>
);

function buildTreeDemo(id: string, tplTreeNode?: MapTreeNode) {
	function TreeDemo() {
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
			(node: TreeNodeModel) => {
				if (selectedNode && selectedNode !== node.id) {
					(findById(FILE_SYSTEM, selectedNode) as SelectableTreeNodeModel).selected = false;
				}

				(findById(FILE_SYSTEM, node.id) as SelectableTreeNodeModel).selected = true;
				setSelectedNode(node.id);
			},
			[selectedNode]
		);

		return (
			<InteractiveTree
				id={id}
				root={FILE_SYSTEM}
				tplTreeNode={tplTreeNode ?? ((_n, chained) => chained)}
				onToggleSelection={updateSelectedNode}
			/>
		);
	}

	return TreeDemo;
}

const DefaultTreeDemo = buildTreeDemo("tree-keynav-default");

export const DefaultMode: Story = {
	render: () => (
		<NavContext>
			<DefaultTreeDemo />
		</NavContext>
	),
	parameters: {
		docs: {
			description: {
				story:
					"**Tree — default keyboard navigation.** " +
					"**Tab / Shift+Tab** and **↑ / ↓** move focus between tree nodes. " +
					"On a collapsed node with children, **→** expands it; pressing **→** again moves focus to the first child. " +
					"On an expanded node, **→** moves focus to the first child directly. " +
					"**←** on a child node moves focus to the parent; **←** on an expanded node collapses it. " +
					"**Enter** / **Space** selects the focused node."
			}
		}
	}
};

const ArrowOnlyTreeDemo = buildTreeDemo("tree-keynav-arrow-only");

export const ArrowOnlyMode: Story = {
	render: () => (
		<KeyboardNavigationConfigProvider componentConfigs={{ tree: "arrow-only" }}>
			<NavContext>
				<ArrowOnlyTreeDemo />
			</NavContext>
		</KeyboardNavigationConfigProvider>
	),
	parameters: {
		docs: {
			description: {
				story:
					"**Tree — arrow-only mode** (via `KeyboardNavigationConfigProvider`). " +
					"Only **↑ / ↓** navigate between nodes; **→** expands or moves to the first child; **←** collapses or moves to the parent. " +
					"**Tab** exits the tree entirely and focuses the next focusable element outside the tree."
			}
		}
	}
};

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

const ActionButtonsTreeDemo = buildTreeDemo("tree-keynav-action-buttons", actionButtonsTpl);

export const WithActionButtons: Story = {
	render: () => (
		<NavContext>
			<ActionButtonsTreeDemo />
		</NavContext>
	),
	parameters: {
		docs: {
			description: {
				story:
					"**Tree with action buttons — keyboard navigation.** " +
					"Each node exposes an Edit action button via `tplTreeNode`. " +
					"In default mode, **Tab** moves focus from the node content to its action button, then to the next node. " +
					"**↑ / ↓** skip action buttons and navigate directly between nodes."
			}
		}
	}
};
