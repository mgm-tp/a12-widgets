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
import { useRef } from "react";

import { Button, ButtonGroup, Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import type {
	DataTableColumn,
	DataTreeTableScrollToNodeHandler
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTreeTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { FileNode } from "./shared.js";
import { file, folder, useRowSelection } from "./shared.js";

// Six folders of six files each — enough to overflow `maxHeight` so the scroll buttons have somewhere to go.
const FILE_TREE: FileNode[] = Array.from({ length: 6 }, (_unused, batch): FileNode =>
	folder(
		`tree-column-batch-${batch}`,
		`batch-${batch}`,
		"2026-06-12",
		Array.from({ length: 6 }, (_u, run): FileNode =>
			file(`tree-column-batch-${batch}-run-${run}`, `run-${batch}${run}.log`, `${run + 1} KB`, "2026-06-12")
		)
	)
);

/** A leading "Type" column, so the tree column is no longer the first one. */
const COLUMNS: DataTableColumn<FileNode>[] = [
	{ label: "Type", dataKey: "kind", width: 1 },
	{ label: "Name", dataKey: "name", width: 3 },
	{ label: "Size", dataKey: "size", width: 1, horizontalAlignment: "right" },
	{ label: "Modified", dataKey: "modified", width: 1.5 }
];

/**
 * `treeColumnKey` picks the column that carries the indent and chevron (by default the first one), and
 * `indentSize` sets the pixels per level. `renderExpandToggle` swaps the built-in chevron for your own
 * control: call `toggle()` to flip expansion and read `expanded` / `loading` for the affordance. The
 * `scrollToNode` handle scrolls a row into view by key and, with `autoFocus`, focuses it.
 */
export function TreeColumnDataTreeTable(): ReactElement {
	const { rowStyling, rowEventHandlers } = useRowSelection<FileNode>();
	const scrollRef = useRef<DataTreeTableScrollToNodeHandler | null>(null);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
			<ButtonGroup>
				<Button onClick={() => scrollRef.current?.("tree-column-batch-0-run-0", { autoFocus: true })}>
					Scroll to first
				</Button>
				<Button onClick={() => scrollRef.current?.("tree-column-batch-3-run-2", { autoFocus: true })}>
					Scroll to run-32
				</Button>
				<Button onClick={() => scrollRef.current?.("tree-column-batch-5-run-5", { autoFocus: true })}>
					Scroll to last
				</Button>
			</ButtonGroup>
			<DataTreeTable<FileNode>
				ariaLabel="Files by type"
				tree={FILE_TREE}
				getChildren={(row) => row.children}
				columns={COLUMNS}
				rowKey="id"
				rowStyling={rowStyling}
				rowEventHandlers={rowEventHandlers}
				maxHeight={320}
				defaultExpandAll
				treeColumnKey="name"
				indentSize={32}
				isLeaf={(row) => row.kind === "file"}
				renderExpandToggle={({ expanded, toggle }) => (
					<Button
						icon={<Icon>{expanded ? "folder_open" : "folder"}</Icon>}
						title={expanded ? "Collapse" : "Expand"}
						onClick={(event): void => {
							// Keep the click from also selecting the row.
							event.stopPropagation();
							toggle();
						}}
					/>
				)}
				scrollToNode={(handler) => {
					scrollRef.current = handler;
				}}
			/>
		</div>
	);
}
