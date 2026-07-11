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

/** The consumer's own row type — `DataTreeTable` flows it straight through, no node envelope. */
export interface FileNode {
	id: string;
	name: string;
	size: string;
	modified: string;
	kind: "folder" | "file";
	children?: FileNode[];
}

export const folder = (id: string, name: string, modified: string, children?: FileNode[]): FileNode => ({
	id,
	name,
	size: "—",
	modified,
	kind: "folder",
	children
});

export const file = (id: string, name: string, size: string, modified: string): FileNode => ({
	id,
	name,
	size,
	modified,
	kind: "file"
});

/** A small nested forest reused across the examples. */
export const FILE_TREE: FileNode[] = [
	folder("src", "src", "2026-06-10", [
		folder("components", "components", "2026-06-09", [
			file("button", "button.tsx", "4 KB", "2026-06-09"),
			file("table", "table.tsx", "18 KB", "2026-06-09")
		]),
		file("index", "index.ts", "1 KB", "2026-06-10")
	]),
	folder("assets", "assets", "2026-05-20", [file("logo", "logo.svg", "12 KB", "2026-05-20")]),
	file("readme", "README.md", "2 KB", "2026-06-01")
];

/** A leading folder/file icon per row — rendered between the chevron and the cell content. */
export const fileIcon = (row: FileNode): ReactElement => (
	<Icon>{row.kind === "folder" ? "folder" : "description"}</Icon>
);

/** The consumer's columns operate on `FileNode` directly; the wrapper adds the indent + chevron up front. */
export const COLUMNS: DataTableColumn<FileNode>[] = [
	{ label: "Name", dataKey: "name", width: 3 },
	{ label: "Size", dataKey: "size", width: 1, horizontalAlignment: "right" },
	{ label: "Modified", dataKey: "modified", width: 1.5 }
];
