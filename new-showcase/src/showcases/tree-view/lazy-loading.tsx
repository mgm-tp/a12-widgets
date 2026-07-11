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

import type { FileNode } from "./basic.js";
import { fileIcon } from "./basic.js";

// Children left `undefined` (not `[]`) so each folder is treated as unloaded and lazy-loadable — an empty
// array would mean "known to have zero children" and the node would render without an expand arrow.
const ROOTS: FileNode[] = [
	{ id: "remote", label: "remote", kind: "folder" },
	{ id: "cache", label: "cache", kind: "folder" }
];

/** Simulates a network round-trip for a folder's children. */
function fetchChildren(node: FileNode): Promise<FileNode[]> {
	return new Promise((resolve) =>
		setTimeout(
			() =>
				resolve([
					{ id: `${node.id}-a`, label: `${node.label}-a.bin`, kind: "file" },
					{ id: `${node.id}-b`, label: `${node.label}-b.bin`, kind: "file" }
				]),
			700
		)
	);
}

/**
 * With `loadChildren`, a folder's children are fetched the first time it expands and then cached by the
 * tree — a built-in progress indicator shows while a fetch is in flight. `isLeaf` marks the rows that can
 * never expand, so files render without an arrow and are never asked to load.
 */
export function LazyLoadingTreeView(): ReactElement {
	return (
		<TreeView<FileNode>
			tree={ROOTS}
			rowKey="id"
			getChildren={(node) => node.children}
			getLabel={(node) => node.label}
			getIcon={fileIcon}
			loadChildren={fetchChildren}
			isLeaf={(node) => node.kind === "file"}
		/>
	);
}
