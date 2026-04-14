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

import { loremIpsum } from "lorem-ipsum";
import type { ReactNode } from "react";

import type { BaseTreeTableColumnType } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Button,
	ButtonGroup,
	Checkbox,
	CssEllipsis,
	generateUid,
	Icon,
	noop,
	provider,
	Range,
	TextOutput
} from "@com.mgmtp.a12.widgets/widgets-core";

import { getCurrentTheme } from "../../../helpers/theme-selector.js";
import { fixedRandomNumber } from "../../../helpers/utils.js";

import { Icons } from "./data.js";
import type { FileNode } from "./utils.js";

export const createComplexColumns = (): BaseTreeTableColumnType<FileNode>[] => [
	{
		label: "",
		horizontalAlignment: "center",
		verticalAlignment: "middle",
		pinning: "left",
		width: 0.3,
		actionColumn: true,
		dataGetter: ({ row }): ReactNode => row.data.otherCells[0]
	},
	{
		label: "Folder",
		horizontalAlignment: "left",
		verticalAlignment: "middle",
		hierarchical: true,
		width: 2,
		dataGetter: ({ row }): ReactNode => row.data.name
	},
	{
		label: "Description",
		verticalAlignment: "middle",
		dataGetter: ({ row }): ReactNode => row.data.otherCells[1]
	},
	{
		label: "Date",
		horizontalAlignment: "right",
		verticalAlignment: "middle",
		dataGetter: ({ row }): ReactNode => row.data.otherCells[2]
	},
	{ label: "Owner", verticalAlignment: "middle", dataGetter: ({ row }): ReactNode => row.data.otherCells[3] },
	{ label: "Group", verticalAlignment: "middle", dataGetter: ({ row }): ReactNode => row.data.otherCells[4] },
	{
		label: "",
		verticalAlignment: "middle",
		horizontalAlignment: "right",
		pinning: !provider.isDesktop() ? undefined : "right",
		width: getCurrentTheme() === "flat" ? 1.1 : 1,
		dataGetter: ({ row }): ReactNode => row.data.otherCells[5]
	}
];

export function createComplexTableData(long?: boolean, option?: { nodeName: string }): ReactNode[] {
	const nodeName = option?.nodeName;

	return Array.from(new Range(6)).map((colIndex) => {
		switch (colIndex) {
			case 0:
				return <Checkbox label={`Select The ${nodeName ?? "Node"}`} hideLabel checked={false} onChange={noop} />;
			case 1:
				return (
					<CssEllipsis useTooltip maxLine={2}>
						{loremIpsum({ count: long ? 5 : 1, random: fixedRandomNumber() })}
					</CssEllipsis>
				);
			case 2:
				return <TextOutput alignment="right">2021-11-11</TextOutput>;
			case 3:
				return <TextOutput>Widgets</TextOutput>;
			case 4:
				return <TextOutput>Software Engineer</TextOutput>;
			default: {
				return (
					<>
						{long ? (
							<ButtonGroup>
								<Button title={`Remove ${nodeName ?? "Node"}`} icon={<Icon>remove_circle</Icon>} />
								<Button title={`Add ${nodeName ?? "Node"}`} icon={<Icon>add</Icon>} />
								<Button title={`Add ${nodeName ?? "Node"}`} icon={<Icon>link</Icon>} />
							</ButtonGroup>
						) : (
							<Button title={`Remove ${nodeName ?? "Node"}`} icon={<Icon>more_vert</Icon>} />
						)}
					</>
				);
			}
		}
	});
}

export const COMPLEX_TREE_TABLE_NODE_CREATOR: () => FileNode = () => ({
	id: generateUid(),
	icon: Icons.COMPUTER,
	data: {
		type: "computer",
		name: "My Computer",
		otherCells: createComplexTableData(false, { nodeName: "My Computer" })
	},
	children: [
		{
			id: generateUid(),
			icon: Icons.DRIVE,
			data: {
				type: "drive",
				name: "C:",
				otherCells: createComplexTableData(false, { nodeName: "C:" })
			},
			children: [
				{
					id: generateUid(),
					icon: Icons.FOLDER,
					data: {
						type: "folder",
						name: "Programs",
						otherCells: createComplexTableData(false, { nodeName: "Programs" })
					}
				},
				{
					id: generateUid(),
					icon: Icons.FOLDER,
					data: {
						type: "folder",
						name: (
							<TextOutput disableParagraphWrapping>
								<CssEllipsis useTooltip maxLine={2}>
									ZANS and quiet a long text, that it has to display multiline (TextOutput)
								</CssEllipsis>
							</TextOutput>
						),
						otherCells: createComplexTableData(false, {
							nodeName: "ZANS and quiet a long text, that it has to display multiline (TextOutput)"
						})
					},
					children: [
						{
							id: generateUid(),
							icon: Icons.FILE,
							data: {
								type: "file",
								name: "sasser.dll",
								otherCells: createComplexTableData(false, { nodeName: "sasser.dll" })
							}
						}
					]
				},
				...Array.from(new Range(3)).map(
					(index): FileNode => ({
						id: generateUid(),
						icon: Icons.FILE,
						data: {
							type: "file",
							name: `File ${index + 1}`,
							otherCells: createComplexTableData(index % 2 === 0, { nodeName: `File ${index + 1}` })
						}
					})
				),
				{
					id: generateUid(),
					icon: Icons.FILE,
					data: {
						type: "file",
						name: "swap.sys",
						otherCells: createComplexTableData(false, { nodeName: "swap.sys" })
					}
				},
				{
					id: generateUid(),
					icon: Icons.FOLDER,
					data: {
						type: "folder",
						name: "Locked",
						locked: true,
						otherCells: createComplexTableData(false, { nodeName: "Locked" })
					}
				}
			]
		},
		{
			id: generateUid(),
			icon: Icons.DRIVE,
			data: {
				type: "drive",
				name: "D:",
				otherCells: createComplexTableData(false, { nodeName: "D:" })
			}
		},
		{
			id: generateUid(),
			icon: Icons.DRIVE,
			data: {
				type: "drive",
				name: "E:",
				otherCells: createComplexTableData(false, { nodeName: "E:" })
			},
			children: [
				{
					id: "autostart.bat",
					icon: Icons.FILE,
					data: {
						type: "file",
						name: "autostart.bat",
						otherCells: createComplexTableData(false, { nodeName: "autostart.bat" })
					}
				},
				...Array.from(new Range(100)).map(
					(index): FileNode => ({
						id: generateUid(),
						icon: Icons.FILE,
						data: {
							type: "file",
							name: `File ${index + 1}`,
							otherCells: createComplexTableData(index > 5 && index < 20, { nodeName: `File ${index + 1}` })
						}
					})
				)
			]
		}
	]
});
