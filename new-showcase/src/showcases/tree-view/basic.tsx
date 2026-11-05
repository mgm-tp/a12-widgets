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

import { Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import { TreeView } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

export interface FileNode {
	id: string;
	label: string;
	kind: "folder" | "file";
	children?: FileNode[];
}

// Keys are prefixed per example, since several trees share this page and node keys must be unique
// document-wide (a node's DOM id is derived from its key).
export const FILE_TREE: FileNode[] = [
	{
		id: "basic-src",
		label: "src",
		kind: "folder",
		children: [
			{
				id: "basic-components",
				label: "components",
				kind: "folder",
				children: [
					{ id: "basic-button", label: "button.tsx", kind: "file" },
					{ id: "basic-input", label: "input.tsx", kind: "file" }
				]
			},
			{ id: "basic-index", label: "index.ts", kind: "file" }
		]
	},
	{
		id: "basic-docs",
		label: "docs",
		kind: "folder",
		children: [{ id: "basic-readme", label: "README.md", kind: "file" }]
	},
	{ id: "basic-package", label: "package.json", kind: "file" }
];

export const fileIcon = (node: FileNode): ReactElement => (
	<Icon>{node.kind === "folder" ? "folder" : "insert_drive_file"}</Icon>
);

/**
 * A selectable, collapsible tree built from a nested data structure. Expansion is uncontrolled (seeded
 * with `defaultExpandedKeys`); selection is controlled via `selectedKeys` + `onSelectionChange`.
 */
export function BasicTreeView(): ReactElement {
	const [selected, setSelected] = useState<ReadonlySet<Key>>(new Set(["basic-button"]));

	return (
		<TreeView<FileNode>
			id="basic-tree-view"
			tree={FILE_TREE}
			rowKey="id"
			getChildren={(node) => node.children}
			getLabel={(node) => node.label}
			getIcon={fileIcon}
			defaultExpandedKeys={["basic-src", "basic-components"]}
			selectionMode="single"
			selectedKeys={selected}
			onSelectionChange={setSelected}
		/>
	);
}
