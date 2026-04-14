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
import { Button, Range, provider, Icon, TextOutput } from "@com.mgmtp.a12.widgets/widgets-core";

export namespace Icons {
	export const COMPUTER = <Icon>computer</Icon>;
	export const DRIVE = <Icon>storage</Icon>;
	export const FOLDER = <Icon>folder</Icon>;
	export const FILE = <Icon>insert_drive_file</Icon>;
}

export function createTableData(nodeName?: string): ReactNode[] {
	return Array.from(new Range(8)).map((colIndex) => {
		switch (colIndex) {
			case 0:
				return <TextOutput>2021-11-11</TextOutput>;
			case 1:
				return <TextOutput alignment="right">10024KB</TextOutput>;
			case 2:
				return <TextOutput>Widgets</TextOutput>;
			case 3:
				return <TextOutput>Software Engineer</TextOutput>;
			case 4:
				return <TextOutput>2021-10-10</TextOutput>;
			case 5:
				return <Button destructive title={`Remove ${nodeName ?? "Node"}`} icon={<Icon>delete</Icon>} />;
			default:
				return <TextOutput>mgm</TextOutput>;
		}
	});
}

export const COLUMNS: BaseTreeTableColumnType[] = [
	{
		label: "Folder",
		horizontalAlignment: "left",
		verticalAlignment: "top",
		hierarchical: true,
		pinning: !provider.isDesktop() ? undefined : "left",
		width: 2
	},
	{ label: "Date modified", verticalAlignment: "top" },
	{ label: "Size", horizontalAlignment: "right", verticalAlignment: "top" },
	{ label: "Owner", verticalAlignment: "top" },
	{ label: "Group", verticalAlignment: "top" },
	{ label: "Date Added", verticalAlignment: "top" }
];

export const generateTreeTableNodes = (useNonInteractiveNode = false, tableName?: string): BaseTreeTableNode => {
	const makeId = (n: number): string | number => (tableName ? `${tableName}-${n}` : n);

	return {
		id: makeId(1),
		icon: Icons.COMPUTER,
		data: ["My Computer", ...createTableData("My Computer")],
		children: [
			{
				id: makeId(2),
				icon: Icons.DRIVE,
				data: ["C:", ...createTableData("C:")],
				children: [
					{
						id: makeId(3),
						icon: Icons.FOLDER,
						data: [
							useNonInteractiveNode ? "Non-interactive node" : "Programs",
							...createTableData(useNonInteractiveNode ? "Non-interactive node" : "Programs")
						]
					},
					{
						id: makeId(4),
						icon: Icons.FOLDER,
						data: ["Temp", ...createTableData("Temp")]
					},
					{
						id: makeId(5),
						icon: Icons.FOLDER,
						data: ["ZANS and quiet a long text, that it has to display multiline", ...createTableData("ZANS")],
						children: [
							{
								id: makeId(6),
								icon: Icons.FOLDER,
								data: ["System32", ...createTableData("System32")],
								children: [
									{
										id: makeId(7),
										icon: Icons.FILE,
										data: ["sasser.dll", ...createTableData("sasser.dll")]
									}
								]
							}
						]
					},
					{
						id: makeId(8),
						icon: Icons.FILE,
						data: ["swap.sys", ...createTableData("swap.sys")]
					},
					{
						id: makeId(9),
						icon: Icons.FOLDER,
						data: ["Locked", ...createTableData("Locked")]
					}
				]
			},
			{
				id: makeId(10),
				icon: Icons.DRIVE,
				data: ["D:", ...createTableData("D:")]
			},
			{
				id: makeId(11),
				icon: Icons.DRIVE,
				data: ["E:", ...createTableData("E:")],
				children: [
					{
						id: makeId(12),
						icon: Icons.FILE,
						data: ["autostart.bat", ...createTableData("autostart.bat")]
					}
				]
			}
		]
	};
};

export function getNodeById(id: string, node: BaseTreeTableNode): BaseTreeTableNode | undefined {
	if (node.id === id) {
		return node;
	}

	for (const child of node.children ?? []) {
		const childNode = getNodeById(id, child);

		if (childNode) {
			return childNode;
		}
	}

	return undefined;
}
