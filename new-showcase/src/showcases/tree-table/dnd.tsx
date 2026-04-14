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

import type { ReactNode, FC } from "react";
import { useState, useCallback } from "react";

import type {
	BaseTreeTableColumnType,
	TreeTableRowEventHandlers,
	TreeTableRowStyling
} from "@com.mgmtp.a12.widgets/widgets-core";
import { Range, TextOutput, TreeTable, provider } from "@com.mgmtp.a12.widgets/widgets-core";

import { getNodeById, Icons } from "./shared/data.js";
import type { FileNode } from "./shared/utils.js";
import { useDndTreeTable } from "./shared/utils.js";

const COLUMNS: BaseTreeTableColumnType<FileNode>[] = [
	{
		label: "Folder",
		horizontalAlignment: "left",
		hierarchical: true,
		pinning: !provider.isDesktop() ? undefined : "left",
		width: 2,
		dataGetter: ({ row }): ReactNode => <TextOutput>{row.data.name}</TextOutput>
	},
	{ label: "Type", dataGetter: ({ row }): ReactNode => row.data.otherCells[0] },
	{ label: "Date modified", dataGetter: ({ row }): ReactNode => row.data.otherCells[1] },
	{ label: "Size", dataGetter: ({ row }): ReactNode => row.data.otherCells[2] },
	{ label: "Owner", dataGetter: ({ row }): ReactNode => row.data.otherCells[3] },
	{ label: "Group", dataGetter: ({ row }): ReactNode => row.data.otherCells[4] }
];

function createTableData(type = "folder"): ReactNode[] {
	return Array.from(new Range(8)).map((colIndex) => {
		switch (colIndex) {
			case 0:
				return type;
			case 1:
				return "2021-11-11";
			case 2:
				return `${colIndex + 10024}KB`;
			case 3:
				return "Widgets";
			case 4:
				return "Widgets";
			default:
				return "mgm";
		}
	});
}

const TREE: FileNode = {
	id: "dnd-1",
	icon: Icons.COMPUTER,
	data: {
		type: "computer",
		name: "My Computer",
		otherCells: createTableData("computer")
	},
	children: [
		{
			id: "dnd-2",
			icon: Icons.DRIVE,
			data: {
				type: "drive",
				name: "C:",
				otherCells: createTableData("drive")
			},
			children: [
				{
					id: "dnd-3",
					icon: Icons.FOLDER,
					data: {
						type: "folder",
						name: "Programs",
						otherCells: createTableData()
					}
				},
				{
					id: "dnd-4",
					icon: Icons.FOLDER,
					data: {
						type: "folder",
						name: "Temp",
						otherCells: createTableData()
					}
				},
				{
					id: "dnd-5",
					icon: Icons.FOLDER,
					data: {
						type: "folder",
						name: "ZANS and quiet a long text, that it has to display multiline",
						otherCells: createTableData()
					},
					children: [
						{
							id: "dnd-6",
							icon: Icons.FOLDER,
							data: {
								type: "folder",
								name: "System32",
								otherCells: createTableData()
							},
							children: [
								{
									id: "dnd-7",
									icon: Icons.FILE,
									data: {
										type: "file",
										name: "sasser.dll",
										otherCells: createTableData("file")
									}
								}
							]
						}
					]
				},
				{
					id: "dnd-8",
					icon: Icons.FILE,
					data: {
						type: "file",
						name: "swap.sys",
						otherCells: createTableData("file")
					}
				},
				{
					id: "dnd-9",
					icon: Icons.FOLDER,
					data: {
						type: "folder",
						locked: true,
						name: "Locked",
						otherCells: createTableData()
					}
				}
			]
		},
		{
			id: "dnd-10",
			icon: Icons.DRIVE,
			data: {
				type: "drive",
				name: "D:",
				otherCells: createTableData("drive")
			}
		},
		{
			id: "dnd-11",
			icon: Icons.DRIVE,
			data: {
				type: "drive",
				name: "E:",
				otherCells: createTableData("drive")
			},
			children: [
				{
					id: "dnd-12",
					icon: Icons.FILE,
					data: {
						type: "file",
						name: "autostart.bat",
						otherCells: createTableData("file")
					}
				}
			]
		}
	]
};

export const DnDTreeTable: FC = () => {
	const [root, dndOptions] = useDndTreeTable(TREE);
	const [selectedNode, setSelectedNode] = useState<string | undefined>();
	const [collapsedNodes, setCollapsedNodes] = useState<{ [key: string]: boolean }>({});

	const rowEventHandlers: TreeTableRowEventHandlers = useCallback(({ row }) => {
		return {
			onArrowClick(): void {
				setCollapsedNodes((currentCollapsedNodes) => ({
					...currentCollapsedNodes,
					[row.id]: !currentCollapsedNodes[row.id]
				}));
			},
			onClick(): void {
				setSelectedNode(row.id);
			}
		};
	}, []);

	const rowStyling: TreeTableRowStyling = useCallback(
		({ row }) => {
			const node = getNodeById(row.id, root);
			const selected = row.id === selectedNode;

			return { collapsed: node?.children ? !!collapsedNodes[row.id] : undefined, selected };
		},
		[collapsedNodes, root, selectedNode]
	);

	return (
		<TreeTable<FileNode>
			root={root}
			columns={COLUMNS}
			rowEventHandlers={rowEventHandlers}
			rowStyling={rowStyling}
			dragDropOptions={dndOptions}
			id="dnd-tree-table"
		/>
	);
};
