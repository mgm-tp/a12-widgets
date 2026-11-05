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

import type { ChangeEvent, ReactElement } from "react";
import { useCallback, useState } from "react";

import type {
	CollapsibleTreeNodeModel,
	MapTreeNode,
	SelectableTreeNodeModel,
	TreeNodeModel
} from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Button,
	Collapsible,
	findById,
	Icon,
	Selectable,
	TextField,
	Tree,
	TreeAdapter
} from "@com.mgmtp.a12.widgets/widgets-core";

import { Icons } from "./common.js";

/**
 * How the Edit Button of a node gets its accessible name:
 *
 * - `title`: the name of the node is embedded in the Button's own `title`. This only works for a node whose
 *   name is available as plain text.
 * - `node-ref`: the Button is linked via `aria-labelledby` to itself and to the element that the Tree renders
 *   around the label of the node. The label may be arbitrary markup - the element is referenced, not its text.
 * - `input-ref`: the label of the node is a TextField, and the Button is linked to that input. A referenced
 *   input contributes its value to the name, so the name follows every keystroke.
 *
 * Note that `tree-node-title-{id}` must not be used here, unlike in the Tree Table: in a Tree that element
 * wraps the action buttons as well, so a Button pointing at it would fold itself into its own name.
 */
type LabelPatternType = "title" | "node-ref" | "input-ref";

interface FileNode extends CollapsibleTreeNodeModel, SelectableTreeNodeModel {
	labelPattern: LabelPatternType;

	/** Plain-text name. Only the `title` pattern needs it - the other two reference the rendered element. */
	name: string;
	children?: FileNode[];
}

const InteractiveTree = Selectable(Collapsible(TreeAdapter(Tree)));

/** Id of the Edit Button of a node, which the Button links to in order to contribute its own name. */
const editButtonId = (node: FileNode): string => `${node.id}-edit`;

/** Id of the TextField that renders the label of a node labelled via `input-ref`. */
const nodeInputId = (node: FileNode): string => `${node.id}-name`;

/**
 * Links the Edit Button of a node to itself and to the element that the Tree already renders around the
 * label, e.g. "Edit Documents". A self reference is skipped while `aria-labelledby` is resolved, so the Button
 * contributes its own name - the verb of the action - before the name of the node. No hidden text element is
 * needed to hold the verb, and none is needed to restate a label that is not plain text.
 * Nodes labelled via `title` carry the name on the Button itself and need no link at all.
 */
const labelledBy = (node: FileNode): string | undefined => {
	switch (node.labelPattern) {
		case "node-ref":
			// `tree-node-name-{id}` wraps the rendered label, whether that is plain text or markup.
			return `${editButtonId(node)} tree-node-name-${node.id}`;
		case "input-ref":
			// The input itself, not the element around it - a referenced input contributes only its value, so the
			// hidden label of the TextField stays out of the name.
			return `${editButtonId(node)} ${nodeInputId(node)}`;
		default:
			return undefined;
	}
};

const TREE: FileNode = {
	id: "a11y-tree-documents",
	// A label made of markup: no plain string exists to put into a `title`, which is exactly what the
	// `node-ref` pattern solves.
	label: <span style={{ fontWeight: "bold" }}>Documents</span>,
	name: "Documents",
	labelPattern: "node-ref",
	icon: Icons.FOLDER,
	initiallyExpanded: true,
	children: [
		{
			id: "a11y-tree-invoices",
			label: "Invoices",
			name: "Invoices",
			labelPattern: "title",
			icon: Icons.FOLDER
		},
		{
			id: "a11y-tree-contracts",
			label: "Contracts",
			name: "Contracts",
			labelPattern: "input-ref",
			icon: <Icon style={{ alignSelf: "center" }}>insert_drive_file</Icon>
		}
	]
};

export function Accessibility(): ReactElement {
	const [selectedNode, setSelectedNode] = useState<string | undefined>();
	const [contractsName, setContractsName] = useState("Contracts");

	const updateSelectedNode = useCallback(
		(node: TreeNodeModel): void => {
			if (selectedNode === node.id) {
				return;
			}

			if (selectedNode) {
				findById(TREE, selectedNode).selected = false;
			}

			findById(TREE, node.id).selected = true;
			setSelectedNode(node.id);
		},
		[selectedNode]
	);

	const tplTreeNode: MapTreeNode = useCallback(
		(node, chained) => {
			const fileNode = node as FileNode;

			return {
				...chained,
				// The label of a node labelled via `input-ref` is rendered as an editable field instead of text.
				label:
					fileNode.labelPattern === "input-ref" ? (
						<TextField
							style={{ padding: 3 }}
							id={nodeInputId(fileNode)}
							label="File name"
							hideLabel
							value={contractsName}
							onChange={(event: ChangeEvent<HTMLInputElement>): void => setContractsName(event.target.value)}
						/>
					) : (
						chained.label
					),
				actionButtons: (
					<Button
						id={editButtonId(fileNode)}
						icon={<Icon>edit</Icon>}
						title={fileNode.labelPattern === "title" ? `Edit ${fileNode.name}` : "Edit"}
						buttonAttributes={{ "aria-labelledby": labelledBy(fileNode) }}
						onClick={(event): void => {
							event.stopPropagation();
						}}
					/>
				)
			};
		},
		[contractsName]
	);

	return (
		<InteractiveTree
			id="accessibility-tree"
			root={TREE}
			tplTreeNode={tplTreeNode}
			onToggleSelection={updateSelectedNode}
		/>
	);
}
