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
import { useCallback, useState } from "react";

import type { RowEventHandlerGetter, RowStyleGetter } from "@com.mgmtp.a12.widgets/widgets-core";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DataTableColumn } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

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

/**
 * A small nested forest reused across the examples, keyed per example. Node keys have to be unique
 * document-wide, since several tables share this page and a row's DOM ids are derived from its key
 * (`tree-node-name-{key}`, `tree-node-title-{key}`, `tree-node-arrow-{key}`) - the ARIA wiring of the tree
 * column and of the controls named after a row resolves ids against the whole document.
 */
export const fileTree = (prefix: string): FileNode[] => [
	folder(`${prefix}-src`, "src", "2026-06-10", [
		folder(`${prefix}-components`, "components", "2026-06-09", [
			file(`${prefix}-button`, "button.tsx", "4 KB", "2026-06-09"),
			file(`${prefix}-table`, "table.tsx", "18 KB", "2026-06-09")
		]),
		file(`${prefix}-index`, "index.ts", "1 KB", "2026-06-10")
	]),
	folder(`${prefix}-assets`, "assets", "2026-05-20", [file(`${prefix}-logo`, "logo.svg", "12 KB", "2026-05-20")]),
	file(`${prefix}-readme`, "README.md", "2 KB", "2026-06-01")
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

/**
 * Single-row selection, wired the way every example on this page uses it: clicking a row selects it, and
 * the `selected` flag plus a `title` come back out through `rowStyling`.
 *
 * Selection is also what makes a row *interactive*, and that is what earns it the focus ring. A row with
 * neither an `onClick` nor `rowStyling().interactive` shows focus as a faint background tint alone - even
 * though it is still a tab stop and still reachable with the arrow keys.
 *
 * Both getters are `useCallback`-stable: `rowEventHandlers`' identity is part of the boundary that lets
 * untouched rows skip re-rendering, so an inline arrow would re-render every body row on every render.
 */
export function useRowSelection<RowType extends { id: string }>(): {
	rowStyling: RowStyleGetter<RowType>;
	rowEventHandlers: RowEventHandlerGetter<RowType>;
} {
	const [selectedKey, setSelectedKey] = useState<string | undefined>();

	const rowEventHandlers: RowEventHandlerGetter<RowType> = useCallback(
		({ row }) => ({
			onClick: (): void => setSelectedKey(row.id)
		}),
		[]
	);

	const rowStyling: RowStyleGetter<RowType> = useCallback(
		({ row }) => {
			const selected = row.id === selectedKey;

			return { selected, title: selected ? "Selected" : "Selectable" };
		},
		[selectedKey]
	);

	return { rowStyling, rowEventHandlers };
}
