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

import type { ReactElement } from "react";
import { useRef, useState, useCallback, useEffect } from "react";

import type {
	CollapsibleTreeNodeModel,
	MapTreeNode,
	SelectableTreeNodeModel,
	TreeNodeModel
} from "@com.mgmtp.a12.widgets/widgets-core";
import {
	HiddenText,
	Button,
	Icon,
	Collapsible,
	find,
	findById,
	Selectable,
	Tree,
	TreeAdapter,
	walk
} from "@com.mgmtp.a12.widgets/widgets-core";

import { Icons } from "./common.js";

interface FileNode extends CollapsibleTreeNodeModel, SelectableTreeNodeModel {
	type: "computer" | "drive" | "folder" | "file";
	children?: FileNode[];
	locked?: boolean;
}

const InteractiveTree = Selectable(Collapsible(TreeAdapter(Tree)));

export function BasicTree(): ReactElement {
	const expandedNodeIds = useRef<Set<string>>(new Set(getNodeIDs()));

	const [selectedNode, setSelectedNode] = useState<string>(find(TREE, (node) => !!node.selected)?.id);

	const onNodeToggleExpansion = useCallback(
		(nodeId: string): void => {
			if (expandedNodeIds.current.has(nodeId)) {
				expandedNodeIds.current.delete(nodeId);
			} else {
				expandedNodeIds.current.add(nodeId);
			}
		},
		[expandedNodeIds]
	);

	const addToggleCallbackToNode = useCallback(() => {
		walk(TREE, (node) => {
			if (node.children) {
				node.onToggleExpansion = () => {
					onNodeToggleExpansion(node.id);
				};
			}
		});
	}, [onNodeToggleExpansion]);

	const updateSelectedNode = useCallback(
		(node: TreeNodeModel): void => {
			if (selectedNode) {
				if (selectedNode === node.id) {
					return;
				}

				const prevNode = findById(TREE, selectedNode);
				const newNode = findById(TREE, node.id);

				prevNode.selected = false;
				newNode.selected = true;
			} else {
				findById(TREE, node.id).selected = true;
			}

			setSelectedNode(node.id);
		},
		[selectedNode]
	);

	useEffect(() => {
		addToggleCallbackToNode();
	}, [addToggleCallbackToNode]);

	return (
		<InteractiveTree id="basic-tree" root={TREE} tplTreeNode={tplTreeNode} onToggleSelection={updateSelectedNode} />
	);
}

const tplTreeNode: MapTreeNode = (n, chained) => {
	const buttonLabelId = typeof n.label === "string" ? undefined : `${n.id}-label`;
	const buttonTitle = typeof n.label === "string" ? `Edit ${n.label}` : "Edit Button";

	return {
		...chained,
		fileNode: n,
		actionButtons: (
			<>
				<Button
					icon={<Icon>edit</Icon>}
					title={buttonTitle}
					disabled={n.disabled}
					onClick={(e) => {
						e.stopPropagation();
						alert(`You clicked on action button of ${n.label}`);
					}}
					buttonAttributes={{
						"aria-describedby": buttonLabelId
					}}
				/>
				{buttonLabelId && <HiddenText id={buttonLabelId}>Edit {n.label}</HiddenText>}
			</>
		)
	};
};

const TREE: FileNode = {
	id: "basic-1",
	label: "My Computer",
	icon: Icons.COMPUTER,
	type: "computer",
	locked: true,
	initiallyExpanded: true,
	children: [
		{
			id: "basic-2",
			label: "C:",
			icon: Icons.DRIVE,
			type: "drive",
			initiallyExpanded: true,
			children: [
				{
					id: "basic-3",
					label: "Programs",
					type: "folder",
					icon: Icons.FOLDER
				},
				{
					id: "basic-5",
					label: "ZANS and quiet a long text, that it has to display multiline",
					type: "folder",
					icon: Icons.FOLDER,
					initiallyExpanded: true,
					selected: true,
					children: [
						{
							id: "basic-6",
							label: "System32",
							type: "folder",
							icon: Icons.FOLDER,
							initiallyExpanded: true,
							children: [
								{
									id: "basic-7",
									label: "sasser.dll",
									type: "file",
									icon: Icons.FILE,
									disabled: true
								}
							]
						}
					]
				},
				{
					id: "basic-8",
					label: "swap.sys",
					type: "file",
					icon: Icons.FILE
				}
			]
		},
		{
			id: "basic-9",
			label: "D:",
			type: "drive",
			icon: Icons.DRIVE
		},
		{
			id: "basic-10",
			label: "E:",
			type: "drive",
			icon: Icons.DRIVE,
			disabled: true,
			children: [
				{
					id: "basic-11",
					label: "autostart.bat",
					type: "file",
					icon: Icons.FILE
				}
			]
		}
	]
};

const getNodeIDs = (): string[] => {
	const nodes: string[] = [];

	walk(TREE, (node) => {
		if (node.children) {
			nodes.push(node.id);
		}
	});

	return nodes;
};
