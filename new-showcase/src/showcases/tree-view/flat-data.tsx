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

import { TreeView } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import { fileIcon } from "./basic.js";

/** The same hierarchy as an adjacency list: each node names its parent instead of holding a `children` array. */
interface FlatFileNode {
	id: string;
	parentId?: string;
	label: string;
	kind: "folder" | "file";
}

// Keys are prefixed per example, since several trees share this page and node keys must be unique
// document-wide (a node's DOM id is derived from its key).
const FLAT_DATA: FlatFileNode[] = [
	{ id: "flat-src", label: "src", kind: "folder" },
	{ id: "flat-components", parentId: "flat-src", label: "components", kind: "folder" },
	{ id: "flat-button", parentId: "flat-components", label: "button.tsx", kind: "file" },
	{ id: "flat-input", parentId: "flat-components", label: "input.tsx", kind: "file" },
	{ id: "flat-index", parentId: "flat-src", label: "index.ts", kind: "file" },
	{ id: "flat-docs", label: "docs", kind: "folder" },
	{ id: "flat-readme", parentId: "flat-docs", label: "README.md", kind: "file" },
	{ id: "flat-package", label: "package.json", kind: "file" }
];

/**
 * Instead of a nested `tree`, hand the tree a flat `data` array plus `getParentId` and it rebuilds the
 * hierarchy itself. Roots return `undefined` from `getParentId`; a node whose parent key is unknown
 * becomes a root as well.
 */
export function FlatDataTreeView(): ReactElement {
	return (
		<TreeView<FlatFileNode>
			id="flat-data-tree-view"
			data={FLAT_DATA}
			getParentId={(node) => node.parentId}
			rowKey="id"
			getLabel={(node) => node.label}
			getIcon={fileIcon}
			defaultExpandAll
		/>
	);
}
