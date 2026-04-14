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

import type { ReactNode } from "react";
import { vi } from "vitest";

import { Range } from "../../common/main/utils.js";
import { Icon } from "../../icon/main/icon.view.js";

import type { BaseTreeTableColumnType, BaseTreeTableNode } from "../main/tree-table.api.js";

export interface FileNodeData {
	type: "computer" | "drive" | "folder" | "file";
	name: ReactNode;
	otherCells: ReactNode[];
	locked?: boolean;
}

export namespace Icons {
	export const COMPUTER = <Icon>computer</Icon>;
	export const DRIVE = <Icon>storage</Icon>;
	export const FOLDER = <Icon>folder</Icon>;
	export const FILE = <Icon>insert_drive_file</Icon>;
}

export type FileNode = BaseTreeTableNode<FileNodeData>;

export const createComplexColumns = (hasImg?: boolean): BaseTreeTableColumnType<FileNode>[] => [
	{
		label: "",
		horizontalAlignment: "center",
		verticalAlignment: "middle",
		pinning: "left",
		fixedWidth: hasImg,
		actionColumn: !hasImg,
		dataGetter: vi.fn()
	},
	{
		label: "",
		horizontalAlignment: "left",
		verticalAlignment: "middle",
		hierarchical: true,
		dataGetter: vi.fn()
	},
	{
		label: "",
		horizontalAlignment: "right",
		verticalAlignment: "middle",
		dataGetter: vi.fn()
	},
	{
		label: "",
		horizontalAlignment: "center",
		verticalAlignment: "middle",
		dataGetter: vi.fn()
	},
	{
		label: "",
		horizontalAlignment: "left",
		verticalAlignment: "middle",
		dataGetter: vi.fn()
	},
	{ label: "", horizontalAlignment: "right", verticalAlignment: "middle", dataGetter: vi.fn() },
	{
		label: "",
		verticalAlignment: "middle",
		horizontalAlignment: "right",
		pinning: "right",
		dataGetter: vi.fn()
	}
];

export function createComplexTableData(): ReactNode[] {
	return Array.from(new Range(6)).map(() => <div></div>);
}

export const COMPLEX_TREE_TABLE_NODE_CREATOR: () => FileNode = () => ({
	id: 1,
	icon: Icons.COMPUTER,
	data: {
		type: "computer",
		name: "",
		otherCells: createComplexTableData()
	},
	children: [
		{
			id: 2,
			icon: Icons.DRIVE,
			data: {
				type: "drive",
				name: "",
				otherCells: createComplexTableData()
			},
			children: [
				{
					id: 3,
					icon: Icons.FOLDER,
					data: {
						type: "folder",
						name: "",
						otherCells: createComplexTableData()
					}
				},
				{
					id: 4,
					icon: Icons.FOLDER,
					data: {
						type: "folder",
						name: "",
						otherCells: createComplexTableData()
					},
					children: [
						{
							id: 5,
							icon: Icons.FILE,
							data: {
								type: "file",
								name: "",
								otherCells: createComplexTableData()
							}
						}
					]
				},
				...Array.from(new Range(3)).map(
					(index): FileNode => ({
						id: 6 + index + 1,
						icon: Icons.FILE,
						data: {
							type: "file",
							name: "",
							otherCells: createComplexTableData()
						}
					})
				),
				{
					id: 10,
					icon: Icons.FILE,
					data: {
						type: "file",
						name: "",
						otherCells: createComplexTableData()
					}
				},
				{
					id: 11,
					icon: Icons.FOLDER,
					data: {
						type: "folder",
						name: "",
						locked: true,
						otherCells: createComplexTableData()
					}
				}
			]
		},
		{
			id: 12,
			icon: Icons.DRIVE,
			data: {
				type: "drive",
				name: "",
				otherCells: createComplexTableData()
			}
		},
		{
			id: 13,
			icon: Icons.DRIVE,
			data: {
				type: "drive",
				name: "",
				otherCells: createComplexTableData()
			},
			children: [
				{
					id: "autostart.bat",
					icon: Icons.FILE,
					data: {
						type: "file",
						name: "",
						otherCells: createComplexTableData()
					}
				},
				...Array.from(new Range(10)).map(
					(index): FileNode => ({
						id: 14 + index + 1,
						icon: Icons.FILE,
						data: {
							type: "file",
							name: "",
							otherCells: createComplexTableData()
						}
					})
				)
			]
		}
	]
});

export function createTableData(): ReactNode[] {
	return Array.from(new Range(8)).map((colIndex) => <div>{colIndex}</div>);
}

export const COLUMNS: BaseTreeTableColumnType[] = [
	{
		label: "",
		horizontalAlignment: "left",
		verticalAlignment: "top",
		hierarchical: true,
		pinning: "left"
	},
	{ label: "", verticalAlignment: "bottom", horizontalAlignment: "right", pinning: "right" },
	{ label: "", horizontalAlignment: "center", verticalAlignment: "middle", pinning: "left" },
	{ label: "", verticalAlignment: "top", horizontalAlignment: "left", pinning: "right" },
	{ label: "", verticalAlignment: "bottom", horizontalAlignment: "right", pinning: "left" },
	{ label: "", verticalAlignment: "middle", horizontalAlignment: "center", pinning: "right" }
];

export const TREE_TABLE_NODE: BaseTreeTableNode = {
	id: 1,
	icon: <Icon>computer</Icon>,
	data: ["My Computer", ...createTableData()],
	children: [
		{
			id: 2,
			icon: <Icon>drive</Icon>,
			data: ["C:", ...createTableData()],
			children: [
				{
					id: 3,
					icon: <Icon>folder</Icon>,
					data: ["Programs", ...createTableData()]
				},
				{
					id: 4,
					icon: <Icon>folder</Icon>,
					data: ["Temp", ...createTableData()]
				},
				{
					id: 5,
					icon: <Icon>folder</Icon>,
					data: [<div>ZANS and quiet a long text, that it has to display multiline (div)</div>, ...createTableData()],
					children: [
						{
							id: 6,
							icon: <Icon>folder</Icon>,
							data: ["System32", ...createTableData()],
							children: [
								{
									id: 7,
									icon: <Icon>folder</Icon>,
									data: ["sasser.dll", ...createTableData()]
								}
							]
						}
					]
				},
				{
					id: 8,
					icon: <Icon>folder</Icon>,
					data: ["swap.sys", ...createTableData()]
				},
				{
					id: 9,
					icon: <Icon>folder</Icon>,
					data: ["Locked", ...createTableData()]
				}
			]
		},
		{
			id: 10,
			icon: <Icon>folder</Icon>,
			data: ["D:", ...createTableData()]
		},
		{
			id: 11,
			icon: <Icon>folder</Icon>,
			data: ["E:", ...createTableData()],
			children: [
				{
					id: 12,
					icon: <Icon>folder</Icon>,
					data: ["autostart.bat", ...createTableData()]
				}
			]
		}
	]
};

export const GROUP_COLUMNS: BaseTreeTableColumnType[] = [
	{ label: "", horizontalAlignment: "left", hierarchical: true, pinning: "left", width: 2 },
	{ label: "", subColumns: [{ label: "" }, { label: "" }] },
	{ label: "" },
	{
		label: "",
		subColumns: [
			{ label: "" },
			{
				label: "",
				subColumns: [
					{
						label: ""
					},
					{ label: "" }
				]
			}
		]
	},
	{ label: "", pinning: "right" }
];
