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

import { Button, ButtonGroup } from "@com.mgmtp.a12.widgets/widgets-core";
import { TreeView } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { FileNode } from "./basic.js";
import { fileIcon } from "./basic.js";

// Same shape as the basic example, with keys of its own — several trees share this page and node keys
// must be unique document-wide (a node's DOM id is derived from its key).
const FILE_TREE: FileNode[] = [
	{
		id: "controlled-expansion-src",
		label: "src",
		kind: "folder",
		children: [
			{
				id: "controlled-expansion-components",
				label: "components",
				kind: "folder",
				children: [
					{ id: "controlled-expansion-button", label: "button.tsx", kind: "file" },
					{ id: "controlled-expansion-input", label: "input.tsx", kind: "file" }
				]
			},
			{ id: "controlled-expansion-index", label: "index.ts", kind: "file" }
		]
	},
	{
		id: "controlled-expansion-docs",
		label: "docs",
		kind: "folder",
		children: [{ id: "controlled-expansion-readme", label: "README.md", kind: "file" }]
	},
	{ id: "controlled-expansion-package", label: "package.json", kind: "file" }
];

const FOLDER_KEYS: Key[] = ["controlled-expansion-src", "controlled-expansion-components", "controlled-expansion-docs"];

/**
 * Expansion driven by the consumer via `expandedKeys` + `onExpandedChange` (rather than the uncontrolled
 * `defaultExpandedKeys`). The callback fires on every toggle, so the tree always reflects the set you hand
 * back — letting you persist expansion, sync it with external state, or wire up expand/collapse-all.
 */
export function ControlledExpansionTreeView(): ReactElement {
	const [expanded, setExpanded] = useState<ReadonlySet<Key>>(() => new Set(["controlled-expansion-src"]));
	const [selected, setSelected] = useState<ReadonlySet<Key>>(new Set());

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
			<ButtonGroup>
				<Button onClick={() => setExpanded(new Set(FOLDER_KEYS))}>Expand all</Button>
				<Button onClick={() => setExpanded(new Set())}>Collapse all</Button>
			</ButtonGroup>
			<TreeView<FileNode>
				id="controlled-expansion-tree-view"
				tree={FILE_TREE}
				rowKey="id"
				getChildren={(node) => node.children}
				getLabel={(node) => node.label}
				getIcon={fileIcon}
				expandedKeys={expanded}
				onExpandedChange={setExpanded}
				selectionMode="single"
				selectedKeys={selected}
				onSelectionChange={setSelected}
			/>
		</div>
	);
}
