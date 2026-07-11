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

import type { DataTableColumn } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import { DataTreeTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

/** A flat row carries its own parent reference instead of nesting its children. */
interface FlatNode {
	id: string;
	parentId?: string;
	name: string;
	size: string;
	modified: string;
	kind: "folder" | "file";
}

// The same hierarchy as the nested examples, expressed as a flat adjacency list. Order is irrelevant —
// the wrapper rebuilds the tree from `getParentId`. Root rows simply omit `parentId`.
const DATA: FlatNode[] = [
	{ id: "src", name: "src", size: "—", modified: "2026-06-10", kind: "folder" },
	{ id: "components", parentId: "src", name: "components", size: "—", modified: "2026-06-09", kind: "folder" },
	{ id: "button", parentId: "components", name: "button.tsx", size: "4 KB", modified: "2026-06-09", kind: "file" },
	{ id: "table", parentId: "components", name: "table.tsx", size: "18 KB", modified: "2026-06-09", kind: "file" },
	{ id: "index", parentId: "src", name: "index.ts", size: "1 KB", modified: "2026-06-10", kind: "file" },
	{ id: "readme", name: "README.md", size: "2 KB", modified: "2026-06-01", kind: "file" }
];

const COLUMNS: DataTableColumn<FlatNode>[] = [
	{ label: "Name", dataKey: "name", width: 3 },
	{ label: "Size", dataKey: "size", width: 1, horizontalAlignment: "right" },
	{ label: "Modified", dataKey: "modified", width: 1.5 }
];

/**
 * Flat-adjacency input: instead of a nested `tree`, hand the wrapper a flat `data` array plus
 * `getParentId`, and it rebuilds the hierarchy itself. This suits data that arrives normalized (e.g. a
 * database table or a flat store) where you would otherwise have to assemble the nesting by hand.
 * Everything else — expansion, `getIcon`, columns — behaves exactly as in nested mode.
 */
export function FlatDataTreeTable(): ReactElement {
	return (
		<DataTreeTable<FlatNode>
			ariaLabel="Files (flat data)"
			data={DATA}
			getParentId={(row) => row.parentId}
			getIcon={(row) => <Icon>{row.kind === "folder" ? "folder" : "description"}</Icon>}
			columns={COLUMNS}
			rowKey="id"
			maxHeight={360}
			defaultExpandedKeys={["src"]}
		/>
	);
}
