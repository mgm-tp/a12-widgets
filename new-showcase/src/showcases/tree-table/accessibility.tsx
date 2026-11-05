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

import type { ChangeEvent, FC, ReactElement, ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";

import type {
	BaseTreeTableColumnType,
	BaseTreeTableNode,
	FlattenTreeTableNode,
	TreeTableRowEventHandlers,
	TreeTableRowStyling
} from "@com.mgmtp.a12.widgets/widgets-core";
import { Button, Icon, TextField, TreeTable } from "@com.mgmtp.a12.widgets/widgets-core";

/**
 * How the Delete Button of a row gets its accessible name:
 *
 * - `title`: the name of the node is embedded in the Button's own `title`.
 * - `node-ref`: the Button is linked via `aria-labelledby` to itself and to the element that the Tree Table
 *   renders around the name of the node in the hierarchical cell.
 * - `parent-ref`: the Button is linked the same way, but to the whole node title, which also holds the hidden
 *   "belongs to ..." text. The name of the Button therefore states the parent node as well.
 * - `input-ref`: the name of the node is rendered as a TextField, and the Button is linked to that input. A
 *   referenced input contributes its value to the name, so the name follows every keystroke.
 */
type LabelPatternType = "title" | "node-ref" | "parent-ref" | "input-ref";

type FileRowData = [name: string, dateModified: string, size: string];

interface FileNode extends BaseTreeTableNode<FileRowData> {
	labelPattern: LabelPatternType;
	children?: FileNode[];
}

type FileRow = FlattenTreeTableNode<FileNode>;

const root: FileNode = {
	id: "a11y-documents",
	icon: <Icon>folder</Icon>,
	labelPattern: "title",
	data: ["Documents", "2026-01-04", ""],
	children: [
		{
			id: "a11y-invoices",
			icon: <Icon>folder</Icon>,
			labelPattern: "parent-ref",
			data: ["Invoices", "2026-02-11", "18 KB"]
		},
		{
			id: "a11y-archive",
			icon: <Icon>folder</Icon>,
			labelPattern: "node-ref",
			data: ["Archive", "2025-12-30", ""],
			children: [
				{
					id: "a11y-2025-q4",
					icon: <Icon>insert_drive_file</Icon>,
					labelPattern: "input-ref",
					data: ["2025-Q4.pdf", "2025-12-30", "240 KB"]
				}
			]
		}
	]
};

/** Id of the Delete Button of a row, which the Button links to in order to contribute its own name. */
const deleteButtonId = (row: FileRow): string => `${row.id}-delete`;

/** Id of the TextField that renders the name of a row labelled via `input-ref`. */
const nodeInputId = (row: FileRow): string => `${row.id}-name`;

/**
 * Links the Delete Button of a row to itself and to the element that the Tree Table already renders in the
 * hierarchical cell, e.g. "Delete Archive". A self reference is skipped while `aria-labelledby` is resolved,
 * so the Button contributes its own name - the verb of the action - before the name of the node. No further
 * element is needed to hold the verb.
 * Rows labelled via `title` carry the name of the node on the Button itself and need no link at all.
 */
const labelledBy = (row: FileRow): string | undefined => {
	switch (row.labelPattern) {
		case "node-ref":
			// `tree-node-name-{id}` wraps the name of the node.
			return `${deleteButtonId(row)} tree-node-name-${row.id}`;
		case "parent-ref":
			// `tree-node-title-{id}` wraps the name of the node and the hidden "belongs to ..." text.
			return `${deleteButtonId(row)} tree-node-title-${row.id}`;
		case "input-ref":
			// The input itself, not the cell around it - a referenced input contributes only its value, so the
			// hidden label of the TextField stays out of the name.
			return `${deleteButtonId(row)} ${nodeInputId(row)}`;
		default:
			return undefined;
	}
};

const actionColumn: BaseTreeTableColumnType<FileNode> = {
	label: "",
	verticalAlignment: "middle",
	horizontalAlignment: "center",
	pinning: "right",
	actionColumn: true,
	dataGetter: ({ row }): ReactElement => (
		<Button
			id={deleteButtonId(row)}
			destructive
			icon={<Icon>delete</Icon>}
			title={row.labelPattern === "title" ? `Delete ${row.data[0]}` : "Delete"}
			buttonAttributes={{ "aria-labelledby": labelledBy(row) }}
			onClick={(event): void => {
				event.stopPropagation();
			}}
		/>
	)
};

export const Accessibility: FC = () => {
	const [selectedNode, setSelectedNode] = useState<string | undefined>();
	const [collapsedNodes, setCollapsedNodes] = useState<{ [key: string]: boolean }>({});
	const [fileName, setFileName] = useState("2025-Q4.pdf");

	const columns: BaseTreeTableColumnType<FileNode>[] = useMemo(
		() => [
			{
				label: "Folder",
				horizontalAlignment: "left",
				verticalAlignment: "middle",
				hierarchical: true,
				width: 2,
				// The name of a row labelled via `input-ref` is rendered as an editable field instead of plain text.
				// Only leaf nodes may do so: the Tree Table repeats the cell of a parent node inside every child row
				// as hidden text, which would duplicate the input and its id.
				dataGetter: ({ row }): ReactNode =>
					row.labelPattern === "input-ref" ? (
						<TextField
							style={{ padding: 3 }}
							id={nodeInputId(row)}
							label="File name"
							hideLabel
							value={fileName}
							onChange={(event: ChangeEvent<HTMLInputElement>): void => setFileName(event.target.value)}
						/>
					) : (
						row.data[0]
					)
			},
			{ label: "Date modified", verticalAlignment: "middle" },
			{ label: "Size", horizontalAlignment: "right", verticalAlignment: "middle" },
			actionColumn
		],
		[fileName]
	);

	const rowEventHandlers: TreeTableRowEventHandlers<FileNode> = useCallback(
		({ row }) => ({
			onArrowClick(): void {
				setCollapsedNodes((currentCollapsedNodes) => ({
					...currentCollapsedNodes,
					[row.id]: !currentCollapsedNodes[row.id]
				}));
			},
			onClick(): void {
				setSelectedNode(row.id);
			}
		}),
		[]
	);

	const rowStyling: TreeTableRowStyling<FileNode> = useCallback(
		({ row }) => {
			const selected = row.id === selectedNode;

			return {
				collapsed: row.children ? !!collapsedNodes[row.id] : undefined,
				selected,
				title: selected ? "Selected" : "Selectable"
			};
		},
		[collapsedNodes, selectedNode]
	);

	return (
		<TreeTable<FileNode>
			root={root}
			columns={columns}
			rowStyling={rowStyling}
			rowEventHandlers={rowEventHandlers}
			id="accessibility-tree-table"
		/>
	);
};
