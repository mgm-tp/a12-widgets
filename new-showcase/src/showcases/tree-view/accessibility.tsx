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

import type { ChangeEvent, Key, ReactElement, ReactNode } from "react";
import { useState } from "react";

import { Button, Icon, TextField } from "@com.mgmtp.a12.widgets/widgets-core";
import { TreeView } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

/**
 * How the Edit Button of a node gets its accessible name:
 *
 * - `title`: the name of the node is embedded in the Button's own `title`. This only works for a node whose
 *   name is available as plain text.
 * - `node-ref`: the Button is linked via `aria-labelledby` to itself and to the element that the TreeView
 *   renders around the label of the node. The label may be arbitrary markup - the element is referenced,
 *   not its text.
 * - `input-ref`: the label of the node is a TextField, and the Button is linked to that input. A referenced
 *   input contributes its value to the name, so the name follows every keystroke.
 *
 * Note that the element wrapping the whole node title must not be used here, unlike in the DataTreeTable:
 * in a TreeView it wraps the action buttons as well, so a Button pointing at it would fold itself into its
 * own name.
 */
type LabelPatternType = "title" | "node-ref" | "input-ref";

interface FileNode {
	id: string;
	label: ReactNode;

	/** Plain-text name. Only the `title` pattern needs it - the other two reference the rendered element. */
	name: string;
	kind: "folder" | "file";
	labelPattern: LabelPatternType;
	children?: FileNode[];
}

const FILE_TREE: FileNode[] = [
	{
		id: "a11y-tree-documents",
		// A label made of markup: no plain string exists to put into a `title`, which is exactly what the
		// `node-ref` pattern solves.
		label: <span style={{ fontWeight: "bold" }}>Documents</span>,
		name: "Documents",
		kind: "folder",
		labelPattern: "node-ref",
		children: [
			{
				id: "a11y-tree-invoices",
				label: "Invoices",
				name: "Invoices",
				kind: "folder",
				labelPattern: "title"
			},
			{
				id: "a11y-tree-contracts",
				label: "Contracts",
				name: "Contracts",
				kind: "file",
				labelPattern: "input-ref"
			}
		]
	}
];

/** Id of the Edit Button of a node, which the Button links to in order to contribute its own name. */
const editButtonId = (node: FileNode): string => `${node.id}-edit`;

/** Id of the TextField that renders the label of a node labelled via `input-ref`. */
const nodeInputId = (node: FileNode): string => `${node.id}-name`;

/**
 * Links the Edit Button of a node to itself and to the element that the TreeView already renders around the
 * label, e.g. "Edit Documents". A self reference is skipped while `aria-labelledby` is resolved, so the
 * Button contributes its own name - the verb of the action - before the name of the node. No hidden text
 * element is needed to hold the verb, and none is needed to restate a label that is not plain text.
 * Nodes labelled via `title` carry the name on the Button itself and need no link at all.
 */
const labelledBy = (node: FileNode): string | undefined => {
	switch (node.labelPattern) {
		case "node-ref":
			// `tree-node-name-{key}` wraps the rendered label, whether that is plain text or markup.
			return `${editButtonId(node)} tree-node-name-${node.id}`;
		case "input-ref":
			// The input itself, not the element around it - a referenced input contributes only its value, so the
			// hidden label of the TextField stays out of the name.
			return `${editButtonId(node)} ${nodeInputId(node)}`;
		default:
			return undefined;
	}
};

export function AccessibilityTreeView(): ReactElement {
	const [selected, setSelected] = useState<ReadonlySet<Key>>(new Set());
	const [contractsName, setContractsName] = useState("Contracts");

	return (
		<TreeView<FileNode>
			id="accessibility-tree-view"
			tree={FILE_TREE}
			rowKey="id"
			getChildren={(node) => node.children}
			// The label of a node labelled via `input-ref` is rendered as an editable field instead of text.
			getLabel={(node) =>
				node.labelPattern === "input-ref" ? (
					<TextField
						style={{ padding: 3 }}
						id={nodeInputId(node)}
						label="File name"
						hideLabel
						value={contractsName}
						onChange={(event: ChangeEvent<HTMLInputElement>): void => setContractsName(event.target.value)}
					/>
				) : (
					node.label
				)
			}
			getIcon={(node) => (
				<Icon style={{ alignSelf: "center" }}>{node.kind === "folder" ? "folder" : "insert_drive_file"}</Icon>
			)}
			getActions={(node) => (
				<Button
					id={editButtonId(node)}
					icon={<Icon>edit</Icon>}
					title={node.labelPattern === "title" ? `Edit ${node.name}` : "Edit"}
					buttonAttributes={{ "aria-labelledby": labelledBy(node) }}
					onClick={(event): void => {
						event.stopPropagation();
					}}
				/>
			)}
			defaultExpandedKeys={["a11y-tree-documents"]}
			selectionMode="single"
			selectedKeys={selected}
			onSelectionChange={setSelected}
		/>
	);
}
