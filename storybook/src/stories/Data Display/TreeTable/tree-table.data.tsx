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

import type { BaseTreeTableColumnType, BaseTreeTableNode } from "@com.mgmtp.a12.widgets/widgets-core";
import { Icon, TextOutput } from "@com.mgmtp.a12.widgets/widgets-core";

export default {};
export const TREE_TABLE_ICONS = {
	COMPUTER: <Icon>computer</Icon>,
	DRIVE: <Icon>storage</Icon>,
	FOLDER: <Icon>folder</Icon>,
	FILE: <Icon>insert_drive_file</Icon>
};

export const COLUMNS: BaseTreeTableColumnType[] = [
	{ label: "Name", horizontalAlignment: "left", verticalAlignment: "top", hierarchical: true, width: 2 },
	{ label: "Modified", verticalAlignment: "top" },
	{ label: "Size", horizontalAlignment: "right", verticalAlignment: "top" },
	{ label: "Owner", verticalAlignment: "top" },
	{ label: "Type", verticalAlignment: "top" }
];

export function makeRow(name: string, modified: string, size: string, owner: string, type: string): ReactNode[] {
	return [
		<TextOutput key="name">{name}</TextOutput>,
		<TextOutput key="modified">{modified}</TextOutput>,
		<TextOutput key="size" alignment="right">
			{size}
		</TextOutput>,
		<TextOutput key="owner">{owner}</TextOutput>,
		<TextOutput key="type">{type}</TextOutput>
	];
}

export const ROOT: BaseTreeTableNode = {
	id: 1,
	icon: TREE_TABLE_ICONS.COMPUTER,
	data: makeRow("My Computer", "—", "—", "system", "Computer"),
	children: [
		{
			id: 2,
			icon: TREE_TABLE_ICONS.DRIVE,
			data: makeRow("C:", "2024-01-15", "500 GB", "admin", "Drive"),
			children: [
				{
					id: 3,
					icon: TREE_TABLE_ICONS.FOLDER,
					data: makeRow("Program Files", "2024-01-10", "12 GB", "admin", "Folder")
				},
				{
					id: 4,
					icon: TREE_TABLE_ICONS.FOLDER,
					data: makeRow("Windows", "2024-01-12", "30 GB", "system", "Folder"),
					children: [
						{
							id: 5,
							icon: TREE_TABLE_ICONS.FOLDER,
							data: makeRow("System32", "2024-01-08", "8 GB", "system", "Folder"),
							children: [
								{
									id: 6,
									icon: TREE_TABLE_ICONS.FILE,
									data: makeRow("sasser.dll", "2021-06-01", "124 KB", "system", "DLL")
								}
							]
						}
					]
				},
				{
					id: 7,
					icon: TREE_TABLE_ICONS.FILE,
					data: makeRow("pagefile.sys", "2024-01-15", "4 GB", "system", "System file")
				}
			]
		},
		{
			id: 8,
			icon: TREE_TABLE_ICONS.DRIVE,
			data: makeRow("D: (Data)", "2024-01-14", "1 TB", "user", "Drive")
		},
		{
			id: 9,
			icon: TREE_TABLE_ICONS.DRIVE,
			data: makeRow("E: (Recovery)", "2023-08-01", "16 GB", "system", "Drive"),
			children: [
				{
					id: 10,
					icon: TREE_TABLE_ICONS.FILE,
					data: makeRow("recovery.wim", "2023-08-01", "15 GB", "system", "Image")
				}
			]
		}
	]
};

export function getNodeById(id: number, node: BaseTreeTableNode): BaseTreeTableNode | undefined {
	if (node.id === id) {
		return node;
	}

	for (const child of node.children ?? []) {
		const found = getNodeById(id, child);

		if (found) {
			return found;
		}
	}

	return undefined;
}
